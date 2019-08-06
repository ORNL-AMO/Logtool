import {NgxIndexedDB} from 'ngx-indexed-db';

export class CSVFileInput {
  constructor(public id: number, public name: string, public content: Array<any>,
              public dataArrayColumns: Array<any>, public headerDetails: Array<any>, public selectedHeader: Array<any>,
              public header: Array<any>, public startDate: string, public endDate: string,
              public interval: string, public countOfRow: string, public countOfColumn,
              public fileType: string, public dateUpload: String) {
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
}
