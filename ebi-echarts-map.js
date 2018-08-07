/*globals define*/
define(["qlik", "jquery", "./props/properties", "./js/tools", "./js/Chart", "css!./style.css"],
	function (qlik, $, props, Tools, Chart, cssContent) {
		'use strict';
		return {
			initialProperties: {
				qHyperCubeDef: {
					qDimensions: [],
					qMeasures: [],
					qInitialDataFetch: [{
						qWidth: 10, 
						qHeight: 50 
					}]
				}
			},
			definition: props,     
			support: {
				snapshot: true, 	
				export: true, 	 	
				exportData: true 	
			},
			paint: function ($element, layout) {
				new Chart(qlik, $element, layout);
				return qlik.Promise.resolve();
			}
		};
	});
