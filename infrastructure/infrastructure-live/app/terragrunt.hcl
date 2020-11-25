terraform {
  source = "../../infrastructure-modules/ecs-app"
}

# Include all the settings from the root terragrunt.hcl file
include {
  path = find_in_parent_folders()
}

dependencies {
  paths = [
    "../vpc",
    "../alb",
    "../docker-repo",
    "../master-key"
  ]
}

locals {
  app_vars = yamldecode(file(find_in_parent_folders("vars.yml")))
}

inputs = {
  name = local.app_vars.app_name
  cpu = 256
  memory = 128
  container_port = 3000
  ec2_instance_type = "t2.micro"
  ec2_ami_id = "ami-09bee01cc997a78a6" # Amazon Linux 2 ECS Optimized image
  ec2_cluster_min_size = 1
  ec2_cluster_max_size = 2
  min_number_of_tasks = 1
  max_number_of_tasks = 2
  key_name = "lock-the-lock"
  env_vars = {
    APP_HOST = local.app_vars.subdomain
    APP_PORT = 3000
    AWS_DEFAULT_REGION = local.app_vars.aws_region
  }
}
