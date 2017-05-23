# Map of Georgia

## D3.JS based visualization's boilerplate 

**Highlights**
1. Applied [reusable charts principle](https://bost.ocks.org/mike/chart/) 
1. Support of  [update handler functions](https://www.toptal.com/d3-js/towards-reusable-d3-js-charts)
1. Support of Zooming & Dragging 




##### [Preview](https://bumbeishvili.github.io/d3js-boilerplates/Maps/Georgia/index.html)

Sample Invokation
```javascript

 d3.json('geo_regions.json', function (json) {
 
            var chart = getChart()
                .svgHeight(window.innerHeight-30)  // make visual full screen
                .svgWidth(window.innerWidth-30) // make visual full screen
                .geojson(json)
                .data('Pass Something Here and use it as attrs.data')

            d3.select("#myGraph")
                .call(chart);

  })

```


if you want subregions map, just change geojson file name
```javascript

 d3.json('geo_sub_regions.json', function (json) {
 
            var chart = getChart()
                .svgHeight(window.innerHeight-30)  // make visual full screen
                .svgWidth(window.innerWidth-30) // make visual full screen
                .geojson(json)
                .data('Pass Something Here and use it as attrs.data')

            d3.select("#myGraph")
                .call(chart);

  })

```

Screenshot

**regions**  
![](https://raw.githubusercontent.com/bumbeishvili/Assets/master/Projects/D3/d3-boilerplates/mapofGeorgia.png)



**subregions**  
![](https://raw.githubusercontent.com/bumbeishvili/Assets/master/Projects/D3/d3-boilerplates/SubRegions.png)


<table>
 <tr>
   <th>Visualizations</th>
 </tr>
 
   <tr>
      <td>
         <a href="https://bumbeishvili.github.io/geo-vis/populationPerRegions/">Population's density</a>
      </td>
   </tr>
</table>
