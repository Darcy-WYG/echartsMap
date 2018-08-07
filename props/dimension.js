define([],
    function () {
        var longitude = {
            type: 'string',
            component: 'expression',
            label: '经度',
            ref: 'qAttributeExpressions.0.qExpression'
        }

        var latitude = {
            type: 'string',
            component: 'expression',
            label: '经度',
            ref: 'qAttributeExpressions.1.qExpression'
        }
        return {
            longitude: longitude,
            latitude: latitude
        };
    });