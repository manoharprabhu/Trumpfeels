var sentiment = require('sentiment');
const stopwords = require('./stopwords');
let mostRecentTweet = "";
let positiveTweetsCount = 0;
let negativeTweetsCount = 0;
let numberOfTweetsAnalyzed = 0;

let frequencyMap = {};

class Database {
    static getMostRecentTweet() {
        return mostRecentTweet;
    }

    static setMostRecentTweet(tweet) {
        var setimentResult = sentiment(tweet);
        if (setimentResult.score < 0) {
            negativeTweetsCount++;
        } else if (setimentResult.score > 0) {
            positiveTweetsCount++;
        }
        numberOfTweetsAnalyzed++;

        var words = Database.removeStopwords(tweet.replace(/[^a-zA-Z ]/g, "").split(" "));
        words.forEach(function (word) {
            if (frequencyMap[word]) {
                frequencyMap[word]++;
            } else {
                frequencyMap[word] = 1;
            }
        });

        mostRecentTweet = tweet;
    }

    static getCurrentAverageScore(callback) {
        callback({
            "positive": positiveTweetsCount,
            "negative": negativeTweetsCount
        });
    }

    static getNumberOfTweetsAnalyzed(callback) {
        callback({ "count": numberOfTweetsAnalyzed });
    }

    static getObjectAsSortedArray(object) {
        var sortable = [];
        for (var pair in object) {
            sortable.push([pair, object[pair]]);
        }

        sortable.sort(function (a, b) {
            return b[1] - a[1];
        });
        return sortable;
    }

    static removeStopwords(arr) {
        return arr.filter(function (item) {
            if(!item) {
                return false;
            }
            if (item.length <= 3) {
                return false;
            }
            if (item.indexOf('http') > 0) {
                return false;
            }
            if (stopwords[item.toLowerCase()]) {
                return false;
            }
            return true;
        });
    }

    static getMostFrequentlySaidWords(topN, callback) {
        var sorted = Database.getObjectAsSortedArray(frequencyMap);
        callback(sorted.slice(0, topN));
    }
}

module.exports = Database;
