import {Component, OnInit, TemplateRef} from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import {DataService} from '../../providers/data.service';
import * as d3 from 'd3';
import {IndexFileStoreService} from '../../providers/index-file-store.service';
import * as PlotlyJS from 'plotly.js/dist/plotly.js';
import {createElementCssSelector} from '@angular/compiler';

@Component({
  selector: 'app-holder-day-type',
  templateUrl: './holder-day-type.component.html',
  styleUrls: ['./holder-day-type.component.scss']
})
export class HolderDayTypeComponent implements OnInit {
  constructor(private data: DataService, private indexFileStore: IndexFileStoreService, private modalService: BsModalService) {
  }

  dropDownBinList = [];
  selectedBinList = [];
  dataInput = [];
  dataArrayColumns = [];
  value: any;
  timeSeriesDayType;
  timeSeriesFileDayType;
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
    {
      binName: 'EXCLUDED',
      binColor: 'red'
    },
    {
      binName: 'WEEKDAY',
      binColor: 'green'
    },
    {
      binName: 'WEEKEND',
      binColor: 'blue'
    }
  ];
  displayBinList = [{
    binName: 'EXCLUDED',
    binColor: 'red'
  },
    {
      binName: 'WEEKDAY',
      binColor: 'green'
    },
    {
      binName: 'WEEKEND',
      binColor: 'blue'
    }];
  graphDayAverage: any;
  graphBinAverage: any;
  plotData = [];
  binColor = ['red', 'green', 'blue'];
  temp5: any;
  fileSelector = [];
  temp6;
  columnSelector = [];
  columnSelectorList: any = [];
  dataFromDialog: any = [];
  tabs = [];

  // Used for adding bin types
  modalRef: BsModalRef;
  newBinName;
  newBinColor;
  // --------------------------

  // Used for multi-Select on Calendar
  selectedDates: Set<any>;
  // ------------------------------

  ngOnInit() {
    this.selectedDates = new Set([]);
    this.plotGraph(0);
    this.indexFileStore.viewDataDB().then(result => {
      this.dataFromDialog = result;
      this.tabs = [];
      for (let i = 0; i < this.dataFromDialog.length; i++) {
        this.tabs.push({
          name: this.dataFromDialog[i].name,
          id: this.dataFromDialog[i].id,
          tabId: i
        });
      }
      this.populateSpinner();
      // this.tempGraphPlot();
    });
  }

  // disabled
  /*  addSelectedDate(event) {
      console.log(this.days);
      this.days[event.date.id].bin = event.name;
      this.allocateBins();
      this.plotGraph(0);
    }

    // disabled
    onSelectedRemove(event) {
      this.days[event.date.id].bin = 'EXCLUDED';
      this.allocateBins();
      this.plotGraph(0);
    }*/

  allocateBins() {
    this.selectedBinList = [];
    this.dropDownBinList = [];
    for (let i = 0; i < this.binList.length; i++) {
      const tempSelectedBinList = [];
      const tempdropDownBinList = [];
      for (let j = 0; j < this.days.length; j++) {
        if (this.days[j].bin === this.binList[i].binName) {
          tempSelectedBinList.push(this.days[j]);
        } else {
          tempdropDownBinList.push(this.days[j]);
        }
      }
      this.dropDownBinList.push(tempdropDownBinList);
      this.selectedBinList.push(tempSelectedBinList);
    }
    this.calculateType(0);
  }

  // Calculate Day Type
  calculateType(channelId) {
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
      return 'EXCLUDED';
    } else if (tempDayType < 5) {
      return 'WEEKDAY';
    } else {
      return 'WEEKEND';
    }
  }

  plotGraph(channelId) {
    if (this.graphDayAverage === undefined) {
    } else {
      // console.log(this.graphDayAverage);
    }
    let name = '';
    this.plotData = [];
    if (this.columnMainArray.length > 0) {
      const timeSeries = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24];
      for (let i = 0; i < this.columnMainArray[channelId].length; i++) {
        const tempHourAverage = [];
        let thickness = 1;
        let color = '';
        for (let bins = 0; bins < this.displayBinList.length; bins++) {
          if (this.days[i].bin === this.displayBinList[bins].binName) {
            thickness = this.days[i].stroke;
            color = this.displayBinList[bins].binColor;
            if (this.columnMainArray[channelId][i].length < 24) {
              if (i === 0) {
                const temp = 24 - this.columnMainArray[channelId][i].length;
                for (let zero = 0; zero < temp; zero++) {
                  tempHourAverage.push(0);
                }
                for (let hour = 0; hour < this.columnMainArray[channelId][i].length; hour++) {
                  tempHourAverage.push(this.columnMainArray[channelId][i][hour].hourAverage);
                }
              } else if (i === this.columnMainArray[channelId].length - 1) {
                for (let hour = 0; hour < this.columnMainArray[channelId][i].length; hour++) {
                  tempHourAverage.push(this.columnMainArray[channelId][i][hour].hourAverage);
                }
                const temp = 24 - this.columnMainArray[channelId][i].length;
                for (let zero = 0; zero < temp; zero++) {
                  tempHourAverage.push(0);
                }
              }
            } else {
              for (let hour = 0; hour < this.columnMainArray[channelId][i].length; hour++) {
                tempHourAverage.push(this.columnMainArray[channelId][i][hour].hourAverage);
              }
            }
          }
        }
        this.plotData.push({
          x: timeSeries,
          y: tempHourAverage,
          type: 'linegl',
          mode: 'lines',
          name: this.columnMainArray[channelId][i][0].date + ' ' + 'Day',
          line: {
            color: color,
            width: thickness
          },
          visible: this.days[i].visible
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
        },
        config: {
          'showLink': false,
          'scrollZoom': true,
          'displayModeBar': true,
          'editable': false,
          'responsive': true,
          'displaylogo': false
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
        },
        config: {
          'showLink': false,
          'scrollZoom': true,
          'displayModeBar': true,
          'editable': false,
          'responsive': true,
          'displaylogo': false
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
          name: this.sumArray[0][i].binValue,

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


// Calendar Functions **********************************************************************************************************************

  // Set up functions only need to run once on import ************************

  // Creates example square to explain interations
  createExample() {
    const svg = d3.select('#example');
    const colors = ['red', 'green', 'blue'];

    const blockSize = 30;
    const offset_x = 35;
    const offset_y = 20;

    const examp = svg.append('rect')
      .data(colors)
      .attr('width', blockSize)
      .attr('height', blockSize)
      .attr('x', offset_x)
      .attr('y', offset_y)
      .attr('fill', 'blue');


    const check = svg.append('rect')
      .attr('width', blockSize / 3 )
      .attr('height', blockSize / 3 )
      .attr('x', offset_x + 18)
      .attr('y', offset_y + 2)
      .attr('fill', 'white');


    check.on('click', function() {
        const newColor = check.attr('fill') === 'white' ? 'black' : 'white';
        check.attr('fill', newColor);
        const bold = check.attr('fill') === 'white' ? 'normal' : 'bold';
        boldText.attr('font-weight', bold);
      });
    examp.on('click', d => this.exampleClick(d3.event) );

    // instructions
    const boldText = svg.append('text')
      .text('Toggle BOLD')
      .attr('font-size', '9px')
      .attr('x', offset_x - 10)
      .attr('y', offset_y - 5);

    svg.append('text')
      .text('Click: cycle bin')
      .attr('font-size', '9px')
      .attr('x', offset_x - 15)
      .attr('y', offset_y + 40);

    svg.append('text')
      .text('Ctl Click: multi-select')
      .attr('font-size', '9px')
      .attr('x', offset_x - 28)
      .attr('y', offset_y + 50);

  }

  // toggle stroke and color for example block (DOES NOT EFFECT ARRAYS)
  exampleClick(event) {
    const sample = d3.select(event.target);
    if (event.ctrlKey) {
      const select = sample.attr('stroke') === 'black' ? 'none' : 'black';
      sample.attr('stroke', select);

    } else {

      const oldColor = sample.attr('fill');
      const colorList = this.binList.map(d => d.binColor);
      let index = colorList.indexOf(oldColor) + 1;
      if (index >= this.binList.length ) { index = 0; }
      sample.attr('fill', this.binList[index].binColor);
    }
  }

  // get initial color based on default bin, returns purple on unknown
  setColor(key) {
    const obj = this.days.find(obj1 =>
      obj1.date.getDate() === key.getDate()
    );
    if (obj !== undefined) {
      return this.binList.find(bin => bin.binName === obj.bin).binColor;
    } else {
      return 'purple';
    }
  }

  // --------------------------------------------------------------------------

  // Create legend and calendar based on latest data ************************

  // Creates legend based on this.binList
  // NO event listeners
  createLegend() {
    const svg = d3.select('#legend');

    // Legend Title
    svg.append('text')
      .text('Legend')
      .attr('x', 10)
      .attr('y', 20);

    // Main Legend
    svg.selectAll('g').append('g')
      .data(d => this.binList)
      .join('text')
      .attr('x', 10)
      .attr('y', function (d, i) {
        return i * 20 + 40;
      })
      .attr('font-size', ' 12px ')
      .text(function (d) {
        return d.binName;
      });

    svg.selectAll('g').append('g')
      .data(this.binList)
      .join('rect')
      .attr('width', 15)
      .attr('height', 15)
      .attr('x', 80)
      .attr('y', function (d, i) {
        return i * 20 + 40 - 10;
      })
      .attr('fill', function (d) {
        return d.binColor;
      });
  }

  // Creates monday-based calendar using dates in
  createCalendar() {
    this.createLegend();
    this.createExample();

    // remove any items from previous draws
    d3.select('#grid').selectAll('*').remove();

    // Calculate cell dimensions based on viewbox
    const width3 = d3.select('#grid').attr('viewBox');
    const cell_dimension = width3.split(',')[2] * .075;

    // set up offsets and transformations for squares
    const y_offset = 50;
    const spacing_y = 8;
    const x_offset = 10;
    const spacing_x = 8;

    //Parsers, used to work with dates
    const week = d3.timeFormat('%U');     // returns week of year 0-53
    const daynum = d3.timeFormat('%d');   // returns day of month 01-31
    const dayindex = d3.timeFormat('%w'); // returns index of the day of the week [0,6]
    // not currently used
    const month = d3.timeFormat('%m'); // returns month index 01.12  %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%    IMPLEMENT

    // nest data for grid formation
    // Will eventually add in month nest as well
    const dayList = d3.nest()
      .key(function (d) {
        return week(new Date(d));
      })
      .key(function (d) {
        return daynum(new Date(d));
      })
      .entries(this.timeSeriesDayType);


    // Set up group offset for a month
    // i is the week number
    const svg = d3.select('#grid').selectAll('g')
      .data(dayList)
      .join('g')
      .attr('transform', function (d, i) {
        return 'translate( ' + x_offset + ',' +  (i * (cell_dimension + spacing_y) + y_offset) + ')';
      });

    // Display headers for Weekdays
    const weekdays = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];
    const header = d3.select('#grid').append('g')
      .selectAll('g')
      .data(weekdays)
      .attr('transform', 'translate(12 , 0 )')
      .join('text')
      .attr('x', function (d, i) { return i * (cell_dimension + spacing_x) + x_offset; })
      .attr('y', y_offset - 5)
      .attr('width', cell_dimension)
      .text(function (d) { return d; } );


    // Attach squares to week groups
    const squares = svg.append('g')
      .selectAll('g')
      .data(d => d.values)
      .join('rect')
      .attr('width', cell_dimension)
      .attr('height', cell_dimension)
      .attr('x', function (d) {
        return dayindex(d.values[0]) * (cell_dimension + spacing_x);
      })
      .attr('y', 0)
      .attr('fill', d => this.setColor(d.values[0]));
    svg.selectAll('rect')
      .on('click', d => this.clickHandler(event));

    // Text

    // attach dates to squares
    const dateText = svg.append('g')
      .selectAll('g')
      .data(d => d.values)
      .join('text')
      .attr('x', function (d) {
        return dayindex(d.values[0]) * (cell_dimension + spacing_x) + cell_dimension * (1 / 4);
      })
      .attr('y', function (d) {
        return cell_dimension - cell_dimension * (1 / 3);
      })
      .classed('bob', true)
      .style('pointer-events', 'none')
      .style('user-select', 'none')
      .text(function (d) {
        return d.key;
      })
      .attr('fill', 'white')
      .attr('font-weight', 'bold');

    // attach toggles to squares
    const checkboxes = svg.append('g')
      .selectAll('g')
      .data(d => d.values)
      .join('rect')
      .attr('width', cell_dimension * .25)
      .attr('height', cell_dimension * .25)
      .attr('x', function (d) {
        return dayindex(d.values[0]) * (cell_dimension + spacing_x) + cell_dimension * .7;
      })
      .attr('y', function (d) {
        return cell_dimension * .05;
      })
      .attr('fill', d => this.syncToggles(d)); // 'white');

    squares.on('click', d => this.clickHandler(event));
    checkboxes.on('click', d => this.toggleBold(event.target));
  }
  // --------------------------------------------------------------------------


// General Event Handlers ****************************************************

  // handle clicks and ctrl-clicks on squares
  // Calls cycleBin(), movBins(), and toggleSelect()
  clickHandler(event) {
    // const active = d3.select(event.target);
    // if in select mode toggle selection
    if (event.ctrlKey) {
      this.toggleSelect(event.target);
    } else if (this.selectedDates.has(event.target)) {
      // if in selection sync and cycle
      console.log('Inside handler');
      // sync
        const syncTarget = d3.select(event.target);
        let binIndex = this.binList.indexOf(this.binList.find(bin => bin.binColor === syncTarget.attr('fill'))) + 1;
        if (isNaN(binIndex) || binIndex < 0) {
          console.log('Error: out of bounds');
          return;
        } else if (binIndex >= this.binList.length) {
          binIndex = 0;
        }
        const syncBin = this.binList[binIndex].binName;
        const itemList = Array.from(this.selectedDates);
        console.log(itemList, syncBin);
        for ( let i = 0; i < itemList.length ; i++) {
            this.movBins(itemList[i], syncBin);
        }

        // Replot graphs
        if (this.graphDayAverage === undefined) {
          } else {
            for (let graphDay = 0; graphDay < this.graphDayAverage.data.length; graphDay++) {
                this.days[graphDay].visible = this.graphDayAverage.data[graphDay].visible;
            }
        }

      // replot
      this.allocateBins();
      this.plotGraph(0);

    } else {
      this.cycleBin(event.target);
    }
  }

  // move target from event into next bin in binList, calls movBins()
  cycleBin(rect) {
    const active = d3.select(rect);
    const color = active.attr('fill');
    const currBin = this.binList.find(bin => bin.binColor === color );
    let index = this.binList.indexOf(currBin) + 1;

    if (index === this.binList.length) {
      index = 0;
    }
    const nextBin = this.binList[index].binName;

    this.movBins(rect, nextBin);


    // replot graphs
    if (this.graphDayAverage === undefined) {
    } else {
      for (let graphDay = 0; graphDay < this.graphDayAverage.data.length; graphDay++) {
        this.days[graphDay].visible = this.graphDayAverage.data[graphDay].visible;
      }
    }

    this.allocateBins();
    this.plotGraph(0);

  }

  // move element into target bin, updates this.days
  movBins(element, bin) {
    // .log('in movBins', target, syncBin);
    const active =  d3.select(element);
    const key = active.data()[0].values[0];
    // find entry in days and update
    const found = this.days.find(obj => obj.date.getDate() === key.getDate());
    this.days[this.days.indexOf(found)].bin = bin;

    const binDetails = this.binList.find( obj => obj.binName === bin);
    active.attr('fill', binDetails.binColor);
}

  // resets selectedDates
  clearSelection() {
    this.selectedDates.clear();
  }
// --------------------------------------------------------------------------

// Toggle Functions *********************************************************
  // Sync toggle status on redraw
  syncToggles(data) {
    console.log(data); console.log(this.days);
    const date = data.values[0];
    if (this.graphDayAverage === undefined) {
    } else {
      for (let graphDay = 0; graphDay < this.graphDayAverage.data.length; graphDay++) {
        this.days[graphDay].visible = this.graphDayAverage.data[graphDay].visible;
      }
    }
    const found = this.days.find(obj => obj.date.getDate() === date.getDate());
    if ( this.days[this.days.indexOf(found)].stroke === 4 ) {
      return 'black';
    } else if ( this.days[this.days.indexOf(found)].stroke === 1 ) {
      return 'white';
    } else {
      return 'yellow';
    }
  }

  // add/removes item from selectedDates set
  toggleSelect(rect) {
    const n = d3.select(rect);
    if (this.selectedDates.has(rect)) {
      this.selectedDates.delete(rect);
      n.attr('stroke', 'none');
    } else {
      this.selectedDates.add(rect);
      n.attr('stroke', 'black');
      n.attr('stroke-width', '4');
    }
    console.log(n.data()[0].values[0]);
  }

  // Toggles boldness of line, indicated by checkbox in squares.
  toggleBold(box) {
    if (this.graphDayAverage === undefined) {
    } else {
      for (let graphDay = 0; graphDay < this.graphDayAverage.data.length; graphDay++) {
        this.days[graphDay].visible = this.graphDayAverage.data[graphDay].visible;
      }
    }
    const active = d3.select(box);
    const newColor = active.attr('fill') === 'white' ? 'black' : 'white';
    active.attr('fill', newColor);

    const currIndex = this.binList.find(bin => bin.binColor === active.attr('fill'));
    const key = active._groups[0][0].__data__.values[0];
    const found = this.days.find(obj => obj.date.getDate() === key.getDate());

    if (active.attr('fill') === 'black') {
      this.days[this.days.indexOf(found)].stroke = 4;
    } else {
      this.days[this.days.indexOf(found)].stroke = 1;
    }
    this.allocateBins();
    this.plotGraph(0);
  }
// --------------------------------------------------------------------------

// ---------------------------------------------------------------------------------------------------------------------------------------

// Functions related to File / Column Selection ********************************************************************************************
  populateSpinner() {
    this.fileSelector = [];
    for (let i = 0; i < this.tabs.length; i++) {
      const filename = this.tabs[i].name;
      this.fileSelector.push({
        name: filename,
        identifier: i
      });
    }
  }

  fileSelectorEvent(event) {
    this.columnSelectorList = [];
    this.columnSelector = [];
    const currentSelectedFile = event.target.value;
    const tempHeader = this.dataFromDialog[parseInt(currentSelectedFile, 10)].selectedHeader;
    for (let i = 0; i < tempHeader.length; i++) {
      if (!(this.dataFromDialog[currentSelectedFile].dataArrayColumns[i][0] instanceof Date)) {
        this.columnSelector.push({
          name: tempHeader[i].headerName,
          identifier: `${currentSelectedFile},${i}`
        });
      } else if (this.dataFromDialog[currentSelectedFile].dataArrayColumns[i][0] instanceof Date) {
        this.timeSeriesFileDayType = `${currentSelectedFile},${i}`;
      }
    }
  }

  columnSelectorEvent(event) {
    this.columnSelectorList.pop();
    this.columnSelectorList.push({
      name: this.columnSelector[event.target.options.selectedIndex].name,
      value: event.target.value
    });
  }

  dayTypeNavigation() {
    this.columnMainArray = [];
    this.valueArray = [];
    this.dayArray = [];
    this.mainArray = [];
    this.dataArrayColumns = [];
    this.days = [];
    this.dataInput = [];
    this.dropDownBinList = [];
    this.selectedBinList = [];
    if (this.columnSelectorList.length === 0) {
      alert('Please select Column');
    } else {
      this.data.currentdataInputArray.subscribe(input => this.dataInput = input);
      this.value = this.columnSelectorList;
      const timeSeries = this.timeSeriesFileDayType.split(',');
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
                  date: this.timeSeriesDayType[i - 1],
                  day: this.weekday[this.timeSeriesDayType[i - 1].getDay()],
                  bin: this.binAllocation(this.dayArray, this.timeSeriesDayType[i - 1].getDay()),
                  id: this.timeSeriesDayType[i - 1].getDate() + '' + this.days.length,
                  stroke: 1,
                  visible: true
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
                date: this.timeSeriesDayType[i - 1],
                day: this.weekday[this.timeSeriesDayType[i - 1].getDay()],
                bin: this.binAllocation(this.dayArray, this.timeSeriesDayType[i - 1].getDay()),
                id: this.timeSeriesDayType[i - 1].getDate() + '' + this.days.length,
                stroke: 1,
                visible: true
              });
            }
          }
        }
        this.columnMainArray.push(this.mainArray);
      }
      this.allocateBins();
      this.plotGraph(0);
      // this.plotGraphAverage(0);
      // console.log(this.days);
      this.createCalendar();
    }// console.log(this.timeSeriesDayType);
  }

