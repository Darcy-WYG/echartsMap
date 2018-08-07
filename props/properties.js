define(["./dimension", "./measure", "./setting","./province"],
function(dimension, measures, mapSetting, province) {

    var dimensions = {
        uses: "dimensions",
        min: 0,
        max: 1,
        items: dimension
    };

    var measures = {
        uses: "measures",
        min: 0,
        max: 10, 
        items: measures
    };
	
	var sorting = {
        uses: "sorting"
    };

    return {
        type: "items",
        component: "accordion",
        items: {
            dimensions: dimensions,
            measures: measures,
			sorting: sorting,
            layout1: {
                label: "地图设置",
                component: "expandable-items",
                items: {
                    mapStyle: mapSetting,
                    province: province,
                }
            }
        }
    };
});