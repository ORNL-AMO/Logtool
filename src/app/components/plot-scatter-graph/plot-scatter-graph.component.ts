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
  xValue = [];
  yValue = [];
  plotGraph = [];

  constructor(private data: DataService, private exportCsvService: ExportCSVService, private routeDataTransfer: RouteDataTransferService) {
  }

  ngOnInit() {
    this.data.currentdataInputArray.subscribe(input => this.dataInput = input);
    console.log(this.routeDataTransfer.storage.x[0].value);
    this.xValue = this.routeDataTransfer.storage.x[0].value.split(',');
    this.yValue = this.routeDataTransfer.storage.y[0].value.split(',');
    this.plotGraph.push({
      x: this.dataInput[parseInt(this.xValue[0], 10)].dataArrayColumns[parseInt(this.xValue[1], 10)],
      y: this.dataInput[parseInt(this.yValue[0], 10)].dataArrayColumns[parseInt(this.yValue[1], 10)],
      type: 'scattergl',
      mode: 'markers'
    });
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
          title: {
            text: this.routeDataTransfer.storage.x[0].name,
            font: {
              family: 'Courier New, monospace',
              size: 18,
              color: '#7f7f7f',
              style: 'bold'
            }
          },
        },
        yaxis: {
          title: {
            text: this.routeDataTransfer.storage.y[0].name,
            font: {
              family: 'Courier New, monospace',
              size: 18,
              color: '#7f7f7f',
              style: 'bold'
            }
          }
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
