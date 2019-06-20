import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {IndexFileStoreService} from '../../providers/index-file-store.service';
import * as d3 from 'd3';
import {BsModalRef, BsModalService} from 'ngx-bootstrap';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-import-data',
  templateUrl: './import-data.component.html',
  styleUrls: ['./import-data.component.scss'],
  encapsulation: ViewEncapsulation.None,   // THIS IS IMPORTANT FOR READING THE SCSS
})

export class ImportDataComponent implements OnInit {
  fileName: any;
  fileContent: any = '';
  header = [];
  selectedHeader = [];
  start: any;
  end: any;
  data_count: any;
  number_columns;
  readFirstRow = [];
  interval = '';
  filled: boolean;
  dataWithHeader = [];
  dataArrayColumns = [];

  constructor(private indexFileStore: IndexFileStoreService, private modalService: BsModalService, private bsModalRef: BsModalRef) {
  }

  ngOnInit() {
    this.fileName = 'Please select a file to upload';
    this.filled = false;
  }

  onChange(event) {
    this.fileName = '';
    this.fileContent = '';
    this.header = [];
    this.selectedHeader = [];
    this.start = '';
    this.end = '';
    this.data_count = '';
    this.number_columns = '';
    this.readFirstRow = [];
    this.dataWithHeader = [];
    this.dataArrayColumns = [];
    const files = event.target.files;
    const f = files[0];
    this.fileName = f.name;
    const workbook = XLSX.readFile(f.path, {cellDates: true});
    const worksheet: XLSX.WorkSheet = workbook.Sheets[workbook.SheetNames[0]];
    this.dataWithHeader = XLSX.utils.sheet_to_json(worksheet);
    this.dataArrayColumns = XLSX.utils.sheet_to_json(worksheet, {header: 1});
    this.header = Object.values(this.dataArrayColumns[0]);
    this.dataArrayColumns.shift();
    this.readFirstRow = Object.values(this.dataArrayColumns[1]);
    for (let i = 0; i < this.header.length; i++) {
      let check = false;
      check = !(this.readFirstRow[i] === null || this.readFirstRow[i] === undefined
        || this.readFirstRow[i] === '' || this.readFirstRow[i] === ' ');
      this.selectedHeader.push({
        id: i,
        checked: check,
        name: this.header[i]
      });
    }
    for (let i = 0; i < this.header.length; i++) {
      if (isNaN(parseInt(this.dataArrayColumns[1][i], 10)) && Date.parse(this.dataArrayColumns[1][i])) {
        this.start = this.dataArrayColumns[1][i];
        this.end = this.dataArrayColumns[this.dataArrayColumns.length - 1][i];
        break;
      }
    }
    this.data_count = this.dataArrayColumns.length - 1;
    this.number_columns = this.header.length;
    // Interval **************************************************************************************************************************
    this.filled = true;
  }

  submitCheckBox() {
    const displayHeader = [];
    for (let i = 0; i < this.selectedHeader.length; i++) {
      if (this.selectedHeader[i].checked) {
        displayHeader.push({
          headerName: this.selectedHeader[i].name,
          field: this.selectedHeader[i].name,
          editable: true
        });
      }
    }
    const holder = [];
    for (let i = 0; i < this.selectedHeader.length; i++) {
      const temp = [];
      if (this.selectedHeader[i].checked) {
        for (let j = 0; j < this.data_count; j++) {
          temp[j] = this.dataArrayColumns[j][i];
        }
        holder.push(temp);
      }
    }
    this.dataArrayColumns = holder;
    this.indexFileStore.addIntoDB(this.fileName, this.dataWithHeader, this.dataArrayColumns,
      this.selectedHeader, displayHeader, this.header, this.start, this.end, '', this.data_count, this.number_columns, '');
    setTimeout(() => {
      this.bsModalRef.hide();
      console.log('Send Data');
    }, 2000);
  }
  columnNameChange(event) {
    console.log(event);
  }
}
