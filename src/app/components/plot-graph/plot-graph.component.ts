import {Component, OnInit} from '@angular/core';
import {DataService} from '../../providers/data.service';
import {ExportCSVService} from '../../providers/export-csv.service';
import {RouteDataTransferService} from '../../providers/route-data-transfer.service';
import {GraphStats} from '../../types/graph-stats';
import * as XLSX from 'xlsx';
import * as stats from 'stats-lite';
import {IndexDataBaseStoreService} from '../../providers/index-data-base-store.service';
import {Graph} from '../../types/graph';
import {CommonService} from '../../providers/common.service';


@Component({
    selector: 'app-plot-graph',
    templateUrl: './plot-graph.component.html',
    styleUrls: ['./plot-graph.component.scss']
})
export class PlotGraphComponent implements OnInit {
    graph: any;
    dataInput = [];
    assessment;
    assessmentGraph;
    xValue = [];
    yValue = [];
    timeSeries = [];
    plotGraph = [];
    graphType = '';
    reportGraph;
    histValue = [];
    annotationListLine = [];
    annotationListScatter = [];
    globalYMin;
    globalYMax;
    globalYAverage = [];
    globalXMin;
    globalXMax;
    globalXAverage = [];
    type;

    constructor(private data: DataService, private csvexport: ExportCSVService, private routeDataTransfer: RouteDataTransferService,
                private indexFileStore: IndexDataBaseStoreService, private commonService: CommonService) {
        this.commonService.invokeEvent.subscribe(value => {
            if (value === 'visualize') {
                this.saveGraph();
            }
        });
    }

    public stats: GraphStats;

    ngOnInit() {
        if (this.routeDataTransfer.storage === undefined) {
            this.annotationListLine = [];
            this.annotationListScatter = [];
            this.displayGraph(this.graphType);
        } else {
            this.assessment = this.routeDataTransfer.storage.assessment;
            this.assessmentGraph = this.routeDataTransfer.storage.assessmentGraph;
            this.graphType = this.routeDataTransfer.storage.graphType;
            if (this.assessment.graph !== undefined && this.assessmentGraph && this.graphType === 'load_graph') {
                this.loadDisplayGraph(this.assessment.graph);
            } else if (this.graphType === 'report_graph' && this.routeDataTransfer.storage.report !== undefined) {
                this.reportGraph = this.routeDataTransfer.storage.report;
                this.loadDisplayGraph(this.reportGraph);
            } else {
                this.annotationListLine = [];
                this.annotationListScatter = [];
                this.dataInput = this.routeDataTransfer.storage.csv;
                this.graphType = this.routeDataTransfer.storage.graphType;
                this.displayGraph(this.graphType);
            }
        }
    }


    onCreateCsv() {
        const wb = XLSX.utils.book_new();
        const input: any[] = [];
        input[0] = [];
        if (this.routeDataTransfer.storage.graphType === 'scatter_graph') {
            input[0].push(this.routeDataTransfer.storage.x.name);
        } else {
            input[0].push(this.routeDataTransfer.storage.timeSeries[0].name);
        }

        let max_sample = 0;
        // get Y-headers & calculate how many data samples
        for (let i = 0; i < this.plotGraph.length; i++) {
            input[0].push(this.plotGraph[i].name);
            if (max_sample < this.plotGraph[i].x.length) {
                max_sample = this.plotGraph[i].x.length;
            }
            if (max_sample < this.plotGraph[i].y.length) {
                max_sample = this.plotGraph[i].y.length;
            }
        }
        const data: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(input);
        XLSX.utils.book_append_sheet(wb, data, 'test');


        for (let i = 0; i < max_sample; i++) {
            input[0] = [];
            input[0].push(this.plotGraph[0].x[i]);
            for (let j = 0; j < this.plotGraph.length; j++) {
                input[0].push(this.plotGraph[j].y[i]);
            }
            XLSX.utils.sheet_add_aoa(data, input, {origin: -1});
        }
        const range = XLSX.utils.decode_range(data['!ref']);
        for (let rowNum = range.s.r; rowNum <= range.e.r; rowNum++) {
            for (let colNum = range.s.c; colNum <= range.e.c; colNum++) {
                const cell = data[XLSX.utils.encode_cell({c: colNum, r: rowNum})];
                if ((cell.z) === 'm/d/yy') {

                    cell.z = 'dd/mm/yy hh:mm:ss';
                    delete cell.w;
                    XLSX.utils.format_cell(cell);
                }

            }
        }
        XLSX.writeFile(wb, 'THISPAGE.csv', {bookType: 'csv'});
    }

