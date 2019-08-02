import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {DataService} from '../../providers/data.service';
import {RouteDataTransferService} from '../../providers/route-data-transfer.service';

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

  constructor(private route: ActivatedRoute, private routeDataTransfer: RouteDataTransferService, private data: DataService) {
  }

  ngOnInit() {
    if (this.routeDataTransfer.storage === undefined) {
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
            let width = 1000;
            for (let i = 0; i < columnDefs.length; i++) {
              header.push(columnDefs[i].headerName);
              if (i > 5) {
                width = width + 100;
              }
            }
            this.displayTable(header, dataArrayColumns, width);
          }
        });
    } else {
      const loadMode = this.routeDataTransfer.storage.loadMode;
      if (loadMode) {
        this.show = true;
        const columnDefs = this.routeDataTransfer.storage.tableData;
        const header = this.routeDataTransfer.storage.tableName;
        let width = 1000;
        for (let i = 0; i < columnDefs.length; i++) {
          if (i > 5) {
            width = width + 100;
          }
        }
        const dataArrayColumns = this.routeDataTransfer.storage.tableData;
        this.displayTable(header, dataArrayColumns, width);
      } else {
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
              let width = 1000;
              for (let i = 0; i < columnDefs.length; i++) {
                header.push(columnDefs[i].headerName);
                if (i > 5) {
                  width = width + 100;
                }
              }
              this.displayTable(header, dataArrayColumns, width);
            }
          });
      }
    }

  }

  displayTable(header, dataArrayColumns, width) {
    const data = [{
      type: 'table',
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
        autosize: true,
        margin: {
          t: 5,
          r: 20,
          b: 10,
          l: 20
        },
        style_table: {
          overflowX: 'scroll'
        },
        height: 200,
        width: width
      },
      config: {
        'showLink': false,
        'scrollZoom': false,
        'displayModeBar': false,
        'editable': false,
        'responsive': true,
        'displaylogo': false,
        'hovermode': false
      }
    };
  }

}
