(function() {
    'use strict';

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

    var myChart = null;
    var drawChart = function(data) {
        var chartData = {
            labels: data.map(function(item) { return item[0]; }),
            datasets: [{
                label: 'Most frequently mentioned words in tweets',
                data: data.map(function(item) { return item[1]; }),
                backgroundColor: 'rgba(233, 29, 14, 0.4)'
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
                legend: {
                    position: 'bottom'
                },
                scales: {
                    yAxes: [{
                        gridLines: {
                            display: true,
                            color: 'rgba(35, 32, 102, 1)'
                        },
                        scaleLabel: {
                            display: true,
                            labelString: 'Count'
                        }
                    }],
                    xAxes: [{
                        gridLines: {
                            display: true,
                            color: 'rgba(35, 32, 102, 1)'
                        }
                    }]
                }
            }
        });
    }

    var populateTweetCount = function(count) {
        document.getElementById('tweet-count').innerText = count.count;
    }

    var populateScoreChart = function(data) {
        document.getElementById('positive-count').innerText = data.positive;
        document.getElementById('negative-count').innerText = data.negative;
    }

    var refreshData = function() {
        $.ajax({
            url: '/mostFrequentWords'
        }).done(function(data) {
            drawChart(data);
        });

        $.ajax({
            url: '/count'
        }).done(function(data) {
            populateTweetCount(data);
        });

        $.ajax({
            url: '/status'
        }).done(function(data) {
            populateScoreChart(data);
        });
    }

    refreshData();

}());