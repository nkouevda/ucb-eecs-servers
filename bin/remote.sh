#!/bin/bash

# Nikita Kouevda
# 2013/04/09

# Store the script name and directory
script_name="${0##*/}"
script_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Number of users online
users=$(who | wc -l | tr -d ' ')

# Load average for past 5 minutes
load=$(uptime | perl -ne 'm/\d+\.\d+\W+(\d+\.\d+)\W+\d+\.\d+/; print $1')

# Output information as csv
echo "$1,$users,$load"
