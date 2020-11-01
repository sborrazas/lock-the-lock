terraform {
  source = "../../infrastructure-modules/https-cert"
}

# Include all the settings from the root terragrunt.hcl file
include {
  path = find_in_parent_folders()
}

locals {
  app_vars = yamldecode(file(find_in_parent_folders("vars.yml")))
}

inputs = {
  name = local.app_vars.app_name
}
