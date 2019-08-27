import {Component, OnInit, ViewChild} from '@angular/core';
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
import {ImportDataComponent} from '../import-data/import-data.component';
import {RouteIndicatorService} from '../../providers/route-indicator.service';
import {ToolHeaderComponent} from '../tool-header/tool-header.component';
import {CommonService} from '../../providers/common.service';


@Component({
    selector: 'app-file-management',
    templateUrl: './file-management.component.html',
    styleUrls: ['./file-management.component.scss']
})
export class FileManagementComponent implements OnInit {
    assessmentList: any;
    selected: any;
    tableTabs = [];
    tableActive;
    newAssessment = false;


    assessmentActive: boolean;
    metaHidden = false;
    dataHidden = false;
    reportsHidden = false;
    activeMetaData: FileMetaData;
    FileRef: BsModalRef;
    confirmRef: BsModalRef;
    activeID;
    activeName;
    graphReportList = [];
    dayTypeReportList = [];

    @ViewChild(ToolHeaderComponent) toolHeader: ToolHeaderComponent;

    constructor(private router: Router, private data: DataService, private indexdbstore: IndexDataBaseStoreService,
                private modalService: BsModalService, private exportCsv: ExportCSVService, private dbOperation: DatabaseOperationService,
                private routeIndicator: RouteIndicatorService, private commonService: CommonService) {
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
        this.indexdbstore.clearCSVStore().then(() => {
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

            // clear Report List
            this.graphReportList = [];
            this.dayTypeReportList = [];
        });
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
        this.tableTabs = [];
        for (let i = 0; i < assessment.csv.length; i++) {
            this.addDataSetsToTableLoad(assessment.csv[i]);
        }
        if (assessment.csv.length < 0) {
            this.tableActive = -1;
        } else {
            this.tableActive = assessment.csv.id;
            this.changeDisplayTableLoad(this.activeID, 0);
        }
        this.indexdbstore.clearQuickSaveStore().then(() => {
            const quickSave: QuickSave = {
                id: assessment.id,
                storeName: 'assessment'
            };
            this.indexdbstore.insertIntoQuickSaveStore(quickSave).then(() => {
                this.generateGraphReportList(assessment);
                this.generateDayTypeReportList(assessment);
            });
        });
    }

    clickLoadAssessment() {
        const params = {
            value: 'link'
        };
        this.routeIndicator.storage = params;
        this.router.navigateByUrl('visualize', {skipLocationChange: false}).then(() => {
            this.router.navigate(['visualize']).then(() => {
                this.toolHeader = new ToolHeaderComponent(this.router, this.routeIndicator, this.commonService);
                this.toolHeader.colorChangeMethod('visualize');
            });
        });
    }

    generateGraphReportList(assessment: Assessment) {
        this.graphReportList = [];
        if (assessment.reportGraph !== undefined) {
            for (let i = 0; i < assessment.reportGraph.length; i++) {
                const graphReport = {
                    name: assessment.reportGraph[i].displayName,
                    value: assessment.reportGraph[i]
                };
                this.graphReportList.push(graphReport);
            }
            console.log(this.graphReportList);
        }
    }

