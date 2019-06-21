import {Component, OnInit} from '@angular/core';
import {DataService} from '../../providers/data.service';
import {ExportCSVService} from '../../providers/export-csv.service';
import {RouteDataTransferService} from '../../providers/route-data-transfer.service';

@Component({
  selector: 'app-plot-line-graph',
  templateUrl: './plot-line-graph.component.html',
  styleUrls: ['./plot-line-graph.component.scss']
})
export class PlotLineGraphComponent implements OnInit {
  graph: any;
  dataInput = [];
  timeSeries = [];
  yValue = [];
  plotGraph = [];

  constructor(private data: DataService, private csvexport: ExportCSVService, private routeDataTransfer: RouteDataTransferService) {
  }

  ngOnInit() {
    this.data.currentdataInputArray.subscribe(input => this.dataInput = input);
    this.timeSeries = this.routeDataTransfer.storage.timeSeries[0].value.split(',');
    this.yValue = this.routeDataTransfer.storage.value;
    for (let i = 0; i < this.yValue.length; i++) {
      const value = this.yValue[i].value.split(',');
      this.plotGraph.push({
        x: this.dataInput[parseInt(this.timeSeries[0], 10)].dataArrayColumns[parseInt(this.timeSeries[1], 10)],
        y: this.dataInput[parseInt(value[0], 10)].dataArrayColumns[parseInt(value[1], 10)],
        type: 'linegl',
        mode: 'lines',
        name: this.yValue[i].name
      });
    }
    this.graph = {
      data: this.plotGraph,
      layout: {
        hovermode: 'closest',
        autosize: true,
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
