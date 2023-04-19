#!/usr/bin/env bash

# Sample selection menu
source ./common.sh

echo "        SAMPLE=${optdir[$choice]} yarn start"
SAMPLE=${optdir[$choice]} npm start

