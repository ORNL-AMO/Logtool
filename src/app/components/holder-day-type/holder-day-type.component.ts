import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';

import {BsModalService, BsModalRef} from 'ngx-bootstrap/modal';
import {DataService} from '../../providers/data.service';
import * as d3 from 'd3';
import {ConfirmationModalComponent} from '../confirmation-modal/confirmation-modal.component';

import {GraphCreationService} from '../../providers/graph-creation.service';
import {GraphCalculationService} from '../../providers/graph-calculation.service';
import {ExportCSVService} from '../../providers/export-csv.service';

import {CalendarComponent} from '../calendar/calendar.component';
import {IndexDataBaseStoreService} from '../../providers/index-data-base-store.service';
import {DatabaseOperationService} from '../../providers/database-operation.service';
import {DayType} from '../../types/day-type';
import {RouteIndicatorService} from '../../providers/route-indicator.service';
import {RouteDataTransferService} from '../../providers/route-data-transfer.service';
import {Assessment} from '../../types/assessment';


@Component({
    selector: 'app-holder-day-type',
    templateUrl: './holder-day-type.component.html',
    styleUrls: ['./holder-day-type.component.scss']
})

export class HolderDayTypeComponent implements OnInit {
    constructor(private data: DataService, private graphCalculation: GraphCalculationService,
                private graphCreation: GraphCreationService, private indexFileStore: IndexDataBaseStoreService,
                private modalService: BsModalService, private exportCsv: ExportCSVService,
                private dbOperation: DatabaseOperationService, private routeIndicator: RouteIndicatorService,
                private routeDataTransfer: RouteDataTransferService) {
    }

    @ViewChild(CalendarComponent)
    private calendar: CalendarComponent;

    shift = 'data';


    scrollActive = false;
    target: any;
    start_X = 0;
    start_Y = 0;

    temp6;
    sesName;
    temp5: any;

    selectedBinList = [];
    selectedColumnPointer: any;
    timeSeriesDayType;
    timeSeriesFileDayType;
    days = [];
    loadDataFromFile = [];
    loadTimeSeriesDayType = [];
    loadValueColumnCount = [];
    columnMainArray = [];
    assessment;
    assessmentId;
    sumArray = [];

    binList = [];
    displayBinList = [];
    defaultBinList = [
        {
            binName: 'EXCLUDED',
            binColor: 'red'
        },
        {
            binName: 'WEEKDAY',
            binColor: 'green'
        },
        {
            binName: 'WEEKEND',
            binColor: 'blue'
        }
    ];
    graphDayAverage: any;
    graphBinAverage: any;
    annotationListDayAverage = [];
    annotationListBinAverage = [];
    globalYAverageDay = [];
    globalYAverageBin = [];
    toggleRelayoutDay = false;
    fileSelector = [];
    columnSelector = [];
    columnSelectorList: any = [];
    dataFromInput: any = [];
    tabs = [];
    mac: boolean;
    modalRef: BsModalRef;
    newBinName;
    newBinColor;
    selectedDates: Set<any>;
    showBinMode = true;
    dayTypeMode = false;
    loadDayTypeId;
    loadSessionData: DayType;
    dayTypeReportList = [];
    routeType;
    reportName;

    ngOnInit() {
        this.plotGraphDayAverageInit();
        this.plotGraphBinAverageInit();
        this.routeType = this.routeIndicator.storage.value;
        this.mac = window.navigator.platform.includes('Mac') || window.navigator.platform.includes('mac');
        this.indexFileStore.viewFromQuickSaveStore().then(() => {
            this.data.currentQuickSaveItem.subscribe(quickSave => {
                if (quickSave[0] !== undefined) {
                    this.indexFileStore.viewSelectedAssessmentStore(parseInt(quickSave[0].id, 10)).then(() => {
                        this.data.currentAssessmentItem.subscribe(assessment => {
                            this.assessment = assessment;
                            this.assessmentId = this.assessment.id;
                            this.loadDayTypeId = this.assessment.dayTypeId;
                            this.selectedDates = new Set([]);
                            this.dataFromInput = this.assessment.csv;
                            this.tabs = [];
                            for (let i = 0; i < this.dataFromInput.length; i++) {
                                this.tabs.push({
                                    name: this.dataFromInput[i].name,
                                    id: this.dataFromInput[i].id,
                                    tabId: i
                                });
                            }
                            this.generateDayTypeReportList(assessment);
                            this.populateSpinner();
                            if (this.routeType === 'link' || this.routeType === 'create_new') {
                                if (this.assessment.dayType !== undefined) {
                                    this.loadSession(this.assessment.dayType);
                                }
                            } else if (this.routeType === 'load_report') {
                                const reportLoad = this.routeIndicator.storage.dayType;
                                this.loadSession(reportLoad);
                            }
                        }, err => {
                            console.log(err);
                        });
                    });
                }
            });
        });
    }

