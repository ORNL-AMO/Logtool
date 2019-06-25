import {Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges} from '@angular/core';

@Component({
  selector: 'app-day-type-bin',
  templateUrl: './day-type-bin.component.html',
  styleUrls: ['./day-type-bin.component.scss']
})
export class DayTypeBinComponent implements OnInit, OnChanges{
  @Input() name: string;
  @Input() date_pull: any [];
  @Input() bin_contents: any [];
  @Output() update = new EventEmitter<{name: string, dates: any[]}>();

  //Array of dates to pull inside
  pull_in: any[];

  constructor() {}

  ngOnInit() {}


  ngOnChanges(changes: SimpleChanges){}


  addPull(event) {
    //console.log(this.date_pull);
    this.pull_in = [];
    const index = event.target.options.selectedIndex;
    if (index > -1) {
        this.pull_in.push( this.date_pull[index] );
        this.update.emit({name: this.name, dates: this.pull_in});
    }
  }

}
