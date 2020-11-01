provider "aws" {
  # The AWS region in which all resources will be created
  region = var.aws_region

  # Provider version 2.X series is the latest, but has breaking changes with 1.X series.
  version = "~> 2.6"
}

terraform {
  # The configuration for this backend will be filled in by Terragrunt
  backend "s3" {}

  # Only allow this Terraform version. Note that if you upgrade to a newer version, Terraform won't allow you to use an
  # older version, so when you upgrade, you should upgrade everyone on your team and your CI servers all at once.
  required_version = ">= 0.12"
}

################################################################################
# AWS ECS Task and Execution Roles
################################################################################

# Define the Assume Role IAM Policy Document for the ECS Service Scheduler IAM Role
data "aws_iam_policy_document" "ecs_task" {
  statement {
    effect  = "Allow"
    actions = ["sts:AssumeRole"]

    principals {
      type = "Service"
      identifiers = ["ecs-tasks.amazonaws.com"]
    }
  }
}

# Create the ECS Task IAM Role
resource "aws_iam_role" "ecs_task" {
  name = "${var.name}-task"
  assume_role_policy = data.aws_iam_policy_document.ecs_task.json

  # IAM objects take time to propagate. This leads to subtle eventual
  # consistency bugs where the ECS task cannot be created because the IAM role
  # does not exist. We add a 15 second wait here to give the IAM role a chance
  # to propagate within AWS.
  provisioner "local-exec" {
    command = "echo 'Sleeping for 15 seconds to wait for IAM role to be created'; sleep 15"
  }
}

# CREATE AN IAM POLICY AND EXECUTION ROLE TO ALLOW ECS TASK TO MAKE CLOUDWATCH
# REQUESTS AND PULL IMAGES FROM ECR
data "aws_iam_policy_document" "ecs_task_execution_policy_document" {
  statement {
    effect = "Allow"

    actions = [
      "ecr:GetAuthorizationToken",
      "ecr:BatchCheckLayerAvailability",
      "ecr:GetDownloadUrlForLayer",
      "ecr:BatchGetImage",
      "logs:CreateLogStream",
      "logs:CreateLogGroup",
      "logs:PutLogEvents",
    ]

    resources = ["*"]
  }
}

resource "aws_iam_role" "ecs_task_execution_role" {
  name = "${var.name}-task-execution-role"
  assume_role_policy = data.aws_iam_policy_document.ecs_task.json

  # IAM objects take time to propagate. This leads to subtle eventual
  # consistency bugs where the ECS task cannot be created because the IAM role
  # does not exist. We add a 15 second wait here to give the IAM role a chance
  # to propagate within AWS.
  provisioner "local-exec" {
    command = "echo 'Sleeping for 15 seconds to wait for IAM role to be created'; sleep 15"
  }
}

resource "aws_iam_policy" "ecs_task_execution_policy" {
  name = "${var.name}-task-excution-policy"
  policy = data.aws_iam_policy_document.ecs_task_execution_policy_document.json
}

resource "aws_iam_policy_attachment" "task_execution_policy_attachment" {
  name = "${var.name}-task-execution"
  policy_arn = aws_iam_policy.ecs_task_execution_policy.arn
  roles = [aws_iam_role.ecs_task_execution_role.name]
}

################################################################################
# AWS ECS Role
################################################################################

data "terraform_remote_state" "kms_master_key" {
  backend = "s3"
  config = {
    region = var.aws_region
    bucket = var.terraform_state_s3_bucket
    key = "master-key/terraform.tfstate"
  }
}

data "aws_iam_policy_document" "ecs_service_role" {
  statement {
    effect = "Allow"
    actions = ["sts:AssumeRole"]

    principals {
      type = "Service"
      identifiers = ["ecs.amazonaws.com"]
    }
  }
}