    saveGraph() {
        if (this.graphType === undefined || this.graphType === '') {
            // alert('No Graph to Save');
            return;
        } else {
            const graph: Graph = {
                id: this.assessment.graphId,
                assessmentId: this.assessment.id,
                displayName: this.graph.layout.title,
                graph: this.graph,
                visualizeMode: true
            };
            if (this.assessment.graph !== undefined) {
                this.indexFileStore.updateGraphStore(graph, this.assessment);
                // alert('Graph Updated');
            } else {
                this.indexFileStore.insertIntoGraphStore(graph, this.assessment);
                // alert('Graph Saved');
            }
        }
    }

    loadDisplayGraph(graph) {
        this.graph = graph;
        if (this.graph.layout.title === 'Line Plot') {
            this.annotationListLine = this.graph.layout.annotations;
        } else if (this.graph.layout.title === 'Scatter Plot') {
            this.annotationListScatter = this.graph.layout.annotations;
        } else if (this.graph.layout.title === 'Standard Deviation Histogram') {

        }
    }

    generateReport(reportTitle) {
        return new Promise(resolve => {
            if (this.graphType === undefined || this.graphType === '') {
                alert('No Graph to Save');
                return;
            } else {
                const graph: Graph = {
                    id: this.data.getRandomInt(99999),
                    assessmentId: this.assessment.id,
                    displayName: reportTitle,
                    graph: this.graph,
                    visualizeMode: true
                };
                this.indexFileStore.viewSelectedGraphReport(this.assessment.id).then(() => {
                    this.data.currentGraphItemArray.subscribe(graphReport => {
                        this.indexFileStore.insertIntoGraphReportStore(graph, this.assessment, graphReport).then(() => {
                            alert('Report Generated');
                            resolve();
                        });
                    });
                });
            }
        });
    }

