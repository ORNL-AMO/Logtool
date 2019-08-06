import {Component, EventEmitter, Input, Output, OnInit, DoCheck} from '@angular/core';

import * as d3 from 'd3';


@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss']
})
export class CalendarComponent implements OnInit {

  constructor() {
  }

  mac: boolean;
  binList: any[];
  selectedDates: Set<any>;
  daysToNest: any[];
  days: any[];

  // items that only need to be calculated onInit
  dayList: any[];
  months: any[];
  weekCount: number;
  cellDimension: number;
  y_offset: number;
  x_offset = 10;
  spacing_y = 5;
  spacing_x = 5;
  weekSpacing: number;
  yearSpacing: number[];
  size;

  @Output() selectionToggle = new EventEmitter<{ items: any[], selected: boolean }>();
  @Output() binShift = new EventEmitter<any[]>();
  @Output() clearSelection = new EventEmitter();


  lastclick: any;

  monthList = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  monthDays = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  weekdays = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];

  ngOnInit() {
    this.generateGrid();
    this.selectedDates = new Set();
  }

  generateGrid() {
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

  // Visible functions ------------------
  update() {
    this.generateNest();
    this.getGridOffsets();
    this.generateCalendar();
    this.generateLegend();
    this.makeBold();
  }

  load() {
    this.update();
  }


  generateLegend() {
    // remove old legend
    if (this.binList === undefined) {
      return;
    }
    const colors = d3.select('#legend');
    const instruct = d3.select('#instructions');
    colors.selectAll('*').remove();
    instruct.selectAll('*').remove();

    colors.attr('height', (this.binList.length * 20) + 'px');

    // instruction text
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

    // color identification blocks

    // Labels
    colors.selectAll('g').append('g')
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

    // blocks
    colors.selectAll('g').append('g')
      .data(d => this.binList)
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

  generateNest() {
    const year = d3.timeFormat('%Y');
    const week = d3.timeFormat('%W');     // returns week of year 0-53
    const daynum = d3.timeFormat('%d');   // returns day of month 01-31
    const dayindex = d3.timeFormat('%u'); // returns index of the day of the week [1,7]
    const month = d3.timeFormat('%m'); // returns month index 01.12

    this.dayList = d3.nest()
      .key(function (d) {
        return year(new Date(d));
      })
      .key(function (d) {
        return month(new Date(d));
      })
      .key(function (d) {

        return week(new Date(d));
      })
      .key(function (d) {
        // console.log(d);
        return daynum(new Date(d));
      })
      .entries(this.daysToNest);
      // console.log(this.daysToNest);
      this.dayList = this.INsort(this.dayList);
  }

  getGridOffsets() {
    this.weekCount = 0;
    this.months = [];
    // generate list of months containing data
    // calculate maximum number of weeks in the months provided
    for (let i = 0; i < this.dayList.length; i++) {
      for (let j = 0; j < this.dayList[i].values.length; j++) {
        this.months.push({index: this.dayList[i].values[j].key, year: this.dayList[i].key});
        // console.log(this.months[i]);
        if (this.dayList[i].values[j].values.length > this.weekCount) {
          this.weekCount = this.dayList[i].values[j].values.length;
        }
      }
    }

    // calculate cell dimension and set up offsets
    this.cellDimension = 150 / (this.weekCount);
    // Cap at a maximum value
    if (this.cellDimension > 50) {
      this.cellDimension = 50;
    }
    this.y_offset = 12 + this.cellDimension;
    this.weekSpacing = (7 * (this.cellDimension + this.spacing_x) + 15);
    this.yearSpacing = [0];
    let index = 0;
    for (const year of this.dayList) {
      // console.log(year);
      this.yearSpacing[index + 1] = this.yearSpacing[index] + this.weekSpacing * year.values.length;
      index++;
    }

    // resize calendar to fit
    this.size = (7 * (this.cellDimension + this.spacing_x) + 15) * this.months.length + this.x_offset * 2;


  }

  generateCalendar() {
    // this.generateLegend();

    // remove any items from previous draws
    d3.select('#grid').selectAll('*').remove();
    // resize grid
    d3.select('#grid').attr('width', this.size + 'px');

    // Create local copies of pre-calculated variables for internal functions below.
    // Rewrite with proper functions in future if possible
    const cellDimension = this.cellDimension;
    const spacing_x = this.spacing_x;
    const x_offset = this.x_offset;
    const dayindex = d3.timeFormat('%u');

    // Append a label for each month in list
    const day_spacing = this.cellDimension + this.spacing_x;

    const title2 = d3.select('#grid').append('g')
      .selectAll('text')
      .data(d => this.months)
      .join('text')
      .attr('x', function (d, i) {
        return (7 * (day_spacing) + 15) * (i + .5) - 20;
      })
      .attr('y', 12)
      .attr('font-size', '12px')
      .attr('font-weight', 'bold')
      .text(d => this.indexToMonth(d));


    const yearSpacing = this.yearSpacing;
    const years = d3.select('#grid').selectAll('g')
      .data(this.dayList)
      .join('g')
      .attr('transform', function (d, i) {
        return 'translate( ' + yearSpacing[i] + ',' + 0 + ')';
      });

    // Set up group offset for a month
    // i is number of months away from first month of data
    const weekSpacing = this.weekSpacing;
    const months = years.append('g')
      .selectAll('g')
      .data(d => d.values)
      .join('g')
      .attr('transform', function (d, i) {
        return 'translate( ' + weekSpacing * i + ',' + 0 + ')';
      });


    // Print weekday titles for columns
    const title = months.append('g')
      .selectAll('g')
      .data(this.weekdays)
      .join('text')
      .attr('x', function (d, i) {
        return i * (day_spacing) + cellDimension / 4 + 7;
      })
      .attr('y', cellDimension / 3 + 12)
      .attr('font-size', cellDimension / 3 + 'px')
      .text(function (d) {
        return d;
      });


    // Create groups of weeks to hold days
    const weeks = months.append('g')
      .selectAll('g')
      .data(d => d.values)
      .join('g')
      .attr('transform', function (d, i) {
        return 'translate( ' + x_offset + ',' + (i * (day_spacing) + cellDimension / 3 + 17) + ')';
      });

    // Attach bin squares to each day in each week
    const squares = weeks.append('g')
      .selectAll('g')
      .data(d => d.values)
      .join('rect')
      .attr('width', cellDimension)
      .attr('height', cellDimension)
      .attr('x', function (d) {
        return (dayindex(d.values[0]) - 1) * (cellDimension + spacing_x);
      })
      .attr('y', 0)
      .attr('fill', d => this.setColor(d.values[0]))
      .attr('id', function (d) {
        if (d.values[0] !== undefined) {
          return d.values[0].getDate() + '' + d.values[0].getMonth() +
            '' + d.values[0].getFullYear();
        }
      });


    // Attach day numbers to each day in each week
    const dateText = weeks.append('g')
      .selectAll('g')
      .data(d => d.values)
      .join('text')
      .attr('x', function (d) {
        return (dayindex(d.values[0]) - 1) * (cellDimension + spacing_x) + cellDimension / 4;
      })
      .attr('y', function (d) {
        return cellDimension * (2 / 3);
      })
      .text(function (d) {
        return d.key;
      })
      .attr('fill', 'black')
      .attr('font-weight', 'bold')
      .attr('font-size', cellDimension * .5 + 'px')
      .style('pointer-events', 'none')
      .style('user-select', 'none');

    // event handlers
    squares.on('click', d => this.clickHandler(event));
  }

  makeBold() {
    const chosen = Array.from(this.selectedDates);
    for (let i = 0; i < chosen.length; i++) {
      d3.select(document.getElementById(chosen[i])).attr('stroke', 'black');
      d3.select(document.getElementById(chosen[i])).attr('stroke-width', '4');
    }
  }

  // Array search functions for svg
  indexToMonth(d) {
    // console.log(d);
    return this.monthList[d.index - 1] + ' ' + d.year;
  }

  // Set initial color
  setColor(key) {
    if (key !== undefined) {
      const obj = this.days.find(obj1 =>
        obj1.date.getFullYear() === key.getFullYear() && obj1.date.getMonth() === key.getMonth() && obj1.date.getDate() === key.getDate());

      if (obj !== undefined) {
        return this.binList.find(bin => bin.binName === obj.bin).binColor;
      } else {
        // console.log(this.days);
        // console.log(key, this.days[this.days.length-1]);
        return 'purple';
      }
    }
  }

  // ------------------------------------

  clickHandler(event) {
    // Check for single selection
    if ((!this.mac && event.ctrlKey) || (this.mac && event.metaKey)) {

      const target = [];
      target.push(event.target.id);
      this.selectionToggle.emit({items: target, selected: this.selectedDates.has(event.target)});
      this.lastclick = d3.select(event.target).data()[0].values[0];


      // Check for multi-selection
    } else if (event.shiftKey) {
      const dateData = d3.select(event.target).data()[0].values[0];
      if (this.lastclick !== undefined) {
        const range = this.getDatesBetween(dateData);
        // this.discontinue(this.lastclick, dateData);
        // const range = this.getAll(this.lastclick, dateData);
        this.selectionToggle.emit({items: range, selected: true});
      }

      // on normal click on selected cell, shift all selected
    } else if (this.selectedDates.has(event.target.id)) {
      const newBin = this.cycleBin(event.target.id);
      const items = Array.from(this.selectedDates);
      for (let i = 0; i < items.length; i++) {
        this.movBins(items[i], newBin);
      }

      // emit changes to days
      this.binShift.emit(this.days);

      // else shift target cell
    } else {
      this.cycleBin(event.target.id);
      this.binShift.emit(this.days);
    }
  }

  // find next bin in list and move element into it
  cycleBin(id) {
    const active = d3.select(document.getElementById(id));
    const curColor = active.attr('fill');

    // get index of next bin
    let index = this.binList.findIndex(bin => bin.binColor === curColor) + 1;
    if (index === this.binList.length) {
      index = 0;
    }

    const nextBin = this.binList[index].binName;
    this.movBins(id, nextBin);
    return nextBin;
  }

  // directly move element with id into target bin, updates this.days
  movBins(id, bin) {
    // find entry in days and update
    const found = this.days.findIndex(obj => obj.id === id);
    this.days[found].bin = bin;

    // update color
    const active = d3.select(document.getElementById(id));
    active.attr('fill', this.binList.find(obj => obj.binName === bin).binColor);
  }

  private getDatesBetween(date: Date) {
    const contents = [];
    let year = date.getFullYear();
    let month = date.getMonth();
    let day = date.getDate();
    let length = 0;
    let start;
    if (date > this.lastclick) {
      start = this.lastclick;
    } else {
      start = date;
    }
    while (month !== this.lastclick.getMonth()) {
      const current = day.toString() + month.toString() + year.toString();
      contents.push(current);
      length++;
      // go to previous day
      if (month > this.lastclick.getMonth()) {
        day--;
        // when going to new month, decriment month, and reset days
        if (day <= 0) {
          month--;
          if (month <= 0) {
            month = 12;
            year--;
          }
          // if Feburary check for leap year
          if (month === 2 && year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0)) {
            day = 29;
          } else {
            day = this.monthDays[month];
          }
        }
      } else if (month < this.lastclick.getMonth()) {
        day++;
        // check for month boundries
        let end = this.monthDays[month];
        // check for leap year
        if (month === 3 && year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0)) {
          end = 29;
        }

        if (day > end) {
          month++;
          if (month > 12) {
            month = 0;
            break;
          }
          day = 1;
        }
      }
    }
    while (day !== this.lastclick.getDate()) {
      const current = day.toString() + month.toString() + year.toString();
      contents.push(current);
      length++;
      if (day < this.lastclick.getDate()) {
        day++;
      } else {
        day--;
      }
    }
    const id = start.getDate().toString() + start.getMonth().toString() + start.getFullYear().toString();
    const range = {start: id, length: length};
    return contents;
  }

  getAll(date1: Date, date2: Date) {
    let startDate = date1;
    let endDate = date2;
    if (date1 > date2) {
      startDate = date2;
      endDate = date1;
    }

    const yearEnd = endDate.getFullYear();
    let yearCurr = startDate.getFullYear();

    const monthEnd = endDate.getMonth();
    let currMonth = startDate.getMonth();

    const dayEnd = endDate.getDate();
    let currDay = startDate.getDate();

    const list = new Set();

    // move to the correct year
    while (yearCurr !== yearEnd) {
      while (currMonth < 12) {
        let end = this.monthDays[currMonth];
        // check for leap year
        if (currMonth === 1) {
          if (yearCurr % 4 === 0 && (yearCurr % 100 !== 0 || yearCurr % 400 === 0)) {
            end = 29;
          }
        }
        this.mergeSets(list, this.getDaysBetween(currDay, end, currMonth, yearCurr));
        currDay = 1;
        currMonth++;
      }
      yearCurr++;
      currMonth = 0;
    }
    // move to the correct month in the year
    while (currMonth !== monthEnd) {
      let end = this.monthDays[currMonth];
      // check for leap year
      if (currMonth === 1) {
        if (yearCurr % 4 === 0 && (yearCurr % 100 !== 0 || yearCurr % 400 === 0)) {
          end = 29;
        }
      }
      this.mergeSets(list, this.getDaysBetween(currDay, end, currMonth, yearCurr));

      currDay = 1;
      currMonth++;
    }
    // Add remaining days from last month
    this.mergeSets(list, this.getDaysBetween(currDay, dayEnd, currMonth, yearCurr));
    list.delete(this.lastclick.getDate().toString(10) + this.lastclick.getMonth().toString(10) + this.lastclick.getFullYear().toString(10));
    const content = Array.from(list);
    return content;
  }

  getDaysBetween(start, end, month, year) {
    let currentday = start;
    const content = new Set();
    const step = end - start > 0 ? 1 : -1;
    while (currentday <= end) {
      content.add(currentday.toString() + month + year);
      currentday = currentday + step;
    }

    return content;
  }

  mergeSets(set1, set2) {
    const n = Array.from(set2);
    for (let i = 0; i < n.length; i++) {
      set1.add(n[i]);
    }


  }

  clear() {
    this.clearSelection.emit();
  }

  INsort(CurrArray) {
    // console.log(this.daysToNest);
    const array = [];
    array[0] = CurrArray[0];

    for (let i = 1; i < CurrArray.length; i++) {
      const key = CurrArray[i].key;

      let j = i - 1;

      while (j >= 0 && array[j].key > key) {
        array[j + 1] = array[j];
        j = j - 1;

      }
      array[j + 1] = CurrArray[i];
    }
    // console.log(array);
    return array;
  }

  discontinue(date1: Date, date2: Date ) {
    console.log(date1, date2);
    const yearStartIndex   = this.dayList.findIndex(obj => obj.key === date1.getFullYear().toString());
    const yearEndIndex   = this.dayList.findIndex(obj => obj.key === date2.getFullYear().toString());

    const monthStartIndex = this.dayList[yearStartIndex].values.findIndex(obj => obj.key === date1.getMonth().toString());
    const monthEndIndex   = this.dayList[yearEndIndex].values.findIndex(obj => obj.key === date2.getMonth().toString());

    console.log(this.dayList[yearStartIndex].values);



    const dayStartIndex = this.dayList[yearStartIndex].values[monthStartIndex].values.findIndex(obj => obj.key === date1.getDate().toString());
    const dayEndIndex   = this.dayList[yearEndIndex].values[monthEndIndex].values.findIndex(obj => obj.key === date2.getDate().toString());

    console.log('start', yearStartIndex, monthStartIndex, dayStartIndex);
    console.log('end', yearEndIndex, monthEndIndex, dayEndIndex);


  }






}
