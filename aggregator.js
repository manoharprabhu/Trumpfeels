var aggregator = (function() {
    var Database = require('./database');
    var getCurrentAverageScore = function(callback) {
        var recordsCount = 1000;
        Database.getCurrentAverageScore(recordsCount, function(score) {
            callback(score);
        });
    }

    var getMostFrequentlySaidWords = function(callback) {
        Database.getMostFrequentlySaidWords(10, function(data) {
            callback(data);
        });
    }

    var getNumberOfTweetsAnalyzed = function(callback) {
        Database.getNumberOfTweetsAnalyzed(function(count) {
            callback(count);
        });
    }

    return {
        getCurrentAverageScore,
        getMostFrequentlySaidWords,
        getNumberOfTweetsAnalyzed
    }
}());

module.exports = aggregator;