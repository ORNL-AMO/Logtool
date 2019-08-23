import {Component, OnInit} from '@angular/core';
import {BsModalRef, BsModalService} from 'ngx-bootstrap';
import {Subject} from 'rxjs';

@Component({
  selector: 'app-graph-text-annotation',
  templateUrl: './graph-text-annotation.component.html',
  styleUrls: ['./graph-text-annotation.component.scss']
})
export class GraphTextAnnotationComponent implements OnInit {

  public onClose: Subject<String>;

  message: string;

  constructor(private modalService: BsModalService, private modalRef: BsModalRef) {
  }

  ngOnInit() {
    this.onClose = new Subject();
  }

  public confirm() {
    let message = '';
    const stringSplit = this.message.split('\n');
    console.log(stringSplit);
    for (let i = 0; i < stringSplit.length; i++) {
     message  = message + stringSplit[i] + '<br>';
    }
    this.onClose.next(message);
    this.modalRef.hide();
  }
}
