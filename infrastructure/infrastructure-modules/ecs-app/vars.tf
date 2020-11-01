variable "aws_region" {
  description = "The AWS region in which all resources will be created"
  type = string
}

variable "terraform_state_s3_bucket" {
  description = "The name of the S3 bucket used to store Terraform remote state"
  type        = string
}

variable "name" {
  description = "ECS Cluster and Service name"
  type = string
}

variable "env_vars" {
  description = "A map of environment variable name to environment variable value that should be made available to the Docker container."
  type        = map(string)
  default     = {}
}

variable "image" {
  description = "The Docker image to run"
  type = string
}

variable "image_version" {
  description = "Which version (AKA tag) of the var.image Docker image to deploy (e.g. 0.57)"
  type = string
}

variable "cpu" {
  description = "The CPU this image needs to run properly"
  type = number
}

variable "memory" {
  description = "The memory (in MB) this image needs to run properly"
  type = number
}

variable "container_port" {
  description = "The container exposed port"
  type = number
}
