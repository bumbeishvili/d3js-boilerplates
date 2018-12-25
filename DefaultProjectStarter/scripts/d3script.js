/*  

This code is based on following convention:

https://github.com/bumbeishvili/d3-coding-conventions/blob/84b538fa99e43647d0d4717247d7b650cb9049eb/README.md


*/

function Chart() {
	// Exposed variables
	var attrs = {
		id: 'ID' + Math.floor(Math.random() * 1000000), // Id for event handlings
		svgWidth: 400,
		svgHeight: 400,
		marginTop: 5,
		marginBottom: 5,
		marginRight: 5,
		marginLeft: 5,
		container: 'body',
		defaultTextFill: '#2C3E50',
		defaultFont: 'Helvetica',
		data: null
	};

	//InnerFunctions which will update visuals
	var updateData;

	//Main chart object
	var main = function() {
		//Drawing containers
		var container = d3.select(attrs.container);
		var containerRect = container.node().getBoundingClientRect();
		if (containerRect.width > 0) attrs.svgWidth = containerRect.width;

		//Calculated properties
		var calc = {};
		calc.id = 'ID' + Math.floor(Math.random() * 1000000); // id for event handlings
		calc.chartLeftMargin = attrs.marginLeft;
		calc.chartTopMargin = attrs.marginTop;
		calc.chartWidth = attrs.svgWidth - attrs.marginRight - calc.chartLeftMargin;
		calc.chartHeight = attrs.svgHeight - attrs.marginBottom - calc.chartTopMargin;

		//Add svg
		var svg = container
			.patternify({ tag: 'svg', selector: 'svg-chart-container' })
			.attr('width', attrs.svgWidth)
			.attr('height', attrs.svgHeight)
			.attr('font-family', attrs.defaultFont);

		//Add container g element
		var chart = svg
			.patternify({ tag: 'g', selector: 'chart' })
			.attr('transform', 'translate(' + calc.chartLeftMargin + ',' + calc.chartTopMargin + ')');

		// REMOVE THIS SNIPPET AFTER YOU START THE DEVELOPMENT
		chart
			.patternify({ tag: 'text', selector: 'example-text', data: [ attrs.data.message ] })
			.text((d) => d)
			.attr('x', 10)
			.attr('y', 20);

		// Smoothly handle data updating
		updateData = function() {};

		//#########################################  UTIL FUNCS ##################################

		d3.select(window).on('resize.' + attrs.id, function() {
			var containerRect = container.node().getBoundingClientRect();
			if (containerRect.width > 0) attrs.svgWidth = containerRect.width;
			main();
		});
	};

	//----------- PROTOTYPE FUNCTIONS  ----------------------
	d3.selection.prototype.patternify = function(params) {
		var container = this;
		var selector = params.selector;
		var elementTag = params.tag;
		var data = params.data || [ selector ];

		// Pattern in action
		var selection = container.selectAll('.' + selector).data(data, (d, i) => {
			if (typeof d === 'object') {
				if (d.id) {
					return d.id;
				}
			}
			return i;
		});
		selection.exit().remove();
		selection = selection.enter().append(elementTag).merge(selection);
		selection.attr('class', selector);
		return selection;
	};

	//Dynamic keys functions
	Object.keys(attrs).forEach((key) => {
		// Attach variables to main function
		return (main[key] = function(_) {
			var string = `attrs['${key}'] = _`;
			if (!arguments.length) {
				return eval(` attrs['${key}'];`);
			}
			eval(string);
			return main;
		});
	});

	//Set attrs as property
	main.attrs = attrs;

	//Exposed update functions
	main.data = function(value) {
		if (!arguments.length) return attrs.data;
		attrs.data = value;
		if (typeof updateData === 'function') {
			updateData();
		}
		return main;
	};

	// Run  visual
	main.render = function() {
		main();
		return main;
	};

	return main;
}
