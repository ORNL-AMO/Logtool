import {Component, OnInit} from '@angular/core';
import {BsModalRef, BsModalService, ModalDirective} from 'ngx-bootstrap';
import {TooltipModule} from 'ngx-bootstrap/tooltip';
import * as XLSX from 'xlsx';
import {DataService} from '../../providers/data.service';
import {RouteDataTransferService} from '../../providers/route-data-transfer.service';

import * as fs from 'fs';
import {Subject} from 'rxjs';
import {ImportDataComponent} from '../import-data/import-data.component';

@Component({
  selector: 'app-file-import',
  templateUrl: './file-import.component.html',
  styleUrls: ['./file-import.component.scss']
})
export class FileImportComponent implements OnInit {

  public onClose: Subject<any>;
  public test: {type: string, path: string};
  private fileType: any;
  private inputFile: any;
  private dataFromDialog: any;
  private fileList: any[];
  FileRef: BsModalRef;
  private selected: any[];
  constructor(private modalService: BsModalService,
              private bsModalRef: BsModalRef, private data: DataService, private routerData: RouteDataTransferService) { }
  fileName: any;
  ngOnInit() {
    this.onClose = new Subject();
    this.fileList = [];
    this.selected = [];
    this.generateFileList();
  }

  showImportModal() {
    this.FileRef = this.modalService.show(ImportDataComponent);
    this.modalService.onHide.subscribe(() => {
      this.generateFileList();
    });
  }

  generateFileList() {
    this.indexFileStore.viewDataDB().then(result => {
      this.dataFromDialog = result;
      console.log(result);
      if (this.dataFromDialog === null || this.dataFromDialog === undefined) {
      } else {
        this.fileList = [];
        for (let i = 0; i < this.dataFromDialog.length; i++) {
          this.fileList.push({
            name: this.dataFromDialog[i].name,
            id: this.dataFromDialog[i].id,
            selected: false,
          });
        }
      }
    }, error => {
      console.log(error);
    });
  }

  clickSelect(file){
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
      const dataFromFile: LoadList[] = JSON.parse(fs.readFileSync(f.path).toLocaleString());
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
