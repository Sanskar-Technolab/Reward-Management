import React from "react";
import { DonutChart } from "../Charts/DonutCharts";
import { ApexChart } from "../Charts/BarCharts";

interface AcquisitionSectionProps {
  selectedProgram: string;
  selectedTier: string; // New prop
}

const AcquisitionSection: React.FC<AcquisitionSectionProps> = ({ selectedProgram, selectedTier }) => {
  const chartLabels = ["Call Center", "Email", "Social", "Web"];

  // Data for different programs
  const seriesData = selectedProgram === 'program1'
  ? (selectedTier === 'tier0'
    ? [12, 18, 20, 100] // Data for Program 1, Tier 0
    : selectedTier === 'tier1'
    ? [12, 0, 0, 0] // Data for Program 1, Tier 1
    : selectedTier === 'tier2'
    ? [0, 18, 0, 0] // Data for Program 1, Tier 2
    : selectedTier === 'tier3'
    ? [0, 0, 20, 0] // Data for Program 1, Tier 3
    : [0, 0, 0, 100]) // Data for Program 1, Tier 4
  : (selectedTier === 'tier0'
    ? [20, 25, 30, 150] // Data for Program 2, Tier 0
    : selectedTier === 'tier1'
    ? [20, 0, 0, 0] // Data for Program 2, Tier 1
    : selectedTier === 'tier2'
    ? [0, 25, 0, 0] // Data for Program 2, Tier 2
    : selectedTier === 'tier3'
    ? [0, 0, 30, 0] // Data for Program 2, Tier 3
    : [0, 0, 0, 150]); // Data for Program 2, Tier 4

  const barChartLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  // Data for bar chart based on the selected program and tier
  const barChartData = selectedProgram === 'program1'
  ? (selectedTier === 'tier0'
    ? [100, 180, 70, 140, 250, 60, 80, 120, 110, 150, 230, 320] // Data for Program 1, Tier 0
    : selectedTier === 'tier1'
    ? [124, 210, 54, 147, 264, 58, 69, 110, 120, 138, 245, 312] // Data for Program 1, Tier 1
    : selectedTier === 'tier2'
    ? [50, 150, 70, 200, 180, 40, 55, 90, 105, 120, 200, 270] // Data for Program 1, Tier 2
    : selectedTier === 'tier3'
    ? [60, 160, 75, 220, 190, 50, 60, 100, 115, 130, 220, 280] // Data for Program 1, Tier 3
    : [70, 170, 80, 230, 200, 55, 65, 110, 120, 140, 230, 290]) // Data for Program 1, Tier 4
  : (selectedTier === 'tier0'
    ? [20, 200, 90, 310, 230, 60, 70, 120, 125, 140, 250, 310] // Data for Program 2, Tier 0
    : selectedTier === 'tier1'
    ? [20, 200, 80, 300, 220, 50, 60, 100, 115, 130, 230, 300] // Data for Program 2, Tier 1
    : selectedTier === 'tier2'
    ? [30, 180, 90, 280, 210, 60, 65, 110, 120, 140, 220, 290] // Data for Program 2, Tier 2
    : selectedTier === 'tier3'
    ? [40, 190, 100, 290, 220, 65, 70, 120, 130, 150, 230, 300] // Data for Program 2, Tier 3
    : [50, 200, 110, 300, 230, 70, 75, 130, 135, 160, 240, 310]); 

  // Values for different programs and tiers
  const metrics = selectedProgram === 'program1'
  ? (selectedTier === 'tier0'
    ? {
      newCustomers: { count: 150, trend: '▲12.00%', trendColor: 'green' },
      zeroTransactions: { count: 90, trend: '▼20.00%', trendColor: 'red' },
      oneTransaction: { count: 110, trend: '▲30.00%', trendColor: 'green' }
    }
    : selectedTier === 'tier1'
    ? {
      newCustomers: { count: 234, trend: '▲23.63%', trendColor: 'green' },
      zeroTransactions: { count: 104, trend: '▼44.44%', trendColor: 'red' },
      oneTransaction: { count: 130, trend: '▲55.55%', trendColor: 'green' }
    }
    : selectedTier === 'tier2'
    ? {
      newCustomers: { count: 200, trend: '▲18.00%', trendColor: 'green' },
      zeroTransactions: { count: 90, trend: '▼30.00%', trendColor: 'red' },
      oneTransaction: { count: 120, trend: '▲40.00%', trendColor: 'green' }
    }
    : selectedTier === 'tier3'
    ? {
      newCustomers: { count: 180, trend: '▲25.00%', trendColor: 'green' },
      zeroTransactions: { count: 85, trend: '▼35.00%', trendColor: 'red' },
      oneTransaction: { count: 110, trend: '▲45.00%', trendColor: 'green' }
    }
    : {
      newCustomers: { count: 160, trend: '▲22.00%', trendColor: 'green' },
      zeroTransactions: { count: 75, trend: '▼28.00%', trendColor: 'red' },
      oneTransaction: { count: 100, trend: '▲40.00%', trendColor: 'green' }
    })
  : (selectedTier === 'tier0'
    ? {
      newCustomers: { count: 200, trend: '▲20.00%', trendColor: 'green' },
      zeroTransactions: { count: 95, trend: '▼25.00%', trendColor: 'red' },
      oneTransaction: { count: 140, trend: '▲35.00%', trendColor: 'green' }
    }
    : selectedTier === 'tier1'
    ? {
      newCustomers: { count: 190, trend: '▲15.00%', trendColor: 'green' },
      zeroTransactions: { count: 85, trend: '▼30.00%', trendColor: 'red' },
      oneTransaction: { count: 150, trend: '▲40.00%', trendColor: 'green' }
    }
    : selectedTier === 'tier2'
    ? {
      newCustomers: { count: 170, trend: '▲20.00%', trendColor: 'green' },
      zeroTransactions: { count: 75, trend: '▼25.00%', trendColor: 'red' },
      oneTransaction: { count: 140, trend: '▲35.00%', trendColor: 'green' }
    }
    : selectedTier === 'tier3'
    ? {
      newCustomers: { count: 160, trend: '▲22.00%', trendColor: 'green' },
      zeroTransactions: { count: 80, trend: '▼28.00%', trendColor: 'red' },
      oneTransaction: { count: 130, trend: '▲30.00%', trendColor: 'green' }
    }
    : {
      newCustomers: { count: 150, trend: '▲18.00%', trendColor: 'green' },
      zeroTransactions: { count: 90, trend: '▼25.00%', trendColor: 'red' },
      oneTransaction: { count: 120, trend: '▲32.00%', trendColor: 'green' }
    });

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 8px', backgroundColor: 'white', boxShadow: '0 0 10px rgba(0,0,0,0.1)' }}>
        {/* Customer Count/Trend */}
        <div>
          <div>New Customers</div>
          <div className="flex items-end gap-4">
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{metrics.newCustomers.count}</div>
            <div style={{ color: metrics.newCustomers.trendColor, fontSize: '1rem', paddingBottom: '4px' }}>{metrics.newCustomers.trend}</div>
          </div>
        </div>

        {/* New Customer with 0 Transactions */}
        <div>
          <div>New Customers with 0 Transactions</div>
          <div className="flex items-end gap-4">
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{metrics.zeroTransactions.count}</div>
            <div style={{ color: metrics.zeroTransactions.trendColor, fontSize: '1rem', paddingBottom: '4px' }}>{metrics.zeroTransactions.trend}</div>
          </div>
        </div>

        {/* New Customer with 1 Transaction */}
        <div>
          <div>New Customers with 1 Transaction</div>
          <div className="flex items-end gap-4">
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{metrics.oneTransaction.count}</div>
            <div style={{ color: metrics.oneTransaction.trendColor, fontSize: '1rem', paddingBottom: '4px' }}>{metrics.oneTransaction.trend}</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-4 mt-5">
        <div className="lg:col-span-4">
          <center className="font-semibold text-[1.125rem] text-defaulttextcolor dark:text-defaulttextcolor/70 !mb-0">Customer Acquisition</center>
          <div className="box-body overflow-hidden">
            <div className="leads-source-chart flex items-center justify-center relative">
              <DonutChart chartLabels={chartLabels} series={seriesData} />
            </div>
          </div>
        </div>
        <div className="lg:col-span-8">
          <ApexChart barChartLabels={barChartLabels} barChartData={barChartData} />
        </div>
      </div>
    </>
  );
};

export default AcquisitionSection;
