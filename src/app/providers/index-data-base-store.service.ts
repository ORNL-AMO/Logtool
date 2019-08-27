import {Injectable} from '@angular/core';
import {IndexDetails, NgxIndexedDB} from 'ngx-indexed-db';
import {Assessment} from '../types/assessment';
import {FileMetaData} from '../types/file-meta-data';
import {CSVFileInput} from '../types/csvfile-input';
import {Graph} from '../types/graph';
import {DayType} from '../types/day-type';
import {DataService} from './data.service';
import {QuickSave} from '../types/quick-save';

@Injectable({
    providedIn: 'root'
})
export class IndexDataBaseStoreService {

    constructor(private data: DataService) {
    }

    operationDB() {
        this.createAssessmentStore();
    }

    createAssessmentStore() {
        const db = new NgxIndexedDB('LOGGER', 1);
        db.openDatabase(1, evt => {
            const transaction = evt.currentTarget.result;
            let objectStore = transaction.createObjectStore('assessment', {keyPath: 'id', unique: true});
            objectStore.createIndex('id', 'id', {unique: true});
            objectStore.createIndex('name', 'name', {unique: false});
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
            objectStore = transaction.createObjectStore('quickSave', {keyPath: 'id', unique: true});
            objectStore.createIndex('id', 'id', {unique: true});
            objectStore.createIndex('storeName', 'storeName', {unique: true});
            objectStore = transaction.createObjectStore('csv', {keyPath: 'id', unique: true});
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
            objectStore = transaction.createObjectStore('meta', {keyPath: 'id', unique: true});
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
            let objectStoreVisualize = transaction.createObjectStore('graph', {keyPath: 'id', unique: true});
            objectStoreVisualize.createIndex('id', 'id', {unique: true});
            objectStoreVisualize.createIndex('assessmentId', 'assessmentId', {unique: true});
            objectStoreVisualize.createIndex('displayName', 'displayName', {unique: false});
            objectStoreVisualize.createIndex('graph', 'graph', {unique: false});
            objectStoreVisualize.createIndex('visualizeMode', 'visualizeMode', {unique: false});
            let objectStoreLoad = transaction.createObjectStore('dayType', {keyPath: 'id', unique: true});
            objectStoreLoad.createIndex('id', 'id', {unique: true});
            objectStoreLoad.createIndex('assessmentId', 'assessmentId', {unique: true});
            objectStoreLoad.createIndex('name', 'name', {unique: false});
            objectStoreLoad.createIndex('displayName', 'displayName', {unique: false});
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
            objectStoreVisualize = transaction.createObjectStore('graphReport', {keyPath: 'id', unique: true});
            objectStoreVisualize.createIndex('id', 'id', {unique: true});
            objectStoreVisualize.createIndex('assessmentId', 'assessmentId', {unique: false});
            objectStoreVisualize.createIndex('displayName', 'displayName', {unique: false});
            objectStoreVisualize.createIndex('graph', 'graph', {unique: false});
            objectStoreVisualize.createIndex('visualizeMode', 'visualizeMode', {unique: false});
            objectStoreLoad = transaction.createObjectStore('dayTypeReport', {keyPath: 'id', unique: true});
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
            },
            error => {
                console.log(error);
            });
    }

    insertIntoAssessmentStore(assessment: Assessment) {
        return new Promise(resolve => {
            const db = new NgxIndexedDB('LOGGER', 1);
            db.openDatabase(1, evt => {
            }).then(() => {
                console.log(assessment);
                db.add('assessment',
                    {
                        id: assessment.id,
                        name: assessment.name,
                        csv: assessment.csv,
                        metaDataId: assessment.metaDataId,
                        metaData: assessment.metaData,
                        graphId: assessment.graphId,
                        graph: assessment.graph,
                        dayTypeId: assessment.dayTypeId,
                        dayType: assessment.dayType,
                        reportGraph: assessment.reportGraph,
                        reportDayType: assessment.reportDayType,
                        assessmentMode: assessment.assessmentMode
                    }).then(() => {
                        resolve();
                    },
                    error => {
                        alert('Assessment Error');
                        console.log(error);
                    });
            }, error => {
                console.log(error);
            });
        });

    }

    updateGraphAssessmentStore(assessment: Assessment) {
        return new Promise(resolve => {
            const db = new NgxIndexedDB('LOGGER', 1);
            db.openDatabase(1, evt => {
            }).then(() => {
                db.update('assessment',
                    {
                        id: assessment.id,
                        name: assessment.name,
                        csv: assessment.csv,
                        metaDataId: assessment.metaDataId,
                        metaData: assessment.metaData,
                        graphId: assessment.graphId,
                        graph: assessment.graph,
                        dayTypeId: assessment.dayTypeId,
                        dayType: assessment.dayType,
                        reportGraph: assessment.reportGraph,
                        reportDayType: assessment.reportDayType,
                        assessmentMode: assessment.assessmentMode
                    }).then(() => {
                        resolve();
                    },
                    error => {
                        alert('Error');
                        console.log(error);
                    });
            }, error => {
                console.log(error);
            });
        });

    }

