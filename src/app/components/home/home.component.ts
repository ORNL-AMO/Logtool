import {Component, DoCheck, OnInit, ViewChild, IterableDiffers} from '@angular/core';
import {Router} from '@angular/router';
import {ImportDataComponent} from '../import-data/import-data.component';
import {ConfirmationModalComponent} from '../confirmation-modal/confirmation-modal.component';
import {IndexFileStoreService} from '../../providers/index-file-store.service';
import {RouteDataTransferService} from '../../providers/route-data-transfer.service';
import {BsModalRef, BsModalService} from 'ngx-bootstrap';
import {PlotGraphComponent} from '../plot-graph/plot-graph.component';

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
// Line Graph
  lineListY: any = [];
  timeSeriesY: any = [];
  ySelectorListLine: any = [];
  timeSeriesSelectList: any = [];
// Scatter Graph
  scatterList: any = [];
  xSelectorListScatter: any = [];
  ySelectorListScatter: any = [];
// Day Types
  timeSeriesDayType = '';
  // Modal Ref
  bsModalRef: BsModalRef;
  activeTab;
  differ: any;

  @ViewChild(PlotGraphComponent) plotGraph: PlotGraphComponent;
  formEntry: any;

  constructor(private router: Router, private indexFileStore: IndexFileStoreService,
              private routeDataTransfer: RouteDataTransferService, private modalService: BsModalService, private differs: IterableDiffers) {
    this.differ = differs.find([]).create(null);
  }

  ngOnInit() {
    this.dataFromDialog = [];
    this.lineListY = [];
    this.timeSeriesY = [];
    this.scatterList = [];
    this.indexFileStore.viewDataDB().then(result => {
      this.dataFromDialog = result;
      if (this.dataFromDialog === null || this.dataFromDialog === undefined) {
      } else {
        this.plotGraph.ngOnInit();
        this.tabs = [];
        for (let i = 0; i < this.dataFromDialog.length; i++) {
          // console.log(this.dataFromDialog[i].id);
          this.tabs.push({
            name: this.dataFromDialog[i].name,
            id: this.dataFromDialog[i].id,
            tabId: i
          });
        }
        // console.log(this.tabs);
        this.populateSpinner();
        this.populateGraph();
        this.changeDisplayTable(0);
      }
    }, error => {
      console.log(error);
    });
  }

  ngDoCheck(): void {
    this.differ.diff(this.tabs);
    //console.log(this.differ);
  }

  onImport() {
    this.bsModalRef = this.modalService.show(ImportDataComponent, {class: 'my-modal', ignoreBackdropClick: true});
    this.bsModalRef.content.closeBtnName = 'Close';
    this.dataFromDialog = [];
    this.lineListY = [];
    this.timeSeriesY = [];
    this.scatterList = [];
    this.modalService.onHide.subscribe(() => {
      this.indexFileStore.viewDataDB().then(result => {
        this.dataFromDialog = result;
        this.tabs = [];
        for (let i = 0; i < this.dataFromDialog.length; i++) {
          this.tabs.push({
            name: this.dataFromDialog[i].name,
            id: this.dataFromDialog[i].id,
            tabId: i
          });
        }
        this.populateSpinner();
        this.populateGraph();
        this.changeDisplayTable(this.dataFromDialog.length - 1);
      });
    });
  }

  plotGraphNavigation() {
    if (this.graph === '' || this.graph === undefined) {
      alert('Please select Graph type');
    } else if (this.graph === 'line_graph') {

      this.routeDataTransfer.storage = {
        value: this.ySelectorListLine,
        timeSeries: this.timeSeriesSelectList,
        graphType: 'line_graph'
      };
      this.plotGraph.ngOnInit();
    } else if (this.graph === 'scatter_graph') {
      this.routeDataTransfer.storage = {
        x: this.xSelectorListScatter,
        y: this.ySelectorListScatter,
        graphType: 'scatter_graph'
      };
      this.plotGraph.ngOnInit();
    }

  }

  changeDisplayTable(value) {
    this.router.navigateByUrl('/table-data', {skipLocationChange: true}).then(() => {
      this.router.navigate(['/table-data'], {
        queryParams: {
          value: value
        }
      });
    });
    this.activeTab = value;
  }

  checkboxSelect(event) {
    if (event.target.value.trim() === 'line_graph') {
      this.show = false;
    } else if (event.target.value.trim() === 'scatter_graph') {
      this.show = true;
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

  dayTypeNavigation() {
    if (this.formEntry === '1') {
      this.router.navigate(['/histogram-day-type']);
    } else {
      this.router.navigate(['/holder-day-type']);
    }
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
    if (this.graph === '' || this.graph === undefined) {
      this.routeDataTransfer.storage = {
        graphType: 'empty'
      };
    } else if (this.graph === 'line_graph') {
      this.routeDataTransfer.storage = {
        value: this.ySelectorListLine,
        timeSeries: this.timeSeriesSelectList,
        graphType: 'line_graph'
      };
    } else if (this.graph === 'scatter_graph') {
      this.routeDataTransfer.storage = {
        x: this.xSelectorListScatter,
        y: this.ySelectorListScatter,
        graphType: 'scatter_graph'
      };
    }
  }

  removeFile(event, id, tabId) {

    this.bsModalRef = this.modalService.show(ConfirmationModalComponent);
    this.bsModalRef.content.onClose.subscribe(result => {
      console.log(result);
      if (result) {
        this.indexFileStore.deleteFromDB(id).then(result2 => {
/*          for (let i = 0; i < this.tabs.length; i++) {
            if (id === 0) {
              this.tabs.shift();
            } else if (id === this.tabs.length) {
              this.tabs.pop();
              break;
            } else {*/
              //console.log('result2', result2);
              console.log('before', this.tabs);
              this.tabs.splice(tabId, 1);
/*              break;
            }*/
          //}
        });
      }

      console.log('after', this.tabs);
    });
  }
}
