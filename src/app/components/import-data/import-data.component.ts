import {Component, OnInit, TemplateRef} from '@angular/core';
import {BsModalRef, BsModalService, ModalDirective} from 'ngx-bootstrap';
import * as XLSX from 'xlsx';
import {DataService} from '../../providers/data.service';
import {RouteDataTransferService} from '../../providers/route-data-transfer.service';
import * as fs from 'fs';
import {ExportCSVService} from '../../providers/export-csv.service';
import {IndexDataBaseStoreService} from '../../providers/index-data-base-store.service';
import {CSVFileInput} from '../../types/csvfile-input';
import {Subject} from 'rxjs';


@Component({
  selector: 'app-import-data',
  templateUrl: './import-data.component.html',
  styleUrls: ['./import-data.component.scss'],
  // encapsulation: ViewEncapsulation.None,   // THIS IS IMPORTANT FOR READING THE SCSS
})

export class ImportDataComponent implements OnInit {
  stage: number;
  alias = '';

  fileName: any;
  filePath: any;
  fileType: any;

  workbook: XLSX.WorkBook;
  worksheet: XLSX.WorkSheet;
  dataFromFile: any[];
  originalrange: XLSX.Range;
  header = [];
  selectedHeader = [];


  start: any;
  interval = '';
  end: any;
  data_count: any;
  number_columns;
  readFirstRow = [];

  fileContent: any = '';
  dataWithHeader = [];
  dataArrayColumns = [];
  fileRename = [];

  headerIndex;
  number;

  headerFind: any;
  manualSample: any[];

  public tableItem: Subject<any>;
  id: Subject<number>;

  testModRef: BsModalRef;
  type;

  constructor(private modalService: BsModalService, private indexFileStore: IndexDataBaseStoreService,
              public bsModalRef: BsModalRef, private data: DataService, private routerData: RouteDataTransferService,
              private exportCSV: ExportCSVService) {
  }

  progress(event) {
    this.getFirstRow(this.headerIndex);
    this.getTimeSeries(this.headerIndex);
    this.stage = 3;
  }

  regress() {
    this.selectedHeader = [];
    this.stage--;
  }

  ngOnInit() {
    this.id = new Subject();
    this.stage = 1;
    this.headerFind = 'auto';
  }

  onFileSelect(event) {
    this.stage = 1;
    this.headerFind = 'auto';
    const files = event.target.files;
    const f = files[0];
    this.fileName = f.name;
    this.fileType = f.type;
    this.filePath = f.path;

    try {
      this.dataFromFile = JSON.parse(fs.readFileSync(this.filePath).toLocaleString());
      if (this.type !== 'json') {
        throw (Error);
      }
      this.stage = 5;

    } catch {
      try {
        if (this.type !== 'csv') {
          throw (Error);
        }
        this.workbook = XLSX.readFile(f.path, {cellDates: true});
        this.worksheet = this.workbook.Sheets[this.workbook.SheetNames[0]];
        this.dataArrayColumns = XLSX.utils.sheet_to_json(this.worksheet, {header: 1});
        this.stage = 2;
        const range = XLSX.utils.decode_range(this.worksheet['!ref']);
        this.originalrange = {s: {r: 0, c: 0}, e: {r: range.e.r, c: range.e.c}};
        this.AutoHeaders();
      } catch (e) {
        this.stage = 404;
        return;
      }
    }

  }

  confirmJSON() {
    if (this.dataFromFile[0].dayTypeMode) {
      this.exportCSV.readJsonFileSnapShotDayType(this.dataFromFile);
      this.bsModalRef.hide();
    } else if (this.dataFromFile[0].visualizeMode) {
      this.exportCSV.readJsonFileVisualizer(this.dataFromFile);
      this.bsModalRef.hide();
    } else {
      alert('Unknown Json Format');
    }
  }

  AutoHeaders() {
    this.fileContent = '';
    this.header = [];
    this.selectedHeader = [];

    this.start = '';
    this.end = '';
    this.data_count = '';
    this.number_columns = '';

    this.readFirstRow = [];
    this.dataWithHeader = [];

    // attempt to find header
    let headerIndex = 0;
    let checkHeader = Object.values(this.dataArrayColumns[headerIndex]);

    this.worksheet['!ref'] = XLSX.utils.encode_range(this.originalrange);
    const range = XLSX.utils.decode_range(this.worksheet['!ref']);

    const numColumns = range.e.c + 1; // range is 0 based;

    let check3 = 0, check2 = 0, check1 = checkHeader.length;

    while (checkHeader.length < numColumns && headerIndex < 10) {
      headerIndex++;
      checkHeader = Object.values(this.dataArrayColumns[headerIndex]);

      check3 = check2;
      check2 = check1;
      check1 = checkHeader.length;

      if (check3 === check1 && check3 === check2) {
        headerIndex = headerIndex - 2;
        checkHeader = Object.values(this.dataArrayColumns[headerIndex]);
        break;
      }

    }
    this.header = checkHeader;
    this.headerIndex = headerIndex;
    this.getDataWithHeader();
  }

