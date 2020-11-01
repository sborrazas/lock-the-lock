variable "aws_region" {
  description = "The AWS region in which all resources will be created"
  type = string
}

variable "name" {
  description = "VPC name"
  type = string
}

variable "cidr_block" {
  description = "The CIDR block for the VPC"
  type = string
}

variable "public_subnet_cidr_blocks" {
  description = "Public CIDR blocks for the VPC (at least 2)"
  type = list(string)
}

variable "private_subnet_cidr_block" {
  description = "The private CIDR block for the VPC"
  type = string
}
