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

variable "ec2_ami_id" {
  description = "The AMI of the instances to mount docker on"
  type = string
}

variable "ec2_instance_type" {
  description = "The EC2 instance type to mount the docker containers on"
  type = string
}

variable "ec2_cluster_min_size" {
  description = "The min number of EC2 instances running"
  type = string
}

variable "ec2_cluster_max_size" {
  description = "The max number of EC2 instances running"
  type = string
}
variable "min_number_of_tasks" {
  description = "The minimum number of ECS Task instances of the ECS Service to run. Auto scaling will never scale in below this number."
  type = number
}

variable "max_number_of_tasks" {
  description = "The maximum number of ECS Task instances of the ECS Service to run. Auto scaling will never scale out above this number."
  type = number
  default = null
}

variable "key_name" {
  description = "The EC2 Keypair name used to SSH into the ECS Cluster's EC2 Instances."
  type = string
}
