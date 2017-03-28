var autopublisher = function(interval) {
    'use strict';
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
    var Database = require('./database');
    setInterval(publishData, interval);
    publishData();
};

module.exports = autopublisher;