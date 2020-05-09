var autopublisher = function(interval, server) {
    'use strict';
    var socketIO = require('socket.io');
    var io = socketIO(server);
    var Database = require('./database');
    var publishChartData = function() {
        Database.getMostFrequentlySaidWords(10, function(data) {
            io.emit('mostFrequent', data);
        });

        Database.getCurrentAverageScore(function(data) {
            io.emit('currentAverageScore', data);
        });

        Database.getNumberOfTweetsAnalyzed(function(data) {
            io.emit('numberOfTweetsAnalyzed', data);
        });
    }
    var publishTweetData = function() {
        if(Database.getMostRecentTweet()) {
            const stripped = Database.getMostRecentTweet().replace(/(?:https?|http):\/\/[\n\S]+/g, '');
            io.emit('mostRecentTweet', stripped);
        }
    }

    var printUsageStats = function() {
        console.log(process.memoryUsage());
    }

    setInterval(publishChartData, interval);
    setInterval(publishTweetData, interval * 2);
    setInterval(printUsageStats, 10000);
    publishChartData();
    publishTweetData();
};

module.exports = autopublisher;