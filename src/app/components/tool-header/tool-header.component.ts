import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {RouteIndicatorService} from '../../providers/route-indicator.service';
import {CommonService} from '../../providers/common.service';

@Component({
    selector: 'app-tool-header',
    templateUrl: './tool-header.component.html',
    styleUrls: ['./tool-header.component.scss']
})
export class ToolHeaderComponent implements OnInit {


    constructor(private router: Router, private routeIndicator: RouteIndicatorService, private commonService: CommonService) {
    }

    ngOnInit() {
        document.getElementById('visualize_link').style.backgroundColor = '';
        document.getElementById('visualize_link').style.color = '';
        document.getElementById('day_type_link').style.backgroundColor = '';
        document.getElementById('day_type_link').style.color = '';
        document.getElementById('file').style.backgroundColor = 'darkblue';
        document.getElementById('file').style.color = 'white';
    }

    route(value) {
        if (value === 'file_management') {
            const params = {
                value: 'link'
            };
            this.commonService.callSaveGraph();
            // this.commonService.callSaveDayType();
            this.routeIndicator.storage = params;
            this.router.navigateByUrl('', {skipLocationChange: false}).then(() => {
                this.router.navigate(['']).then(() => {
                    document.getElementById('visualize_link').style.backgroundColor = '';
                    document.getElementById('visualize_link').style.color = '';
                    document.getElementById('day_type_link').style.backgroundColor = '';
                    document.getElementById('day_type_link').style.color = '';
                    document.getElementById('file').style.backgroundColor = 'darkblue';
                    document.getElementById('file').style.color = 'white';
                });
            });
        } else if (value === 'day_type') {
            const params = {
                value: 'link'
            };
            this.commonService.callSaveGraph();
            this.routeIndicator.storage = params;
            this.router.navigateByUrl('holder-day-type', {skipLocationChange: false}).then(() => {
                this.router.navigate(['holder-day-type']).then(() => {
                    document.getElementById('visualize_link').style.backgroundColor = '';
                    document.getElementById('visualize_link').style.color = '';
                    document.getElementById('day_type_link').style.backgroundColor = 'darkblue';
                    document.getElementById('day_type_link').style.color = 'white';
                    document.getElementById('file').style.backgroundColor = '';
                    document.getElementById('file').style.color = '';
                });
            });
        } else if (value === 'visualize') {
            const params = {
                value: 'link'
            };
            // this.commonService.callSaveDayType();
            this.routeIndicator.storage = params;
            this.router.navigateByUrl('visualize', {skipLocationChange: false}).then(() => {
                this.router.navigate(['visualize']).then(() => {
                    document.getElementById('visualize_link').style.backgroundColor = 'darkblue';
                    document.getElementById('visualize_link').style.color = 'white';
                    document.getElementById('day_type_link').style.backgroundColor = '';
                    document.getElementById('day_type_link').style.color = '';
                    document.getElementById('file').style.backgroundColor = '';
                    document.getElementById('file').style.color = '';
                });
            });
        }
    }

    colorChangeMethod(value) {
        if (value === 'visualize') {
            document.getElementById('visualize_link').style.backgroundColor = 'darkblue';
            document.getElementById('visualize_link').style.color = 'white';
            document.getElementById('file').style.backgroundColor = '';
            document.getElementById('file').style.color = '';
        } else if (value === 'day_type') {
            document.getElementById('day_type_link').style.backgroundColor = 'darkblue';
            document.getElementById('day_type_link').style.color = 'white';
            document.getElementById('file').style.backgroundColor = '';
            document.getElementById('file').style.color = '';
        }
    }
}
