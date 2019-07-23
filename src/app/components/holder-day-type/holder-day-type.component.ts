import {Component, OnInit, TemplateRef} from '@angular/core';
import {BsModalService, BsModalRef} from 'ngx-bootstrap/modal';
import {DataService} from '../../providers/data.service';
import * as d3 from 'd3';
import {IndexFileStoreService} from '../../providers/index-file-store.service';
import {ConfirmationModalComponent} from '../confirmation-modal/confirmation-modal.component';
import {GraphCreationService} from '../../providers/graph-creation.service';
import {GraphCalculationService} from '../../providers/graph-calculation.service';
import {ExportCSVService} from '../../providers/export-csv.service';


@Component({
  selector: 'app-holder-day-type',
  templateUrl: './holder-day-type.component.html',
  styleUrls: ['./holder-day-type.component.scss']
})
export class HolderDayTypeComponent implements OnInit {
  constructor(private data: DataService, private graphCalculation: GraphCalculationService,
              private graphCreation: GraphCreationService, private indexFileStore: IndexFileStoreService,
              private modalService: BsModalService, private exportCsv: ExportCSVService) {
  }

  scrollActive = false;
  target: any;
  start_X = 0;
  start_Y = 0;

  selectedBinList = [];
  selectedColumnPointer: any;
  timeSeriesDayType;
  timeSeriesFileDayType;
  days = [];
  columnMainArray = [];
  sumArray = [];
  binList = [];
  displayBinList = [];
  defaultBinList = [
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
  annotationListDayAverage = [];
  annotationListBinAverage = [];
  globalYAverageDay = [];
  globalYAverageBin = [];
  toggleRelayoutDay = false;
  binColor = ['red', 'green', 'blue'];
  temp5: any;
  fileSelector = [];
  temp6;
  columnSelector = [];
  columnSelectorList: any = [];
  dataFromInput: any = [];
  tabs = [];

  ammo = '';
  mac: boolean;
  // Used for adding bin types
  modalRef: BsModalRef;
  newBinName;
  newBinColor;

  // Used for multi-Select on Calendar
  selectedDates: Set<any>;
  showBinMode = true;

  ngOnInit() {
    this.mac = window.navigator.platform.includes('Mac') || window.navigator.platform.includes('mac');
    this.selectedDates = new Set([]);
    this.plotGraphDayAverage(0);
    this.plotGraphBinAverage(0);
    this.indexFileStore.viewDataDB().then(result => {
      this.dataFromInput = result;
      this.tabs = [];
      for (let i = 0; i < this.dataFromInput.length; i++) {
        this.tabs.push({
          name: this.dataFromInput[i].name,
          id: this.dataFromInput[i].id,
          tabId: i
        });
      }
      this.populateSpinner();
      this.createGrid();
    });
  }

  allocateBins() {
    this.selectedBinList = [];

    for (let i = 0; i < this.binList.length; i++) {
      const tempSelectedBinList = [];
      for (let j = 0; j < this.days.length; j++) {
        if (this.days[j].bin === this.binList[i].binName) {
          tempSelectedBinList.push(this.days[j]);
        }
      }
      this.selectedBinList.push(tempSelectedBinList);
    }
    this.calculateBinAverage(0);
  }

// Calendar Functions **********************************************************************************************************************
// Set up functions only need to run once on import **********************************
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

// Create legend and calendar based on latest data **************************

// Creates legend based on this.binList
// NO event listeners
  createLegend() {
    const svg = d3.select('#legend');
    const instruct = d3.select('#instructions');
    svg.selectAll('*').remove();
    instruct.selectAll('*').remove();
    svg.attr('height', (this.binList.length * 20) + 'px');
    instruct.append('text')
      .text('Calendar Controls')
      .attr('font-size', '12px')
      .attr('font-weight', 'bold')
      .attr('x', 3)
      .attr('y', 15);
    instruct.append('text')
      .text('(Click) change bin')
      .attr('font-size', '12px')
      .attr('x', 5)
      .attr('y', 30);
    instruct.append('text')
      .text('(Ctl-Click) Select')
      .attr('font-size', '12px')
      .attr('x', 5)
      .attr('y', 45);
    // Main Legend
    svg.selectAll('g').append('g')
      .data(d => this.binList)
      .join('text')
      .attr('x', 5)
      .attr('y', function (d, i) {
        return i * 20 + 12;
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
      .attr('x', 90)
      .attr('y', function (d, i) {
        return i * 20 + 12 - 12;
      })
      .attr('fill', function (d) {
        return d.binColor;
      });
  }

// Creates monday-based calendar using dates in
  createCalendar() {
    this.createLegend();
    d3.select('#grid').selectAll('*').remove();
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
    let cell_dimension = 150 / (weekcount);
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
      .attr('fill', d => this.setColor(d.values[0]))
      .attr('id', function (d) {
        return d.values[0].getDate() + '' + d.values[0].getMonth() +
          '' + d.values[0].getFullYear();
      });

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
  }

// General Event Handlers ****************************************************
  // handle clicks and ctrl-clicks on squares
  // Calls cycleBin(), movBins(), and toggleSelect()
  clickHandler(event) {
    if ((!this.mac && event.ctrlKey) || (this.mac && event.metaKey)) {
      this.toggleSelect(event.target);
    } else if (this.selectedDates.has(event.target)) {
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
      this.cycleBin(event.target);
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
    const dates = Array.from(this.selectedDates);
    for (let i = 0; i < dates.length; i++) {
      this.toggleSelect(dates[i]);
    }
    this.selectedDates.clear();
  }

  // add/removes item from selectedDates set
  toggleSelect(rect) {
    if (this.graphDayAverage === undefined) {
    } else {
      for (let graphDay = 0; graphDay < this.graphDayAverage.data.length; graphDay++) {
        this.days[graphDay].visible = this.graphDayAverage.data[graphDay].visible;
      }
      const active = d3.select(rect);
      const key = active._groups[0][0].__data__.values[0];
      const found = this.days.find(obj => obj.date.getDate() === key.getDate());
      if (this.selectedDates.has(rect)) {
        this.selectedDates.delete(rect);
        active.attr('stroke', 'none');
        this.days[this.days.indexOf(found)].stroke = 1;
      } else {
        this.selectedDates.add(rect);
        active.attr('stroke', 'black');
        active.attr('stroke-width', '4');
        this.days[this.days.indexOf(found)].stroke = 5;
      }
    }
    this.plotGraphDayAverage(0);
  }

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
    const tempHeader = this.dataFromInput[parseInt(currentSelectedFile, 10)].selectedHeader;
    for (let i = 0; i < tempHeader.length; i++) {
      if (!(this.dataFromInput[currentSelectedFile].dataArrayColumns[i][0] instanceof Date)) {
        this.columnSelector.push({
          name: tempHeader[i].headerName,
          identifier: `${currentSelectedFile},${i}`
        });
      } else if (this.dataFromInput[currentSelectedFile].dataArrayColumns[i][0] instanceof Date) {
        this.timeSeriesFileDayType = `${currentSelectedFile},${i}`;
      }
    }
  }

  columnSelectorEvent(event) {
    this.annotationListDayAverage = [];
    this.annotationListBinAverage = [];
    this.columnSelectorList.pop();
    this.columnSelectorList.push({
      name: this.columnSelector[event.target.options.selectedIndex].name,
      value: event.target.value
    });
  }

  binToggled(event) {
    // if graphDayAverage is undefined do nothing.
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
      }
      this.plotGraphDayAverage(0);
    }
  }

  resetBins() {
    this.clearSelection();
    this.dayTypeNavigation(true); // shorter version only for reset
  }

  // Moves everything to 'EXCLUDED' BIN
  // redraws calendar and graphDayAverage
  clearBins() {
    this.annotationListDayAverage = [];
    this.annotationListBinAverage = [];
    for (let i = 0; i < this.days.length; i++) {
      this.days[i].bin = 'EXCLUDED';
    }
    this.createCalendar();
    this.allocateBins();
    this.plotGraphDayAverage(0);
  }

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
    if (this.newBinColor === '') {
      alert('Please Enter a Color for the Bin');
      return;
    }
    if (!this.isColor(this.newBinColor.toLowerCase())) {
      alert('NOT A KNOWN COLOR. Please Enter a Valid Color');
      return;
    }
    if (this.newBinName.length > 10) {
      alert('Character Limit Reached. Please Enter a name with 10 characters or less');
      return;
    }
    if (this.newBinName.toLowerCase() === 'add') {
      alert('Name Reserved');
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
    this.binList.splice(0, 0, {binName: this.newBinName.toUpperCase(), binColor: this.newBinColor.toLowerCase()});
    console.log(this.binList);
    this.displayBinList.splice(0, 0, {binName: this.newBinName.toUpperCase(), binColor: this.newBinColor.toLowerCase()});
    this.selectedBinList.splice(0, 0, []);
    this.createLegend();
    this.modalRef.hide();
  }

  isColor(strColor) {
    const s = new Option().style;
    s.color = strColor;
    return s.color === strColor;
  }

  plotShift(event) {
    if (event.target.value === 'bin') {
      this.showBinMode = false;
      this.calculateBinAverage(0);
    } else if (event.target.value === 'day') {
      this.showBinMode = true;
    }
  }

  removeBin(event: string) {
    if (event === 'EXCLUDED') {
      alert('EXCLUDED is the default bin, and cannot be deleted at this time');
      return;
    } else {
      const initialState = {message: ' Are you sure you want to delete the ' + event + ' bin?'};
      this.modalRef = this.modalService.show(ConfirmationModalComponent, {initialState});
      this.modalRef.content.onClose.subscribe(result => {
        console.log(this.days);
        if (result) {
          const binIndex = this.binList.findIndex(obj => obj.binName === event);
          const contents = this.selectedBinList[binIndex];
          if (contents !== undefined && contents.length > 0) {
            for (let i = 0; i < contents.length; i++) {
              const entry = this.days[this.days.indexOf(contents[i])];
              const rect = document.getElementById(entry.id);
              this.movBins(rect, 'EXCLUDED');
            }
          }
          this.binList.splice(binIndex, 1);
          this.displayBinList.splice(binIndex, 1);
          this.allocateBins();
          this.createLegend();
          this.plotGraphDayAverage(0);
        }
      });
    }
  }

  startDrag(event, id: string) {
    event.stopPropagation();
    event.preventDefault();
    this.scrollActive = true;
    this.target = document.getElementById(id);
    this.start_Y = event.pageY - this.target.offsetTop;
    this.start_X = event.pageX - this.target.offsetLeft;
    this.target.classList.add('active');
  }

  endDrag(event) {
    if (!this.scrollActive) {
      return false;
    }
    event.stopPropagation();
    event.preventDefault();
    this.scrollActive = false;
    this.target.classList.remove('active');
    this.target = null;
  }

  drag(event: MouseEvent, direction: string) {
    if (!this.scrollActive) {
      return false;
    }
    event.stopPropagation();
    event.preventDefault();
    let start;
    let walk;
    let old;
    if (direction === 'X') {
      start = event.pageX - this.target.offsetLeft;
      walk = (start - this.start_X) / 5;
      old = this.target.scrollLeft;
      this.target.scrollLeft = old + walk;
    } else {
      start = event.pageY - this.target.offsetTop;
      walk = (start - this.start_Y);
      old = this.target.scrollTop;
      this.target.scrollTop = old + walk;
    }
  }

  dayTypeNavigation(reset) {
    this.columnMainArray = [];
    this.days = [];
    const dataFromFile = this.dataFromInput;
    if (this.columnSelectorList.length === 0) {
      alert('Please select Column');
    } else {
      if (reset) {
        for (const i in this.defaultBinList) {
          if (this.binList.indexOf(this.defaultBinList[i]) < 0) {
            const index = this.binList.findIndex(obj => obj.binName === this.defaultBinList[i].binName);
            if (index < 0) {
              this.binList.push(this.defaultBinList[i]);
              this.displayBinList.push(this.defaultBinList[i]);
            }
          }
        }
      } else {
        this.binList = [];
        this.displayBinList = [];
        for (const i in this.defaultBinList) {
          if (this.binList.indexOf(this.defaultBinList[i]) < 0) {
            const index = this.binList.findIndex(obj => obj.binName === this.defaultBinList[i].binName);
            if (index < 0) {
              this.binList.push(this.defaultBinList[i]);
              this.displayBinList.push(this.defaultBinList[i]);
            }
          }
        }
      }
      this.selectedColumnPointer = this.columnSelectorList;
      const timeSeriesColumnPointer = this.timeSeriesFileDayType.split(',');
      this.timeSeriesDayType = dataFromFile[parseInt(timeSeriesColumnPointer[0],
        10)].dataArrayColumns[parseInt(timeSeriesColumnPointer[1], 10)];
      const returnObject = this.graphCalculation.averageCalculation(dataFromFile, this.timeSeriesDayType, this.selectedColumnPointer);
      this.days = returnObject.days;
      this.columnMainArray = returnObject.columnMainArray;
      this.allocateBins();
      this.plotGraphDayAverage(0);
      this.createCalendar();
      this.calculateBinAverage(0);
    }
  }

  calculateBinAverage(channelId) {
    this.sumArray = this.graphCalculation.calculateBinAverage(channelId, this.binList, this.days,
      this.selectedColumnPointer, this.columnMainArray);
    this.plotGraphBinAverage(0);
  }

  plotGraphDayAverage(channelId) {
    this.graphDayAverage = this.graphCreation.plotGraphDayAverage(this.graphDayAverage, channelId, this.columnMainArray, this.days,
      this.displayBinList, this.annotationListDayAverage, this.toggleRelayoutDay);
    if (this.graphDayAverage.data.length > 0) {
      this.calculatePlotStatsDay();
    }
  }

  plotGraphBinAverage(channelId) {
    this.graphBinAverage = this.graphCreation.plotGraphBinAverage(this.graphBinAverage, channelId, this.sumArray,
      this.annotationListBinAverage);
    if (this.graphBinAverage.data.length > 0) {
      this.calculatePlotStatsBin();
    }
  }

  calculatePlotStatsDay() {
    this.toggleRelayoutDay = true;
    this.globalYAverageDay = this.graphCreation.calculatePlotStatsDay(this.graphDayAverage);
  }

  calculatePlotStatsBin() {
    this.globalYAverageBin = this.graphCreation.calculatePlotStatsBin(this.graphBinAverage);
  }

  clickAnnotationDayAverage(data) {
    if (data.points === undefined) {
    } else if ((!this.mac && data.event.ctrlKey) || (this.mac && data.event.metaKey)) {
      this.annotationListDayAverage = this.graphDayAverage.layout.annotations || [];
      this.annotationListDayAverage = this.graphCreation.clickAnnotationDayAverage(data,
        this.annotationListDayAverage, this.graphDayAverage);
      this.plotGraphDayAverage(0);
    } else {
      const selectedTrace = document.getElementById(this.days[data.points[0].curveNumber].id);
      this.toggleSelect(selectedTrace);
    }
  }

  clickAnnotationBinAverage(data) {
    if (data.points === undefined) {
    } else {
      this.annotationListBinAverage = this.graphBinAverage.layout.annotations || [];
      this.annotationListBinAverage = this.graphCreation.clickAnnotationBinAverage(data,
        this.annotationListBinAverage, this.graphBinAverage);
      this.plotGraphBinAverage(0);
    }
  }

  exportDayAverageData() {
    if (this.graphDayAverage.data.length < 1) {
      alert('Please import Data first');
    } else {
      this.exportCsv.exportDayAverageData(this.graphDayAverage, this.displayBinList);
    }
  }
}