    displayGraph(type) {
        this.type = type;
        this.xValue = [];
        this.yValue = [];
        this.timeSeries = [];
        this.plotGraph = [];
        if (type === 'line_graph') {
            if (!this.assessmentGraph) {
                this.timeSeries = this.routeDataTransfer.storage.timeSeries[0].value.split(',');
                this.yValue = this.routeDataTransfer.storage.value;
                for (let i = 0; i < this.yValue.length; i++) {
                    const value = this.yValue[i].value.split(',');
                    this.plotGraph.push({
                        x: this.dataInput[parseInt(this.timeSeries[0], 10)].dataArrayColumns[parseInt(this.timeSeries[1], 10)],
                        y: this.dataInput[parseInt(value[0], 10)].dataArrayColumns[parseInt(value[1], 10)],
                        type: 'linegl',
                        mode: 'lines',
                        name: this.yValue[i].name
                    });
                }
            } else if (this.graphType === 'load_graph') {
                this.plotGraph = this.assessment.graph.data;
            } else if (this.graphType === 'report_graph') {
                this.plotGraph = this.reportGraph.data;
            }
            let layout;
            if (this.annotationListLine.length > 0) {
                layout = {
                    hovermode: 'closest',
                    autosize: true,
                    title: 'Line Plot',
                    annotations: this.annotationListLine,
                    xaxis: {
                        autorange: false,
                        range: this.graph.layout.xaxis.range
                    },
                    yaxis: this.graph.layout.yaxis
                };
            } else {
                layout = {
                    hovermode: 'closest',
                    autosize: true,
                    title: 'Line Plot',
                    annotations: this.annotationListLine,
                    xaxis: {
                        autorange: true,
                    },
                    yaxis: {
                        autorange: true,
                        type: 'linear'
                    }
                };
            }
            this.graph = {
                data: this.plotGraph,
                layout: layout,
                config: {
                    'showLink': false,
                    'scrollZoom': true,
                    'displayModeBar': true,
                    'editable': false,
                    'responsive': true,
                    'displaylogo': false
                }
            };
            this.calculatePlotStats();
        } else if (type === 'scatter_graph') {
            if (!this.assessmentGraph) {
                this.xValue = this.routeDataTransfer.storage.x[0].value.split(',');
                this.yValue = this.routeDataTransfer.storage.y[0].value.split(',');
                this.plotGraph.push({
                    x: this.dataInput[parseInt(this.xValue[0], 10)].dataArrayColumns[parseInt(this.xValue[1], 10)],
                    y: this.dataInput[parseInt(this.yValue[0], 10)].dataArrayColumns[parseInt(this.yValue[1], 10)],
                    type: 'scattergl',
                    mode: 'markers'
                });
            } else if (this.graphType === 'load_graph') {
                this.plotGraph = this.assessment.graph.data;
            } else if (this.graphType === 'report_graph') {
                this.plotGraph = this.reportGraph.data;
            }
            let layout;
            if (this.annotationListScatter.length > 0) {
                layout = {
                    hovermode: 'closest',
                    autosize: true,
                    title: 'Scatter Plot',
                    annotations: this.annotationListScatter,
                    xaxis: {
                        title: this.graph.layout.xaxis.title,
                        autorange: false,
                        range: this.graph.layout.xaxis.range
                    },
                    yaxis: {
                        title: this.graph.layout.yaxis.title,
                    }
                };
            } else {
                layout = {
                    hovermode: 'closest',
                    autosize: true,
                    title: 'Scatter Plot',
                    annotations: this.annotationListScatter,
                    xaxis: {
                        title: {
                            text: this.routeDataTransfer.storage.x[0].name,
                            font: {
                                family: 'Courier New, monospace',
                                size: 18,
                                color: '#7f7f7f',
                                style: 'bold'
                            }
                        },
                    },
                    yaxis: {
                        title: {
                            text: this.routeDataTransfer.storage.y[0].name,
                            font: {
                                family: 'Courier New, monospace',
                                size: 18,
                                color: '#7f7f7f',
                                style: 'bold'
                            }
                        }
                    }
                };
            }
            this.graph = {
                data: this.plotGraph,
                layout: layout,
                config: {
                    'showLink': false,
                    'scrollZoom': true,
                    'displayModeBar': true,
                    'editable': false,
                    'responsive': true,
                    'displaylogo': false
                }
            };
            this.calculatePlotStats();
        } else if (type === 'histogram') {
            this.histValue = [];
            this.histValue = this.routeDataTransfer.storage.value[0].value.split(',');
            const number = this.routeDataTransfer.storage.number;
            const dataToPlot = this.dataInput[this.histValue[0]].dataArrayColumns[this.histValue[1]];
            const curateDataFirstHist = this.data.curateData(dataToPlot);
            if (number === 0) {
                this.plotGraph = this.plotFirstHistogram(curateDataFirstHist);
            } else {
                this.plotGraph = this.plotSecondHistogram(curateDataFirstHist, number);
            }
            this.graph = {
                data: this.plotGraph,
                layout: {
                    hovermode: 'closest',
                    autosize: true,
                    title: 'Standard Deviation Histogram',
                    xaxis: {
                        autorange: true,
                        type: 'category'
                    },
                    yaxis: {
                        autorange: true,
                        type: 'linear'
                    }
                },
                config: {
                    'showLink': false,
                    'scrollZoom': true,
                    'displayModeBar': true,
                    'editable': false,
                    'responsive': true,
                    'displaylogo': false
                }
            };
        } else {
            this.graph = {
                data: this.plotGraph,
                layout: {
                    hovermode: 'closest',
                    autosize: true,
                    title: 'Plot',
                    xaxis: {
                        autorange: true,
                    },
                    yaxis: {
                        autorange: true,
                        type: 'linear'
                    }
                },
                config: {
                    'showLink': false,
                    'scrollZoom': true,
                    'displayModeBar': true,
                    'editable': false,
                    'responsive': true,
                    'displaylogo': false
                }
            };
        }
    }

    clickAnnotation(data) {
        if (data.points === undefined) {

        } else {
            for (let i = 0; i < data.points.length; i++) {
                if (data.points[i].data.type === 'scattergl') {
                    if (this.graph.data[0].type === 'scattergl') {
                        this.annotationListScatter = this.graph.layout.annotations;
                    } else {
                        this.annotationListScatter = [];
                    }
                    const annotationText = 'x = ' + data.points[i].x + ' y = ' + data.points[i].y.toPrecision(4);
                    const annotation = {
                        text: annotationText,
                        x: data.points[i].x,
                        y: parseFloat(data.points[i].y.toPrecision(4)),
                        font: {
                            color: 'black',
                            size: 12,
                            family: 'Courier New, monospace',
                        },
                    };
                    if (this.annotationListScatter.length > 0) {
                        if (this.annotationListScatter.find(obj => obj.x === annotation.x && obj.y === annotation.y)) {
                            this.annotationListScatter.splice(this.annotationListScatter
                                .indexOf(this.annotationListScatter
                                    .find(obj => obj.x === annotation.x && obj.y === annotation.y)), 1);
                        } else {
                            this.annotationListScatter.push(annotation);
                        }
                    } else {
                        this.annotationListScatter.push(annotation);
                    }
                    this.displayGraph('scatter_graph');
                } else if (data.points[i].data.type === 'linegl') {
                    if (this.graph.data[0].type === 'linegl') {
                        this.annotationListLine = this.graph.layout.annotations;
                    } else {
                        this.annotationListLine = [];
                    }
                    const annotationText = 'x = ' + data.points[i].x + ' y = ' + data.points[i].y.toPrecision(4);
                    const annotation = {
                        text: annotationText,
                        x: data.points[i].x,
                        y: parseFloat(data.points[i].y.toPrecision(4)),
                        font: {
                            color: 'black',
                            size: 12,
                            family: 'Courier New, monospace',
                        },
                    };
                    if (this.annotationListLine.length > 0) {
                        if (this.annotationListLine.find(obj => obj.x === annotation.x && obj.y === annotation.y)) {
                            this.annotationListLine.splice(this.annotationListLine
                                .indexOf(this.annotationListLine
                                    .find(obj => obj.x === annotation.x && obj.y === annotation.y)), 1);
                        } else {
                            this.annotationListLine.push(annotation);
                        }
                    } else {
                        this.annotationListLine.push(annotation);
                    }
                    this.displayGraph('line_graph');
                }
            }
        }
    }

