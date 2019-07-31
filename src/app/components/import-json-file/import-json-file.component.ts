import {Component, OnInit} from '@angular/core';
import {BsModalRef, BsModalService} from 'ngx-bootstrap';
import * as fs from 'fs';
import {LoadList} from '../../types/load-list';
import {ExportCSVService} from '../../providers/export-csv.service';

@Component({
  selector: 'app-import-json-file',
  templateUrl: './import-json-file.component.html',
  styleUrls: ['./import-json-file.component.scss']
})
export class ImportJsonFileComponent implements OnInit {

  constructor(private modalService: BsModalService, private bsModalRef: BsModalRef, private exportCSV: ExportCSVService) {
  }

  ngOnInit() {
  }

  onChange(event) {
    const files = event.target.files;
    const f = files[0];
    const dataFromFile: LoadList[] = JSON.parse(fs.readFileSync(f.path).toLocaleString());
    this.exportCSV.readJsonFileSnapShot(dataFromFile);
  }
}