    updateDayTypeAssessmentStore(assessment) {
        return new Promise(resolve => {
            const db = new NgxIndexedDB('LOGGER', 1);
            db.openDatabase(1, evt => {
            }).then(() => {
                db.update('assessment',
                    {
                        id: assessment.id,
                        name: assessment.name,
                        csv: assessment.csv,
                        metaDataId: assessment.metaDataId,
                        metaData: assessment.metaData,
                        graphId: assessment.graphId,
                        graph: assessment.graph,
                        dayTypeId: assessment.dayTypeId,
                        dayType: assessment.dayType,
                        reportGraph: assessment.reportGraph,
                        reportDayType: assessment.reportDayType,
                        assessmentMode: assessment.assessmentMode
                    }).then(() => {
                        resolve();
                    },
                    error => {
                        alert('Error');
                        console.log(error);
                    });
            }, error => {
                console.log(error);
            });
        });

    }

    updateMetaDataAssessmentStore(assessment) {
        return new Promise(resolve => {
            const db = new NgxIndexedDB('LOGGER', 1);
            db.openDatabase(1, evt => {
            }).then(() => {
                db.update('assessment',
                    {
                        id: assessment.id,
                        name: assessment.name,
                        csv: assessment.csv,
                        metaDataId: assessment.metaDataId,
                        metaData: assessment.metaData,
                        graphId: assessment.graphId,
                        graph: assessment.graph,
                        dayTypeId: assessment.dayTypeId,
                        dayType: assessment.dayType,
                        reportGraph: assessment.reportGraph,
                        reportDayType: assessment.reportDayType,
                        assessmentMode: assessment.assessmentMode
                    }).then(() => {
                        resolve();
                    },
                    error => {
                        alert('Error');
                        console.log(error);
                    });
            }, error => {
                console.log(error);
            });
        });
    }

    deleteFromAssessmentStore(id) {
        return new Promise(resolve => {
            const db = new NgxIndexedDB('LOGGER', 1);
            db.openDatabase(1, evt => {
            }).then(() => {
                db.delete('assessment', id).then(() => {
                        console.log('Deleted');
                        resolve();
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
                        this.data.changeAssessmentItemArray(assessment);
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
                        this.data.changeAssessmentItem(assessment);
                        resolve(assessment);
                    });
                },
                error => {
                    console.log(error);
                });
        });
    }

    viewFromQuickSaveStore() {
        return new Promise(resolve => {
            const db = new NgxIndexedDB('LOGGER', 1);
            db.openDatabase(1, evt => {
            }).then(() => {
                    db.getAll('quickSave').then(quickSave => {
                        resolve(quickSave);
                        this.data.changeQuickSaveItem(quickSave);
                    });
                },
                error => {
                    console.log(error);
                });
        });
    }

    insertIntoQuickSaveStore(quickSave: QuickSave) {
        return new Promise(resolve => {
            const db = new NgxIndexedDB('LOGGER', 1);
            db.openDatabase(1, evt => {
            }).then(() => {
                db.add('quickSave',
                    {
                        id: quickSave.id,
                        storeName: quickSave.storeName,
                    }).then(() => {
                        resolve();
                    },
                    error => {
                        alert('Assessment Inserted');
                        console.log(error);
                    });
            }, error => {
                console.log(error);
            });
        });
    }

    clearQuickSaveStore() {
        return new Promise(resolve => {
            const db = new NgxIndexedDB('LOGGER', 1);
            db.openDatabase(1, evt => {
            }).then(() => {
                db.clear('quickSave').then(() => {
                        resolve();
                        console.log('Cleared');
                    },
                    error => {
                        console.log(error);
                    });
            });
        });
    }

