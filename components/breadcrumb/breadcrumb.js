/*  

This code is based on following convention:

https://github.com/bumbeishvili/d3-coding-conventions

*/

d3.breadcrumb = function (params) {

  // exposed variables
  var attrs = {
    container: 'body',
    padding: 5,
    width: 130,
    height: 28,
    top: 10,
    fontSize: 14,
    marginLeft: 0,
    marginTop: 10,
    leftDirection: false,
    wrapWidth: 0,
    data: null
  };

  var defaultColors = ["#c5bf66", "#BF55EC", "#f36a5a", "#EF4836", "#9A12B3", "#c8d046", "#E26A6A",
    "#32c5d2", "#8877a9", "#ACB5C3", "#e35b5a", "#2f353b", "#e43a45", "#f2784b",
    "#796799", "#26C281", "#555555", "#525e64", "#8E44AD", "#4c87b9", "#bfcad1",
    "#67809F", "#578ebe", "#c5b96b", "#4DB3A2", "#e7505a", "#D91E18", "#1BBC9B",
    "#3faba4", "#d05454", "#8775a7", "#8775a7", "#8E44AD", "#f3c200", "#4B77BE",
    "#c49f47", "#44b6ae", "#36D7B7", "#94A0B2", "#9B59B6", "#E08283", "#3598dc",
    "#F4D03F", "#F7CA18", "#22313F", "#2ab4c0", "#5e738b", "#BFBFBF", "#2C3E50",
    "#5C9BD1", "#95A5A6", "#E87E04", "#29b4b6", "#1BA39C"]

  /*############### IF EXISTS OVERWRITE ATTRIBUTES FROM PASSED PARAM  #######  */

  var attrKeys = Object.keys(attrs);
  attrKeys.forEach(function (key) {
    if (params && params[key]) {
      attrs[key] = params[key];
    }
  })

  //innerFunctions which will update visuals
  var updateData;
  var showBreadcrumbs;
  var hideBreadcrumbs;

  //main chart object
  var main = function (selection) {
    selection.each(function scope() {
      console.log('runned')
      var breadcrumbTrail;
      // #################################   BREADCRUMB SHOW   ##############################
      function breadcrumbShow(array, d) {


        var sequenceArray = attrs.data;

        var g = breadcrumbTrail.selectAll('g')
          .data(sequenceArray, d => d.id)

        g.exit().remove();
        var entering = g.enter().append('svg:g').style('pointer-events', 'none')
        entering.append("svg:polygon")
          .style('fill', (d, i) => {
            if (d.fill) return d.fill;
            return defaultColors[i % defaultColors.length];
          })

        var enteredText = entering.append('svg:text').attr("x", 20).attr("y", attrs.height / 2).attr("dy", "0.4em").attr("text-anchor", "start").attr('fill', 'white')
          // .attr('font-size', _var.fontSizes.sequenceFontSize)
          .attr('font-weight', 100)
          .attr('font-size', d => {
            return d.fontSize ? d.fontSize : attrs.fontSize;
          })
          .text(function (d) { return d.text; });

        if (attrs.leftDirection) {
          enteredText.attr('text-anchor', 'middle')
        }

        var all = entering.merge(g)
          .attr('class', 'breadcrumbs')
          .attr('transform', function (d, i) {
            return 'translate(0,0)'
          });

        var startX = attrs.marginLeft;
        var lastYDiv = 0;
        all.each(function (d, i, arr) {
          var wrapper = d3.select(this);
          var text = wrapper.select('text');
          var bbox = text.node().getBBox();

          var yDiv;



          if (attrs.wrapWidth == 0) {
            yDiv = 0;
          } else {
            yDiv = Math.floor(startX / attrs.wrapWidth);
            if (yDiv > lastYDiv) {
              startX = yDiv * attrs.wrapWidth;
              lastYDiv = yDiv;
            }
          }


          wrapper.attr('transform', 'translate(' + (startX - yDiv * attrs.wrapWidth) + ',' + yDiv * (attrs.height + attrs.marginTop) + ')');
          var poligons = wrapper.select('polygon')

          if (attrs.leftDirection) {
            poligons.attr('points', rotatedBreadcrumbPoints(d, i, arr, bbox.width + 35));
          } else {
            poligons.attr('points', breadcrumbPoints(d, i, arr, bbox.width + 35));
          }


          startX += bbox.width + 35 + attrs.padding;
        })


        g.exit().remove();
        breadcrumbTrail.selectAll('.breadcrumbs').attr('visibility', '')
      }

      function breadcrumbPoints(d, i, arr, width) {
        var points = [];
        if (width) {
          attrs.width = width;
        }
        points.push("0,0");
        points.push(attrs.width + ",0");
        if (i < (arr.length - 1)) {
          points.push(attrs.width + attrs.top + "," + (attrs.height / 2));
        }
        points.push(attrs.width + "," + attrs.height);
        points.push("0," + attrs.height);
        if (i > 0) {
          points.push(attrs.top + "," + (attrs.height / 2));
        }
        return points.join(" ");
      }

      function rotatedBreadcrumbPoints(d, i, arr, width) {
        var points = [];
        if (width) {
          attrs.width = width;
        }
        points.push("0,0");

        points.push(attrs.width + ",0");
        if (i < (arr.length - 1)) {
          points.push(attrs.width - attrs.top + "," + (attrs.height / 2));
        }
        points.push(attrs.width + "," + attrs.height);
        points.push("0," + attrs.height);
        if (i > 0) {
          points.push(-attrs.top + "," + (attrs.height / 2));
        }
        return points.join(" ");
      }


      // smoothly handle data updating
      updateData = function () {
        // we don't using that yet
      };

      showBreadcrumbs = function () {
        if (!(attrs.container instanceof d3.selection)) {
          attrs.container = d3.select(attrs.container);
        }
        breadcrumbTrail = attrs.container.patternify({ tag: 'g', selector: "breadcrumb-trail" });
        breadcrumbShow(breadcrumbTrail);
      }

      hideBreadcrumbs = function () {
        attrs.data = [];
        breadcrumbTrail.selectAll('g').remove();
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

  main.show = function (data) {
    attrs.data = data;
    attrs.data.forEach(d => d.id = d.text);
    showBreadcrumbs();
  }

  main.hide = function () {
    hideBreadcrumbs();
  }

  return main.run();

}
