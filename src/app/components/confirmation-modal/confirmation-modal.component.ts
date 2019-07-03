import {Component, OnInit, TemplateRef} from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-confirmation-modal',
  templateUrl: './confirmation-modal.component.html',
  styleUrls: ['./confirmation-modal.component.scss']
})
export class ConfirmationModalComponent implements OnInit {

  public onClose: Subject<boolean>;

  message: string;
  constructor(private modalService: BsModalService, private modalRef: BsModalRef) {}

  ngOnInit() {
    this.onClose = new Subject();
  }
  public confirm() {
    this.onClose.next(true);
    this.modalRef.hide();
  }

  public decline() {
    this.onClose.next(false);
    this.modalRef.hide();
  }

}
