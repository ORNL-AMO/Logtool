import { Component, OnInit } from '@angular/core';
import {ImportDataComponent} from '../import-data/import-data.component';
import {ImportJsonFileComponent} from '../import-json-file/import-json-file.component';
import {SaveLoadService} from '../../providers/save-load.service';
import {LoadList} from '../../types/load-list';
import {ExportCSVService} from '../../providers/export-csv.service';
import {DataService} from '../../providers/data.service';
import {GraphCalculationService} from '../../providers/graph-calculation.service';
import {GraphCreationService} from '../../providers/graph-creation.service';
import {IndexFileStoreService} from '../../providers/index-file-store.service';
import {BsModalRef, BsModalService} from 'ngx-bootstrap';


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

  constructor(private data: DataService, private indexFileStore: IndexFileStoreService,
              private modalService: BsModalService, private exportCsv: ExportCSVService, private saveLoad: SaveLoadService) {
  }

  snapShotList: any[];
  activeStats: any;
  inputFile: any;

  ngOnInit() {
    this.generateFileList();
    this.generateSnapShotList();
  }

  generateFileList() {
    this.indexFileStore.viewDataDB().then(result => {
      this.dataFromDialog = result;
      if (this.dataFromDialog === null || this.dataFromDialog === undefined) {
      } else {
        this.fileList = [];
        //console.log(this.dataFromDialog);
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
    if (this.active !== undefined && this.dataFromDialog !== null) {
      const activeFile = this.dataFromDialog.find(obj => obj.id === this.active);
      this.activeStats = {
        name: activeFile.name,
        type: activeFile.fileType,
        rowCount: activeFile.countOfRow,
        columnCount: activeFile.countOfColumn,


      }
      console.log(activeFile);

    }
  }

  fileSelect(event, id) {
    this.toggleHighlight(event);
    this.active = id;
    console.log(this.active);
    this.getMetadata();
  }

  snapSelect(event) {
    this.toggleHighlight(event);
  }

  //adds selected class to target
  toggleHighlight(event) {

    const list = document.getElementById(event.target.id).classList;

    if (list.contains('selected')) {
      list.remove('selected');
    } else {
      list.add('selected');
    }
    /*    const selectedArray = document.getElementsByClassName('selected');
        for (let n = 0; n < selectedArray.length; n++) {
          selectedArray[n].classList.remove('selected');
        }*/

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
    const initialState = {
      stage: 2,
      fileName: this.inputFile.name,
      path: this.inputFile.path,
      fileType: this.inputFile.type,
      ignoreBackdropClick: true,
      class: 'my-modal',

    };
    this.bsModalRef = this.modalService.show(ImportDataComponent,  {initialState});
    this.bsModalRef.content.closeBtnName = 'Close';

  }

}
