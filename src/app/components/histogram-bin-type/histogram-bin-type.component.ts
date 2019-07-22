import {Component, OnInit} from '@angular/core';
import * as stats from 'stats-lite';
import {DataService} from '../../providers/data.service';

@Component({
  selector: 'app-histogram-bin-type',
  templateUrl: './histogram-bin-type.component.html',
  styleUrls: ['./histogram-bin-type.component.scss']
})
export class HistogramBinTypeComponent implements OnInit {
  dataFromDialog: any = [];
  graph: any;
  graph2: any;
  dataList = [];
  columnSelectorList = [];
  temp1: any;
  graphType: number;
  constructor(private data: DataService) {
  }

  ngOnInit() {
    this.data.currentdataInputArray.subscribe(input => this.dataFromDialog = input);
    console.log(this.dataFromDialog);
    this.populateSpinner();
    /*const curateDataFirstHist = this.data.curateData(this.dataFromDialog);
    const curateDataSecondHist = curateDataFirstHist.slice();
    this.plotFirstHistogram(curateDataFirstHist);
    this.plotSecondHistogram(curateDataSecondHist, 7);*/
  }

  plotFirstHistogram(calculationArray) {
    const smallerSD = [];
    const biggerSD = [];
    const plotData = [];
    const plotGraph = [];
    const plotName = [];
    const median = (this.data.getMax(calculationArray) + this.data.getMin(calculationArray)) / 2;
    const stdDeviation = this.data.getSD(calculationArray);
    let lesserSDValue = median - stdDeviation;
    let moreSDValue = median + stdDeviation;
    let totalSamples = 0;
    let i = 1;
    while (totalSamples < calculationArray.length) {
      const smallerSDPlot = [];
      const biggerSDPlot = [];
      lesserSDValue = median - stdDeviation * i;
      moreSDValue = median + stdDeviation * i;
      for (let j = 0; j < calculationArray.length; j++) {
        if (isNaN(calculationArray[j])) {

        } else if (calculationArray[j] >= lesserSDValue && calculationArray[j] < median) {
          smallerSDPlot.push(calculationArray[j]);
          calculationArray[j] = 'smaller ' + j;
        } else if (calculationArray[j] >= median && calculationArray[j] <= moreSDValue) {
          biggerSDPlot.push(calculationArray[j]);
          calculationArray[j] = 'bigger ' + j;
        }
      }
      smallerSD.push(smallerSDPlot);
      biggerSD.push(biggerSDPlot);
      totalSamples = totalSamples + smallerSDPlot.length + biggerSDPlot.length;
      i++;
    }
    for (let small = smallerSD.length - 1; small >= 0; small--) {
      if (smallerSD[small].length === 0) {
      } else {
        plotData.push(smallerSD[small].length);
        plotName.push(smallerSD[small][0] + ' - ' + smallerSD[small][smallerSD[small].length - 1]);
      }
    }
    for (let big = 0; big < biggerSD.length; big++) {
      if (biggerSD[big].length === 0) {
      } else {
        plotData.push(biggerSD[big].length);
        plotName.push(biggerSD[big][0] + ' - ' + biggerSD[big][biggerSD[big].length - 1]);
      }
    }
    plotGraph.push({
      x: plotName,
      y: plotData,
      type: 'bar',
      mode: 'markers'
      /*x: plotData,
      type: 'bar',
      mode: 'markers'*/
    });
    console.log(median);
    console.log(stdDeviation);
    console.log(plotGraph);
    this.graph = {
      data: plotGraph
    };
  }

  plotSecondHistogram(data, numberOfBins) {
    const plotGraph2 = [];
    const plotData2 = stats.histogram(data, numberOfBins);
    console.log(plotData2);
    plotGraph2.push({
      y: plotData2.values,
      type: 'bar',
      mode: 'markers'
    });
    console.log(plotGraph2);
    this.graph2 = {
      data: plotGraph2
    };
  }

  populateSpinner() {
    this.dataList = [];
    for (let i = 0; i < this.dataFromDialog.length; i++) {
      const fileName = this.dataFromDialog[i].name;
      for (let j = 0; j < this.dataFromDialog[i].selectedHeader.length; j++) {
        const columnName = this.dataFromDialog[i].selectedHeader[j].headerName;
        if (!(this.dataFromDialog[i].dataArrayColumns[j][0] instanceof Date)) {
          this.dataList.push({
            name: fileName + '-' + columnName,
            identifier: `${i},${j}`
          });
        }
      }
    }
    console.log(this.dataList);
  }

  plotHistoGram() {
    console.log(this.columnSelectorList);
  }
  columnSelectorEvent(event) {
    this.columnSelectorList.pop();
    this.columnSelectorList.push({
      name: this.dataList[event.target.options.selectedIndex].name,
      value: event.target.value
    });
  }

  checkboxSelect(event) {
    if (event.target.value.trim() === 'stdev') {
      this.graphType = 1;
    } else if (event.target.value.trim() === 'numBins') {
      this.graphType = 2;
    } else if (event.target.value.trim() === 'range') {
      this.graphType = 3;
    }
  }


}
