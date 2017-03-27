var autopublisher = function(interval) {
    'use strict';
    var Database = require('./database');
    setInterval(function() {
        Database.getMostFrequentlySaidWords(10, function(data) {
            io.emit('mostFrequent', data);
        });

        Database.getCurrentAverageScore(5000, function(data) {
            io.emit('currentAverageScore', data);
        });

        Database.getNumberOfTweetsAnalyzed(function(data) {
            io.emit('numberOfTweetsAnalyzed', data);
        });
    }, interval);
};

module.exports = autopublisher;