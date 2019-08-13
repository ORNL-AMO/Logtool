import {Component, DoCheck, OnInit, ViewChild, IterableDiffers} from '@angular/core';
import {Router} from '@angular/router';
import {ConfirmationModalComponent} from '../confirmation-modal/confirmation-modal.component';
import {RouteDataTransferService} from '../../providers/route-data-transfer.service';
import {BsModalRef, BsModalService} from 'ngx-bootstrap';
import {PlotGraphComponent} from '../plot-graph/plot-graph.component';
import {IndexDataBaseStoreService} from '../../providers/index-data-base-store.service';
import {DataService} from '../../providers/data.service';
import {RouteIndicatorService} from '../../providers/route-indicator.service';
import {Assessment} from '../../types/assessment';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, DoCheck {
  graph: any;
  tabs = [];
  dataFromDialog: any = [];
  show: any;
  temp1;
  temp2;
  temp3;
  temp4;
  assessment;
  routeType;
  reportTitle: any;
  graphReportList;
// Line Graph
  lineListY: any = [];
  timeSeriesY: any = [];
  ySelectorListLine: any = [];
  timeSeriesSelectList: any = [];
// Scatter Graph
  scatterList: any = [];
  xSelectorListScatter: any = [];
  ySelectorListScatter: any = [];
// Histogram
  dataListHistogram: any = [];
  columnSelectorListHistogram: any = [];
  numberOfBin;
// Day Types
  // Modal Ref
  bsModalRef: BsModalRef;
  activeTab;
  differ: any;
  binType = -1;

  @ViewChild(PlotGraphComponent) plotGraph: PlotGraphComponent;


  constructor(private router: Router, private indexFileStore: IndexDataBaseStoreService, private data: DataService,
              private routeDataTransfer: RouteDataTransferService, private modalService: BsModalService, private differs: IterableDiffers,
              private routeIndicator: RouteIndicatorService) {
    this.differ = differs.find([]).create(null);
  }

  ngOnInit() {
    this.graph = '';
    this.dataFromDialog = [];
    this.lineListY = [];
    this.timeSeriesY = [];
    this.scatterList = [];
    this.routeType = this.routeIndicator.storage.value;
    this.indexFileStore.viewFromQuickSaveStore().then(() => {
      this.data.currentQuickSaveItem.subscribe(quickSave => {
        if (quickSave[0] !== undefined) {
          this.indexFileStore.viewSelectedAssessmentStore(parseInt(quickSave[0].id, 10)).then(() => {
            this.data.currentAssessmentItem.subscribe(assessment => {
                console.log(assessment);
                this.assessment = assessment;
                this.dataFromDialog = assessment.csv;
                if (this.dataFromDialog === null || this.dataFromDialog === undefined) {
                } else {
                  this.tabs = [];
                  for (let i = 0; i < this.dataFromDialog.length; i++) {
                    this.tabs.push({
                      name: this.dataFromDialog[i].name,
                      id: this.assessment.id,
                      tabId: i
                    });
                  }
                  this.generateGraphReportList(assessment);
                  this.populateSpinner();
                  this.populateGraph();
                  this.changeDisplayTable(this.assessment.id, 0);
                }
              }, error => {
                console.log(error);
              }
            );
          });
        }
      });
    });
  }

  ngDoCheck(): void {
    this.differ.diff(this.tabs);
  }

  plotGraphNavigation() {
    if (this.graph === '' || this.graph === undefined) {
      alert('Please select Graph type');
    } else if (this.graph === 'line_graph') {
      this.routeDataTransfer.storage = {
        assessment: this.assessment,
        csv: this.dataFromDialog,
        value: this.ySelectorListLine,
        timeSeries: this.timeSeriesSelectList,
        graphType: 'line_graph',
        assessmentGraph: false
      };
      this.plotGraph.ngOnInit();
    } else if (this.graph === 'scatter_graph') {
      this.routeDataTransfer.storage = {
        assessment: this.assessment,
        csv: this.dataFromDialog,
        x: this.xSelectorListScatter,
        y: this.ySelectorListScatter,
        graphType: 'scatter_graph',
        assessmentGraph: false
      };
      this.plotGraph.ngOnInit();
    } else if (this.graph === 'histogram') {
      if (this.binType === -1) {
        alert('Please Select Bin Generation Scheme');
        return;
      }
      if (this.numberOfBin === undefined || this.numberOfBin === '' ||
        this.numberOfBin === null || (parseInt(this.numberOfBin, 10) === 0 && this.binType === 1)) {
        alert('Please Select Bin Generation Scheme');
        return;
      }
      this.routeDataTransfer.storage = {
        value: this.columnSelectorListHistogram,
        number: this.numberOfBin,
        graphType: 'histogram'
      };
      this.plotGraph.ngOnInit();
    }
  }

  changeDisplayTable(value, position) {
    this.router.navigateByUrl('visualize/table-data', {skipLocationChange: true}).then(() => {
      this.router.navigate(['visualize/table-data'], {
        queryParams: {
          assessmentId: value,
          position: position,
          call: 'visualize'
        }
      });
    });
    this.activeTab = value;
  }

  checkboxSelect(event) {
    if (event.target.value.trim() === 'line_graph') {
      this.show = 0;
    } else if (event.target.value.trim() === 'scatter_graph') {
      this.show = 1;
    } else if (event.target.value.trim() === 'histogram') {
      this.show = 2;
    }
  }

  ySelector(event) {
    this.ySelectorListLine.push({
      name: this.lineListY[event.target.options.selectedIndex].name,
      value: event.target.value
    });
  }

  removeFromListLine(event) {
    for (let i = 0; i < this.ySelectorListLine.length; i++) {
      if (this.ySelectorListLine[i].name.trim() === event.target.innerText.trim() || event.target.id === i.toString(10)) {
        if (i === 0) {
          this.ySelectorListLine.shift();
          break;
        } else if (this.ySelectorListLine.length === 1) {
          this.ySelectorListLine.pop();
          break;
        } else {
          this.ySelectorListLine.splice(1, i);
          break;
        }
      }
    }
  }

  timeSeriesLineY(event) {
    this.timeSeriesSelectList.pop();
    this.timeSeriesSelectList.push({
      value: event.target.value,
      name: this.timeSeriesY[event.target.options.selectedIndex].name
    });
  }

  scatterSelector(event) {
    if (event.target.name.trim() === 'xSpinner') {
      this.xSelectorListScatter.pop();
      this.xSelectorListScatter.push({
        value: event.target.value,
        name: this.scatterList[event.target.options.selectedIndex].name
      });
    } else if (event.target.name.trim() === 'ySpinner') {
      this.ySelectorListScatter.pop();
      this.ySelectorListScatter.push({
        value: event.target.value,
        name: this.scatterList[event.target.options.selectedIndex].name
      });
    }
  }

  columnSelectorEventHistogram(event) {
    this.columnSelectorListHistogram.pop();
    this.columnSelectorListHistogram.push({
      name: this.dataListHistogram[event.target.options.selectedIndex].name,
      value: event.target.value
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
    }
  }

  routeToVisual(file: any) {
    const params = {
      value: 'load_report',
      graph: file.value.graph
    };
    this.routeIndicator.storage = params;
    this.ngOnInit();
  }

  generateReport() {
    if (this.reportTitle === '' || this.reportTitle === undefined) {
      alert('Invalid name. Please try again');
      return;
    }
    this.plotGraph.generateReport(this.reportTitle).then(() => {
      this.indexFileStore.viewSelectedAssessmentStore(parseInt(this.assessment.id, 10)).then(() => {
        this.data.currentAssessmentItem.subscribe(assessment => {
          this.generateGraphReportList(assessment);
          document.getElementById('generate_report').click();
        });
      });
    });
  }
  closePopUpReport() {
    document.getElementById('generate_report').click();
  }

// Custom Function
  populateSpinner() {
    this.lineListY = [];
    this.timeSeriesY = [];
    this.scatterList = [];
    for (let i = 0; i < this.tabs.length; i++) {
      const filename = this.tabs[i].name;
      for (let j = 0; j < this.dataFromDialog[i].selectedHeader.length; j++) {
        const columnName = this.dataFromDialog[i].selectedHeader[j].headerName;
        this.scatterList.push({
          name: filename + '-' + columnName,
          identifier: `${i}, ${j}`
        });
        if (!(this.dataFromDialog[i].dataArrayColumns[j][0] instanceof Date)) {
          this.lineListY.push({
            name: filename + '-' + columnName,
            identifier: `${i},${j}`
          });
          this.dataListHistogram.push({
            name: filename + '-' + columnName,
            identifier: `${i},${j}`
          });
        }
        if (this.dataFromDialog[i].dataArrayColumns[j][0] instanceof Date) {
          this.timeSeriesY.push({
            name: filename + '-' + columnName,
            identifier: `${i},${j}`
          });
        }
      }
    }
  }

  populateGraph() {
    if (this.routeType === 'link' || this.routeType === 'create_new') {
      if (this.graph === '' || this.graph === undefined) {
        this.routeDataTransfer.storage = {
          assessment: this.assessment,
          assessmentGraph: true,
          graphType: 'load_graph'
        };
      } else if (this.graph === 'line_graph') {
        this.routeDataTransfer.storage = {
          assessment: this.assessment,
          value: this.ySelectorListLine,
          timeSeries: this.timeSeriesSelectList,
          graphType: 'line_graph'
        };
      } else if (this.graph === 'scatter_graph') {
        this.routeDataTransfer.storage = {
          assessment: this.assessment,
          x: this.xSelectorListScatter,
          y: this.ySelectorListScatter,
          graphType: 'scatter_graph'
        };
      }
    } else if (this.routeType === 'load_report') {
      this.routeDataTransfer.storage = {
        assessment: this.assessment,
        assessmentGraph: true,
        graphType: 'report_graph',
        report: this.routeIndicator.storage.graph
      };
    }
    this.plotGraph.ngOnInit();
  }

  removeFile(event, id, tabId) {
    const initialState = {message: 'Are you sure you want to delete this record'};
    this.bsModalRef = this.modalService.show(ConfirmationModalComponent, {initialState});
    this.bsModalRef.content.onClose.subscribe(result => {
      if (result) {
        this.indexFileStore.deleteFromCSVStore(id).then(result2 => {
          console.log('before', this.tabs);
          this.tabs.splice(tabId, 1);
        });
      }
      console.log('after', this.tabs);
    });
  }

  getTableWidth() {
    if (this.activeTab !== undefined && this.tabs !== undefined) {
      return 200 * this.dataFromDialog[this.activeTab].dataArrayColumns.length + 'px';
    }
  }

  getTabWidth(tab) {
    // Create fake div
    const fakeDiv = document.createElement('span');
    fakeDiv.innerHTML = tab.name;
    fakeDiv.id = 'testbed';
    document.body.appendChild(fakeDiv);

    const pv = document.getElementById('testbed').offsetWidth;
    // Remove div after obtaining desired color value
    document.body.removeChild(fakeDiv);

    return pv + 40 + 'px';

  }

  checkboxSelectHistogram(event) {
    if (event.target.value.trim() === 'stdev') {
      this.binType = 0;
      this.numberOfBin = 0;
    } else if (event.target.value.trim() === 'numBins') {
      this.binType = 1;
    }
  }

  numberBin(event) {
    this.numberOfBin = event.target.value;
  }


}
