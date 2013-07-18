// Nikita Kouevda
// 2013/07/17

// Required libraries
var express = require('express');
var ejs = require('ejs');
var fs = require('fs');
var exec = require('child_process').exec;
var settings = require('./settings');

// Initialize the default content to be served
var onlineServers = [], offlineServers = [], bestHive = '', lastUpdated = 0;

// Retrieve the current information
var loadFiles = function () {
  // Update the online server list
  fs.readFile(__dirname + settings.onlineFile, 'utf-8', function (err, data) {
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
  fs.readFile(__dirname + settings.offlineFile, 'utf-8', function (err, data) {
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
  fs.stat(__dirname + settings.onlineFile, function (err, stats) {
    if (err) {
      throw err;
    } else {
      lastUpdated = stats.mtime;
    }
  });

  // Load the new best hive
  fs.readFile(__dirname + settings.bestHiveFile, 'utf-8', function (err, data) {
    if (err) {
      throw err;
    } else {
      bestHive = data.trim();
    }
  });
};

// Load the initial information
loadFiles();

// Update the files repeatedly if refresh is enabled
if (settings.refresh) {
  (function updateFiles() {
    // Run the update script
    exec(__dirname + settings.updateFile, function (err, stdout, stderr) {
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

    setTimeout(updateFiles, settings.refreshRate);
  })();
}

// Instantiate the app and set up ejs
var app = express();
app.engine('html', ejs.__express);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

// Serve files in the static directory statically
app.use('/static', express.static(__dirname + '/static'));

// Serve index.ejs at the root
app.get('/', function (req, res) {
  var minutesAgo = Math.floor((new Date() - lastUpdated) / (1000 * 60));

  // Render index.ejs with the header, title, subtitle, and servers
  res.render('index', {
    header: settings.title,
    title: settings.title,
    subtitle: 'Updated every ' + (settings.refreshRate / (1000 * 60)) +
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
app.listen(process.env.PORT || settings.port);
