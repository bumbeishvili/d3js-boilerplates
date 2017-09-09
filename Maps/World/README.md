# Map of the World

## D3.JS based visualization's boilerplate 

**Highlights**
1. Applied [reusable charts principle](https://bost.ocks.org/mike/chart/) 
1. Support of  [update handler functions](https://www.toptal.com/d3-js/towards-reusable-d3-js-charts)
1. Support of Zooming & Dragging 




##### [Preview](https://bumbeishvili.github.io/d3js-boilerplates/Maps/World/index.html)

Sample Invokation
```javascript

 d3.json('world_countries.json', function (json) {
 
            var chart = getChart()
                .svgHeight(window.innerHeight-30)  // make visual full screen
                .svgWidth(window.innerWidth-30) // make visual full screen
                .geojson(json)
                .data('Pass Something Here and use it as attrs.data')

            d3.select("#myGraph")
                .call(chart);

  })

```






**world-map**  
![](https://raw.githubusercontent.com/bumbeishvili/Assets/master/Projects/D3/d3-boilerplates/world.png)


<table>
 <tr>
   <th>Visualizations</th>
 </tr>
 
   <tr>
      <td>
         <a href="https://bumbeishvili.github.io/D3-Daniel-PPH/geo-map-chart/"> Geo Map a</a>
      </td>
   </tr>
</table>
