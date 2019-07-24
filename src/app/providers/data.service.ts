import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {DataList} from '../types/data-list';
import {LoadList} from '../types/load-list';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private inputDataArray: DataList[] = [];
  private inputDataSaveLoadArray: LoadList[] = [];
  private inputDataSaveLoadIdArray: Number[] = [];
  private inputSingleDataSaveLoad: LoadList;
  private dataInputArray = new BehaviorSubject(this.inputDataArray);
  private dataInputSaveLoadArray = new BehaviorSubject(this.inputDataSaveLoadArray);
  private dataInputSaveLoadIdArray = new BehaviorSubject(this.inputDataSaveLoadIdArray);
  private dataSingleInputSaveLoad = new BehaviorSubject(this.inputSingleDataSaveLoad);
  currentDataInputArray = this.dataInputArray.asObservable();
  currentDataInputSaveLoadArray = this.dataInputSaveLoadArray.asObservable();
  currentDataInputSaveLoadIdArray = this.dataInputSaveLoadIdArray.asObservable();
  currentSingleDataInputSaveLoad = this.dataSingleInputSaveLoad.asObservable();

  constructor() {
  }

  changeInputArray(input: DataList[]) {
    this.dataInputArray.next(input);
  }

  changeInputSaveLoadArray(input: LoadList[]) {
    this.dataInputSaveLoadArray.next(input);
  }
  changeInputSaveLoadIdArray(input: Number[]) {
    this.dataInputSaveLoadIdArray.next(input);
  }
  changeSingleInputSaveLoad(input: LoadList) {
    this.dataSingleInputSaveLoad.next(input);
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
}
