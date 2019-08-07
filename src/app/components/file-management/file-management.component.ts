import {Component, OnInit} from '@angular/core';
import {ExportCSVService} from '../../providers/export-csv.service';
import {DataService} from '../../providers/data.service';
import {BsModalRef, BsModalService} from 'ngx-bootstrap';
import {Router} from '@angular/router';
import {FileMetaData} from '../../types/file-meta-data';

import {IndexDataBaseStoreService} from '../../providers/index-data-base-store.service';
import {FileImportComponent} from '../file-import/file-import.component';

import {DatabaseOperationService} from '../../providers/database-operation.service';
import {QuickSave} from '../../types/quick-save';


@Component({
  selector: 'app-file-management',
  templateUrl: './file-management.component.html',
  styleUrls: ['./file-management.component.scss']
})
export class FileManagementComponent implements OnInit {
  private assessmentList: any;
  private selected: any;
  private tableTabs = [];
  private tableActive;
  private assessmentActive: boolean;
  private metaHidden: boolean;
  private dataHidden: boolean;
  private activeMetaData: FileMetaData;
  private FileRef: BsModalRef;
  private metaDataList = [];
  private csvRefIdList = [];
  private activeName;


  constructor(private router: Router, private data: DataService, private indexdbstore: IndexDataBaseStoreService,
              private modalService: BsModalService, private exportCsv: ExportCSVService, private dbOperation: DatabaseOperationService) {
  }

  ngOnInit() {
    this.selected = [];
    this.generateAssessmentList();
  }

  blankMetaData(index) {
    return new FileMetaData(index, index, '', '', '', '',
      {street: '', city: '', state: '', zip: null, country: ''},
      null, null, '', '');
  }

  metaDataReset() {
    this.activeMetaData = new FileMetaData(0, 0, '', '', '', '',
      {street: '', city: '', state: '', zip: 0, country: ''},
      0, 0, '', '');
  }

  generateAssessmentList() {

    this.indexdbstore.viewFromAssessmentStore().then(result => {
      this.assessmentList = result;
      if (this.assessmentList === null || this.assessmentList === undefined) {
      } else {
        for (let i = 0; i < this.assessmentList.length; i++) {
          const select = this.selected.findIndex(obj => obj.IndexID === this.assessmentList[i].id);
          if (select >= 0) {
            this.selected[select].tabID = i;
          }
          console.log(this.assessmentList);
        }
      }
      console.log(this.selected);
    }, error => {
      console.log(error);
    });
  }

  importAssessment() {

  }

  createNew() {
    this.assessmentActive = true;
    this.metaHidden = false;
    this.dataHidden = false;
    this.activeMetaData = this.blankMetaData(this.assessmentList.length + 1);
    console.log(this.activeMetaData);
  }

  assessmentSelect(i: number, assessment: any) {
    console.log(i);
    console.log(assessment);
  }

  removeAssessment(event: MouseEvent, i: number) {
    console.log(i);
    console.log(event);
  }

  tabTableSelect(tabID) {
    this.tableActive = tabID;
    this.activeUpdated();
  }

  activeUpdated() {
    this.changeDisplayTable();
  }

  changeDisplayTable() {
    this.router.navigateByUrl('table-data', {skipLocationChange: true}).then(() => {
      this.router.navigate(['table-data'], {
        queryParams: {
          value: this.tableActive
        }
      });
    });
  }

  showDataModal() {
    console.log(this.tableTabs);
    console.log('trim', this.tableTabs.slice(0, this.tableTabs.length));
    const initialDataState = {
      selected: this.tableTabs.slice(0, this.tableTabs.length),
    };
    this.tableTabs = [];
    this.FileRef = this.modalService.show(FileImportComponent, {initialState: initialDataState});
    this.FileRef.content.returnList.subscribe(result => {
      console.log('result', result);
      for (let i = 0; i < result.length; i++) {
        this.csvRefIdList.push(result[i]);
        this.addDataSetsToTable(result[i]);
      }
    });
  }

  addDataSetsToTable(id) {
    this.tableTabs = [];
    this.indexdbstore.viewSelectedCSVStore(id).then(result => {
      this.data.currentCSVItem.subscribe(csvFile => {
        this.tableTabs.push({name: csvFile.name, id: id, tabID: this.tableTabs.length});
      });
    });
  }


  createAssessment() {
    const assessmentId = this.data.getRandomInt(9999999);
    const metaDataId = this.data.getRandomInt(9999999);
    const graphId = this.data.getRandomInt(9999999);
    const dayTypeId = this.data.getRandomInt(9999999);
    const name = this.activeName;
    const csvId = this.csvRefIdList;
    this.activeMetaData.id = metaDataId;
    this.activeMetaData.assessmentId = assessmentId;
    const metaData: FileMetaData = this.activeMetaData;
    /*   {
       id: metaDataId,
       assessmentId: assessmentId,
       companyName: '',
       facilityName: '',
       facilityContactName: '',
       facilityContact: 0,
       facilityEmail: '',
       assessmentContactName: '',
       assessmentContact: 0,
       assessmentEmail: '',
       address: {
         street: '',
         city: '',
         zip: 0,
         state: '',
         country: ''
       },
     };*/
    const assessmentMode = true;

    this.indexdbstore.clearQuickSaveStore().then(resut => {
      this.dbOperation.createAssessment(assessmentId, name, csvId, metaDataId, metaData, graphId, dayTypeId, assessmentMode);
      const quickSave: QuickSave = {
        id: assessmentId,
        storeName: 'assessment'
      };
      this.indexdbstore.insertIntoQuickSaveStore(quickSave);
    });
  }

}

