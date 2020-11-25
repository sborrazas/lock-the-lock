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

variable "key_name" {
  description = "The EC2 Keypair name used to SSH into the ECS Cluster's EC2 Instances."
  type = string
}

variable "bastion_instance_ami" {
  description = "The AWS AMI Id"
  type = string
}

variable "availability_zones_names" {
  description = "The AZ's that the app is going to support (greater than 1)"
  type = list(string)
}
