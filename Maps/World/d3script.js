




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
        scale: 250,
        geojson: null,
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


            /*##################################   HANDLERS  ####################################### */
            var handlers = {
                zoomed: null
            }



            /*##################################   BEHAVIORS ####################################### */
            var behaviors = {};

            behaviors.zoom = d3.zoom().on("zoom", d => handlers.zoomed(d));





            //drawing
            var svg = d3.select(this)
                .append('svg')
                .attr('width', attrs.svgWidth)
                .attr('height', attrs.svgHeight)
                .call(behaviors.zoom);
            // .attr("viewBox", "0 0 " + attrs.svgWidth + " " + attrs.svgHeight)
            // .attr("preserveAspectRatio", "xMidYMid meet")


            var chart = svg.append('g')
                .attr('width', calc.chartWidth)
                .attr('height', calc.chartHeight)
                .attr('transform', 'translate(' + (calc.chartLeftMargin) + ',' + calc.chartTopMargin + ')')



            /* ############# PROJECTION ############### */


            var projection = d3.geoMercator()
                .scale(attrs.scale)
                .translate([calc.chartWidth * 0.56, calc.chartHeight * 0.33])
                .center(attrs.center);

            var path = d3.geoPath()
                .projection(projection);


            /* ##############  DRAWING ################# */


            chart.selectAll('path')
                .data(attrs.geojson.features)
                .enter()
                .append('path')
                .attr('d', path)
                .attr('fill', d => '#' + (0x1000000 + (Math.random()) * 0xffffff).toString(16).substr(1, 6)) //random color



            /* #############################   HANDLER FUNCTIONS    ############################## */
            handlers.zoomed = function () {
                var transform = d3.event.transform;
                chart.attr('transform', transform);
            }




            // smoothly handle data updating
            updateData = function () {


            }


        });
    }





        ;['geojson', 'svgWidth', 'svgHeight'].forEach(key => {
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