


function renderChart(params) {


    var config = {
        data: params.data,
        selector: params.selector,
        svgWidth: 400,
        svgHeight: 400,
        marginLeft: 10,
        marginTop: 10,
        marginBottom:0,
        marginRight:0
    }
    
    
    /*############### IF EXISTS OVERWRITE ATTRIBUTES FROM PASSED PARAM  #######  */

    var attrKeys = Object.keys(attrs);
    attrKeys.forEach(function (key) {
        if (params[key]) {
            attrs[key] = params[key];
        }
    })


    /* ############## DINAMICALLY CALCULATED PROPERTIES ########### */
    var calc = {};
    calc.chartLeftMargin = config.marginLeft;
    calc.chartTopMargin = config.marginTop;

    calc.chartWidth = config.svgWidth - config.marginRight - calc.chartLeftMargin;
    calc.chartHeight = config.svgHeight - config.marginBottom - calc.chartTopMargin;




    /* ############# SCALES  ################  */
    var scales = {};



    /* ############# UTILITY FUNCTIONS ############### */
    var utils = {};




    /* ##############  DRAWING ################# */

    /* ----- RESPONSIVE SVG DRAWING  ------- */
    var svg = d3.select(config.selector)
        .append('svg')
        .attr("viewBox", "0 0 " + config.svgWidth + " " + config.svgHeight)
        .attr("preserveAspectRatio", "xMidYMid meet")
    
    /* ----- CHART CONTENT DRAWING   --------- */

    var chart = svg.append('g')
        .attr('width', calc.chartWidth)
        .attr('height', calc.chartHeight)
        .attr('transform', 'translate(' + (calc.chartLeftMargin ) + ',' + calc.chartTopMargin +')')



    

}
