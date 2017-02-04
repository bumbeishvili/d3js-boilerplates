import { Component, ElementRef } from '@angular/core';
import * as d3 from "../../../../node_modules/d3/build/d3.js";  // change that !


//exposable properties

interface IChart {
  (): any,
  data: (value: any[]) => any,
  width: (value: number) => any,
  height: (value: number) => any,
}


@Component({
  moduleId: module.id,
  selector: 'chartname',
  templateUrl: 'chartname.component.html'
})


export class #ChartNameComponent {
  chart: any;

  constructor(private elementRef: ElementRef) {
    this.chart = this.getChart()
      .width(300)
      .height(300);
  }



  ngOnInit() {

    d3.select(this.elementRef.nativeElement)
      .select("#chartContainer")
      .call(this.chart);


    //fetch data using eventEmitter and call
    // this.chart.data(newData);
 
  }

  getChart() {
    // exposed variables
    var attrs: any = {
      width: null,
      height: null,
      chartWidth: null,
      chartHeight: null,
      margin: { top: 40, left: 0, bottom: 40, right: 0 },
      data: null
    };


    //innerFunctions
    var updateData: any;


    //main chart object
    var chart = <IChart>function (selection: any) {
      selection.each(function () {

        //calculated properties
        var calc: any = {}


        //drawing
        var svg = d3.select(this)
          .append("svg")
          .attr("width", attrs.width)
          .attr("height", attrs.height);


     


        // smoothly handle data updating
        updateData = function () {
         

        }


      });
    }


    //exposed variable funcs
    chart.data = function (value: any[]) {
      if (!arguments.length) return attrs.data;
      attrs.data = value;
      if (typeof updateData === 'function') {
        updateData();
      }
      return chart;
    }

    chart.width = function (value: number) {
      if (!arguments.length) return attrs.width;
      attrs.width = value;
      return chart;
    }

    chart.height = function (value: number) {
      if (!arguments.length) return attrs.height;
      attrs.height = value;
      return chart;
    }


    return chart;
  };


}




