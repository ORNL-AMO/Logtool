import {Injectable} from '@angular/core';
import {NgxIndexedDB} from 'ngx-indexed-db';
import {DataService} from './data.service';

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
}
