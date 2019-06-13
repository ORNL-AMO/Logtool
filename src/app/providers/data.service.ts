import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { DataList } from '../types/data-list';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private inputDataArray: DataList[] = [];
  private dataInputArray = new BehaviorSubject(this.inputDataArray);
  currentdataInputArray = this.dataInputArray.asObservable();

  constructor() { }
  changeInputArray(input: DataList[]) {
    this.dataInputArray.next(input);
  }
}
