import {Injectable} from '@angular/core';
import {DayType} from '../types/day-type';
import {DataService} from './data.service';
import {IndexDataBaseStoreService} from './index-data-base-store.service';
import {FileMetaData} from '../types/file-meta-data';
import {CSVFileInput} from '../types/csvfile-input';
import {Assessment} from '../types/assessment';

@Injectable({
  providedIn: 'root'
})
export class DatabaseOperationService {

  constructor(private data: DataService, private indexFileStore: IndexDataBaseStoreService) {
  }

  saveSession(dayTypeId: Number, assessmentId: Number, name: String, displayName: string, loadDataFromFile: any[],
              loadTimeSeriesDayType: any[], loadValueColumnCount: any[], columnMainArray: any[], sumArray: any[],
              binList: any[], displayBinList: any[], selectedBinList: any[], days: any[], selectedDates: Set<any>,
              graphDayAverage: any, graphBinAverage: any, showBinMode: boolean, toggleRelayoutDay: boolean,
              annotationListDayAverage: any[], annotationListBinAverage: any[], globalYAverageDay: any[],
              globalYAverageBin: any[], dayTypeMode: boolean, assessment: Assessment) {
    const selectedDatesValue = [];
    selectedDates.forEach((value) => {
      selectedDatesValue.push(value);
    });
    const saveSessionData: DayType = {
      id: dayTypeId,
      assessmentId: assessmentId,
      name: name,
      displayName: displayName,
      loadDataFromFile: loadDataFromFile,
      loadTimeSeriesDayType: loadTimeSeriesDayType,
      loadValueColumnCount: loadValueColumnCount,
      loadColumnMainArray: columnMainArray,
      loadSumArray: sumArray,
      loadBinList: binList,
      loadDisplayBinList: displayBinList,
      loadSelectedBinList: selectedBinList,
      loadDays: days,
      loadSelectedDates: selectedDatesValue,
      loadGraphDayAverage: graphDayAverage,
      loadGraphBinAverage: graphBinAverage,
      loadShowBinMode: showBinMode,
      loadToggleRelayoutDay: toggleRelayoutDay,
      loadAnnotationListDayAverage: annotationListDayAverage,
      loadAnnotationListBinAverage: annotationListBinAverage,
      loadGlobalYAverageDay: globalYAverageDay,
      loadGlobalYAverageBin: globalYAverageBin,
      dayTypeMode: dayTypeMode
    };
    this.indexFileStore.insertIntoDayTypeStore(saveSessionData, assessment).then(() => {
      alert('Day Type Saved');
    });
  }

  updateSession(id: Number, assessmentId: Number, name: String, displayName: string, loadDataFromFile: any[], loadTimeSeriesDayType: any[],
                loadValueColumnCount: any[], columnMainArray: any[], sumArray: any[], binList: any[], displayBinList: any[],
                selectedBinList: any[], days: any[], selectedDates: Set<any>, graphDayAverage: any, graphBinAverage: any,
                showBinMode: boolean, toggleRelayoutDay: boolean, annotationListDayAverage: any[], annotationListBinAverage: any[],
                globalYAverageDay: any[], globalYAverageBin: any[], dayTypeMode: boolean, assessment: Assessment) {
    const selectedDatesValue = [];
    selectedDates.forEach((value) => {
      selectedDatesValue.push(value);
    });
    const saveSessionData: DayType = {
      id: id,
      assessmentId: assessmentId,
      name: name,
      displayName: displayName,
      loadDataFromFile: loadDataFromFile,
      loadTimeSeriesDayType: loadTimeSeriesDayType,
      loadValueColumnCount: loadValueColumnCount,
      loadColumnMainArray: columnMainArray,
      loadSumArray: sumArray,
      loadBinList: binList,
      loadDisplayBinList: displayBinList,
      loadSelectedBinList: selectedBinList,
      loadDays: days,
      loadSelectedDates: selectedDatesValue,
      loadGraphDayAverage: graphDayAverage,
      loadGraphBinAverage: graphBinAverage,
      loadShowBinMode: showBinMode,
      loadToggleRelayoutDay: toggleRelayoutDay,
      loadAnnotationListDayAverage: annotationListDayAverage,
      loadAnnotationListBinAverage: annotationListBinAverage,
      loadGlobalYAverageDay: globalYAverageDay,
      loadGlobalYAverageBin: globalYAverageBin,
      dayTypeMode: dayTypeMode
    };
    console.log(saveSessionData);
    this.indexFileStore.updateDayTypeStore(saveSessionData, assessment).then(() => {
       alert('Day Type Updated');
    });
  }

