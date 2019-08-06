import {Injectable} from '@angular/core';
import {NgxIndexedDB} from 'ngx-indexed-db';
import {Assessment} from '../types/assessment';
import {FileMetaData} from '../types/file-meta-data';
import {CSVFileInput} from '../types/csvfile-input';
import {Graph} from '../types/graph';
import {DayType} from '../types/day-type';
import {DataService} from './data.service';

@Injectable({
  providedIn: 'root'
})
export class IndexDataBaseStoreService {

  constructor(private data: DataService) {
  }

  operationDB() {
    this.createAssessmentStore();
    this.createCSVStore();
    this.createMetaStore();
    this.createGraphStore();
    this.createDayTypeStore();
    this.createGraphReportStore();
    this.createDayTypeReportStore();
  }

  createAssessmentStore() {
    const db = new NgxIndexedDB('LOGGER', 1);
    db.openDatabase(1, evt => {
      const transaction = evt.currentTarget.result;
      const objectStore = transaction.createObjectStore('assessment', {keyPath: 'id', unique: true});
      objectStore.createIndex('id', 'id', {unique: true});
      objectStore.createIndex('name', 'name', {unique: true});
      objectStore.createIndex('csv', 'csv', {unique: false});
      objectStore.createIndex('metaDataId', 'metaDataId', {unique: true});
      objectStore.createIndex('metaData', 'metaData', {unique: false});
      objectStore.createIndex('graphId', 'graphId', {unique: true});
      objectStore.createIndex('graph', 'graph', {unique: false});
      objectStore.createIndex('dayTypeId', 'dayTypeId', {unique: true});
      objectStore.createIndex('dayType', 'dayType', {unique: false});
      objectStore.createIndex('reportGraph', 'reportGraph', {unique: false});
      objectStore.createIndex('reportDayType', 'reportDayType', {unique: false});
      objectStore.createIndex('assessmentMode', 'assessmentMode', {unique: false});
    }).then(() => {
      },
      error => {
        console.log(error);
      });
  }

  insertIntoAssessmentStore(assessment: Assessment) {
    const db = new NgxIndexedDB('LOGGER', 1);
    db.openDatabase(1, evt => {
    }).then(() => {
      db.add('assessment',
        {
          id: assessment.id,
          name: assessment.name,
          csv: assessment.csv,
          metaDataId: assessment.metaDataId,
          metadata: assessment.metaData,
          graphId: assessment.graphId,
          graph: assessment.graph,
          dayTypeId: assessment.dayTypeId,
          dayType: assessment.dayType,
          reportGraph: assessment.reportGraph,
          reportDayType: assessment.reportDayType,
          assessmentMode: assessment.assessmentMode
        }).then(() => {
        },
        error => {
          alert('Assessment Inserted');
          console.log(error);
        });
    }, error => {
      console.log(error);
    });
  }

  deleteFromAssessmentStore(id) {
    return new Promise(resolve => {
      const db = new NgxIndexedDB('LOGGER', 1);
      db.openDatabase(1, evt => {
      }).then(() => {
        db.delete('assessment', id).then(() => {
            console.log('Deleted');
            // Call Meta Data
            // Call Graph
            // Call Day Type
            // Call Report Graph
            // Call Report DayType
          },
          error => {
            console.log(error);
          });
      });
    });
  }

  viewFromAssessmentStore() {
    return new Promise(resolve => {
      const db = new NgxIndexedDB('LOGGER', 1);
      db.openDatabase(1, evt => {
      }).then(() => {
          db.getAll('assessment').then(assessment => {
            resolve(assessment);
          });
        },
        error => {
          console.log(error);
        });
    });
  }

  viewSelectedAssessmentStore(id) {
    return new Promise(resolve => {
      const db = new NgxIndexedDB('LOGGER', 1);
      db.openDatabase(1, evt => {
      }).then(() => {
          db.getByIndex('assessment', 'id', id).then(assessment => {
            resolve(assessment);
          });
        },
        error => {
          console.log(error);
        });
    });
  }

