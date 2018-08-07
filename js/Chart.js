define([
        "../lib/map-mapping",
        "./config",
        "./tools",
        "./DataParser",
        "../lib/echarts"
    ],
    function (
        mapConfig,
        config,
        tools,
        DataParser,
        echarts
    ) {
        var planePath = 'path://M1705.06,1318.313v-89.254l-319.9-221.799l0.073-208.063c0.521-84.662-26.629-121.796-63.961-121.491c-37.332-0.305-64.482,36.829-63.961,121.491l0.073,208.063l-319.9,221.799v89.254l330.343-157.288l12.238,241.308l-134.449,92.931l0.531,42.034l175.125-42.917l175.125,42.917l0.531-42.034l-134.449-92.931l12.238-241.308L1705.06,1318.313z';
        var chinaFlag = "image://" + "/extensions/ebi-echarts-map/image/star.png";
        var sign = "%";
        var tools = new ToolsUnit();
        return function (qlik, $element, layout) {
            var tools = new ToolsUnit();
            var self = this;
            var STATUS = $element.parent()[0].attributes.STATUS;
            if (typeof STATUS === "undefined") {
                STATUS = {
                    isInit: true,
                    selectedLegend: "",
                    legendStatus: {},
                    mapName: "",
                    mapFileName: ""
                }
            }

            //编辑模式
            var MODE = {
                ANALYSIS: "analysis",
                EDIT: "edit"
            }

            //编辑后初始化数据
            var app = qlik.currApp();
            if (qlik.navigation.getMode() === MODE.EDIT) {
                STATUS.isInit = true;
            }

            //防止重复创建Div
            if ($element.find("#echarts3Map").length === 0) {
                $element.append("<div id='echarts3Map'></div>");
            }

            //初始化Div
            var eleWidth = $element.width();
            var eleHeight = $element.height();

            //设置地图盒子大小
            $element.find('#echarts3Map').css({
                'height': eleHeight + 'px',
                'width': eleWidth + 'px',
            });

            //设置数据变量
            var hypercube = layout.qHyperCube;
            var rowList = hypercube.qDataPages[0].qMatrix;
            var dimName = hypercube.qDimensionInfo[0].qFallbackTitle;

            //获取配置项和解析的数据
            var dataParser = new DataParser(app, $element, layout);
            dataParser.setData();
            var pureData = dataParser.pureData;
            var legendStatus = STATUS.isInit ? dataParser.getDefaultLegend() : STATUS.legendStatus;
            var selectedLegend = STATUS.isInit ? dataParser.getDefaultMeasure() : STATUS.selectedLegend;
            var dataRange = dataParser.getRangeData(pureData[selectedLegend]);
            var symbolMode = dataParser.getSymbolMode();
            var symbolStyle = dataParser.getSymbolStyle();
            var subFlagList = dataParser.getSubFlagList();
            var lineFlag = dataParser.getLineFlagList();
            var legendNameList = dataParser.getLegendNameList();
            var measureNameList = dataParser.getMesureList();
            var parent = dataParser.getParent();
            var dataRangeColorList = dataParser.getDataRangeColor();
            var centerNodeList = dataParser.getCenterNode();
            var initMapName = layout.echartsMap.mapName;
            var provinceDrilldown = layout.echartsMap.provinceDrilldown;
            //var provinceDim = layout.echartsMap.provinceDim;

            //必须勾选默认度量
            if (!tools.isNotNull(dataParser.getDefaultMeasure())) {
                if ($element.find("#echartsMapInfo").length < 1) {
                    $element.append("<div id='echartsMapInfo'>请勾选默认度量</div>");
                }
                $element.find("#echartsMapInfo").addClass("echartsMapInfo-show");
            } else {
                $element.find("#echartsMapInfo").removeClass("echartsMapInfo-show");
            }

            var mapMapping = tools.mergeMapMapping(mapConfig.worldCountry, mapConfig.chinaProvince, mapConfig.chinaCity);
            //获取地图Json数据，渲染地图
            if (STATUS.isInit) {
                STATUS.mapName = mapMapping[initMapName].fileName;
                STATUS.mapFileName = initMapName;
            }

            //下钻目录树
            if (provinceDrilldown && STATUS.isInit) {
                $element.find(".map-nav-tree").remove();
                var rootLevel = mapMapping[initMapName].level;
                $element.append(`<div class='map-nav-tree'><p class='${rootLevel}'>${initMapName}</p></div>`);
            }

            //初始化全局变量
            if (STATUS.isInit) {
                STATUS.selectedLegend = selectedLegend;
                STATUS.legendStatus = legendStatus;
                STATUS.isInit = false;
            }

            //实例化Element，获取echarts实例
            var myChart = echarts.init($element.find('#echarts3Map')[0]);
            var option = {};

            //setOption
            drawChart(STATUS.mapName, STATUS.mapFileName);

            function drawChart(mapName, mapFileName) {
                $.get(`/extensions/ebi-echarts-map/lib/jsonData/${mapFileName}.json`, function (mapJSON) {
                    echarts.registerMap(mapName, mapJSON, {})
                    option.backgroundColor = layout.echartsMap.bgColor;
                    option.scaleLimit = { min: 1.15, max: 5 };

                    //设置地图表题
                    option.title = {
                        text: layout.echartsMap.mapTitle,
                        left: 'center',
                        textStyle: {
                            color: '#fff'
                        }
                    }

                    //设置图例
                    option.legend = {
                        orient: 'vertical',
                        left: 10,
                        top: 10,
                        show: layout.echartsMap.legendSwitch,
                        selectedMode: 'single',
                        data: legendNameList,
                        selected: legendStatus,
                        inactiveColor: 'rgba(222,222,222,0.5)',
                        textStyle: {
                            color: 'orange',
                            fontSize: 14
                        }
                    }

                    //设置值域滑块
                    option.visualMap = {
                        type: 'continuous',
                        min: dataRange.min,
                        max: dataRange.max,
                        itemHeight: 100,
                        itemWidth: 16,
                        itemGap: 5,
                        precision: 0,
                        left: 10,
                        bottom: 10,
                        //splitNumber: 5,
                        hoverLink: true,
                        showLabel: true,
                        calculable: true,
                        color: dataRangeColorList[selectedLegend],
                        text: ['高', '低'],
                        textStyle: {
                            color: '#fff',
                            fontSize: 14
                        }
                    };

                    //设置弹出框
                    option.tooltip = {
                        trigger: 'item',
                        formatter: function (param) {
                            //if(layout.echartsMap.mapType === "Area"){
                                var ret = param.data && param.data.value ? param.data.value[2] : 0;
                                return param.name + ': ' + ret;
                            //}
                            //return param.name + ': ' + data.value[2];
                        }
                    };

                    //设置GEO
                    option.geo = {
                        type: 'map',
                        map: STATUS.mapName,
                        roam: false,
                        label: {
                            normal: {
                                show: false,
                                position: 'inside',
                                color: 'rgba(222,222,222,0.5)',
                                formatter: function (data) {
                                    return data.name;
                                }
                            },
                            emphasis: {
                                show: true,
                                position: 'insideBottomLeft',
                                fontSize: 16,
                                color: "white",
                                formatter: function (data) {
                                    return data.name;
                                }
                            }
                        },
                        itemStyle: {
                            normal: {
                                shadowColor: 'rgba(0, 0, 0,0.8)',
                                areaColor: layout.echartsMap.areaColor,
                                borderColor: layout.echartsMap.lineColor
                            },
                            emphasis: {
                                areaColor: 'rgba(0, 0, 0, 0)',
                                show: false,
                                position: 'top'
                            }
                        },
                    };

                    //设置Serise
                    var series = [];
                    $.each(measureNameList, function (i, val) {
                        if(layout.echartsMap.mapType === "Area") {
                            series.push({
                                name: subFlagList[val] ? parent[val] : measureNameList[i],
                                type: 'map',
                                map: STATUS.mapName,
                                coordinateSystem: 'geo',
                                zlevel: 2,
                                label: {
                                    normal: {
                                        show: false,
                                    },
                                    emphasis: {
                                        show: false,
                                    }
                                },
                                data: dataParser.pointDataList[val] //Pop Data
                            });
                        }
                        else {
                            if (lineFlag[val]) {
                                series.push({
                                    //航线
                                    name: subFlagList[val] ? parent[val] : measureNameList[i],
                                    type: 'lines',
                                    zlevel: 2,
                                    smooth: true,
                                    selectedMode: false,
                                    tooltip: {
                                        formatter: function (params) {
                                            var str = params.data.fromName + '→' + params.data.toName + '<br>' + params.seriesName + ': ' + params.data.value;
                                            return str;
                                        }
                                    },
                                    effect: {
                                        show: true,
                                        period: 10,
                                        trailLength: 0,
                                        symbol: planePath,
                                        shadowBlur: 0,
                                        symbolSize: 15,
                                        shadowColor: 'rgba(0, 0, 0, 0.5)',
                                        shadowBlur: 10
                                    },
                                    lineStyle: {
                                        normal: {
                                            color: '#65A2C2',
                                            width: 1,
                                            opacity: 0.5,
                                            curveness: -0.2
                                        }
                                    },
                                    data: lineFlag[val] ? dataParser.lineDataList[val] : []
                                },{
                                    //中心点
                                    name: subFlagList[val] ? parent[val] : measureNameList[i],
                                    type: 'effectScatter',
                                    coordinateSystem: 'geo',
                                    zlevel: 10,
                                    label: {
                                        normal: {
                                            show: false,
                                        },
                                        emphasis: {
                                            show: false,
                                        }
                                    },
                                    symbol: chinaFlag,
                                    symbolSize: 18,
                                    data: centerNodeList[val]
                                });
                            };
                            series.push({
                                name: subFlagList[val] ? parent[val] : measureNameList[i],
                                type: 'effectScatter',
                                coordinateSystem: 'geo',
                                zlevel: 2,
                                rippleEffect: {
                                    period: 4,
                                    brushType: 'stroke',
                                    scale: hypercube.qMeasureInfo[i].echartsMap.animation ? 3 : 0,
                                    trailLength: 4,
                                },
                                label: {
                                    normal: {
                                        show: false,
                                        position: 'right',
                                        color: 'white',
                                        fontSize: layout.echartsMap.titleFontSize
                                    },
                                    emphasis: {
                                        show: false,
                                    }
                                },
                                symbol: symbolStyle[val],
                                symbolSize: function (data) {
                                    var max = dataParser.getRangeData(pureData[val]).max;
                                    var size = dataParser.getSymbolSize(data[2], max, symbolMode[val], val);
                                    return size;
                                },
                                data: dataParser.pointDataList[val]
                            });
                        }
                    });

                    //设置Option
                    option.series = series;

                    myChart.setOption(option);
                })
            };

            //设置点事件
            myChart.off('click');
            myChart.on('click', function (params) {
                var name = params.name;
                if (params.componentType === "series" && params.componentSubType != "map") {
                    if (tools.isNotNull(params.name) && layout.echartsMap.eventSwitch) {
                        app.field(dimName).selectValues([{
                            qText: name
                        }], true, true);
                        
                    }
                } else if (params.componentType === "geo" || params.componentSubType === "map") {
                    if (provinceDrilldown) {
                        app.field(dimName).selectValues([{
                            qText: name
                        }], false, false);
                        if(!mapMapping[name]) {
                            return;
                        }
                        $element.parent()[0].attributes.STATUS.mapName = name;
                        $element.parent()[0].attributes.STATUS.mapFileName = mapMapping[name].fileName;
                        addMapTreeNode(name, mapMapping[name].level);
                        STATUS.isInit = false;
                    }
                    else {
                        app.field(dimName).selectValues([{
                            qText: name
                        }], false, false);
                    }
                }
            });

            //图例切换
            myChart.off('legendselectchanged');
            myChart.on('legendselectchanged', function (param) {
                var selected = param.name;
                $element.parent()[0].attributes.STATUS.selectedLegend = selected;
                $element.parent()[0].attributes.STATUS.legendStatus = param.selected;
                option.visualMap = dataParser.getRangeData(pureData[selected]);
                option.visualMap.color = dataRangeColorList[selected];
                option.legend.selected = param.selected;
                option.geo.map = STATUS.mapName;
                myChart.setOption(option);
                $element.parent()[0].attributes.STATUS.isInit = false;
            });
            $element.parent()[0].attributes.STATUS = STATUS;

            var dimMapping = {
                country: "国家",
                province: "省份",
                city: "地市"
            }

            function addMapTreeNode(name, level) {
                $element.find(".map-nav-tree").append(`<i class='next ${level}'>-></i><p class='${level}'>${name}</p>`);
                $element.find(`.map-nav-tree p`).click(function () {
                    var name = $(this).html();
                    var level = $(this).attr("class");
                    if(level === "world") {
                        $element.find(".map-nav-tree").find(".country,.province,.city").remove();
                        app.field("国家").clear();//-----
                        app.field("省份").clear();//-----
                    }
                    else if(level === "country"){
                        $element.find(".map-nav-tree").find(".province,.city").remove();
                        app.field("省份").clear();//-----
                    }
                    else if(level === "province"){
                        $element.find(".map-nav-tree").find(".city").remove();
                        app.field("地市").clear();//-----
                    }
                    $element.parent()[0].attributes.STATUS.mapName = name;
                    $element.parent()[0].attributes.STATUS.mapFileName = mapMapping[name].fileName;
                    //drawChart(name, mapMapping[name].fileName);
                    app.field(dimMapping[level]).selectValues([{
                        qText: name
                    }], false, false);
                    
                });
            }

            myChart.resize();
            //});
            return qlik.Promise.resolve();
        }
    }
);