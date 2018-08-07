define([], function() {
    var provinceDrilldown = {
        type: "boolean",
        component: "switch",
        label: "省份下钻",
        ref: "echartsMap.provinceDrilldown",
        options: [{
            value: true,
            label: "开启"
        }, {
            value: false,
            label: "关闭"
        }],
        defaultValue: false
    };

	var provinceDim = {
        label: "维度名称",
        type: "string",
        expression: "optional",
        ref: "echartsMap.provinceDim",
        show: function (data) {
            return data.echartsMap.provinceDrilldown;
        }
    };

    return {
        type: "items",
        label: "省份设置",
        items: {
            provinceDrilldown: provinceDrilldown,
			provinceDim: provinceDim
        }
    };
});