// ---------------------------------------------------------------------------------------------------------------------------------------

  /*
    tempGraphPlot() {
      this.graphDayAverage = document.getElementById('myDiv');
      const x = [1, 2, 3, 4, 5, 6];
      const y = [1, 2, 3, 2, 3, 4];
      const y2 = [1, 4, 7, 6, 1, 5];
      const colors = [['#5C636E', '#5C636E', '#5C636E', '#5C636E', '#5C636E', '#5C636E'],
          ['#393e46', '#393e46', '#393e46', '#393e46', '#393e46', '#393e46']],
        data = [{
          x: x, y: y, type: 'scatter',
          mode: 'line', line: {color: '#5C636E'}, marker: {size: 16, color: colors[0]},
          visible: 'legendonly'
        },
          {
            x: x, y: y2, type: 'scatter',
            mode: 'line', line: {color: '#393e46'}, marker: {size: 16, color: colors[1]}
          }],
        layout = {
          showlegend: true,
          hovermode: 'closest',
          title: 'Andrew'
        };

      PlotlyJS.newPlot('myDiv', data, layout);

      this.graphDayAverage.on('plotly_click', (data) => {
        let pn = '';
        let tn = '';
        let colors = [];
        for (let i = 0; i < data.points.length; i++) {
          pn = data.points[i].pointNumber;
          tn = data.points[i].curveNumber;
          colors = data.points[i].data.marker.color;
        }
        colors[pn] = '#C54C82';
        const update = {'marker': {color: colors, size: 16}};
        PlotlyJS.restyle('myDiv', update, [tn]);
      });

      PlotlyJS.on('plotly_legendclick',  (data) => {
        const trColors = [['#5C636E', '#5C636E', '#5C636E', '#5C636E', '#5C636E', '#5C636E'],
          ['#393e46', '#393e46', '#393e46', '#393e46', '#393e46', '#393e46']];
        const update = {'marker': {color: trColors[data.curveNumber], size: 16}};
        PlotlyJS.restyle('myDiv', update, [data.curveNumber]);
        return false;
      });
    }*/
  binToggled(event: { name: string; graph: boolean }) {
    // if graph is undefined do nothing.
    if (this.graphDayAverage === undefined) {
    } else {
      for (let graphDay = 0; graphDay < this.graphDayAverage.data.length; graphDay++) {
        this.days[graphDay].visible = this.graphDayAverage.data[graphDay].visible;
      }

      const displayIndex = this.displayBinList.map(d => d.binName).indexOf(event.name);
      const storeIndex = this.binList.map(d => d.binName).indexOf(event.name);
      // If yes and not already in
      if (event.graph && displayIndex < 0) {
        this.displayBinList.push(this.binList[storeIndex]);
      } else if (!event.graph && displayIndex >= 0) {
        this.displayBinList.splice(displayIndex, 1);
      } else {
        console.log(event.graph, displayIndex);
      }
      this.plotGraph(0);
    }
  }

  // Sorting Functions *********************************************************************************************************************

  // Currently just calls dayBinNavigation
  // Better way needed.
  resetBins() {
     this.dayTypeNavigation();
  }

  // Moves everything to 'EXCLUDED' BIN
  // redraws calendar and graph
  clearBins() {
    for (let i = 0 ; i < this.days.length; i++) {
      this.days[i].bin = 'EXCLUDED';
    }
    this.createCalendar();
    this.allocateBins();
    this.plotGraph(0);
  }

