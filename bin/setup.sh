#!/bin/bash

# Nikita Kouevda
# 2013/04/09

# Store the script name and directory
script_name="${0##*/}"
script_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Change directory to parent directory of location of script
cd "$script_dir/.."

# Load variables
. bin/config.sh

# Make the required directories
ssh "${ssh_opts[@]}" "$user@$server" "mkdir -p ~/ststics/{bin,data}"

# Copy the necessary files over
scp "${ssh_opts[@]}" bin/{remote-main,remote,config}.sh "$user@$server:ststics/bin/"
scp "${ssh_opts[@]}" data/servers.txt "$user@$server:ststics/data/"
