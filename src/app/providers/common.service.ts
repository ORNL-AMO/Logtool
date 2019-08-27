import {Injectable} from '@angular/core';
import {Subject} from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class CommonService {
    invokeEvent: Subject<any> = new Subject();

    constructor() {
    }

    callSaveGraph() {
        this.invokeEvent.next('visualize');
    }

    callSaveDayType(){
        this.invokeEvent.next('dayType');
    }
}
