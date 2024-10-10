import { DonutChart } from "../Charts/DonutCharts";
import { ApexChart } from "../Charts/BarCharts";

const AcquisitionChart = () => {
  const chartLabels = ["Call Center", "Email", "Social", "Web"];

const seriesData = [18, 25, 24, 167];

 
  const barChartLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const barChartData = [124, 210, 54, 147, 264, 58, 69, 110, 120, 138, 245, 312];
  return (
    <div className="grid grid-cols-12 gap-4 mt-5">
      <div className="lg:col-span-4">
        <center className="font-semibold text-[1.125rem] text-defaulttextcolor dark:text-defaulttextcolor/70 !mb-0">Customer Acquisition</center>
        <div className="box-body overflow-hidden">
          <div className="leads-source-chart flex items-center justify-center relative">
          <DonutChart chartLabels={chartLabels} series={seriesData} />;
          </div>
        </div>
      </div>
      <div className="lg:col-span-8">
      <ApexChart barChartLabels={barChartLabels} barChartData={barChartData} />;
      </div>
    </div>
  );
};

export default AcquisitionChart;