// ---------------------------------------------------------------------------------------------------------------------------------------

  // Functions for adding Bin Types*********************************************************************************************************
  showBinMod(template: TemplateRef<any>) {
      this.newBinName = '' ;
      this.newBinColor = '' ;
      this.modalRef = this.modalService.show(template);
  }

  addBinType() {
    if ( this.newBinName === '') {
      alert('Please Enter a Name for the Bin');
      return;
    }

    if (! this.isColor(this.newBinColor.toLowerCase()) ) {
       alert('NOT A KNOWN COLOR. Please Enter a Valid Color');
       return;
    }

    const currentBins = this.binList.map(d => d.binName.toUpperCase());
    const currentColors = this.binList.map(d => d.binColor.toLowerCase());

    if (currentBins.indexOf(this.newBinName.toUpperCase()) > -1)  { alert('Name Already in Use'); return; }
    if (currentColors.indexOf(this.newBinColor.toLowerCase()) > -1) { alert('Color Already in Use'); return; }

    this.binList.push({binName: this.newBinName.toUpperCase(), binColor: this.newBinColor.toLowerCase() });
    this.displayBinList.push({binName: this.newBinName.toUpperCase(), binColor: this.newBinColor.toLowerCase() });

    console.log('BINS:', this.binList);
    this.createLegend();
    this.modalRef.hide();

  }

  isColor(strColor) {
    const s = new Option().style;
    s.color = strColor;
    return s.color === strColor;
  }

  // ---------------------------------------------------------------------------------------------------------------------------------------
}

