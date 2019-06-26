import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-holder',
  templateUrl: './holder.component.html',
  styleUrls: ['./holder.component.scss']
})
export class HolderComponent implements OnInit {
  list: any[];
  type: any[];
  types: any[];
  bins: any[];
  contents: any[];
  feedback: any[];

  constructor() {
  }

  ngOnInit() {
    this.feedback = ['bob', 'sue'];
    // initial giant list
    this.list = ['April 2, 2019', 'April 3, 2019', 'April 4, 2019', 'April 5, 2019', 'April 6, 2019', 'June 22, 2056', 'June 25, 2056'];
    this.type = ['Weekday', 'Weekday', 'Weekday', 'Weekday', 'Weekday', 'Excluded', 'Excluded'];
    this.types = ['Weekday', 'Weekend'];
    this.allocateBins();
  }

  onUpdate(value) {

    for (let i = 0; i < value.dates.length; i++) {
      //console.log(value, this.list.indexOf(value.dates[i]));
      this.type[this.list.indexOf(value.dates[i])] = value.name;
    }
    this.allocateBins();
  }

  onRemove(date) {
    console.log('TEST', date, this.list.indexOf(date));
    this.type[this.list.indexOf(date)] = 'Excluded';
    this.allocateBins();
  }

  allocateBins() {
    this.bins = [];
    this.contents = [];
    for (let j = 0; j < this.types.length; j++) {
      this.bins[j] = [];
      this.contents[j] = [];
    }

    for (let i = 0; i < this.type.length; i++) {

      for (let j = 0; j < this.types.length; j++) {
        //if type matches put in container
        if (this.type[i] === this.types[j]) {
          this.contents[j].push(this.list[i]);
        } else {
          //else add to pull bin
          this.bins[j].push(this.list[i]);
        }

      }
    }
  }

  //the following functions are place holders for now.

  //remove from plot if signal.graph == false
  updatePlot(signal){
    const index = this.list.indexOf(signal.name);
  }

  //????
  addType() {
    console.log("add");
  }
}



