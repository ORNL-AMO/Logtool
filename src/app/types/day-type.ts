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
    public loadGlobalYAverageBin: Array<any>, public dayTypeMode: boolean) {
  }

}