# Role that can access the master KMS key
resource "aws_iam_role" "ecs_service_role" {
  name = "${var.name}-ECSRole"
  assume_role_policy = data.aws_iam_policy_document.ecs_service_role.json

  # IAM objects take time to propagate. This leads to subtle eventual consistency bugs where the ECS service cannot be
  # created because the IAM role does not exist. We add a 15 second wait here to give the IAM role a chance to propagate
  # within AWS.
  provisioner "local-exec" {
    command = "echo 'Sleeping for 15 seconds to wait for IAM role to be created'; sleep 15"
  }
}

# Create an IAM Policy for acessing the KMS Master Key
data "aws_iam_policy_document" "access_kms_master_key" {
  statement {
    effect = "Allow"
    actions = ["kms:Decrypt"]
    resources = [data.terraform_remote_state.kms_master_key.outputs.key_arn]
  }
}

# Give this ECS Service access to the KMS Master Key so it can use it to decrypt secrets in config files.
resource "aws_iam_role_policy" "access_kms_master_key" {
  name = "access-kms-master-key"
  role = aws_iam_role.ecs_service_role.name
  policy = data.aws_iam_policy_document.access_kms_master_key.json
}

################################################################################
# AWS ECS Cluster + Service
################################################################################

# data "terraform_remote_state" "vpc" {
#   backend = "s3"
#   config = {
#     region = var.aws_region
#     bucket = var.terraform_state_s3_bucket
#     key = "vpc/terraform.tfstate"
#   }
# }

# data "terraform_remote_state" "repository" {
#   backend = "s3"
#   config = {
#     region = var.aws_region
#     bucket = var.terraform_state_s3_bucket
#     key = "docker-repo/terraform.tfstate"
#   }
# }

data "terraform_remote_state" "alb" {
  backend = "s3"
  config = {
    region = var.aws_region
    bucket = var.terraform_state_s3_bucket
    key = "alb/terraform.tfstate"
  }
}

resource "aws_ecs_cluster" "cluster" {
  name = "${var.name}-cluster"
}

resource "aws_ecs_task_definition" "task" {
  family = "${var.name}-Service"
  container_definitions = templatefile("task-definitions/service.json", {
    container_name = var.name

    image = var.image
    version = var.image_version
    cpu = var.cpu
    memory = var.memory
    port_mappings = [var.container_port]
    env_vars = var.env_vars
   })
  task_role_arn = aws_iam_role.ecs_task.arn
  execution_role_arn = aws_iam_role.ecs_task_execution_role.arn
  network_mode = "bridge"

  tags = {
    Name = "${var.name}-TaskDefinition"
  }
}

# TODO:
# Create a dedicated ECS Task specially for our canaries
# resource "aws_ecs_task_definition" "task_canary" {
#   # This count parameter ensures we only create this resource if the user has requested at least one canary ECS Task to run.
#   count = local.has_canary ? 1 : 0

#   family                = var.service_name
#   container_definitions = var.ecs_task_definition_canary
#   task_role_arn         = aws_iam_role.ecs_task.arn
#   network_mode          = var.ecs_task_definition_network_mode

#   tags = var.task_definition_tags

#   # This is a workaround for a an issue where AWS will reject updates made to the same task family that occur too closely together. By depending on the aws_ecs_task_definition.task resource, we effectively wait to create the canary task until the primary task has been successfully created.
#   depends_on = [aws_ecs_task_definition.task]
# }







resource "aws_ecs_service" "app" {
  name = "${var.name}-service"
  cluster = aws_ecs_cluster.cluster.arn
  desired_count = 2
  iam_role = aws_iam_role.ecs_service_role.arn

  # "binpack" strategy picks the EC2 instance to deploy the task to so as to
  # leave the least amount of unused CPU. This strategy minimizes the number of
  # container instances in use
  ordered_placement_strategy {
    type = "binpack"
    field = "cpu"
  }

  load_balancer {
    target_group_arn = data.terraform_remote_state.alb.outputs.http_target_group_arn
    container_name = var.name
    container_port = var.container_port
  }
}
