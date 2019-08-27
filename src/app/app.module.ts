import 'reflect-metadata';
import '../polyfills';
import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';

import {HttpClientModule, HttpClient} from '@angular/common/http';

import {AppRoutingModule} from './app-routing.module';

// NG Translate
import {TranslateModule, TranslateLoader} from '@ngx-translate/core';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';

import {ElectronService} from './providers/electron.service';

import {WebviewDirective} from './directives/webview.directive';


import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';
import { ToolHeaderComponent } from './components/tool-header/tool-header.component';
import { TableDataComponent } from './components/table-data/table-data.component';
import { ImportDataComponent } from './components/import-data/import-data.component';
import {ModalModule, TooltipModule} from 'ngx-bootstrap';


// Log Tool Imports
import * as PlotlyJS from 'plotly.js/dist/plotly.js';

import { PlotlyModule } from 'angular-plotly.js';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { PlotGraphComponent } from './components/plot-graph/plot-graph.component';
import { DayTypeBinComponent } from './components/day-type-bin/day-type-bin.component';
import { HolderDayTypeComponent } from './components/holder-day-type/holder-day-type.component';
import { ConfirmationModalComponent } from './components/confirmation-modal/confirmation-modal.component';
import { CalendarComponent } from './components/calendar/calendar.component';
import { PopoverModule } from 'ngx-bootstrap/popover';
import { ImportJsonFileComponent } from './components/import-json-file/import-json-file.component';
import { FileManagementComponent } from './components/file-management/file-management.component';
import { FileImportComponent } from './components/file-import/file-import.component';
import { GraphTextAnnotationComponent } from './components/graph-text-annotation/graph-text-annotation.component';



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
    ImportDataComponent,
    PlotGraphComponent,
    DayTypeBinComponent,
    HolderDayTypeComponent,
    ConfirmationModalComponent,
    CalendarComponent,
    ImportJsonFileComponent,
    FileManagementComponent,
    FileImportComponent,
    GraphTextAnnotationComponent

  ],
  entryComponents: [ImportDataComponent, ConfirmationModalComponent, ImportJsonFileComponent, FileImportComponent, GraphTextAnnotationComponent],
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
    BrowserAnimationsModule,
    ModalModule.forRoot(),
    PopoverModule.forRoot(),
    TooltipModule.forRoot(),
  ],
  providers: [ElectronService],
  bootstrap: [AppComponent]
})
export class AppModule {
}
