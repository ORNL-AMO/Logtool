import { Component, OnInit } from '@angular/core';
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
  show = false;
  constructor(private route: ActivatedRoute, private data: DataService) { }

  ngOnInit() {
    this.data.currentdataInputArray.subscribe(input => this.inputDataArray = input);
    this.route.queryParams
      .subscribe(params => {
        this.arrayPointer = params.value;
        if (this.inputDataArray[this.arrayPointer] === undefined) {
        } else {
          this.show = true;
          this.columnDefs = this.inputDataArray[this.arrayPointer].selectedHeader;
          this.rowData = this.inputDataArray[this.arrayPointer].content;
        }
      });
  }

}
