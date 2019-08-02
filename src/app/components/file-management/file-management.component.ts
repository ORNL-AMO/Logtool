import {Component, OnInit} from '@angular/core';
import {ImportDataComponent} from '../import-data/import-data.component';
import {ExportCSVService} from '../../providers/export-csv.service';
import {DataService} from '../../providers/data.service';
import {IndexFileStoreService} from '../../providers/index-file-store.service';
import {BsModalRef, BsModalService} from 'ngx-bootstrap';
import * as XLSX from 'xlsx';
import * as fs from 'fs';
import {Router} from '@angular/router';
import {SaveLoadService} from '../../providers/save-load.service';
import {LoadList} from '../../types/load-list';
import {FileMetaData} from '../../types/file-meta-data';
import {RouteDataTransferService} from '../../providers/route-data-transfer.service';
import {DataList} from '../../types/data-list';

@Component({
  selector: 'app-file-management',
  templateUrl: './file-management.component.html',
  styleUrls: ['./file-management.component.scss']
})
export class FileManagementComponent implements OnInit {
  private dataFromDialog: any;
  private fileList: any;
  private snapShotListDayType: any[];
  private snapShotListGraph: any[];

  bsModalRef: BsModalRef;
  private filetype: any;

  // list of selected files
  private selected: any;
  private active: any;

  // MetaData variables
  private activeMetaData: FileMetaData;
  private metaList: any;
  private activeStats: any;

  constructor(private router: Router, private data: DataService, private indexFileStore: IndexFileStoreService,
              private modalService: BsModalService, private exportCsv: ExportCSVService, private saveLoad: SaveLoadService,
              private routeService: RouteDataTransferService) {
  }

  inputFile: any;
  metahidden: any;

  ngOnInit() {
    this.generateFileList();
    this.generateSnapShotListDayType();
    this.generateSnapShotListVisualize();
    this.selected = [];
    this.metaDataReset();
    this.metahidden = true;
  }

  blankMetaData() {
    return new FileMetaData(0, 0, '', '', '', '',
      {street: '', city: '', state: '', zip: 0, country: ''},
      0, 0, '', '');
  }

  metaDataReset() {
    this.activeMetaData = new FileMetaData(0, 0, '', '', '', '',
      {street: '', city: '', state: '', zip: 0, country: ''},
      0, 0, '', '');
  }

  // Pull things from database
  generateFileList() {
    this.indexFileStore.viewDataDB().then(result => {
      this.dataFromDialog = result;
      if (this.dataFromDialog === null || this.dataFromDialog === undefined) {
      } else {
        this.fileList = [];
        for (let i = 0; i < this.dataFromDialog.length; i++) {
          this.fileList.push({
            name: this.dataFromDialog[i].name,
            id: this.dataFromDialog[i].id,
            selected: false
          });
        }

      }
    }, error => {
      console.log(error);
    });
  }

  generateSnapShotListDayType() {
    this.indexFileStore.viewDataDBSaveInput().then(data => {
      this.data.currentDataInputSaveLoadArray.subscribe(result => {
        this.snapShotListDayType = result;
      });
    });
  }

  generateSnapShotListVisualize() {
    this.indexFileStore.viewDataDBGraph().then(data => {
      this.data.currentDataInputGraphArray.subscribe(result => {
        this.snapShotListGraph = result;
      });
    });
  }

  generateMetaDataList(id) {
    this.indexFileStore.viewDataDB().then(result => {
      const metaDataFromDialog = result;
      if (metaDataFromDialog === null || metaDataFromDialog === undefined) {
        console.log('no metadata found');
      } else {
        // console.log(this.dataFromDialog);
        /*  for (let i = 0; i < metaDataFromDialog.length; i++) {*/
        this.metaList.push(this.blankMetaData());
        /*    }*/

      }
    }, error => {
      console.log(error);
    });
  }


  // Change visuals based on active selection
  getFileData() {
    if (this.dataFromDialog !== null && this.active > -1) {
      const targetId = this.fileList[this.active].id;
      const activeFile = this.dataFromDialog.find(obj => obj.id === targetId);
      this.activeStats = {
        name: activeFile.name,
        type: activeFile.fileType,
        rowCount: activeFile.countOfRow,
        columnCount: activeFile.countOfColumn,
        start: activeFile.startDate,
        end: activeFile.endDate,
      };
    } else {
      this.activeStats = null;
    }
  }


