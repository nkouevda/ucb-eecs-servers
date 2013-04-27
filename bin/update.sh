#!/bin/bash

# Nikita Kouevda
# 2013/04/27

# Change directory to parent directory of location of script
cd "$(dirname "${BASH_SOURCE[0]}")/.."

# Load variables
. bin/config.sh

# Run the remote update script
ssh "${ssh_opts[@]}" "$user@$server" "~/ststics/bin/remote-main.sh"

# Copy the online and offline files
scp "${ssh_opts[@]}" "$user@$server:ststics/data/{on,off}line.txt" data/

# Update the best hive server
sort -nrst ',' -k 2,2 data/online.txt | sort -nrst ',' -k 3,3 | grep 'hive' | tail -n 1 | cut -d ',' -f 1 > data/best_hive.txt
