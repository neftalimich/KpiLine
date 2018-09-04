define([
    "qlik",
    "jquery",
    "./initial-properties",
    "./properties",
    "text!./style.css",
    "text!./template.html",
    "./js/highcharts"
], function (qlik, $, initProps, props, cssContent, template, highcharts) {
    'use strict';
    $("<style>").html(cssContent).appendTo("head");
    return {
        template: template,
        initialProperties: initProps,
        definition: props,
        support: {
            snapshot: true,
            export: true,
            exportData: true
        },
        paint: function () {
            //setup scope.table
            if (!this.$scope.table) {
                this.$scope.table = qlik.table(this);
                console.log("table", this.$scope.table);
            }

            return qlik.Promise.resolve();
        },
        controller: ['$scope', function ($scope) {
            console.log("layout", $scope.layout);

            angular.element(document).ready(function () {
                $scope.LoadChart();
            });

            $scope.$watchCollection("layout.qHyperCube.qDataPages", function (newValue) {
                angular.element(document).ready(function () {
                    //console.log("qDataPages");
                    $scope.LoadChart();
                });
            });
            $scope.$watchCollection("layout.qHyperCube.qMeasureInfo", function (newValue) {
                angular.element(document).ready(function () {
                    //console.log("qMeasureInfo");
                    $scope.LoadChart();
                });
            });

            $scope.$watchCollection("layout.props", function (newValue) {
                angular.element(document).ready(function () {
                    $scope.LoadChart();
                });
            });

            $scope.LoadChart = function () {
                let key = $scope.layout.qInfo.qId;

                let dimLength = $scope.layout.qHyperCube.qDimensionInfo.length;
                let meaLength = $scope.layout.qHyperCube.qMeasureInfo.length;

                let seriesAux = [];
                let categoriesAux = [];

                seriesAux.push({
                    name: $scope.layout.qHyperCube.qMeasureInfo[0].qFallbackTitle,
                    showInLegend: $scope.layout.props.chartLegend,
                    data: [],
                    lineWidth: $scope.layout.props.chartLineWidth
                });

                angular.forEach($scope.layout.qHyperCube.qDataPages[0].qMatrix, function (value, key) {
                    seriesAux[0].data.push({
                        y: parseFloat(value[dimLength].qText),
                        color: value[dimLength].qText,
                        marker: {
                            fillColor: value[dimLength + 1].qText,
                            lineColor: value[dimLength + 2].qText,
                            lineWidth: 2,
                            radius: $scope.layout.props.chartPointRadius,
                            states: {
                                hover: {
                                    fillColor: value[dimLength + 1].qText,
                                    lineColor: value[dimLength + 2].qText,
                                    radius: $scope.layout.props.chartPointHoverRadius
                                }
                            }
                        }
                    });
                    categoriesAux.push(value[dimLength - 1].qText);
                });

                let xAxisAux = {
                    categories: categoriesAux
                };
                let yAxisAux = {
                    title: {
                        text: null
                    }
                };

                if (!$scope.layout.props.chartAxesX) {
                    xAxisAux.labels = { enabled: false };
                    xAxisAux.lineWidth = 0;
                    xAxisAux.lineColor = 'transparent';
                    xAxisAux.tickLength = 0;
                    xAxisAux.gridLineColor = 'transparent';
                    xAxisAux.gridLineWidth = 0;
                }
                if (!$scope.layout.props.chartAxesY) {
                    yAxisAux.labels = { enabled: false };
                    yAxisAux.lineWidth = 0;
                    yAxisAux.lineColor = 'transparent';
                    yAxisAux.tickLength = 0;
                    yAxisAux.gridLineColor = 'transparent'; 
                }


                var chart = new Highcharts.Chart({
                    chart: {
                        type: 'line',
                        renderTo: 'chartContainer-' + key,
                        zoomType: 'xy',
                        title: ''
                    },
                    title: {
                        text: null
                    },
                    xAxis: xAxisAux,
                    yAxis: yAxisAux,
                    series: seriesAux,
                    plotOptions: {
                        series: {
                            color: $scope.layout.props.chartLineColor,
                            marker: {
                                lineColor: null,
                                states: {
                                    hover: {
                                        radius: 8
                                    }
                                }
                            }
                        }
                    },
                    responsive: {
                        rules: [{
                            condition: {
                                //maxWidth: 500
                            }
                        }]
                    }
                });
            };
        }]
    };
});