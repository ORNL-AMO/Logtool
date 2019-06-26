import {Component, OnInit} from '@angular/core';
import {DataService} from '../../providers/data.service';
import {RouteDataTransferService} from '../../providers/route-data-transfer.service';

@Component({
  selector: 'app-holder-day-type',
  templateUrl: './holder-day-type.component.html',
  styleUrls: ['./holder-day-type.component.scss']
})
export class HolderDayTypeComponent implements OnInit {

  specificBin = [];
  specificContent = [];
  // Shubham
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

  constructor(private data: DataService, private routeDataTransfer: RouteDataTransferService) {
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
                hourAverage: this.averageArray(this.valueArray),
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
              hourAverage: this.averageArray(this.valueArray),
              hourValue: hourValue === -1 ? 23 : hourValue
            });
            this.mainArray.push(this.dayArray);
            if (column === 0) {
              this.days.push({
                date: this.timeSeriesDayType[i - 1].getDate(),
                day: this.weekday[this.timeSeriesDayType[i - 1].getDay()],
                bin: 'Excluded',
                displayDate: this.timeSeriesDayType[i - 1].getDate()
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
            hourAverage: this.averageArray(this.valueArray),
            hourValue: hourValue === -1 ? 23 : hourValue
          });
          this.mainArray.push(this.dayArray);
          if (column === 0) {
            this.days.push({
              date: this.timeSeriesDayType[i - 1].getDate(),
              day: this.weekday[this.timeSeriesDayType[i - 1].getDay()],
              bin: 'Excluded',
              displayDate: this.timeSeriesDayType[i - 1].getDate()
            });
          }
        }
      }
      this.columnMainArray.push(this.mainArray);
      console.log(this.columnMainArray);
      console.log(this.days);
    }
    this.allocateBins();

    console.log('binContent');
    console.log(this.specificContent);
    console.log('specificBin');
    console.log(this.specificBin);
  }

  onUpdate(event) {
    console.log(event);
    /*this.days[event.target.id].bin = event.target.value;
    this.allocateBins();*/
  }

  onRemove(event) {
    console.log(event);
    /*this.days[this.day.indexOf(date)].bin = 'Excluded';
    this.allocateBins();*/
  }

  allocateBins() {
    for (let j = 0; j < this.binList.length; j++) {
      this.specificBin[j] = [];
      this.specificContent[j] = [];
    }
    for (let i = 0; i < this.days.length; i++) {
      for (let j = 0; j < this.binList.length; j++) {
        if (this.days[i].bin === this.binList[j]) {
          this.specificContent[j].push(this.days[i]);
        } else {
          this.specificBin.push(this.days[i]);
        }
      }
    }
  }

  // Calculate Day Type
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
  }

  // ????
  addType() {
    console.log('add');
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

}
