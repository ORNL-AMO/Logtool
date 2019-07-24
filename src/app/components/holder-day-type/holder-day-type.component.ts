import {Component, OnInit, TemplateRef, ViewChild, AfterViewInit} from '@angular/core';
import {BsModalService, BsModalRef} from 'ngx-bootstrap/modal';
import {DataService} from '../../providers/data.service';
import * as d3 from 'd3';
import * as XLSX from 'xlsx';
import {IndexFileStoreService} from '../../providers/index-file-store.service';
import {isNumber} from 'util';
import {ConfirmationModalComponent} from '../confirmation-modal/confirmation-modal.component';
import {CalendarComponent} from '../calendar/calendar.component';


@Component({
  selector: 'app-holder-day-type',
  templateUrl: './holder-day-type.component.html',
  styleUrls: ['./holder-day-type.component.scss']
})
export class HolderDayTypeComponent implements OnInit, AfterViewInit {
  constructor(private data: DataService, private indexFileStore: IndexFileStoreService, private modalService: BsModalService) {
  }
   @ViewChild(CalendarComponent)
   private calendar: CalendarComponent;

  scrollActive = false;
  target: any;
  start_X = 0;
  start_Y = 0;


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
  plotData = [];
  plotDataBinAverages = [];
  annotationListDayAverage = [];
  annotationListBinAverage = [];
  globalYMinDay;
  globalYMaxDay;
  globalXMinDay;
  globalXMaxDay;
  globalYAverageDay = [];
  globalYMinBin;
  globalYMaxBin;
  globalXMinBin;
  globalXMaxBin;
  globalYAverageBin = [];
  toggleRelayoutDay = false;
  binColor = ['red', 'green', 'blue'];
  temp5: any;
  fileSelector = [];
  temp6;
  columnSelector = [];
  columnSelectorList: any = [];
  dataFromDialog: any = [];
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
    // this.binList = this.defaultBinList;
    this.mac =  window.navigator.platform.includes('Mac') || window.navigator.platform.includes('mac');
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
      //this.createGrid();
      // this.tempGraphPlot();
    });
  }

  ngAfterViewInit(): void {
    console.log('In After View Init');
    this.calendar.generateLegend();
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
        this.plotData.push({
          x: timeSeries,
          y: tempHourAverage,
          type: 'linegl',
          mode: 'lines+markers',
          connectgaps: true,
          name: this.monthList[this.columnMainArray[channelId][i][0].displayDate.getMonth()] + ' '
            + this.columnMainArray[channelId][i][0].displayDate.getDate(),
          line: {
            color: color,
            width: thickness
          },
          marker: {
            color: color,
            size: 6 + thickness
          },
          visible: this.days[i].visible
        });
        name = this.columnMainArray[channelId][i][channelId].channelName;
      }
      let layout;
      if (this.annotationListDayAverage.length > 0 || this.toggleRelayoutDay) {
        layout = {
          hovermode: 'closest',
          autosize: true,
          title: name,
          xaxis: this.graphDayAverage.layout.xaxis,
          yaxis: this.graphDayAverage.layout.yaxis,
          annotations: this.annotationListDayAverage,
        };
      } else {
        layout = {
          hovermode: 'closest',
          autosize: true,
          title: name,
          xaxis: {
            autorange: true,
          },
          yaxis: {
            autorange: true,
            type: 'linear'
          },
          annotations: this.annotationListDayAverage,
        };
      }
      this.graphDayAverage = {
        data: this.plotData,
        layout: layout,
        config: {
          'showLink': false,
          'scrollZoom': true,
          'displayModeBar': true,
          'editable': false,
          'responsive': true,
          'displaylogo': false
        }
      };
      this.calculatePlotStatsDay();
    } else {
      this.graphDayAverage = {
        data: this.plotData,
        layout: {
          hovermode: 'closest',
          autosize: true,
          title: 'Average Day',
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
          mode: 'lines+markers',
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
          xaxis: this.graphBinAverage.layout.xaxis,
          yaxis: this.graphBinAverage.layout.yaxis,
          annotations: this.annotationListBinAverage,
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
      this.calculatePlotStatsBin();
    } else {
      this.graphBinAverage = {
        data: this.plotDataBinAverages,
        layout: {
          hovermode: 'closest',
          autosize: true,
          title: 'Average Bin',
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


  // resets selectedDates
  clearSelection() {
    const dates = Array.from(this.selectedDates);
    for (let i = 0; i < dates.length; i++) {
      this.toggleSelect(dates[i]);
    }
    this.selectedDates.clear();
  }

// --------------------------------------------------------------------------

// Toggle Functions *********************************************************

  // add/removes item from selectedDates set
  toggleSelect(rect) {
    console.log(rect);
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
    this.calendar.selectedDates = this.selectedDates;
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
   // this.columnSelectorList.push({name: this.columnSelector[0].name, value: this.columnSelector[0].identifier});
   this.currentfile = currentSelectedFile;
  }
currentfile: string;
  columnSelectorEvent(event) {
    this.annotationListDayAverage = [];
    this.annotationListBinAverage = [];
    this.columnSelectorList.pop();
    this.columnSelectorList.push({
      name: this.columnSelector[event.target.options.selectedIndex].name,
      value: event.target.value
    });
  }

// ---------------------------------------------------------------------------------------------------------------------------------------
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

  // Sorting Functions ***************************************************************

  // Currently just calls dayBinNavigation
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

    this.modalRef.hide();
    this.update();
  }

  isColor(strColor) {
    const s = new Option().style;
    s.color = strColor;
    return s.color === strColor;
  }

  // -------------------------------------------------------------------

  plotShift(event) {
    if (event.target.value === 'bin') {
      this.showBinMode = false;
      this.calculateBinAverage(0);
    } else if (event.target.value === 'day') {
      this.showBinMode = true;
    }

  }

  dayTypeNavigation(reset) {

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
                  id: this.timeSeriesDayType[i - 1].getDate() + '' + this.timeSeriesDayType[i - 1].getMonth() +
                    '' + this.timeSeriesDayType[i - 1].getFullYear(),
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
                id: this.timeSeriesDayType[i - 1].getDate() + '' + this.timeSeriesDayType[i - 1].getMonth() +
                  '' + this.timeSeriesDayType[i - 1].getFullYear(),
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

      this.calculateBinAverage(0);
      console.log('first', this.binList);
    }
    this.calendar.selectedDates.clear();
    this.calendar.mac = this.mac;
    this.calendar.binList = this.binList;
    this.calendar.days = this.days;
    this.calendar.daysToNest = this.timeSeriesDayType;


    this.update();
  }

  update() { this.calendar.update(); }

  calculateBinAverage(channelId) {
    let tempArray = [];
    const bigTempArray = [];
    this.annotationListBinAverage = [];
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
    if (this.value !== undefined) {
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
    }
    this.plotGraphBinAverage(0);
  }

  clickAnnotationDayAverage(data) {
    if (data.points === undefined) {

    } else if ( (!this.mac && data.event.ctrlKey) || (this.mac && data.event.metaKey) ) {

      // Modal
      this.annotationListDayAverage = this.graphDayAverage.layout.annotations || [];
      for (let i = 0; i < data.points.length; i++) {
        const annotationText = data.points[i].data.name + ', '
          + this.graphDayAverage.layout.title + ' = ' + data.points[i].y.toPrecision(4);
        const annotation = {
          text: annotationText,
          x: data.points[i].x,
          y: parseFloat(data.points[i].y.toPrecision(4)),
          font: {
            color: 'black',
            size: 12,
            family: 'Courier New, monospace',
          },
        };
        if (this.annotationListDayAverage.find(obj => obj.x === annotation.x && obj.y === annotation.y)) {
          this.annotationListDayAverage.splice(this.annotationListDayAverage
            .indexOf(this.annotationListDayAverage
              .find(obj => obj.x === annotation.x && obj.y === annotation.y)), 1);
        } else {
          this.annotationListDayAverage.push(annotation);
        }

      }
      this.plotGraphDayAverage(0);

    } else {
      const selectedTrace = document.getElementById(this.days[data.points[0].curveNumber].id);
      this.toggleSelect(selectedTrace);
    }
  }

  clickAnnotationBinAverage(data) {
    if (data.points === undefined) {
    } else {
      console.log(data);
      this.annotationListBinAverage = this.graphBinAverage.layout.annotations || [];
      for (let i = 0; i < data.points.length; i++) {
        const annotationText = 'x = ' + data.points[i].x + ' y = ' + data.points[i].y.toPrecision(4);
        const annotation = {
          text: annotationText,
          x: data.points[i].x,
          y: parseFloat(data.points[i].y.toPrecision(4)),
          font: {
            color: 'blue',
            size: 20,
            family: 'Courier New, monospace',
          },
          bordercolor: data.points[i].fullData.line.color,
          borderwidth: 3,
          borderpad: 4,
        };
        if (this.annotationListBinAverage.find(obj => obj.x === annotation.x && obj.y === annotation.y)) {
          this.annotationListBinAverage.splice(this.annotationListBinAverage
            .indexOf(this.annotationListBinAverage
              .find(obj => obj.x === annotation.x && obj.y === annotation.y)), 1);
        } else {
          this.annotationListBinAverage.push(annotation);
        }

      }
      this.plotGraphBinAverage(0);
    }
  }

  exportDayAverageData() {
    if (this.graphDayAverage.data.length < 1) {
      alert('Please import Data first');
    } else {
      const workbook = XLSX.utils.book_new();
      workbook.Props = {
        Title: 'Trial',
        Subject: 'Test File',
        Author: 'ORNL AirMaster',
        CreatedDate: new Date(2019, 7, 12)
      };
      const datajson = [];
      for (let i = 0; i < this.graphDayAverage.data.length; i++) {
        if (this.graphDayAverage.data[i].line.color !== '') {
          if (this.graphDayAverage.data[i].visible === true) {
            const bin = this.displayBinList.find(obj => obj.binColor === this.graphDayAverage.data[i].line.color);
            datajson.push({
              Date: this.graphDayAverage.data[i].name,
              1: this.graphDayAverage.data[i].y[0],
              2: this.graphDayAverage.data[i].y[1],
              3: this.graphDayAverage.data[i].y[2],
              4: this.graphDayAverage.data[i].y[3],
              5: this.graphDayAverage.data[i].y[4],
              6: this.graphDayAverage.data[i].y[5],
              7: this.graphDayAverage.data[i].y[6],
              8: this.graphDayAverage.data[i].y[7],
              9: this.graphDayAverage.data[i].y[8],
              10: this.graphDayAverage.data[i].y[9],
              11: this.graphDayAverage.data[i].y[10],
              12: this.graphDayAverage.data[i].y[11],
              13: this.graphDayAverage.data[i].y[12],
              14: this.graphDayAverage.data[i].y[13],
              15: this.graphDayAverage.data[i].y[14],
              16: this.graphDayAverage.data[i].y[15],
              17: this.graphDayAverage.data[i].y[16],
              18: this.graphDayAverage.data[i].y[17],
              19: this.graphDayAverage.data[i].y[18],
              20: this.graphDayAverage.data[i].y[19],
              21: this.graphDayAverage.data[i].y[20],
              22: this.graphDayAverage.data[i].y[21],
              23: this.graphDayAverage.data[i].y[22],
              24: this.graphDayAverage.data[i].y[23],
              DayType: bin.binName
            });
          }
        }
      }
      const worksheet = XLSX.utils.json_to_sheet(datajson);
      XLSX.utils.book_append_sheet(workbook, worksheet, 'ChannelName');
      XLSX.writeFile(workbook, 'THISPAGE2.xlsx', {bookType: 'xlsx'});
    }

  }

  calculatePlotStatsDay() {
    this.toggleRelayoutDay = true;
    if (this.graphDayAverage.layout.yaxis.range === undefined || this.graphDayAverage.layout.xaxis.range === undefined) {
      this.globalXMinDay = this.data.getMin(this.graphDayAverage.data[0].x);
      this.globalXMaxDay = this.data.getMax(this.graphDayAverage.data[0].x);
      this.globalYMinDay = this.data.getMin(this.graphDayAverage.data[0].y);
      this.globalYMaxDay = this.data.getMax(this.graphDayAverage.data[0].y);
      this.globalYAverageDay = [];
      for (let dataLength = 0; dataLength < this.graphDayAverage.data.length; dataLength++) {
        const len = this.graphDayAverage.data[dataLength].y.length;
        const ymax = this.data.getMax(this.graphDayAverage.data[dataLength].y);
        const ymin = this.data.getMin(this.graphDayAverage.data[dataLength].y);
        if (ymax >= this.globalYMaxDay) {
          this.globalYMaxDay = ymax;
        }
        if (this.globalYMinDay === 0) {
          this.globalYMinDay = ymin;
        } else if (ymin < this.globalYMinDay) {
          this.globalYMinDay = ymin;
        }
        let sumAverage = 0;
        for (let i = 0; i < len; i++) {
          const y = this.graphDayAverage.data[dataLength].y[i];
          sumAverage = sumAverage + y;
        }
        this.globalYAverageDay.push({
          value: sumAverage / len,
          name: this.graphDayAverage.data[dataLength].name,
          color: this.graphDayAverage.data[dataLength].line.color,
          stroke: this.graphDayAverage.data[dataLength].line.width
        });
      }
    } else {
      this.globalYMinDay = this.graphDayAverage.layout.yaxis.range[0];
      this.globalYMaxDay = this.graphDayAverage.layout.yaxis.range[1];
      this.globalXMinDay = this.graphDayAverage.layout.xaxis.range[0];
      this.globalXMaxDay = this.graphDayAverage.layout.xaxis.range[1];
      this.globalYAverageDay = [];
      for (let dataLength = 0; dataLength < this.graphDayAverage.data.length; dataLength++) {
        const len = this.graphDayAverage.data[dataLength].y.length;
        let sumAverage = 0;
        for (let i = 0; i < len; i++) {
          const y = this.graphDayAverage.data[dataLength].y[i];
          if (y >= this.globalYMinDay && y < this.globalYMaxDay && i >= this.globalXMinDay && i < this.globalYMaxDay) {
            sumAverage = sumAverage + y;
          }
        }
        if (isNaN(sumAverage / len)) {
        } else {
          this.globalYAverageDay.push({
            value: sumAverage / len,
            name: this.graphDayAverage.data[dataLength].name,
            color: this.graphDayAverage.data[dataLength].line.color,
            stroke: this.graphDayAverage.data[dataLength].line.width
          });
        }
      }
    }
    // console.log(this.globalYAverageDay);
  }

  calculatePlotStatsBin() {
    if (this.graphBinAverage.layout.yaxis.range === undefined || this.graphBinAverage.layout.xaxis.range === undefined) {
    } else {
      this.globalYMinBin = this.graphBinAverage.layout.yaxis.range[0];
      this.globalYMaxBin = this.graphBinAverage.layout.yaxis.range[1];
      this.globalXMinBin = this.graphBinAverage.layout.xaxis.range[0];
      this.globalXMaxBin = this.graphBinAverage.layout.xaxis.range[1];
      this.globalYAverageBin = [];
      for (let dataLength = 0; dataLength < this.graphBinAverage.data.length; dataLength++) {
        const len = this.graphBinAverage.data[dataLength].y.length;
        let sumAverage = 0;
        let y = 0;
        for (let i = 0; i < len; i++) {
          y = parseFloat(this.graphBinAverage.data[dataLength].y[i]);
          if (y >= this.globalYMinBin && y < this.globalYMaxBin && i >= this.globalXMinBin && i < this.globalYMaxBin) {
            sumAverage = sumAverage + y;
          }

        }
        this.globalYAverageBin.push({
          value: sumAverage / len,
          name: this.graphBinAverage.data[dataLength].name,
          color: this.graphBinAverage.data[dataLength].line.color,
          stroke: 1
        });
      }
      // console.log(this.globalYAverageBin);
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
              this.calendar.movBins(entry.id, 'EXCLUDED');
            }
          }
          // console.log('before', this.selectedDates);

          this.binList.splice(binIndex, 1);
          this.displayBinList.splice(binIndex, 1);

          this.allocateBins();


          this.plotGraphDayAverage(0);

          // console.log('after', this.selectedDates);
          // console.log('after', this.days);


        }
      });
    }


  }

  startDrag(event, id: string) {
    event.stopPropagation();
    event.preventDefault();
    this.scrollActive = true;
    this.target = document.getElementById(id);
    console.log(id, this.target);
    this.start_Y = event.pageY - this.target.offsetTop;
    this.start_X = event.pageX - this.target.offsetLeft;
    this.target.classList.add('active');

    //console.log(window.navigator.platform);
  }

  enddrag(event) {
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
    // console.log(this.scrollActive);
    let start;
    let walk;
    let old;
    if (direction === 'X') {
      start = event.pageX - this.target.offsetLeft;
      walk = (start - this.start_X) / 5;
      old = this.target.scrollLeft;
      this.target.scrollLeft = old + walk;
      // console.log(start, old, walk, this.start_X);

    } else {
      start = event.pageY - this.target.offsetTop;
      walk = (start - this.start_Y);
      old = this.target.scrollTop;
      this.target.scrollTop = old + walk;
      // console.log(start, old, walk, this.start_Y);
    }
    // console.log(this.target.id);
  }


//NEW STUFF ---------------------------
  selectionToggle(event) {
    for (let i = 0; i < event.items.length; i++) {
      this.toggleSelect(document.getElementById(event.items[i]));
    }
  }

  shiftBins(event) {
    this.days = event;
    this.allocateBins();
    this.plotGraphDayAverage(0);
  }

  toggledd(dropdown: string) {
    const target = document.getElementById(dropdown);
    if (target.style.display === 'none') {
      target.style.display = 'block';
    } else {
      target.style.display = 'none';
    }
  }

  fireEvent(item) {
    console.log('FIRING EVENT', item);
  }

  fileEvent(item) {
    console.log(event.target);
    this.currentfile = item;
  }

  focus(){
    console.log('focus');
  }
}

