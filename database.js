var Database = (function() {
    var Datastore = require('nedb'),
        db = new Datastore({ filename: 'trumpfeels.db', autoload: true });
    var stopwords = [
        'about', 'after', 'all', 'also', 'am', 'an', 'and', 'another', 'any', 'are', 'as', 'at', 'be',
        'because', 'been', 'before', 'being', 'between', 'both', 'but', 'by', 'came', 'can',
        'come', 'could', 'did', 'do', 'each', 'for', 'from', 'get', 'got', 'has', 'had',
        'he', 'have', 'her', 'here', 'him', 'himself', 'his', 'how', 'if', 'in', 'into',
        'is', 'it', 'like', 'make', 'many', 'me', 'might', 'more', 'most', 'much', 'must',
        'my', 'never', 'now', 'of', 'on', 'only', 'or', 'other', 'our', 'out', 'over',
        'said', 'same', 'see', 'should', 'since', 'some', 'still', 'such', 'take', 'than',
        'that', 'the', 'their', 'them', 'then', 'there', 'these', 'they', 'this', 'those',
        'through', 'to', 'too', 'under', 'up', 'very', 'was', 'way', 'we', 'well', 'were',
        'what', 'where', 'which', 'while', 'who', 'with', 'would', 'you', 'your', 'a', 'i',
        'rt', 'amp', '', 'not', 'trump', 'trumps', 'will', 'not', 'president', 'its', 'donald',
        'trump', 'donaldtrump', 'http', 'https'
    ];
    var insertIntoDB = function(object) {
        db.insert(object, function(err, document) {
            if (err) {
                console.log("Error while persisting tweet to DB");
            }
        });
    }

    var getCurrentAverageScore = function(limit, callback) {
        db.find({}).sort({ time: -1 }).limit(limit).exec(function(err, docs) {
            var positive = 0,
                negative = 0;
            docs.forEach(function(item) {
                if (item.sentiment.score > 0) {
                    positive++;
                } else if (item.sentiment.score < 0) {
                    negative++;
                }
            });
            callback({
                positive,
                negative
            });
        });
    }

    var getNumberOfTweetsAnalyzed = function(callback) {
        db.count({}, function(err, count) {
            callback({ count });
        });
    }

    var getObjectAsSortedArray = function(object) {
        var sortable = [];
        for (var pair in object) {
            sortable.push([pair, object[pair]]);
        }

        sortable.sort(function(a, b) {
            return b[1] - a[1];
        });
        return sortable;
    }

    var removeStopwords = function(arr) {
        return arr.filter(function(item) {
            return (item.length > 3) && (item.indexOf('http') === -1) && (stopwords.indexOf(item) === -1)
        });
    }

    var getMostFrequentlySaidWords = function(topN, callback) {
        var keys = {};
        db.find({}).sort({ time: -1 }).limit(1000).exec(function(err, docs) {
            docs.forEach(function(item) {
                var words = removeStopwords(item.tweet.toLowerCase().replace(/[^a-zA-Z ]/g, "").split(" "));
                words.forEach(function(word) {
                    if (word in keys) {
                        keys[word] = keys[word] + 1;
                    } else {
                        keys[word] = 1;
                    }
                });
            });
            var sorted = getObjectAsSortedArray(keys);
            callback(sorted.slice(0, topN));
        });
    }

    return {
        insertIntoDB,
        getCurrentAverageScore,
        getMostFrequentlySaidWords,
        getNumberOfTweetsAnalyzed
    }
}());

module.exports = Database;