    loadSession(dayType) {
        this.loadSessionData = dayType;
        this.dayTypeMode = this.loadSessionData.dayTypeMode;
        this.loadDayTypeNavigation(false);
    }

    generateReport() {
        if (this.reportName !== '' || this.reportName !== undefined) {
            if (this.columnMainArray.length > 0) {
                let valueColumnCount, timeSeries, dataFromFile;
                if (this.dayTypeMode) {
                    dataFromFile = this.loadSessionData.loadDataFromFile;
                    timeSeries = this.loadSessionData.loadTimeSeriesDayType;
                    valueColumnCount = this.loadSessionData.loadValueColumnCount;
                } else {
                    dataFromFile = this.loadDataFromFile;
                    timeSeries = this.loadTimeSeriesDayType;
                    valueColumnCount = this.loadValueColumnCount;
                }
                this.dbOperation.generateDayTypeReport(this.assessmentId, this.graphDayAverage.layout.title, this.reportName,
                    dataFromFile, timeSeries, valueColumnCount, this.columnMainArray, this.sumArray,
                    this.binList, this.displayBinList, this.selectedBinList, this.days, this.selectedDates, this.graphDayAverage,
                    this.graphBinAverage, this.showBinMode, this.toggleRelayoutDay, this.annotationListDayAverage,
                    this.annotationListBinAverage, this.globalYAverageDay, this.globalYAverageBin, true, this.assessment).then(() => {
                    this.indexFileStore.viewSelectedAssessmentStore(parseInt(this.assessmentId, 10)).then(() => {
                        this.data.currentAssessmentItem.subscribe(assessment => {
                            this.generateDayTypeReportList(assessment);
                            document.getElementById('generate_report').click();
                        });
                    });
                });

            } else {
                alert('Create Graph');
            }
        }
    }

    generateDayTypeReportList(assessment: Assessment) {
        console.log(assessment);
        this.dayTypeReportList = [];
        if (assessment.reportDayType !== undefined) {
            for (let i = 0; i < assessment.reportDayType.length; i++) {
                const dayTypeReport = {
                    name: assessment.reportDayType[i].displayName,
                    value: assessment.reportDayType[i]
                };
                this.dayTypeReportList.push(dayTypeReport);
            }
        }
    }

    routeToDayType(file: any) {
        const params = {
            value: 'load_report',
            dayType: file.value
        };
        this.routeIndicator.storage = params;
        this.ngOnInit();
    }

    hideReport() {
        document.getElementById('generate_report').click();
    }

    allocateBins() {
        this.selectedBinList = [];

        for (let i = 0; i < this.binList.length; i++) {
            const tempSelectedBinList = [];
            for (let j = 0; j < this.days.length; j++) {
                if (this.days[j].bin === this.binList[i].binName) {
                    tempSelectedBinList.push(this.days[j]);
                }
            }
            this.selectedBinList.push(tempSelectedBinList);
        }
        this.calculateBinAverage(0);
    }

    // resets selectedDates
    clearSelection() {
        const dates = Array.from(this.selectedDates);
        for (let i = 0; i < dates.length; i++) {
            this.toggleSelect(dates[i]);
        }
        this.selectedDates.clear();
    }

    // add/removes item from selectedDates set
    toggleSelect(id) {
        if (this.graphDayAverage === undefined) {
        } else {
            for (let graphDay = 0; graphDay < this.graphDayAverage.data.length; graphDay++) {
                this.days[graphDay].visible = this.graphDayAverage.data[graphDay].visible;
            }
            const active = d3.select(document.getElementById(id));
            const key = active._groups[0][0].__data__.values[0];
            const found = this.days.find(obj => obj.date.getDate() === key.getDate());
            if (this.selectedDates.has(id)) {
                this.selectedDates.delete(id);
                active.attr('stroke', 'none');
                this.days[this.days.indexOf(found)].stroke = 1;
            } else {
                this.selectedDates.add(id);
                active.attr('stroke', 'black');
                active.attr('stroke-width', '4');
                this.days[this.days.indexOf(found)].stroke = 5;
            }
        }
        this.plotGraphDayAverage(0);
        this.calendar.selectedDates = this.selectedDates;
    }

// Functions related to File / Column Selection ********************************************************************************************
    populateSpinner() {
        this.fileSelector = [];
        for (let i = 0; i < this.tabs.length; i++) {
            const filename = this.tabs[i].name;
            this.fileSelector.push({
                name: filename,
                identifier: i
            });
        }
    }