  createQuickSaveStore() {
    const db = new NgxIndexedDB('LOGGER', 1);
    db.openDatabase(1, evt => {
      const transaction = evt.currentTarget.result;
      const objectStore = transaction.createObjectStore('quickSave', {keyPath: 'id', unique: true});
      objectStore.createIndex('id', 'id', {unique: true});
      objectStore.createIndex('storeName', 'storeName', {unique: false});
    }).then(() => {
      },
      error => {
        console.log(error);
      });
  }

  viewFromQuickSaveStore() {
    return new Promise(resolve => {
      const db = new NgxIndexedDB('LOGGER', 1);
      db.openDatabase(1, evt => {
      }).then(() => {
          db.getAll('quickSave').then(quickSave => {
            resolve(quickSave);
          });
        },
        error => {
          console.log(error);
        });
    });
  }

  insertIntoQuickSaveStore(assessment: Assessment) {
    const db = new NgxIndexedDB('LOGGER', 1);
    db.openDatabase(1, evt => {
    }).then(() => {
      db.add('quickSave',
        {
          id: assessment.id,
          name: assessment.name,
        }).then(() => {
        },
        error => {
          alert('Assessment Inserted');
          console.log(error);
        });
    }, error => {
      console.log(error);
    });
  }

  clearQuickSaveStore() {
    return new Promise(resolve => {
      const db = new NgxIndexedDB('LOGGER', 1);
      db.openDatabase(1, evt => {
      }).then(() => {
        db.clear('quickSave').then(() => {
            console.log('Deleted');
          },
          error => {
            console.log(error);
          });
      });
    });
  }


  createCSVStore() {
    const db = new NgxIndexedDB('LOGGER', 1);
    db.openDatabase(1, evt => {
      const transaction = evt.currentTarget.result;
      const objectStore = transaction.createObjectStore('csv', {keyPath: 'id', unique: true});
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
    }).then(() => {

    }, error => {
      console.log(error);
    });
  }

