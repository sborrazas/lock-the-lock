variable "aws_region" {
  description = "The AWS region in which all resources will be created"
  type = string
}

variable "terraform_state_s3_bucket" {
  description = "The name of the S3 bucket used to store Terraform remote state"
  type        = string
}

variable "domain" {
  description = "The main domain of the app already created in Route53"
  type = string
}

variable "subdomain" {
  description = "The subdomain to be created"
  type = string
}
