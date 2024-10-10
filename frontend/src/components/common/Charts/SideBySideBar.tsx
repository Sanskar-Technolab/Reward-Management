import React from "react";
import ReactApexChart from "react-apexcharts";
import { ApexOptions } from "apexcharts";

interface IProps {
  seriesData: { name: string; data: number[] }[]; // Dynamic data for bar chart
  xCategories: string[];                         // Dynamic categories for x-axis
}

const TwoSidedBarChart: React.FC<IProps> = ({ seriesData, xCategories }) => {
  const [options] = React.useState<ApexOptions>({
    chart: {
      type: "bar",
      height: 440,
    },
    colors: ["#008FFB", "#FF4560"],
    plotOptions: {
      bar: {
        borderRadius: 5,
        borderRadiusApplication: "end",
        borderRadiusWhenStacked: "all",
        horizontal: false,
        barHeight: "80%",
      },
    },
    dataLabels: {
      enabled: true,
    },
    stroke: {
      width: 1,
      colors: ["#fff"],
    },
    grid: {
      xaxis: {
        lines: {
          show: false,
        },
      },
    },
    yaxis: {
      labels: {
        formatter: (value: number) => "₹ " + value.toString(),
      },
    },
    tooltip: {
      shared: false,
      x: {
        formatter: (val: number) => val.toString(),
      },
      y: {
        formatter: (val: number) => `₹ ${val / 1000}k`,
      },
    },
    title: {
      text: "Last Transactions",
    },
    xaxis: {
      categories: xCategories, // Dynamic categories for x-axis
      title: {
        text: "Time Period",
      },
      labels: {
        formatter: (val: string) => val.toString(),
      },
    },
  });

  return (
    <div className="mt-5">
      <div id="chart">
        <ReactApexChart options={options} series={seriesData} type="bar" height={440} />
      </div>
      <div id="html-dist"></div>
    </div>
  );
};

export default TwoSidedBarChart;
