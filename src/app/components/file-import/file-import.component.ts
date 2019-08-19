import {Component, OnInit} from '@angular/core';
import {BsModalRef, BsModalService} from 'ngx-bootstrap';
import * as XLSX from 'xlsx';
import {DataService} from '../../providers/data.service';
import {RouteDataTransferService} from '../../providers/route-data-transfer.service';

import * as fs from 'fs';
import {Subject} from 'rxjs';
import {ImportDataComponent} from '../import-data/import-data.component';
import {IndexDataBaseStoreService} from '../../providers/index-data-base-store.service';
import {Assessment} from '../../types/assessment';

@Component({
  selector: 'app-file-import',
  templateUrl: './file-import.component.html',
  styleUrls: ['./file-import.component.scss']
})
export class FileImportComponent implements OnInit {

  public returnList: Subject<any>;
  public test: { type: string, path: string };
  fileType: any;
  inputFile: any;
  dataFromDialogCSV: any;
  csvList: any[];
  ImportRef: BsModalRef;
  selected: any[];
  originalSet;

  constructor(private modalService: BsModalService, private indexDatabaseStoreService: IndexDataBaseStoreService,
              public selfModalRef: BsModalRef) {
  }

  fileName: any;

  ngOnInit() {
    this.returnList = new Subject();
    this.csvList = [];
    console.log('selected: ', this.selected);
    this.generatecsvList();
    this.originalSet = this.selected.slice(0, this.selected.length);
  }

  showImportModal() {
    this.ImportRef = this.modalService.show(ImportDataComponent, {backdrop: true});
    this.modalService.onHide.subscribe(() => {
      this.generatecsvList();
    });
  }

  generatecsvList() {
    this.indexDatabaseStoreService.viewFromCSVStore().then(result => {
      this.dataFromDialogCSV = result;
      if (this.dataFromDialogCSV === null || this.dataFromDialogCSV === undefined) {
      } else {
        this.csvList = [];
        for (let i = 0; i < this.dataFromDialogCSV.length; i++) {
          const prev = this.selected.findIndex(obj => obj.name === this.dataFromDialogCSV[i].name) >= 0;
          this.csvList.push({
            name: this.dataFromDialogCSV[i].name,
            id: this.dataFromDialogCSV[i].id,
            selected: prev,
          });
        }
      }
    }, error => {
      console.log(error);
    });
  }

  clickSelect(file) {
    const index = this.selected.findIndex(obj => obj.id === file.id);
    if ( index >= 0) {
      console.log('removing', file, index);

      console.log(this.selected[index]);

      this.selected.splice(index, 1);
      file.selected = false;
    } else {

      file.selected = true;
      this.selected.push(file);
    }
    console.log('selected', this.selected);
  }


  public confirm() {
    const list = [];
    for (const i of this.selected) {
      list.push(i.id);
    }
    console.log(list);
    this.returnList.next(list);
    this.selfModalRef.hide();
  }
}
