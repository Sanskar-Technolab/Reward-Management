import React from "react";
import ReactApexChart from "react-apexcharts";

interface IProps {
  customerData: number[];       // Data for the 'Customers' column series
  transactionData: number[];    // Data for the 'Transaction Amount' line series
  chartLabels: string[];        // Labels for the x-axis
}

export const LineColumnChart: React.FC<IProps> = ({ customerData, transactionData, chartLabels }) => {
  const options = {
    chart: {
      height: 350,
      type: 'line',
    },
    stroke: {
      width: [0, 4],
    },
    title: {
      text: 'Last Transactions',
    },
    dataLabels: {
      enabled: true,
      enabledOnSeries: [1],
    },
    labels: chartLabels,  // Dynamic labels
    yaxis: [
      {
        title: {
          text: 'Customers',
        },
      },
      {
        opposite: true,
        title: {
          text: 'Transaction Amount',
        },
      },
    ],
  };

  const series = [
    {
      name: 'Customers',
      type: 'column',
      data: customerData,   // Dynamic customer data
    },
    {
      name: 'Transaction Amount',
      type: 'line',
      data: transactionData,  // Dynamic transaction data
    },
  ];

  return (
    <div className="mt-5">
      <div id="chart">
        <ReactApexChart
          options={options}
          series={series}
          type="line"
          height={350}
        />
      </div>
    </div>
  );
};
