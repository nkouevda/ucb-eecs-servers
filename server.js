// External dependencies
var express = require('express');
var ejs = require('ejs');

// Internal dependencies
var meta = require('./package');
var settings = require('./settings');
var update = require('./update');

var onlineServers = [], offlineServers = [], bestHive = '', lastUpdatedTime = 0;

var updateAllFields = function () {
  update.readOnlineServers(function (data) {
    onlineServers = data;
  });
  update.readOfflineServers(function (data) {
    offlineServers = data;
  });
  update.readBestHive(function (data) {
    bestHive = data;
  });
  update.readUpdateTime(function (data) {
    lastUpdatedTime = data;
  });
};

// Attempt to load existing local data before running remote update
updateAllFields();

// Update repeatedly unless refresh is disabled
if (settings.refreshInterval > 0) {
  (function updateFiles() {
    update.runRemoteUpdate(updateAllFields);

    setTimeout(updateFiles, settings.refreshInterval);
  })();
}

var port = process.env.PORT || settings.port;
var app = express();

// Template engine
app.engine('html', ejs.__express);
app.set('view engine', 'ejs');

// Template variables
app.locals({
  repository: meta.repository.url,
  title: settings.title
});

// Match routes exactly
app.enable('strict routing');
app.enable('case sensitive routing');

// Middleware
app.use(express.logger());
app.use('/static', express.static(__dirname + '/static'));
app.use(express.bodyParser());

app.get('/', function (req, res) {
  var minutesAgo = Math.floor((new Date() - lastUpdatedTime) / (1000 * 60));

  res.render('index', {
    subtitle: 'Updated every ' + (settings.refreshInterval / (1000 * 60)) +
              ' minutes; last updated ' + minutesAgo + ' minute' +
              (minutesAgo === 1 ? '' : 's') + ' ago',
    onlineServers: onlineServers,
    offlineServers: offlineServers
  });
});

// Return the least busy hive server in plain text
app.get('/best_hive', function (req, res) {
  res.send(bestHive);
});

app.listen(port);
console.log('%s listening on port %d', meta.name, port);
