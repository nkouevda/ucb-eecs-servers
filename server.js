// Nikita Kouevda
// 2013/04/10

// Required libraries
var express = require('express');
var ejs = require('ejs');
var fs = require('fs');
var exec = require('child_process').exec;

// Initialize the default contents to be served
var onlineServers = [], offlineServers = [];
var title = 'Current Status of EECS Servers';
var baseSubtitle = 'Updated every 5 minutes; last updated at ', subtitle = '';
var bestHive = '';

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

  // Retrieve the modification time and update the subtitle
  fs.stat(__dirname + '/data/online.txt', 'utf-8', function (err, stats) {
    if (err) {
      throw err;
    } else {
      subtitle = baseSubtitle + stats.mtime.toString().match(/\d+:\d+:\d+/);
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

// Update the files every 5 minutes
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

  // Repeat every 5 minutes
  setTimeout(updateFiles, 1000 * 60 * 5);
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
  // Render index.ejs with the title, header, status, and servers
  res.render('index', {
    header: title,
    title: title,
    status: subtitle,
    servers: onlineServers.concat(offlineServers)
  });
});

// Serve a plaintext version of the least busy hive server
app.get('/best_hive', function (req, res) {
  res.send(bestHive);
});

// Listen on the given port, defaulting to 3000
app.listen(process.env.PORT || 3000);
