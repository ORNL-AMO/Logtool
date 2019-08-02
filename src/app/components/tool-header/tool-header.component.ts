import { Component, OnInit } from '@angular/core';
import {RouteDataTransferService} from '../../providers/route-data-transfer.service';

@Component({
  selector: 'app-tool-header',
  templateUrl: './tool-header.component.html',
  styleUrls: ['./tool-header.component.scss']
})
export class ToolHeaderComponent implements OnInit {

  active = 0;
  constructor(private routeService: RouteDataTransferService) { }
  ngOnInit() {

  }
  changeActive(tab) {
    const dataSend = {
      loadMode: false
    };
    this.routeService.storage = dataSend;
    this.active = tab;
  }
}
