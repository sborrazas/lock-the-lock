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

data "terraform_remote_state" "vpc" {
  backend = "s3"
  config = {
    region = var.aws_region
    bucket = var.terraform_state_s3_bucket
    key = "vpc/terraform.tfstate"
  }
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

data "aws_iam_policy_document" "ecs_task_policy_document" {
  statement {
    effect = "Allow"
    actions = ["kms:Decrypt"]
    resources = [data.terraform_remote_state.kms_master_key.outputs.key_arn]
  }
}

resource "aws_iam_policy" "ecs_task_policy" {
  name = "${var.name}-task-policy"
  policy = data.aws_iam_policy_document.ecs_task_policy_document.json
}

resource "aws_iam_policy_attachment" "task_policy_attachment" {
  name = "${var.name}-task"
  policy_arn = aws_iam_policy.ecs_task_policy.arn
  roles = [aws_iam_role.ecs_task.name]
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
# data "aws_iam_policy_document" "access_kms_master_key" {
#   statement {
#     effect = "Allow"
#     actions = ["kms:Decrypt"]
#     resources = [data.terraform_remote_state.kms_master_key.outputs.key_arn]
#   }
# }

# Give this ECS Service access to the KMS Master Key so it can use it to decrypt secrets in config files.
# resource "aws_iam_role_policy" "access_kms_master_key" {
#   name = "access-kms-master-key"
#   role = aws_iam_role.ecs_service_role.name
#   policy = data.aws_iam_policy_document.access_kms_master_key.json
# }

# CREATE AN IAM POLICY THAT ALLOWS THE SERVICE TO TALK TO THE ELB
resource "aws_iam_role_policy" "ecs_service_policy" {
  name = "${var.name}-ecs-service-policy"
  role = aws_iam_role.ecs_service_role.id
  policy = data.aws_iam_policy_document.ecs_service_policy.json

  # IAM objects take time to propagate. This leads to subtle eventual consistency bugs where the ECS task cannot be
  # created because the IAM role does not exist. We add a 15 second wait here to give the IAM role a chance to propagate
  # within AWS.
  provisioner "local-exec" {
    command = "echo 'Sleeping for 15 seconds to wait for IAM role to be created'; sleep 15"
  }
}

data "aws_iam_policy_document" "ecs_service_policy" {
  statement {
    effect = "Allow"

    actions = [
      "ec2:Describe*",
      "ec2:AuthorizeSecurityGroupIngress",
      "elasticloadbalancing:Describe*",
      "elasticloadbalancing:DeregisterInstancesFromLoadBalancer",
      "elasticloadbalancing:RegisterInstancesWithLoadBalancer",
      "elasticloadbalancing:DeregisterTargets",
      "elasticloadbalancing:RegisterTargets"
    ]

    resources = ["*"]
  }
}

################################################################################
# AWS Instance Role
################################################################################

resource "aws_iam_role" "ecs_instance" {
  name = "${var.name}-instance"
  assume_role_policy = data.aws_iam_policy_document.ecs_role.json

  # IAM objects take time to propagate. This leads to subtle eventual
  # consistency bugs where the ECS cluster cannot be created because the IAM
  # role does not exist. We add a 15 second wait here to give the IAM role a
  # chance to propagate within AWS.
  provisioner "local-exec" {
    command = "echo 'Sleeping for 15 seconds to wait for IAM role to be created'; sleep 15"
  }
}

data "aws_iam_policy_document" "ecs_role" {
  statement {
    effect = "Allow"
    actions = ["sts:AssumeRole"]

    principals {
      type = "Service"
      identifiers = ["ec2.amazonaws.com"]
    }
  }
}

# IAM policy we add to our EC2 Instance Role that allows an ECS Agent
# running on the EC2 Instance to communicate with an ECS cluster.
resource "aws_iam_role_policy" "ecs" {
  name = "${var.name}-ecs-permissions"
  role = aws_iam_role.ecs_instance.id
  policy = data.aws_iam_policy_document.ecs_permissions.json
}

data "aws_iam_policy_document" "ecs_permissions" {
  statement {
    effect = "Allow"

    actions = [
      "ecs:CreateCluster",
      "ecs:DeregisterContainerInstance",
      "ecs:DiscoverPollEndpoint",
      "ecs:Poll",
      "ecs:RegisterContainerInstance",
      "ecs:StartTelemetrySession",
      "ecs:Submit*",
      "ecs:UpdateContainerInstancesState",
    ]

    resources = ["*"]
  }
}

# IAM policy we add to our EC2 Instance Role that allows ECS Instances to pull all containers from Amazon EC2 Container
# Registry.
resource "aws_iam_role_policy" "ecr" {
  name = "${var.name}-docker-login-for-ecr"
  role = aws_iam_role.ecs_instance.id
  policy = data.aws_iam_policy_document.ecr_permissions.json
}

data "aws_iam_policy_document" "ecr_permissions" {
  statement {
    effect = "Allow"

    actions = [
      "ecr:BatchCheckLayerAvailability",
      "ecr:BatchGetImage",
      "ecr:DescribeRepositories",
      "ecr:GetAuthorizationToken",
      "ecr:GetDownloadUrlForLayer",
      "ecr:GetRepositoryPolicy",
      "ecr:ListImages",
    ]

    resources = ["*"]
  }
}

################################################################################
# AWS Auto-Scaling Target
################################################################################

# Create an IAM Role to be used by the Amazon Autoscaling Service on the ECS Service
# For details, see: http://docs.aws.amazon.com/AmazonECS/latest/developerguide/autoscale_IAM_role.html
resource "aws_iam_role" "ecs_service_autoscaling_role" {
  name = "${var.name}-autoscaling"
  assume_role_policy = data.aws_iam_policy_document.ecs_service_autoscaling_role.json

  # IAM objects take time to propagate. This leads to subtle eventual
  # consistency bugs where the ECS service cannot be created because the IAM
  # role does not exist. We add a 15 second wait here to give the IAM role a
  # chance to propagate within AWS.
  provisioner "local-exec" {
    command = "echo 'Sleeping for 15 seconds to wait for IAM role to be created'; sleep 15"
  }
}

# Create the Trust Policy as documented at
# http://docs.aws.amazon.com/AmazonECS/latest/developerguide/autoscale_IAM_role.html
data "aws_iam_policy_document" "ecs_service_autoscaling_role" {
  statement {
    effect = "Allow"
    actions = ["sts:AssumeRole"]

    principals {
      type = "Service"
      identifiers = ["application-autoscaling.amazonaws.com"]
    }
  }
}

# Create an IAM Policy that allows the ECS Service to perform Auto Scaling actions
# For details, see: http://docs.aws.amazon.com/AmazonECS/latest/developerguide/autoscale_IAM_role.html
resource "aws_iam_role_policy" "ecs_service_autoscaling_policy" {
  name = "${var.name}-ecs-service-autoscaling-policy"
  role = aws_iam_role.ecs_service_autoscaling_role.id
  policy = data.aws_iam_policy_document.ecs_service_autoscaling_policy.json
}

# Create the IAM Policy document that grants permissions to perform Auto Scaling actions
data "aws_iam_policy_document" "ecs_service_autoscaling_policy" {
  statement {
    effect = "Allow"

    actions = [
      "ecs:DescribeServices",
      "ecs:UpdateService",
    ]

    resources = ["*"]
  }

  statement {
    effect = "Allow"

    actions = [
      "cloudwatch:DescribeAlarms",
    ]

    resources = ["*"]
  }
}

locals {
  # Use a RegEx
  # (https://www.terraform.io/docs/configuration/interpolation.html#replace_string_search_replace_)
  # that takes a value like "arn:aws:iam::123456789012:role/S3Access" and looks
  # for the string after the last "/".

  ecs_cluster_name = replace(aws_ecs_cluster.cluster.arn, "/.*/+(.*)/", "$1")
}

# Create an App AutoScaling Target that allows us to add AutoScaling Policies to our ECS Service
resource "aws_appautoscaling_target" "appautoscaling_target" {
  scalable_dimension = "ecs:service:DesiredCount"
  service_namespace = "ecs"

  # Last part has to match the service name "${var.name}-service" defined below
  resource_id = "service/${local.ecs_cluster_name}/${var.name}-service"
  role_arn = aws_iam_role.ecs_service_autoscaling_role.arn

  min_capacity = var.min_number_of_tasks
  max_capacity = var.max_number_of_tasks

  depends_on = [
    aws_ecs_service.app
  ]
}

################################################################################
# AWS Capacity provider
################################################################################

resource "aws_security_group" "ecs" {
  name = var.name
  description = "For EC2 Instances in the ${var.name} ECS Cluster."
  vpc_id = data.terraform_remote_state.vpc.outputs.vpc_id
}

# Allow all outbound traffic from the ECS Cluster
resource "aws_security_group_rule" "allow_outbound_all" {
  type = "egress"
  from_port = 0
  to_port = 65535
  protocol = "-1"
  cidr_blocks = ["0.0.0.0/0"]
  security_group_id = aws_security_group.ecs.id
}

# Allow inbound SSH traffic
resource "aws_security_group_rule" "allow_inbound_ssh_from_security_group" {
  type = "ingress"
  from_port = 22
  to_port = 22
  protocol = "tcp"
  cidr_blocks = ["0.0.0.0/0"]
  security_group_id = aws_security_group.ecs.id
}

# Allow inbound access from any ALBs that will send traffic to this ECS Cluster.
# We assume that the ALB will only send traffic to Docker containers that expose
# a port within the "ephemeral" port range. Per https://goo.gl/uLs9NY under
# "portMappings"/"hostPort", the ephemeral port range used by Docker will range
# from 32768 - 65535. It gives us pause to open such a wide port range, but
# dynamic Docker ports don't come without their costs!
resource "aws_security_group_rule" "allow_inbound_from_alb" {
  type = "ingress"
  from_port = 32768
  to_port = 65535
  protocol = "tcp"
  source_security_group_id = data.terraform_remote_state.alb.outputs.security_group_id
  security_group_id = aws_security_group.ecs.id
}

# To assign an IAM Role to an EC2 instance, we need to create the intermediate concept of an "IAM Instance Profile".
resource "aws_iam_instance_profile" "ecs" {
  name = "${var.name}-cluster"
  role = aws_iam_role.ecs_instance.name
}

resource "aws_launch_configuration" "ecs" {
  name_prefix  = "${var.name}-"
  image_id  = var.ec2_ami_id
  instance_type  = var.ec2_instance_type
  security_groups = [aws_security_group.ecs.id]
  key_name = var.key_name

  user_data = templatefile("user-data/user-data.sh", {
    cluster_name = "${var.name}-cluster" # Has to match cluster name
  })
  iam_instance_profile = aws_iam_instance_profile.ecs.name

  root_block_device {
    volume_size = 40 # GB
    volume_type = "gp2"
  }

  lifecycle {
    create_before_destroy = true
  }
}

resource "aws_ecs_capacity_provider" "capacity_provider" {
  name  = "capacity-${var.name}"

  auto_scaling_group_provider {
    auto_scaling_group_arn = aws_autoscaling_group.ecs_asg.arn
    managed_termination_protection = "DISABLED"

    managed_scaling {
      status = "ENABLED"
    }
  }
}

################################################################################
# AWS ECS Cluster + Service
################################################################################

data "terraform_remote_state" "repository" {
  backend = "s3"
  config = {
    region = var.aws_region
    bucket = var.terraform_state_s3_bucket
    key = "docker-repo/terraform.tfstate"
  }
}

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
  capacity_providers = [aws_ecs_capacity_provider.capacity_provider.name]

  default_capacity_provider_strategy {
    capacity_provider = aws_ecs_capacity_provider.capacity_provider.name
  }
}

resource "aws_ecs_task_definition" "task" {
  family = "${var.name}-task"
  container_definitions = templatefile("task-definitions/service.json", {
    container_name = var.name

    image = data.terraform_remote_state.repository.outputs.url
    version = var.image_version
    cpu = var.cpu
    memory = var.memory
    port_mappings = [var.container_port]
    env_vars = var.env_vars
   })
  task_role_arn = aws_iam_role.ecs_task.arn
  execution_role_arn = aws_iam_role.ecs_task_execution_role.arn
  network_mode = "bridge"
  requires_compatibilities = []

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
  task_definition = aws_ecs_task_definition.task.arn
  launch_type = "EC2"

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
