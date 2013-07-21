// Nikita Kouevda
// 2013/07/21

// External dependencies
var express = require('express');
var ejs = require('ejs');

// Internal dependencies
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
if (settings.refresh) {
  (function updateFiles() {
    update.runRemoteUpdate(updateAllFields);

    setTimeout(updateFiles, settings.refreshRate);
  })();
}

var app = express();
app.engine('html', ejs.__express);
app.set('view engine', 'ejs');

app.use('/static', express.static(__dirname + '/static'));

app.get('/', function (req, res) {
  var minutesAgo = Math.floor((new Date() - lastUpdatedTime) / (1000 * 60));

  res.render('index', {
    header: settings.title,
    title: settings.title,
    subtitle: 'Updated every ' + (settings.refreshRate / (1000 * 60)) +
      ' minutes; last updated ' + minutesAgo + ' minute' +
      (minutesAgo === 1 ? '' : 's') + ' ago',
    onlineServers: onlineServers,
    offlineServers: offlineServers
  });
});

// Serve a plaintext version of the least busy hive server
app.get('/best_hive', function (req, res) {
  res.send(bestHive);
});

app.listen(process.env.PORT || settings.port);
