import {HomeComponent} from './components/home/home.component';
import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {TableDataComponent} from './components/table-data/table-data.component';
import {DayTypeCalculationComponent} from './components/day-type-calculation/day-type-calculation.component';

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
    path: 'day-type-calculation',
    component: DayTypeCalculationComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {useHash: true})],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
