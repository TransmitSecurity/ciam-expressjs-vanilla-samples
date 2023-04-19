#!/usr/bin/env bash

# Sample selection menu./do
source ./common.sh

DOCKER_ENV_VARS="-e SAMPLE=${optdir[$choice]}"
while read e; do 
    DOCKER_ENV_VARS+=" -e $e"
done <<<$(cat .env |grep -ve '^#' | grep -v '^$' | sed 's/ .*//' | grep -v DEBUG)

echo "docker run --platform linux/amd64 $DOCKER_ENV_VARS -p 8080:8080 transmitsecurity/js-vanilla-samples:latest"
docker run --platform linux/amd64 $DOCKER_ENV_VARS -p 8080:8080 transmitsecurity/js-vanilla-samples:latest
