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
  annotationListLine = [];
  annotationListScatter = [];

  constructor(private data: DataService, private csvexport: ExportCSVService, private routeDataTransfer: RouteDataTransferService) {
  }

  ngOnInit() {
    if (this.routeDataTransfer.storage === undefined) {
      this.annotationListLine = [];
      this.annotationListScatter = [];
      this.displayGraph(this.graphType);
    } else {
      this.annotationListLine = [];
      this.annotationListScatter = [];
      this.data.currentdataInputArray.subscribe(input => this.dataInput = input);
      this.graphType = this.routeDataTransfer.storage.graphType;
      this.displayGraph(this.graphType);
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
        const cell = data[XLSX.utils.encode_cell({c: colNum, r: rowNum})];
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
      let layout;
      if (this.annotationListLine.length > 0) {
        layout = this.graph.layout;
      } else {
        layout = {
          hovermode: 'closest',
          autosize: true,
          title: 'Line Plot',
          annotations: this.annotationListLine,
          xaxis: {
            autorange: true,
          },
          yaxis: {
            autorange: true,
            type: 'linear'
          }
        };
      }
      this.graph = {
        data: this.plotGraph,
        layout: layout,
        config: {
          'showLink': false,
          'scrollZoom': true,
          'displayModeBar': true,
          'editable': false,
          'responsive': true,
          'displaylogo': false
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
      let layout;
      if (this.annotationListScatter.length > 0) {
        layout = this.graph.layout;
      } else {
        layout = {
          hovermode: 'closest',
          autosize: true,
          title: 'Scatter Plot',
          annotations: this.annotationListScatter,
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
        };
      }
      this.graph = {
        data: this.plotGraph,
        layout: layout,
        config: {
          'showLink': false,
          'scrollZoom': true,
          'displayModeBar': true,
          'editable': false,
          'responsive': true,
          'displaylogo': false
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
        },
        config: {
          'showLink': false,
          'scrollZoom': true,
          'displayModeBar': true,
          'editable': false,
          'responsive': true,
          'displaylogo': false
        }
      };
    }
  }

  clickAnnotation(data) {
    if (data.points === undefined) {

    } else {
      for (let i = 0; i < data.points.length; i++) {
        if (data.points[i].data.type === 'scattergl') {
          if (this.graph.data[0].type === 'scattergl') {
            this.annotationListScatter = this.graph.layout.annotations;
          } else {
            this.annotationListScatter = [];
          }
          const annotationText = 'x = ' + data.points[i].x + ' y = ' + data.points[i].y.toPrecision(4);
          const annotation = {
            text: annotationText,
            x: data.points[i].x,
            y: parseFloat(data.points[i].y.toPrecision(4)),
            font: {
              color: 'black',
              size: 12,
              family: 'Courier New, monospace',
            },
          };
          if (this.annotationListScatter.length > 0) {
            if (this.annotationListScatter.find(obj => obj.x === annotation.x && obj.y === annotation.y)) {
              this.annotationListScatter.splice(this.annotationListScatter
                .indexOf(this.annotationListScatter
                  .find(obj => obj.x === annotation.x && obj.y === annotation.y)), 1);
            } else {
              this.annotationListScatter.push(annotation);
            }
          } else {
            this.annotationListScatter.push(annotation);
          }
          this.displayGraph('scatter_graph');
        } else if (data.points[i].data.type === 'linegl') {
          if (this.graph.data[0].type === 'linegl') {
            this.annotationListLine = this.graph.layout.annotations;
          } else {
            this.annotationListLine = [];
          }
          const annotationText = 'x = ' + data.points[i].x + ' y = ' + data.points[i].y.toPrecision(4);
          const annotation = {
            text: annotationText,
            x: data.points[i].x,
            y: parseFloat(data.points[i].y.toPrecision(4)),
            font: {
              color: 'black',
              size: 12,
              family: 'Courier New, monospace',
            },
          };
          if (this.annotationListLine.length > 0) {
            if (this.annotationListLine.find(obj => obj.x === annotation.x && obj.y === annotation.y)) {
              this.annotationListLine.splice(this.annotationListLine
                .indexOf(this.annotationListLine
                  .find(obj => obj.x === annotation.x && obj.y === annotation.y)), 1);
            } else {
              this.annotationListLine.push(annotation);
            }
          } else {
            this.annotationListLine.push(annotation);
          }
          this.displayGraph('line_graph');
        }
      }
    }
  }
}
