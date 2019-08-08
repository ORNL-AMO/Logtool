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
import {ConfirmationModalComponent} from '../confirmation-modal/confirmation-modal.component';
import {Assessment} from '../../types/assessment';


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
  private newAssessment = false;


  private assessmentActive: boolean;
  private metaHidden = false;
  private dataHidden = false;
  private reportsHidden = false;
  private activeMetaData: FileMetaData;
  private FileRef: BsModalRef;
  private confirmRef: BsModalRef;
  private activeName;
  private activeID;

  constructor(private router: Router, private data: DataService, private indexdbstore: IndexDataBaseStoreService,
              private modalService: BsModalService, private exportCsv: ExportCSVService, private dbOperation: DatabaseOperationService) {
  }

  ngOnInit() {

    this.generateAssessmentList();
    this.indexdbstore.viewFromQuickSaveStore().then(() => {
      this.data.currentQuickSaveItem.subscribe(quickSave => {
        if (quickSave[0] !== undefined) {
          this.indexdbstore.viewSelectedAssessmentStore(parseInt(quickSave[0].id, 10)).then(() => {
            this.data.currentAssessmentItem.subscribe(assessment => {
              this.loadAssessment(assessment);
            });
          });
        }

      });
    });
  }

  blankMetaData(index) {
    return new FileMetaData(index, index, '', '', '', '',
      {street: '', city: '', state: '', zip: 0, country: ''},
      0, 0, '', '');
  }

  metaDataReset() {
    this.activeMetaData = new FileMetaData(0, 0, '', '', '', '',
      {street: '', city: '', state: '', zip: 0, country: ''},
      0, 0, '', '');
  }

  generateAssessmentList() {
    this.indexdbstore.viewFromAssessmentStore().then(() => {
      this.data.currentAssessmentItemArray.subscribe(assessmentListDB => {
        this.assessmentList = assessmentListDB;
      });
    }, error => {
      console.log(error);
    });
  }

  createNew() {
    this.assessmentActive = true;
    this.newAssessment = true;

    // unhide sections by default
    this.metaHidden = false;
    this.dataHidden = false;
    this.reportsHidden = false;

    // clear metaData
    this.activeMetaData = this.blankMetaData(this.assessmentList.length + 1);

    // clear csv table
    this.tableActive = -1;
    this.tableTabs = [];

    // create default name and id
    const today = new Date();
    this.activeName = 'Assessment- ' + today.getMonth() + '/' + today.getDate() + '/' + today.getFullYear();
    this.activeID = null;
  }

  importAssessment() {

  }

  selectAssessment(i: number, assessment: Assessment) {
    // console.log(this.newAssessment);
    if (this.newAssessment) {
      const initialState = {message: 'Current Assessment has not been saved. \n' + 'Do you want to proceed without saving?'};
      this.confirmRef = this.modalService.show(ConfirmationModalComponent, {initialState});
      this.confirmRef.content.onClose.subscribe(result => {
        if (!result) {
          console.log('Aborting');
          return;
        } else {
          this.loadAssessment(assessment);


        }
      });

    } else if (this.newAssessment === undefined || !this.newAssessment) {

      this.loadAssessment(assessment);
    }
  }

  loadAssessment(assessment) {
    this.assessmentActive = true;
    this.newAssessment = false;
    this.activeID = assessment.id;
    this.activeName = assessment.name;
    this.activeMetaData = assessment.metaData;
    // reset csv table
    this.tableTabs = [];
    for (let i = 0; i < assessment.csv.length; i++) {
      this.addDataSetsToTable(assessment.csv[i].id);
    }
    console.log(assessment.csv.length);
    if (assessment.csv.length < 0) {
      this.tableActive = -1;
    } else {
      this.tableActive = assessment.csv[0].id;
      this.changeDisplayTable();
    }
    this.indexdbstore.clearQuickSaveStore().then(() => {
      const quickSave: QuickSave = {
        id: assessment.id,
        storeName: 'assessment'
      };
      this.indexdbstore.insertIntoQuickSaveStore(quickSave);
    });
  }

  removeAssessment(event: MouseEvent, i: number) {
    const id = this.assessmentList[i].id;
    const current = (id === this.activeID);
    const initialState = {
      message: 'WARNING! Attempting to delete assessment: \n' +
        this.assessmentList[i].name + '\n' +
        'This will completely remove the record from your system. \n' +
        'Do you want to proceed?'
    };
    this.confirmRef = this.modalService.show(ConfirmationModalComponent, {initialState});

    this.confirmRef.content.onClose.subscribe(result => {
      if (!result) {
        return;
      } else {
        this.indexdbstore.deleteFromAssessmentStore(id).then(() => {
          if (current) {
            // clear quicksave
            this.indexdbstore.clearQuickSaveStore().then(() => {
              console.log('Record Cleared');
              this.assessmentActive = false;
            });
          }
          // remove assessment from list
          this.assessmentList.splice(i, 1);
        }, error => {
          console.log(error);
        });
      }
    });

  }


  // Stuff related to table ----------------
  tabTableSelect(tabId) {
    this.tableActive = tabId;
    if (this.tableTabs.length > 0) {
      this.activeUpdated();
    } else {
      this.tableActive = -1;
    }

  }

  activeUpdated() {
    this.changeDisplayTable();
  }

  changeDisplayTable() {
    console.log(this.tableActive);
    this.router.navigateByUrl('table-data', {skipLocationChange: true}).then(() => {
      this.router.navigate(['table-data'], {
        queryParams: {
          value: this.tableActive
        }
      });
    });
  }

  showDataModal() {
    const ids = this.tableTabs.map(obj => obj.id);
    const names = this.tableTabs.map(obj => obj.name);
    const currentTable = [];
    for (let i = 0; i < names.length; i++) {
      currentTable.push({name: names[i], id: ids[i], selected: true});
    }
    const initialDataState = {
      selected: currentTable
    };

    this.FileRef = this.modalService.show(FileImportComponent, {initialState: initialDataState});
    this.FileRef.content.returnList.subscribe(result => {
      for (let i = 0; i < result.length; i++) {
        this.addDataSetsToTable(result[i]);
      }
    });
  }

  addDataSetsToTable(id) {
    this.tableTabs = [];
    this.indexdbstore.viewSelectedCSVStore(id).then(result => {
      this.data.currentCSVItem.subscribe(csvFile => {
        this.tableTabs.push(csvFile);
      });
    });
  }

  // Creating/Updating assessments
  createAssessment() {
    const assessmentId = this.data.getRandomInt(9999999);
    const metaDataId = this.data.getRandomInt(9999999);
    const graphId = this.data.getRandomInt(9999999);
    const dayTypeId = this.data.getRandomInt(9999999);
    const name = this.activeName;
    const csv = this.tableTabs;
    this.activeMetaData.id = metaDataId;
    this.activeMetaData.assessmentId = assessmentId;
    const metaData: FileMetaData = this.activeMetaData;
    const assessmentMode = true;
    if (csv.length < 1) {
      alert('Please select File for Assessment');
    } else {
      this.indexdbstore.clearQuickSaveStore().then(() => {
        this.dbOperation.createAssessment(assessmentId, name, csv, metaDataId, metaData, graphId, dayTypeId, assessmentMode);
        const quickSave: QuickSave = {
          id: assessmentId,
          storeName: 'assessment'
        };
        this.indexdbstore.insertIntoQuickSaveStore(quickSave);
        this.newAssessment = false;
        this.router.navigateByUrl('visualize', {skipLocationChange: true}).then(() => {
          this.router.navigate(['visualize']);
        });
      }, error => {
        console.log(error);
      });
    }
  }

  updateAssessment() {
    this.indexdbstore.viewFromQuickSaveStore().then(() => {
      this.data.currentQuickSaveItem.subscribe(quickSave => {
      });
    });

    this.newAssessment = false;
  }

}

