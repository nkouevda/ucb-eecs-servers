// Nikita Kouevda
// 2013/07/16

// Required libraries
var express = require('express');
var ejs = require('ejs');
var fs = require('fs');
var exec = require('child_process').exec;

// Initialize the default content to be served
var title = 'Current Status of UCB EECS Servers';
var onlineServers = [], offlineServers = [], bestHive = '';
var refreshRate = 1000 * 60 * 5, lastUpdated = 0, minutesAgo = 0;

// Retrieve the current information
var loadFiles = function () {
  // Update the online server list
  fs.readFile(__dirname + '/data/online.txt', 'utf-8', function (err, data) {
    if (err) {
      throw err;
    } else {
      onlineServers = data.trim().split('\n').map(function (server) {
        var info = server.toString().split(',');

        return {
          online: true,
          name: info[0],
          users: info[1],
          load: info[2]
        };
      });
    }
  });

  // Update the offline server list
  fs.readFile(__dirname + '/data/offline.txt', 'utf-8', function (err, data) {
    if (err) {
      throw err;
    } else {
      offlineServers = data.trim().split('\n').map(function (server) {
        return {
          online: false,
          name: server,
          users: '',
          load: ''
        };
      });
    }
  });

  // Update the last updated time
  fs.stat(__dirname + '/data/online.txt', function (err, stats) {
    if (err) {
      throw err;
    } else {
      lastUpdated = stats.mtime;
    }
  });

  // Load the new best hive
  fs.readFile(__dirname + '/data/best_hive.txt', 'utf-8', function (err, data) {
    if (err) {
      throw err;
    } else {
      bestHive = data.trim();
    }
  });
};

// Load the initial information
loadFiles();

// Update the files repeatedly
(function updateFiles() {
  // Run the update script
  exec(__dirname + '/bin/update.sh', function (err, stdout, stderr) {
    if (stdout) {
      console.log(stdout);
    }

    if (stderr) {
      console.error(stderr);
    }

    if (err) {
      throw err;
    } else {
      // Load the new information
      loadFiles();
    }
  });

  setTimeout(updateFiles, refreshRate);
})();

// Instantiate the app and set up ejs
var app = express();
app.engine('html', ejs.__express);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

// Serve files in the static directory statically
app.use('/static', express.static(__dirname + '/static'));

// Serve index.ejs at the root
app.get('/', function (req, res) {
  minutesAgo = Math.floor((new Date() - lastUpdated) / (1000 * 60));

  // Render index.ejs with the header, title, subtitle, and servers
  res.render('index', {
    header: title,
    title: title,
    subtitle: 'Updated every ' + (refreshRate / (1000 * 60)) +
      ' minutes; last updated ' + minutesAgo + ' minute' +
      (minutesAgo === 1 ? '' : 's') + ' ago',
    servers: onlineServers.concat(offlineServers)
  });
});

// Serve a plaintext version of the least busy hive server
app.get('/best_hive', function (req, res) {
  res.send(bestHive);
});

// Listen on the given port, defaulting to 3000
app.listen(process.env.PORT || 3000);
