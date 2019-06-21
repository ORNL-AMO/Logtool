import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-plot-graph',
  templateUrl: './plot-graph.component.html',
  styleUrls: ['./plot-graph.component.scss']
})
export class PlotGraphComponent implements OnInit {
  graph: any;
  plotGraph = [];
  constructor() { }

  ngOnInit() {
    this.graph = {
      data: this.plotGraph,
      layout: {
        hovermode: 'closest',
        autosize: true,
        margin: {
          l: 50,
          r: 20,
          b: 50,
          t: 50,
          pad: 10
        },
        title: 'Line Plot',
        xaxis: {
          autorange: true,
        },
        yaxis: {
          autorange: true,
          type: 'linear'
        }

      }
    };
  }

}
