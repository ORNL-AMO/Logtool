import {Injectable} from '@angular/core';
import {IndexFileStoreService} from './index-file-store.service';
import {LoadList} from '../types/load-list';
import {DataService} from './data.service';

@Injectable({
  providedIn: 'root'
})
export class SaveLoadService {

  constructor(private indexFileStore: IndexFileStoreService, private data: DataService) {
  }

  saveSession(fileInputId: Number, name: String, displayName: string, loadDataFromFile: any[], loadTimeSeriesDayType: any[], loadValueColumnCount: any[],
              columnMainArray: any[], sumArray: any[], binList: any[], displayBinList: any[], selectedBinList: any[], days: any[],
              selectedDates: Set<any>, graphDayAverage: any, graphBinAverage: any, showBinMode: boolean, mac: boolean,
              toggleRelayoutDay: boolean, annotationListDayAverage: any[], annotationListBinAverage: any[],
              globalYAverageDay: any[], globalYAverageBin: any[], saveLoadMode: boolean) {
    const id = this.data.getRandomInt(9999999);
    const selectedDatesValue = [];
    selectedDates.forEach((value) => {
      selectedDatesValue.push(value);
    });
    const saveSessionData: LoadList = {
      id: id,
      fileInputId: fileInputId,
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
      loadMac: mac,
      loadShowBinMode: showBinMode,
      loadToggleRelayoutDay: toggleRelayoutDay,
      loadAnnotationListDayAverage: annotationListDayAverage,
      loadAnnotationListBinAverage: annotationListBinAverage,
      loadGlobalYAverageDay: globalYAverageDay,
      loadGlobalYAverageBin: globalYAverageBin,
      saveLoadMode: saveLoadMode
    };
    this.indexFileStore.addIntoDBSaveInput(saveSessionData);
  }

  updateSession(id: Number, fileInputId: Number, name: String, displayName: string, loadDataFromFile: any[], loadTimeSeriesDayType: any[],
                loadValueColumnCount: any[], columnMainArray: any[], sumArray: any[], binList: any[], displayBinList: any[],
                selectedBinList: any[], days: any[], selectedDates: Set<any>, graphDayAverage: any, graphBinAverage: any,
                showBinMode: boolean, mac: boolean, toggleRelayoutDay: boolean, annotationListDayAverage: any[],
                annotationListBinAverage: any[], globalYAverageDay: any[], globalYAverageBin: any[], saveLoadMode: boolean) {
    const selectedDatesValue = [];
    selectedDates.forEach((value) => {
      selectedDatesValue.push(value);
    });
    const saveSessionData: LoadList = {
      id: id,
      fileInputId: fileInputId,
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
      loadMac: mac,
      loadShowBinMode: showBinMode,
      loadToggleRelayoutDay: toggleRelayoutDay,
      loadAnnotationListDayAverage: annotationListDayAverage,
      loadAnnotationListBinAverage: annotationListBinAverage,
      loadGlobalYAverageDay: globalYAverageDay,
      loadGlobalYAverageBin: globalYAverageBin,
      saveLoadMode: saveLoadMode
    };
    this.indexFileStore.updateIntoDBSaveInput(saveSessionData);
  }
}
