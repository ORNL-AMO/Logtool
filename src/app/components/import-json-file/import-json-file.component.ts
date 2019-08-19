import {Component, OnInit} from '@angular/core';
import {BsModalRef, BsModalService} from 'ngx-bootstrap';
import * as fs from 'fs';
import {ExportCSVService} from '../../providers/export-csv.service';
import {DayType} from '../../types/day-type';

@Component({
  selector: 'app-import-json-file',
  templateUrl: './import-json-file.component.html',
  styleUrls: ['./import-json-file.component.scss']
})
export class ImportJsonFileComponent implements OnInit {

  constructor(private modalService: BsModalService, public bsModalRef: BsModalRef, private exportCSV: ExportCSVService) {
  }

  ngOnInit() {
  }

  onChange(event) {
    const files = event.target.files;
    const f = files[0];
    const dataFromFile: DayType[] = JSON.parse(fs.readFileSync(f.path).toLocaleString());
    this.exportCSV.readJsonFileSnapShotDayType(dataFromFile);
  }
}
