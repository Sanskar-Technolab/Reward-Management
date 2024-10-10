import React from "react";
import ReactApexChart from "react-apexcharts";

interface IProps {
  barChartLabels: string[];  // Dynamic x-axis labels
  barChartData: number[];    // Dynamic series data
}

interface IState {
  series: any[];
  options: any;
}

export class ApexChart extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);

    this.state = {
      series: [{
        data: props.barChartData,  // Initialize with props data
      }],
      options: {
        chart: {
          type: 'bar',
          height: 350
        },
        plotOptions: {
          bar: {
            borderRadius: 4,
            borderRadiusApplication: 'end',
            vertical: true,
          }
        },
        dataLabels: {
          enabled: false
        },
        xaxis: {
          categories: props.barChartLabels,  // Initialize with props labels
        }
      }
    };
  }

  // Update state when props change
  componentDidUpdate(prevProps: IProps) {
    if (prevProps.barChartLabels !== this.props.barChartLabels || 
        prevProps.barChartData !== this.props.barChartData) {
      this.setState({
        series: [{
          data: this.props.barChartData,  // Update series data
        }],
        options: {
          ...this.state.options,
          xaxis: {
            categories: this.props.barChartLabels,  // Update x-axis labels
          }
        }
      });
    }
  }

  render() {
    return (
      <div>
        <div id="chart">
          <ReactApexChart 
            options={this.state.options} 
            series={this.state.series} 
            type="bar" 
            height={350} 
          />
        </div>
      </div>
    );
  }
}
