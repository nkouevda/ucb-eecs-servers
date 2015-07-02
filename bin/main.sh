#!/usr/bin/env bash

# Switch to parent directory of location of script
cd "$(dirname "$BASH_SOURCE")/.."

# Load settings
. "bin/settings.sh"

# Clear the offline servers file and make the temporary directory
>"$offline_servers"
tmp_dir="tmp.$$"
mkdir -p "$tmp_dir"

# Query each server in background for concurrent execution
sed -n '/^[^#]/p' "$server_list" | while read -r server; do
  # Retrieve and write output; record server as offline if ssh returns nonzero
  ssh "${ssh_config[@]}" "$username@$server" \
      "$remote_dir/$info_script $server" >"$tmp_dir/$server" 2>/dev/null \
      || echo "$server" >>"$offline_servers" &
done

# Wait for all background jobs to finish
wait

# Generate the new online servers file and remove the temporary directory
cat "$tmp_dir"/* >"$online_servers"
rm -r "$tmp_dir"
