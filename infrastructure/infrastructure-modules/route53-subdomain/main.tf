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

data "terraform_remote_state" "alb" {
  backend = "s3"
  config = {
    region = var.aws_region
    bucket = var.terraform_state_s3_bucket
    key = "alb/terraform.tfstate"
  }
}

data "aws_route53_zone" "root_domain" {
  name = var.domain
}

resource "aws_route53_record" "subdomain" {
  zone_id = data.aws_route53_zone.root_domain.zone_id
  name = var.subdomain
  type = "A"

  alias {
    name = data.terraform_remote_state.alb.outputs.dns_name
    zone_id = data.terraform_remote_state.alb.outputs.zone_id
    evaluate_target_health = true
  }
}