    fileSelectorEvent(event) {
        this.columnSelectorList = [];
        this.columnSelector = [];
        const currentSelectedFile = event.target.value;
        const tempHeader = this.dataFromInput[parseInt(currentSelectedFile, 10)].selectedHeader;
        for (let i = 0; i < tempHeader.length; i++) {

            if (!(this.dataFromInput[currentSelectedFile].dataArrayColumns[i][0] instanceof Date)) {
                this.columnSelector.push({
                    name: tempHeader[i].headerName,
                    identifier: `${currentSelectedFile},${i}`
                });
            } else if (this.dataFromInput[currentSelectedFile].dataArrayColumns[i][0] instanceof Date) {
                this.timeSeriesFileDayType = `${currentSelectedFile},${i}`;

            }
        }
    }

    columnSelectorEvent(event) {
        this.annotationListDayAverage = [];
        this.annotationListBinAverage = [];
        this.columnSelectorList.pop();
        this.columnSelectorList.push({
            name: this.columnSelector[event.target.options.selectedIndex].name,
            value: event.target.value
        });
    }

    binToggled(event) {
        // if graphDayAverage is undefined do nothing.
        if (this.graphDayAverage === undefined) {
        } else {
            for (let graphDay = 0; graphDay < this.graphDayAverage.data.length; graphDay++) {
                this.days[graphDay].visible = this.graphDayAverage.data[graphDay].visible;
            }
            const displayIndex = this.displayBinList.map(d => d.binName).indexOf(event.name);
            const storeIndex = this.binList.map(d => d.binName).indexOf(event.name);
            // If yes and not already in
            if (event.graph && displayIndex < 0) {
                this.displayBinList.push(this.binList[storeIndex]);
            } else if (!event.graph && displayIndex >= 0) {
                this.displayBinList.splice(displayIndex, 1);
            }
            this.plotGraphDayAverage(0);
        }
    }

    resetBins() {
        this.clearSelection();
        if (this.dayTypeMode) {
            this.loadDayTypeNavigation(true);
        } else {
            this.dayTypeNavigation(true);
        }
    }

    // Moves everything to 'EXCLUDED' BIN
    // redraws calendar and graphDayAverage
    clearBins() {
        this.annotationListDayAverage = [];
        this.annotationListBinAverage = [];
        for (let i = 0; i < this.days.length; i++) {
            this.days[i].bin = 'EXCLUDED';
        }
        this.allocateBins();
        this.plotGraphDayAverage(0);
    }

    // Functions for adding Bin Types************************************
    showBinMod(template: TemplateRef<any>) {
        this.newBinName = '';
        this.newBinColor = '';
        this.modalRef = this.modalService.show(template);
    }

    addBinType() {
        if (this.newBinName === '') {
            alert('Please Enter a Name for the Bin');
            return;
        }
        if (this.newBinColor === '') {
            alert('Please Enter a Color for the Bin');
            return;
        }
        if (!this.isColor(this.newBinColor.toLowerCase())) {
            alert('NOT A KNOWN COLOR. Please Enter a Valid Color');
            return;
        }
        if (this.newBinName.length > 10) {
            alert('Character Limit Reached. Please Enter a name with 10 characters or less');
            return;
        }
        if (this.newBinName.toLowerCase() === 'add') {
            alert('Name Reserved');
            return;
        }
        const currentBins = this.binList.map(d => d.binName.toUpperCase());
        const currentColors = this.binList.map(d => d.binColor.toLowerCase());
        if (currentBins.indexOf(this.newBinName.toUpperCase()) > -1) {
            alert('Name Already in Use');
            return;
        }
        if (currentColors.indexOf(this.newBinColor.toLowerCase()) > -1) {
            alert('Color Already in Use');
            return;
        }
        this.binList.splice(0, 0, {binName: this.newBinName.toUpperCase(), binColor: this.newBinColor.toLowerCase()});
        this.displayBinList.splice(0, 0, {binName: this.newBinName.toUpperCase(), binColor: this.newBinColor.toLowerCase()});
        this.selectedBinList.splice(0, 0, []);

        this.modalRef.hide();
        this.calendar.update();
    }

