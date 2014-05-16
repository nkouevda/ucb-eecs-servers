<!-- Nikita Kouevda, Anthony Sutardja -->
<!-- 2014/05/15 -->

# ucb-eecs-servers

Current usage data for UC Berkeley EECS servers.

## Setup

1. Clone this repository:

        git clone https://github.com/nkouevda/ucb-eecs-servers.git
        cd ucb-eecs-servers

2. If you wish to run the server and not just update data, install the required
dependencies:

        npm install

3. In [`bin/settings.sh`](bin/settings.sh), specify the main remote server and
the username with which to connect to servers.

4. Run [`./bin/setup.sh`](bin/setup.sh) to copy all local files to the remote
file system.

## Usage

Run [`./bin/remote.sh`](bin/remote.sh) to update data manually, or execute `node
server.js` (or `npm start`) to run the server.

Note that by default, running the server will also update data every 5 minutes.
To change this behavior, change `refreshInterval` in
[`settings.json`](settings.json) to the desired value, in milliseconds, or `0`
(or any negative value) to disable data updating.

## License

Licensed under the [MIT License](http://www.opensource.org/licenses/MIT).
