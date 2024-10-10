import React from "react";
import ReactApexChart from "react-apexcharts";

interface SeriesData {
  name: any;
  type: 'column' | 'line';
  data: number[];
}

interface IProps {
  series: SeriesData[];
  labels: string[];
  title?: string;
  yAxisTitles?: {
    primary: { text: string; color?: string };
    secondary?: { text: string; color?: string };
  };
}

interface IState {
  series: SeriesData[];
  options: {
    chart: {
      height: number;
      type: 'line';
    };
    stroke: {
      width: number[];
    };
    title: {
      text: string;
    };
    dataLabels: {
      enabled: boolean;
      enabledOnSeries: number[];
    };
    labels: string[];
    yaxis: {
      title: {
        text: string;
        color?: string;
      };
    }[];
  };
}

export class LineColumnChart extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);

    this.state = {
      series: props.series,
      options: {
        chart: {
          height: 350,
          type: 'line',
        },
        stroke: {
          width: [0, 4, 4], // Adjusted to match the number of series
        },
        title: {
          text: props.title || 'Chart Title',
        },
        dataLabels: {
          enabled: true,
          enabledOnSeries: [1, 2], // Assuming the line series should show data labels
        },
        labels: props.labels,
        yaxis: [
          {
            title: {
              text: props.yAxisTitles?.primary.text || 'Primary Axis',
              color: props.yAxisTitles?.primary.color || 'blue', // Use color from props or default to blue
            },
          },
          {
            opposite: true,
            title: {
              text: props.yAxisTitles?.secondary?.text || '',
              color: props.yAxisTitles?.secondary?.color, // Use color from props or default to undefined
            },
          },
        ],
      },
    };
  }

  componentDidUpdate(prevProps: IProps) {
    if (
      prevProps.series !== this.props.series ||
      prevProps.labels !== this.props.labels ||
      prevProps.title !== this.props.title ||
      prevProps.yAxisTitles !== this.props.yAxisTitles
    ) {
      this.setState({
        series: this.props.series,
        options: {
          ...this.state.options,
          labels: this.props.labels,
          title: {
            text: this.props.title || this.state.options.title.text,
          },
          yaxis: [
            {
              title: {
                text: this.props.yAxisTitles?.primary.text || this.state.options.yaxis[0].title.text,
                color: this.props.yAxisTitles?.primary.color || this.state.options.yaxis[0].title.color,
              },
            },
            {
              opposite: true,
              title: {
                text: this.props.yAxisTitles?.secondary?.text || this.state.options.yaxis[1].title.text,
                color: this.props.yAxisTitles?.secondary?.color || this.state.options.yaxis[1].title.color,
              },
            },
          ],
        },
      });
    }
  }

  render() {
    return (
      <div className="mt-5">
        <div id="chart">
          <ReactApexChart options={this.state.options} series={this.state.series} type="line" height={350} />
        </div>
        <div id="html-dist"></div>
      </div>
    );
  }
}
