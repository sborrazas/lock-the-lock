#!/bin/bash

set -e

export $(aws kms decrypt --ciphertext-blob fileb://env/$MIX_ENV.encrypted \
                         --output text \
                         --query Plaintext | base64 --decode | xargs)

exec /app/bin/lock_the_lock start