  noHeaders() {

    this.worksheet['!ref'] = XLSX.utils.encode_range(this.originalrange);
    this.dataArrayColumns = XLSX.utils.sheet_to_json(this.worksheet, {header: 1});
    this.fileContent = '';
    const start = this.originalrange.s.c;
    const end = this.originalrange.e.c;
    this.header = new Array(end - start + 1);
    this.header.fill('');
    console.log(start, end, this.header);
    this.selectedHeader = [];

    this.start = '';
    this.end = '';
    this.data_count = '';
    this.number_columns = '';

    this.readFirstRow = Object.values(this.dataArrayColumns[0]);
    this.dataWithHeader = [];


    this.headerIndex = 0;
    this.getDataWithHeader();
  }

  getDataWithHeader() {
    this.dataArrayColumns.shift();
    const range: XLSX.Range = this.originalrange;
    if (this.headerIndex !== 0) {
      this.originalrange.s.r = this.originalrange.s.r + this.headerIndex;
      this.worksheet['!ref'] = XLSX.utils.encode_range(this.originalrange);
      this.dataWithHeader = XLSX.utils.sheet_to_json(this.worksheet);
    } else {
      this.dataWithHeader = XLSX.utils.sheet_to_json(this.worksheet);
    }
    this.stage = 2;

  }

  getFirstRow(headerIndex) {
    this.readFirstRow = [];
    for (let i = 0; i < this.header.length; i++) {
      this.readFirstRow[i] = this.dataArrayColumns[headerIndex][i];
      if (this.readFirstRow[i] === undefined) {
        for (let j = headerIndex + 2; j < 100; j++) {
          this.readFirstRow[i] = this.dataArrayColumns[j][i];
          if (this.readFirstRow[i] !== undefined) {
            break;
          }
        }
      }
    }

    for (let i = 0; i < this.header.length; i++) {
      let check = false;
      check = !(this.readFirstRow[i] === null || this.readFirstRow[i] === undefined || this.readFirstRow[i] === ' ');
      this.selectedHeader.push({
        id: i,
        checked: check,
        name: this.header[i]
      });
    }
    // console.log('selectedHeader', this.selectedHeader);
  }

  getTimeSeries(headerIndex) {
    // regex for detecting unusual date types
    const regex = new RegExp('/^(?:(?:31(\\/|-|\\.)(?:0?[13578]|1[02]))\\1|(?:(?:29|30)(\\/|-|\\.)(?:0?[13-9]|1[0-2])\\2))' +
      '(?:(?:1[6-9]|[2-9]\\d)?\\d{2})$|^(?:29(\\/|-|\\.)0?2\\3(?:(?:(?:1[6-9]|[2-9]\\d)?(?:0[48]|[2468][048]' +
      '|[13579][26])|(?:(?:16|[2468][048]|[3579][26])00))))' +
      '$|^(?:0?[1-9]|1\\d|2[0-8])(\\/|-|\\.)(?:(?:0?[1-9])|(?:1[0-2]))\\4(?:(?:1[6-9]|[2-9]\\d)?\\d{2})$/');

    const timeCheck = /[0-9][0-9]:[0-9][0-9]/;
    const dateCheck = /[0-9]-[0-9]|\/\/|\/[0-9]/;

   // console.log(new Date('6-30-1991 5:00'));

    const timelist = [];

    const index = headerIndex + 1;
   // console.log(this.dataArrayColumns[index - 1]);
    for (let i = 0; i < this.header.length; i++) {
      // column is timeSeries if not a number and parsable as date , or matches regex above
      if ((isNaN(parseInt(this.dataArrayColumns[index][i], 10)) && !isNaN(Date.parse(this.dataArrayColumns[index][i]))) ||
        (typeof this.dataArrayColumns[index][i] === 'string' && this.dataArrayColumns[index][i].search(regex) > -1)) {

        this.start = this.dataArrayColumns[index][i];
        this.end = this.dataArrayColumns[this.dataArrayColumns.length - 1][i];
        timelist.push({value: this.dataArrayColumns[index][i], index: i, type: 'date'});
      } else if (typeof this.dataArrayColumns[index][i] === 'string' && this.dataArrayColumns[index][i].search(dateCheck) > -1) {
        timelist.push({value: this.dataArrayColumns[index][i], index: i, type: 'dateMismatch'});
      } else if (typeof this.dataArrayColumns[index][i] === 'string' && this.dataArrayColumns[index][i].search(timeCheck) > -1) {
        timelist.push({value: this.dataArrayColumns[index][i], index: i, type: 'time'});
      }
    }
    if (timelist.length === 1 && timelist[0].type === 'dateMismatch') {
      // custom Date parser
    }
    if (timelist.length === 2) {
      if (timelist[0].type !== timelist[1].type) {
        if (timelist[0].type === 'date') {
          if (timelist[1].type === 'time') {/* Merge */
          } else { /* custom parser + merge */
          }
          const array = [];
          for (let i = headerIndex; i < this.dataArrayColumns.length; i++) {
            const date = this.dataArrayColumns[i][timelist[0].index];
            /*console.log(date.toString().slice(4,15));*/
            let time = this.dataArrayColumns[i][timelist[1].index];
            if (time === '24:00') {
              time = '0:00';
            }
            this.dataArrayColumns[i][timelist[0].index] = new Date(date.toString().slice(4, 15) + ' ' + time);
            /*this.dataArrayColumns[i][timelist[0].index] = new Date(date.getMonth + ' ' + date.getDate + ' ' + date.getFullYear() +
                                 ' ' +  this.dataArrayColumns[i][timelist[1].index]);*/
          }


        } else if (timelist[1].type === 'time') {
          if (timelist[0].type === 'date') {/* Merge */
          } else { /* custom parser + merge */
          }

        } else {
          // prompt?
        }
      }
    } else {
      // prompt?
    }

    this.data_count = this.dataArrayColumns.length - 1;
    this.number_columns = this.header.length;
    this.stage = 2;
    this.fileRename = this.selectedHeader.map(a => a.name);
    this.alias = this.fileName;
    // console.log('END');
  }

