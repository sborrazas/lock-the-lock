#!/bin/bash

set -e

echo ECS_CLUSTER=${cluster_name} >> /etc/ecs/ecs.config
