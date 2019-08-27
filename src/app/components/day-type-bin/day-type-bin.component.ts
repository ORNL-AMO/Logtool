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
  @Output() removeTypeOutput = new EventEmitter<string>();
  show: boolean;

  constructor() {}

  ngOnInit() {
    this.show = false;
    // console.log(this.name, this.activeContents);
    // this.getTextColor();
  }


  addType(event) {

     this.addTypeOutput.emit();
  }

  toggle_bin_plot(event) {

    this.toggle_change.emit({name: this.name, graph: event.target.checked});
    event.stopPropagation();
    return;
  }

  removeTypeTrigger(event) {

    this.removeTypeOutput.emit(this.name);
    event.stopPropagation();
    return;
  }

}