    insertIntoCSVStore(csv: CSVFileInput) {
        return new Promise(resolve => {
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
                        resolve();
                    },
                    error => {
                        alert('File already Imported');
                        console.log(error);
                    });
            }, error => {
                console.log(error);
            });
        });
    }

    deleteFromCSVStore(id) {
        return new Promise(resolve => {
            const db = new NgxIndexedDB('LOGGER', 1);
            db.openDatabase(1, evt => {
            }).then(() => {
                db.delete('csv', id).then(() => {
                        console.log('Deleted');
                        resolve();
                    },
                    error => {
                        console.log(error);
                    });
            });
        });
    }

    clearCSVStore() {
        return new Promise(resolve => {
            const db = new NgxIndexedDB('LOGGER', 1);
            db.openDatabase(1, evt => {
            }).then(() => {
                db.clear('csv').then(() => {
                        console.log('Deleted');
                        resolve();
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
                        this.data.changeCSVItemArray(csv);
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
                        this.data.changeCSVItem(csv);
                    });
                },
                error => {
                    console.log(error);
                });
        });
    }

    insertIntoMetaStore(metaData: FileMetaData) {
        return new Promise(resolve => {
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
                        resolve();
                    },
                    error => {
                        alert('File already Imported');
                        console.log(error);
                    });
            }, error => {
                console.log(error);
            });
        });
    }

    updateMetaStore(metaData: FileMetaData, assessment: Assessment) {
        return new Promise(resolve => {
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
                        assessment.metaData = metaData;
                        this.updateMetaDataAssessmentStore(assessment).then(() => {
                            resolve();
                        });
                    },
                    error => {
                        alert('File already Imported');
                    });
            }, error => {
                console.log(error);
            });
        });
    }

    viewSelectedMetaData(id) {
        return new Promise(resolve => {
            const db = new NgxIndexedDB('LOGGER', 1);
            db.openDatabase(1, evt => {
            }).then(() => {
                    db.getByIndex('meta', 'id', id).then(metaData => {
                        resolve(metaData);
                        this.data.changeMetaDataItem(metaData);
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

    insertIntoGraphStore(graph: Graph, assessment: Assessment) {
        const db = new NgxIndexedDB('LOGGER', 1);
        db.openDatabase(1, evt => {
        }).then(() => {
            db.add('graph',
                {
                    id: graph.id,
                    assessmentId: graph.assessmentId,
                    displayName: graph.displayName,
                    graph: graph.graph,
                    visualizeMode: graph.visualizeMode
                }).then(() => {
                    assessment.graph = graph.graph;
                    assessment.metaData = assessment.metaData;
                    this.updateGraphAssessmentStore(assessment);
                },
                error => {
                    alert('File already Imported');
                });
        }, error => {
            console.log(error);
        });
    }

    updateGraphStore(graph: Graph, assessment: any) {
        const db = new NgxIndexedDB('LOGGER', 1);
        db.openDatabase(1, evt => {
        }).then(() => {
            db.update('graph',
                {
                    id: graph.id,
                    assessmentId: graph.assessmentId,
                    displayName: graph.displayName,
                    graph: graph.graph,
                    visualizeMode: graph.visualizeMode
                }).then(() => {
                    assessment.graph = graph.graph;
                    assessment.metaData = assessment.metaData;
                    this.updateGraphAssessmentStore(assessment);
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
                        this.data.changeGraphItemArray(graph);
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
                        this.data.changeGraphItem(graph);
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
                        resolve();
                    },
                    error => {
                        console.log(error);
                    });
            });
        });
    }


    insertIntoDayTypeStore(dayType: DayType, assessment: Assessment) {
        return new Promise(resolve => {
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
                        assessment.dayType = dayType;
                        this.updateDayTypeAssessmentStore(assessment).then(() => {
                        });
                    },
                    error => {
                        alert('File already Imported');
                    });
            }, error => {
                console.log(error);
            });
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

    updateDayTypeStore(dayType: DayType, assessment: Assessment) {
        return new Promise(resolve => {
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
                        assessment.dayType = dayType;
                        this.updateDayTypeAssessmentStore(assessment).then(() => {
                            resolve();
                        });
                    },
                    error => {
                    });
            }, error => {
                console.log(error);
            });
        });

    }

    viewDayTypeStore() {
        return new Promise(resolve => {
            const db = new NgxIndexedDB('LOGGER', 1);
            db.openDatabase(1, evt => {
            }).then(() => {
                    db.getAll('dayType').then(dayType => {
                        resolve(dayType);
                        this.data.changeDayTypeItemArray(dayType);
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
                        this.data.changeDayTypeItem(dayType);
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
                        resolve();
                    },
                    error => {
                        console.log(error);
                    });
            });
        });
    }

    insertIntoGraphReportStore(graph: Graph, assessment: Assessment, graphReport: Array<Graph>) {
        return new Promise(resolve => {
            const db = new NgxIndexedDB('LOGGER', 1);
            db.openDatabase(1, evt => {
            }).then(() => {
                db.add('graphReport',
                    {
                        id: graph.id,
                        assessmentId: graph.assessmentId,
                        displayName: graph.displayName,
                        graph: graph.graph,
                        visualizeMode: graph.visualizeMode
                    }).then(() => {
                        assessment.reportGraph = graphReport;
                        assessment.reportGraph.push(graph);
                        this.updateGraphAssessmentStore(assessment).then(() => {
                            resolve();
                        });
                    },
                    error => {
                        alert('File already Imported');
                    });
            }, error => {
                console.log(error);
            });
        });

    }

    updateGraphReportStore(graph: Graph, assessment: any) {
        const db = new NgxIndexedDB('LOGGER', 1);
        db.openDatabase(1, evt => {
        }).then(() => {
            db.update('graphReport',
                {
                    id: graph.id,
                    assessmentId: graph.assessmentId,
                    displayName: graph.displayName,
                    graph: graph.graph,
                    visualizeMode: graph.visualizeMode
                }).then(() => {
                    assessment.graph = graph.graph;
                    this.updateGraphAssessmentStore(assessment);
                },
                error => {
                    alert('File already Imported');
                });
        }, error => {
            console.log(error);
        });
    }

    viewGraphReportStore() {
        return new Promise(resolve => {
            const db = new NgxIndexedDB('LOGGER', 1);
            db.openDatabase(1, evt => {
            }).then(() => {
                    db.getAll('graphReport').then(graph => {
                        this.data.changeGraphItemArray(graph);
                        resolve();
                    });
                },
                error => {
                    console.log(error);
                });
        });
    }

    viewSelectedGraphReport(assessmentId) {
        return new Promise(resolve => {
            const db = new NgxIndexedDB('LOGGER', 1);
            db.openDatabase(1, evt => {
            }).then(() => {
                    const index_detail: IndexDetails = {
                        indexName: 'assessmentId',
                        order: 'asc'
                    };
                    db.getAll('graphReport', IDBKeyRange.only(assessmentId), index_detail).then(graph => {
                        console.log(graph);
                        this.data.changeGraphItemArray(graph);
                        resolve(graph);
                    });
                },
                error => {
                    console.log(error);
                });
        });
    }

    deleteFromGraphStoreReport(id) {
        return new Promise(resolve => {
            const db = new NgxIndexedDB('LOGGER', 1);
            db.openDatabase(1, evt => {
            }).then(() => {
                db.delete('graphReport', id).then(() => {
                        console.log('Deleted');
                        resolve();
                    },
                    error => {
                        console.log(error);
                    });
            });
        });
    }

    insertIntoDayTypeReportStore(dayType: DayType, assessment: Assessment, dayTypeReport: Array<DayType>) {
        return new Promise(resolve => {
            const db = new NgxIndexedDB('LOGGER', 1);
            db.openDatabase(1, evt => {
            }).then(() => {
                db.add('dayTypeReport',
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
                        assessment.reportDayType = dayTypeReport;
                        assessment.reportDayType.push(dayType);
                        this.updateDayTypeAssessmentStore(assessment).then(() => {
                            resolve();
                        });
                    },
                    error => {
                        alert('File already Imported');
                    });
            }, error => {
                console.log(error);
            });
        });

    }

    updateDayTypeReportStore(dayType: DayType, assessment: Assessment, dayTypeReport: Array<DayType>) {
        return new Promise(resolve => {
            const db = new NgxIndexedDB('LOGGER', 1);
            db.openDatabase(1, evt => {
            }).then(() => {
                db.update('dayTypeReport',
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
                        assessment.reportDayType = dayTypeReport;
                        assessment.reportDayType.push(dayType);
                        this.updateDayTypeAssessmentStore(assessment).then(() => {
                            resolve();
                        });
                    },
                    error => {
                        alert('File already Imported');
                    });
            }, error => {
                console.log(error);
            });
        });
    }

    viewDayTypeReportStore() {
        return new Promise(resolve => {
            const db = new NgxIndexedDB('LOGGER', 1);
            db.openDatabase(1, evt => {
            }).then(() => {
                    db.getAll('dayTypeReport').then(dayType => {
                        this.data.changeDayTypeItemArray(dayType);
                        resolve();
                    });
                },
                error => {
                    console.log(error);
                });
        });
    }

    viewSelectedDayTypeReport(assessmentId) {
        return new Promise(resolve => {
            const db = new NgxIndexedDB('LOGGER', 1);
            db.openDatabase(1, evt => {
            }).then(() => {
                    const index_detail: IndexDetails = {
                        indexName: 'assessmentId',
                        order: 'asc'
                    };
                    db.getAll('dayTypeReport', IDBKeyRange.only(assessmentId), index_detail).then(dayType => {
                        console.log(dayType);
                        this.data.changeDayTypeItemArray(dayType);
                        resolve(dayType);
                    });
                },
                error => {
                    console.log(error);
                });
        });
    }

    deleteFromDayTypeStoreReport(id) {
        return new Promise(resolve => {
            const db = new NgxIndexedDB('LOGGER', 1);
            db.openDatabase(1, evt => {
            }).then(() => {
                db.delete('dayTypeReport', id).then(() => {
                        console.log('Deleted');
                        resolve();
                    },
                    error => {
                        console.log(error);
                    });
            });
        });
    }


}
