import {Injectable} from '@angular/core';
import {NgxIndexedDB} from 'ngx-indexed-db';
import {Assessment} from '../types/assessment';

@Injectable({
  providedIn: 'root'
})
export class IndexDataBaseStoreService {

  constructor() {
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