  createAssessment(id: number, name: string, csv: any[], metaDataId: number, metaData: FileMetaData,
                   graphId: number, dayTypeId: number, assessmentMode: boolean) {
    return new Promise(resolve => {
      const csvList = [];
      for (let i = 0; i < csv.length; i++) {
        csvList.push(csv[i]);
      }
      const assessmentItem: Assessment = {
        id: id,
        name: name,
        csv: csvList,
        metaDataId: metaDataId,
        metaData: metaData,
        graphId: graphId,
        graph: undefined,
        dayTypeId: dayTypeId,
        dayType: undefined,
        reportGraph: undefined,
        reportDayType: undefined,
        assessmentMode: assessmentMode
      };
      this.indexFileStore.insertIntoMetaStore(metaData).then(() => {
        this.indexFileStore.insertIntoAssessmentStore(assessmentItem).then(() => {
          resolve();
        });
      });
    });
  }

  generateDayTypeReport(assessmentId: Number, name: String, displayName: string, loadDataFromFile: any[],
                        loadTimeSeriesDayType: any[], loadValueColumnCount: any[], columnMainArray: any[], sumArray: any[],
                        binList: any[], displayBinList: any[], selectedBinList: any[], days: any[], selectedDates: Set<any>,
                        graphDayAverage: any, graphBinAverage: any, showBinMode: boolean, toggleRelayoutDay: boolean,
                        annotationListDayAverage: any[], annotationListBinAverage: any[], globalYAverageDay: any[],
                        globalYAverageBin: any[], dayTypeMode: boolean, assessment: Assessment) {
    return new Promise(resolve => {
      const id = this.data.getRandomInt(999999);
      const selectedDatesValue = [];
      selectedDates.forEach((value) => {
        selectedDatesValue.push(value);
      });
      const saveSessionData: DayType = {
        id: id,
        assessmentId: assessmentId,
        name: name,
        displayName: displayName,
        loadDataFromFile: loadDataFromFile,
        loadTimeSeriesDayType: loadTimeSeriesDayType,
        loadValueColumnCount: loadValueColumnCount,
        loadColumnMainArray: columnMainArray,
        loadSumArray: sumArray,
        loadBinList: binList,
        loadDisplayBinList: displayBinList,
        loadSelectedBinList: selectedBinList,
        loadDays: days,
        loadSelectedDates: selectedDatesValue,
        loadGraphDayAverage: graphDayAverage,
        loadGraphBinAverage: graphBinAverage,
        loadShowBinMode: showBinMode,
        loadToggleRelayoutDay: toggleRelayoutDay,
        loadAnnotationListDayAverage: annotationListDayAverage,
        loadAnnotationListBinAverage: annotationListBinAverage,
        loadGlobalYAverageDay: globalYAverageDay,
        loadGlobalYAverageBin: globalYAverageBin,
        dayTypeMode: dayTypeMode
      };
      this.indexFileStore.viewSelectedDayTypeReport(assessmentId).then(() => {
        this.data.currentDayTypeItemArray.subscribe(dayTypeArray => {
          this.indexFileStore.insertIntoDayTypeReportStore(saveSessionData, assessment, dayTypeArray).then(() => {
            alert('Report Generated');
            resolve();
          });
        });
      });
    });
  }
}
