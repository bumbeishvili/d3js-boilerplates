# d3js-boilerplate
D3 js templates for fast initial setup



**Reusable Snippets**


## Colors

#### Multiple color interpolation
```javascript
var color = d3.interpolateRgbBasis(["red", "yellow","green"]);

color(0) // red  - rgb(255, 0, 0)
color(0.5) // yellow - rgb(213, 191, 0)
color(1) // green - rgb(0, 128, 0)
color(0.25) // something between red and yellow -  orange - rgb(250, 120, 0)
color(0.75) // something between yellow and green -  rgb(122, 184, 0)

```
[Pen](https://codepen.io/bumbeishvili/pen/bReoMP?editors=1010)


## Positioning

#### Adjusting legend positios horizontally
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

[fiddle - check legends positions](https://jsfiddle.net/uxLze316/1/)
