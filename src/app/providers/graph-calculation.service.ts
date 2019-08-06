import {Injectable} from '@angular/core';
import {DataService} from './data.service';

@Injectable({
  providedIn: 'root'
})
export class GraphCalculationService {
  weekday = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday'
  ];

  constructor(private data: DataService) {
  }

  averageCalculation(dataFromFile, timeSeriesDayType, valueColumnCount, saveLoadMode) {
    let valueArray = [];
    let dayArray = [];
    let mainArray = [];
    let dataFromFileColumn = [];
    let particularDay: any;
    let particularHour: any;
    // Return Values
    const days = [];
    const columnMainArray = [];

    for (let column = 0; column < valueColumnCount.length; column++) {
      dataFromFileColumn = [];
      mainArray = [];
      const columnPointer = valueColumnCount[column].value.split(',');
      if (saveLoadMode) {
        dataFromFileColumn = dataFromFile;
      } else {
        dataFromFileColumn.push(this.data.curateData(dataFromFile[parseInt(columnPointer[0],
          10)].dataArrayColumns[parseInt(columnPointer[1], 10)]));
      }
      for (let i = 0; i < timeSeriesDayType.length; i++) {
        if (timeSeriesDayType[i] === undefined) {
          continue;
        } else {
          if (i === 0) {
            particularDay = timeSeriesDayType[i].getDate();
            particularHour = timeSeriesDayType[i].getHours();
            valueArray.push(dataFromFileColumn[0][i]);
          } else {
            if (particularDay === timeSeriesDayType[i].getDate()) {
              if (particularHour === timeSeriesDayType[i].getHours()) {
                valueArray.push(dataFromFileColumn[0][i]);
              } else {
                const hourValue = timeSeriesDayType[i].getHours() - 1;
                dayArray.push({
                  valueArray: valueArray,
                  hourAverage: this.averageArray(valueArray),
                  hourValue: hourValue === -1 ? 23 : hourValue,
                  date: particularDay,
                  displayDate: timeSeriesDayType[i],
                  channelName: valueColumnCount[column].name
                });
                valueArray = [];
                particularHour = timeSeriesDayType[i].getHours();
                valueArray.push(dataFromFileColumn[0][i]);
              }
            } else {
              const hourValue = timeSeriesDayType[i].getHours() - 1;
              dayArray.push({
                valueArray: valueArray,
                hourAverage: this.averageArray(valueArray),
                hourValue: hourValue === -1 ? 23 : hourValue,
                date: particularDay,
                displayDate: timeSeriesDayType[i],
                channelName: valueColumnCount[column].name
              });
              mainArray.push(dayArray);
              if (column === 0) {
                days.push({
                  date: timeSeriesDayType[i - 1],
                  day: this.weekday[timeSeriesDayType[i - 1].getDay()],
                  bin: this.binAllocation(dayArray, timeSeriesDayType[i - 1].getDay()),
                  id: timeSeriesDayType[i - 1].getDate() + '' + timeSeriesDayType[i - 1].getMonth() +
                    '' + timeSeriesDayType[i - 1].getFullYear(),
                  stroke: 1,
                  visible: true
                });
              }
              dayArray = [];
              valueArray = [];
              particularHour = timeSeriesDayType[i].getHours();
              valueArray.push(dataFromFileColumn[0][i]);
              particularDay = timeSeriesDayType[i].getDate();
            }
          }
          if (i === timeSeriesDayType.length - 1) {
            const hourValue = timeSeriesDayType[i].getHours() - 1;
            dayArray.push({
              valueArray: valueArray,
              hourAverage: this.averageArray(valueArray),
              hourValue: hourValue === -1 ? 23 : hourValue,
              date: particularDay,
              displayDate: timeSeriesDayType[i],
              channelName: valueColumnCount[column].name
            });
            mainArray.push(dayArray);
            // console.log(i, timeSeriesDayType[i]);
            if (column === 0) {
              days.push({
                date: timeSeriesDayType[i],
                day: this.weekday[timeSeriesDayType[i].getDay()],
                bin: this.binAllocation(dayArray, timeSeriesDayType[i].getDay()),
                id: timeSeriesDayType[i].getDate() + '' + timeSeriesDayType[i].getMonth() +
                  '' + timeSeriesDayType[i].getFullYear(),
                stroke: 1,
                visible: true
              });
              // console.log(i, days);
            }
/*<<<<<<< Updated upstream
=======
            dayArray = [];
            valueArray = [];
            particularHour = timeSeriesDayType[i].getHours();
            valueArray.push(dataFromFileColumn[0][i]);
            particularDay = timeSeriesDayType[i].getDate();
          }
        }
        if (i === timeSeriesDayType.length - 1) {
          const hourValue = timeSeriesDayType[i].getHours() - 1;
          dayArray.push({
            valueArray: valueArray,
            hourAverage: this.averageArray(valueArray),
            hourValue: hourValue === -1 ? 23 : hourValue,
            date: particularDay,
            displayDate: timeSeriesDayType[i],
            channelName: valueColumnCount[column].name
          });
          mainArray.push(dayArray);
          //console.log(i, timeSeriesDayType[i]);
          if (column === 0) {
            days.push({
              date: timeSeriesDayType[i],
              day: this.weekday[timeSeriesDayType[i].getDay()],
              bin: this.binAllocation(dayArray, timeSeriesDayType[i].getDay()),
              id: timeSeriesDayType[i].getDate() + '' + timeSeriesDayType[i].getMonth() +
                '' + timeSeriesDayType[i].getFullYear(),
              stroke: 1,
              visible: true
            });
            //console.log(i, days);
>>>>>>> Stashed changes*/
          }
        }

      }
      columnMainArray.push(mainArray);
    }

    const returnObject = {
      columnMainArray: columnMainArray,
      days: days,
      loadDataFromFile: dataFromFileColumn,
      loadTimeSeriesDayType: timeSeriesDayType,
      loadValueColumnCount: valueColumnCount
    };
    return returnObject;
  }

  calculateBinAverage(channelId, binList, days, selectedColumnPointer, columnMainArray) {
    let tempArray = [];
    const bigTempArray = [];
    const sumArray = []; // Return SumArray
    let singleSumArray = [];
    for (let i = 0; i < binList.length; i++) {
      const binValue = binList[i].binName;
      for (let j = 0; j < days.length; j++) {

        if (binValue === days[j].bin) {
          tempArray.push(j);
        }
      }
      if (tempArray.length > 0) {
        bigTempArray.push({
          binArray: tempArray,
          binValue: binValue,
          count: tempArray.length,
          binColor: binList[i].binColor
        });
      }
      tempArray = [];
    }
    if (selectedColumnPointer !== undefined) {
      for (let column = 0; column < selectedColumnPointer.length; column++) {
        const tempSumArray = [];
        for (let i = 0; i < bigTempArray.length; i++) {
          singleSumArray = [];
          for (let j = 0; j < bigTempArray[i].binArray.length; j++) {
            const binArray = bigTempArray[i].binArray;
            const mainTemp = columnMainArray[column][binArray[j]];
            for (let l = 0; l < mainTemp.length; l++) {
              let sum = 0;
              const value = singleSumArray[mainTemp[l].hourValue] === undefined
              || singleSumArray[mainTemp[l].hourValue] === null ? 0 : singleSumArray[mainTemp[l].hourValue];
              sum = sum + value + mainTemp[l].hourAverage;
              singleSumArray[mainTemp[l].hourValue] = sum;
            }
          }
          singleSumArray = singleSumArray.map((element) => {
            return (element / bigTempArray[i].binArray.length).toFixed(2);
          });
          tempSumArray.push({
            averageValue: singleSumArray,
            binValue: bigTempArray[i].binValue,
            entries: bigTempArray[i].binArray.length,
            channelName: selectedColumnPointer[column].name,
            binColor: bigTempArray[i].binColor
          });
        }
        sumArray.push(tempSumArray);
      }
    }
    return sumArray;
  }

  averageArray(input) {
    let sum = 0;
    for (let i = 0; i < input.length; i++) {
      if (input[i] === undefined || input[i] === '' || input[i] === null) {
      } else {
        sum = sum + parseFloat(input[i]);
      }
    }
    return sum / input.length;
  }

  binAllocation(tempDayArray, tempDayType): string {
    if (tempDayArray.length < 20) {
      return 'EXCLUDED';
    } else if (tempDayType <= 5 && tempDayType !== 0) {
      return 'WEEKDAY';
    } else {
      return 'WEEKEND';
    }
  }

}
