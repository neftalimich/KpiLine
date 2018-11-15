define([], function () {
    "use strict";
    return {
        type: "items",
        component: "accordion",
        items: {
            dimensions: {
                uses: "dimensions",
                min: 1
            },
            measures: {
                uses: "measures",
                min: 1,
                max: 4,
                items: {
                    lineColor: {
                        type: "string",
                        label: "Line Color",
                        ref: "qDef.lineColor",
                        defaultValue: "#1E90FF"
                    }
                }
            },
            sorting: {
                uses: "sorting"
            },
            settings: {
                uses: "settings",
                items: {
                    initFetch: {
                        type: "items",
                        label: "Intial Fetch",
                        items: {
                            initFetchRows: {
                                ref: "qHyperCubeDef.qInitialDataFetch.0.qHeight",
                                label: "Initial fetch rows",
                                type: "number",
                                defaultValue: 2000
                            },
                            initFetchCols: {
                                ref: "qHyperCubeDef.qInitialDataFetch.0.qWidth",
                                label: "Initial fetch cols",
                                type: "number",
                                defaultValue: 5
                            }
                        }
                    },
                    Chart: {
                        type: "items",
                        label: "Chart Configuration",
                        items: {
                            chartLegend: {
                                type: "boolean",
                                component: "switch",
                                ref: "props.chartLegend",
                                label: "Display Chart Legend",
                                options: [{
                                    value: true,
                                    label: "Yes"
                                }, {
                                    value: false,
                                    label: "No"
                                }],
                                defaultValue: true
                            },
                            chartAxesX: {
                                type: "boolean",
                                component: "switch",
                                ref: "props.chartAxesX",
                                label: "Display Chart xAxes",
                                options: [{
                                    value: true,
                                    label: "Yes"
                                }, {
                                    value: false,
                                    label: "No"
                                }],
                                defaultValue: true
                            },
                            chartAxesY: {
                                type: "boolean",
                                component: "switch",
                                ref: "props.chartAxesY",
                                label: "Display Chart yAxes",
                                options: [{
                                    value: true,
                                    label: "Yes"
                                }, {
                                    value: false,
                                    label: "No"
                                }],
                                defaultValue: true
                            },
                            chartLineColor: {
                                type: "string",
                                ref: "props.chartLineColor",
                                label: "Chart Line Color",
                                defaultValue: "#3e95cd"
                            },
                            chartLineWidth: {
                                type: "number",
                                ref: "props.chartLineWidth",
                                label: "Chart Line Border Width",
                                defaultValue: 1
                            },
                            chartPointRadius: {
                                type: "number",
                                ref: "props.chartPointRadius",
                                label: "Chart Point Radius",
                                defaultValue: 2
                            },
                            chartPointHoverRadius: {
                                type: "number",
                                ref: "props.chartPointHoverRadius",
                                label: "Chart Point Hover Radius",
                                defaultValue: 2
                            },
                            borderColor: {
                                type: "string",
                                ref: "props.borderColor",
                                label: "Div border Color",
                                defaultValue: "0px solid gray"
                            }
                        }
                    }
                }
            }
        }
    };
});