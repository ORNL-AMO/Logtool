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

  public onClose: Subject<any>;
  public test: { type: string, path: string };
  private fileType: any;
  private inputFile: any;
  private dataFromDialogCSV: any;
  private csvList: any[];
  FileRef: BsModalRef;
  private selected: any[];

  constructor(private modalService: BsModalService, private indexDatabaseStoreService: IndexDataBaseStoreService,
              private bsModalRef: BsModalRef, private data: DataService, private routerData: RouteDataTransferService) {
  }

  fileName: any;

  ngOnInit() {
    this.onClose = new Subject();
    this.csvList = [];
    this.selected = [];
    this.generatecsvList();
  }

  showImportModal() {
    this.FileRef = this.modalService.show(ImportDataComponent);
    this.modalService.onHide.subscribe(() => {
      this.generatecsvList();
    });
  }

  generatecsvList() {
    this.indexDatabaseStoreService.viewFromCSVStore().then(result => {
      this.dataFromDialogCSV = result;
      console.log(result);
      if (this.dataFromDialogCSV === null || this.dataFromDialogCSV === undefined) {
      } else {
        this.csvList = [];
        for (let i = 0; i < this.dataFromDialogCSV.length; i++) {
          this.csvList.push({
            name: this.dataFromDialogCSV[i].name,
            id: this.dataFromDialogCSV[i].id,
            selected: false,
          });
        }
      }
    }, error => {
      console.log(error);
    });
  }

  clickSelect(file) {
    console.log(this.selected.findIndex(obj => obj.id === file.id));
    if (this.selected.findIndex(obj => obj.id === file.id) >= 0) {
      console.log('already imported');
      return;
    }
    file.selected = true;
    this.selected.push(file);
    console.log(this.selected);
  }

  onFileSelect(event) {
    const files = event.target.files;
    const f = files[0];
    this.fileName = f.name;
    this.fileType = f.type;

    try {
      const assessments: Assessment[] = JSON.parse(fs.readFileSync(f.path).toLocaleString());
      alert('First catch');
      this.test = {type: 'json', path: f.path};
      // this.bsModalRef.hide();
    } catch (e) {
      try {
        const loadedWorkbook = XLSX.readFile(f.path, {cellDates: true});
        const worksheet: XLSX.WorkSheet = loadedWorkbook.Sheets[loadedWorkbook.SheetNames[0]];
        const dataArrayColumns = XLSX.utils.sheet_to_json(worksheet, {header: 1});
        alert('Second catch');
        this.loadCSVMode(f);
      } catch {
        alert('no catch');
        this.test = {type: 'json', path: f.path};
      }
    }

  }


  private loadCSVMode(f) {
    const loadedWorkbook = XLSX.readFile(f.path, {cellDates: true});
    const worksheet: XLSX.WorkSheet = loadedWorkbook.Sheets[loadedWorkbook.SheetNames[0]];
    const dataArrayColumns = XLSX.utils.sheet_to_json(worksheet, {header: 1});
    const initialState = {
      stage: 2,
      fileName: f.name,
      path: f.path,
      fileType: f.type,
      ignoreBackdropClick: true,
      class: 'my-modal',
      workbook: loadedWorkbook,
      worksheet: worksheet,
      dataArrayColumns: dataArrayColumns,
    };
    this.bsModalRef = this.modalService.show(ImportDataComponent, {initialState});
    // this.bsModalRef.content.closeBtnName = 'Close';
  }

  public decline() {
    this.onClose.next(false);
    this.bsModalRef.hide();
  }

}
