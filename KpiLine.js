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
            }

            return qlik.Promise.resolve();
        },
        controller: ['$scope', function ($scope) {

            angular.element(document).ready(function () {
                $scope.LoadChart();
            });

            $scope.$watchCollection("layout.qHyperCube.qDataPages", function (newValue) {
                angular.element(document).ready(function () {
                    $scope.LoadChart();
                });
            });
            $scope.$watchCollection("layout.qHyperCube.qMeasureInfo", function (newValue) {
                angular.element(document).ready(function () {
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
                        extraVal1: value.length > 3 ? value[dimLength + 3].qText : null,
                        color: value[dimLength].qText,
                        marker: {
                            fillColor: value.length > 1 ? value[dimLength + 1].qText : "rgba(0,0,0,0)",
                            lineColor: value.length > 2 ? value[dimLength + 2].qText : "rgba(0,0,0,0)",
                            lineWidth: 2,
                            radius: $scope.layout.props.chartPointRadius,
                            states: {
                                hover: {
                                    fillColor: value.length > 2 ? value[dimLength + 1].qText : "rgba(0,0,0,0)",
                                    lineColor: value.length > 3 ? value[dimLength + 2].qText : "rgba(0,0,0,0)",
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
                    },
                    labels: {
                        style: {
                            fontSize: $scope.layout.props.yAxisLabelPrimaryFontSize
                        }
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
                    },
                    tooltip: {
                        formatter: function () {
                            var s = '<b>' + this.x + '</b>';
                            s += '<br/> &#8226; '
                                + this.series.name + ': ' + this.y;
                            if ($scope.layout.qHyperCube.qMeasureInfo.length > 3) {
                                s += '<br/> &#8226; '
                                    + $scope.layout.qHyperCube.qMeasureInfo[3].qFallbackTitle + ': ' + this.point.extraVal1;
                            }

                            return s;
                        },
                        useHTML: true
                    },
					credits: {
						enabled: false
					}
                });
            };
        }]
    };
});