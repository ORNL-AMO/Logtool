import {Component, OnInit} from '@angular/core';
import { Router } from '@angular/router';
import { ImportDataComponent } from '../import-data/import-data.component';
import { IndexFileStoreService } from '../../providers/index-file-store.service';
import { RouteDataTransferService } from '../../providers/route-data-transfer.service';
import {BsModalRef, BsModalService, ModalModule, ModalDirective } from 'ngx-bootstrap';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  graph: any;
  tabs = [];
  sendingValue = 0;
  dataFromDialog: any = [];
  columnsXandY: any = [];
  timeSeriesY: any = [];
  show: any;
  ySelectorList: any = [];
  timeSeriesLineElement: any = [];
  temp: any;
  bsModalRef: BsModalRef;

  constructor(private router: Router, private indexFileStore: IndexFileStoreService, private routeDataTransfer: RouteDataTransferService, private modalService: BsModalService) {
  }
  // Unchanged
  ngOnInit() {
    this.dataFromDialog = [];
    this.columnsXandY = [];
    this.timeSeriesY = [];
    this.indexFileStore.viewDataDB().then(result => {
      this.dataFromDialog = result;
      if (this.dataFromDialog === null || this.dataFromDialog === undefined) {
      } else {
        this.tabs = [];
        for (let i = 0; i < this.dataFromDialog.length; i++) {
          this.tabs.push({
            name: this.dataFromDialog[i].name,
            id: i
          });
        }
        for (let i = 0; i < this.tabs.length; i++) {
          const filename = this.tabs[i].name;
          for (let j = 0; j < this.dataFromDialog[i].selectedHeader.length; j++) {
            const columnName = this.dataFromDialog[i].selectedHeader[j].headerName;
            if (!isNaN(this.dataFromDialog[i].dataArrayColumns[j][0]) && !Date.parse(this.dataFromDialog[i].dataArrayColumns[j][0])) {
              this.columnsXandY.push({
                name: filename + '-' + columnName,
                identifier: `${i}, ${j}`
              });
            }

            if (isNaN(this.dataFromDialog[i].dataArrayColumns[j][0]) && Date.parse(this.dataFromDialog[i].dataArrayColumns[j][0])) {
              this.timeSeriesY.push({
                name: filename + '-' + columnName,
                identifier: `${i}, ${j}`
              });
            }
          }
        }
        this.sendingValue = 0;
        this.router.navigateByUrl('/table-data', {skipLocationChange: true}).then(() => {
          this.sendingValue = this.dataFromDialog.length - 1;
          this.router.navigate(['/table-data'], {
            queryParams: {
              value: this.sendingValue
            }
          });
        });
      }
    }, error => {
      console.log(error);
    });
  }

  // Changed? or needs to be;
  onImport() {
    this.bsModalRef = this.modalService.show(ImportDataComponent, {class: 'my-modal', ignoreBackdropClick: true});
    this.bsModalRef.content.closeBtnName = 'Close';


    this.dataFromDialog = [];
    this.columnsXandY = [];
    this.timeSeriesY = [];
     //const dialogRef = this.dialog.open(ImportDataComponent);
    this.modalService.onHide.subscribe(() => {
      this.indexFileStore.viewDataDB().then(result => {
        this.dataFromDialog = result;
        this.tabs = [];
        for (let i = 0; i < this.dataFromDialog.length; i++) {
          this.tabs.push({
            name: this.dataFromDialog[i].name,
            id: i
          });
        }
        for (let i = 0; i < this.tabs.length; i++) {
          const filename = this.tabs[i].name;
          for (let j = 0; j < this.dataFromDialog[i].selectedHeader.length; j++) {
            const columnName = this.dataFromDialog[i].selectedHeader[j].headerName;
            if (!isNaN(this.dataFromDialog[i].dataArrayColumns[j][0]) && !Date.parse(this.dataFromDialog[i].dataArrayColumns[j][0])) {
              this.columnsXandY.push({
                name: filename + '-' + columnName,
                identifier: `${i}, ${j}`
              });
            }

            if (isNaN(this.dataFromDialog[i].dataArrayColumns[j][0]) && Date.parse(this.dataFromDialog[i].dataArrayColumns[j][0])) {
              this.timeSeriesY.push({
                name: filename + '-' + columnName,
                identifier: `${i}, ${j}`
              });
            }
          }
        }
        this.sendingValue = this.dataFromDialog.length - 1;
        this.router.navigateByUrl('/table-data', {skipLocationChange: true}).then(() => {
          this.sendingValue = this.dataFromDialog.length - 1;
          this.router.navigate(['/table-data'], {
            queryParams: {
              value: this.sendingValue
            }
          });
        });
      });
    });
  }

  //Unchanged
  navigation(formData) {
    if (formData.graph === '' || formData.graph === undefined) {
      alert('Please select Graph type');
    } else if (formData.graph === 'line_graph') {
      this.routeDataTransfer.storage = {
        value: this.ySelectorList,
        timeSeries: this.timeSeriesLineElement
      };
      this.router.navigate(['/line-graph']);
    } else if (formData.graph === 'scatter_graph') {
      this.routeDataTransfer.storage = {
        value: this.ySelectorList,
        timeSeries: this.timeSeriesLineElement
      };
      this.router.navigate(['/scatter-graph']);
    }
  }

  //Unchanged
  changeDisplayTable(value) {
    this.router.navigateByUrl('/table-data', {skipLocationChange: true}).then(() => {
      this.sendingValue = value;
      this.router.navigate(['/table-data'], {
        queryParams: {
          value: this.sendingValue
        }
      });
    });
  }

  //Unchanged
  checkboxSelect(event) {
    if (event.target.value === 'line_graph') {
      this.show = true;
    } else if (event.target.value === 'scatter_graph') {
      this.show = false;
    }
  }

  //Unchanged
  ySelector(event) {
    this.ySelectorList.push({
      name: this.columnsXandY[event.target.options.selectedIndex].name,
      value: event.target.value
    });
  }

  //Unchanged
  removeFromListLine(event) {
    for (let i = 0; i < this.ySelectorList.length; i++) {
      if (this.ySelectorList[i].name === event.target.innerText) {
        if (i === 0) {
          this.ySelectorList.shift();
          break;
        } else if (this.ySelectorList.length === 1) {
          this.ySelectorList.pop();
          break;
        } else {
          this.ySelectorList.splice(1, i);
          break;
        }
      }
    }
  }

  //Unchanged
  timeSeriesLineY(event) {
    this.timeSeriesLineElement.pop();
    this.timeSeriesLineElement.push({
      value: event.target.value,
      name: this.timeSeriesY[event.target.options.selectedIndex].name
    });
  }
}
