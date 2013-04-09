// Nikita Kouevda
// 2013/04/08

// Required libraries
var express = require('express');
var ejs = require('ejs');
var fs = require('fs');
var exec = require('child_process').exec;

// Instantiate the app and initialize its default contents
var app = express();
var onlineServers = [], offlineServers = [];
var title = 'Current Status of EECS Servers';
var baseSubtitle = 'Updated every 5 minutes; last updated at ', subtitle = '';
var best_hive = '';

// Retrieve the current information
var loadFiles = function () {
  // Read the online and offline files
  var online = fs.readFileSync(__dirname + '/data/online.txt', 'utf-8');
  var offline = fs.readFileSync(__dirname + '/data/offline.txt', 'utf-8');

  // Split the content into arrays of objects
  onlineServers = online.trim().split('\n').map(function (server) {
    var info = server.toString().split(',');

    return {
      online: true,
      name: info[0],
      users: info[1],
      load: info[2]
    };
  });
  offlineServers = offline.trim().split('\n').map(function (server) {
    return {
      online: false,
      name: server,
      users: '',
      load: ''
    };
  });

  // Retrieve the modification time and update the subtitle
  var mtime = fs.statSync(__dirname + '/data/online.txt').mtime;
  subtitle = baseSubtitle + mtime.getHours() + ':' + mtime.getMinutes();

  // Load the new best hive
  fs.readFile(__dirname + '/data/best_hive.txt', 'utf-8', function (err, data) {
    if (err) {
      throw err;
    }

    best_hive = data;
  });
};

// Load the initial information
loadFiles();

// Update the files every 5 minutes
(function updateFiles() {
  // Run the update script
  exec(__dirname + '/bin/update.sh', function (err, stdout, stderr) {
    console.log(stdout);
    console.error(stderr);

    if (err) {
      throw err;
    }

    // Load the new information
    loadFiles();
  });

  // Repeat every 5 minutes
  setTimeout(updateFiles, 1000 * 60 * 5);
})();

// Register the engine, set the views directory path, and default to .ejs files
app.engine('html', ejs.__express);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

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

// Serve files in the static directory statically
app.use('/static', express.static(__dirname + '/static'));

// Serve a plaintext version of the least busy hive server
app.get('/best_hive', function (req, res) {
  res.send(best_hive);
});

// Listen on the given port, defaulting to 3000
app.listen(process.env.PORT || 3000);
