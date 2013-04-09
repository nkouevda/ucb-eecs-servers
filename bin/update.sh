#!/bin/bash

# Nikita Kouevda
# 2013/04/08

# Store the script name and directory
script_name="${0##*/}"
script_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Change directory to data
cd "$script_dir/../data"

# User, server, and options for ssh
user='cs188-je'
server='hive7.cs.berkeley.edu'
ssh_opts=('-o ConnectTimeout=3' '-o ServerAliveInterval=3')

# Run the remote update script
ssh "${ssh_opts[@]}" "$user@$server" "~/ststics/update.sh"

# Copy the online and offline files
scp "${ssh_opts[@]}" "$user@$server:ststics/{on,off}line.txt" "."

# Update the best hive server
sort -nrst ',' -k 2,2 "online.txt" | sort -nrst ',' -k 3,3 | grep 'hive' | tail -n 1 | cut -d ',' -f 1 > "best_hive.txt"
