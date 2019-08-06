import {FileMetaData} from './file-meta-data';
import {CSVFileInput} from './csvfile-input';
import {DayType} from './day-type';
import {Graph} from './graph';
import {NgxIndexedDB} from 'ngx-indexed-db';

export class Assessment {
  constructor(public id: Number, public name: String, public csv: Array<CSVFileInput>, public metaDataId: Number,
              public metaData: FileMetaData, public graphId: Number, public graph: Graph, public dayTypeId: Number,
              public dayType: DayType, public reportGraph: Array<Graph>, public reportDayType: Array<DayType>,
              public assessmentMode: Boolean) {
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
}
