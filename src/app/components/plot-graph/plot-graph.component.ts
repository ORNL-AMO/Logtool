import {Component, OnInit} from '@angular/core';
import {DataService} from '../../providers/data.service';
import {ExportCSVService} from '../../providers/export-csv.service';
import {RouteDataTransferService} from '../../providers/route-data-transfer.service';
import * as XLSX from 'xlsx';


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
    this.xValue = [];
    this.yValue = [];
    this.timeSeries = [];
    this.plotGraph = [];

    if (type === 'line_graph') {
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
      console.log(this.plotGraph);
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
      console.log(this.plotGraph);
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
    console.log(this.routeDataTransfer.storage);
    // set up workbook and sheet to catch data
    const wb = XLSX.utils.book_new();

    const input: any[] = [];
    input[0] = [];

    // Get header data
    // Get time series or X value based on graph type
    console.log(this.routeDataTransfer.storage.graphType);
    if (this.routeDataTransfer.storage.graphType === 'scatter_graph') {
      console.log(this.routeDataTransfer.storage.x.name);
      input[0].push(this.routeDataTransfer.storage.x.name);
    } else {
      input[0].push(this.routeDataTransfer.storage.timeSeries[0].name);
    }

    let max_sample = 0;
    // get Y-headers & calculate how many data samples
    console.log(this.plotGraph[0].name);
    for (let i = 0; i < this.plotGraph.length; i++) {
      input[0].push(this.plotGraph[i].name);
      if (max_sample < this.plotGraph[i].x.length) {
        max_sample = this.plotGraph[i].x.length;
      }
      if (max_sample < this.plotGraph[i].y.length) {
        max_sample = this.plotGraph[i].y.length;
      }
    }
    console.log(input, max_sample);
    const data: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(input);
    XLSX.utils.book_append_sheet(wb, data, 'test');


    for (let i = 0; i < max_sample; i++) {
      input[0] = [];
      input[0].push(this.plotGraph[0].x[i]);
      for (let j = 0; j < this.plotGraph.length; j++) {
        input[0].push(this.plotGraph[j].y[i]);
      }
      XLSX.utils.sheet_add_aoa(data, input, {origin: -1});
    }
    const range = XLSX.utils.decode_range(data['!ref']);
    for (let rowNum = range.s.r; rowNum <= range.e.r; rowNum++) {
      for (let colNum = range.s.c; colNum <= range.e.c; colNum++) {
        const cell = data[XLSX.utils.encode_cell( {c: colNum, r: rowNum})];
        if ((cell.z) === 'm/d/yy') {

          cell.z = 'dd/mm/yy hh:mm:ss';
          delete cell.w;
          XLSX.utils.format_cell(cell);
          console.log(cell.z, cell.v, cell.w);
        }

      }
    }
    XLSX.writeFile(wb, 'THISPAGE.csv', {bookType: 'csv'});
  }

}
