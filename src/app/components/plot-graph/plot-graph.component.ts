import {Component, OnInit} from '@angular/core';
import {DataService} from '../../providers/data.service';
import {ExportCSVService} from '../../providers/export-csv.service';
import {RouteDataTransferService} from '../../providers/route-data-transfer.service';

@Component({
  selector: 'app-plot-graph',
  templateUrl: './plot-graph.component.html',
  styleUrls: ['./plot-graph.component.scss']
})
export class PlotGraphComponent implements OnInit {
  graph: any;
  dataInput = [];
  xValue = [];
  yValue = [];
  timeSeries = [];
  plotGraph = [];
  graphType = '';

  constructor(private data: DataService, private csvexport: ExportCSVService, private routeDataTransfer: RouteDataTransferService) {
  }

  ngOnInit() {
    if (this.routeDataTransfer.storage === undefined) {
      this.displayGraph(this.graphType);
    } else {
      this.data.currentdataInputArray.subscribe(input => this.dataInput = input);
      this.graphType = this.routeDataTransfer.storage.graphType;
      this.displayGraph(this.graphType);
    }
  }
  displayGraph(type) {
    if (type === 'line_graph') {
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
    } else if (type === 'scatter_graph') {
      this.xValue = this.routeDataTransfer.storage.x[0].value.split(',');
      this.yValue = this.routeDataTransfer.storage.y[0].value.split(',');
      this.plotGraph.push({
        x: this.dataInput[parseInt(this.xValue[0], 10)].dataArrayColumns[parseInt(this.xValue[1], 10)],
        y: this.dataInput[parseInt(this.yValue[0], 10)].dataArrayColumns[parseInt(this.yValue[1], 10)],
        type: 'scattergl',
        mode: 'markers'
      });
      this.graph = {
        data: this.plotGraph,
        layout: {
          hovermode: 'closest',
          autosize: true,
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
    } else {
      this.graph = {
        data: this.plotGraph,
        layout: {
          hovermode: 'closest',
          autosize: true,
          title: 'Plot',
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

  onCreateCsv() {
    const csvData = [];
    for (let i = 0; i < this.dataInput[0].inputData.length; i++) {
      csvData.push({
        'id': i,
        '100Amp': this.dataInput[0].inputData[i],
        '150Amp': this.dataInput[1].inputData[i],
        'TimeStamp': this.dataInput[0]
      });
    }
    this.csvexport.exportAsExcelFile(csvData, 'workfile');
  }
}
