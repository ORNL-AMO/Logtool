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
  displayData = [];

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
          this.columnDefs = this.inputDataArray[this.arrayPointer].selectedHeader;
          this.rowCount = this.inputDataArray[this.arrayPointer].countOfRow;
          this.rowData = this.inputDataArray[this.arrayPointer].content;
          // this.displayTable();
        }
      });
  }

  displayTable() {
    this.displayData = [];
    for (let count = -1; count < this.rowCount; count++) {
      const rowContent = [];
      for (let i = 0; i < this.columnDefs.length; i++) {
        if (count === -1) {
          rowContent.push(this.columnDefs[i].headerName);
        } else {
          rowContent.push(this.rowData[i][count]);
        }
      }
      this.displayData.push(rowContent);
    }
      console.log(this.displayData);
  }

  calculateWidth() {
    // console.log(this.columnDefs.length);
    return 200 * this.columnDefs.length + 'px';
  }

  maxlength() {
    let max = 0;
    let max_index;
    for (let i = 0; i < this.rowData.length; i++) {
      if (this.rowData[i].length > max) {
        max_index = i;
        max = this.rowData[i].length;
      }
    }
    return max_index;
  }
}
