#!/usr/bin/env bash

# Nikita Kouevda
# 2014/09/16

# Switch to parent directory of location of script
cd "$(dirname "$BASH_SOURCE")/.."

# Load settings
. "bin/settings.sh"

# Make the base directory if necessary
ssh "${ssh_config[@]}" "$username@$server" "mkdir -p $remote_dir"

# Copy the necessary files over
scp -r "${ssh_config[@]}" {bin,data} "$username@$server:$remote_dir/"
