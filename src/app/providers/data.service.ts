import {Injectable} from '@angular/core';
import {Assessment} from '../types/assessment';
import {CSVFileInput} from '../types/csvfile-input';
import {FileMetaData} from '../types/file-meta-data';
import {Graph} from '../types/graph';
import {DayType} from '../types/day-type';
import {BehaviorSubject} from 'rxjs';
import {QuickSave} from '../types/quick-save';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private assessmentItem: Assessment;
  private subjectAssessmentItem = new BehaviorSubject(this.assessmentItem);
  curresntAssessmentItem = this.subjectAssessmentItem.asObservable();
  private assessmentItemArray: Assessment[];
  private subjectAssessmentItemArray = new BehaviorSubject(this.assessmentItemArray);
  currentAssessmentItemArray = this.subjectAssessmentItemArray.asObservable();
  private csvItem: CSVFileInput;
  private subjectCSVItem = new BehaviorSubject(this.csvItem);
  currentCSVItem = this.subjectCSVItem.asObservable();
  private csvItemArray: CSVFileInput[];
  private subjectCSVItemArray = new BehaviorSubject(this.csvItemArray);
  currentCSVItemArray = this.subjectCSVItemArray.asObservable();
  private metaDataItem: FileMetaData;
  private subjectMetaDataItem = new BehaviorSubject(this.metaDataItem);
  currentMetaDataItem = this.subjectMetaDataItem.asObservable();
  private graphItem: Graph;
  private subjectGraphItem = new BehaviorSubject(this.graphItem);
  currentGraphItem = this.subjectGraphItem.asObservable();
  private graphItemArray: Graph[];
  private subjectGraphItemArray = new BehaviorSubject(this.graphItemArray);
  currentGraphItemArray = this.subjectGraphItemArray.asObservable();
  private dayTypeItem: DayType;
  private subjectDayTypeItem = new BehaviorSubject(this.dayTypeItem);
  currentDayTypeItem = this.subjectDayTypeItem.asObservable();
  private dayTypeItemArray: DayType[];
  private subjectDayTypeItemArray = new BehaviorSubject(this.dayTypeItemArray);
  currentDayTypeItemArray = this.subjectDayTypeItemArray.asObservable();
  private quickSaveItem: QuickSave;
  private subjectQuickSaveItem = new BehaviorSubject(this.quickSaveItem);
  currentQuickSaveItem = this.subjectQuickSaveItem;


  constructor() {
  }

  changeAssessmentItem(assessment: Assessment) {
    this.subjectAssessmentItem.next(assessment);
  }

  changeAssessmentItemArray(assessment: Assessment[]) {
    this.subjectAssessmentItemArray.next(assessment);
  }

  changeCSVItem(csv: CSVFileInput) {
    this.subjectCSVItem.next(csv);
  }

  changeCSVItemArray(csv: CSVFileInput[]) {
    this.subjectCSVItemArray.next(csv);
  }

  changeMetaDataItem(metaData: FileMetaData) {
    this.subjectMetaDataItem.next(metaData);
  }

  changeGraphItem(graph: Graph) {
    this.subjectGraphItem.next(graph);
  }

  changeGraphItemArray(graph: Graph[]) {
    this.subjectGraphItemArray.next(graph);
  }

  changeDayTypeItem(dayType: DayType) {
    this.subjectDayTypeItem.next(dayType);
  }

  changeDayTypeItemArray(dayType: DayType[]) {
    this.subjectDayTypeItemArray.next(dayType);
  }

  changeQuickSaveItem(quickSave: QuickSave) {
    this.subjectQuickSaveItem.next(quickSave);
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
