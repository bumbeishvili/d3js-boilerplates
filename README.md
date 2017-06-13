# d3js-boilerplate
D3 js templates for fast initial setup



**Reusable Snippets**


## Colors
 
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
        displayTooltip(
            true,
            circle.attr("cx"),
            circle.attr("cy") - 5,
            d,
            svg,
            calc.dropShadowUrl
        );
    })
    .on("mouseleave", function(d) {
        displayTooltip(false);
    });
```

###### tooltip component drawing  




```javascript
function displayTooltip(
    isDisplayed,
    x,
    y,
    hoveredElement,
    container,
    filterUrl
) {
    var tooltipProps = {
        tooltipRowHeight: 21,
        minSpaceBetweenColumns: 20,
        fontSize: 13,
        arrowHeight: 10,
        arrowLength: 20,
        contentMargin: 15,
        heightOffset: 7,
        textColor: "#2C3E50",
        tooltipFill: "white",
        rows: [{
            left: "Id",
            right: "{id}"
        }, {
            left: "{xItemId} => {yItemId}",
            right: "${value}M"
        }, {
            left: "Total Value",
            right: "${totalValue}K"
        }]
    };

    svg.selectAll(".tooltipContent").remove();

    if (!isDisplayed) {
        return;
    }

    var tooltipContentWrapper = container
        .append("g")
        .attr("class", "tooltipContent")
        .attr("pointer-events", "none");

    tooltipContentWrapper.attr("transform", `translate(${x},${y})`);

    var tooltipWrapper = tooltipContentWrapper.append("g");

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
        .text(d => replaceWithProps(d.left, hoveredElement))
        .attr("text-anchor", "start");
    rows
        .append("text")
        .attr("class", "right")
        .text(d => replaceWithProps(d.right, hoveredElement))
        .attr("text-anchor", "end");

    var maxWidth = 0;
    rows.each(function(g) {
        var row = d3.select(this);
        var currentWidth =
            row.select(".left").node().getBBox().width +
            row.select(".right").node().getBBox().width +
            tooltipProps.minSpaceBetweenColumns;
        debugger;
        if (currentWidth > maxWidth) {
            maxWidth = currentWidth;
        }
    });

    rows.select(".right").attr("x", maxWidth);

    maxWidth += tooltipProps.contentMargin * 2;

    var height =
        tooltipProps.tooltipRowHeight * tooltipProps.rows.length +
        tooltipProps.contentMargin * 2 -
        tooltipProps.heightOffset;
    var halfArrowLength = tooltipProps.arrowLength / 2;
    var halfWidth = maxWidth / 2;
    var fullWidth = maxWidth;

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
        .attr(
            "d",
            `M 0 0 
                L 0  ${height} 
                L ${halfWidth - halfArrowLength}  ${height} 
                L ${halfWidth} ${height + tooltipProps.arrowHeight} 
                L ${halfWidth + halfArrowLength} ${height}  
                L ${fullWidth} ${height}  
                L ${fullWidth} 0 
                L 0 0 `
        )
        .attr("fill", tooltipProps.tooltipFill)
        .attr("filter", `url(#${filterUrl})`);

    tooltipWrapper.attr(
        "transform",
        `translate(${-halfWidth},${-height - tooltipProps.arrowHeight})`
    );
}

function replaceWithProps(text, obj) {
    var keys = Object.keys(obj);
    keys.forEach(key => {
        var stringToReplace = `{${key}}`;
        var re = new RegExp(stringToReplace, "g");
        text = text.replace(re, obj[key]);
    });
    return text;
}
```

