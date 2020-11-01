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
  cpu = 100
  memory = 512
  container_port = 3000
  env_vars = {
    A = 1
  }
}
