import {HomeComponent} from './components/home/home.component';
import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {TableDataComponent} from './components/table-data/table-data.component';
import {PlotGraphComponent} from './components/plot-graph/plot-graph.component';
import {DayTypeBinComponent} from './components/day-type-bin/day-type-bin.component';
import {HolderDayTypeComponent} from './components/holder-day-type/holder-day-type.component';

import {HistogramBinTypeComponent} from './components/histogram-bin-type/histogram-bin-type.component';
import {CalendarComponent} from './components/calendar/calendar.component';
import {ImportDataComponent} from './components/import-data/import-data.component';


const routes: Routes = [

  {
    path: '',
    component: HomeComponent,
    children: [
      {
        path: 'table-data',
        component: TableDataComponent,
      }]
  },

  {
    path: 'holder-day-type',
    component: HolderDayTypeComponent,
    children: [
      {
      path: 'day-type-bin',
      component: DayTypeBinComponent,
      },
      {
        path: 'calendar',
        component: CalendarComponent,
      }
    ]
  },
  {
    path: 'plot-graph',
    component: PlotGraphComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {useHash: true})],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
