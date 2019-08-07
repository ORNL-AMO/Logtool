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
  currentAssessmentItem;
  private assessmentItemArray: Assessment[];
  currentAssessmentItemArray;
  private csvItem: CSVFileInput;
  currentCSVItem;
  private csvItemArray: CSVFileInput[];
  currentCSVItemArray;
  private metaDataItem: FileMetaData;
  currentMetaDataItem;
  private graphItem: Graph;
  currentGraphItem;
  private graphItemArray: Graph[];
  currentGraphItemArray;
  private dayTypeItem: DayType;
  currentDayTypeItem;
  private dayTypeItemArray: DayType[];
  currentDayTypeItemArray;
  private quickSaveItem: QuickSave;
  currentQuickSaveItem;


  constructor() {
  }

  changeAssessmentItem(assessment: Assessment) {
    const subjectAssessmentItem = new BehaviorSubject<Assessment>(this.assessmentItem);
    subjectAssessmentItem.next(assessment);
    this.currentAssessmentItem = subjectAssessmentItem.asObservable();
  }

  changeAssessmentItemArray(assessment: Assessment[]) {
    const subjectAssessmentItemArray = new BehaviorSubject<Assessment[]>(this.assessmentItemArray);
    subjectAssessmentItemArray.next(assessment);
    this.currentAssessmentItemArray = subjectAssessmentItemArray.asObservable();
  }

  changeCSVItem(csv: CSVFileInput) {
    const subjectCSVItem = new BehaviorSubject<CSVFileInput>(this.csvItem);
    subjectCSVItem.next(csv);
    this.currentCSVItem = subjectCSVItem.asObservable();
  }

  changeCSVItemArray(csv: CSVFileInput[]) {
    const subjectCSVItemArray = new BehaviorSubject<CSVFileInput[]>(this.csvItemArray);
    subjectCSVItemArray.next(csv);
    this.currentCSVItemArray = subjectCSVItemArray.asObservable();
  }

  changeMetaDataItem(metaData: FileMetaData) {
    const subjectMetaDataItem = new BehaviorSubject(this.metaDataItem);
    subjectMetaDataItem.next(metaData);
    this.currentMetaDataItem = subjectMetaDataItem.asObservable();
  }

  changeGraphItem(graph: Graph) {
    const subjectGraphItem = new BehaviorSubject(this.graphItem);
    subjectGraphItem.next(graph);
    this.currentGraphItem = subjectGraphItem.asObservable();
  }

  changeGraphItemArray(graph: Graph[]) {
    const subjectGraphItemArray = new BehaviorSubject(this.graphItemArray);
    subjectGraphItemArray.next(graph);
    this.currentGraphItemArray = subjectGraphItemArray.asObservable();
  }

  changeDayTypeItem(dayType: DayType) {
    const subjectDayTypeItem = new BehaviorSubject(this.dayTypeItem);
    subjectDayTypeItem.next(dayType);
    this.currentDayTypeItem = subjectDayTypeItem.asObservable();
  }

  changeDayTypeItemArray(dayType: DayType[]) {
    const subjectDayTypeItemArray = new BehaviorSubject(this.dayTypeItemArray);
    subjectDayTypeItemArray.next(dayType);
    this.currentDayTypeItemArray = subjectDayTypeItemArray.asObservable();
  }

  changeQuickSaveItem(quickSave: QuickSave) {
    const subjectQuickSaveItem = new BehaviorSubject(this.quickSaveItem);
    subjectQuickSaveItem.next(quickSave);
    this.currentQuickSaveItem = subjectQuickSaveItem;
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
