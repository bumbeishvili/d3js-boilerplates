




function getChart(params) {
  // exposed variables
  var attrs = {
    svgWidth: 700,
    svgHeight: 700,
    marginTop: 5,
    marginBottom: 5,
    marginRight: 5,
    marginLeft: 5,
    center: [43.5, 44],
    scale: 5000,
    container: 'body',
    geojson: null,
    data: null
  };


  /*############### IF EXISTS OVERWRITE ATTRIBUTES FROM PASSED PARAM  #######  */

  var attrKeys = Object.keys(attrs);
  attrKeys.forEach(function (key) {
    if (params && params[key]) {
      attrs[key] = params[key];
    }
  })


  //innerFunctions
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


      /*##################################   HANDLERS  ####################################### */
      var handlers = {
        zoomed: null
      }

      /*##################################   BEHAVIORS ####################################### */
      var behaviors = {};
      behaviors.zoom = d3.zoom().on("zoom", d => handlers.zoomed(d));

      //################################ DRAWING ######################  
      //drawing containers
      var container = d3.select(this);

      //drawing
      var svg = container.patternify({ tag: 'svg', selector: 'svg-chart-container' })
        .attr('width', attrs.svgWidth)
        .attr('height', attrs.svgHeight)
        .call(behaviors.zoom);
      // .attr("viewBox", "0 0 " + attrs.svgWidth + " " + attrs.svgHeight)
      // .attr("preserveAspectRatio", "xMidYMid meet")


      var chart = svg.patternify({ tag: 'g', selector: 'chart' })
        .attr('width', calc.chartWidth)
        .attr('height', calc.chartHeight)
        .attr('transform', 'translate(' + (calc.chartLeftMargin) + ',' + calc.chartTopMargin + ')')

      /* ############# PROJECTION ############### */
      var projection = d3.geoMercator()
        .scale(attrs.scale)
        .translate([calc.chartWidth / 2, 0])
        .center(attrs.center);

      var path = d3.geoPath()
        .projection(projection);

      /* ##############  DRAWING ################# */
      chart.patternify({ tag: 'path', selector: 'map-path', data: attrs.geojson.features })
        .attr('d', path)
        .attr('fill', d => '#' + (0x1000000 + (Math.random()) * 0xffffff).toString(16).substr(1, 6)) //random color



      /* #############################   HANDLER FUNCTIONS    ############################## */
      handlers.zoomed = function () {
        var transform = d3.event.transform;
        chart.attr('transform', transform);
      }

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
  }


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