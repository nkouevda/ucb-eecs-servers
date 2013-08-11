<!-- Nikita Kouevda, Anthony Sutardja -->
<!-- 2013/08/11 -->

# ucb-eecs-servers

Current usage data for UC Berkeley EECS servers.

## Setup

    git clone https://github.com/nkouevda/ucb-eecs-servers.git
    cd ucb-eecs-servers
    npm install

Edit `bin/settings.sh` and then:

    bash bin/setup.sh

## Usage

To update data manually:

    bash bin/update.sh

To run the server:

    npm start

or

    node server.js

Note that by default, this will also update data every 5 minutes. To change this
behavior, change the `refreshRate` in `settings.json` to the desired value (in
milliseconds). `0` will disable it altogether.

## License

Licensed under the [MIT License](http://www.opensource.org/licenses/MIT).
