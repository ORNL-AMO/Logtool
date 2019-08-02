import {Component, OnInit, TemplateRef} from '@angular/core';
import {IndexFileStoreService} from '../../providers/index-file-store.service';
import {BsModalRef, BsModalService, ModalDirective} from 'ngx-bootstrap';
import {TooltipModule} from 'ngx-bootstrap/tooltip';
import * as XLSX from 'xlsx';
import {DataService} from '../../providers/data.service';
import {DataList} from '../../types/data-list';
import {RouteDataTransferService} from '../../providers/route-data-transfer.service';
import {LoadList} from '../../types/load-list';
import * as fs from 'fs';
import {ExportCSVService} from '../../providers/export-csv.service';


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
  dataFromFile: LoadList[];
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

  headerIndex; number;

  headerFind: any;
  private manualSample: any[];


  testModRef: BsModalRef;


  constructor(private indexFileStore: IndexFileStoreService, private modalService: BsModalService,
              private bsModalRef: BsModalRef, private data: DataService, private routerData: RouteDataTransferService,
              private exportCSV: ExportCSVService) {
  }

  progress(event) {

    this.getFirstRow(this.headerIndex);
    this.getTimeSeries(this.headerIndex);
    this.stage = 3;
  }

  regress() {
    this.stage--;
  }

  ngOnInit() {
      this.stage = 1;
  }

  /*readFile() {
    this.headerFind = 'auto';
    this.fileContent = '';
    this.header = [];
    this.selectedHeader = [];
    this.start = '';
    this.end = '';
    this.data_count = '';
    this.number_columns = '';
    this.readFirstRow = [];
    this.dataWithHeader = [];

    console.log('in modal');
    console.log(this.worksheet);
    console.log(this.workbook);
    console.log(this.dataArrayColumns);


    // this.dataArrayColumns = XLSX.utils.sheet_to_json(this.worksheet, {header: 1});
    console.log(typeof this.dataArrayColumns[0]);



    if ( !(this.dataArrayColumns[0] instanceof Object)) {

      alert('error parsing file, please confirm file is in a supported format');
      return;
    }


    // attempt to find header
    let headerIndex = 0;
    let checkHeader = Object.values(this.dataArrayColumns[headerIndex]);

    const range = XLSX.utils.decode_range(this.worksheet['!ref']);
    const numColumns = range.e.c + 1;
    console.log(this.dataArrayColumns[headerIndex]);

    let check1 = 0 , check2 = 0, check3 = 0;
    // check1 = checkHeader.length;

    while (checkHeader.length < numColumns && headerIndex < 5) {
      console.log(headerIndex, check1, check2, check3); // this.dataArrayColumns.length) {
      check3 = check2;
      check2 = check1;
      check1 = checkHeader.length;
      headerIndex++;
      checkHeader = Object.values(this.dataArrayColumns[headerIndex]);
      if (check1 === check2  && check1 === check3) {
        console.log('trip', Object.values(this.dataArrayColumns[headerIndex - 3]));
        headerIndex = headerIndex - 3;
        checkHeader = Object.values(this.dataArrayColumns[headerIndex]);
        break;
      }
    }

    if (headerIndex !== 0) {
      range.s.r = range.s.r + headerIndex;
      this.worksheet['!ref'] = XLSX.utils.encode_range(range);
      this.dataWithHeader = XLSX.utils.sheet_to_json(this.worksheet);
    } else {
      this.dataWithHeader = XLSX.utils.sheet_to_json(this.worksheet);
    }
    this.header = Object.values(this.dataArrayColumns[headerIndex]);


    this.stage = 2;
    this.onAutoSelection(headerIndex);
  }*/

  onFileSelect(event) {
    this.stage = 1;
    const files = event.target.files;
    const f = files[0];
    this.fileName = f.name;
    this.fileType = f.type;
    this.filePath = f.path;

    try {
      this.dataFromFile = JSON.parse(fs.readFileSync(this.filePath).toLocaleString());
      console.log('json');
      this.stage = 5;
    } catch {
      try {
        this.workbook = XLSX.readFile(f.path, {cellDates: true});
        this.worksheet = this.workbook.Sheets[this.workbook.SheetNames[0]];
        console.log(this.worksheet);
        this.dataArrayColumns = XLSX.utils.sheet_to_json(this.worksheet, {header: 1});
        this.stage = 2;
        this.AutoHeaders();
      } catch (e) {
        this.stage = 404;
        return;
      }
    }

  }

  confirmJSON() {
    this.exportCSV.readJsonFileSnapShot(this.dataFromFile);
    this.bsModalRef.hide();
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
    console.log('first', checkHeader);

    const range = XLSX.utils.decode_range(this.worksheet['!ref']);
    this.originalrange = {s: {r: 0, c: 0}, e: {r: range.e.r, c: range.e.c}};
    console.log(this.originalrange, this.originalrange.s.r, this.originalrange.s.c, this.originalrange.e.r, this.originalrange.e.c);
    const numColumns = range.e.c + 1; // range is 0 based;

    let check3 = 0, check2 = 0, check1 = checkHeader.length;

    while (checkHeader.length < numColumns && headerIndex < 10) {
      headerIndex++;
      checkHeader = Object.values(this.dataArrayColumns[headerIndex]);

      check3 = check2;
      check2 = check1;
      check1 = checkHeader.length;

      if (check3 === check1 && check3 === check2) {
        console.log(headerIndex);
        headerIndex = headerIndex - 2;
        checkHeader = Object.values(this.dataArrayColumns[headerIndex]);
        break;
      }

    }
    this.header = checkHeader;
    this.headerIndex = headerIndex;
    this.getDataWithHeader();
  }

  getDataWithHeader() {
    this.dataArrayColumns.shift();

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
    const regex = '/^(?:(?:31(\\/|-|\\.)(?:0?[13578]|1[02]))\\1|(?:(?:29|30)(\\/|-|\\.)(?:0?[13-9]|1[0-2])\\2))' +
      '(?:(?:1[6-9]|[2-9]\\d)?\\d{2})$|^(?:29(\\/|-|\\.)0?2\\3(?:(?:(?:1[6-9]|[2-9]\\d)?(?:0[48]|[2468][048]' +
      '|[13579][26])|(?:(?:16|[2468][048]|[3579][26])00))))' +
      '$|^(?:0?[1-9]|1\\d|2[0-8])(\\/|-|\\.)(?:(?:0?[1-9])|(?:1[0-2]))\\4(?:(?:1[6-9]|[2-9]\\d)?\\d{2})$/';

    const index = headerIndex + 1;
    for (let i = 0; i < this.header.length; i++) {
      // column is timeSeries if not a number and parsable as date , or matches regex above
      if ((isNaN(parseInt(this.dataArrayColumns[index][i], 10)) && Date.parse(this.dataArrayColumns[index][i])) ||
        (typeof this.dataArrayColumns[index][i] === 'string' && this.dataArrayColumns[index][i].search(regex))) {

        this.start = this.dataArrayColumns[index][i];
        this.end = this.dataArrayColumns[this.dataArrayColumns.length - 1][i];

        break;
      }

    }

    this.data_count = this.dataArrayColumns.length - 1;
    this.number_columns = this.header.length;
    this.stage = 2;
    this.fileRename = this.selectedHeader.map(a => a.name);
    this.alias = this.fileName;
    // console.log('END');
  }
