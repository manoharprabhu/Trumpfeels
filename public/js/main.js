(function() {
    'use strict';

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
        var myChart = new Chart(ctx, {
            type: 'line',
            data: chartData,
            options: {
                legend: {
                    position: 'bottom'
                },
                scales: {
                    yAxes: [{
                        scaleLabel: {
                            display: true,
                            labelString: 'Count'
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
        console.log(data);
        document.getElementById('positive-count').innerText = data.score.positive;
        document.getElementById('negative-count').innerText = data.score.negative;
    }

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

}());