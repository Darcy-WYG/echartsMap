define([],
function() {
    var symbolMode = {
        type: "string",
        component: "dropdown",
        label: "点大小设置",
        ref: "qDef.echartsMap.symbolMode",
        options: [{
            value: 0,
            label: "大小固定"
        },
        {
            value: 1,
            label: "依据数据"
        },
		{
            value: 2,
            label: "平滑渐变"
        }],
        defaultValue: 1
    };
	
	var symbolStyle = {  
        type: "string",
        component: "dropdown",
        label: "点样式设置",
        ref: "qDef.echartsMap.symbolStyle",
        options: [{
            value: "circle",
            label: "circle"
        },
        {
            value: "rect",
            label: "rect"
        },
        {
            value: "roundRect",
            label: "roundRect"
        },
        {
            value: "triangle",
            label: "triangle"
        },
        {
            value: "diamond",
            label: "diamond"
        },
        {
            value: "pin",
            label: "pin"
        },
        {
            value: "arrow",
            label: "arrow"
        }],
        defaultValue: "circle"
    };

    var symbolSize = {
        type: "array",
        component: "slider",
        label: "气泡大小",
        ref: "qDef.echartsMap.symbolSize",
        min: 2,
        max: 30,
        step: 1,
        defaultValue: [5, 20]
    };

    var animation = {
        type: "boolean",
        component: "switch",
        label: "动画效果",
        ref: "qDef.echartsMap.animation",
        options: [{
            value: true,
            label: "显示"
        },
        {
            value: false,
            label: "隐藏"
        }],
        defaultValue: true
    }
	
	var lineType = {
		type: "string",
		component: "dropdown",
		label: "集散方式",
		ref: "qDef.echartsMap.lineType",
		options: [{
			value: 0,
			label: "None"
		},{
			value: 1,
			label: "聚集"
		},{
			value: 2,
			label: "发散"
		}],
		defaultValue: 0
	};
		
	var center = {
		ref: "qDef.echartsMap.center",
		label: "中心点名称",
		expression: "optional",
		type: "string",
		show: function ( data ) {
			return data.qDef.echartsMap.lineType != 0;
		},
		defaultValue: "北京"
	};
	
	var centerLong = {
		ref: "qDef.echartsMap.centerLong",
		label: "中心点经度",
		expression: "optional",
		type: "number",
		show: function ( data ) {
			return data.qDef.echartsMap.lineType != 0;
		},
		defaultValue: 116.403963
	};
	
	var centerLat = {
		ref: "qDef.echartsMap.centerLat",
		label: "中心点纬度",
		expression: "optional",
		type: "number",
		show: function ( data ) {
			return data.qDef.echartsMap.lineType != 0;
		},
		defaultValue: 39.915119
	};
	
	var centerValue = {
		ref: "qDef.echartsMap.centerValue",
		label: "中心点值",
		expression: "optional",
		type: "number",
		show: function ( data ) {
			return data.qDef.echartsMap.lineType != 0;
		}
	};
	
	var subNodeSwitch = {
        type: "boolean",
        component: "switch",
        label: "是否为子度量",
        ref: "qDef.echartsMap.subNode",
        options: [{
            value: true,
            label: "是"
        },
        {
            value: false,
            label: "否"
        }],
        defaultValue: false
    }
	
	var parentNode = {
		ref: "qDef.echartsMap.parentNode",
		label: "父度量名称",
		type: "string",
		show: function ( data ) {
			return data.qDef.echartsMap.subNode;
		}
	};
	
	var defaultMeasure = {
		type: "boolean",
		label: "设为默认度量",
		ref: "qDef.echartsMap.defaultMeasure",
		defaultValue: false,
		show: function(data) {
			return !data.qDef.echartsMap.subNode;
		}
	}
	
	var effectColor = {
        ref: "qDef.echartsMap.effectColor",
        label: "动画颜色（单一色值）",
        type: "string",
        //defaultValue: "green",
		show: function(data) {
			return data.qDef.echartsMap.animation;
		}
    };
	
	var dataRangeColor = {
        ref: "qDef.echartsMap.dataRangeColor",
		//component: 'expression',
        label: "坐标点颜色（以 | 分隔）",
        type: "string",
        defaultValue: "green|snow"
    };
	
	var maxLineNum = {
		ref: "qDef.echartsMap.maxLineNum",
		label: "航线显示数量",
		expression: "optional",
		type: "number",
		show: function ( data ) {
			return data.qDef.echartsMap.lineType != 0;
		},
		defaultValue: 10
	};
	
    return {
        symbolMode: symbolMode,
		symbolStyle: symbolStyle,
        symbolSize: symbolSize,
		animation: animation,
		effectColor: effectColor,
		lineType: lineType,
		maxLineNum: maxLineNum,
		center: center,
		centerLong: centerLong,
		centerLat: centerLat,
		centerValue: centerValue,
		subNodeSwitch: subNodeSwitch,
		parentNode: parentNode,
		dataRangeColor: dataRangeColor,
		defaultMeasure: defaultMeasure
    };
});