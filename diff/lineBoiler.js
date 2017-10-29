/*  

This code is based on following convention:

https://github.com/bumbeishvili/d3-coding-conventions

*/

function renderLineChart(params) {

  // exposed variables
  var attrs = {
    svgWidth: 960,
    svgHeight: 500,
    marginTop: 5,
    marginBottom: 35,
    marginRight: 5,
    marginLeft: 35,
    container: 'body',
    data: null
  };

  /*############### IF EXISTS OVERWRITE ATTRIBUTES FROM PASSED PARAM  #######  */

  var attrKeys = Object.keys(attrs);
  attrKeys.forEach(function (key) {
    if (params && params[key]) {
      attrs[key] = params[key];
    }
  })

  //innerFunctions which will update visuals
  var updateData;

  //main chart object
  var main = function (selection) {
    selection.each(function scope() {

      //calculated properties
      var calc = {}
      calc.chartLeftMargin = attrs.marginLeft;
      calc.chartTopMargin = attrs.marginTop;
      calc.chartWidth = attrs.svgWidth - attrs.marginRight - calc.chartLeftMargin;
      calc.chartHeight = attrs.svgHeight - attrs.marginBottom - calc.chartTopMargin;

      // convert date to correct format
      attrs.data.forEach(d => d.date = new Date(d.date));

      //##########################  SCALES  #####################
      var scales = {};
      scales.x = d3.scaleTime()
        .rangeRound([0, calc.chartWidth])
        .domain(d3.extent(attrs.data, function (d) { return d.date; }));

      scales.y = d3.scaleLinear()
        .rangeRound([calc.chartHeight, 0])
        .domain(d3.extent(attrs.data, function (d) { return d.close; }));

      //##########################  LAYOUTS  ###################
      var layouts = {};

      //line layout
      layouts.line = d3.line()
        .x(function (d) { return scales.x(d.date); })
        .y(function (d) { return scales.y(d.close); });

      //#######################  DRAWING ######################

      //drawing containers
      var container = d3.select(this);

      //add svg
      var svg = container.patternify({ tag: 'svg', selector: 'svg-chart-container' })
        .attr('width', attrs.svgWidth)
        .attr('height', attrs.svgHeight)

      //add container g element
      var chart = svg.patternify({ tag: 'g', selector: 'chart' })
        .attr('transform', 'translate(' + (calc.chartLeftMargin) + ',' + calc.chartTopMargin + ')');

      // add bottom axis
      chart.patternify({ tag: 'g', selector: 'bottom-axis' })
        .attr("transform", "translate(0," + calc.chartHeight + ")")
        .call(d3.axisBottom(scales.x))
        .select(".domain")
        .remove();

      //add left axis
      chart.patternify({ tag: 'g', selector: 'left-axis' })
        .call(d3.axisLeft(scales.y))
        .append("text")
        .attr("fill", "#000")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", "0.71em")
        .attr("text-anchor", "end")
        .text("Price ($)");

      //add line
      chart.patternify({ tag: 'path', selector: 'line', data: [attrs.data] })
        .attr("fill", "none")
        .attr("stroke", "steelblue")
        .attr("stroke-linejoin", "round")
        .attr("stroke-linecap", "round")
        .attr("stroke-width", 1.5)
        .attr("d", layouts.line);

      // smoothly handle data updating
      updateData = function () {

      }
      //#########################################  UTIL FUNCS ##################################

      function debug() {
        if (attrs.isDebug) {
          //stringify func
          var stringified = scope + "";

          // parse variable names
          var groupVariables = stringified
            //match var x-xx= {};
            .match(/var\s+([\w])+\s*=\s*{\s*}/gi)
            //match xxx
            .map(d => d.match(/\s+\w*/gi).filter(s => s.trim()))
            //get xxx
            .map(v => v[0].trim())

          //assign local variables to the scope
          groupVariables.forEach(v => {
            main['P_' + v] = eval(v)
          })
        }
      }
      debug();
    });
  };

  //----------- PROTOTYEPE FUNCTIONS  ----------------------
  d3.selection.prototype.patternify = function (params) {
    var container = this;
    var selector = params.selector;
    var elementTag = params.tag;
    var data = params.data || [selector];

    // pattern in action
    var selection = container.selectAll('.' + selector).data(data)
    selection.exit().remove();
    selection = selection.enter().append(elementTag).merge(selection)
    selection.attr('class', selector);
    return selection;
  }

  //dinamic keys functions
  Object.keys(attrs).forEach(key => {
    // Attach variables to main function
    return main[key] = function (_) {
      var string = `attrs['${key}'] = _`;
      if (!arguments.length) { return eval(` attrs['${key}'];`); }
      eval(string);
      return main;
    };
  });

  //set attrs as property
  main.attrs = attrs;

  //debugging visuals
  main.debug = function (isDebug) {
    attrs.isDebug = isDebug;
    if (isDebug) {
      if (!window.charts) window.charts = [];
      window.charts.push(main);
    }
    return main;
  }

  //exposed update functions
  main.data = function (value) {
    if (!arguments.length) return attrs.data;
    attrs.data = value;
    if (typeof updateData === 'function') {
      updateData();
    }
    return main;
  }

  // run  visual
  main.run = function () {
    d3.selectAll(attrs.container).call(main);
    return main;
  }

  return main;
}
