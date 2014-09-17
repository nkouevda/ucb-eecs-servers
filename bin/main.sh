#!/usr/bin/env bash

# Nikita Kouevda
# 2014/09/16

# Switch to parent directory of location of script
cd "$(dirname "$BASH_SOURCE")/.."

# Load settings
. "bin/settings.sh"

# Clear the offline servers file and make the temporary directory
>"$offline_servers"
tmp_dir="tmp.$$"
mkdir -p "$tmp_dir"

# Query each server in a background subshell for concurrent execution
for server in "$(grep -vE '^(#|$)' "$server_list")"; do
  (
    # Retrieve and write output
    ssh "${ssh_config[@]}" "$username@$server" \
      "$remote_dir/$info_script $server" >"$tmp_dir/$server" 2>/dev/null

    # Record the server as offline if ssh returned non-0
    (( $? )) && echo "$server" >>"$offline_servers"
  ) &
done

# Wait for all background jobs to finish
wait

# Generate the new online servers file and remove the temporary directory
cat "$tmp_dir"/* >"$online_servers"
rm -r "$tmp_dir"
