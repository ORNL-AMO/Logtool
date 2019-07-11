import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-tool-header',
  templateUrl: './tool-header.component.html',
  styleUrls: ['./tool-header.component.scss']
})
export class ToolHeaderComponent implements OnInit {

  active = 0;
  constructor() { }
  ngOnInit() {

  }


  changeActive(tab) {
    this.active = tab;
  }
}
