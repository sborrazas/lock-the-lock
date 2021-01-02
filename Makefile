BASE_DIR = $(shell pwd)

DOCKER_OPTS ?=

################################################################################
# Makefile API
################################################################################

.PHONY: start
start:
	docker-compose up

.PHONY: shell
shell:
	$(call execute_with_keys, /bin/bash)

.PHONY: deps
deps:
	$(call execute_with_keys, mix deps.get)

.PHONY: setup-test
setup-test:
	$(call execute_with_keys, MIX_ENV=test mix ecto.setup)

.PHONY: test
test:
	$(call execute_with_keys, mix test)

.PHONY: stop
stop:
	docker-compose stop

.PHONY: lint
lint:
	$(call execute_with_keys, ./bin/lint.sh)

.PHONY: dialyzer
dialyzer:
	docker-compose run --rm $(DOCKER_OPTS) app mix dialyzer --format short --halt-exit-status

.PHONY: clean-unused-deps
clean-unused-deps:
	docker-compose run --rm $(DOCKER_OPTS) app mix deps.clean --unused

define execute_with_keys
	docker-compose run --rm \
										 $(DOCKER_OPTS) \
										 app \
										 /bin/bash -c "eval \`ssh-agent -s\` && \
																	 ssh-add ~/.ssh/id_rsa && \
																	 $(1)"
endef

.PHONY: encrypt-env
encrypt-env:
	aws kms encrypt --plaintext fileb://config/env/$(ENVIRONMENT).plain \
									--output text \
									--key-id $(KEY_ID) \
									--query CiphertextBlob | base64 --decode >config/env/$(ENVIRONMENT).encrypted
	rm config/$(ENVIRONMENT).plain

.PHONY: decrypt-env
decrypt-env:
	aws kms decrypt --ciphertext-blob fileb://config/env/$(ENVIRONMENT).encrypted \
									--output text \
									--query Plaintext | base64 --decode >config/env/$(ENVIRONMENT).plain

################################################################################
# Frontend Makefile API
################################################################################

.PHONY: frontend-shell
frontend-shell:
	docker-compose run --rm $(DOCKER_OPTS) frontend /bin/bash

################################################################################
# Infrastructure Makefile API
################################################################################

.PHONY: infrastructure-shell
infrastructure-shell:
	docker-compose run --rm $(DOCKER_OPTS) infrastructure
