import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';

@Component({
  selector: 'app-day-type-bin',
  templateUrl: './day-type-bin.component.html',
  styleUrls: ['./day-type-bin.component.scss']
})
export class DayTypeBinComponent implements OnInit {
  @Input()
  name: string;
  @Input()
  datePull: any [];
  @Input()
  binContents: any [];

  @Output() update = new EventEmitter<{ name: string, dates: any[] }>();
  @Output() delete = new EventEmitter<any>();
  @Output() plot_change = new EventEmitter<{ name: string, graph: boolean }>();
  @Output() add = new EventEmitter<any>();
  // Array of dates to pull inside
  pull_in: any[];

  constructor() {
  }

  ngOnInit() {
  }

  addPull(event) {
    // console.log(this.date_pull);
    this.pull_in = [];
    const index = event.target.options.selectedIndex;
    if (index > -1) {
      this.pull_in.push(this.datePull[index]);
      this.update.emit({name: this.name, dates: this.pull_in});
    }
  }

  removeDate(event) {
    console.log(event.target.id);
    const index = event.target.id;
    if (index > -1) {
      this.delete.emit(this.binContents[index]);
      console.log('CHECKPOINT 1');
    }
  }

  add_type() {
    this.add.emit(event);
  }

  plot(event) {
    this.plot_change.emit({name: this.name, graph: event.target.checked});
  }

}
