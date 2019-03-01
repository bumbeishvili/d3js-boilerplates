# About

Observable Link - https://observablehq.com/d/b034e03a71b9465e


This is d3.js starter (and continuer **:)** ) repository, which is used in my d3.js projects. It helps me to start , continue and finish d3 projects fast

* [World Map Boilerplate](https://github.com/bumbeishvili/d3js-boilerplates/tree/gh-pages/Maps/World)
* [Georgian Map Boilerplate](https://github.com/bumbeishvili/d3js-boilerplates/tree/gh-pages/Maps/World)
* [Default Project Starter](https://github.com/bumbeishvili/d3js-boilerplates/tree/gh-pages/DefaultProjectStarter)


# Additional content and helpers

External links 
+ Components
   - [Breadcrumbs](https://github.com/bumbeishvili/d3-breadcrumbs)
   - [Tooltip](https://bumbeishvili.github.io/d3-tooltip/)
+ [Coding Conventions](https://github.com/bumbeishvili/d3-coding-conventions)
   
Internal links
+ [Colors](#colors)
   - [Metronic Color Palette](#metronic-dark-color-palette)
   - [Multiple Color Interpolation](#multiple-color-interpolation)
+ [Positioning](#positioning)
   - [Adjusting legend positions horizontally](#adjusting-legend-positions-horizontally)
   - [getting translation values from string](#getting-translation-values-from-string)
+ [Data Manipulations](#data-manipulations)
  - [Array](#array)
      - [groupBy](#groupby)  
      - [orderBy](#orderby)  
      - [orderByDescending](#orderbydescending)    
+ [String Manipulations](#string-manipulations) 
  - [limit string size](#limit-string-size)  


**Reusable Snippets**

## Right click menu using d3

https://jsfiddle.net/enigmarm/b98ty/

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


#### getting translation values from string

```javascript
function getTransformation(transform) {
  // Create a dummy g for calculation purposes only. This will never
  // be appended to the DOM and will be discarded once this function 
  // returns.
  var g = document.createElementNS("http://www.w3.org/2000/svg", "g");
  
  // Set the transform attribute to the provided string value.
  g.setAttributeNS(null, "transform", transform);
  
  // consolidate the SVGTransformList containing all transformations
  // to a single SVGTransform of type SVG_TRANSFORM_MATRIX and get
  // its SVGMatrix. 
  var matrix = g.transform.baseVal.consolidate().matrix;
  
  // Below calculations are taken and adapted from the private function
  // transform/decompose.js of D3's module d3-interpolate.
  var {a, b, c, d, e, f} = matrix;   // ES6, if this doesn't work, use below assignment
  // var a=matrix.a, b=matrix.b, c=matrix.c, d=matrix.d, e=matrix.e, f=matrix.f; // ES5
  var scaleX, scaleY, skewX;
  if (scaleX = Math.sqrt(a * a + b * b)) a /= scaleX, b /= scaleX;
  if (skewX = a * c + b * d) c -= a * skewX, d -= b * skewX;
  if (scaleY = Math.sqrt(c * c + d * d)) c /= scaleY, d /= scaleY, skewX /= scaleY;
  if (a * d < b * c) a = -a, b = -b, skewX = -skewX, scaleX = -scaleX;
  return {
    translateX: e,
    translateY: f,
    rotate: Math.atan2(b, a) * 180 / Math.PI,
    skewX: Math.atan(skewX) * 180 / Math.PI,
    scaleX: scaleX,
    scaleY: scaleY
  };
}

// returns    {"translateX":20,"translateY":30,"rotate":0,"skewX":0,"scaleX":1,"scaleY":1}
console.log(getTransformation("translate(20,30)"));  

//returns {"translateX":-20.875265509281956,"translateY":78.11968385683471,"rotate":45,"skewX":20.000000000000004,"scaleX":1,"scaleY":1}
console.log(getTransformation("rotate(45) skewX(20) translate(20,30) translate(-5,40)"));
```



# Data Manipulations
Javascript helper prototype functions



## array
<table>
    <tr>
       <td><a href="#groupby">groupBy</a></td>
       <td><code>arr.groupBy(['MessageGroupId','FlowId'])</code></td>
     </tr>
     <tr>
       <td><a href="#orderby">orderBy</a></td>
       <td><code>arr.orderBy(d=>d.FlowId)</code></td>
     </tr>
     <tr>
       <td><a href="#orderbydescending">orderByDescending</a></td>
       <td><code>arr.orderByDescending(d=>d.FlowId)</code></td>
     </tr>
</table>


## string









## groupBy 
#### Observe at observable 
https://beta.observablehq.com/@bumbeishvili/group-array-by-multiple-key  

#### usage  
`arr.groupBy(['MessageGroupId','FlowId'])`

#### Source
```javascript
Array.prototype.groupBy = function (props) {
   var arr = this;
   var partialResult = {};
   
   arr.forEach(el=>{
   
       var grpObj = {};
       
       props.forEach(prop=>{
             grpObj[prop] = el[prop]
       });
       
       var key = JSON.stringify(grpObj);
       
       if(!partialResult[key]) partialResult[key] = [];
       
       partialResult[key].push(el);
       
   });
   
   var finalResult = Object.keys(partialResult).map(key=>{
      var keyObj = JSON.parse(key);
      keyObj.values = partialResult[key];
      return keyObj;
   })
   
   return finalResult;
}
```

#### Input
```javascript
[
  {
    "Id": 46489,
    "Message": "Hi",
    "MessageGroupId": 46488,
    "FlowId": 99
  },
  {
    "Id": 46492,
    "Message": "Hi User",
    "MessageGroupId": 46490,
    "FlowId": 100
  },
  {
    "Id": 46494,
    "Message": "Loan",
    "MessageGroupId": 46490,
    "FlowId": 101
  },
  {
    "Id": 46496,
    "Message": "Call",
    "MessageGroupId": 46490,
    "FlowId": 101
  }
]
```


#### Output
```javascript
[
  {
    "MessageGroupId": 46488,
    "FlowId": 99,
    "values": [
      {
        "Id": 46489,
        "Message": "Hi",
        "MessageGroupId": 46488,
        "FlowId": 99
      }
    ]
  },
  {
    "MessageGroupId": 46490,
    "FlowId": 100,
    "values": [
      {
        "Id": 46492,
        "Message": "Hi User",
        "MessageGroupId": 46490,
        "FlowId": 100
      }
    ]
  },
  {
    "MessageGroupId": 46490,
    "FlowId": 101,
    "values": [
      {
        "Id": 46494,
        "Message": "Loan",
        "FlowId": 101,
        "MessageGroupId": 46490
      },
      {
        "Id": 46496,
        "Message": "Call",
        "FlowId": 101,
        "MessageGroupId": 46490
      }
    ]
  }
]
```






## orderBy

#### usage  
```
  arr.orderBy(d=>d.FlowId);
  arr.orderBy(d=>d.Message);
  arr.orderBy(d=>d.Message.length);
```


#### Source
```javascript
Array.prototype.orderBy = function (func) {
    this.sort((a, b) => {
       
        var a = func(a);
        var b = func(b);
      
        if (typeof a === 'string' || a instanceof String) {
            return a.localeCompare(b);
        }
        return a - b;
    });
    return this;
}


```

#### Input
```javascript
[
  {
    "Id": 46489,
    "Message": "Hi",
    "MessageGroupId": 46488,
    "FlowId": 99
  },
  {
    "Id": 46492,
    "Message": "Hi User",
    "MessageGroupId": 46490,
    "FlowId": 100
  },
  {
    "Id": 46494,
    "Message": "Loan",
    "MessageGroupId": 46490,
    "FlowId": 101
  },
  {
    "Id": 46496,
    "Message": "Call",
    "MessageGroupId": 46490,
    "FlowId": 101
  }
]
```


#### Output
```javascript
  arr.orderBy(d=>d.FlowId);
  
  [
  {
    "Id": 46489,
    "Message": "Hi",
    "MessageGroupId": 46488,
    "FlowId": 99
  },
  {
    "Id": 46492,
    "Message": "Hi User",
    "MessageGroupId": 46490,
    "FlowId": 100
  },
  {
    "Id": 46494,
    "Message": "Loan",
    "MessageGroupId": 46490,
    "FlowId": 101
  },
  {
    "Id": 46496,
    "Message": "Call",
    "MessageGroupId": 46490,
    "FlowId": 101
  }
]
  
  arr.orderBy(d=>d.Message);
  
  [
  {
    "Id": 46496,
    "Message": "Call",
    "MessageGroupId": 46490,
    "FlowId": 101
  },
  {
    "Id": 46489,
    "Message": "Hi",
    "MessageGroupId": 46488,
    "FlowId": 99
  },
  {
    "Id": 46492,
    "Message": "Hi User",
    "MessageGroupId": 46490,
    "FlowId": 100
  },
  {
    "Id": 46494,
    "Message": "Loan",
    "MessageGroupId": 46490,
    "FlowId": 101
  }
]


  arr.orderBy(d=>d.Message.length);
  [
  {
    "Id": 46489,
    "Message": "Hi",
    "MessageGroupId": 46488,
    "FlowId": 99
  },
  {
    "Id": 46496,
    "Message": "Call",
    "MessageGroupId": 46490,
    "FlowId": 101
  },
  {
    "Id": 46494,
    "Message": "Loan",
    "MessageGroupId": 46490,
    "FlowId": 101
  },
  {
    "Id": 46492,
    "Message": "Hi User",
    "MessageGroupId": 46490,
    "FlowId": 100
  }
]
  
  
```




## orderByDescending

#### usage  
```
  arr.orderByDescending(d=>d.FlowId);
  arr.orderByDescending(d=>d.Message);
  arr.orderByDescending(d=>d.Message.length);
```


#### Source
```javascript


Array.prototype.orderByDescending = function (func) {
    this.sort((a, b) => {
        var a = func(a);
        var b = func(b);
        if (typeof a === 'string' || a instanceof String) {
            return b.localeCompare(a);
        }
        return b - a;
    });
    return this;
}
```

#### Input
```javascript
[
  {
    "Id": 46489,
    "Message": "Hi",
    "MessageGroupId": 46488,
    "FlowId": 99
  },
  {
    "Id": 46492,
    "Message": "Hi User",
    "MessageGroupId": 46490,
    "FlowId": 100
  },
  {
    "Id": 46494,
    "Message": "Loan",
    "MessageGroupId": 46490,
    "FlowId": 101
  },
  {
    "Id": 46496,
    "Message": "Call",
    "MessageGroupId": 46490,
    "FlowId": 101
  }
]
```


#### Output
```javascript

  arr.orderByDescending(d=>d.FlowId);  
  
  [
  {
    "Id": 46496,
    "Message": "Call",
    "MessageGroupId": 46490,
    "FlowId": 101
  },
  {
    "Id": 46494,
    "Message": "Loan",
    "MessageGroupId": 46490,
    "FlowId": 101
  },
  {
    "Id": 46492,
    "Message": "Hi User",
    "MessageGroupId": 46490,
    "FlowId": 100
  },
  {
    "Id": 46489,
    "Message": "Hi",
    "MessageGroupId": 46488,
    "FlowId": 99
  }
]
  
  arr.orderByDescending(d=>d.Message);  
  
  [
  {
    "Id": 46494,
    "Message": "Loan",
    "MessageGroupId": 46490,
    "FlowId": 101
  },
  {
    "Id": 46492,
    "Message": "Hi User",
    "MessageGroupId": 46490,
    "FlowId": 100
  },
  {
    "Id": 46489,
    "Message": "Hi",
    "MessageGroupId": 46488,
    "FlowId": 99
  },
  {
    "Id": 46496,
    "Message": "Call",
    "MessageGroupId": 46490,
    "FlowId": 101
  }
]

  arr.orderByDescending(d=>d.Message.length);
  
  [
  {
    "Id": 46492,
    "Message": "Hi User",
    "MessageGroupId": 46490,
    "FlowId": 100
  },
  {
    "Id": 46494,
    "Message": "Loan",
    "MessageGroupId": 46490,
    "FlowId": 101
  },
  {
    "Id": 46496,
    "Message": "Call",
    "MessageGroupId": 46490,
    "FlowId": 101
  },
  {
    "Id": 46489,
    "Message": "Hi",
    "MessageGroupId": 46488,
    "FlowId": 99
  }
]
```


# String Manipualtions
### limit string size 
```javascript
   function limit(string,number){
      var points = '';
      var diff = 0;
      if(number <  string.length){
         points='...';
         diff=3;
      }
      string = string.slice(0,number-diff);
      return string + points;
   }
   // testing
   for(var i=3;i<20;i++){
      console.log(i);
      console.log(limit('testTestTest',i))
   }
```

### results
```
3
...
4
t...
5
te...
6
tes...
7
test...
8
testT...
9
testTe...
10
testTes...
11
testTest...
12
testTestTest
13
testTestTest
14
testTestTest
15
testTestTest
16
testTestTest
17
testTestTest
18
testTestTest
19
testTestTest

```