    calculatePlotStats() {
        if (this.graph.data.length > 0) {
            if (this.graph.layout.title === 'Line Plot') {
                if (this.graph.layout.yaxis.range === undefined || this.graph.layout.xaxis.range === undefined) {
                    this.globalXMin = this.data.getMin(this.graph.data[0].x);
                    this.globalXMax = this.data.getMax(this.graph.data[0].x);
                    this.globalYMin = this.data.getMin(this.graph.data[0].y);
                    this.globalYMax = this.data.getMax(this.graph.data[0].y);
                    this.globalYAverage = [];
                    for (let dataLength = 0; dataLength < this.graph.data.length; dataLength++) {
                        const len = this.graph.data[dataLength].y.length;
                        let sumAverage = 0;
                        for (let i = 0; i < len; i++) {
                            const y = this.graph.data[dataLength].y[i];
                            if (y > this.globalYMin && y < this.globalYMax) {
                                sumAverage = sumAverage + y;
                            }
                        }
                        this.globalYAverage.push({
                            value: sumAverage / len,
                            name: this.graph.data[dataLength].name
                        });
                    }
                } else {
                    this.globalYMin = this.graph.layout.yaxis.range[0];
                    this.globalYMax = this.graph.layout.yaxis.range[1];
                    this.globalXMin = new Date(this.graph.layout.xaxis.range[0]);
                    this.globalXMax = new Date(this.graph.layout.xaxis.range[1]);
                    this.globalYAverage = [];
                    for (let dataLength = 0; dataLength < this.graph.data.length; dataLength++) {
                        const len = this.graph.data[dataLength].y.length;
                        let sumAverage = 0;
                        for (let i = 0; i < len; i++) {
                            const y = this.graph.data[dataLength].y[i];
                            if (y > this.globalYMin && y < this.globalYMax) {
                                sumAverage = sumAverage + y;
                            }
                        }
                        this.globalYAverage.push({
                            value: sumAverage / len,
                            name: this.graph.data[dataLength].name
                        });
                    }
                }
            } else if (this.graph.layout.title === 'Scatter Plot') {
                if (this.graph.layout.yaxis.range === undefined || this.graph.layout.xaxis.range === undefined) {
                    this.globalXMin = this.data.getMin(this.graph.data[0].x);
                    this.globalXMax = this.data.getMax(this.graph.data[0].x);
                    this.globalYMin = this.data.getMin(this.graph.data[0].y);
                    this.globalYMax = this.data.getMax(this.graph.data[0].y);
                    this.globalYAverage = [];
                    const lenY = this.graph.data[0].y.length;
                    let sumAverageY = 0;
                    for (let i = 0; i < lenY; i++) {
                        const y = this.graph.data[0].y[i];
                        if (y > this.globalYMin && y < this.globalYMax) {
                            sumAverageY = sumAverageY + y;
                        }
                    }
                    this.globalYAverage.push({
                        value: sumAverageY / lenY,
                        name: this.graph.layout.yaxis.title.text
                    });
                    this.globalXAverage = [];
                    const lenX = this.graph.data[0].x.length;
                    let sumAverageX = 0;
                    for (let i = 0; i < lenX; i++) {
                        const x = this.graph.data[0].x[i];
                        if (x > this.globalXMin && x < this.globalXMax) {
                            sumAverageX = sumAverageX + x;
                        }
                    }
                    this.globalXAverage.push({
                        value: sumAverageX / lenX,
                        name: this.graph.layout.xaxis.title.text
                    });
                } else {
                    this.globalYMin = this.graph.layout.yaxis.range[0];
                    this.globalYMax = this.graph.layout.yaxis.range[1];
                    this.globalXMin = this.graph.layout.xaxis.range[0];
                    this.globalXMax = this.graph.layout.xaxis.range[1];
                    this.globalYAverage = [];
                    const lenY = this.graph.data[0].y.length;
                    let sumAverageY = 0;
                    for (let i = 0; i < lenY; i++) {
                        const y = this.graph.data[0].y[i];
                        if (y > this.globalYMin && y < this.globalYMax) {
                            sumAverageY = sumAverageY + y;
                        }
                    }
                    this.globalYAverage.push({
                        value: sumAverageY / lenY,
                        name: this.graph.layout.yaxis.title.text
                    });
                    this.globalXAverage = [];
                    const lenX = this.graph.data[0].x.length;
                    let sumAverageX = 0;
                    for (let i = 0; i < lenX; i++) {
                        const x = this.graph.data[0].x[i];
                        if (x > this.globalXMin && x < this.globalXMax) {
                            sumAverageX = sumAverageX + x;
                        }
                    }
                    this.globalXAverage.push({
                        value: sumAverageX / lenX,
                        name: this.graph.layout.xaxis.title.text
                    });
                }
            }
        }
        this.stats = new GraphStats(this.globalYMin, this.globalXMax, this.globalYMin, this.globalYMax,
            this.globalXAverage, this.globalYAverage);
    }

