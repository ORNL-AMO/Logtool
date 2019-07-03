import {Component, OnInit, AfterContentInit} from '@angular/core';
import {DataService} from '../../providers/data.service';
import {RouteDataTransferService} from '../../providers/route-data-transfer.service';
import * as d3 from 'd3';

@Component({
  selector: 'app-holder-day-type',
  templateUrl: './holder-day-type.component.html',
  styleUrls: ['./holder-day-type.component.scss']
})
export class HolderDayTypeComponent implements OnInit {

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
    //console.log(this.days);
    this.clicked();
    //console.log(this.timeSeriesDayType);
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

  /*  ngAfterContentInit() {
      d3.select('p').style('color', 'Blue');
    }*/


  clicked() {

    const width3 = d3.select('#grid').attr('viewBox');
    console.log(width3, width3.split(','), width3.split(',')[2]);
    //const cell_dimension = width3.attr('width');
    const cell_dimension = width3.split(',')[2] * .1;


    const week = d3.timeFormat('%U');
    const daynum = d3.timeFormat('%d');
    const dayindex = d3.timeFormat('%w');

    /*
     const svg = d3.select('#grid').selectAll('text')
       .data(['M','T','W',"R",'F',"S",'S'])
 */

    //Parse date list into weeks and days
    const dayList = d3.nest()
      .key(function (d) {
        return week(new Date(d));
      })
      .key(function (d) {
        return daynum(new Date(d));
      })
      .entries(this.timeSeriesDayType);

    //Create week groups
    const svg = d3.select('#grid').selectAll('g')
      .data(dayList)
      .join('g')
      .attr('transform', function (d, i) {
        return 'translate( ' + 40 + ',' + (i * (cell_dimension + 5)) + ')';
      });

    //Attach squares to week groups
    const squares = svg.append('g')
      .selectAll('g')
      .data(d => d.values)
      .join('rect')
        .attr('width', cell_dimension)
        .attr('height', cell_dimension)
        .attr('x', function (d) {
            return dayindex(d.values[0]) * (cell_dimension + 5);
        })
      .attr('y', 0)
      .attr('fill', d => this.getColor(d.values[0]));

      console.log(squares);

/*    svg.selectAll('rect')
      .on('click', d => this.changeColor(event.target));*/

    // Text
    const dateText =  svg.append('g')
      .selectAll('g')
      .data(d => d.values)
      .join('text')
      .attr('x', function (d) {
        return dayindex(d.values[0]) * (cell_dimension + 5) + cell_dimension * (1 / 3);
      })
      .attr('y', function (d) {
        return cell_dimension - cell_dimension * (1 / 3);
      })
      .text(function (d) {
        return d.key;
      });

    const checkboxes = svg.append('g')
      .selectAll('g')
      .data(d => d.values)
      .join('rect')
      .attr('width', cell_dimension * .25)
      .attr('height', cell_dimension * .25)
      .attr('x', function (d) {
        return dayindex(d.values[0]) * (cell_dimension + 5) + cell_dimension * .7;
      })
      .attr('y', function (d) {
        return cell_dimension * .05;
      })
      .attr('fill', 'white');

     checkboxes.on('click', this.toggleColor(event));


  }

  bincolor = ['red', 'green', 'blue'];

  getColor(key) {
    const daynum = d3.timeFormat('%d')(key);
    const obj = this.days.find(obj => obj.date == daynum);
    return this.bincolor[this.binList.indexOf(obj.bin)];
  }

  changeColor(rect) {
    const active = d3.select(rect);
    const index = this.bincolor.indexOf(active.attr('fill'));
    if (index === this.bincolor.length - 1) {
      active.attr('fill', this.bincolor[0]);
    } else {
      active.attr('fill', this.bincolor[index + 1]);
    }
  }

const toggleColor = (function(){
  var currentColor = "white";

  return function(){
    currentColor = currentColor == "white" ? "magenta" : "white";
    d3.select(this).style("fill", currentColor);
  }
})();


}
