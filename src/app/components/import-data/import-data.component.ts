import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {IndexFileStoreService} from '../../providers/index-file-store.service';
import {BsModalRef, BsModalService, ModalDirective} from 'ngx-bootstrap';
import * as XLSX from 'xlsx';
import * as d3 from 'd3';
import {isAbsolute} from 'path';
import {error} from 'util';
import {checkAndUpdateBinding} from '@angular/core/src/view/util';


@Component({
  selector: 'app-import-data',
  templateUrl: './import-data.component.html',
  styleUrls: ['./import-data.component.scss'],
  // encapsulation: ViewEncapsulation.None,   // THIS IS IMPORTANT FOR READING THE SCSS
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
  fileRename = [];
  alias = '';
  fileType = '';

  constructor(private indexFileStore: IndexFileStoreService, private modalService: BsModalService, private bsModalRef: BsModalRef) {}

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
    this.fileType = f.type;
    const workbook = XLSX.readFile(f.path, {cellDates: true});
    const worksheet: XLSX.WorkSheet = workbook.Sheets[workbook.SheetNames[0]];
    this.dataArrayColumns = XLSX.utils.sheet_to_json(worksheet, {header: 1});
    const checkHeader = Object.values(this.dataArrayColumns[0]);
    if (checkHeader.length < 2) {
      this.dataArrayColumns.shift();
      const range = XLSX.utils.decode_range(worksheet['!ref']);
      range.s.r += 1;
      worksheet['!ref'] = XLSX.utils.encode_range(range);
      this.dataWithHeader = XLSX.utils.sheet_to_json(worksheet);
    } else {
      this.dataWithHeader = XLSX.utils.sheet_to_json(worksheet);
    }
    this.header = Object.values(this.dataArrayColumns[0]);
    this.dataArrayColumns.shift();
    this.readFirstRow = Object.values(this.dataArrayColumns[0]);
    for (let i = 0; i < this.header.length; i++) {
      let check = false;
      check = !(this.readFirstRow[i] === null || this.readFirstRow[i] === undefined || this.readFirstRow[i] === ' ');
      this.selectedHeader.push({
        id: i,
        checked: check,
        name: this.header[i]
      });
    }
    const regex = '/^(?:(?:31(\\/|-|\\.)(?:0?[13578]|1[02]))\\1|(?:(?:29|30)(\\/|-|\\.)(?:0?[13-9]|1[0-2])\\2))' +
      '(?:(?:1[6-9]|[2-9]\\d)?\\d{2})$|^(?:29(\\/|-|\\.)0?2\\3(?:(?:(?:1[6-9]|[2-9]\\d)?(?:0[48]|[2468][048]' +
      '|[13579][26])|(?:(?:16|[2468][048]|[3579][26])00))))' +
      '$|^(?:0?[1-9]|1\\d|2[0-8])(\\/|-|\\.)(?:(?:0?[1-9])|(?:1[0-2]))\\4(?:(?:1[6-9]|[2-9]\\d)?\\d{2})$/';
    for (let i = 0; i < this.header.length; i++) {
      if ((isNaN(parseInt(this.dataArrayColumns[0][i], 10)) && Date.parse(this.dataArrayColumns[0][i]))
        || regex.search(this.dataArrayColumns[0][i])) {
        this.start = this.dataArrayColumns[0][i];
        this.end = this.dataArrayColumns[this.dataArrayColumns.length - 1][i];
        break;
      }
    }
    this.data_count = this.dataArrayColumns.length - 1;
    this.number_columns = this.header.length;
    this.filled = true;
    this.fileRename = this.selectedHeader.map(a => a.name);
    this.alias = this.fileName;
  }

  submitCheckBox() {
    const displayHeader = [];
    for (let i = 0; i < this.selectedHeader.length; i++) {
      if (this.selectedHeader[i].checked) {
        displayHeader.push({
          headerName: this.fileRename[i], // this.selectedHeader[i].name, //Rename Stuff
          field: this.selectedHeader[i].name, // Original Name
          editable: true
        });
      }
    }
    const holder = [];
    for (let i = 0; i < this.selectedHeader.length; i++) {
      const fileRename = [];
      if (this.selectedHeader[i].checked) {
        for (let j = 0; j < this.data_count; j++) {
          fileRename[j] = this.dataArrayColumns[j][i];
        }
        holder.push(fileRename);
      }
    }
    this.dataArrayColumns = holder;
    this.indexFileStore.addIntoDB(this.alias, this.dataWithHeader, this.dataArrayColumns,
      this.selectedHeader, displayHeader, this.header, this.start, this.end, '', this.data_count, this.number_columns, this.fileType);
    setTimeout(() => {
      this.bsModalRef.hide();
      console.log('Send Data');
    }, 2000);
  }

  columnNameChange(event) {
    this.fileRename[parseInt(event.target.id, 10)] = event.target.value;
    // console.log(this.fileRename);
  }

  rename(event) {
    this.alias = event.target.value;
  }

  public handler(type: string, $event: ModalDirective ) {
    console.log(
      `event ${type} is fired${$event.dismissReason
        ? ', dismissed by ' + $event.dismissReason
        : ''}`
    );
  }
}
