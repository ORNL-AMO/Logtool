import {Injectable} from '@angular/core';
import {NgxIndexedDB} from 'ngx-indexed-db';
import {DataService} from './data.service';
import {LoadList} from '../types/load-list';

@Injectable({
  providedIn: 'root'
})
export class IndexFileStoreService {

  constructor(private data: DataService) {
  }

  operationDB() {
    const db = new NgxIndexedDB('LOGGER', 1);
    db.openDatabase(1, evt => {
      const transaction = evt.currentTarget.result;
      const objectStore = transaction.createObjectStore('fileInput', {keyPath: 'id', autoIncrement: true});
      objectStore.createIndex('name', 'name', {unique: true});
      objectStore.createIndex('content', 'content', {unique: false});
      objectStore.createIndex('dataArrayColumns', 'dataArrayColumns', {unique: false});
      objectStore.createIndex('headerDetails', 'headerDetails', {unique: false});
      objectStore.createIndex('selectedHeader', 'selectedHeader', {unique: false});
      objectStore.createIndex('header', 'header', {unique: false});
      objectStore.createIndex('startDate', 'startDate', {unique: false});
      objectStore.createIndex('endDate', 'endDate', {unique: false});
      objectStore.createIndex('interval', 'interval', {unique: false});
      objectStore.createIndex('countOfRow', 'countOfRow', {unique: false});
      objectStore.createIndex('countOfColumn', 'countOfColumn', {unique: false});
      objectStore.createIndex('fileType', 'fileType', {unique: false});
      const transactionSaveInput = evt.currentTarget.result;
      const objectStoreLoad = transactionSaveInput.createObjectStore('saveInput', {keyPath: 'id', unique: true});
      objectStoreLoad.createIndex('id', 'id', {unique: true});
      objectStoreLoad.createIndex('name', 'name', {unique: false});
      objectStoreLoad.createIndex('displayName', 'displayName', {unique: true});
      objectStoreLoad.createIndex('loadDataFromFile', 'loadDataFromFile', {unique: false});
      objectStoreLoad.createIndex('loadTimeSeriesDayType', 'loadTimeSeriesDayType', {unique: false});
      objectStoreLoad.createIndex('loadValueColumnCount', 'loadValueColumnCount', {unique: false});
      objectStoreLoad.createIndex('loadColumnMainArray', 'loadColumnMainArray', {unique: false});
      objectStoreLoad.createIndex('loadSumArray', 'loadSumArray', {unique: false});
      objectStoreLoad.createIndex('loadBinList', 'loadBinList', {unique: false});
      objectStoreLoad.createIndex('loadDisplayBinList', 'loadDisplayBinList', {unique: false});
      objectStoreLoad.createIndex('loadSelectedBinList', 'loadSelectedBinList', {unique: false});
      objectStoreLoad.createIndex('loadDays', 'loadDays', {unique: false});
      objectStoreLoad.createIndex('displayBinList', 'displayBinList', {unique: false});
      objectStoreLoad.createIndex('days', 'days', {unique: false});
      objectStoreLoad.createIndex('loadSelectedDates', 'loadSelectedDates', {unique: false});
      objectStoreLoad.createIndex('loadGraphDayAverage', 'loadGraphDayAverage', {unique: false});
      objectStoreLoad.createIndex('loadGraphBinAverage', 'loadGraphBinAverage', {unique: false});
      objectStoreLoad.createIndex('loadMac', 'loadMac', {unique: false});
      objectStoreLoad.createIndex('loadShowBinMode', 'loadShowBinMode', {unique: false});
      objectStoreLoad.createIndex('loadToggleRelayoutDay', 'loadToggleRelayoutDay', {unique: false});
      objectStoreLoad.createIndex('loadAnnotationListDayAverage', 'loadAnnotationListDayAverage', {unique: false});
      objectStoreLoad.createIndex('loadAnnotationListBinAverage', 'loadAnnotationListBinAverage', {unique: false});
      objectStoreLoad.createIndex('loadGlobalYAverageDay', 'loadGlobalYAverageDay', {unique: false});
      objectStoreLoad.createIndex('loadGlobalYAverageBin', 'loadGlobalYAverageBin', {unique: false});
      objectStoreLoad.createIndex('saveLoadMode', 'saveLoadMode', {unique: false});
    }).then(() => {
      },
      error => {
        console.log(error);
      });
  }

  addIntoDB(name, content, dataArrayColumns, headerDetails,
            selectedHeader, header, startDate, endDate, interval, countOfRow, countOfColumn, fileType) {
    const db = new NgxIndexedDB('LOGGER', 1);
    db.openDatabase(1, evt => {
    }).then(() => {
      db.add('fileInput',
        {
          name: name,
          content: content,
          dataArrayColumns: dataArrayColumns,
          headerDetails: headerDetails,
          selectedHeader: selectedHeader,
          header: header,
          startDate: startDate,
          endDate: endDate,
          interval: interval,
          countOfRow: countOfRow,
          countOfColumn: countOfColumn,
          fileType: fileType
        }).then(() => {
        },
        error => {
          alert('File already Imported');
          console.log(error);
        });
    }, error => {
      console.log(error);
    });
  }