    isColor(strColor) {
        const s = new Option().style;
        s.color = strColor;
        return s.color === strColor;
    }

    plotShift(event) {
        if (event.target.value === 'bin') {
            this.showBinMode = false;
            this.calculateBinAverage(0);
        } else if (event.target.value === 'day') {
            this.showBinMode = true;
        }
    }


    removeBin(event: string) {
        if (event === 'EXCLUDED') {
            alert('EXCLUDED is the default bin, and cannot be deleted at this time');
            return;
        } else {
            const initialState = {message: ' Are you sure you want to delete the ' + event + ' bin?'};
            this.modalRef = this.modalService.show(ConfirmationModalComponent, {initialState});
            this.modalRef.content.onClose.subscribe(result => {
                if (result) {
                    const binIndex = this.binList.findIndex(obj => obj.binName === event);
                    const contents = this.selectedBinList[binIndex];
                    if (contents !== undefined && contents.length > 0) {
                        for (let i = 0; i < contents.length; i++) {
                            const entry = this.days[this.days.indexOf(contents[i])];
                            this.calendar.movBins(entry.id, 'EXCLUDED');
                        }
                    }
                    this.binList.splice(binIndex, 1);
                    this.displayBinList.splice(binIndex, 1);

                    this.allocateBins();
                    this.plotGraphDayAverage(0);
                }
            });
        }
    }

    startDrag(event, id: string) {
        event.stopPropagation();
        event.preventDefault();
        this.scrollActive = true;
        this.target = document.getElementById(id);
        this.start_Y = event.pageY - this.target.offsetTop;
        this.start_X = event.pageX - this.target.offsetLeft;
        this.target.classList.add('active');
    }

    endDrag(event) {
        if (!this.scrollActive) {
            return false;
        }
        event.stopPropagation();
        event.preventDefault();
        this.scrollActive = false;
        this.target.classList.remove('active');
        this.target = null;
    }

    drag(event: MouseEvent, direction: string) {
        if (!this.scrollActive) {
            return false;
        }
        event.stopPropagation();
        event.preventDefault();
        let start;
        let walk;
        let old;
        if (direction === 'X') {
            start = event.pageX - this.target.offsetLeft;
            walk = (start - this.start_X) / 5;
            old = this.target.scrollLeft;
            this.target.scrollLeft = old + walk;
        } else {
            start = event.pageY - this.target.offsetTop;
            walk = (start - this.start_Y);
            old = this.target.scrollTop;
            this.target.scrollTop = old + walk;
        }
    }

    selectionToggle(event) {
        for (let i = 0; i < event.items.length; i++) {
            this.toggleSelect(event.items[i]);
        }
    }

    shiftBins(event) {
        this.days = event;
        this.allocateBins();
        this.plotGraphDayAverage(0);
    }

    dayTypeNavigation(reset) {
        this.dayTypeMode = false;
        this.columnMainArray = [];
        this.days = [];
        this.selectedDates.clear();
        this.annotationListDayAverage = [];
        this.annotationListBinAverage = [];
        let timeSeriesDayType = [];
        const dataFromFile = this.dataFromInput;
        if (this.columnSelectorList.length === 0) {
            alert('Please select Column');
        } else {
            if (reset) {
                for (const i in this.defaultBinList) {
                    if (this.binList.indexOf(this.defaultBinList[i]) < 0) {
                        const index = this.binList.findIndex(obj => obj.binName === this.defaultBinList[i].binName);
                        if (index < 0) {
                            this.binList.push(this.defaultBinList[i]);
                            this.displayBinList.push(this.defaultBinList[i]);
                        }
                    }
                }
            } else {
                this.binList = [];
                this.displayBinList = [];
                for (const i in this.defaultBinList) {
                    if (this.binList.indexOf(this.defaultBinList[i]) < 0) {
                        const index = this.binList.findIndex(obj => obj.binName === this.defaultBinList[i].binName);
                        if (index < 0) {
                            this.binList.push(this.defaultBinList[i]);
                            this.displayBinList.push(this.defaultBinList[i]);
                        }
                    }
                }
            }
            this.selectedColumnPointer = this.columnSelectorList;

            const timeSeriesColumnPointer = this.timeSeriesFileDayType.split(',');
            this.timeSeriesDayType = dataFromFile[parseInt(timeSeriesColumnPointer[0],
                10)].dataArrayColumns[parseInt(timeSeriesColumnPointer[1], 10)];
            timeSeriesDayType = this.data.curateTimeSeries(this.timeSeriesDayType);
            const returnObject = this.graphCalculation.averageCalculation(dataFromFile, timeSeriesDayType,
                this.selectedColumnPointer, this.dayTypeMode);
            this.days = returnObject.days;
            this.columnMainArray = returnObject.columnMainArray;
            this.loadDataFromFile = returnObject.loadDataFromFile;
            this.loadTimeSeriesDayType = returnObject.loadTimeSeriesDayType;
            this.loadValueColumnCount = returnObject.loadValueColumnCount;
            this.allocateBins();
            this.plotGraphDayAverage(0);
            this.calculateBinAverage(0);
            this.calendar.binList = this.binList;
            this.calendar.days = this.days;
            this.calendar.daysToNest = timeSeriesDayType;
            this.calendar.load();
        }
    }

