class Chart {
    constructor() {
        const attrs = {
            id: 'ID' + Math.floor(Math.random() * 1000000),
            svgWidth: 400,
            svgHeight: 400,
            marginTop: 5,
            marginBottom: 5,
            marginRight: 5,
            marginLeft: 5,
            container: 'body',
            defaultTextFill: '#2C3E50',
            defaultFont: 'Helvetica',
            data: null
        };

        this.getChartState = () => attrs;

        Object.keys(attrs).forEach((key) => {
            //@ts-ignore
            this[key] = function(_) {
                var string = `attrs['${key}'] = _`;
                if (!arguments.length) {
                    return eval(`attrs['${key}'];`);
                }
                eval(string);
                return this;
            };


        });


        this.initializeEnterExitUpdatePattern();
    }

    initializeEnterExitUpdatePattern() {
        d3.selection.prototype.patternify = function(params) {
            var container = this;
            var selector = params.selector;
            var elementTag = params.tag;
            var data = params.data || [selector];

            // Pattern in action
            var selection = container.selectAll('.' + selector).data(data, (d, i) => {
                if (typeof d === 'object') {
                    if (d.id) {
                        return d.id;
                    }
                }
                return i;
            });
            selection.exit().remove();
            selection = selection.enter().append(elementTag).merge(selection);
            selection.attr('class', selector);
            return selection;
        };
    }

    render() {
        const attrs = this.getChartState();

        //Drawing containers
        var container = d3.select(attrs.container);
        var containerRect = container.node().getBoundingClientRect();
        if (containerRect.width > 0) attrs.svgWidth = containerRect.width;

        //Calculated properties
        var calc = {
            id: null,
            chartTopMargin: null,
            chartLeftMargin: null,
            chartWidth: null,
            chartHeight: null
        };
        calc.id = 'ID' + Math.floor(Math.random() * 1000000); // id for event handlings
        calc.chartLeftMargin = attrs.marginLeft;
        calc.chartTopMargin = attrs.marginTop;
        calc.chartWidth = attrs.svgWidth - attrs.marginRight - calc.chartLeftMargin;
        calc.chartHeight = attrs.svgHeight - attrs.marginBottom - calc.chartTopMargin;

        //Add svg
        var svg = container
            .patternify({
                tag: 'svg',
                selector: 'svg-chart-container'
            })
            .attr('width', attrs.svgWidth)
            .attr('height', attrs.svgHeight)
            .attr('font-family', attrs.defaultFont);

        //Add container g element
        var chart = svg
            .patternify({
                tag: 'g',
                selector: 'chart'
            })
            .attr('transform', 'translate(' + calc.chartLeftMargin + ',' + calc.chartTopMargin + ')');

        // REMOVE THIS SNIPPET AFTER YOU START THE DEVELOPMENT
        chart
            .patternify({
                tag: 'text',
                selector: 'example-text',
                data: [attrs.data.message]
            })
            .text(d => d)
            .attr('x', 10)
            .attr('y', 20);


        //#########################################  UTIL FUNCS ##################################

        d3.select(window).on('resize.' + attrs.id, () => {
            console.log('resize');
            var containerRect = container.node().getBoundingClientRect();
            if (containerRect.width > 0) this.svgWidth(containerRect.width);
            this.render();
        });


        return this;
    }
  
    updateData(data){
        const attrs = this.getChartState();
        console.log('smoothly updating data');
        return this;
    }

}
