import {Injectable} from '@angular/core';
import {IndexFileStoreService} from './index-file-store.service';
import {log} from 'util';
import {LoadList} from '../types/load-list';

@Injectable({
  providedIn: 'root'
})
export class SaveLoadService {

  constructor(private indexFileStore: IndexFileStoreService) {
  }

  saveSession(name: String, displayName: string, loadDataFromFile: any[], loadTimeSeriesDayType: any[], loadValueColumnCount: any[],
              columnMainArray: any[], sumArray: any[], binList: any[], displayBinList: any[], selectedBinList: any[], days: any[],
              selectedDates: Set<any>, graphDayAverage: any, graphBinAverage: any, showBinMode: boolean, mac: boolean,
              toggleRelayoutDay: boolean, annotationListDayAverage: any[], annotationListBinAverage: any[],
              globalYAverageDay: any[], globalYAverageBin: any[], saveLoadMode: boolean) {
    const id = this.getRandomInt(9999999);
    const selectedDatesValue = [];
    selectedDates.forEach((value) => {
      selectedDatesValue.push(value.id);
    });
    const saveSessionData: LoadList = {
      id: id,
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
    console.log(saveSessionData);
    this.indexFileStore.addIntoDBSaveInput(saveSessionData);
  }

  getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
  }
}
