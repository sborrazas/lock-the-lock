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

data "aws_route53_zone" "root_domain" {
  name = var.domain
  private_zone = false
}

resource "aws_acm_certificate" "https_cert" {
  domain_name = "*.${var.domain}"
  validation_method = "DNS"

  tags = {
    Name = "${var.name}-HTTPSCert"
  }
}

resource "aws_route53_record" "certificate_records" {
  for_each = {
    for dvo in aws_acm_certificate.https_cert.domain_validation_options : dvo.domain_name => {
      name = dvo.resource_record_name
      record = dvo.resource_record_value
      type = dvo.resource_record_type
    }
  }

  allow_overwrite = true
  name = each.value.name
  records = [each.value.record]
  ttl = 60
  type = each.value.type
  zone_id = data.aws_route53_zone.root_domain.zone_id
}

resource "aws_acm_certificate_validation" "cert_validation" {
  certificate_arn = aws_acm_certificate.https_cert.arn
  validation_record_fqdns = [for record in aws_route53_record.certificate_records : record.fqdn]
}
