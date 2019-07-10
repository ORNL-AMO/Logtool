import { Component, OnInit } from '@angular/core';
import {ImportDataComponent} from '../import-data/import-data.component';
import {BsModalRef, BsModalService} from 'ngx-bootstrap';

@Component({
  selector: 'app-tool-header',
  templateUrl: './tool-header.component.html',
  styleUrls: ['./tool-header.component.scss']
})
export class ToolHeaderComponent implements OnInit {

  active = 0;
  constructor(private modalService: BsModalService) { }
  bsModalRef: BsModalRef;
  ngOnInit() {

  }

  importClick() {
    this.bsModalRef = this.modalService.show(ImportDataComponent, {class: 'my-modal', ignoreBackdropClick: true});
    this.bsModalRef.content.closeBtnName = 'Close';
  }


  changeActive(tab) {
    this.active = tab;
  }
}
