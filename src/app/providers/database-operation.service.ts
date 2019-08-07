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

  saveSession(assessmentId: Number, name: String, displayName: string, loadDataFromFile: any[], loadTimeSeriesDayType: any[],
              loadValueColumnCount: any[], columnMainArray: any[], sumArray: any[], binList: any[], displayBinList: any[],
              selectedBinList: any[], days: any[], selectedDates: Set<any>, graphDayAverage: any, graphBinAverage: any,
              showBinMode: boolean, toggleRelayoutDay: boolean, annotationListDayAverage: any[],
              annotationListBinAverage: any[], globalYAverageDay: any[], globalYAverageBin: any[], dayTypeMode: boolean) {
    const id = this.data.getRandomInt(9999999);
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
    this.indexFileStore.insertIntoDayTypeStore(saveSessionData);
  }

  updateSession(id: Number, assessmentId: Number, name: String, displayName: string, loadDataFromFile: any[], loadTimeSeriesDayType: any[],
                loadValueColumnCount: any[], columnMainArray: any[], sumArray: any[], binList: any[], displayBinList: any[],
                selectedBinList: any[], days: any[], selectedDates: Set<any>, graphDayAverage: any, graphBinAverage: any,
                showBinMode: boolean, toggleRelayoutDay: boolean, annotationListDayAverage: any[],
                annotationListBinAverage: any[], globalYAverageDay: any[], globalYAverageBin: any[], dayTypeMode: boolean) {
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
    this.indexFileStore.updateDayTypeStore(saveSessionData);
  }

  createAssessment(id: number, name: string, csvId: number[], metaDataId: number, metaData: FileMetaData,
                   graphId: number, dayTypeId: number, assessmentMode: boolean) {
    const csvList = [];
    for (let i = 0; i < csvId.length; i++) {
      this.indexFileStore.viewSelectedCSVStore(csvId[i]).then(csv => {
        console.log(csvId[i]);
        csvList.push(csv);
      });
    }
    console.log('csvId', csvList);
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
    this.indexFileStore.insertIntoMetaStore(metaData);
    this.indexFileStore.insertIntoAssessmentStore(assessmentItem);
  }
}
