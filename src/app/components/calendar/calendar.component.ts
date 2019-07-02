import {Component, OnInit, AfterContentInit} from '@angular/core';
import {DataService} from '../../providers/data.service';
import {RouteDataTransferService} from '../../providers/route-data-transfer.service';
import * as d3 from 'd3';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss']
})
export class CalendarComponent implements OnInit {


  dropDownBinList = [];
  selectedBinList = [];
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
  channelId = 0;
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
  graphDayAverage: any;
  graphBinAverage: any;
  plotData = [];

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
                hourValue: hourValue === -1 ? 23 : hourValue,
                date: this.day,
                channelName: this.value[column].name
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
              hourValue: hourValue === -1 ? 23 : hourValue,
              date: this.day,
              channelName: this.value[column].name
            });
            this.mainArray.push(this.dayArray);
            if (column === 0) {
              this.days.push({
                date: this.timeSeriesDayType[i - 1].getDate(),
                day: this.weekday[this.timeSeriesDayType[i - 1].getDay()],
                bin: this.binAllocation(this.dayArray, this.timeSeriesDayType[i - 1].getDay()),
                id: this.days.length
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
              bin: this.binAllocation(this.dayArray, this.timeSeriesDayType[i - 1].getDay()),
              id: this.days.length
            });
          }
        }
      }
      this.columnMainArray.push(this.mainArray);
    }
    this.allocateBins();
    this.plotGraph(0, 'Weekday');
    this.plotGraphAverage(0);
  }

  // disabled
  addSelectedDate(event) {
    this.days[event.date.id].bin = event.name;
    this.allocateBins();
    this.plotGraph(0, 'Weekday');
  }

  // disabled
  onSelectedRemove(event) {
    this.days[event.date.id].bin = 'Excluded';
    this.allocateBins();
    this.plotGraph(0, 'Weekday');
  }

  allocateBins() {
    this.selectedBinList = [];
    this.dropDownBinList = [];
    for (let i = 0; i < this.binList.length; i++) {
      const tempSelectedBinList = [];
      const tempdropDownBinList = [];
      for (let j = 0; j < this.days.length; j++) {
        if (this.days[j].bin === this.binList[i]) {
          tempSelectedBinList.push(this.days[j]);
        } else {
          tempdropDownBinList.push(this.days[j]);
        }
      }
      this.dropDownBinList.push(tempdropDownBinList);
      this.selectedBinList.push(tempSelectedBinList);
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
      const tempSumArray = [];
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
        tempSumArray.push({
          averageValue: singleSumArray,
          binValue: bigTempArray[i].binValue,
          entries: bigTempArray[i].binArray.length,
          channelName: this.value[column].name
        });
      }
      this.sumArray.push(tempSumArray);
    }
    this.plotGraphAverage(0);
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
      return 'Excluded';
    } else if (tempDayType < 5) {
      return 'Weekday';
    } else {
      return 'Weekend';
    }
  }

  plotGraph(channelId, plotSpecificDayType) {
    let name = '';
    this.plotData = [];
    if (this.columnMainArray.length > 0) {
      const timeSeries = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24];
      for (let i = 0; i < this.columnMainArray[channelId].length; i++) {
        const tempHourAverage = [];
        if (plotSpecificDayType !== null || plotSpecificDayType !== '') {
          if (this.days[i].bin === plotSpecificDayType) {
            for (let hour = 0; hour < this.columnMainArray[channelId][i].length; hour++) {
              tempHourAverage.push(this.columnMainArray[channelId][i][hour].hourAverage);
            }
          }
        } else {
          for (let hour = 0; hour < this.columnMainArray[channelId][i].length; hour++) {
            tempHourAverage.push(this.columnMainArray[channelId][i][hour].hourAverage);
          }
        }
        this.plotData.push({
          x: timeSeries,
          y: tempHourAverage,
          type: 'linegl',
          mode: 'lines',
          name: this.columnMainArray[channelId][i][0].date + ' ' + 'Day'
        });
        name = this.columnMainArray[channelId][i][channelId].channelName;
      }
      this.graphDayAverage = {
        data: this.plotData,
        layout: {
          hovermode: 'closest',
          autosize: true,
          title: name,
          xaxis: {
            autorange: true,
          },
          yaxis: {
            autorange: true,
            type: 'linear'
          }

        }
      };
    } else {
      this.graphDayAverage = {
        data: this.plotData,
        layout: {
          hovermode: 'closest',
          autosize: true,
          title: 'Plot',
          xaxis: {
            autorange: true,
          },
          yaxis: {
            autorange: true,
            type: 'linear'
          }
        }
      };
    }
  }

  plotGraphAverage(channelName) {
    let name = '';
    this.plotData = [];
    if (this.sumArray.length > 0) {
      const timeSeries = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24];
      for (let i = 0; i < this.sumArray[channelName].length; i++) {
        this.plotData.push({
          x: timeSeries,
          y: this.sumArray[0][i].averageValue,
          type: 'linegl',
          mode: 'lines',
          name: this.sumArray[0][i].binValue
        });
        name = this.sumArray[0][0].channelName;
      }
      this.graphBinAverage = {
        data: this.plotData,
        layout: {
          hovermode: 'closest',
          autosize: true,
          title: name,
          xaxis: {
            autorange: true,
          },
          yaxis: {
            autorange: true,
            type: 'linear'
          }

        }
      };
    } else {
      this.graphBinAverage = {
        data: this.plotData,
        layout: {
          hovermode: 'closest',
          autosize: true,
          title: 'Average Bin Graph',
          xaxis: {
            autorange: true,
          },
          yaxis: {
            autorange: true,
            type: 'linear'
          }
        }
      };
    }
  }

  ngAfterContentInit() {
    d3.select('p').style('color', 'Blue');
  }


  clicked(event) {
    /*d3.select(event.target).append('circle')
      .attr('cx', event.x)
      .attr('cy', event.y)
      .attr('r', this.radius)
      .attr('fill', 'red');*/
    const start = new Date('5/22/1991');
    const end = new Date('5/30/1991');

    const value = [0, 1, 2, 3, 4, 5, 6, 7, 8];
    const w = d3.utcMonday.count(start, end);
/*

    d3.select(event.target).append('g')
      .selectAll('rect')
      .data(value)
      .join('rect')
        .attr('width', 20)
        .attr('height', 20)
        .attr('x', value * 21)
        .attr('y',)
        .attr('fill', 'red');
*/

  }


}
