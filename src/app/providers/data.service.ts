import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DataService {


  constructor() {
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

  curateData(data) {
    const returnData = [];
    for (let j = 0; j < data.length; j++) {
      if (isNaN(data[j])) {
        returnData.push(0);
      } else {
        returnData.push(data[j]);
      }
    }
    return returnData;
  }

  getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
  }

  curateTimeSeries(inputTimeSeriesDayType: any) {
    const timeSeries = [];
    for (let i = 0; i < inputTimeSeriesDayType.length; i++) {
      if (inputTimeSeriesDayType[i] instanceof Date) {
        timeSeries.push(inputTimeSeriesDayType[i]);
      }
    }
    return timeSeries;
  }
}
