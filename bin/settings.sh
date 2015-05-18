# Nikita Kouevda
# 2015/05/18

# Authentication
username="TODO"
server="TODO"
ssh_config=(
    "-oConnectTimeout=3"
    "-oServerAliveInterval=3"
    "-oStrictHostKeyChecking=no"
)

# Directories and files
remote_dir="ucb-eecs-servers"
settings_script="bin/settings.sh"
main_script="bin/main.sh"
info_script="bin/info.sh"
server_list="data/servers.txt"
online_servers="data/online.txt"
offline_servers="data/offline.txt"
best_hive="data/best_hive.txt"
