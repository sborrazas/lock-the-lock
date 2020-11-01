terraform {
  source = "../../infrastructure-modules/kms-key"
}

# Include all the settings from the root terragrunt.hcl file
include {
  path = find_in_parent_folders()
}

locals {
  app_vars = yamldecode(file(find_in_parent_folders("vars.yml")))
}

inputs = {
  name = "cmk-${local.app_vars.app_name}"
  cmk_administrator_iam_arn = local.app_vars.administrator_arn
  cmk_user_iam_arn = local.app_vars.administrator_arn
}
