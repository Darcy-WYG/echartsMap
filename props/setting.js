define([], function() {
	var mapName = {
        type: "string",
        component: "dropdown",
        label: "地图名称",
        ref: "echartsMap.mapName",
        options: [{
            value: "China",
            label: "China"
        }, {
            value: "world",
            label: "World"
        }],
        defaultValue: "China"
    };

    var mapType = {
        type: "string",
        component: "dropdown",
        label: "地图类型",
        ref: "echartsMap.mapType",
        options: [{
            value: "Area",
            label: "区域图"
        }, {
            value: "point",
            label: "点图"
        }],
        defaultValue: "point"
    };

    var bgColor = {
    	ref: "echartsMap.bgColor",
        label: "周边背景",
        type: "string",
        defaultValue: "white"
    };
    var areaColor = {
        ref: "echartsMap.areaColor",
        label: "地图背景",
        type: "string",
        defaultValue: "#004981"
    };

    var lineColor = {
        ref: "echartsMap.lineColor",
        label: "边界颜色",
        type: "string",
        defaultValue: "rgba(100,149,237,1)"
	}

	var mapTitle = {
    	ref: "echartsMap.mapTitle",
        label: "名称",
        type: "string",
    };

	var eventSwitch = {
		type: "boolean",
		component: "switch",
		label: "点击事件",
		ref: "echartsMap.eventSwitch",
		options: [{
			value: true,
			label: "On"
		}, {
			value: false,
			label: "Off"
		}],
		defaultValue: false
	};

    var legendSwitch = {
        type: "boolean",
        component: "switch",
        label: "显示图例",
        ref: "echartsMap.legendSwitch",
        options: [{
            value: true,
            label: "On"
        }, {
            value: false,
            label: "Off"
        }],
        defaultValue: true
    };

	var titleSwith = {
        type: "boolean",
        component: "switch",
        label: "显示点名称",
        ref: "echartsMap.titleSwith",
        options: [{
            value: true,
            label: "On"
        }, {
            value: false,
            label: "Off"
        }],
        defaultValue: false
    };

    var titleFontSize = {
        type: "number",
        component: "slider",
        label: "点字体大小",
        ref: "echartsMap.titleFontSize",
        min: 12,
        max: 30,
        step: 1,
        defaultValue: 18,
        show: function (data) {
            return data.echartsMap.titleSwith;
        }
    };

    return {
        type: "items",
        // component: "expandable-items",
        label: "基本设置",
        items: {
			mapTitle: mapTitle,
            mapName: mapName,
            mapType: mapType,
            areaColor: areaColor,
            lineColor: lineColor,
            bgColor: bgColor,
			eventSwitch: eventSwitch,
            titleSwith: titleSwith,
            legendSwitch: legendSwitch,
            titleFontSize: titleFontSize
        }
    };
});
