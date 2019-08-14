import {Injectable} from '@angular/core';
import {DataService} from './data.service';

@Injectable({
  providedIn: 'root'
})
export class GraphCreationService {
  monthList = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  constructor(private data: DataService) {
  }

  plotGraphDayAverageInit() {
    const dayAverage = {
      data: [],
      layout: {
        hovermode: 'closest',
        autosize: true,
        title: 'Average Day',
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
    return dayAverage;
  }

  plotGraphBinAverageInit() {
    const binAverage = {
      data: [],
      layout: {
        hovermode: 'closest',
        autosize: true,
        title: 'Average Day',
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
    return binAverage;
  }

  plotGraphDayAverage(graphDayAverage, channelId, columnMainArray, days, displayBinList, annotationListDayAverage, toggleRelayoutDay) {
    let name = '';
    const plotDataDayAverages = [];
    if (columnMainArray.length > 0) {
      const timeSeries = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24];
      for (let i = 0; i < columnMainArray[channelId].length; i++) {
        const tempHourAverage = [];
        let thickness = 1;
        let color = '';
        for (let bins = 0; bins < displayBinList.length; bins++) {
          if (days[i].bin === displayBinList[bins].binName) {
            thickness = days[i].stroke;
            color = displayBinList[bins].binColor;
            if (columnMainArray[channelId][i].length < 24) {
              if (i === 0) {
                const temp = 24 - columnMainArray[channelId][i].length;
                for (let zero = 0; zero < temp; zero++) {
                  tempHourAverage.push(0);
                }
                for (let hour = 0; hour < columnMainArray[channelId][i].length; hour++) {
                  tempHourAverage.push(columnMainArray[channelId][i][hour].hourAverage);
                }
              } else if (i === columnMainArray[channelId].length - 1) {
                for (let hour = 0; hour < columnMainArray[channelId][i].length; hour++) {
                  tempHourAverage.push(columnMainArray[channelId][i][hour].hourAverage);
                }
                const temp = 24 - columnMainArray[channelId][i].length;
                for (let zero = 0; zero < temp; zero++) {
                  tempHourAverage.push(0);
                }
              }
            } else {
              for (let hour = 0; hour < columnMainArray[channelId][i].length; hour++) {
                tempHourAverage.push(columnMainArray[channelId][i][hour].hourAverage);
              }
            }
          }
        }
        plotDataDayAverages.push({
          x: timeSeries,
          y: tempHourAverage,
          type: 'linegl',
          mode: 'lines+markers',
          connectgaps: true,
          name: this.monthList[columnMainArray[channelId][i][0].displayDate.getMonth()] + ' '
            + columnMainArray[channelId][i][0].displayDate.getDate(),
          line: {
            color: color,
            width: thickness
          },
          marker: {
            color: color,
            size: 6 + thickness
          },
          visible: days[i].visible
        });
        name = columnMainArray[channelId][i][channelId].channelName;
      }
      let layout;
      if (annotationListDayAverage.length > 0 || toggleRelayoutDay) {
        layout = {
          hovermode: 'closest',
          autosize: true,
          title: name,
          xaxis: graphDayAverage.layout.xaxis,
          yaxis: graphDayAverage.layout.yaxis,
          annotations: annotationListDayAverage,
        };
      } else {
        layout = {
          hovermode: 'closest',
          autosize: true,
          title: name,
          xaxis: {
            autorange: true,
          },
          yaxis: {
            autorange: true,
            type: 'linear'
          },
          annotations: annotationListDayAverage,
        };
      }
      graphDayAverage = {
        data: plotDataDayAverages,
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
    } else {
      graphDayAverage = {
        data: plotDataDayAverages,
        layout: {
          hovermode: 'closest',
          autosize: true,
          title: 'Average Day',
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
    return graphDayAverage;
  }

  plotGraphBinAverage(graphBinAverage, channelId, sumArray, annotationListBinAverage) {
    let name = '';
    const plotDataBinAverages = [];
    if (sumArray.length > 0) {
      const timeSeries = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24];
      for (let i = 0; i < sumArray[channelId].length; i++) {
        plotDataBinAverages.push({
          x: timeSeries,
          y: sumArray[0][i].averageValue,
          type: 'linegl',
          mode: 'lines+markers',
          name: sumArray[0][i].binValue,
          line: {
            color: sumArray[0][i].binColor,
          },

        });
        name = sumArray[0][0].channelId;
      }
      graphBinAverage = {
        data: plotDataBinAverages,
        layout: {
          hovermode: 'closest',
          autosize: true,
          title: name,
          xaxis: graphBinAverage.layout.xaxis,
          yaxis: graphBinAverage.layout.yaxis,
          annotations: annotationListBinAverage,
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
      graphBinAverage = {
        data: plotDataBinAverages,
        layout: {
          hovermode: 'closest',
          autosize: true,
          title: 'Average Bin',
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
    return graphBinAverage;
  }

  calculatePlotStatsDay(graphDayAverage) {
    let globalXMinDay, globalXMaxDay, globalYMinDay, globalYMaxDay;
    let globalYAverageDay;
    if (graphDayAverage.layout.yaxis.range === undefined || graphDayAverage.layout.xaxis.range === undefined) {
      globalYMinDay = this.data.getMin(graphDayAverage.data[0].y);
      globalYMaxDay = this.data.getMax(graphDayAverage.data[0].y);
      globalYAverageDay = [];
      for (let dataLength = 0; dataLength < graphDayAverage.data.length; dataLength++) {
        const len = graphDayAverage.data[dataLength].y.length;
        const ymax = this.data.getMax(graphDayAverage.data[dataLength].y);
        const ymin = this.data.getMin(graphDayAverage.data[dataLength].y);
        if (ymax >= globalYMaxDay) {
          globalYMaxDay = ymax;
        }
        if (globalYMinDay === 0) {
          globalYMinDay = ymin;
        } else if (ymin < globalYMinDay) {
          globalYMinDay = ymin;
        }
        let sumAverage = 0;
        for (let i = 0; i < len; i++) {
          const y = graphDayAverage.data[dataLength].y[i];
          sumAverage = sumAverage + y;
        }
        globalYAverageDay.push({
          value: sumAverage / len,
          name: graphDayAverage.data[dataLength].name,
          color: graphDayAverage.data[dataLength].line.color,
          stroke: graphDayAverage.data[dataLength].line.width
        });
      }
    } else {
      globalYMinDay = graphDayAverage.layout.yaxis.range[0];
      globalYMaxDay = graphDayAverage.layout.yaxis.range[1];
      globalXMinDay = graphDayAverage.layout.xaxis.range[0];
      globalXMaxDay = graphDayAverage.layout.xaxis.range[1];
      globalYAverageDay = [];
      for (let dataLength = 0; dataLength < graphDayAverage.data.length; dataLength++) {
        let averageDeno = 0;
        const len = graphDayAverage.data[dataLength].y.length;
        let sumAverage = 0;
        for (let i = 0; i < len; i++) {
          const y = graphDayAverage.data[dataLength].y[i];
          if (y >= globalYMinDay && y < globalYMaxDay && i >= globalXMinDay && i < globalXMaxDay) {
            averageDeno++;
            sumAverage = sumAverage + y;
          }
        }
        if (isNaN(sumAverage / averageDeno)) {
        } else {
          globalYAverageDay.push({
            value: sumAverage / averageDeno,
            name: graphDayAverage.data[dataLength].name,
            color: graphDayAverage.data[dataLength].line.color,
            stroke: graphDayAverage.data[dataLength].line.width
          });
        }
      }
    }
    return globalYAverageDay;
  }

  calculatePlotStatsBin(graphBinAverage) {
    let globalYMinBin, globalYMaxBin, globalXMinBin, globalXMaxBin;
    let globalYAverageBin;
    if (graphBinAverage.layout.yaxis.range === undefined || graphBinAverage.layout.xaxis.range === undefined) {
    } else {
      globalYMinBin = graphBinAverage.layout.yaxis.range[0];
      globalYMaxBin = graphBinAverage.layout.yaxis.range[1];
      globalXMinBin = graphBinAverage.layout.xaxis.range[0];
      globalXMaxBin = graphBinAverage.layout.xaxis.range[1];
      globalYAverageBin = [];
      for (let dataLength = 0; dataLength < graphBinAverage.data.length; dataLength++) {
        let averageDeno = 0;
        const len = graphBinAverage.data[dataLength].y.length;
        let sumAverage = 0;
        let y = 0;
        for (let i = 0; i < len; i++) {
          y = parseFloat(graphBinAverage.data[dataLength].y[i]);
          if (y >= globalYMinBin && y < globalYMaxBin && i >= globalXMinBin && i < globalXMaxBin) {
            averageDeno++;
            sumAverage = sumAverage + y;
          }
        }
        globalYAverageBin.push({
          value: sumAverage / averageDeno,
          name: graphBinAverage.data[dataLength].name,
          color: graphBinAverage.data[dataLength].line.color,
          stroke: 1
        });
      }
    }
    return globalYAverageBin;
  }

  clickAnnotationDayAverage(data, annotationListDayAverage, graphDayAverage) {
    annotationListDayAverage = graphDayAverage.layout.annotations || [];
    for (let i = 0; i < data.points.length; i++) {
      const annotationText = data.points[i].data.name + ', '
        + graphDayAverage.layout.title + ' = ' + data.points[i].y.toPrecision(4);
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
      if (annotationListDayAverage.find(obj => obj.x === annotation.x && obj.y === annotation.y)) {
        annotationListDayAverage.splice(annotationListDayAverage
          .indexOf(annotationListDayAverage
            .find(obj => obj.x === annotation.x && obj.y === annotation.y)), 1);
      } else {
        annotationListDayAverage.push(annotation);
      }
    }
    return annotationListDayAverage;
  }

  clickAnnotationBinAverage(data, annotationListBinAverage, graphBinAverage) {
    annotationListBinAverage = graphBinAverage.layout.annotations || [];
    for (let i = 0; i < data.points.length; i++) {
      const annotationText = 'x = ' + data.points[i].x + ' y = ' + data.points[i].y.toPrecision(4);
      const annotation = {
        text: annotationText,
        x: data.points[i].x,
        y: parseFloat(data.points[i].y.toPrecision(4)),
        font: {
          color: 'blue',
          size: 20,
          family: 'Courier New, monospace',
        },
        bordercolor: data.points[i].fullData.line.color,
        borderwidth: 3,
        borderpad: 4,
      };
      if (annotationListBinAverage.find(obj => obj.x === annotation.x && obj.y === annotation.y)) {
        annotationListBinAverage.splice(annotationListBinAverage
          .indexOf(annotationListBinAverage
            .find(obj => obj.x === annotation.x && obj.y === annotation.y)), 1);
      } else {
        annotationListBinAverage.push(annotation);
      }

    }
    return annotationListBinAverage;
  }
}
