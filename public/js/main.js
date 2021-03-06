(function() {
    'use strict';
    var lastTweet = null;

    var socket = io();
    socket.on('connect', function() {
        console.log('Connected to socket...');
    });

    socket.on('mostFrequent', function(data) {
        drawChart(data);
    });

    socket.on('currentAverageScore', function(data) {
        populateScoreChart(data);
    });

    socket.on('numberOfTweetsAnalyzed', function(data) {
        populateTweetCount(data);
    });

    socket.on('mostRecentTweet', function(tweet) {
        appendNewTweet(tweet);
    });

    var myChart = null;
    var drawChart = function(data) {
        var chartData = {
            labels: data.map(function(item) { return item[0]; }),
            datasets: [{
                label: 'Most frequently mentioned words in tweets',
                data: data.map(function(item) { return item[1]; }),
                backgroundColor: 'rgba(231, 76, 60, 0.5)',
                borderColor: 'rgba(35, 32, 102, 1)',
                borderWidth: 1
            }]
        }
        var ctx = document.getElementById('chart-content').getContext('2d');
        if (myChart !== null) {
            myChart.data.datasets[0].data = data.map(function(item) { return item[1]; });
            myChart.data.labels = data.map(function(item) { return item[0]; });
            myChart.update();
            return;
        }
        myChart = new Chart(ctx, {
            type: 'line',
            data: chartData,
            options: {
                responsive: true,
                maintainAspectRatio: false,
                legend: {
                    position: 'bottom'
                },
                scales: {
                    yAxes: [{
                        gridLines: {
                            display: true,
                            color: 'rgba(150, 150, 150, 0.2)'
                        },
                        scaleLabel: {
                            display: true,
                            labelString: 'Count'
                        }
                    }],
                    xAxes: [{
                        gridLines: {
                            display: true,
                            color: 'rgba(150, 150, 150, 0.2)'
                        }
                    }]
                }
            }
        });
    }

    var populateTweetCount = function(count) {
        document.getElementById('tweet-count').innerText = count.count + ' tweets analyzed';
    }

    var populateScoreChart = function(data) {
        var positive = data.positive;
        var negative = data.negative;
        if (positive + negative !== 0) {
            var positiveWidth = Math.round((positive / (positive + negative)) * 100);
            var negativeWidth = Math.round((negative / (positive + negative)) * 100);
            document.getElementById('positive-count').innerText = positiveWidth + '% Positive';
            document.getElementById('positive-count').style.width = positiveWidth + '%';

            document.getElementById('negative-count').innerHTML = negativeWidth + '% Negative';
            document.getElementById('negative-count').style.width = negativeWidth + '%';
        }
    }

    var appendNewTweet = function(tweet) {
        if (lastTweet !== null && lastTweet === tweet) {
            return;
        }

        $('#tweets-collection').empty();
        $('<div>')
            .addClass('tweet-item')
            .text(tweet).hide().prependTo('#tweets-collection').fadeIn();
        lastTweet = tweet;
    }
}());