import {Address} from './address';

export class FileMetaData {
  constructor(
    public id: Number, public assessmentId: Number, public companyName: String, public facilityName: String,
    public facilityContactName: String, public assessmentContactName: String, public address: Address,
    public facilityContact: Number, public assessmentContact: Number, public facilityEmail: String, public assessmentEmail: String
  ) {
  }
}