/*
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

    console.log(this.dataArrayColumns);

    const numColumns = XLSX.utils.decode_range(worksheet['!ref']).e.c + 1;
    console.log(numColumns);

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
    console.log(this.header);
    // ---------------------------------------------------------------------------------------------------------------

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
    console.log(this.dataArrayColumns);
    for (let i = 0; i < this.header.length; i++) {
      console.log(this.dataArrayColumns[1][i]);
      console.log(Date.parse(this.dataArrayColumns[1][i]), isNaN(parseInt(this.dataArrayColumns[1][i], 10)));
      console.log(typeof this.dataArrayColumns[1][i] === 'string');
      if ((isNaN(parseInt(this.dataArrayColumns[1][i], 10)) && Date.parse(this.dataArrayColumns[1][i])) ||
        (typeof this.dataArrayColumns[1][i] === 'string' && this.dataArrayColumns[1][i].search(regex))) {
        // || regex.search(this.dataArrayColumns[1][i])) {
        this.start = this.dataArrayColumns[1][i];
        this.end = this.dataArrayColumns[this.dataArrayColumns.length - 1][i];
        // console.log('start', this.start);
        // break;
      }

    }

    this.data_count = this.dataArrayColumns.length - 1;
    this.number_columns = this.header.length;
    this.stage = 2;
    this.fileRename = this.selectedHeader.map(a => a.name);
    this.alias = this.fileName;
  }*/

  manualHeaders(template:  TemplateRef<any> ) {

    this.worksheet['!ref'] = XLSX.utils.encode_range(this.originalrange);
    this.dataArrayColumns = XLSX.utils.sheet_to_json(this.worksheet, {header: 1});

    if (this.dataArrayColumns.length < 5) {
      this.manualSample = this.dataArrayColumns.slice(0, this.dataArrayColumns.length - 1);
    } else { this.manualSample = this.dataArrayColumns.slice(0, 5); }

    for (let i = 0; i < this.manualSample.length; i++) {
      if (this.manualSample[i].length >= 4) { this.manualSample[i] = this.manualSample[i].slice(0, 5); }
    }

    this.testModRef = this.modalService.show(template, Object.assign({}, { class: 'modal-lg' }));
  }
  manualRow(index: number) {
    this.header = this.dataArrayColumns[index];
    this.headerIndex = index;
    this.testModRef.hide();
    this.getDataWithHeader();
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
          fileRename[j] = this.dataArrayColumns[j + 1][i];
        }
        holder.push(fileRename);
      }

    }
    this.dataArrayColumns = holder;
    const id = this.data.getRandomInt(9999999);
    const dataList: DataList = {
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
    this.indexFileStore.addIntoDBFileInput(dataList);
    setTimeout(() => {
      this.bsModalRef.hide();
      console.log('Send Data');
    }, 2000);
    this.routerData.storage = dataList;
  }
  columnNameChange(event) {
    this.fileRename[parseInt(event.target.id, 10)] = event.target.value;
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
    console.log(this.headerFind);
    this.headerFind = type;
    console.log(this.headerFind);
  }


}
