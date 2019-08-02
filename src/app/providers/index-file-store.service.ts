import {Injectable} from '@angular/core';
import {NgxIndexedDB} from 'ngx-indexed-db';
import {DataService} from './data.service';
import {LoadList} from '../types/load-list';
import {FileMetaData} from '../types/file-meta-data';
import {DataList} from '../types/data-list';
import {VisualizeLoadGraph} from '../types/visualize-load-graph';

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
      const objectStore = transaction.createObjectStore('fileInput', {keyPath: 'id', unique: true});
      objectStore.createIndex('id', 'id', {unique: true});
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
      objectStore.createIndex('dateUpload', 'dateUpload', {unique: false});
      const objectTemp = transaction.createObjectStore('fileInputTemp', {keyPath: 'id', unique: true});
      objectTemp.createIndex('id', 'id', {unique: true});
      objectTemp.createIndex('name', 'name', {unique: true});
      objectTemp.createIndex('content', 'content', {unique: false});
      objectTemp.createIndex('dataArrayColumns', 'dataArrayColumns', {unique: false});
      objectTemp.createIndex('headerDetails', 'headerDetails', {unique: false});
      objectTemp.createIndex('selectedHeader', 'selectedHeader', {unique: false});
      objectTemp.createIndex('header', 'header', {unique: false});
      objectTemp.createIndex('startDate', 'startDate', {unique: false});
      objectTemp.createIndex('endDate', 'endDate', {unique: false});
      objectTemp.createIndex('interval', 'interval', {unique: false});
      objectTemp.createIndex('countOfRow', 'countOfRow', {unique: false});
      objectTemp.createIndex('countOfColumn', 'countOfColumn', {unique: false});
      objectTemp.createIndex('fileType', 'fileType', {unique: false});
      objectTemp.createIndex('dateUpload', 'dateUpload', {unique: false});
      const objectStoreLoad = transaction.createObjectStore('dayType', {keyPath: 'id', unique: true});
      objectStoreLoad.createIndex('id', 'id', {unique: true});
      objectStoreLoad.createIndex('fileInputId', 'fileInputId', {unique: false});
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
      const objectStoreFile = transaction.createObjectStore('fileMetaData', {keyPath: 'id', unique: true});
      objectStoreFile.createIndex('id', 'id', {unique: true});
      objectStoreFile.createIndex('fileInputId', 'fileInputId', {unique: false});
      objectStoreFile.createIndex('companyName', 'companyName', {unique: false});
      objectStoreFile.createIndex('facilityName', 'facilityName', {unique: false});
      objectStoreFile.createIndex('facilityContactName', 'facilityContactName', {unique: false});
      objectStoreFile.createIndex('assessmentContactName', 'assessmentContactName', {unique: false});
      objectStoreFile.createIndex('address', 'address', {unique: false});
      objectStoreFile.createIndex('facilityContact', 'facilityContact', {unique: false});
      objectStoreFile.createIndex('assessmentContact', 'assessmentContact', {unique: false});
      objectStoreFile.createIndex('facilityEmail', 'facilityEmail', {unique: false});
      objectStoreFile.createIndex('assessmentEmail', 'assessmentEmail', {unique: false});
      const objectStoreVisualize = transaction.createObjectStore('visualizeGraphStore', {keyPath: 'id', unique: true});
      objectStoreVisualize.createIndex('id', 'id', {unique: true});
      objectStoreVisualize.createIndex('displayName', 'displayName', {unique: false});
      objectStoreVisualize.createIndex('graph', 'graph', {unique: false});
      objectStoreVisualize.createIndex('visualizeMode', 'visualizeMode', {unique: false});
    }).then(() => {
      },
      error => {
        console.log(error);
      });
  }

  addIntoDBFileInput(dataList: DataList) {
    const db = new NgxIndexedDB('LOGGER', 1);
    db.openDatabase(1, evt => {
    }).then(() => {
      db.add('fileInput',
        {
          id: dataList.id,
          name: dataList.name,
          content: dataList.content,
          dataArrayColumns: dataList.dataArrayColumns,
          headerDetails: dataList.headerDetails,
          selectedHeader: dataList.selectedHeader,
          header: dataList.header,
          startDate: dataList.startDate,
          endDate: dataList.endDate,
          interval: dataList.interval,
          countOfRow: dataList.countOfRow,
          countOfColumn: dataList.countOfColumn,
          fileType: dataList.fileType,
          dateUpload: dataList.dateUpload
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

  addIntoDBFileInputTemp(dataList: DataList) {
    const db = new NgxIndexedDB('LOGGER', 1);
    db.openDatabase(1, evt => {
    }).then(() => {
      db.add('fileInputTemp',
        {
          id: dataList.id,
          name: dataList.name,
          content: dataList.content,
          dataArrayColumns: dataList.dataArrayColumns,
          headerDetails: dataList.headerDetails,
          selectedHeader: dataList.selectedHeader,
          header: dataList.header,
          startDate: dataList.startDate,
          endDate: dataList.endDate,
          interval: dataList.interval,
          countOfRow: dataList.countOfRow,
          countOfColumn: dataList.countOfColumn,
          fileType: dataList.fileType,
          dateUpload: dataList.dateUpload
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

  addIntoDBFileMetaData(fileMetaData: FileMetaData) {
    const db = new NgxIndexedDB('LOGGER', 1);
    db.openDatabase(1, evt => {
    }).then(() => {
      db.add('fileMetaData',
        {
          id: fileMetaData.id,
          fileInputId: fileMetaData.fileInputId,
          companyName: fileMetaData.companyName,
          facilityName: fileMetaData.facilityName,
          facilityContactName: fileMetaData.facilityContactName,
          assessmentContactName: fileMetaData.assessmentContactName,
          address: fileMetaData.address,
          facilityContact: fileMetaData.facilityContact,
          assessmentContact: fileMetaData.assessmentContact,
          facilityEmail: fileMetaData.facilityEmail,
          assessmentEmail: fileMetaData.assessmentEmail
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
      db.add('dayType',
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

  addIntoDBGraph(graph: VisualizeLoadGraph) {
    const db = new NgxIndexedDB('LOGGER', 1);
    db.openDatabase(1, evt => {
    }).then(() => {
      db.add('visualizeGraphStore',
        {
          id: graph.id,
          displayName: graph.displayName,
          graph: graph.graph,
          visualizeMode: graph.visualizeMode
        }).then(() => {
        },
        error => {
          alert('File already Imported');
        });
    }, error => {
      console.log(error);
    });
  }


  addIntoDBFileMetaDataFromFile(fileMetaData: FileMetaData) {
    const db = new NgxIndexedDB('LOGGER', 1);
    db.openDatabase(1, evt => {
    }).then(() => {
      db.add('fileMetaData',
        {
          id: fileMetaData.id,
          fileInputId: fileMetaData.fileInputId,
          companyName: fileMetaData.companyName,
          facilityName: fileMetaData.facilityName,
          facilityContactName: fileMetaData.facilityContactName,
          assessmentContactName: fileMetaData.assessmentContactName,
          address: fileMetaData.address,
          facilityContact: fileMetaData.facilityContact,
          assessmentContact: fileMetaData.assessmentContact,
          facilityEmail: fileMetaData.facilityEmail,
          assessmentEmail: fileMetaData.assessmentEmail
        }).then(() => {
        },
        error => {
          alert('File already Imported');
        });
    }, error => {
      console.log(error);
    });
  }

  addIntoDBSaveInputFromFile(loadSessionData: LoadList) {
    const db = new NgxIndexedDB('LOGGER', 1);
    db.openDatabase(1, evt => {
    }).then(() => {
      for (let i = 0; i < loadSessionData.loadTimeSeriesDayType.length; i++) {
        loadSessionData.loadTimeSeriesDayType[i] = new Date(loadSessionData.loadTimeSeriesDayType[i]);
      }
      for (let i = 0; i < loadSessionData.loadColumnMainArray.length; i++) {
        for (let j = 0; j < loadSessionData.loadColumnMainArray[i].length; j++) {
          for (let k = 0; k < loadSessionData.loadColumnMainArray[i][j].length; k++) {
            loadSessionData.loadColumnMainArray[i][j][k].displayDate = new Date(loadSessionData.loadColumnMainArray[i][j][k].displayDate);
          }
        }
      }
      for (let i = 0; i < loadSessionData.loadDays.length; i++) {
        loadSessionData.loadDays[i].date = new Date(loadSessionData.loadDays[i].date);
      }
      for (let i = 0; i < loadSessionData.loadSelectedBinList.length; i++) {
        for (let j = 0; j < loadSessionData.loadSelectedBinList[i].length; j++) {
          console.log(loadSessionData.loadSelectedBinList[i][j].date);
          loadSessionData.loadSelectedBinList[i][j].date = new Date(loadSessionData.loadSelectedBinList[i][j].date);
        }
      }
      db.add('dayType',
        {
          id: loadSessionData.id,
          fileInputId: loadSessionData.fileInputId,
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

  updateIntoDBFileMetaData(fileMetaData: FileMetaData) {
    const db = new NgxIndexedDB('LOGGER', 1);
    db.openDatabase(1, evt => {
    }).then(() => {
      db.update('fileMetaData',
        {
          id: fileMetaData.id,
          companyName: fileMetaData.companyName,
          facilityName: fileMetaData.facilityName,
          facilityContactName: fileMetaData.facilityContactName,
          assessmentContactName: fileMetaData.assessmentContactName,
          address: fileMetaData.address,
          facilityContact: fileMetaData.facilityContact,
          assessmentContact: fileMetaData.assessmentContact,
          facilityEmail: fileMetaData.facilityEmail,
          assessmentEmail: fileMetaData.assessmentEmail
        }).then(() => {
        },
        error => {
          alert('File already Imported');
        });
    }, error => {
      console.log(error);
    });
  }

  updateIntoDBSaveInput(loadSessionData: LoadList) {
    const db = new NgxIndexedDB('LOGGER', 1);
    db.openDatabase(1, evt => {
    }).then(() => {
      db.update('dayType',
        {
          id: loadSessionData.id,
          fileInputId: loadSessionData.fileInputId,
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

  viewDataDBGraph() {
    return new Promise(resolve => {
      const db = new NgxIndexedDB('LOGGER', 1);
      db.openDatabase(1, evt => {
      }).then(() => {
          db.getAll('visualizeGraphStore').then(fileInput => {
            resolve(fileInput);
            this.data.changeInputGraphArray(fileInput);
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
          db.getAll('dayType').then(saveInput => {
            resolve(saveInput);
            this.data.changeInputSaveLoadArray(saveInput);
          });
        },
        error => {
          console.log(error);
        });
    });
  }

  viewDataDB() {
    return new Promise(resolve => {
      const db = new NgxIndexedDB('LOGGER', 1);
      db.openDatabase(1, evt => {
      }).then(() => {
          db.getAll('fileInput').then(saveInput => {
            resolve(saveInput);
            this.data.changeInputArray(saveInput);
          });
        },
        error => {
          console.log(error);
        });
    });
  }

  viewDataDBTemp() {
    return new Promise(resolve => {
      const db = new NgxIndexedDB('LOGGER', 1);
      db.openDatabase(1, evt => {
      }).then(() => {
          db.getAll('fileInputTemp').then(saveInput => {
            resolve(saveInput);
            this.data.changeInputArray(saveInput);
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
          db.getAll('dayType').then(saveInput => {
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
          db.getByIndex('dayType', 'id', id).then(saveInput => {
            resolve(saveInput);
            this.data.changeSingleInputSaveLoad(saveInput);
          });
        },
        error => {
          console.log(error);
        });
    });
  }

  viewSingleDataDBGraph(id) {
    return new Promise(resolve => {
      const db = new NgxIndexedDB('LOGGER', 1);
      db.openDatabase(1, evt => {
      }).then(() => {
          db.getByIndex('visualizeGraphStore', 'id', id).then(saveInput => {
            resolve(saveInput);
            this.data.changeSingleInputGraph(saveInput);
          });
        },
        error => {
          console.log(error);
        });
    });
  }

  viewSingleDataDBMetaData(id) {
    return new Promise(resolve => {
      const db = new NgxIndexedDB('LOGGER', 1);
      db.openDatabase(1, evt => {
      }).then(() => {
          db.getByIndex('fileMetaData', 'id', id).then(metaData => {
            resolve(metaData);
            this.data.changeSingleInputMetaData(metaData);
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

  deleteFromDBTemp(index) {
    return new Promise(resolve => {
      const db = new NgxIndexedDB('LOGGER', 1);
      db.openDatabase(1, evt => {
      }).then(() => {
        db.delete('fileInputTemp', index).then(() => {
            console.log('Deleted');
          },
          error => {
            console.log(error);
          });
      });
    });
  }

  clearFromDBTemp() {
    return new Promise(resolve => {
      const db = new NgxIndexedDB('LOGGER', 1);
      db.openDatabase(1, evt => {
      }).then(() => {
        db.clear('fileInputTemp').then(() => {
            console.log('Deleted');
          },
          error => {
            console.log(error);
          });
      });
    });
  }

  deleteFromDBFileMetaData(index) {
    return new Promise(resolve => {
      const db = new NgxIndexedDB('LOGGER', 1);
      db.openDatabase(1, evt => {
      }).then(() => {
        db.delete('fileMetaData', index).then(() => {
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
        db.delete('dayType', id).then(() => {
            console.log('Deleted');
          },
          error => {
            console.log(error);
          });
      });
    });
  }
}
