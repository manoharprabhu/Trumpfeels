var autopublisher = function(interval, server) {
    'use strict';
    var socketIO = require('socket.io');
    var io = socketIO(server);
    var Database = require('./database');
    var publishChartData = function() {
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
    var publishTweetData = function() {
        Database.getMostRecentTweet(function(tweet) {
            if (tweet !== null) {
                var stripped = tweet.tweet.replace(/(?:https?|http):\/\/[\n\S]+/g, '');
                io.emit('mostRecentTweet', stripped);
            }
        });
    }

    setInterval(publishChartData, interval);
    setInterval(publishTweetData, interval * 2);
    publishChartData();
    publishTweetData();
};

module.exports = autopublisher;