  addIntoDBSaveInput(loadSessionData: LoadList) {
    const db = new NgxIndexedDB('LOGGER', 1);
    db.openDatabase(1, evt => {
    }).then(() => {
      db.add('saveInput',
        {
          id: loadSessionData.id,
          name: loadSessionData.name,
          displayName: loadSessionData.displayName,
          loadDataFromFile: loadSessionData.loadDataFromFile,
          loadTimeSeriesDayType: loadSessionData.loadTimeSeriesDayType,
          loadValueColumnCount: loadSessionData.loadValueColumnCount,
          loadColumnMainArray: loadSessionData.loadColumnMainArray,
          loadSumArray: loadSessionData.loadSumArray,
          loadBinList: loadSessionData.loadBinList,
          loadDisplayBinList: loadSessionData.loadDisplayBinList,
          loadSelectedBinList: loadSessionData.loadSelectedBinList,
          loadDays: loadSessionData.loadDays,
          loadSelectedDates: loadSessionData.loadSelectedDates,
          loadGraphDayAverage: loadSessionData.loadGraphDayAverage,
          loadGraphBinAverage: loadSessionData.loadGraphBinAverage,
          loadMac: loadSessionData.loadMac,
          loadShowBinMode: loadSessionData.loadShowBinMode,
          loadToggleRelayoutDay: loadSessionData.loadToggleRelayoutDay,
          loadAnnotationListDayAverage: loadSessionData.loadAnnotationListDayAverage,
          loadAnnotationListBinAverage: loadSessionData.loadAnnotationListBinAverage,
          loadGlobalYAverageDay: loadSessionData.loadGlobalYAverageDay,
          loadGlobalYAverageBin: loadSessionData.loadGlobalYAverageBin,
          saveLoadMode: loadSessionData.saveLoadMode
        }).then(() => {
        },
        error => {
          alert('File already Imported');
        });
    }, error => {
      console.log(error);
    });
  }

  viewDataDB() {
    return new Promise(resolve => {
      const db = new NgxIndexedDB('LOGGER', 1);
      db.openDatabase(1, evt => {
      }).then(() => {
          db.getAll('fileInput').then(fileInput => {
            resolve(fileInput);
            this.data.changeInputArray(fileInput);
          });
        },
        error => {
          console.log(error);
        });
    });
  }

  viewDataDBSaveInput() {
    return new Promise(resolve => {
      const db = new NgxIndexedDB('LOGGER', 1);
      db.openDatabase(1, evt => {
      }).then(() => {
          db.getAll('saveInput').then(saveInput => {
            resolve(saveInput);
            this.data.changeInputSaveLoadArray(saveInput);
          });
        },
        error => {
          console.log(error);
        });
    });
  }

  viewDataDBSaveInputId() {
    const id = [];
    return new Promise(resolve => {
      const db = new NgxIndexedDB('LOGGER', 1);
      db.openDatabase(1, evt => {
      }).then(() => {
          db.getAll('saveInput').then(saveInput => {
            for (let i = 0; i < saveInput.length; i++) {
              id.push(saveInput[i].id);
            }
            resolve(id);
            this.data.changeInputSaveLoadIdArray(id);
          });
        },
        error => {
          console.log(error);
        });
    });
  }

  viewSingleDataDBSaveInput(id) {
    return new Promise(resolve => {
      const db = new NgxIndexedDB('LOGGER', 1);
      db.openDatabase(1, evt => {
      }).then(() => {
          db.getByIndex('saveInput', 'id', id).then(saveInput => {
            resolve(saveInput);
            this.data.changeSingleInputSaveLoad(saveInput);
          });
        },
        error => {
          console.log(error);
        });
    });
  }

  deleteFromDB(index) {
    return new Promise(resolve => {
      const db = new NgxIndexedDB('LOGGER', 1);
      db.openDatabase(1, evt => {
      }).then(() => {
        db.delete('fileInput', index).then(() => {
            console.log('Deleted');
          },
          error => {
            console.log(error);
          });
      });
    });
  }

  deleteFromDBSaveLoad(id) {
    return new Promise(resolve => {
      const db = new NgxIndexedDB('LOGGER', 1);
      db.openDatabase(1, evt => {
      }).then(() => {
        db.delete('saveInput', id).then(() => {
            console.log('Deleted');
          },
          error => {
            console.log(error);
          });
      });
    });
  }
}
