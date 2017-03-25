var express = require('express');
var router = express.Router();
var aggregator = require('../aggregator');

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index');
});

router.get('/status', function(req, res, next) {
    aggregator.getCurrentAverageScore(function(score) {
        res.json({
            score
        });
    });
});

router.get('/mostFrequentWords', function(req, res, next) {
    aggregator.getMostFrequentlySaidWords(function(data) {
        res.json(data);
    });
});

router.get('/count', function(req, res, next) {
    aggregator.getNumberOfTweetsAnalyzed(function(count) {
        res.json({ count: count });
    });
});

module.exports = router;