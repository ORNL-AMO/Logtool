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

  constructor(private data: DataService) {
  }

  ngOnInit() {
    this.data.currentdataInputArray.subscribe(input => this.dataFromDialog = input[1].dataArrayColumns[2]);
    const curateDataFirstHist = this.data.curateData(this.dataFromDialog);
    const curateDataSecondHist = curateDataFirstHist.slice();
    this.plotFirstHistogram(curateDataFirstHist);
    this.plotSecondHistogram(curateDataSecondHist, 25);
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
        plotName.push(((this.data.getMax(smallerSD[small]) + this.data.getMin(smallerSD[small])) / 2) + ' File Name');
      }
    }
    for (let big = 0; big < biggerSD.length; big++) {
      if (biggerSD[big].length === 0) {
      } else {
        plotData.push(biggerSD[big].length);
        plotName.push(((this.data.getMax(biggerSD[big]) + this.data.getMin(biggerSD[big])) / 2) + ' File Name');
      }
    }
    plotGraph.push({
      x: plotName,
      y: plotData,
      type: 'bar',
      mode: 'markers'
    });

    this.graph = {
      data: plotGraph
    };
  }

  plotSecondHistogram(data, numberOfBins) {
    const plotGraph2 = [];
    const plotData2 = stats.histogram(data, numberOfBins);
    plotGraph2.push({
      y: plotData2.values,
      type: 'bar',
      mode: 'markers'
    });
    this.graph2 = {
      data: plotGraph2
    };
  }

}
