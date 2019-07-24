export class LoadList {
  constructor(
    public id: Number, public name: String, public displayName: String, public loadDataFromFile: Array<any>,
    public loadTimeSeriesDayType: Array<any>, public loadValueColumnCount: Array<any>, public columnMainArray: Array<any>,
    public sumArray: Array<any>, public binList: Array<any>, public displayBinList: Array<any>,
    public days: Array<any>, public selectedDates: Array<any>, public graphDayAverage: any,
    public graphBinAverage: any, public showBinMode: boolean, public toggleRelayoutDay: boolean, public mac: boolean,
    public annotationListDayAverage: Array<any>, public annotationListBinAverage: Array<any>,
    public globalYAverageDay: Array<any>, public globalYAverageBin: Array<any>, public saveLoadMode: boolean
  ) {
  }
}

