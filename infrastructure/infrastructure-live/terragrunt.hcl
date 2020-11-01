locals {
  app_vars = yamldecode(file("../vars.yml"))
}

inputs = local.app_vars

remote_state {
  backend = "s3"
  config = {
    bucket = "${local.app_vars.terraform_state_s3_bucket}"
    key = "${path_relative_to_include()}/terraform.tfstate"
    region = "${local.app_vars.aws_region}"
  }
}
