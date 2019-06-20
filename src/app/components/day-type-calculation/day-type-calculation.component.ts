import {Component, OnInit} from '@angular/core';
import {DataService} from '../../providers/data.service';
import {RouteDataTransferService} from '../../providers/route-data-transfer.service';


@Component({
  selector: 'app-day-type-calculation',
  templateUrl: './day-type-calculation.component.html',
  styleUrls: ['./day-type-calculation.component.scss']
})
export class DayTypeCalculationComponent implements OnInit {

  constructor(private data: DataService, private routeDataTransfer: RouteDataTransferService) {
  }

  dataInput = [];
  dataArrayColumns = [];
  value = [];
  timeSeriesDayType;
  day = 0;
  hour = 0;
  valueArray = [];
  dayArray = [];
  mainArray = [];
  days = [];
  columnMainArray = [];
  sumArray = [];
  weekday = [
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
    'Sunday'
  ];
  binList = [
    'Excluded',
    'Weekday',
    'Weekend'
  ];

  static averageArray(input) {
    let sum = 0;
    for (let i = 0; i < input.length; i++) {
      if (input[i] === undefined || input[i] === '' || input[i] === null) {
      } else {
        sum = sum + parseFloat(input[i]);
      }
    }
    return sum / input.length;
  }

  ngOnInit() {
    this.data.currentdataInputArray.subscribe(input => this.dataInput = input);
    this.value = this.routeDataTransfer.storage.value;
    const timeSeries = this.routeDataTransfer.storage.timeSeriesDayType.split(',');
    for (let column = 0; column < this.value.length; column++) {
      this.dataArrayColumns = [];
      this.mainArray = [];
      const day = this.value[column].value.split(',');
      this.dataArrayColumns.push(this.dataInput[parseInt(day[0], 10)].dataArrayColumns[parseInt(day[1], 10)]);
      this.timeSeriesDayType = this.dataInput[parseInt(timeSeries[0], 10)].dataArrayColumns[parseInt(timeSeries[1], 10)];
      for (let i = 0; i < this.timeSeriesDayType.length; i++) {
        if (i === 0) {
          this.day = this.timeSeriesDayType[i].getDate();
          this.hour = this.timeSeriesDayType[i].getHours();
          this.valueArray.push(this.dataArrayColumns[0][i]);
        } else {
          if (this.day === this.timeSeriesDayType[i].getDate()) {
            if (this.hour === this.timeSeriesDayType[i].getHours()) {
              this.valueArray.push(this.dataArrayColumns[0][i]);
            } else {
              const hourValue = this.timeSeriesDayType[i].getHours() - 1;
              this.dayArray.push({
                valueArray: this.valueArray,
                hourAverage: DayTypeCalculationComponent.averageArray(this.valueArray),
                hourValue: hourValue === -1 ? 23 : hourValue
              });
              this.valueArray = [];
              this.hour = this.timeSeriesDayType[i].getHours();
              this.valueArray.push(this.dataArrayColumns[0][i]);
            }
          } else {
            const hourValue = this.timeSeriesDayType[i].getHours() - 1;
            this.dayArray.push({
              valueArray: this.valueArray,
              hourAverage: DayTypeCalculationComponent.averageArray(this.valueArray),
              hourValue: hourValue === -1 ? 23 : hourValue
            });
            this.mainArray.push(this.dayArray);
            if (column === 0) {
              this.days.push({
                date: this.timeSeriesDayType[i - 1].getDate(),
                day: this.weekday[this.timeSeriesDayType[i - 1].getDay()],
                bin: 'Excluded'
              });
            }
            this.dayArray = [];
            this.valueArray = [];
            this.hour = this.timeSeriesDayType[i].getHours();
            this.valueArray.push(this.dataArrayColumns[0][i]);
            this.day = this.timeSeriesDayType[i].getDate();
          }

        }
        if (i === this.timeSeriesDayType.length - 1) {
          const hourValue = this.timeSeriesDayType[i].getHours() - 1;
          this.dayArray.push({
            valueArray: this.valueArray,
            hourAverage: DayTypeCalculationComponent.averageArray(this.valueArray),
            hourValue: hourValue === -1 ? 23 : hourValue
          });
          this.mainArray.push(this.dayArray);
          if (column === 0) {
            this.days.push({
              date: this.timeSeriesDayType[i - 1].getDate(),
              day: this.weekday[this.timeSeriesDayType[i - 1].getDay()],
              bin: 'Excluded'
            });
          }
        }
      }
      this.columnMainArray.push(this.mainArray);
    }
  }

  calculateType() {
    let tempArray = [];
    const bigTempArray = [];
    this.sumArray = [];
    let singleSumArray = [];
    for (let i = 0; i < this.binList.length; i++) {
      const binValue = this.binList[i];
      for (let j = 0; j < this.days.length; j++) {
        if (binValue === this.days[j].bin) {
          tempArray.push(j);
        }
      }
      if (tempArray.length > 0) {
        bigTempArray.push({
          binArray: tempArray,
          binValue: binValue,
          count: tempArray.length
        });
      }
      tempArray = [];
    }
    for (let column = 0; column < this.value.length; column++) {
      for (let i = 0; i < bigTempArray.length; i++) {
        singleSumArray = [];
        for (let j = 0; j < bigTempArray[i].binArray.length; j++) {
          const binArray = bigTempArray[i].binArray;
          const mainTemp = this.columnMainArray[column][binArray[j]];
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
        this.sumArray.push({
          averageValue: singleSumArray,
          binValue: bigTempArray[i].binValue,
          entries: bigTempArray[i].binArray.length,
          columnName: this.value[column].name
        });
      }
    }
    console.log(this.sumArray);
  }

  changeSelector(event) {
    this.days[event.target.id].bin = event.target.value;
  }
}