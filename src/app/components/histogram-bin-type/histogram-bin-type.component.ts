import {Component, OnInit} from '@angular/core';
import * as stats from 'stats-lite';
import * as lodash from 'lodash';
import {DataService} from '../../providers/data.service';

@Component({
  selector: 'app-histogram-bin-type',
  templateUrl: './histogram-bin-type.component.html',
  styleUrls: ['./histogram-bin-type.component.scss']
})
export class HistogramBinTypeComponent implements OnInit {
  dataFromDialog: any = [];
  median;
  stdDeviation;
  medianSD = [];
  smallerSD = [];
  biggerSD = [];
  graph: any;

  constructor(private data: DataService) {
  }

  ngOnInit() {
    this.data.currentdataInputArray.subscribe(input => this.dataFromDialog = input[1].dataArrayColumns[1]);

    this.plotHistogram(0, 3);
  }

  plotHistogram(channelId, numberOfSD) {
    const calculationArray = [];
    const medianPlot = [];
    let smallerSDPlot = [];
    let biggerSDPlot = [];
    console.log(this.dataFromDialog);
    for (let i = 0; i < this.dataFromDialog.length; i++) {
      if (isNaN(this.dataFromDialog[i])) {
        calculationArray.push(0);
      } else {
        calculationArray.push(this.dataFromDialog[i]);
      }
    }
    /*console.log(stats.histogram(calculationArray, 15));
    console.log(this.getMax(calculationArray));
    console.log(this.getMin(calculationArray));*/
    this.median = (this.getMax(calculationArray) + this.getMin(calculationArray)) / 2;
    this.stdDeviation = this.getSD(calculationArray);
    let lesserSDValue = this.median - this.stdDeviation;
    let moreSDValue = this.median + this.stdDeviation;
    /*for (let i = 0; i < calculationArray.length; i++) {
      if (calculationArray[i] === this.median) {
        medianPlot.push(calculationArray[i]);
        calculationArray[i] = 'MEDIAN';
      }
    }
    this.medianSD.push(medianPlot);*/
    for (let i = 1; i <= numberOfSD; i++) {
      smallerSDPlot = [];
      biggerSDPlot = [];
      lesserSDValue = this.median - this.stdDeviation * i;
      moreSDValue = this.median + this.stdDeviation * i;
      for (let j = 0; j < calculationArray.length; j++) {
        if (isNaN(calculationArray[j])) {

        } else if (calculationArray[j] >= lesserSDValue && calculationArray[j] <= this.median) {
          smallerSDPlot.push(calculationArray[j]);
          calculationArray[j] = 'smaller ' + j;
        } else if (calculationArray[j] >= this.median && calculationArray[j] <= moreSDValue) {
          biggerSDPlot.push(calculationArray[j]);
          calculationArray[j] = 'bigger' + j;
        }
      }
      this.smallerSD.push(smallerSDPlot);
      this.biggerSD.push(biggerSDPlot);
    }
    console.log(this.smallerSD);
    console.log(this.biggerSD);
    const plotData = [];
    const plotGraph = [];
    const plotName = [];
    for (let i = this.smallerSD.length - 1; i >= 0; i--) {
      if (this.smallerSD[i].length === 0) {
      } else {
        plotData.push(this.smallerSD[i].length);
        plotName.push((this.getMax(this.smallerSD[i]) + this.getMin(this.smallerSD[i])) / 2);
      }

    }
    for (let i = 0; i < this.biggerSD.length; i++) {
      if (this.biggerSD[i].length === 0) {
      } else {
        plotData.push(this.biggerSD[i].length);
        plotName.push((this.getMax(this.biggerSD[i]) + this.getMin(this.biggerSD[i])) / 2);
      }
    }
    console.log(plotData);
    console.log(plotName);
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

  getMax(data) {
    let max = data[0];
    for (let i = 0; i <= data.length; i++) {
      if (data[i] > max) {
        max = data[i];
      }
    }
    return max;
  }

  getMin(data) {
    let min = data[0];
    for (let i = 0; i <= data.length; i++) {
      if (data[i] < min && data[i] !== 0) {
        min = data[i];
      }
    }
    return min;
  }

  getMean(data) {
    return data.reduce((a, b) => {
      return Number(a) + Number(b);
    }) / data.length;
  }

  getSD(data) {
    const mean = this.getMean(data);
    return Math.sqrt(data.reduce((sq, n) => {
      return sq + Math.pow(n - mean, 2);
    }, 0) / (data.length));
  }
}
