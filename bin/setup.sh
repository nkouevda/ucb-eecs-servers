#!/bin/bash

# Nikita Kouevda
# 2013/06/28

# Change directory to parent directory of location of script
cd "$(dirname "${BASH_SOURCE[0]}")/.."

# Load variables
. bin/config.sh

# Make the required directories
ssh "${ssh_opts[@]}" "$username@$server" "mkdir -p ~/$remote_dir/{bin,data}"

# Copy the necessary files over
scp "${ssh_opts[@]}" data/servers.txt "$username@$server:$remote_dir/data/"
scp "${ssh_opts[@]}" bin/{remote-main,remote,config}.sh \
    "$username@$server:$remote_dir/bin/"
