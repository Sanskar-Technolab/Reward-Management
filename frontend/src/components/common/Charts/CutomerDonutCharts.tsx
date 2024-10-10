import { Component } from 'react';
import ReactApexChart from 'react-apexcharts';
import ApexCharts from 'apexcharts';

// Defining the type for the props
interface DonutChartProps {
  chartLabels: string[];
  chartSeries: number[];
}

// Defining the type for state
interface DonutChartState {
  series: number[];
  options: ApexCharts.ApexOptions;
}

export class DonutChart extends Component<DonutChartProps, DonutChartState> {
  constructor(props: DonutChartProps) {
    super(props);
    this.state = {
      series: props.chartSeries || [1452, 1150, 849, 694], // Default series if none provided
      options: {
        labels: props.chartLabels || [], // Default empty array if none provided
        chart: {
          events: {
            mounted: (chart) => {
              chart.windowResizeHandler();
            }
          },
          height: 260,
          type: 'donut',
        },
        dataLabels: {
          enabled: false,
        },
        legend: {
          show: false,
        },
        stroke: {
          show: true,
          curve: 'smooth',
          lineCap: 'round',
          colors: ["#000"],
          width: 0,
          dashArray: 0,
        },
        plotOptions: {
          pie: {
            expandOnClick: true,
            donut: {
              size: '82%',
              labels: {
                show: true,
                name: {
                  show: true,
                  fontSize: '20px',
                  color: '#495057',
                  offsetY: -4,
                },
                value: {
                  show: true,
                  fontSize: '18px',
                  color: undefined,
                  offsetY: 8,
                },
                total: {
                  show: true,
                  label: 'Total',
                  formatter: function (w) {
                    return w.globals.seriesTotals.reduce((a: any, b: any) => a + b, 0);
                  }
                }
              }
            }
          }
        },
        colors: ["rgb(132, 90, 223)", "rgb(35, 183, 229)", "rgb(245, 184, 73)", "rgb(38, 191, 148)"],
      }
    };
  }

  componentDidUpdate(prevProps: DonutChartProps) {
    if (prevProps.chartLabels !== this.props.chartLabels || prevProps.chartSeries !== this.props.chartSeries) {
      this.setState({
        series: this.props.chartSeries,
        options: {
          ...this.state.options,
          labels: this.props.chartLabels,
        },
      });
    }
  }

  render() {
    const { chartLabels, chartSeries } = this.props;
    const colors = ["rgb(132, 90, 223)", "rgb(35, 183, 229)", "rgb(245, 184, 73)", "rgb(38, 191, 148)"];
    const counts = this.state.series;

    return (
      <div>
        <ReactApexChart options={this.state.options} series={this.state.series} type="donut" height={260} />
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px' }}>
          {chartLabels.map((label, index) => (
            <div key={index} style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                <div style={{ 
                  backgroundColor: colors[index], 
                  width: '15px', 
                  height: '15px', 
                  borderRadius: '50%', 
                  marginRight: '10px' // Adding margin to separate the circle from the label
                }}>
                </div>
                <div style={{ fontWeight: 'bold', color: 'black', marginRight: '20px' }}>
                  {label}
                </div>
              </div>
              <div style={{ marginTop: '5px', fontSize: '18px', fontWeight: 'bold' }}>
                {counts[index]}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }
}
