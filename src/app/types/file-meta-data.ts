import {Address} from './address';
import {NgxIndexedDB} from 'ngx-indexed-db';

export class FileMetaData {
  constructor(
    public id: Number, public assessmentId: Number, public companyName: String, public facilityName: String,
    public facilityContactName: String, public assessmentContactName: String, public address: Address,
    public facilityContact: Number, public assessmentContact: Number, public facilityEmail: String, public assessmentEmail: String
  ) {
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
}
