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
  dropDownList: any [];
  @Input()
  activeContents: any [];

  @Output() addSelectedDateOutput = new EventEmitter<{ name: string, date: string }>();
  @Output() onSelectedRemoveOutput = new EventEmitter<{ name: string, date: string }>();
  @Output() plot_change = new EventEmitter<{ name: string, graph: boolean }>();
  @Output() add = new EventEmitter<any>();

  // Array of dates to pull inside

  constructor() {
  }

  ngOnInit() {
  }

  addSelectedDate(event) {
    const index = event.target.options.selectedIndex;
    if (index > -1) {
      this.addSelectedDateOutput.emit({name: this.name, date: this.dropDownList[index]});
    }
  }

  onSelectedRemove(event) {
    let index = -1;
    if (event.target.id === undefined || event.target.id === '' || event.target.id === null) {
    } else {
      index = event.target.id;
      if (index > -1) {
        this.onSelectedRemoveOutput.emit({name: this.name, date: this.activeContents[index]});
      }
    }

  }

  add_type() {
    this.add.emit(event);
  }

  plot(event) {
    this.plot_change.emit({name: this.name, graph: event.target.checked});
  }

}
