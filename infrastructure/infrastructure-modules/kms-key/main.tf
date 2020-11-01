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

resource "aws_kms_key" "master" {
  description = "A master key for ${var.name}"

  policy = data.aws_iam_policy_document.master_key_policy.json
  deletion_window_in_days = 30
  enable_key_rotation = true

  tags = {
    Name = var.name
  }
}

# Define a Key Policy that allows for Administrator users and Non-Administrator users.
data "aws_iam_policy_document" "master_key_policy" {
  # Grant CMK Administrators full management rights, but no usage rights.
  statement {
    sid = "AllowAccessForKeyAdministrators"
    effect = "Allow"
    resources = ["*"]

    actions = [
      "kms:Create*",
      "kms:Describe*",
      "kms:Enable*",
      "kms:List*",
      "kms:Put*",
      "kms:Update*",
      "kms:Revoke*",
      "kms:Disable*",
      "kms:Get*",
      "kms:Delete*",
      "kms:ScheduleKeyDeletion",
      "kms:CancelKeyDeletion",
      "kms:Tag*",
      "kms:Untag*",
    ]

    principals {
      type = "AWS"
      identifiers = [var.cmk_administrator_iam_arn]
    }
  }

  # Grant CMK Users full usage rights, but no management rights.
  statement {
    sid = "AllowAccessForKeyUsers-${md5(jsonencode(var.cmk_user_iam_arn))}"
    effect = "Allow"
    resources = ["*"]

    actions = [
      "kms:CreateGrant",
      "kms:Encrypt",
      "kms:Decrypt",
      "kms:ReEncrypt*",
      "kms:GenerateDataKey*",
      "kms:DescribeKey",
      "kms:GetPublicKey",
    ]

    principals {
      type = "AWS"
      identifiers = [var.cmk_user_iam_arn]
    }
  }

  # Allow CMK Users to grant other AWS services the right to use the CMK (e.g. a CMK User may wish to allow S3 to use a CMK to encrypt S3 files)
  statement {
    sid = "AllowAttachmentOfPersistentResources-${md5(jsonencode(var.cmk_user_iam_arn))}"
    effect = "Allow"
    resources = ["*"]

    actions = [
      "kms:CreateGrant",
      "kms:ListGrants",
      "kms:RevokeGrant",
    ]

    principals {
      type = "AWS"
      identifiers = [var.cmk_user_iam_arn]
    }

    condition {
      test = "Bool"
      variable = "kms:GrantIsForAWSResource"
      values = ["true"]
    }
  }

  # - Grant the root AWS Account ID full permissions to the key, which has the effect of enabling IAM Policies to control
  #   permissions to the CMK.
  # - Note that a permission can be granted to this CMK *either* through an IAM Policy or an update to this CMK Key Policy.
  #
  statement {
    sid = "EnableUseOfIamPolicies"
    effect = "Allow"
    resources = ["*"]
    actions = ["kms:*"]

    principals {
      type = "AWS"
      identifiers = [
        "arn:aws:iam::${data.aws_caller_identity.current.account_id}:root"
      ]
    }
  }
}

data "aws_caller_identity" "current" {}

# CREATE A HUMAN-FRIENDLY ALIAS FOR THE MASTER KEY
# You can use this alias in API calls and when using gruntkms instead of the very long ID and ARN
resource "aws_kms_alias" "master_key" {
  name = "alias/${var.name}"
  target_key_id = aws_kms_key.master.id
}
