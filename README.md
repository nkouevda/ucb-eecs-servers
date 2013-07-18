<!-- Nikita Kouevda, Anthony Sutardja -->
<!-- 2013/07/17 -->

# ucb-eecs-servers

Current usage data for UC Berkeley EECS servers.

## Remote Update

To set up remote update, edit `bin/settings.sh` and then execute:

    bash bin/setup.sh

To update manually:

    bash bin/update.sh

## Server

Edit the settings in `settings.json` and then run:

    node server.js

Note that by default, this will also run remote update every 5 minutes.

## License

Licensed under the [MIT License](http://www.opensource.org/licenses/MIT).
