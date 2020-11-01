.PHONY: setup-ansible
setup-ansible:
	ansible-galaxy collection install -r requirements.yml -p collections

.PHONY: setup-terraform
setup-terraform:
	ansible-playbook -i local.ini setup_terraform.yml

.PHONY: terragrunt-plan
terragrunt-plan:
	terragrunt plan

.PHONY: terragrunt-apply
terragrunt-apply:
	terragrunt apply