    plotFirstHistogram(calculationArray) {
        const smallerSD = [];
        const biggerSD = [];
        const plotData = [];
        const plotGraph = [];
        const plotName = [];
        const median = (this.data.getMax(calculationArray) + this.data.getMin(calculationArray)) / 2;
        const stdDeviation = this.data.getSD(calculationArray);
        let lesserSDValue = median - stdDeviation;
        let moreSDValue = median + stdDeviation;
        let totalSamples = 0;
        let i = 1;
        while (totalSamples < calculationArray.length) {
            const smallerSDPlot = [];
            const biggerSDPlot = [];
            lesserSDValue = median - stdDeviation * i;
            moreSDValue = median + stdDeviation * i;
            for (let j = 0; j < calculationArray.length; j++) {
                if (isNaN(calculationArray[j])) {

                } else if (calculationArray[j] >= lesserSDValue && calculationArray[j] < median) {
                    smallerSDPlot.push(calculationArray[j]);
                    calculationArray[j] = 'smaller ' + j;
                } else if (calculationArray[j] >= median && calculationArray[j] <= moreSDValue) {
                    biggerSDPlot.push(calculationArray[j]);
                    calculationArray[j] = 'bigger ' + j;
                }
            }
            smallerSD.push(smallerSDPlot);
            biggerSD.push(biggerSDPlot);
            totalSamples = totalSamples + smallerSDPlot.length + biggerSDPlot.length;
            i++;
        }
        for (let small = smallerSD.length - 1; small >= 0; small--) {
            if (smallerSD[small].length === 0) {
            } else {
                plotData.push(smallerSD[small].length);
                plotName.push(this.data.getMin(smallerSD[small]) + ' - ' + this.data.getMax(smallerSD[small]));
            }
        }
        for (let big = 0; big < biggerSD.length; big++) {
            if (biggerSD[big].length === 0) {
            } else {
                plotData.push(biggerSD[big].length);
                plotName.push(this.data.getMin(biggerSD[big]) + ' - ' + this.data.getMax(biggerSD[big]));
            }
        }
        plotGraph.push({
            x: plotName,
            y: plotData,
            type: 'bar',
            mode: 'markers'
        });
        return plotGraph;
    }

    plotSecondHistogram(data, numberOfBins) {
        const plotGraph = [];
        const plotName = [];
        const plotData = stats.histogram(data, numberOfBins);
        console.log(plotData);
        console.log(plotData.bins);
        console.log(plotData.binWidth);
        console.log(plotData.binLimits);
        const binWidth = plotData.binWidth;
        let initialValue = plotData.binLimits[0];
        for (let i = 0; i < plotData.bins; i++) {
            if (i === 0) {
                plotName.push(initialValue.toFixed(2));
            } else {
                initialValue = initialValue + binWidth;
                plotName.push(initialValue.toFixed(2));
            }
        }
        console.log(plotName);
        plotGraph.push({
            y: plotData.values,
            x: plotName,
            type: 'bar',
            mode: 'markers'
        });
        return plotGraph;
    }
}
