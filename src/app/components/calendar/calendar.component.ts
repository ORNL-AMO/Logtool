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
    this.generateCalendar();
    this.generateLegend();
    this.makeBold();
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

  generateCalendar() {
    this.generateLegend();

    // remove any items from previous draws
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
      .entries(this.daysToNest);

    // calculate maximum number of weeks in the months provided
    for (let i = 0; i < dayList.length; i++) {
      if (dayList[i].values.length > weekcount) {
        weekcount = dayList[i].values.length;
      }
    }

    // Calculate cell dimensions based on maximum number of weeks (rows) necessary
    let cell_dimension = 150 / (weekcount);
    // Cap at a maximum value
    if (cell_dimension > 50) {
      cell_dimension = 50;
    }

    // set up offsets and transformations for grid
    const y_offset = 12 + cell_dimension;
    const spacing_y = 5;
    const x_offset = 10;
    const spacing_x = 5;

    // calculate and set total size of svg for overflow purposes
    const calSize = (7 * (cell_dimension + spacing_x) + 15) * dayList.length + x_offset * 2;
    d3.select('#grid').attr('width', calSize + 'px');

    // Append a label for each month in list
    const monthindex = dayList.map(d => d.key);
    const title2 = d3.select('#grid').append('g')
      .selectAll('text')
      .data(d => monthindex)
      .join('text')
      .attr('x', function (d, i) {
        return (7 * (cell_dimension + spacing_x) + 15) * (i + .5) - 20;
      })
      .attr('y', 12)
      .attr('font-size', '12px')
      .attr('font-weight', 'bold')
      .text(d => this.indexToMonth(d - 1));


    // Set up group offset for a month
    // i is number of months away from first month of data
    const months = d3.select('#grid').selectAll('g')
      .data(dayList)
      .join('g')
      .attr('transform', function (d, i) {
        return 'translate( ' + (7 * (cell_dimension + spacing_x) + 15) * i + ',' + 0 + ')';
      });


    // Print weekday titles for columns

    const title = months.append('g')
      .selectAll('g')
      .data(this.weekdays)
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

  makeBold() {
    const chosen = Array.from(this.selectedDates);
    for (let i = 0; i < chosen.length; i++) {
      d3.select(document.getElementById(chosen[i])).attr('stroke', 'black');
      d3.select(document.getElementById(chosen[i])).attr('stroke-width', '4');
    }
  }

  // Array search functions for svg
  indexToMonth(i) {
    return this.monthList[i];
  }

  // Set initial color
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

  // ------------------------------------

  clickHandler(event) {
    console.log(this.selectedDates);
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
        this.selectionToggle.emit({items: range, selected: true});
      }

      // on normal click on selected cell, shift all selected
    } else if (this.selectedDates.has(event.target)) {
      const newBin = this.cycleBin(event.target.id);
      const items = Array.from(this.selectedDates);
      for (let i = 0; i < items.length; i++) {
        const id = d3.select(items[i]).attr('id');
        this.movBins(id, newBin);
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
    // console.log('date:', date);
    // console.log('last:', this.lastclick);
    if (date > this.lastclick) {
      start = this.lastclick;
    } else {
      start = date;
    }
    // console.log('start:', start);
    // console.log('Months:', month, this.lastclick.getMonth());
    // cycle through months in the year that matches
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
          console.log(month);
        }
      }
    }
    // console.log('Month matched', length);
    // cycle through days in the month that matches
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
    // console.log('Day matched', length);
    // console.log(start);
    const id = start.getDate().toString() + start.getMonth().toString() + start.getFullYear().toString();
    const range = {start: id, length: length};
    // console.log('Final', range);
    return contents;
  }


  clear() {
    this.clearSelection.emit();
  }
}
