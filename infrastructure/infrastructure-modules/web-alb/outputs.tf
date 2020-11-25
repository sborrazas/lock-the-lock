output "dns_name" {
  value = aws_lb.lb.dns_name
}

output "zone_id" {
  value = aws_lb.lb.zone_id
}

output "http_target_group_arn" {
  value = aws_lb_target_group.http_tg.arn
}

output "security_group_id" {
  value = aws_security_group.lb_sg.id
}
