import {Component, OnInit} from '@angular/core';
import {IndexFileStoreService} from '../../providers/index-file-store.service';
import {BsModalRef, BsModalService, ModalDirective} from 'ngx-bootstrap';
import {TooltipModule} from 'ngx-bootstrap/tooltip';
import * as XLSX from 'xlsx';
import {DataService} from '../../providers/data.service';
import {DataList} from '../../types/data-list';
import {RouteDataTransferService} from '../../providers/route-data-transfer.service';

import {LoadList} from '../../types/load-list';
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

  constructor(private indexFileStore: IndexFileStoreService, private modalService: BsModalService,
              private bsModalRef: BsModalRef, private data: DataService, private routerData: RouteDataTransferService) { }
              fileName: any;
  ngOnInit() {
    this.onClose = new Subject();
    this.test = null;
  }


  public decline() {
    this.onClose.next(false);
    this.bsModalRef.hide();
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
      //this.bsModalRef.hide();
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
      path:f.path,
      fileType: f.type,
      ignoreBackdropClick: true,
      class: 'my-modal',
      workbook: loadedWorkbook,
      worksheet: worksheet,
      dataArrayColumns: dataArrayColumns,
    };
    this.bsModalRef = this.modalService.show(ImportDataComponent, {initialState});
    //this.bsModalRef.content.closeBtnName = 'Close';
  }
}
