import {Component, OnInit} from '@angular/core';
import {IndexFileStoreService} from '../../providers/index-file-store.service';
import {BsModalRef, BsModalService, ModalDirective} from 'ngx-bootstrap';
import {TooltipModule} from 'ngx-bootstrap/tooltip';
import * as XLSX from 'xlsx';
import {DataService} from '../../providers/data.service';
import {DataList} from '../../types/data-list';
import {RouteDataTransferService} from '../../providers/route-data-transfer.service';
import {LoadList} from '../../types/load-list';
import * as fs from "fs";

@Component({
  selector: 'app-file-import',
  templateUrl: './file-import.component.html',
  styleUrls: ['./file-import.component.scss']
})
export class FileImportComponent implements OnInit {

  constructor(private indexFileStore: IndexFileStoreService, private modalService: BsModalService,
              private bsModalRef: BsModalRef, private data: DataService, private routerData: RouteDataTransferService) { }
              fileName: any;
  ngOnInit() {
  }





}
