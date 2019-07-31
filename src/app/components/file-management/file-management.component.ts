import {Component, OnInit} from '@angular/core';
import {ImportDataComponent} from '../import-data/import-data.component';
import {ExportCSVService} from '../../providers/export-csv.service';
import {DataService} from '../../providers/data.service';
import {IndexFileStoreService} from '../../providers/index-file-store.service';
import {BsModalRef, BsModalService} from 'ngx-bootstrap';
import * as XLSX from 'xlsx';

import * as fs from 'fs';
import {tryCatch} from 'rxjs/internal-compatibility';
import {Router} from '@angular/router';
import {SaveLoadService} from '../../providers/save-load.service';
import {LoadList} from '../../types/load-list';


@Component({
  selector: 'app-file-management',
  templateUrl: './file-management.component.html',
  styleUrls: ['./file-management.component.scss']
})
export class FileManagementComponent implements OnInit {
  private dataFromDialog: any;
  private fileList: any;
  private active: any;
  bsModalRef: BsModalRef;
  private filetype: any;
  private selected: any;


  constructor(private router: Router, private data: DataService, private indexFileStore: IndexFileStoreService,
              private modalService: BsModalService, private exportCsv: ExportCSVService, private saveLoad: SaveLoadService) {
  }

  snapShotList: any[];
  activeStats: any;
  inputFile: any;

  ngOnInit() {
    this.generateFileList();
    this.generateSnapShotList();
    this.selected = [];
  }

  generateFileList() {
    this.indexFileStore.viewDataDB().then(result => {
      this.dataFromDialog = result;
      if (this.dataFromDialog === null || this.dataFromDialog === undefined) {
      } else {
        this.fileList = [];
        // console.log(this.dataFromDialog);
        for (let i = 0; i < this.dataFromDialog.length; i++) {
          this.fileList.push({
            name: this.dataFromDialog[i].name,
            id: this.dataFromDialog[i].id
          });
        }

      }
    }, error => {
      console.log(error);
    });
  }

  generateSnapShotList() {
    this.indexFileStore.viewDataDBSaveInput().then(data => {
      this.data.currentDataInputSaveLoadArray.subscribe(result => {
        this.snapShotList = result;
      });
    });
  }

  getMetadata() {
    if (this.active !== undefined && this.dataFromDialog !== null && this.active > 0) {
      const activeFile = this.dataFromDialog.find(obj => obj.id === this.active);
      this.activeStats = {
        name: activeFile.name,
        type: activeFile.fileType,
        rowCount: activeFile.countOfRow,
        columnCount: activeFile.countOfColumn,
        start: activeFile.startDate,
        end: activeFile.endDate,
      };
    }
    else{this.activeStats = null;}
  }

  fileSelect(event, file) {
    console.log('fileSelect');
    this.toggleHighlight(event, file);
    if(this.selected.length > 0) {
      this.active = file.id;
    }else{ this.active = -1;}
    console.log(this.active);
    this.getMetadata();
    this.changeDisplayTable(this.active);
  }

  snapSelect(event) {}

  // adds selected class to target

  toggleHighlight(event, file) {

    const list = document.getElementById(event.target.id).classList;

    if (list.contains('selected')) {
      list.remove('selected');
      const index = this.selected.findIndex(obj => obj.name === file.name);
      if (this.selected[index].tabId === this.active) {
        if(this.selected.length === 1) { this.changeDisplayTable(-1); }
        }
        this.selected.splice(index,1);
        } else {
      list.add('selected');
      this.selected.push({
        name: file.name,
        id : event.target.id,
        tabId: this.selected.length === 0 ? 0 : this.selected[this.selected.length -1].tabId + 1,
      });

    }


  }

  getFile(event) {
    this.inputFile = event.target.files[0];
    this.filetype = this.inputFile.type;
    console.log(this.inputFile);
  }

  showInputModal() {
    if (this.inputFile === undefined) {
      alert('No input file detected please select a file');
      return;
    }

    try {
      const dataFromFile: LoadList[] = JSON.parse(fs.readFileSync(this.inputFile.path).toLocaleString());
      // this.exportCsv.readJsonFile(dataFromFile);
      alert('First catch');
      return;
    } catch {
      try {
        const loadedWorkbook = XLSX.readFile(this.inputFile.path, {cellDates: true});
        const worksheet: XLSX.WorkSheet = loadedWorkbook.Sheets[loadedWorkbook.SheetNames[0]];
        const dataArrayColumns = XLSX.utils.sheet_to_json(worksheet, {header: 1});
        const initialState = {
          stage: 2,
          fileName: this.inputFile.name,
          path: this.inputFile.path,
          fileType: this.inputFile.type,
          ignoreBackdropClick: true,
          class: 'my-modal',
          workbook: loadedWorkbook,
          worksheet: worksheet,
          dataArrayColumns: dataArrayColumns,
        };
        this.bsModalRef = this.modalService.show(ImportDataComponent, {initialState});
        this.bsModalRef.content.closeBtnName = 'Close';
        this.modalService.onHidden.subscribe(() => {
          this.generateFileList();
        });

      } catch {
        alert('File unable to be parsed, Please confirm file is of a supported type');
      }
    }
  }


  saveMetaData(event) {}

  getTabWidth(tab) {
      // Create fake div
      const fakeDiv = document.createElement('span');
      fakeDiv.style.fontSize = '15px';
      fakeDiv.innerHTML = tab.name;

      fakeDiv.id = 'testbed';
      document.body.appendChild(fakeDiv);

      const pv = document.getElementById('testbed').offsetWidth;
      // Remove div after obtaining desired color value
      document.body.removeChild(fakeDiv);


      return pv + 40 + 'px';

    }

  changeDisplayTable(value) {
    this.router.navigateByUrl('/file-manage/table-data', {skipLocationChange: true}).then(() => {
      this.router.navigate(['/file-manage/table-data'], {
        queryParams: {
          value: value
        }
      });
    });
    this.active = value;
  }
}
