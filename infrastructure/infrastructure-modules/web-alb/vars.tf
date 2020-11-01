variable "aws_region" {
  description = "The AWS region in which all resources will be created"
  type = string
}

variable "terraform_state_s3_bucket" {
  description = "The name of the S3 bucket used to store Terraform remote state"
  type        = string
}

variable "name" {
  description = "The name of the ALB"
  type = string
}

variable "subdomain" {
  description = "The subdomain to load balance"
  type = string
}
