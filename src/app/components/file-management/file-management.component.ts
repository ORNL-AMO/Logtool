import { Component, OnInit } from '@angular/core';
import {ImportDataComponent} from '../import-data/import-data.component';
import {ImportJsonFileComponent} from '../import-json-file/import-json-file.component';
import {SaveLoadService} from '../../providers/save-load.service';
import {LoadList} from '../../types/load-list';
import {ExportCSVService} from '../../providers/export-csv.service';
import {DataService} from '../../providers/data.service';
import {GraphCalculationService} from '../../providers/graph-calculation.service';
import {GraphCreationService} from '../../providers/graph-creation.service';
import {IndexFileStoreService} from '../../providers/index-file-store.service';
import {BsModalService} from 'ngx-bootstrap';

@Component({
  selector: 'app-file-management',
  templateUrl: './file-management.component.html',
  styleUrls: ['./file-management.component.scss']
})
export class FileManagementComponent implements OnInit {

  constructor(private data: DataService, private indexFileStore: IndexFileStoreService,
              private modalService: BsModalService, private exportCsv: ExportCSVService, private saveLoad: SaveLoadService)  { }

  snapShotList: any[];
  ngOnInit() {
    this.generateSnapShotList();
  }

  generateSnapShotList() {
    this.indexFileStore.viewDataDBSaveInput().then(data => {
      this.data.currentDataInputSaveLoadArray.subscribe(result => {
        this.snapShotList = result;
        console.log(result);
      });
    });
  }


  //Removes all selected classes- adds selected class to target
  snapSelect(event, shot: any) {
    console.log(event.target);
    const list = document.getElementById(event.target.id).classList;
    if(list.contains('selected')){
      list.remove('selected');
    }else {
      list.add('selected');
    }
/*    const selectedArray = document.getElementsByClassName('selected');
    for (let n = 0; n < selectedArray.length; n++) {
      selectedArray[n].classList.remove('selected');
    }*/

  }
}
