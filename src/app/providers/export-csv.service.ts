import {Injectable} from '@angular/core';
import * as XLSX from 'xlsx';
import * as fs from 'fs';
import {IndexDataBaseStoreService} from './index-data-base-store.service';
import {DayType} from '../types/day-type';
import {Graph} from '../types/graph';
import {Assessment} from '../types/assessment';

const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';

@Injectable({
    providedIn: 'root'
})
export class ExportCSVService {

    constructor(private indexFileStore: IndexDataBaseStoreService) {
    }

    public exportAsExcelFile(json: any[], excelFileName: string): void {

        const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(json);
        console.log('worksheet', worksheet);
        const workbook: XLSX.WorkBook = {Sheets: {'data': worksheet}, SheetNames: ['data']};
        const excelBuffer: any = XLSX.write(workbook, {bookType: 'xlsx', type: 'array'});
        // const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'buffer' });
        // this.saveAsExcelFile(excelBuffer, excelFileName);
    }

    exportDayAverageData(graphDayAverage, displayBinList) {
        const workbook = XLSX.utils.book_new();
        workbook.Props = {
            Title: 'Trial',
            Subject: 'Test File',
            Author: 'ORNL AirMaster',
            CreatedDate: new Date(2019, 7, 12)
        };
        const datajson = [];
        for (let i = 0; i < graphDayAverage.data.length; i++) {
            if (graphDayAverage.data[i].line.color !== '') {
                if (graphDayAverage.data[i].visible === true) {
                    const bin = displayBinList.find(obj => obj.binColor === graphDayAverage.data[i].line.color);
                    datajson.push({
                        Date: graphDayAverage.data[i].name,
                        1: graphDayAverage.data[i].y[0],
                        2: graphDayAverage.data[i].y[1],
                        3: graphDayAverage.data[i].y[2],
                        4: graphDayAverage.data[i].y[3],
                        5: graphDayAverage.data[i].y[4],
                        6: graphDayAverage.data[i].y[5],
                        7: graphDayAverage.data[i].y[6],
                        8: graphDayAverage.data[i].y[7],
                        9: graphDayAverage.data[i].y[8],
                        10: graphDayAverage.data[i].y[9],
                        11: graphDayAverage.data[i].y[10],
                        12: graphDayAverage.data[i].y[11],
                        13: graphDayAverage.data[i].y[12],
                        14: graphDayAverage.data[i].y[13],
                        15: graphDayAverage.data[i].y[14],
                        16: graphDayAverage.data[i].y[15],
                        17: graphDayAverage.data[i].y[16],
                        18: graphDayAverage.data[i].y[17],
                        19: graphDayAverage.data[i].y[18],
                        20: graphDayAverage.data[i].y[19],
                        21: graphDayAverage.data[i].y[20],
                        22: graphDayAverage.data[i].y[21],
                        23: graphDayAverage.data[i].y[22],
                        24: graphDayAverage.data[i].y[23],
                        DayType: bin.binName
                    });
                }
            }
        }
        const worksheet = XLSX.utils.json_to_sheet(datajson);
        XLSX.utils.book_append_sheet(workbook, worksheet, 'ChannelName');
        XLSX.writeFile(workbook, 'THISPAGE2.xlsx', {bookType: 'xlsx'});
    }

    exportBinAverageData(graphBinAverage) {
        console.log(graphBinAverage.data);
        const workbook = XLSX.utils.book_new();
        workbook.Props = {
            Title: 'Trial',
            Subject: 'Test File',
            Author: 'ORNL AirMaster',
            CreatedDate: new Date(2019, 7, 12)
        };
        const datajson = [];
        for (let i = 0; i < graphBinAverage.data.length; i++) {
            if (graphBinAverage.data[i].line.color !== '') {
                datajson.push({
                    // DayType: graphBinAverage.data[i].name,
                    1: graphBinAverage.data[i].y[0],
                    2: graphBinAverage.data[i].y[1],
                    3: graphBinAverage.data[i].y[2],
                    4: graphBinAverage.data[i].y[3],
                    5: graphBinAverage.data[i].y[4],
                    6: graphBinAverage.data[i].y[5],
                    7: graphBinAverage.data[i].y[6],
                    8: graphBinAverage.data[i].y[7],
                    9: graphBinAverage.data[i].y[8],
                    10: graphBinAverage.data[i].y[9],
                    11: graphBinAverage.data[i].y[10],
                    12: graphBinAverage.data[i].y[11],
                    13: graphBinAverage.data[i].y[12],
                    14: graphBinAverage.data[i].y[13],
                    15: graphBinAverage.data[i].y[14],
                    16: graphBinAverage.data[i].y[15],
                    17: graphBinAverage.data[i].y[16],
                    18: graphBinAverage.data[i].y[17],
                    19: graphBinAverage.data[i].y[18],
                    20: graphBinAverage.data[i].y[19],
                    21: graphBinAverage.data[i].y[20],
                    22: graphBinAverage.data[i].y[21],
                    23: graphBinAverage.data[i].y[22],
                    24: graphBinAverage.data[i].y[23]
                });
            }
        }
        const worksheet = XLSX.utils.json_to_sheet(datajson);
        XLSX.utils.book_append_sheet(workbook, worksheet, 'ChannelName');
        XLSX.writeFile(workbook, 'BinAverages.xlsx', {bookType: 'xlsx'});
    }


    createJsonFileDayType(dataArray: DayType[]) {
        const dataString = JSON.stringify(dataArray, null, 2);
        fs.writeFileSync('JSONDAYTYPE.json', dataString);
    }

    createJsonFileAssessment(assessment: Assessment) {
        const dataString = JSON.stringify(assessment, null, 0);
        fs.writeFileSync('JSONASSESSMENT.json', dataString);
    }

    createJsonFileGraph(dataArray: Graph[]) {
        const dataString = JSON.stringify(dataArray, null, 2);
        fs.writeFileSync('JSONGraph.json', dataString);
    }

    readJsonFileSnapShotDayType(data: DayType[]) {
        for (let i = 0; i < data.length; i++) {
            this.indexFileStore.insertIntoDayTypeStoreFromFile(data[i]);
        }
    }

    readJsonFileVisualizer(data: Graph[]) {
        for (let i = 0; i < data.length; i++) {
            // this.indexFileStore.insertIntoGraphStore(data[i]);
        }
    }
}
