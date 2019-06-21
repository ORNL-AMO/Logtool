import {Component, OnInit} from '@angular/core';
import {DataService} from '../../providers/data.service';
import {ExportCSVService} from '../../providers/export-csv.service';
import {RouteDataTransferService} from '../../providers/route-data-transfer.service';

@Component({
  selector: 'app-plot-scatter-graph',
  templateUrl: './plot-scatter-graph.component.html',
  styleUrls: ['./plot-scatter-graph.component.scss']
})
export class PlotScatterGraphComponent implements OnInit {
  graph: any;
  dataInput = [];
  xValue = [];
  yValue = [];
  plotGraph = [];

  constructor(private data: DataService, private exportCsvService: ExportCSVService, private routeDataTransfer: RouteDataTransferService) {
  }

  ngOnInit() {
    this.data.currentdataInputArray.subscribe(input => this.dataInput = input);
    console.log(this.routeDataTransfer.storage.x[0].value);

    console.log(this.plotGraph);

  }
  /*onCreateCsv() {
  const csvData = [];
  for (let i = 0; i < this.dataInput[0].inputData.length; i++) {
    csvData.push({'id': i,
      '100Amp': this.dataInput[0].inputData[i],
      '150Amp': this.dataInput[1].inputData[i],
      'TimeStamp': this.dataInput[0]
    });
  }
  this.csvexport.exportAsExcelFile(csvData, 'workfile');
}*/

}
