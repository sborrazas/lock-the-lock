variable "aws_region" {
  description = "The AWS region in which all resources will be created"
  type = string
}

variable "domain" {
  description = "The main domain of the app already created in Route53"
  type = string
}

variable "name" {
  description = "The name of the HTTP Cert"
  type = string
}
