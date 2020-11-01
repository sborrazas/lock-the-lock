variable "aws_region" {
  description = "The AWS region in which all resources will be created"
  type = string
}

variable "name" {
  description = "CMK Key name"
  type = string
}

variable "cmk_administrator_iam_arn" {
  description = "A list of IAM ARNs for users who should be given administrator access to this CMK (e.g. arn:aws:iam::<aws-account-id>:user/<iam-user-arn>)."
  type = string
}

variable "cmk_user_iam_arn" {
  description = "A list of IAM ARNs for users who should be given permissions to use this CMK (e.g. arn:aws:iam::<aws-account-id>:user/<iam-user-arn>)."
  type = string
}
