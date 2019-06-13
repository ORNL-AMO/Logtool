export class DataList {

  constructor(public id: number, public name: string, public content: Array<any>,
              public dataArrayColumns: Array<any>, public headerDetails: Array<any> , public selectedHeader: Array<any>,
              public header: Array<any>, public startDate: string, public endDate: string,
              public interval: string, public countOfRow: string, public countOfColumn,
              public fileType: string)  {}
}
