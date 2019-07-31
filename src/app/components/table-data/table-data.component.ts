import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {DataService} from '../../providers/data.service';

@Component({
  selector: 'app-table-data',
  templateUrl: './table-data.component.html',
  styleUrls: ['./table-data.component.scss']
})
export class TableDataComponent implements OnInit {
  arrayPointer = 0;
  inputDataArray = [];
  show = false;
  graph: any;

  constructor(private route: ActivatedRoute, private data: DataService) {
  }

  ngOnInit() {
    this.data.currentDataInputArray.subscribe(input => this.inputDataArray = input);
    this.route.queryParams
      .subscribe(params => {
        this.arrayPointer = params.value;
        if (this.inputDataArray[this.arrayPointer] === undefined) {
        } else {
          this.show = true;
          const columnDefs = this.inputDataArray[this.arrayPointer].selectedHeader;
          const dataArrayColumns = this.inputDataArray[this.arrayPointer].dataArrayColumns;
          const header = [];
          const columnOrder = [];
          const columnWidth = [];
          for (let i = 0; i < columnDefs.length; i++) {
            header.push(columnDefs[i].headerName);
            columnOrder.push(i);
            columnWidth.push(700);
          }
          const data = [{
            type: 'table',
            columnorder: columnOrder,
            columnwidth: columnWidth,
            header: {
              values: header,
              align: 'center',
              line: {width: 1, color: 'black'},
              fill: {color: 'grey'},
              font: {family: 'Arial', size: 12, color: 'white'}
            },
            cells: {
              values: dataArrayColumns,
              align: 'left',
              line: {color: 'black', width: 1},
              font: {family: 'Arial', size: 11, color: ['black']}
            }
          }];
          this.graph = {
            data: data,
            layout: {
              autosize: false,
              margin: {
                t: 5,
                r: 20,
                b: 10,
                l: 20
              },
              height: 200
            },
            config: {
              'showLink': false,
              'scrollZoom': false,
              'displayModeBar': false,
              'editable': false,
              'responsive': false,
              'displaylogo': false,
              'hovermode': false
            }
          };
        }
      });
  }
}
