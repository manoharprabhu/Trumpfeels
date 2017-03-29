var autopublisher = function(interval, server) {
    'use strict';
    var socketIO = require('socket.io');
    var io = socketIO(server);
    var Database = require('./database');
    var publishData = function() {
        Database.getMostFrequentlySaidWords(10, function(data) {
            io.emit('mostFrequent', data);
        });

        Database.getCurrentAverageScore(5000, function(data) {
            io.emit('currentAverageScore', data);
        });

        Database.getNumberOfTweetsAnalyzed(function(data) {
            io.emit('numberOfTweetsAnalyzed', data);
        });
    }
    setInterval(publishData, interval);
    publishData();
};

module.exports = autopublisher;