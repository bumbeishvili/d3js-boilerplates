




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
        selection.each(function () {

            //calculated properties
            var calc = {}

            calc.chartLeftMargin = attrs.marginLeft;
            calc.chartTopMargin = attrs.marginTop;

            calc.chartWidth = attrs.svgWidth - attrs.marginRight - calc.chartLeftMargin;
            calc.chartHeight = attrs.svgHeight - attrs.marginBottom - calc.chartTopMargin;

            //drawing
            var svg = d3.select(this)
                .append('svg')
                .attr('width', attrs.svgWidth)
                .attr('height', attrs.svgHeight)
            // .attr("viewBox", "0 0 " + attrs.svgWidth + " " + attrs.svgHeight)
            // .attr("preserveAspectRatio", "xMidYMid meet")


            var chart = svg.append('g')
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



            d3.json('geo_regions.json', function (json) {
                chart.selectAll('path')
                    .data(json.features)
                    .enter()
                    .append('path')
                    .attr('d', path)
                    .attr('fill', d => '#' + (0x1000000 + (Math.random()) * 0xffffff).toString(16).substr(1, 6)) //random color


            })



            // smoothly handle data updating
            updateData = function () {


            }


        });
    }





        ;['width', 'height'].forEach(key => {
            // Attach variables to main function
            return main[key] = function (_) {
                var string = `attrs['${key}'] = _`;
                if (!arguments.length) { eval(`return attrs['${key}']`); }
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


    return main;
}