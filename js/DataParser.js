define(["./config", "./tools"],
    function (config) {
        return function (app, $element, layout) {
            var self = new Object();
            var hypercube = layout.qHyperCube;
            var rowList = hypercube.qDataPages[0].qMatrix;
            var sign = "%";
            var LINE_MODE = {
                "None": 0,
                "聚集": 1,
                "发散": 2
            }

            self.pointDataList = {};
            self.lineDataList = {};
            self.pureData = {};

            var tools = new ToolsUnit();

            self.getRangeData = function (obj) {
                var ret = {}
                if (!tools.isNotNull(obj)) {
                    ret.min = 0, ret.max = 0;
                    return ret;
                }
                if (obj.length === 1) {
                    ret.min = obj[0], ret.max = obj[0];
                    return ret;
                }
                obj.sort(function (a, b) {
                    return a - b;
                });
                ret.min = obj[0];
                ret.max = obj[obj.length - 1];
                return ret;
            }

            self.getDataRangeColor = function () {
                var dataRangeColor = [];
                $.each(hypercube.qMeasureInfo, function (i, val) {
                    var name = val.qFallbackTitle
                    var dataRangeStr = val.echartsMap.dataRangeColor;
                    if (dataRangeStr) {
                        dataRangeColor[name] = dataRangeStr.replace(/\s+/g, "").split("|");
                    } else {
                        dataRangeColor[name] = ['#ff3333'];
                    }
                })
                return dataRangeColor;
            }

            self.getEffectColor = function () {
                var effectColor = [];
                $.each(hypercube.qMeasureInfo, function (i, val) {
                    var name = val.qFallbackTitle;
                    var colorStr = val.echartsMap.effectColor;
                    if (colorStr) {
                        effectColor[name] = colorStr.split(",")[0].replace(/\s+/g, "");
                    }
                })
                return effectColor;
            }

            self.getMesureList = function () {
                var measureNameList = [];
                $.each(hypercube.qMeasureInfo, function (i, val) {
                    var name = val.qFallbackTitle
                    measureNameList.push(name);
                })
                return measureNameList;
            }

            self.getSymbolMode = function () {
                var symbolMode = [];
                $.each(hypercube.qMeasureInfo, function (i, val) {
                    var name = val.qFallbackTitle
                    symbolMode[name] = val.echartsMap.symbolMode;
                })
                return symbolMode;
            }

            self.getSymbolStyle = function () {
                var symbolStyle = [];
                $.each(hypercube.qMeasureInfo, function (i, val) {
                    var name = val.qFallbackTitle
                    symbolStyle[name] = val.echartsMap.symbolStyle;
                })
                return symbolStyle;
            }

            self.getSymbolSize = function (value, maxValue, symbolMode, measure) {
                var rate = 0;
                var dataLen = self.pureData[measure].length;
                $.each(hypercube.qMeasureInfo, function (i, val) {
                    var name = val.qFallbackTitle;
                    if (measure === name) {
                        if (symbolMode === 0) {
                            rate = val.echartsMap.symbolSize[1];
                        } else if (symbolMode === 1) {
                            rate = value / maxValue * val.echartsMap.symbolSize[1];
                            rate = rate >= val.echartsMap.symbolSize[0] ? rate : val.echartsMap.symbolSize[0];
                        } else if (symbolMode === 2) {
                            var serial = self.getNumberSerial(value, self.pureData[measure]);
                            var decrease = (val.echartsMap.symbolSize[1] - val.echartsMap.symbolSize[0]) / dataLen
                            rate = val.echartsMap.symbolSize[1] - decrease * (dataLen - serial);
                        }
                        if (dataLen === 1) {
                            rate = val.echartsMap.symbolSize[1] * 1.5;
                        }
                    }
                });
                return rate
            }

            self.getDefaultLegend = function () {
                var defaultLegend = {};
                $.each(hypercube.qMeasureInfo, function (i, val) {
                    var name = val.qFallbackTitle;
                    if (!val.echartsMap.subNode) {
                        if (hypercube.qMeasureInfo[i].echartsMap.defaultMeasure) {
                            defaultLegend[name] = true;
                        } else {
                            defaultLegend[name] = false;
                        }
                    }
                });
                return defaultLegend;
            }

            self.getDefaultMeasure = function () {
                var defaultMeasure = "";
                var isSub = self.getSubFlagList();
                $.each(hypercube.qMeasureInfo, function (i, val) {
                    var name = val.qFallbackTitle;
                    if (!isSub[name] && hypercube.qMeasureInfo[i].echartsMap.defaultMeasure) {
                        defaultMeasure = name;
                    }
                });
                return defaultMeasure;
            }

            self.getCenter = function () {
                var center = [];
                var lineFlag = self.getLineFlagList();
                $.each(hypercube.qMeasureInfo, function (i, val) {
                    var name = val.qFallbackTitle;
                    if (lineFlag[name]) {
                        center[name] = val.echartsMap.center;
                    }
                });
                return center;
            }

            self.getLineFlagList = function () {
                var lineFlagList = {};
                $.each(hypercube.qMeasureInfo, function (i, val) {
                    var name = val.qFallbackTitle;
                    lineFlagList[name] = val.echartsMap.lineType === 0 ? false : true;
                });
                return lineFlagList;
            }

            self.getLineStyleList = function () {
                var lineStyle = [];
                $.each(hypercube.qMeasureInfo, function (i, val) {
                    var name = val.qFallbackTitle;
                    lineStyle[name] = val.echartsMap.lineType;
                });
                return lineStyle;
            }

            self.getSubFlagList = function () {
                var subFlagList = {};
                $.each(hypercube.qMeasureInfo, function (i, val) {
                    var name = val.qFallbackTitle;
                    subFlagList[name] = val.echartsMap.subNode ? true : false;
                });
                return subFlagList;
            }

            self.getParent = function () {
                var parent = {};
                $.each(hypercube.qMeasureInfo, function (i, val) {
                    var name = val.qFallbackTitle;
                    if (val.echartsMap.subNode) {
                        parent[name] = val.echartsMap.parentNode
                    }
                });
                return parent;
            }

            self.getLegendNameList = function () {
                var legendNameList = [];
                $.each(hypercube.qMeasureInfo, function (i, val) {
                    var name = val.qFallbackTitle;
                    if (!val.echartsMap.subNode) {
                        legendNameList.push({
                            name: name,
                            itemHeight: 8,
                            itemWidth: 6,
                            borderColor: 'red',
                            borderWidth: 4,
                            icon: hypercube.qMeasureInfo[i].echartsMap.symbolStyle
                        });
                    }
                });
                return legendNameList;
            }

            self.getNumber = function (str) {
                var numericStr = str.replace(/[^\d.]/g, '');
                var ret = parseFloat(numericStr);
                return ret;
            }

            self.getNumberSerial = function (num, array) {
                for (var i = 0; i < array.length; i++) {
                    if (array[i] === num) {
                        return i;
                    }
                }
                return 1;
            }

            self.getCenterNode = function () {
                var centerNode = [];
                $.each(hypercube.qMeasureInfo, function (i, val) {
                    var config = hypercube.qMeasureInfo[i].echartsMap;
                    var centerLong = config.centerLong;
                    var centerLat = config.centerLat;
                    var center = config.center;
                    var centerValue = config.centerValue;
                    centerNode[val.qFallbackTitle] = [{
                        name: center,
                        value: [centerLong, centerLat, centerValue]
                    }];
                });
                return centerNode;
            }

            self.setData = function () {
                var measureList = self.getMesureList();
                $.each(measureList, function (i, measureName) {
                    var pointData = [],
                        lineData = [],
                        pureData = [];
                    var config = hypercube.qMeasureInfo[i].echartsMap;
                    var maxLineNum = config.maxLineNum;
                    var lineStyle = config.lineType;
                    var color = config.effectColor;
                    var centerLong = config.centerLong;
                    var centerLat = config.centerLat;
                    var center = config.center;
                    $.each(rowList, function (k, row) {
                        var value = self.getNumber(row[i + 1].qText);
                        var pointName = row[0].qText;
                        var geo = [row[0].qAttrExps.qValues[0].qNum, row[0].qAttrExps.qValues[1].qNum];
                        if (value && tools.isNotNull(pointName)) {
                            pureData.push(value);
                            if (k <= maxLineNum) {
                                if (lineStyle === LINE_MODE["聚集"]) {
                                    lineData.push({
                                        "coords": [geo, [centerLong, centerLat]],
                                        "value": value,
                                        "fromName": pointName,
                                        "toName": center,
                                    });
                                } else if (lineStyle === LINE_MODE["发散"]) {
                                    lineData.push({
                                        "coords": [
                                            [centerLong, centerLat], geo
                                        ],
                                        "value": value,
                                        "fromName": center,
                                        "toName": pointName,
                                    });
                                }
                            }

                            var node = {};
                            node.name = pointName;
                            node.value = geo.concat(value);
                            if (hypercube.qMeasureInfo[i].echartsMap.animation) {
                                node.itemStyle = {
                                    normal: {
                                        color: color,
                                        borderColor: color,
                                        opacity: 0.8,
                                        shadowColor: color,
                                        //shadowBlur: 10,
                                        borderWidth: 2
                                    }
                                }
                            }
                            pointData.push(node);
                        }
                    });
                    self.lineDataList[measureName] = lineData;
                    self.pointDataList[measureName] = pointData;
                    self.pureData[measureName] = pureData;
                })
            }
            return self;
        }
    }
);