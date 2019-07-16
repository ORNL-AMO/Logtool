import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import {getElementDepthCount} from '@angular/core/src/render3/state';

@Component({
  selector: 'app-day-type-bin',
  templateUrl: './day-type-bin.component.html',
  styleUrls: ['./day-type-bin.component.scss']
})
export class DayTypeBinComponent implements OnInit {
  @Input()
  name: string;

  @Input()
  color: string;

  @Input()
  activeContents: any [];

  @Output() addSelectedDateOutput = new EventEmitter<{ name: string, date: string }>();
  @Output() onSelectedRemoveOutput = new EventEmitter<{ name: string, date: string }>();

  @Output() toggle_change = new EventEmitter<{ name: string, graph: boolean }>();
  @Output() addTypeOutput = new EventEmitter<any>();

  show: boolean;
  fontColor: string;

  constructor() {}

  ngOnInit() {
    this.show = false;
    //this.getTextColor();
  }

/*  getTextColor() {
    // Create fake div
    const fakeDiv = document.createElement('div');
    fakeDiv.style.color = this.color;
    document.body.appendChild(fakeDiv);

    // Get color of div
    const cs = window.getComputedStyle(fakeDiv),
      pv = cs.getPropertyValue('color');

    // Remove div after obtaining desired color value
    document.body.removeChild(fakeDiv);
    console.log(pv);
    return pv;
  }*/


/*  addSelectedDate(event) {
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

  }*/

  addType(event) {
     this.addTypeOutput.emit();
  }

  toggle_bin_plot(event) {
    this.toggle_change.emit({name: this.name, graph: event.target.checked});
  }

}
