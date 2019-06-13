import {Component, OnInit} from '@angular/core';
import {DataService} from '../../providers/data.service';
import {ExportCSVService} from '../../providers/export-csv.service';
import {RouteDataTransferService} from '../../providers/route-data-transfer.service';

@Component({
  selector: 'app-plot-scatter-graph',
  templateUrl: './plot-scatter-graph.component.html',
  styleUrls: ['./plot-scatter-graph.component.scss']
})
export class PlotScatterGraphComponent implements OnInit {
  graph: any;
  dataInput = [];
  timeSeries = [];
  yValue = [];
  plotGraph = [];

  constructor(private data: DataService, private csvexport: ExportCSVService, private routeDataTrasfer: RouteDataTransferService) {
  }

  ngOnInit() {
    this.data.currentdataInputArray.subscribe(input => this.dataInput = input);
    this.timeSeries = this.routeDataTrasfer.storage.timeSeries[0].value.split(',');
    this.yValue = this.routeDataTrasfer.storage.value;
    for (let i = 0; i < this.yValue.length; i++) {
      const value = this.yValue[i].value.split(',');
      this.plotGraph.push({
        x: this.dataInput[parseInt(this.timeSeries[0], 10)].dataArrayColumns[parseInt(this.timeSeries[1], 10)],
        y: this.dataInput[parseInt(value[0], 10)].dataArrayColumns[parseInt(value[1], 10)],
        type: 'scattergl',
        mode: 'markers',
        name: this.yValue[i].name
      });
    }
    console.log(this.plotGraph);
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
        title: 'Scatter Plot',
        xaxis: {
          autorange: true,
          range: ['2013-10-11', '2013-10-25'],
        },
        yaxis: {
          autorange: true,
          range: [0.000, 250.000],
          type: 'linear'
        }

      }
    };
  }
  /*onCreateCsv() {
  const csvData = [];
  for (let i = 0; i < this.dataInput[0].inputData.length; i++) {
    csvData.push({'id': i,
      '100Amp': this.dataInput[0].inputData[i],
      '150Amp': this.dataInput[1].inputData[i],
      'TimeStamp': this.dataInput[0]
    });
  }
  this.csvexport.exportAsExcelFile(csvData, 'workfile');
}*/

}
