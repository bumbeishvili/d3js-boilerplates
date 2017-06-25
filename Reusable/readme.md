## sample invokation

```javascript
          var chart = renderChart()
                .svgHeight(window.innerHeight-30)
                .svgWidth(window.innerWidth-30)
                .data('Pass Something Here and use it as attrs.data')

            d3.select("#myGraph")
                .call(chart);
    
    
    
    // OPTIONAL _ update chart
    chart.data(newData)
  

```
