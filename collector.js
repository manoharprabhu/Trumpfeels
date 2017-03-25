var collector = function(keyword) {
    console.log('Started collecting info on ' + keyword);
    var Twit = require('twit');
    var sentiment = require('sentiment');
    var Database = require('./database');
    const TWITTER_CONSUMER_KEY = process.env.TWITTER_CONSUMER_KEY;
    const TWITTER_CONSUMER_SECRET = process.env.TWITTER_CONSUMER_SECRET;
    const TWITTER_ACCESS_TOKEN = process.env.TWITTER_ACCESS_TOKEN;
    const TWITTER_ACCESS_TOKEN_SECRET = process.env.TWITTER_ACCESS_TOKEN_SECRET;
    if (TWITTER_CONSUMER_KEY === undefined ||
        TWITTER_CONSUMER_SECRET === undefined ||
        TWITTER_ACCESS_TOKEN === undefined ||
        TWITTER_ACCESS_TOKEN_SECRET === undefined) {
        console.log('Twitter access and secret keys not provided. Not collecting data from twiter.');
        return;
    }

    var T = new Twit({
        consumer_key: TWITTER_CONSUMER_KEY,
        consumer_secret: TWITTER_CONSUMER_SECRET,
        access_token: TWITTER_ACCESS_TOKEN,
        access_token_secret: TWITTER_ACCESS_TOKEN_SECRET,
        timeout_ms: 60 * 1000
    });

    var stream = T.stream('statuses/filter', { track: keyword })
    stream.on('tweet', function(tweet) {
        var setimentResult = sentiment(tweet.text);
        var dd = new Date(tweet.created_at);
        var object = {
            "tweet": tweet.text,
            "time": (new Date(tweet.created_at)).getTime(),
            "sentiment": setimentResult
        };
        Database.insertIntoDB(object);
    });
}

module.exports = collector;