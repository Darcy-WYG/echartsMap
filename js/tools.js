function ToolsUnit() {
    var self = new Object();

    self.createRandId = function () {
        var arrName = ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', 'a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', 'z', 'x', 'c', 'v', 'b', 'n', 'm'];
        var num1 = parseInt(Math.random() * arrName.length);
        var num2 = parseInt(Math.random() * arrName.length);
        var num3 = parseInt(Math.random() * arrName.length);
        var num4 = parseInt(Math.random() * arrName.length);
        return arrName[num1] + arrName[num2] + arrName[num3] + arrName[num4];
    };

    self.isNotNull = function(str) {
        if (str === null || str === '' || str === undefined || str === 0 || str.length === 0) {
            return false;
        }
        return true;
    }

    self.getCube = function(app, qDimensions, qMeasures, callback) {
        var params = {
            qInitialDataFetch: [{
                qTop: 0,
                qLeft: 0,
                qHeight: 100,
                qWidth: 100
            }]
        };
        var _initParam = function (arr, type) {
            if (arr.length === 0) {
                return [];
            } else {
                var list = [];
                var item = {};
                arr.forEach(function (name) {
                    if (type === "measure") {
                        item = {
                            qDef: {
                                qDef: name
                            }
                        }
                    } else if(type === "dimension") {
                        item = {
                            qDef: {
                                qFieldDefs: [name]
                            }
                        }
                    }
                    list.push(item);
                });
                return list;
            }
        }
        var rows = {}, grandTotal;
        params.qDimensions = _initParam(qDimensions, "dimension");
        params.qMeasures = _initParam(qMeasures, "measure");

        app.createCube(params, function (reply) {
            rows = reply.qHyperCube.qDataPages[0].qMatrix;
            grandTotal = reply.qHyperCube.qGrandTotalRow;
            callback(grandTotal,rows);
        });
    }

    self.mergeMapMapping = function(worldCountry, chinaProvince, chinaCity) {
        var result = { world: {fileName: "world", level: "world"}};
        $.each(worldCountry, function(key, value){
            result[key] = {fileName: value.mapFileName, level: "country"};
        });

        $.each(chinaProvince, function(key, value){
            result[key] = {fileName: value, level: "province"};
        });

        $.each(chinaCity, function(key, value){
            result[key] = {fileName: value, level: "city"};
        });

        return result;
    }

    self.setAppParam = function (qlik, name, value) {
        qlik.backendApi.getProperties().then(function(reply) {
            reply.anychart[name] = value;
            view.backendApi.setProperties(reply);
          });
    }

    return self;
}

