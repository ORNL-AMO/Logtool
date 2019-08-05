import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {DataList} from '../types/data-list';
import {LoadList} from '../types/load-list';
import {FileMetaData} from '../types/file-meta-data';
import {VisualizeLoadGraph} from '../types/visualize-load-graph';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private inputDataArray: DataList[] = [];
  private inputDataSaveLoadArray: LoadList[] = [];
  private inputDataSaveLoadIdArray: Number[] = [];
  private inputSingleDataSaveLoad: LoadList;
  private inputSingleDataMetaData: FileMetaData;
  private inputSingleDataGraph: VisualizeLoadGraph;
  private inputDataGraphArray: VisualizeLoadGraph[] = [];
  private dataInputArray = new BehaviorSubject(this.inputDataArray);
  private dataInputSaveLoadArray = new BehaviorSubject(this.inputDataSaveLoadArray);
  private dataInputSaveLoadIdArray = new BehaviorSubject(this.inputDataSaveLoadIdArray);
  private dataSingleInputSaveLoad = new BehaviorSubject(this.inputSingleDataSaveLoad);
  private dataSingleInputMetaData = new BehaviorSubject(this.inputSingleDataMetaData);
  private dataSingleInputGraph = new BehaviorSubject(this.inputSingleDataGraph);
  private dataInputGraphArray = new BehaviorSubject(this.inputDataGraphArray);
  currentDataInputArray = this.dataInputArray.asObservable();
  currentDataInputSaveLoadArray = this.dataInputSaveLoadArray.asObservable();
  currentDataInputSaveLoadIdArray = this.dataInputSaveLoadIdArray.asObservable();
  currentSingleDataInputSaveLoad = this.dataSingleInputSaveLoad.asObservable();
  currentSingleDataInputMetaData = this.dataSingleInputMetaData.asObservable();
  currentSingleDataInputGraph = this.dataSingleInputGraph.asObservable();
  currentDataInputGraphArray = this.dataInputGraphArray.asObservable();

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

  changeSingleInputMetaData(input: FileMetaData) {
    this.dataSingleInputMetaData.next(input);
  }

  changeSingleInputGraph(input: VisualizeLoadGraph) {
    this.dataSingleInputGraph.next(input);
  }

  changeInputGraphArray(input: VisualizeLoadGraph[]) {
    this.dataInputGraphArray.next(input);
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
