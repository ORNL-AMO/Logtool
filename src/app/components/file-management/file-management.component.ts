import {Component, OnInit} from '@angular/core';
import {ImportDataComponent} from '../import-data/import-data.component';
import {ExportCSVService} from '../../providers/export-csv.service';
import {DataService} from '../../providers/data.service';
import {IndexFileStoreService} from '../../providers/index-file-store.service';
import {BsModalRef, BsModalService} from 'ngx-bootstrap';
import {Router} from '@angular/router';
import {SaveLoadService} from '../../providers/save-load.service';
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

  FileRef: BsModalRef;
  LoadRef: BsModalRef;
  private filetype: any;

  // list of selected files
  private selected: any;
  private active: any;

  // MetaData variables
  private activeMetaData: FileMetaData;
  private metaList: any;
  private activeStats: any;

  constructor(private router: Router, private data: DataService, private indexFileStore: IndexFileStoreService,
              private modalService: BsModalService, private exportCsv: ExportCSVService, private saveLoadService: SaveLoadService,
              private routeService: RouteDataTransferService) {
  }

  inputFile: any;
  metahidden: any;

  ngOnInit() {
    this.indexFileStore.clearFromDBTemp();
    this.selected = [];
    this.indexFileStore.clearFromDBTemp();
    this.generateFileList();
    this.generateSnapShotListDayType();
    this.generateSnapShotListVisualize();

    this.metaDataReset();
    this.metahidden = false;
  }

  blankMetaData(index) {
    return new FileMetaData(this.fileList[index].id, this.fileList[index].id, '', '', '', '',
      {street: '', city: '', state: '', zip: null, country: ''},
      null, null, '', '');
  }

  metaDataReset() {
    this.activeMetaData = new FileMetaData(0, 0, '', '', '', '',
      {street: '', city: '', state: '', zip: 0, country: ''},
      0, 0, '', '');
  }

  // Pull/Delete things from database
  generateFileList() {
    this.indexFileStore.viewDataDB().then(result => {
      this.dataFromDialog = result;
      if (this.dataFromDialog === null || this.dataFromDialog === undefined) {
      } else {
        this.fileList = [];
        this.metaList = [];
        const tempSelect = [];
        for (let i = 0; i < this.dataFromDialog.length; i++) {

          const select = this.selected.findIndex(obj => obj.IndexID === this.dataFromDialog[i].id);
          if (select >= 0) {
            this.selected[select].tabID = i;
          }

          this.fileList.push({
            name: this.dataFromDialog[i].name,
            id: this.dataFromDialog[i].id,
            selected: select >= 0,
          });
        }
        this.generateMetaDataList();
      }

    }, error => {
      console.log(error);
    });
  }

  removeFile(event, index) {
    event.stopPropagation();
    event.preventDefault();
    if (index === this.active) {
      this.toggleSelect(index, this.fileList[index]);
    }
    this.indexFileStore.deleteFromDB(this.fileList[index].id);
    // Should be called ONLY if above is successful, current returned promise is always null.
    this.indexFileStore.deleteFromDBFileMetaData(this.fileList[index].id);
    // Should be called ONLY if above is successful, current returned promise is always null.
    this.fileList.splice(index, 1);
    this.metaList.splice(index, 1);
  }


  generateSnapShotListDayType() {
    this.indexFileStore.viewDataDBDayType().then(data => {
      this.data.currentDataInputDayTypeArray.subscribe(result => {
        this.snapShotListDayType = result;
      });
    });
  }

  removeDTSS(index) {
    this.indexFileStore.deleteFromDBDayType(this.snapShotListDayType[index].id);
    this.snapShotListDayType.splice(index, 1);
  }

  generateSnapShotListVisualize() {
    this.indexFileStore.viewDataDBGraph().then(data => {

      this.data.currentDataInputGraphArray.subscribe(result => {
        this.snapShotListGraph = result;
      });
    });
  }

  removeVSS(index) {
    this.indexFileStore.deleteFromDBGraph(this.snapShotListGraph[index].id);
    this.snapShotListGraph.splice(index, 1);
  }


  generateMetaDataList() {
    if (this.fileList === undefined) {
      return;
    }
    for (let i = 0; i < this.fileList.length; i++) {
      this.indexFileStore.viewSingleDataDBMetaData(this.fileList[i].id).then(result => {
        const metaDataFromDialog = result;
        if (metaDataFromDialog === null || metaDataFromDialog === undefined) {
          this.metaList.push({data: this.blankMetaData(i), previous: 'false'});
        } else {
          this.metaList.push({data: metaDataFromDialog, previous: 'true'});
        }
      }, error => {
        console.log(error);
      });
    }
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
    if (this.metaList.length === 0) {
      this.metaList[this.active].data = this.activeMetaData;
    }

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
      const activeFile: DataList = this.dataFromDialog.find(obj => obj.id === file.id);
      this.indexFileStore.addIntoDBFileInputTemp(activeFile);
    } else {
      this.indexFileStore.deleteFromDBTemp(this.selected[content].IndexID);
      if (this.selected.length === 1) {
        this.active = -1;
      } else if (this.active === this.selected[content].tabID) {
      } else if (this.active === 0) {
        this.active++;
      } else {
        this.active--;
      }

      console.log('check one');
      this.activeUpdated();
      this.fileList[index].selected = false;
      this.selected.splice(content, 1);
    }
  }

  tabSelect(index) {
    this.metaList[this.active].data = this.activeMetaData;
    this.active = index;
    this.activeUpdated();
  }

  // update visuals based on selections
  activeUpdated() {

    if (this.metaList.length > 0 && this.active > -1) {
      this.activeMetaData = this.metaList[this.active].data;
    }


    this.showFileData();

    this.showMetaData();

    this.changeDisplayTable();

  }

  showMetaData() {
  }

  changeDisplayTable() {
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
      //this.indexFileStore.addIntoDBFileInputTemp(activeFile);
    } else {
      this.activeStats = null;
    }
  }


  // used as part of import currently
  getFile(event) {
    this.inputFile = event.target.files[0];
    this.filetype = this.inputFile.type;
  }

  showInputModal() {
    this.FileRef = this.modalService.show(ImportDataComponent);
    this.modalService.onHide.subscribe(() => {
      this.generateFileList();
      this.generateSnapShotListDayType();
      this.generateSnapShotListVisualize();
    });
  }

  // Meta data
  toggleMeta() {
    this.metaList[this.active].data = this.activeMetaData;
    this.metahidden = !this.metahidden;
  }

  saveMetaData(index) {
    if (index === -1) {
      index = this.active;
    }

    // add check to see if this.activeMetaData.fileInputId is in database already
    if (!this.metaList[index].previous) {
      this.indexFileStore.addIntoDBFileMetaData(this.activeMetaData);
      this.metaList[index].previous = 'true';

    } else {
      this.indexFileStore.updateIntoDBFileMetaData(this.activeMetaData);
    }
  }

  saveAllMeta() {
    const indexOld = this.active;
    for (let i = 0; i < this.metaList.length; i++) {
      this.activeMetaData = this.metaList[i].data;
      this.saveMetaData(i);
    }
    this.active = indexOld;
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

  sendSnapShotLoadGraph(shot) {
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
    this.routeService.storage = dataSend;
    this.router.navigateByUrl('visualize', {skipLocationChange: true}).then(() => {
      this.router.navigate(['visualize']);
    });
    this.indexFileStore.clearFromDBTemp();
  }

  sendSnapShotLoadDayType(shot) {
    console.log(shot);
    const dataSend = {
      loadMode: shot.dayTypeMode,
      id: shot.id,
      displayName: shot.displayName
    };
    this.routeService.storage = dataSend;
    this.router.navigateByUrl('holder-day-type', {skipLocationChange: true}).then(() => {
      this.router.navigate(['holder-day-type']);
    });
    this.indexFileStore.clearFromDBTemp();
  }

  snapSelectDayType($event: MouseEvent, shot: any) {
    this.sendSnapShotLoadDayType(shot);
  }

  snapSelectGraph($event: MouseEvent, shot: any) {
    this.sendSnapShotLoadGraph(shot);
  }

  show(event) {
    console.log(event);
  }

  exportDayTypeToFile() {
    this.indexFileStore.viewDataDBDayType().then(data => {
      this.data.currentDataInputDayTypeArray.subscribe(result => {
        if (result.length < 1) {
          alert('No Data To Export');
          return;
        }
        this.exportCsv.createJsonFileDayType(result);
      });
    });
  }
  exportGraphToFile() {
    this.indexFileStore.viewDataDBGraph().then(data => {
      this.data.currentDataInputGraphArray.subscribe(result => {
        console.log(result);
        if (result.length < 1) {
          alert('No Data To Export');
          return;
        }
        this.exportCsv.createJsonFileGraph(result);
      });
    });
  }
}
