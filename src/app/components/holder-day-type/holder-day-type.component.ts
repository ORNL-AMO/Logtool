import {Component, OnInit, TemplateRef} from '@angular/core';
import {BsModalService, BsModalRef} from 'ngx-bootstrap/modal';
import {DataService} from '../../providers/data.service';
import * as d3 from 'd3';
import {IndexFileStoreService} from '../../providers/index-file-store.service';

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
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday'
  ];
  monthList = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
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
  displayBinList = [
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
  graphDayAverage: any;
  graphBinAverage: any;
  plotData = [];
  plotDataBinAverages = [];
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

  // Used for multi-Select on Calendar
  selectedDates: Set<any>;
  showBinMode = true;

  ngOnInit() {
    this.selectedDates = new Set([]);
    this.plotGraphDayAverage(0);
    this.plotGraphBinAverage(0);
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
      this.createGrid();
      // this.tempGraphPlot();
    });
  }

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
    this.calculateBinAverage(0);
  }

  // Calculate Day Type

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

  plotGraphDayAverage(channelId) {
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
        // console.log(this.columnMainArray[channelId][i][0]);
        this.plotData.push({
          x: timeSeries,
          y: tempHourAverage,
          type: 'linegl',
          mode: 'lines',
          name: this.monthList[this.columnMainArray[channelId][i][0].displayDate.getMonth()] + ' '
            + this.columnMainArray[channelId][i][0].displayDate.getDate(),
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
          xaxis: this.graphDayAverage.layout.xaxis,
          yaxis: this.graphDayAverage.layout.yaxis
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

  plotGraphBinAverage(channelName) {
    let name = '';
    this.plotDataBinAverages = [];
    if (this.sumArray.length > 0) {
      const timeSeries = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24];
      for (let i = 0; i < this.sumArray[channelName].length; i++) {
        this.plotDataBinAverages.push({
          x: timeSeries,
          y: this.sumArray[0][i].averageValue,
          type: 'linegl',
          mode: 'lines',
          name: this.sumArray[0][i].binValue,
          line: {
            color: this.sumArray[0][i].binColor,
          },

        });
        name = this.sumArray[0][0].channelName;
      }
      this.graphBinAverage = {
        data: this.plotDataBinAverages,
        layout: {
          hovermode: 'closest',
          autosize: true,
          title: name,
          xaxis: this.graphDayAverage.layout.xaxis,
          yaxis: this.graphDayAverage.layout.yaxis,
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
      this.graphBinAverage = {
        data: this.plotDataBinAverages,
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


// Calendar Functions **********************************************************************************************************************
// Set up functions only need to run once on import ************************

  createGrid() {
    const col = [0, 1, 2, 3, 4, 5, 6];
    const rows = [0, 1, 2, 3, 4];
    const cell_dimension = 20;
    d3.select('#grid').attr('width', '200px');
    d3.select('#calendar_panel').style('width', 400 + 'px');
    const weeks = d3.select('#grid').append('g')
      .selectAll('g')
      .data(rows)
      .join('g')
      .attr('transform', function (d, i) {
        return 'translate( ' + 15 + ',' + (i * (cell_dimension + 5) + cell_dimension) + ')';
      });

    // Attach bin squares to each day in each week
    const squares = weeks.append('g')
      .selectAll('g')
      .data(col)
      .join('rect')
      .attr('width', cell_dimension)
      .attr('height', cell_dimension)
      .attr('x', function (d) {
        return (d * (cell_dimension + 5));
      })
      .attr('y', 0)
      .attr('fill', 'lightgrey');


  }

  // Creates example square to explain integrations
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
      .attr('width', blockSize / 3)
      .attr('height', blockSize / 3)
      .attr('x', offset_x + 18)
      .attr('y', offset_y + 2)
      .attr('fill', 'white');


    check.on('click', function () {
      const newColor = check.attr('fill') === 'white' ? 'black' : 'white';
      check.attr('fill', newColor);
      const bold = check.attr('fill') === 'white' ? 'normal' : 'bold';
      boldText.attr('font-weight', bold);
    });

    examp.on('click', d => this.exampleClick(d3.event));

    // instructions
    const boldText = svg.append('text')
      .text('Toggle BOLD')
      .attr('font-size', '9px')
      .attr('x', offset_x + 5)
      .attr('y', offset_y - 5);

    boldText.on('click', function () {
      const newColor = check.attr('fill') === 'white' ? 'black' : 'white';
      check.attr('fill', newColor);
      const bold = check.attr('fill') === 'white' ? 'normal' : 'bold';
      boldText.attr('font-weight', bold);
    });

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
      sample.attr('stroke-width', '4');

    } else {

      const oldColor = sample.attr('fill');
      const colorList = this.binList.map(d => d.binColor);
      let index = colorList.indexOf(oldColor) + 1;
      if (index >= this.binList.length) {
        index = 0;
      }
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

// Create legend and calendar based on latest data **************************

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

    // Parsers, used to work with dates
    /*const week = d3.timeFormat('%U');     // returns week of year 0-53
    const daynum = d3.timeFormat('%d');   // returns day of month 01-31
    const dayindex = d3.timeFormat('%w'); // returns index of the day of the week [1,7]
    const month = d3.timeFormat('%m'); // returns month index 01.12  %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%    IMPLEMENT*/

    const week = d3.timeFormat('%W');     // returns week of year 0-53
    const daynum = d3.timeFormat('%d');   // returns day of month 01-31
    const dayindex = d3.timeFormat('%u'); // returns index of the day of the week [1,7]
    const month = d3.timeFormat('%m'); // returns month index 01.12  %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%    IMPLEMENT


    // nest data for grid formation
    // Will eventually add in month nest as well
    let weekcount = 0;
    const dayList = d3.nest()
      .key(function (d) {
        return month(new Date(d));
      })
      .key(function (d) {

        return week(new Date(d));
      })
      .key(function (d) {

        return daynum(new Date(d));
      })
      .entries(this.timeSeriesDayType);

    for (let i = 0; i < dayList.length; i++) {
      if (dayList[i].values.length > weekcount) {
        weekcount = dayList[i].values.length;
      }
    }

    // Calculate cell dimensions based on viewbox
    let cell_dimension = 100 / (weekcount);
    if (cell_dimension > 50) {
      cell_dimension = 50;
    }

    // set up offsets and transformations for squares
    const y_offset = 12 + cell_dimension;
    const spacing_y = 5;
    const x_offset = 10;
    const spacing_x = 5;
    const calSize = (7 * (cell_dimension + spacing_x) + 15) * dayList.length + x_offset * 2;
    d3.select('#grid').attr('width', calSize + 'px');

    if (calSize < 800) {
      d3.select('#calendar_panel').style('max-width', calSize + 200 + 'px');
    } else {
      d3.select('#calendar_panel').style('max-width', 1000 + 'px');
    }


    const monthindex = dayList.map(d => d.key);
    const monthList = ['January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'];
    const title2 = d3.select('#grid').append('g')
      .selectAll('text')
      .data(monthindex)
      .join('text')
      .attr('x', function (d, i) {
        return (7 * (cell_dimension + spacing_x) + 15) * (i + .5) - 20;
      })
      .attr('y', 12)
      .attr('font-size', '12px')
      .attr('font-weight', 'bold')
      .text(function (d) {
        return monthList[d - 1];
      });


    // Set up group offset for a month
    // i is number of months away from first month of data
    const months = d3.select('#grid').selectAll('g')
      .data(dayList)
      .join('g')
      .attr('transform', function (d, i) {
        return 'translate( ' + (7 * (cell_dimension + spacing_x) + 15) * i + ',' + 0 + ')';
      });


    // Print weekday titles for columns
    const weekdays = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];
    const title = months.append('g')
      .selectAll('g')
      .data(weekdays)
      .join('text')
      .attr('x', function (d, i) {
        return i * (cell_dimension + spacing_x) + cell_dimension / 4 + 7;
      })
      .attr('y', cell_dimension / 3 + 12)
      .attr('font-size', cell_dimension / 3 + 'px')
      .text(function (d) {
        return d;
      });


    // Create groups of weeks to hold days
    const weeks = months.append('g')
      .selectAll('g')
      .data(d => d.values)
      .join('g')
      .attr('transform', function (d, i) {
        return 'translate( ' + x_offset + ',' + (i * (cell_dimension + spacing_y) + cell_dimension / 3 + 17) + ')';
      });

    // Attach bin squares to each day in each week
    const squares = weeks.append('g')
      .selectAll('g')
      .data(d => d.values)
      .join('rect')
      .attr('width', cell_dimension)
      .attr('height', cell_dimension)
      .attr('x', function (d) {
        return (dayindex(d.values[0]) - 1) * (cell_dimension + spacing_x);
      })
      .attr('y', 0)
      .attr('fill', d => this.setColor(d.values[0]));

    // Attach toggle to each day in each week
    const checkboxes = weeks.append('g')
      .selectAll('g')
      .data(d => d.values)
      .join('rect')
      .attr('width', cell_dimension * .25)
      .attr('height', cell_dimension * .25)
      .attr('x', function (d) {
        return (dayindex(d.values[0]) - 1) * (cell_dimension + spacing_x) + cell_dimension * .7;
      })
      .attr('y', function (d) {
        return cell_dimension * .05;
      })
      .attr('fill', d => this.syncToggles(d));


    // Attach day numbers to each day in each week
    const dateText = weeks.append('g')
      .selectAll('g')
      .data(d => d.values)
      .join('text')
      .attr('x', function (d) {
        return (dayindex(d.values[0]) - 1) * (cell_dimension + spacing_x) + cell_dimension / 4;
      })
      .attr('y', function (d) {
        return cell_dimension - cell_dimension * (1 / 3);
      })
      .text(function (d) {
        return d.key;
      })
      .attr('fill', 'black')
      .attr('font-weight', 'bold')
      .attr('font-size', cell_dimension * .5 + 'px')
      .style('pointer-events', 'none')
      .style('user-select', 'none');

    // event handlers
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

      for (let i = 0; i < itemList.length; i++) {
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
      this.plotGraphDayAverage(0);

    } else {

      // console.log(this.timeSeriesDayType);
      this.cycleBin(event.target);
      /*console.log(d3.select(event.target).data()[0].values[0]);
      console.log(this.days);*/
    }
  }

  // move target from event into next bin in binList, calls movBins()
  cycleBin(rect) {
    const active = d3.select(rect);
    const color = active.attr('fill');

    // get index of next bin
    let index = this.binList.findIndex(bin => bin.binColor === color) + 1;
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
    this.plotGraphDayAverage(0);

  }

  // move element into target bin, updates this.days
  movBins(element, bin) {
    const active = d3.select(element);
    const key = active.data()[0].values[0];

    // find entry in days and update
    const found = this.days.findIndex(obj =>
      obj.date.getDate() === key.getDate() && obj.date.getMonth() === key.getMonth() && obj.date.getFullYear() === key.getFullYear()
    );

    this.days[found].bin = bin;

    const binDetails = this.binList.find(obj => obj.binName === bin);
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
    // console.log(data); console.log(this.days);
    const date = data.values[0];
    if (this.graphDayAverage === undefined) {
    } else {
      for (let graphDay = 0; graphDay < this.graphDayAverage.data.length; graphDay++) {
        this.days[graphDay].visible = this.graphDayAverage.data[graphDay].visible;
      }
    }
    const found = this.days.find(obj => obj.date.getDate() === date.getDate());
    if (this.days[this.days.indexOf(found)].stroke === 4) {
      return 'black';
    } else if (this.days[this.days.indexOf(found)].stroke === 1) {
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
    /*console.log(n.data()[0].values[0]);*/
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
      this.days[this.days.indexOf(found)].stroke = 5;
    } else {
      this.days[this.days.indexOf(found)].stroke = 1;
    }
    this.allocateBins();
    this.plotGraphDayAverage(0);
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

// ---------------------------------------------------------------------------------------------------------------------------------------
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
        /*console.log(event.graph, displayIndex);*/
      }
      this.plotGraphDayAverage(0);
    }
  }

  // Sorting Functions ***************************************************************

  // Currently just calls dayBinNavigation
  // Better way needed.
  resetBins() {
    this.dayTypeNavigation();
  }

  // Moves everything to 'EXCLUDED' BIN
  // redraws calendar and graph
  clearBins() {
    for (let i = 0; i < this.days.length; i++) {
      this.days[i].bin = 'EXCLUDED';
    }
    this.createCalendar();
    this.allocateBins();
    this.plotGraphDayAverage(0);
  }

// -----------------------------------------------------

  // Functions for adding Bin Types************************************
  showBinMod(template: TemplateRef<any>) {
    this.newBinName = '';
    this.newBinColor = '';
    this.modalRef = this.modalService.show(template);
  }

  addBinType() {
    if (this.newBinName === '') {
      alert('Please Enter a Name for the Bin');
      return;
    }

    if (!this.isColor(this.newBinColor.toLowerCase())) {
      alert('NOT A KNOWN COLOR. Please Enter a Valid Color');
      return;
    }

    const currentBins = this.binList.map(d => d.binName.toUpperCase());
    const currentColors = this.binList.map(d => d.binColor.toLowerCase());

    if (currentBins.indexOf(this.newBinName.toUpperCase()) > -1) {
      alert('Name Already in Use');
      return;
    }
    if (currentColors.indexOf(this.newBinColor.toLowerCase()) > -1) {
      alert('Color Already in Use');
      return;
    }

    this.binList.push({binName: this.newBinName.toUpperCase(), binColor: this.newBinColor.toLowerCase()});
    this.displayBinList.push({binName: this.newBinName.toUpperCase(), binColor: this.newBinColor.toLowerCase()});
    this.createLegend();
    this.modalRef.hide();

  }

  isColor(strColor) {
    const s = new Option().style;
    s.color = strColor;
    return s.color === strColor;
  }

  // ------------------------------------------------------------------

  realignGrid() {

    console.log(this.sumArray[0].length);
    document.getElementById('bin-panel').style.minHeight = this.sumArray === undefined ? '605px' :
                                                                    this.sumArray[0].length <= 1 ? '605px' :
                                                                    this.sumArray[0].length == 2  ?  '625px' : '652px';
    console.log(document.getElementById('bin-panel').style.minHeight);

  }


  plotShift(event) {
    console.log();
    if (event.target.value === 'bin') {
      this.showBinMode = false;
      this.calculateBinAverage(0);
    } else if (event.target.value === 'day') {
      this.showBinMode = true;
    }

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
        this.dataArrayColumns.push(this.data.curateData(this.dataInput[parseInt(day[0], 10)].dataArrayColumns[parseInt(day[1], 10)]));
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
                  displayDate: this.timeSeriesDayType[i],
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
                displayDate: this.timeSeriesDayType[i],
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
              hourValue: hourValue === -1 ? 23 : hourValue,
              date: this.day,
              displayDate: this.timeSeriesDayType[i],
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
          }
        }
        this.columnMainArray.push(this.mainArray);
      }
      this.allocateBins();
      this.plotGraphDayAverage(0);
      this.createCalendar();

    }
  }

  calculateBinAverage(channelId) {
    let tempArray = [];
    const bigTempArray = [];
    this.sumArray = [];
    let singleSumArray = [];
    for (let i = 0; i < this.binList.length; i++) {
      const binValue = this.binList[i].binName;
      for (let j = 0; j < this.days.length; j++) {

        if (binValue === this.days[j].bin) {
          tempArray.push(j);
        }
      }
      if (tempArray.length > 0) {
        bigTempArray.push({
          binArray: tempArray,
          binValue: binValue,
          count: tempArray.length,
          binColor: this.binList[i].binColor
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
          channelName: this.value[column].name,
          binColor: bigTempArray[i].binColor
        });
      }
      this.sumArray.push(tempSumArray);
    }
    //console.log(this.sumArray[0][0].binColor);
    this.realignGrid();
    this.plotGraphBinAverage(0);
  }
}

