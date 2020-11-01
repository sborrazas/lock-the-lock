terraform {
  source = "../../infrastructure-modules/route53-subdomain"
}

# Include all the settings from the root terragrunt.hcl file
include {
  path = find_in_parent_folders()
}

dependencies {
  paths = [
    "../alb"
  ]
}

inputs = {}