  insertIntoCSVStore(csv: CSVFileInput) {
    const db = new NgxIndexedDB('LOGGER', 1);
    db.openDatabase(1, evt => {
    }).then(() => {
      db.add('csv',
        {
          id: csv.id,
          name: csv.name,
          content: csv.content,
          dataArrayColumns: csv.dataArrayColumns,
          headerDetails: csv.headerDetails,
          selectedHeader: csv.selectedHeader,
          header: csv.header,
          startDate: csv.startDate,
          endDate: csv.endDate,
          interval: csv.interval,
          countOfRow: csv.countOfRow,
          countOfColumn: csv.countOfColumn,
          fileType: csv.fileType,
          dateUpload: csv.dateUpload
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

  deleteFromCSVStore(id) {
    return new Promise(resolve => {
      const db = new NgxIndexedDB('LOGGER', 1);
      db.openDatabase(1, evt => {
      }).then(() => {
        db.delete('csv', id).then(() => {
            console.log('Deleted');
          },
          error => {
            console.log(error);
          });
      });
    });
  }

  viewFromCSVStore() {
    return new Promise(resolve => {
      const db = new NgxIndexedDB('LOGGER', 1);
      db.openDatabase(1, evt => {
      }).then(() => {
          db.getAll('csv').then(csv => {
            resolve(csv);
          });
        },
        error => {
          console.log(error);
        });
    });
  }

  viewSelectedCSVStore(id) {
    return new Promise(resolve => {
      const db = new NgxIndexedDB('LOGGER', 1);
      db.openDatabase(1, evt => {
      }).then(() => {
          db.getByIndex('csv', 'id', id).then(csv => {
            resolve(csv);
          });
        },
        error => {
          console.log(error);
        });
    });
  }

  createMetaStore() {
    const db = new NgxIndexedDB('LOGGER', 1);
    db.openDatabase(1, evt => {
      const transaction = evt.currentTarget.result;
      const objectStore = transaction.createObjectStore('meta', {keyPath: 'id', unique: true});
      objectStore.createIndex('id', 'id', {unique: true});
      objectStore.createIndex('assessmentId', 'assessmentId', {unique: false});
      objectStore.createIndex('companyName', 'companyName', {unique: false});
      objectStore.createIndex('facilityName', 'facilityName', {unique: false});
      objectStore.createIndex('facilityContactName', 'facilityContactName', {unique: false});
      objectStore.createIndex('assessmentContactName', 'assessmentContactName', {unique: false});
      objectStore.createIndex('address', 'address', {unique: false});
      objectStore.createIndex('facilityContact', 'facilityContact', {unique: false});
      objectStore.createIndex('assessmentContact', 'assessmentContact', {unique: false});
      objectStore.createIndex('facilityEmail', 'facilityEmail', {unique: false});
      objectStore.createIndex('assessmentEmail', 'assessmentEmail', {unique: false});
    }).then(() => {

    }, error => {
      console.log(error);
    });
  }

  insertIntoMetaStore(metaData: FileMetaData) {
    const db = new NgxIndexedDB('LOGGER', 1);
    db.openDatabase(1, evt => {
    }).then(() => {
      db.add('meta',
        {
          id: metaData.id,
          assessmentId: metaData.assessmentId,
          companyName: metaData.companyName,
          facilityName: metaData.facilityName,
          facilityContactName: metaData.facilityContactName,
          assessmentContactName: metaData.assessmentContactName,
          address: metaData.address,
          facilityContact: metaData.facilityContact,
          assessmentContact: metaData.assessmentContact,
          facilityEmail: metaData.facilityEmail,
          assessmentEmail: metaData.assessmentEmail
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

  updateMetaStore(metaData: FileMetaData) {
    const db = new NgxIndexedDB('LOGGER', 1);
    db.openDatabase(1, evt => {
    }).then(() => {
      db.update('meta',
        {
          id: metaData.id,
          assessmentId: metaData.assessmentId,
          companyName: metaData.companyName,
          facilityName: metaData.facilityName,
          facilityContactName: metaData.facilityContactName,
          assessmentContactName: metaData.assessmentContactName,
          address: metaData.address,
          facilityContact: metaData.facilityContact,
          assessmentContact: metaData.assessmentContact,
          facilityEmail: metaData.facilityEmail,
          assessmentEmail: metaData.assessmentEmail
        }).then(() => {
        },
        error => {
          alert('File already Imported');
        });
    }, error => {
      console.log(error);
    });
  }

  viewSelectedMetaData(id) {
    return new Promise(resolve => {
      const db = new NgxIndexedDB('LOGGER', 1);
      db.openDatabase(1, evt => {
      }).then(() => {
          db.getByIndex('meta', 'id', id).then(metaData => {
            resolve(metaData);
          });
        },
        error => {
          console.log(error);
        });
    });
  }

  deleteFromMetaStore(id) {
    return new Promise(resolve => {
      const db = new NgxIndexedDB('LOGGER', 1);
      db.openDatabase(1, evt => {
      }).then(() => {
        db.delete('meta', id).then(() => {
            console.log('Deleted');
          },
          error => {
            console.log(error);
          });
      });
    });
  }

  createGraphStore() {
    const db = new NgxIndexedDB('LOGGER', 1);
    db.openDatabase(1, evt => {
      const transaction = evt.currentTarget.result;
      const objectStoreVisualize = transaction.createObjectStore('graph', {keyPath: 'id', unique: true});
      objectStoreVisualize.createIndex('id', 'id', {unique: true});
      objectStoreVisualize.createIndex('assessmentId', 'assessmentId', {unique: true});
      objectStoreVisualize.createIndex('displayName', 'displayName', {unique: false});
      objectStoreVisualize.createIndex('graph', 'graph', {unique: false});
      objectStoreVisualize.createIndex('visualizeMode', 'visualizeMode', {unique: false});
    }).then(() => {

    }, error => {
      console.log(error);
    });
  }

  insertIntoGraphStore(graph: Graph) {
    const db = new NgxIndexedDB('LOGGER', 1);
    db.openDatabase(1, evt => {
    }).then(() => {
      db.add('graph',
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

  viewGraphStore() {
    return new Promise(resolve => {
      const db = new NgxIndexedDB('LOGGER', 1);
      db.openDatabase(1, evt => {
      }).then(() => {
          db.getAll('graph').then(graph => {
            resolve(graph);
          });
        },
        error => {
          console.log(error);
        });
    });
  }

  viewSelectedGraph(id) {
    return new Promise(resolve => {
      const db = new NgxIndexedDB('LOGGER', 1);
      db.openDatabase(1, evt => {
      }).then(() => {
          db.getByIndex('graph', 'id', id).then(graph => {
            resolve(graph);
          });
        },
        error => {
          console.log(error);
        });
    });
  }

  deleteFromGraphStore(id) {
    return new Promise(resolve => {
      const db = new NgxIndexedDB('LOGGER', 1);
      db.openDatabase(1, evt => {
      }).then(() => {
        db.delete('graph', id).then(() => {
            console.log('Deleted');
          },
          error => {
            console.log(error);
          });
      });
    });
  }

  createDayTypeStore() {
    const db = new NgxIndexedDB('LOGGER', 1);
    db.openDatabase(1, evt => {
      const transaction = evt.currentTarget.result;
      const objectStoreLoad = transaction.createObjectStore('dayType', {keyPath: 'id', unique: true});
      objectStoreLoad.createIndex('id', 'id', {unique: true});
      objectStoreLoad.createIndex('assessmentId', 'assessmentId', {unique: true});
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
      objectStoreLoad.createIndex('loadShowBinMode', 'loadShowBinMode', {unique: false});
      objectStoreLoad.createIndex('loadToggleRelayoutDay', 'loadToggleRelayoutDay', {unique: false});
      objectStoreLoad.createIndex('loadAnnotationListDayAverage', 'loadAnnotationListDayAverage', {unique: false});
      objectStoreLoad.createIndex('loadAnnotationListBinAverage', 'loadAnnotationListBinAverage', {unique: false});
      objectStoreLoad.createIndex('loadGlobalYAverageDay', 'loadGlobalYAverageDay', {unique: false});
      objectStoreLoad.createIndex('loadGlobalYAverageBin', 'loadGlobalYAverageBin', {unique: false});
      objectStoreLoad.createIndex('dayTypeMode', 'dayTypeMode', {unique: false});
    }).then(() => {

    }, error => {
      console.log(error);
    });
  }

  insertIntoDayTypeStore(dayType: DayType) {
    const db = new NgxIndexedDB('LOGGER', 1);
    db.openDatabase(1, evt => {
    }).then(() => {
      db.add('dayType',
        {
          id: dayType.id,
          assessmentId: dayType.assessmentId,
          name: dayType.name,
          displayName: dayType.displayName,
          loadDataFromFile: dayType.loadDataFromFile,
          loadTimeSeriesDayType: dayType.loadTimeSeriesDayType,
          loadValueColumnCount: dayType.loadValueColumnCount,
          loadColumnMainArray: dayType.loadColumnMainArray,
          loadSumArray: dayType.loadSumArray,
          loadBinList: dayType.loadBinList,
          loadDisplayBinList: dayType.loadDisplayBinList,
          loadSelectedBinList: dayType.loadSelectedBinList,
          loadDays: dayType.loadDays,
          loadSelectedDates: dayType.loadSelectedDates,
          loadGraphDayAverage: dayType.loadGraphDayAverage,
          loadGraphBinAverage: dayType.loadGraphBinAverage,
          loadShowBinMode: dayType.loadShowBinMode,
          loadToggleRelayoutDay: dayType.loadToggleRelayoutDay,
          loadAnnotationListDayAverage: dayType.loadAnnotationListDayAverage,
          loadAnnotationListBinAverage: dayType.loadAnnotationListBinAverage,
          loadGlobalYAverageDay: dayType.loadGlobalYAverageDay,
          loadGlobalYAverageBin: dayType.loadGlobalYAverageBin,
          dayTypeMode: dayType.dayTypeMode
        }).then(() => {
        },
        error => {
          alert('File already Imported');
        });
    }, error => {
      console.log(error);
    });
  }

  insertIntoDayTypeStoreFromFile(dayType: DayType) {
    const db = new NgxIndexedDB('LOGGER', 1);
    db.openDatabase(1, evt => {
    }).then(() => {
      for (let i = 0; i < dayType.loadTimeSeriesDayType.length; i++) {
        dayType.loadTimeSeriesDayType[i] = new Date(dayType.loadTimeSeriesDayType[i]);
      }
      for (let i = 0; i < dayType.loadColumnMainArray.length; i++) {
        for (let j = 0; j < dayType.loadColumnMainArray[i].length; j++) {
          for (let k = 0; k < dayType.loadColumnMainArray[i][j].length; k++) {
            dayType.loadColumnMainArray[i][j][k].displayDate = new Date(dayType.loadColumnMainArray[i][j][k].displayDate);
          }
        }
      }
      for (let i = 0; i < dayType.loadDays.length; i++) {
        dayType.loadDays[i].date = new Date(dayType.loadDays[i].date);
      }
      for (let i = 0; i < dayType.loadSelectedBinList.length; i++) {
        for (let j = 0; j < dayType.loadSelectedBinList[i].length; j++) {
          console.log(dayType.loadSelectedBinList[i][j].date);
          dayType.loadSelectedBinList[i][j].date = new Date(dayType.loadSelectedBinList[i][j].date);
        }
      }
      db.add('dayType',
        {
          id: dayType.id,
          assessmentId: dayType.assessmentId,
          name: dayType.name,
          displayName: dayType.displayName,
          loadDataFromFile: dayType.loadDataFromFile,
          loadTimeSeriesDayType: dayType.loadTimeSeriesDayType,
          loadValueColumnCount: dayType.loadValueColumnCount,
          loadColumnMainArray: dayType.loadColumnMainArray,
          loadSumArray: dayType.loadSumArray,
          loadBinList: dayType.loadBinList,
          loadDisplayBinList: dayType.loadDisplayBinList,
          loadSelectedBinList: dayType.loadSelectedBinList,
          loadDays: dayType.loadDays,
          loadSelectedDates: dayType.loadSelectedDates,
          loadGraphDayAverage: dayType.loadGraphDayAverage,
          loadGraphBinAverage: dayType.loadGraphBinAverage,
          loadShowBinMode: dayType.loadShowBinMode,
          loadToggleRelayoutDay: dayType.loadToggleRelayoutDay,
          loadAnnotationListDayAverage: dayType.loadAnnotationListDayAverage,
          loadAnnotationListBinAverage: dayType.loadAnnotationListBinAverage,
          loadGlobalYAverageDay: dayType.loadGlobalYAverageDay,
          loadGlobalYAverageBin: dayType.loadGlobalYAverageBin,
          dayTypeMode: dayType.dayTypeMode
        }).then(() => {
        },
        error => {
          alert('File already Imported');
        });
    }, error => {
      console.log(error);
    });
  }

  updateDayTypeStore(dayType: DayType) {
    const db = new NgxIndexedDB('LOGGER', 1);
    db.openDatabase(1, evt => {
    }).then(() => {
      db.update('dayType',
        {
          id: dayType.id,
          assessmentId: dayType.assessmentId,
          name: dayType.name,
          displayName: dayType.displayName,
          loadDataFromFile: dayType.loadDataFromFile,
          loadTimeSeriesDayType: dayType.loadTimeSeriesDayType,
          loadValueColumnCount: dayType.loadValueColumnCount,
          loadColumnMainArray: dayType.loadColumnMainArray,
          loadSumArray: dayType.loadSumArray,
          loadBinList: dayType.loadBinList,
          loadDisplayBinList: dayType.loadDisplayBinList,
          loadSelectedBinList: dayType.loadSelectedBinList,
          loadDays: dayType.loadDays,
          loadSelectedDates: dayType.loadSelectedDates,
          loadGraphDayAverage: dayType.loadGraphDayAverage,
          loadGraphBinAverage: dayType.loadGraphBinAverage,
          loadShowBinMode: dayType.loadShowBinMode,
          loadToggleRelayoutDay: dayType.loadToggleRelayoutDay,
          loadAnnotationListDayAverage: dayType.loadAnnotationListDayAverage,
          loadAnnotationListBinAverage: dayType.loadAnnotationListBinAverage,
          loadGlobalYAverageDay: dayType.loadGlobalYAverageDay,
          loadGlobalYAverageBin: dayType.loadGlobalYAverageBin,
          dayTypeMode: dayType.dayTypeMode
        }).then(() => {
        },
        error => {
          alert('File already Imported');
        });
    }, error => {
      console.log(error);
    });
  }

  viewDayTypeStore() {
    return new Promise(resolve => {
      const db = new NgxIndexedDB('LOGGER', 1);
      db.openDatabase(1, evt => {
      }).then(() => {
          db.getAll('dayType').then(dayType => {
            resolve(dayType);
          });
        },
        error => {
          console.log(error);
        });
    });
  }

  viewSelectedDayType(id) {
    return new Promise(resolve => {
      const db = new NgxIndexedDB('LOGGER', 1);
      db.openDatabase(1, evt => {
      }).then(() => {
          db.getByIndex('dayType', 'id', id).then(dayType => {
            resolve(dayType);
          });
        },
        error => {
          console.log(error);
        });
    });
  }

  deleteFromDayTypeStore(id) {
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

  createGraphReportStore() {
    const db = new NgxIndexedDB('LOGGER', 1);
    db.openDatabase(1, evt => {
      const transaction = evt.currentTarget.result;
      const objectStoreVisualize = transaction.createObjectStore('graphReport', {keyPath: 'id', unique: true});
      objectStoreVisualize.createIndex('id', 'id', {unique: true});
      objectStoreVisualize.createIndex('assessmentId', 'assessmentId', {unique: false});
      objectStoreVisualize.createIndex('displayName', 'displayName', {unique: false});
      objectStoreVisualize.createIndex('graph', 'graph', {unique: false});
      objectStoreVisualize.createIndex('visualizeMode', 'visualizeMode', {unique: false});
    }).then(() => {

    }, error => {
      console.log(error);
    });
  }

  createDayTypeReportStore() {
    const db = new NgxIndexedDB('LOGGER', 1);
    db.openDatabase(1, evt => {
      const transaction = evt.currentTarget.result;
      const objectStoreLoad = transaction.createObjectStore('dayTypeReport', {keyPath: 'id', unique: true});
      objectStoreLoad.createIndex('id', 'id', {unique: true});
      objectStoreLoad.createIndex('assessmentId', 'assessmentId', {unique: false});
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
      objectStoreLoad.createIndex('loadShowBinMode', 'loadShowBinMode', {unique: false});
      objectStoreLoad.createIndex('loadToggleRelayoutDay', 'loadToggleRelayoutDay', {unique: false});
      objectStoreLoad.createIndex('loadAnnotationListDayAverage', 'loadAnnotationListDayAverage', {unique: false});
      objectStoreLoad.createIndex('loadAnnotationListBinAverage', 'loadAnnotationListBinAverage', {unique: false});
      objectStoreLoad.createIndex('loadGlobalYAverageDay', 'loadGlobalYAverageDay', {unique: false});
      objectStoreLoad.createIndex('loadGlobalYAverageBin', 'loadGlobalYAverageBin', {unique: false});
      objectStoreLoad.createIndex('dayTypeMode', 'dayTypeMode', {unique: false});
    }).then(() => {

    }, error => {
      console.log(error);
    });
  }
}
