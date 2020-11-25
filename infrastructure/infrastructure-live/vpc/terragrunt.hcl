terraform {
  source = "../../infrastructure-modules/simple-vpc"
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
  cidr_block = "10.0.0.0/16"
  public_subnet_cidr_blocks = [
    "10.0.0.0/24",
    "10.0.1.0/24"
  ]
  availability_zones_names = [
    "us-east-1a",
    "us-east-1b"
  ]
  private_subnet_cidr_block = "10.0.2.0/24"
  key_name = "lock-the-lock"
  bastion_instance_ami = "ami-04bf6dcdc9ab498ca" # Amazon Linux 2
}
