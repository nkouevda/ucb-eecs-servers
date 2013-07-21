// Nikita Kouevda
// 2013/07/21

// External dependencies
var fs = require('fs');
var exec = require('child_process').exec;

// Internal dependencies
var settings = require('./settings');

var readOnlineServers = exports.readOnlineServers = function (callback) {
  fs.readFile(__dirname + settings.onlineFile, 'utf-8', function (err, data) {
    if (err) {
      console.error(err);
      callback([]);
    } else {
      callback(data.trim().split('\n').map(function (server) {
        var info = server.toString().split(',');

        return {
          online: true,
          name: info[0],
          users: info[1],
          load: info[2]
        };
      }));
    }
  });
};

var readOfflineServers = exports.readOfflineServers = function (callback) {
  fs.readFile(__dirname + settings.offlineFile, 'utf-8', function (err, data) {
    if (err) {
      console.error(err);
      callback([]);
    } else {
      callback(data.trim().split('\n').map(function (server) {
        return {
          online: false,
          name: server,
          users: '',
          load: ''
        };
      }));
    }
  });
};

var readBestHive = exports.readBestHive = function (callback) {
  fs.readFile(__dirname + settings.bestHiveFile, 'utf-8', function (err, data) {
    if (err) {
      console.error(err);
      callback('');
    } else {
      callback(data.trim());
    }
  });
};

var readUpdateTime = exports.readUpdateTime = function (callback) {
  fs.stat(__dirname + settings.onlineFile, function (err, stats) {
    if (err) {
      console.error(err);
      callback(0);
    } else {
      callback(stats.mtime);
    }
  });
};

var runRemoteUpdate = exports.runRemoteUpdate = function (callback) {
  exec(__dirname + settings.updateFile, function (err, stdout, stderr) {
    if (stdout) {
      console.log(stdout);
    }

    if (stderr) {
      console.error(stderr);
    }

    if (err) {
      console.error(err);
    } else {
      callback();
    }
  });
};
