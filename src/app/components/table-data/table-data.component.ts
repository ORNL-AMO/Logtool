import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {DataService} from '../../providers/data.service';
import {RouteDataTransferService} from '../../providers/route-data-transfer.service';
import {IndexDataBaseStoreService} from '../../providers/index-data-base-store.service';
import {CSVFileInput} from '../../types/csvfile-input';

@Component({
  selector: 'app-table-data',
  templateUrl: './table-data.component.html',
  styleUrls: ['./table-data.component.scss']
})
export class TableDataComponent implements OnInit {
  assessmentId;
  csv;
  csvId;
  call;
  position;
  show = false;
  graph: any;

  constructor(private route: ActivatedRoute, private routeDataTransfer: RouteDataTransferService, private data: DataService,
              private indexDbStore: IndexDataBaseStoreService) {
  }

  ngOnInit() {
    this.route.queryParams
      .subscribe(params => {
        this.call = params.call;
        if (this.call === 'file-management') {
          this.csvId = params.csvId;
          if (this.csvId === undefined) {
          } else {
            this.indexDbStore.viewSelectedCSVStore(parseInt(this.csvId, 10)).then(() => {
              this.data.currentCSVItem.subscribe(result => {
                this.csv = result;
                this.show = true;
                const columnDefs = this.csv.selectedHeader;
                const dataArrayColumns = this.csv.dataArrayColumns;
                const header = [];
                let width = 1000;
                for (let i = 0; i < columnDefs.length; i++) {
                  header.push(columnDefs[i].headerName);
                  if (i > 5) {
                    width = width + 100;
                  }
                }
                this.displayTable(header, dataArrayColumns, width);
              });
            });
          }
        } else if (this.call === 'visualize') {
          this.assessmentId = params.assessmentId;
          this.position = params.position;
          if (this.position !== -1) {
            if (this.assessmentId === undefined) {
            } else {
              this.indexDbStore.viewSelectedAssessmentStore(parseInt(this.assessmentId, 10)).then(() => {
                this.data.currentAssessmentItem.subscribe(result => {
                  this.csv = result.csv[this.position];
                  this.show = true;
                  const columnDefs = this.csv.selectedHeader;
                  const dataArrayColumns = this.csv.dataArrayColumns;
                  const header = [];
                  let width = 1000;
                  for (let i = 0; i < columnDefs.length; i++) {
                    header.push(columnDefs[i].headerName);
                    if (i > 5) {
                      width = width + 100;
                    }
                  }
                  this.displayTable(header, dataArrayColumns, width);
                });
              });
            }
          }
        }
      });
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