    loadDayTypeNavigation(reset) {
        this.dayTypeMode = true;
        this.loadDayTypeId = this.loadSessionData.id;
        this.sesName = this.loadSessionData.displayName;
        const dataFromFile = this.loadSessionData.loadDataFromFile;
        this.timeSeriesDayType = this.loadSessionData.loadTimeSeriesDayType;
        this.selectedColumnPointer = this.loadSessionData.loadValueColumnCount;
        this.binList = this.loadSessionData.loadBinList;
        this.displayBinList = this.loadSessionData.loadDisplayBinList;
        this.selectedBinList = this.loadSessionData.loadSelectedBinList;
        this.showBinMode = this.loadSessionData.loadShowBinMode;
        if (reset) {
            this.annotationListDayAverage = [];
            this.annotationListBinAverage = [];
            for (const i in this.defaultBinList) {
                if (this.binList.indexOf(this.defaultBinList[i]) < 0) {
                    const index = this.binList.findIndex(obj => obj.binName === this.defaultBinList[i].binName);
                    if (index < 0) {
                        this.binList.push(this.defaultBinList[i]);
                        this.displayBinList.push(this.defaultBinList[i]);
                    }
                }
            }
            const returnObject = this.graphCalculation.averageCalculation(dataFromFile, this.timeSeriesDayType,
                this.selectedColumnPointer, this.dayTypeMode);
            this.days = returnObject.days;
            this.columnMainArray = returnObject.columnMainArray;
            this.loadDataFromFile = returnObject.loadDataFromFile;
            this.loadTimeSeriesDayType = returnObject.loadTimeSeriesDayType;
            this.loadValueColumnCount = returnObject.loadValueColumnCount;
            this.allocateBins();
            this.plotGraphDayAverage(0);
            this.calculateBinAverage(0);
        } else {
            this.columnMainArray = this.loadSessionData.loadColumnMainArray;
            this.selectedDates = new Set<any>(this.loadSessionData.loadSelectedDates);
            this.sumArray = this.loadSessionData.loadSumArray;
            this.days = this.loadSessionData.loadDays;
            this.calendar.selectedDates = this.selectedDates;
            this.toggleRelayoutDay = this.loadSessionData.loadToggleRelayoutDay;
            this.graphDayAverage = this.loadSessionData.loadGraphDayAverage;
            this.graphBinAverage = this.loadSessionData.loadGraphBinAverage;
            this.annotationListDayAverage = this.loadSessionData.loadAnnotationListDayAverage;
            this.annotationListBinAverage = this.loadSessionData.loadAnnotationListBinAverage;
            this.globalYAverageDay = this.loadSessionData.loadGlobalYAverageDay;
            this.globalYAverageBin = this.loadSessionData.loadGlobalYAverageBin;
        }
        this.calendar.binList = this.binList;
        this.calendar.days = this.days;
        this.calendar.daysToNest = this.timeSeriesDayType;
        this.calendar.load();
    }

    calculateBinAverage(channelId) {
        this.sumArray = this.graphCalculation.calculateBinAverage(channelId, this.binList, this.days,
            this.selectedColumnPointer, this.columnMainArray);
        this.plotGraphBinAverage(0);
    }

    plotGraphDayAverage(channelId) {
        this.graphDayAverage = this.graphCreation.plotGraphDayAverage(this.graphDayAverage, channelId, this.columnMainArray, this.days,
            this.displayBinList, this.annotationListDayAverage, this.toggleRelayoutDay);
        if (this.graphDayAverage.data.length > 0) {
            this.calculatePlotStatsDay();
        }
    }

