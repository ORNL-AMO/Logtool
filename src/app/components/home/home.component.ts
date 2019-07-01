import {Component, OnInit, IterableDiffers, ViewChild, DoCheck} from '@angular/core';
import {Router} from '@angular/router';
import {ImportDataComponent} from '../import-data/import-data.component';
import {IndexFileStoreService} from '../../providers/index-file-store.service';
import {RouteDataTransferService} from '../../providers/route-data-transfer.service';
import {BsModalRef, BsModalService} from 'ngx-bootstrap';
import {PlotGraphComponent} from '../plot-graph/plot-graph.component';
import {ConfirmationModalComponent} from '../../confirmation-modal/confirmation-modal.component';


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
  temp5;
  temp6;
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
  columnSelectorList = [];
  fileSelector = [];
  columnSelector = [];
  timeSeriesDayType = '';
  // Modal Ref
  bsModalRef: BsModalRef;
  activeTab;
  showGraph = false;
  differ: any;
  @ViewChild(PlotGraphComponent) plotGraph: PlotGraphComponent;

  constructor(private router: Router, private indexFileStore: IndexFileStoreService,
              private routeDataTransfer: RouteDataTransferService, private modalService: BsModalService, private differs: IterableDiffers) {
             this.differ = differs.find([]).create(null);
  }

  ngOnInit() {
    this.dataFromDialog = [];
    this.lineListY = [];
    this.timeSeriesY = [];
    this.scatterList = [];
    this.fileSelector = [];

    this.indexFileStore.viewDataDB().then(result => {
      this.dataFromDialog = result;
      if (this.dataFromDialog === null || this.dataFromDialog === undefined) {
      } else {
        this.tabs = [];
        for (let i = 0; i < this.dataFromDialog.length; i++) {
          // console.log(this.dataFromDialog[i].id);
          this.tabs.push({
            name: this.dataFromDialog[i].name,
            id: this.dataFromDialog[i].id
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

  //updates tablist on removal
  ngDoCheck(): void {
    this.differ.diff(this.tabs);
  }

  onImport() {
    this.bsModalRef = this.modalService.show(ImportDataComponent, {class: 'my-modal', ignoreBackdropClick: true});
    this.bsModalRef.content.closeBtnName = 'Close';
    this.dataFromDialog = [];
    this.lineListY = [];
    this.timeSeriesY = [];
    this.scatterList = [];
    this.fileSelector = [];
    this.modalService.onHide.subscribe(() => {
      this.indexFileStore.viewDataDB().then(result => {
        this.dataFromDialog = result;
        this.tabs = [];
        for (let i = 0; i < this.dataFromDialog.length; i++) {
          this.tabs.push({
            name: this.dataFromDialog[i].name,
            id: this.dataFromDialog[i].id
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

  fileSelectorEvent(event) {
    this.columnSelectorList = [];
    this.columnSelector = [];
    const currentSelectedFile = event.target.value;
    const tempHeader = this.dataFromDialog[parseInt(currentSelectedFile, 10)].selectedHeader;
    for (let i = 0; i < tempHeader.length; i++) {
      if (!(this.dataFromDialog[currentSelectedFile].dataArrayColumns[i][0] instanceof Date)) {
        this.columnSelector.push({
          name: tempHeader[i].headerName,
          identifier: `${currentSelectedFile},${i}`
        });

      } else if (this.dataFromDialog[currentSelectedFile].dataArrayColumns[i][0] instanceof Date) {
        this.timeSeriesDayType = `${currentSelectedFile},${i}`;
      }
      console.log(this.timeSeriesDayType);
    }
  }

  columnSelectorEvent(event) {
    this.columnSelectorList.push({
      name: this.columnSelector[event.target.options.selectedIndex].name,
      value: event.target.value
    });
  }

  removeFromListColumn(event) {
    for (let i = 0; i < this.columnSelectorList.length; i++) {
      if (this.columnSelectorList[i].name.trim() === event.target.innerText.trim()) {
        if (i === 0) {
          this.columnSelectorList.shift();
          break;
        } else if (this.columnSelectorList.length === 1) {
          this.columnSelectorList.pop();
          break;
        } else {
          this.columnSelectorList.splice(1, i);
          break;
        }
      }
    }
  }

  dayTypeNavigation() {
    if (this.columnSelectorList.length === 0) {
      alert('Please select Column');
    } else if (this.columnSelectorList.length > 0) {
      this.routeDataTransfer.storage = {
        value: this.columnSelectorList,
        timeSeriesDayType: this.timeSeriesDayType
      };
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
      this.fileSelector.push({
        name: filename,
        identifier: i
      });
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

  removeFile(id) {
    console.log(id);
    this.bsModalRef = this.modalService.show(ConfirmationModalComponent);
    this.bsModalRef.content.onClose.subscribe(result => {
      if (result) {
        this.indexFileStore.deleteFromDB(id).then(() => {
          this.indexFileStore.viewDataDB().then(result => {
            for (let i = 0; i < this.tabs.length; i++) {
              if (id === 0) {
                this.tabs.shift();
                break;
              } else if (id === this.tabs.length) {
                this.tabs.pop();
                break;
              } else {
                this.tabs.splice(1, i);
                break;
              }
            }
          });
        });
      }
    });

  }


}
