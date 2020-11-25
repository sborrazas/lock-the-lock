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

resource "aws_vpc" "main" {
  cidr_block = var.cidr_block

  tags = {
    Name = "${var.name}-vpc"
  }
}

resource "aws_subnet" "public" {
  count = length(var.public_subnet_cidr_blocks)

  vpc_id = aws_vpc.main.id
  cidr_block = element(var.public_subnet_cidr_blocks, count.index)
  availability_zone = var.availability_zones_names[count.index]

  tags = {
    Name = "${var.name}-public-${count.index}"
  }
}

resource "aws_subnet" "private" {
  vpc_id = aws_vpc.main.id
  cidr_block = var.private_subnet_cidr_block

  tags = {
    Name = "${var.name}-private"
  }
}

## Internet Gateway to access the outside world
resource "aws_internet_gateway" "gw" {
  vpc_id = aws_vpc.main.id
  tags = {
    Name = "${var.name}-internet-gateway"
  }
}

resource "aws_route_table" "public_rt" {
  vpc_id = aws_vpc.main.id

  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.gw.id
  }
}

resource "aws_route_table_association" "public_rta" {
  count = length(var.public_subnet_cidr_blocks)

  subnet_id = aws_subnet.public[count.index].id
  route_table_id = aws_route_table.public_rt.id
}

## NAT Gateway for private instances to access
resource "aws_eip" "nat" {
  vpc = true
}

resource "aws_nat_gateway" "nat_gw" {
  allocation_id = aws_eip.nat.id
  subnet_id = aws_subnet.public[0].id # This can be any of the public subnets
  depends_on = [aws_internet_gateway.gw]
}

resource "aws_route_table" "private_rt" {
  vpc_id = aws_vpc.main.id

  route {
    cidr_block = "0.0.0.0/0"
    nat_gateway_id = aws_nat_gateway.nat_gw.id
  }
}

resource "aws_route_table_association" "private_rta" {
  subnet_id = aws_subnet.private.id
  route_table_id = aws_route_table.private_rt.id
}

## BASTION SERVER
resource "aws_security_group" "allow_ssh" {
  vpc_id = aws_vpc.main.id
  name = "${var.name}-bastion-allow-ssh"
  description = "security group that allows ssh and all egress traffic"

  egress {
    from_port = 0
    to_port = 0
    protocol = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    from_port = 22
    to_port = 22
    protocol = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  lifecycle {
    create_before_destroy = true
  }
}

resource "aws_instance" "bastion_instance" {
  ami = var.bastion_instance_ami
  instance_type = "t2.micro"

  subnet_id = aws_subnet.public[0].id

  vpc_security_group_ids = [aws_security_group.allow_ssh.id]

  key_name = var.key_name

  associate_public_ip_address = true

  tags = {
    Name = "${var.name} bastion-instance"
  }
}
