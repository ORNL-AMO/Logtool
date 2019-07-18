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
  columnDefs: any;
  rowData: any;
  rowCount: any;
  show = false;

  constructor(private route: ActivatedRoute, private data: DataService) {
  }

  ngOnInit() {
    this.data.currentdataInputArray.subscribe(input => this.inputDataArray = input);
    this.route.queryParams
      .subscribe(params => {
        this.arrayPointer = params.value;
        if (this.inputDataArray[this.arrayPointer] === undefined) {
        } else {
          this.show = true;
          this.columnDefs = this.inputDataArray[this.arrayPointer].selectedHeader;
          this.rowCount = this.inputDataArray[this.arrayPointer].countOfRow;
          this.rowData = this.inputDataArray[this.arrayPointer].dataArrayColumns;
          this.displayTable();
        }
      });
  }

  displayTable() {
    for (let count = -1; count < this.rowCount; count++) {
      for (let i = 0; i < this.columnDefs.length; i++) {
        if (count === -1) {
          console.log(this.columnDefs[i].headerName);
          count = count + 1;
        } else {
          console.log(this.rowData[i][count]);
          count = count + 1;
        }
      }
    }

  }

  calculateWidth() {
    // console.log(this.columnDefs.length);
    return 200 * this.columnDefs.length + 'px';
  }
}
