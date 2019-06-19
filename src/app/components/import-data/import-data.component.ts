import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {IndexFileStoreService} from '../../providers/index-file-store.service';
import * as d3 from 'd3';
import {BsModalRef, BsModalService, ModalDirective, ModalModule} from 'ngx-bootstrap';

@Component({
  selector: 'app-import-data',
  templateUrl: './import-data.component.html',
  styleUrls: ['./import-data.component.scss'],
  encapsulation: ViewEncapsulation.None,   //THIS IS IMPORTANT FOR READING THE SCSS
})

export class ImportDataComponent implements OnInit {
  fileName: any;
  fileContent: any = '';
  header = [];
  start: any;
  end: any;
  data_count: any;
  number_columns;
  readFirstRow: any;
  fileCsvRead = [];

  constructor(private indexFileStore: IndexFileStoreService, private modalService: BsModalService, private bsModalRef: BsModalRef) {
  }

  ngOnInit() {
    this.fileName = 'Please select a file to upload';
  }

  onChange(event) {
    this.fileName = '';
    this.fileContent = '';
    this.header = [];
    this.start = '';
    this.end = '';
    this.data_count = '';
    this.number_columns = '';
    this.readFirstRow = '';
    this.fileCsvRead = [];
    const reader = new FileReader();
    this.fileName = event.target.files[0].name;
    reader.readAsText(event.target.files[0]);
    const me = this;
    reader.onload = function () {
      me.fileContent = '';
      me.fileContent = reader.result;
      me.fileCsvRead = me.fileContent.split('\n');
      me.fileContent = d3.csvParse(me.fileContent);
      me.readFirstRow = me.fileCsvRead[1].split(',');
      for (let i = 0; i < me.fileCsvRead[0].split(',').length; i++) {
        let check = false;
        check = !(me.readFirstRow[i] === null || me.readFirstRow[i] === undefined
          || me.readFirstRow[i] === '' || me.readFirstRow[i] === ' ');
        me.header.push({
          id: i,
          checked: check,
          name: me.fileCsvRead[0].split(',')[i]
        });
      }
      me.start = me.fileCsvRead[1].split(',')[1];
      if (me.fileCsvRead[me.fileCsvRead.length - 1] === '' ||
        me.fileCsvRead[me.fileCsvRead.length - 1] === undefined
        || me.fileCsvRead[me.fileCsvRead.length - 1] === null) {
        me.end = me.fileCsvRead[me.fileCsvRead.length - 2].split(',')[1];
      } else {
        me.end = me.fileCsvRead[me.fileCsvRead.length - 1].split(',')[1];
      }
      me.data_count = me.fileContent.length;
      me.number_columns = me.header.length;
    };
  }

  submitCheckBox(formData) {
    const formDataVariable = [];
    const dataArrayColumns = [];
    const selectedHeader = [];
    for (let i = 0; i < this.header.length; i++) {
      if (formData[i]) {
        formDataVariable.push(i);
      }
    }
    for (let z = 0; z < formDataVariable.length; z++) {
      const temp = [];
      for (let i = 1; i < this.fileCsvRead.length; i++) {
        const initialSplit = this.fileCsvRead[i].split(',');
        for (let j = 0; j < initialSplit.length; j++) {
          if (j === formDataVariable[z]) {
            temp.push(initialSplit[j]);
          }
        }
      }
      dataArrayColumns.push(temp);
    }
    for (let i = 0; i < this.header.length; i++) {
      if (this.header[i].checked) {
        selectedHeader.push({
          headerName: this.header[i].name,
          field: this.header[i].name,
          editable: true
        });
      }

    }
    this.indexFileStore.addIntoDB(this.fileName, this.fileContent, dataArrayColumns,
      this.header, selectedHeader, this.fileContent.columns, this.start, this.end, '', this.data_count, this.number_columns, '');
    setTimeout(() => {
     // this.dialog.close();
      console.log('Send Data');
    }, 2000);
  }
  columnNameChange(event) {
    console.log(event);
  }



}
