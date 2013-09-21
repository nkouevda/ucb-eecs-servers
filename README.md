<!-- Nikita Kouevda, Anthony Sutardja -->
<!-- 2013/09/21 -->

# ucb-eecs-servers

Current usage data for UC Berkeley EECS servers.

## Setup

1. Clone this repository and set up the necessary dependencies:

        git clone https://github.com/nkouevda/ucb-eecs-servers.git
        cd ucb-eecs-servers
        npm install

2. In `bin/settings.sh`, specify the username and main server to be used.

3. Run `./bin/setup.sh` to copy all local files to the remote file system.

## Usage

Run `./bin/remote.sh` to update data manually.

Execute `npm start` or `node server.js` to run the server. Note that by default,
this will also update data every 5 minutes. To change this behavior, change the
`refreshRate` in `settings.json` to the desired value, in milliseconds. `0` will
disable it altogether.

## License

Licensed under the [MIT License](http://www.opensource.org/licenses/MIT).