    plotGraphDayAverageInit() {
        this.graphDayAverage = this.graphCreation.plotGraphDayAverageInit();
    }

    plotGraphBinAverageInit() {
        this.graphBinAverage = this.graphCreation.plotGraphBinAverageInit();
    }

    plotGraphBinAverage(channelId) {
        this.graphBinAverage = this.graphCreation.plotGraphBinAverage(this.graphBinAverage, channelId, this.sumArray,
            this.annotationListBinAverage);
        if (this.graphBinAverage.data.length > 0) {
            this.calculatePlotStatsBin();
        }
    }

    calculatePlotStatsDay() {
        this.toggleRelayoutDay = true;
        this.globalYAverageDay = this.graphCreation.calculatePlotStatsDay(this.graphDayAverage);
    }

    calculatePlotStatsBin() {
        this.globalYAverageBin = this.graphCreation.calculatePlotStatsBin(this.graphBinAverage);
    }

    clickAnnotationDayAverage(data) {
        if (data.points === undefined) {
        } else if ((!this.mac && data.event.ctrlKey) || (this.mac && data.event.metaKey)) {
            this.annotationListDayAverage = this.graphDayAverage.layout.annotations || [];
            this.annotationListDayAverage = this.graphCreation.clickAnnotationDayAverage(data,
                this.annotationListDayAverage, this.graphDayAverage);
            this.plotGraphDayAverage(0);
        } else {
            const selectedTrace = this.days[data.points[0].curveNumber].id;
            this.toggleSelect(selectedTrace);
        }
    }

    clickAnnotationBinAverage(data) {
        if (data.points === undefined) {
        } else {
            this.annotationListBinAverage = this.graphBinAverage.layout.annotations || [];
            this.annotationListBinAverage = this.graphCreation.clickAnnotationBinAverage(data,
                this.annotationListBinAverage, this.graphBinAverage);
            this.plotGraphBinAverage(0);
        }
    }

    exportDayAverageData() {
        if (this.graphDayAverage.data.length < 1) {
            alert('Please import Data first');
        } else {
            this.exportCsv.exportDayAverageData(this.graphDayAverage, this.displayBinList);
        }
    }

    exportBinAverageData() {
        if (this.graphBinAverage.data.length < 1) {
            alert('Please import Data first');
        } else {
            this.exportCsv.exportBinAverageData(this.graphBinAverage);
        }
    }

    saveSession() {
        let valueColumnCount, timeSeries, dataFromFile;
        if (this.dayTypeMode) {
            dataFromFile = this.loadSessionData.loadDataFromFile;
            timeSeries = this.loadSessionData.loadTimeSeriesDayType;
            valueColumnCount = this.loadSessionData.loadValueColumnCount;
        } else {
            dataFromFile = this.loadDataFromFile;
            timeSeries = this.loadTimeSeriesDayType;
            valueColumnCount = this.loadValueColumnCount;
        }
        if (this.dayTypeMode) {
            this.dbOperation.updateSession(this.loadDayTypeId, this.assessmentId, this.graphDayAverage.layout.title, this.sesName,
                dataFromFile, timeSeries, valueColumnCount, this.columnMainArray, this.sumArray,
                this.binList, this.displayBinList, this.selectedBinList, this.days, this.selectedDates, this.graphDayAverage,
                this.graphBinAverage, this.showBinMode, this.toggleRelayoutDay, this.annotationListDayAverage,
                this.annotationListBinAverage, this.globalYAverageDay, this.globalYAverageBin, this.dayTypeMode, this.assessment);
        } else {
            if (this.sesName === '' || this.sesName === undefined) {
                alert('Invalid name. Please try again');
                return;
            }
            this.dbOperation.saveSession(this.loadDayTypeId, this.assessmentId, this.columnSelectorList[0].name, this.sesName,
                dataFromFile, timeSeries, valueColumnCount, this.columnMainArray, this.sumArray,
                this.binList, this.displayBinList, this.selectedBinList, this.days, this.selectedDates, this.graphDayAverage,
                this.graphBinAverage, this.showBinMode, this.toggleRelayoutDay, this.annotationListDayAverage,
                this.annotationListBinAverage, this.globalYAverageDay, this.globalYAverageBin, true, this.assessment);
            document.getElementById('save_btn').click();
        }
    }

    hideSave() {
        document.getElementById('save_btn').click();
    }
}