  manualHeaders(template: TemplateRef<any>) {

    this.worksheet['!ref'] = XLSX.utils.encode_range(this.originalrange);
    this.dataArrayColumns = XLSX.utils.sheet_to_json(this.worksheet, {header: 1});

    if (this.dataArrayColumns.length < 5) {
      this.manualSample = this.dataArrayColumns.slice(0, this.dataArrayColumns.length - 1);
    } else {
      this.manualSample = this.dataArrayColumns.slice(0, 5);
    }

    for (let i = 0; i < this.manualSample.length; i++) {
      if (this.manualSample[i].length >= 4) {
        this.manualSample[i] = this.manualSample[i].slice(0, 5);
      }
    }
    console.log(this.manualSample, this.manualSample[0]);
    const table = document.getElementsByClassName('test');
    console.log(this.manualSample[0].length * 135);
    table[0].setAttribute('width', this.manualSample[0].length * 135 + 'px');
    this.testModRef = this.modalService.show(template, Object.assign({}, {class: 'modal-lg'}));
  }

  manualRow(index: number) {
    this.header = this.dataArrayColumns[index];
    this.headerIndex = index;
    this.testModRef.hide();
    this.getDataWithHeader();
  }

  headersfilled() {
    if (this.headerFind !== 'none') {
      return true;
    }

    for (let i = 0; i < this.selectedHeader.length; i++) {
      if (this.selectedHeader[i].checked && this.fileRename[i] === '') {
        return false;
      }
    }
    return true;
  }

  submitCheckBox() {
    console.log('submit checkbox');
    if ( !this.headersfilled()) {
      alert('Not all selected columns are named, please name all selected columns');
      return;
    }

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
          fileRename[j] = this.dataArrayColumns[j + 1][i];
        }
        holder.push(fileRename);
      }

    }
    this.dataArrayColumns = holder;
    const id = this.data.getRandomInt(9999999);
    const dataList: CSVFileInput = {
      id: id,
      name: this.alias,
      content: this.dataWithHeader,
      dataArrayColumns: this.dataArrayColumns,
      headerDetails: this.selectedHeader,
      selectedHeader: displayHeader,
      header: this.header,
      startDate: this.start,
      endDate: this.end,
      interval: '',
      countOfRow: this.data_count,
      countOfColumn: this.number_columns,
      fileType: this.fileType,
      dateUpload: 'DateUpload'
    };
    this.indexFileStore.insertIntoCSVStore(dataList).then( () => {

      this.id.next(id);
    });
    setTimeout(() => {
      this.bsModalRef.hide();
      console.log('Send Data');
    }, 2000);

  }

  columnNameChange(event) {
    this.fileRename[parseInt(event.target.id, 10)] = event.target.value;
    console.log(this.fileRename);
  }

  rename(event) {
    this.alias = event.target.value;
  }

  public handler(type: string, $event: ModalDirective) {
    console.log(
      `event ${type} is fired${$event.dismissReason
        ? ', dismissed by ' + $event.dismissReason
        : ''}`
    );
  }

  check(type) {
    this.headerFind = type;
  }


}
