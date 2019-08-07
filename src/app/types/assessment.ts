import {FileMetaData} from './file-meta-data';
import {CSVFileInput} from './csvfile-input';
import {DayType} from './day-type';
import {Graph} from './graph';

export class Assessment {
  constructor(public id: Number, public name: String, public csv: Array<CSVFileInput>, public metaDataId: Number,
              public metaData: FileMetaData, public graphId: Number, public graph: Graph, public dayTypeId: Number,
              public dayType: DayType, public reportGraph: Array<Graph>, public reportDayType: Array<DayType>,
              public assessmentMode: Boolean) {
  }
}
