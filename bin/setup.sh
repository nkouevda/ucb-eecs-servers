#!/usr/bin/env bash

set -euo pipefail

cd "$(dirname "${BASH_SOURCE[0]}")/.."

source "bin/settings.sh"

# Make the base directory if necessary
ssh "${ssh_config[@]}" "$username@$server" "mkdir -p $remote_dir"

# Copy the necessary files over
scp -r "${ssh_config[@]}" {bin,data} "$username@$server:$remote_dir/"
