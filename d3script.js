


function renderChart(params) {


    var attrs = {
        data: params.data,
        selector: params.selector,
        svgWidth: 400,
        svgHeight: 400,
        marginLeft: 10,
        marginTop: 10,
        marginBottom:0,
        marginRight:0
    }


    /* ############## DINAMICALLY CALCULATED PROPERTIES ########### */
    var calc = {};
    calc.chartLeftMargin = attrs.marginLeft;
    calc.chartTopMargin = attrs.marginTop;

    calc.chartWidth = attrs.svgWidth - attrs.marginRight - calc.chartLeftMargin;
    calc.chartHeight = attrs.svgHeight - attrs.marginBottom - calc.chartTopMargin;




    /* ############# SCALES  ################  */
    var scales = {};



    /* ############# UTILITY FUNCTIONS ############### */
    var utils = {};




    /* ##############  DRAWING ################# */

    /* ----- RESPONSIVE SVG DRAWING  ------- */
    var svg = d3.select(attrs.selector)
        .append('svg')
        .attr("viewBox", "0 0 " + attrs.svgWidth + " " + attrs.svgHeight)
        .attr("preserveAspectRatio", "xMidYMid meet")
    
    /* ----- CHART CONTENT DRAWING   --------- */

    var chart = svg.append('g')
        .attr('width', calc.chartWidth)
        .attr('height', calc.chartHeight)
        .attr('transform', 'translate(' + (calc.chartLeftMargin ) + ',' + calc.chartTopMargin +')')



    

}