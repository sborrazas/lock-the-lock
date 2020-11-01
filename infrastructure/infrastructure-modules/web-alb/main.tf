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

data "terraform_remote_state" "vpc" {
  backend = "s3"
  config = {
    region = var.aws_region
    bucket = var.terraform_state_s3_bucket
    key = "vpc/terraform.tfstate"
  }
}

data "terraform_remote_state" "cert" {
  backend = "s3"
  config = {
    region = var.aws_region
    bucket = var.terraform_state_s3_bucket
    key = "cert/terraform.tfstate"
  }
}

# LB Security group
resource "aws_security_group" "lb_sg" {
  name = "${var.name}-lb-sg"
  vpc_id = data.terraform_remote_state.vpc.outputs.vpc_id
}

resource "aws_security_group_rule" "https_sg_rule" {
  type = "ingress"
  from_port = 433
  to_port = 433
  protocol = "tcp"
  cidr_blocks = ["0.0.0.0/0"]
  security_group_id = aws_security_group.lb_sg.id
}

resource "aws_security_group_rule" "outbound_sg_rule" {
  type = "egress"
  from_port = 0
  to_port = 0
  protocol = "-1"
  cidr_blocks = ["0.0.0.0/0"]
  security_group_id = aws_security_group.lb_sg.id
}

# LB
resource "aws_lb" "lb" {
  name = var.name
  internal = false
  load_balancer_type = "application"
  security_groups = [aws_security_group.lb_sg.id]
  subnets = data.terraform_remote_state.vpc.outputs.public_subnet_ids
}

# Listener that routes incoming requests to the target group instances
resource "aws_lb_listener" "lb_listener_web" {
  load_balancer_arn = aws_lb.lb.arn
  port = "443"
  protocol = "HTTPS"
  ssl_policy = "ELBSecurityPolicy-2016-08"
  certificate_arn = data.terraform_remote_state.cert.outputs.cert_arn

  default_action {
    type = "forward"
    target_group_arn = aws_lb_target_group.http_tg.arn
  }
}

# Listener that redirects from HTTP to HTTPS
resource "aws_lb_listener" "lb_listener_redirect_to_https" {
  load_balancer_arn = aws_lb.lb.arn
  port = "80"
  protocol = "HTTP"

  default_action {
    type = "redirect"
    redirect {
      port = "443"
      protocol = "HTTPS"
      status_code = "HTTP_301"
    }
  }
}

# Target group that the previous listener routes requests to
resource "aws_lb_target_group" "http_tg" {
  name = "${var.name}-tg"
  port = 80
  protocol = "HTTP"
  vpc_id = data.terraform_remote_state.vpc.outputs.vpc_id
}
