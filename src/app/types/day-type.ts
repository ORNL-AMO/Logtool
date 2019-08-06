import {NgxIndexedDB} from 'ngx-indexed-db';

export class DayType {
  constructor(
    public id: Number, public assessmentId: Number, public name: String, public displayName: String, public loadDataFromFile: Array<any>,
    public loadTimeSeriesDayType: Array<any>, public loadValueColumnCount: Array<any>, public loadColumnMainArray: Array<any>,
    public loadSumArray: Array<any>, public loadBinList: Array<any>, public loadDisplayBinList: Array<any>,
    public loadSelectedBinList: Array<any>, public loadDays: Array<any>, public loadSelectedDates: Array<any>,
    public loadGraphDayAverage: any, public loadGraphBinAverage: any, public loadShowBinMode: boolean,
    public loadToggleRelayoutDay: boolean, public loadAnnotationListDayAverage: Array<any>,
    public loadAnnotationListBinAverage: Array<any>, public loadGlobalYAverageDay: Array<any>,
    public loadGlobalYAverageBin: Array<any>, public dayTypeMode: boolean
  ) {
  }


  addIntoDayTypeStore(dayType: DayType) {
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

  addIntoDayTypeStoreFromFile(dayType: DayType) {
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

  updateIntoDayTypeStore(dayType: DayType) {
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
}
