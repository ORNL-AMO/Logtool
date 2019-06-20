import 'reflect-metadata';
import '../polyfills';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { HttpClientModule, HttpClient } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';

// NG Translate
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

import { ElectronService } from './providers/electron.service';

import { WebviewDirective } from './directives/webview.directive';

import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';
import { ToolHeaderComponent } from './components/tool-header/tool-header.component';
import { TableDataComponent } from './components/table-data/table-data.component';
import { PlotLineGraphComponent } from './components/plot-line-graph/plot-line-graph.component';
import { PlotScatterGraphComponent } from './components/plot-scatter-graph/plot-scatter-graph.component';
import { ImportDataComponent } from './components/import-data/import-data.component';
import {BsModalService, ModalModule} from 'ngx-bootstrap';

// Log Tool Imports
import * as PlotlyJS from 'plotly.js/dist/plotly.js';
import { PlotlyModule } from 'angular-plotly.js';
import { AgGridModule } from 'ag-grid-angular';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DayTypeCalculationComponent } from './components/day-type-calculation/day-type-calculation.component';

// AoT requires an exported function for factories
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}
// Plotly assignment
PlotlyModule.plotlyjs = PlotlyJS;
@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    WebviewDirective,
    ToolHeaderComponent,
    TableDataComponent,
    PlotLineGraphComponent,
    PlotScatterGraphComponent,
    ImportDataComponent,
    DayTypeCalculationComponent
  ],
  entryComponents: [ImportDataComponent],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    AppRoutingModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (HttpLoaderFactory),
        deps: [HttpClient]
      }
    }),
    // Log Tool imports
    PlotlyModule,
    AgGridModule.withComponents([]),
    BrowserAnimationsModule,
    ModalModule.forRoot(),
  ],
  providers: [ElectronService],
  bootstrap: [AppComponent]
})
export class AppModule { }