    generateDayTypeReportList(assessment: Assessment) {
        if (assessment.reportDayType !== undefined) {
            for (let i = 0; i < assessment.reportDayType.length; i++) {
                const dayTypeReport = {
                    name: assessment.reportDayType[i].displayName,
                    value: assessment.reportDayType[i]
                };
                this.dayTypeReportList.push(dayTypeReport);
            }
            console.log(this.dayTypeReportList);
        }
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
    tabTableSelect(tabId, i) {
        this.tableActive = tabId;
        if (this.tableTabs.length > 0) {
            this.activeUpdated(i);
        } else {
            this.tableActive = -1;
        }

    }

    activeUpdated(i) {
        if (!this.newAssessment) {
            this.changeDisplayTableLoad(this.activeID, i);
        } else {
            this.changeDisplayTable();
        }

    }

    changeDisplayTable() {
        this.router.navigateByUrl('table-data', {skipLocationChange: true}).then(() => {
            this.router.navigate(['table-data'], {
                queryParams: {
                    csvId: this.tableActive,
                    call: 'file-management'
                }
            });
        });
    }

    changeDisplayTableLoad(assessmentId, position) {
        this.router.navigateByUrl('table-data', {skipLocationChange: true}).then(() => {
            this.router.navigate(['table-data'], {
                queryParams: {
                    assessmentId: assessmentId,
                    position: position,
                    call: 'visualize'
                }
            });
        });
    }

    showImportModal(type) {
        const initialState = {type: type};
        const sleep = (milliseconds) => {
            return new Promise(resolve => setTimeout(resolve, milliseconds));
        };

        this.FileRef = this.modalService.show(ImportDataComponent, {initialState});
        this.FileRef.content.id.subscribe(result => {
            this.indexdbstore.viewSelectedCSVStore(result).then(() => {
                this.data.currentCSVItem.subscribe(csvitem => {
                    this.tableTabs.push(csvitem);
                });
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

    addDataSetsToTableLoad(csvFile) {
        this.tableTabs.push(csvFile);
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
                this.dbOperation.createAssessment(assessmentId, name, csv, metaDataId, metaData, graphId, dayTypeId, assessmentMode)
                    .then(() => {
                        const quickSave: QuickSave = {
                            id: assessmentId,
                            storeName: 'assessment'
                        };
                        this.indexdbstore.insertIntoQuickSaveStore(quickSave).then(() => {
                            this.newAssessment = false;
                            this.indexdbstore.clearCSVStore().then(() => {
                                const params = {
                                    value: 'create_new'
                                };
                                this.routeIndicator.storage = params;
                                this.router.navigateByUrl('visualize', {skipLocationChange: true}).then(() => {
                                    this.router.navigate(['visualize']).then(() => {
                                        this.toolHeader = new ToolHeaderComponent(this.router, this.routeIndicator, this.commonService);
                                        this.toolHeader.colorChangeMethod('visualize');
                                    });
                                });
                            });
                        });
                    });
            }, error => {
                console.log(error);
            });
        }
    }

    routeToVisual(file: any) {
        const params = {
            value: 'load_report',
            graph: file.value.graph
        };
        this.routeIndicator.storage = params;
        this.router.navigateByUrl('visualize', {skipLocationChange: true}).then(() => {
            this.router.navigate(['visualize']).then(() => {
                this.toolHeader = new ToolHeaderComponent(this.router, this.routeIndicator, this.commonService);
                this.toolHeader.colorChangeMethod('visualize');
            });
        });
    }

    routeToDayType(file: any) {
        const params = {
            value: 'load_report',
            dayType: file.value
        };
        this.routeIndicator.storage = params;
        this.router.navigateByUrl('holder-day-type', {skipLocationChange: true}).then(() => {
            this.router.navigate(['holder-day-type']).then(() => {
                this.toolHeader = new ToolHeaderComponent(this.router, this.routeIndicator, this.commonService);
                this.toolHeader.colorChangeMethod('day_type');
            });
        });
    }

    updateAssessment() {
        this.indexdbstore.viewFromQuickSaveStore().then(() => {
            this.data.currentQuickSaveItem.subscribe(quickSave => {
                this.indexdbstore.viewSelectedAssessmentStore(parseInt(quickSave[0].id, 10)).then(() => {
                    this.data.currentAssessmentItem.subscribe(assessment => {
                        const metaData: FileMetaData = this.activeMetaData;
                        this.indexdbstore.updateMetaStore(metaData, assessment).then(() => {
                            alert('Assessment Updated');
                        });
                    });
                });
            });
        });

        this.newAssessment = false;
    }

    exportAssessment() {
        this.indexdbstore.viewFromQuickSaveStore().then(() => {
            this.data.currentQuickSaveItem.subscribe(quickSave => {
                if (quickSave[0] !== undefined) {
                    if (quickSave[0].storeName !== 'assessment') {
                        alert('Please select Assessment to Export');
                    } else {
                        this.indexdbstore.viewSelectedAssessmentStore(parseInt(quickSave[0].id, 10)).then(() => {
                            this.data.currentAssessmentItem.subscribe(assessment => {
                                this.exportCsv.createJsonFileAssessment(assessment);
                            });
                        });
                    }
                }
            });
        });
        alert('Exported');
    }
}