  toggleSelect(index, file) {
    const content = this.selected.findIndex(obj => obj.name === file.name);
    if (content < 0) {
      this.selected.push({
        name: file.name,
        IndexID: file.id,
        tabID: index
      });
      this.fileList[index].selected = true;
      this.active = index;
      this.activeUpdated();
    } else {
      console.log();
      this.indexFileStore.deleteFromDBTemp(this.selected[content].IndexID);
      if (this.selected.length === 1) {
        this.active = -1;
      } else if (this.active === this.selected[content].tabID) {
      } else if (this.active === 0) {
        this.active++;
      } else {
        this.active--;
      }

      this.activeUpdated();
      this.fileList[index].selected = false;
      this.selected.splice(content, 1);
    }
  }

  tabSelect(index) {
    this.active = index;
    this.activeUpdated();
    console.log(this.activeMetaData.companyName);
  }

  // update visuals based on selections
  activeUpdated() {
    this.showFileData();
    this.showMetaData();
    this.changeDisplayTable();
  }

  showMetaData() {
  }

  changeDisplayTable() {
    // console.log('in router call', this.active);
    this.router.navigateByUrl('table-data', {skipLocationChange: true}).then(() => {
      this.router.navigate(['table-data'], {
        queryParams: {
          value: this.active
        }
      });
    });
  }

  showFileData() {
    if (this.dataFromDialog !== null && this.active > -1) {
      const targetId = this.fileList[this.active].id;
      const activeFile: DataList = this.dataFromDialog.find(obj => obj.id === targetId);
      this.activeStats = {
        name: activeFile.name,
        type: activeFile.fileType,
        rowCount: activeFile.countOfRow,
        columnCount: activeFile.countOfColumn,
        start: activeFile.startDate,
        end: activeFile.endDate,
      };
      this.indexFileStore.addIntoDBFileInputTemp(activeFile);
    } else {
      this.activeStats = null;
    }
  }

  toggleMeta() {
    this.metahidden = !this.metahidden;
  }

  // used as part of import currently
  getFile(event) {
    this.inputFile = event.target.files[0];
    this.filetype = this.inputFile.type;
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


  // Push data to database
  saveMetaData(event) {
    this.activeMetaData.fileInputId = this.fileList[this.active].id;


    // add check to see if this.activeMetaData.fileInputId is in database already
    if (true) {
      this.indexFileStore.addIntoDBFileMetaData(this.activeMetaData);

    } else {
      this.indexFileStore.updateIntoDBFileMetaData(this.activeMetaData);
    }
  }

  // Export items


  // Miscellaneous
  // used to size tabs

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

  sendSnapShotLoadData(shot) {
    const graphData = shot.graph.data;
    const graphLayout = shot.graph.layout;
    const data = [];
    const dataName = [];
    for (let i = 0; i < graphData.length; i++) {
      if (graphData[i].mode === 'lines') {
        if (i === 0) {
          const tempTime = graphData[i].x;
          data.push(tempTime);
          dataName.push('Time Series');
        }
        const tempData = graphData[i].y;
        data.push(tempData);
        dataName.push(graphData[i].name);
      } else {
        data.push(graphData[i].x);
        dataName.push(graphLayout.xaxis.title.text);
        data.push(graphData[i].y);
        dataName.push(graphLayout.yaxis.title.text);
      }
    }
    const dataSend = {
      loadMode: shot.visualizeMode,
      id: shot.id,
      graph: shot.graph,
      displayName: shot.displayName,
      tableData: data,
      tableName: dataName
    };
    console.log(dataSend);
    this.routeService.storage = dataSend;
    this.router.navigateByUrl('visualize', {skipLocationChange: true}).then(() => {
      this.router.navigate(['visualize']);
    });
    this.indexFileStore.clearFromDBTemp();
  }

  snapSelect($event: MouseEvent, shot: any) {
    this.sendSnapShotLoadData(shot);
  }
}
