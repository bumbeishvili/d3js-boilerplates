/*  

This code is based on following convention:

https://github.com/bumbeishvili/d3-coding-conventions

*/

d3.componentsTooltip = function d3ComponentsTooltip(params) {
  // exposed variables
  var attrs = {
    svgWidth: 0,
    svgHeight: 0,
    container: "body",
    tooltipRowHeight: 25,
    minSpaceBetweenColumns: 50,
    fontSize: 13,
    arrowHeight: 10,
    arrowLength: 20,
    contentMargin: 0,
    heightOffset: 7,
    textColor: "#2C3E50",
    tooltipFill: "white",
    leftMargin: 10,
    rightMargin: 3,
    transform: { x: 0, y: 0, k: 1 },
    content: [
      {
        left: "info",
        right: "{id}"
      }
    ],
    x: null,
    y: null,
    direction: "bottom", // left , right, top
    data: { id: "you should provide data using .show(d)" }
  };

  /*############### IF EXISTS OVERWRITE ATTRIBUTES FROM PASSED PARAM  #######  */

  var attrKeys = Object.keys(attrs);
  attrKeys.forEach(function(key) {
    if (params && params[key]) {
      attrs[key] = params[key];
    }
  });

  //innerFunctions which will update visuals
  var updateData;
  var displayTooltip;
  var hideTooltip;

  //main chart object
  var main = function(selection) {
    selection.each(function scope() {
      //calculated properties
      var calc = {};

      //drawing containers
      var container = d3.select(this);

      //add shadow svg
      var svg = d3
        .select("body")
        .patternify({ tag: "svg", selector: "tooltip-shadow-wrapper-svg" });

      //add container g element
      var chart = svg.patternify({ tag: "g", selector: "chart" });

      // Add filters ( Shadows)
      var defs = chart.patternify({ selector: "defs-element", tag: "defs" });
      attrs.dropShadowUrl = "drop-shadow–d3-tooltip";

      //Drop shadow filter
      var dropShadowFilter = defs
        .patternify({ selector: "filter-element", tag: "filter" })
        .attr("id", attrs.dropShadowUrl)
        .attr("height", "150%")
        .attr("y", "-30%");
      dropShadowFilter
        .patternify({
          selector: "fe-gaussian-blur-element",
          tag: "feGaussianBlur"
        })
        .attr("in", "SourceAlpha")
        .attr("stdDeviation", 5)
        .attr("result", "blur");
      dropShadowFilter
        .patternify({ selector: "feOffset-element", tag: "feOffset" })
        .attr("in", "blur")
        .attr("dx", 2)
        .attr("dy", 5)
        .attr("result", "offsetBlur");
      dropShadowFilter
        .patternify({ selector: "feFlood-element", tag: "feFlood" })
        .attr("flood-color", "black")
        .attr("flood-opacity", "0.4")
        .attr("result", "offsetColor");
      dropShadowFilter
        .patternify({ selector: "feComposite-element", tag: "feComposite" })
        .attr("in", "offsetColor")
        .attr("in2", "offsetBlur")
        .attr("operator", "in")
        .attr("result", "offsetBlur");
      var feMerge = dropShadowFilter.patternify({
        selector: "feMerge-element",
        tag: "feMerge"
      });
      feMerge
        .patternify({ selector: "feMergeNode-element", tag: "feMergeNode" })
        .attr("in", "offsetBlur");
      feMerge
        .patternify({ selector: "feMergeNode2-element", tag: "feMergeNode" })
        .attr("in", "SourceGraphic");

      // hide tooltip
      hideTooltip = function() {
        attrs.container.selectAll(".tooltipContent").remove();
      };

      //show tooltip
      displayTooltip = function() {
        // assign x and y positions
        var x = attrs.x;
        var y = attrs.y;

        //check container type first and transform if necessary
        if (!(attrs.container instanceof d3.selection)) {
          attrs.container = d3.select(attrs.container);
        }

        // remove tooltipcontent if exists
        attrs.container.selectAll(".total-wrapper").remove();

        console.log(attrs.transform);
        // tooltip content wrapper
        var totalWrapper = attrs.container
          .append("g")
          .attr("class", "total-wrapper")
          .attr("transform", ` scale(${1 / attrs.transform.k})`);

        // tooltip content wrapper
        var tooltipContentWrapper = totalWrapper
          .append("g")
          .attr("class", "tooltipContent")
          .attr("pointer-events", "none");

        //tooltip wrapper
        var tooltipWrapper = tooltipContentWrapper
          .append("g")
          .style("pointer-events", "none");

        //tooltip path
        tooltipWrapper.append("path");

        //row contents wrapper
        var g = tooltipWrapper.append("g");

        //each rows wrapper
        var rows = g
          .selectAll(".rows")
          .data(attrs.content)
          .enter()
          .append("g")
          .attr("font-size", attrs.fontSize)
          .attr("dominant-baseline", "middle")
          .attr("fill", attrs.textColor)
          .attr(
            "transform",
            (d, i) =>
              `translate(${attrs.contentMargin},${i * attrs.tooltipRowHeight +
                attrs.heightOffset +
                attrs.contentMargin})`
          );

        //row left texts
        rows
          .append("text")
          .attr("class", "left")
          .attr("y", attrs.tooltipRowHeight / 3)
          .attr("x", attrs.leftMargin)
          .text(d => replaceWithProps(d.left, attrs.data))
          .attr("text-anchor", "start");

        //row right texts
        rows
          .append("text")
          .attr("class", "right")
          .attr("y", attrs.tooltipRowHeight / 3)
          .attr("x", attrs.rightMargin)
          .text(d => replaceWithProps(d.right, attrs.data))
          .attr("text-anchor", "end");

        // adjusting positions
        var maxWidth = 0;
        rows.each(function(g) {
          var row = d3.select(this);
          var currentWidth =
            row
              .select(".left")
              .node()
              .getBoundingClientRect().width +
            row
              .select(".right")
              .node()
              .getBoundingClientRect().width +
            attrs.minSpaceBetweenColumns;
          if (currentWidth > maxWidth) {
            maxWidth = currentWidth;
          }
        });

        // taking right texts to maximum left width position
        rows.select(".right").attr("x", maxWidth);

        //applying margins
        maxWidth += attrs.leftMargin + attrs.rightMargin;

        //calculating positions
        var height =
          attrs.tooltipRowHeight * attrs.content.length +
          attrs.contentMargin * 2 -
          attrs.heightOffset +
          attrs.tooltipRowHeight / 3;
        var halfArrowLength = attrs.arrowLength / 2;
        var halfWidth = maxWidth / 2;
        var fullWidth = maxWidth;
        var halfHeight = height / 2;

        //building string paths

        var leftArrowPos =
          attrs.direction != "left"
            ? ""
            : `  L 0 ${halfHeight -
                halfArrowLength}   L   ${-attrs.arrowHeight} ${halfHeight} L 0 ${halfHeight +
                halfArrowLength}`;
        var bottomArrowPos =
          attrs.direction != "bottom"
            ? ""
            : ` L ${halfWidth -
                halfArrowLength}  ${height}  L ${halfWidth} ${height +
                attrs.arrowHeight}  L ${halfWidth + halfArrowLength} ${height}`;
        var rightArrowPos =
          attrs.direction != "right"
            ? ""
            : ` L ${fullWidth} ${halfHeight -
                halfArrowLength}   L  ${fullWidth +
                attrs.arrowHeight} ${halfHeight}    L ${fullWidth} ${halfHeight +
                halfArrowLength}  `;
        var topArrowPos =
          attrs.direction != "top"
            ? ""
            : `L ${halfWidth +
                halfArrowLength} 0  L ${halfWidth} ${-attrs.arrowHeight}   L ${halfWidth -
                halfArrowLength}  0   `;

        var strPath = `
            M 0 0 
            ${leftArrowPos}
            L 0  ${height}
            ${bottomArrowPos}
            L ${fullWidth} ${height} 
            ${rightArrowPos} 
            L ${fullWidth} 0 
            ${topArrowPos}
            L 0 0 `;

        // tooltip translation configurations
        var tooltipTranslateConfig = {
          left: {
            x: halfWidth + attrs.arrowHeight,
            y: halfHeight + attrs.arrowHeight
          },
          bottom: {
            x: 0,
            y: 0
          },
          right: {
            x: -(halfWidth + attrs.arrowHeight),
            y: halfHeight + attrs.arrowHeight
          },
          top: {
            x: 0,
            y: height + 2 * attrs.arrowHeight
          }
        };

        x *= attrs.transform.k;
        y *= attrs.transform.k;
        // translate tooltip content based on configuration
        tooltipContentWrapper.attr(
          "transform",
          `translate(${+x + +tooltipTranslateConfig[attrs.direction].x},${y +
            tooltipTranslateConfig[attrs.direction].y})`
        );

        //appending actual path
        tooltipWrapper
          .select("path")
          .attr("d", strPath)
          .attr("fill", attrs.tooltipFill)
          .attr("filter", `url(#${attrs.dropShadowUrl})`);

        //final translation to match provided x and y position
        tooltipWrapper.attr(
          "transform",
          `translate(${-halfWidth},${-height - attrs.arrowHeight})`
        );
      };

      // function to replace dinamically properties from passed object
      function replaceWithProps(text, obj) {
        var keys = Object.keys(obj);
        keys.forEach(key => {
          var stringToReplace = `{${key}}`;
          var re = new RegExp(stringToReplace, "g");
          text = text.replace(re, obj[key]);
        });
        return text;
      }

      // smoothly handle data updating
      updateData = function() {};

      //#########################################  UTIL FUNCS ##################################

      // catch scope variables and assign it to global variable for runtime variable inspection
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
            .map(v => v[0].trim());

          //assign local variables to the scope
          groupVariables.forEach(v => {
            main["P_" + v] = eval(v);
          });
        }
      }
      debug();
    });
  };

  //----------- PROTOTYEPE FUNCTIONS  ----------------------
  d3.selection.prototype.patternify = function(params) {
    var container = this;
    var selector = params.selector;
    var elementTag = params.tag;
    var data = params.data || [selector];

    // pattern in action
    var selection = container.selectAll("." + selector).data(data);
    selection.exit().remove();
    selection = selection
      .enter()
      .append(elementTag)
      .merge(selection);
    selection.attr("class", selector);
    return selection;
  };

  //dinamic keys functions
  Object.keys(attrs).forEach(key => {
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

  //set attrs as property
  main.attrs = attrs;

  //debugging visuals
  main.debug = function(isDebug) {
    attrs.isDebug = isDebug;
    if (isDebug) {
      if (!window.charts) window.charts = [];
      window.charts.push(main);
    }
    return main;
  };

  //exposed update functions
  main.data = function(value) {
    if (!arguments.length) return attrs.data;
    attrs.data = value;
    if (typeof updateData === "function") {
      updateData();
    }
    return main;
  };

  main.show = function(data) {
    if (data) {
      attrs.data = data;
    }
    displayTooltip();
  };

  main.hide = function() {
    hideTooltip();
  };
  // run  visual
  main.run = function() {
    d3.selectAll(attrs.container).call(main);
    return main;
  };

  return main.run();
};

