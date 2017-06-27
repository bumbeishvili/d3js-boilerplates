# d3js-boilerplate
D3 js templates for fast initial setup



**Reusable Snippets**


## Colors
 

#### Metronic Dark Color Palette
[Pen](https://codepen.io/bumbeishvili/pen/xrrzzQ?editors=1010)
```
 var METRONIC_DARK_COLORS  = ["#c5bf66","#BF55EC","#f36a5a","#EF4836","#9A12B3","#c8d046","#E26A6A",
 "#32c5d2","#8877a9","#ACB5C3","#e35b5a","#2f353b","#e43a45","#f2784b",
 "#796799","#26C281","#555555","#525e64","#8E44AD","#4c87b9","#bfcad1",
 "#67809F","#578ebe","#c5b96b","#4DB3A2","#e7505a","#D91E18","#1BBC9B",
 "#3faba4","#d05454","#8775a7","#8775a7","#8E44AD","#f3c200","#4B77BE",
 "#c49f47","#44b6ae","#36D7B7","#94A0B2","#9B59B6","#E08283","#3598dc",
 "#F4D03F","#F7CA18","#22313F","#2ab4c0","#5e738b","#BFBFBF","#2C3E50",
 "#5C9BD1","#95A5A6","#E87E04","#29b4b6","#1BA39C"]
```
 
#### Multiple color interpolation  
[Pen](https://codepen.io/bumbeishvili/pen/bReoMP?editors=1010)
```javascript
var color = d3.interpolateRgbBasis(["red", "yellow","green"]);

color(0) // red  - rgb(255, 0, 0)
color(0.5) // yellow - rgb(213, 191, 0)
color(1) // green - rgb(0, 128, 0)
color(0.25) // something between red and yellow -  orange - rgb(250, 120, 0)
color(0.75) // something between yellow and green -  rgb(122, 184, 0)

```



## Positioning

[fiddle - check legends positions](https://jsfiddle.net/uxLze316/1/)

#### Adjusting legend positions horizontally
```javascript
 var startX = 0;
 wrappers.each(function (d, i, arr) {
      var wrapper = d3.select(this);
      var text = wrapper.select('text');
      var bbox = text.node().getBBox();
      wrapper.attr('transform', 'translate(' + startX + ',-30)');
      startX += bbox.width + 35;
})
```




## Components

#### Svg Tooltip Invoking
[Pen](https://codepen.io/bumbeishvili/pen/zzBRBq?editors=0110) 

```javascript
 points
  .on("mouseenter", function(d) {
    var circle = d3.select(this);
    var params = {
      isDisplayed: true,
      container: svg,
      x: circle.attr("cx"),
      y: circle.attr("cy"),
      hoveredElement: d,
      filterUrl: calc.dropShadowUrl,
      direction: ["left", "top", "right", "bottom"][posIndex++%4]
    };
    console.log(params);
    displayTooltip(params);
  })
  .on("mouseleave", function(d) {
    displayTooltip({
      isDisplayed: false,
      container: svg
    });
```

###### tooltip component drawing  




```javascript
function displayTooltip(params) {
  var isDisplayed = params.isDisplayed;
  var container = params.container;
  var x = +params.x;
  var y = +params.y;
  var hoveredElement = params.hoveredElement;
  var filterUrl = params.filterUrl;
  var direction = params.direction;

  var tooltipProps = {
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
    rows: [
      {
        left: "Id",
        right: "{id}"
      },
      {
        left: "{xItemId} => {yItemId}",
        right: "${value}M"
      },
      {
        left: "Total Value",
        right: "${totalValue}K"
      }
    ]
  };

  container.selectAll(".tooltipContent").remove();

  if (!isDisplayed) {
    return;
  }

  var tooltipContentWrapper = container
    .append("g")
    .attr("class", "tooltipContent")
    .attr("pointer-events", "none");

  var tooltipWrapper = tooltipContentWrapper
    .append("g")
    .style("pointer-events", "none");

  tooltipWrapper.append("path");

  var g = tooltipWrapper.append("g");

  var rows = g
    .selectAll(".rows")
    .data(tooltipProps.rows)
    .enter()
    .append("g")
    .attr("font-size", tooltipProps.fontSize)
    .attr("dominant-baseline", "middle")
    .attr("fill", tooltipProps.textColor)
    .attr(
      "transform",
      (d, i) =>
        `translate(${tooltipProps.contentMargin},${i *
          tooltipProps.tooltipRowHeight +
          tooltipProps.heightOffset +
          tooltipProps.contentMargin})`
    );

  rows
    .append("text")
    .attr("class", "left")
    .attr("y", tooltipProps.tooltipRowHeight / 3)
    .attr("x", tooltipProps.leftMargin)
    .text(d => replaceWithProps(d.left, hoveredElement))
    .attr("text-anchor", "start");
  rows
    .append("text")
    .attr("class", "right")
    .attr("y", tooltipProps.tooltipRowHeight / 3)
    .attr("x", tooltipProps.rightMargin)
    .text(d => replaceWithProps(d.right, hoveredElement))
    .attr("text-anchor", "end");

  var maxWidth = 0;
  rows.each(function(g) {
    var row = d3.select(this);
    var currentWidth =
      row.select(".left").node().getBBox().width +
      row.select(".right").node().getBBox().width +
      tooltipProps.minSpaceBetweenColumns;

    if (currentWidth > maxWidth) {
      maxWidth = currentWidth;
    }
  });

  rows.select(".right").attr("x", maxWidth);

  maxWidth += tooltipProps.leftMargin + tooltipProps.rightMargin;

  var height =
    tooltipProps.tooltipRowHeight * tooltipProps.rows.length +
    tooltipProps.contentMargin * 2 -
    tooltipProps.heightOffset +
    tooltipProps.tooltipRowHeight / 3;
  var halfArrowLength = tooltipProps.arrowLength / 2;
  var halfWidth = maxWidth / 2;
  var fullWidth = maxWidth;
  var halfHeight = height / 2;

  var strPath = `M 0 0 

                ${direction != "left"
                  ? ""
                  : `  L 0 ${halfHeight - halfArrowLength}
                       L   ${-tooltipProps.arrowHeight} ${halfHeight}
                       L 0 ${halfHeight + halfArrowLength}  `}

                L 0  ${height} 
                
                ${direction != "bottom"
                  ? ""
                  : ` L ${halfWidth - halfArrowLength}  ${height} 
                                        L ${halfWidth} ${height +
                      tooltipProps.arrowHeight} 
                                        L ${halfWidth +
                                          halfArrowLength} ${height}`}
               
                L ${fullWidth} ${height}  

               ${direction != "right"
                 ? ""
                 : ` L ${fullWidth} ${halfHeight - halfArrowLength}
                                    L  ${fullWidth +
                                      tooltipProps.arrowHeight} ${halfHeight}
                                    L ${fullWidth} ${halfHeight +
                     halfArrowLength}  `}

                
                L ${fullWidth} 0 
                
                ${direction != "top"
                  ? ""
                  : `L ${halfWidth + halfArrowLength} 0  
                                      L ${halfWidth} ${-tooltipProps.arrowHeight} 
                                      L ${halfWidth - halfArrowLength}  0 
                                     `}

                 L 0 0 `;

  var tooltipTranslateConfig = {
    left: {
      x: halfWidth + tooltipProps.arrowHeight,
      y: halfHeight + tooltipProps.arrowHeight
    },
    bottom: {
      x: 0,
      y: 0
    },
    right: {
      x: -(halfWidth + tooltipProps.arrowHeight),
      y: halfHeight + tooltipProps.arrowHeight
    },
    top: {
      x: 0,
      y: height + 2 * tooltipProps.arrowHeight
    }
  };

  // if(y < 0)
  // {
  tooltipContentWrapper.attr(
    "transform",
    `translate(${+x + +tooltipTranslateConfig[direction].x},${y +
      tooltipTranslateConfig[direction].y})`
  );
  // }

  tooltipWrapper
    .select("path")
    .attr(
      "d",
      `M 0 0  
                L 0 100 
                L 121 99 
                L 143 132 
                L 165 99 
                L 300 100 
                L 300 0 
                L 0 0 `
    )
    .attr("d", strPath)
    .attr("fill", tooltipProps.tooltipFill)
    .attr("filter", `url(#${filterUrl})`);

  //wrapper polyline

  tooltipWrapper
 
    .append("polyline") // attach a polyline
   .style('display','none')
    .style("stroke", "black") // colour the line
    .style("fill", "none") // remove any fill colour
    .attr(
      "points",
      `

                ${direction != "left"
                  ? ""
                  : `  0 ${halfHeight - halfArrowLength}
                       ${-tooltipProps.arrowHeight} ${halfHeight}
                        0 ${halfHeight + halfArrowLength}  `}

                

                     0,${height}, 
                             ${direction != "bottom"
                    ? ""
                    : `  ${halfWidth - halfArrowLength}  ${height} 
                                                     ${halfWidth} ${height +
                        tooltipProps.arrowHeight} 
                                                   ${halfWidth +
                                                     halfArrowLength} ${height}`}
                     

                     ${fullWidth}, ${height}
${fullWidth}, ${0}
${0}, ${0}
0,${height}

`
    ); // x,y points
  // .attr("points", "100,50, 200,150, 300,50");  // x,y points
/*
  rows
    .append("rect")
    .attr("width", fullWidth)
    .attr("height", 1)
    .attr("x", -tooltipProps.contentMargin)
    .attr("y", -tooltipProps.heightOffset);
    */

  /*


  tooltipWrapper
    .append("rect")
    .attr("width", 1)
    .attr("height", height)
    .attr("x", fullWidth);
  tooltipWrapper
    .append("rect")
    .attr("width", 1)
    .attr("height", height)
    .attr("x", 0);
    
    */

  tooltipWrapper.attr(
    "transform",
    `translate(${-halfWidth},${-height - tooltipProps.arrowHeight})`
  );
}

```

