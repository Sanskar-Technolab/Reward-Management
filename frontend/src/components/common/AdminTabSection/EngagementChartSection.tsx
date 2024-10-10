import React from 'react';
import { LineColumnChart } from "../Charts/LineAndColumn";
import TwoSidedBarChart from '../Charts/SideBySideBar';

interface EngagementChartSectionProps {
  alignment: string;
  selectedProgram: string;
  selectedTier: string;
}

const EngagementChartSection: React.FC<EngagementChartSectionProps> = ({ alignment, selectedProgram, selectedTier }) => {
  console.log('Alignment:', alignment);
  console.log('Selected Program:', selectedProgram);
  console.log('Selected Tier:', selectedTier);

  // Function to get data based on the selected program and tier
  const getDataForProgram = (program: string, tier: string) => {
    if (program === 'program1') {
      switch (tier) {
        case 'tier0':
          return {
            customerData: [44, 50, 41, 67, 227, 41, 20, 35, 75, 32, 25, 16],
            transactionData: [23000, 42000, 35000, 27000, 43000, 22000, 17000, 31000, 22000, 22000, 12000, 16000],
            seriesData: [
              { name: "Members", data: [500, 280, 460, 140, 347] },
              { name: "Average Transaction", data: [1000, 1200, 870, 640, 750] },
            ],
          };
        case 'tier1':
          return {
            customerData: [55, 60, 51, 70, 240, 45, 25, 40, 80, 35, 30, 20],
            transactionData: [24000, 43000, 36000, 28000, 44000, 23000, 18000, 32000, 23000, 23000, 13000, 17000],
            seriesData: [
              { name: "Members", data: [510, 290, 470, 150, 357] },
              { name: "Average Transaction", data: [1050, 1250, 880, 650, 760] },
            ],
          };
        case 'tier2':
          return {
            customerData: [60, 65, 55, 75, 250, 50, 30, 45, 85, 40, 35, 25],
            transactionData: [25000, 44000, 37000, 29000, 45000, 24000, 19000, 33000, 24000, 24000, 14000, 18000],
            seriesData: [
              { name: "Members", data: [520, 300, 480, 160, 370] },
              { name: "Average Transaction", data: [1100, 1300, 890, 660, 780] },
            ],
          };
        case 'tier3':
          return {
            customerData: [65, 70, 60, 80, 260, 55, 35, 50, 90, 45, 40, 30],
            transactionData: [26000, 45000, 38000, 30000, 46000, 25000, 20000, 34000, 25000, 25000, 15000, 19000],
            seriesData: [
              { name: "Members", data: [530, 310, 490, 170, 380] },
              { name: "Average Transaction", data: [1150, 1350, 900, 670, 800] },
            ],
          };
        case 'tier4':
          return {
            customerData: [70, 75, 65, 85, 270, 60, 40, 55, 95, 50, 45, 35],
            transactionData: [27000, 46000, 39000, 31000, 47000, 26000, 21000, 35000, 26000, 26000, 16000, 20000],
            seriesData: [
              { name: "Members", data: [540, 320, 500, 180, 390] },
              { name: "Average Transaction", data: [1200, 1400, 910, 680, 820] },
            ],
          };
        default:
          return {
            customerData: [],
            transactionData: [],
            seriesData: [],
          };
      }
    } else if (program === 'program2') {
      switch (tier) {
        case 'tier0':
          return {
            customerData: [30, 45, 50, 60, 200, 30, 15, 40, 70, 25, 20, 10],
            transactionData: [20000, 37000, 33000, 25000, 40000, 21000, 18000, 30000, 23000, 20000, 13000, 15000],
            seriesData: [
              { name: "Members", data: [400, 260, 420, 130, 320] },
              { name: "Average Transaction", data: [950, 1100, 850, 620, 720] },
            ],
          };
        case 'tier1':
          return {
            customerData: [40, 50, 55, 70, 210, 40, 20, 45, 80, 30, 25, 15],
            transactionData: [22000, 38000, 34000, 26000, 41000, 22000, 19000, 31000, 24000, 21000, 14000, 16000],
            seriesData: [
              { name: "Members", data: [410, 270, 430, 140, 330] },
              { name: "Average Transaction", data: [1000, 1150, 860, 630, 730] },
            ],
          };
        case 'tier2':
          return {
            customerData: [45, 55, 60, 75, 220, 45, 25, 50, 85, 35, 30, 20],
            transactionData: [23000, 39000, 35000, 27000, 42000, 23000, 20000, 32000, 25000, 22000, 15000, 17000],
            seriesData: [
              { name: "Members", data: [420, 280, 440, 150, 340] },
              { name: "Average Transaction", data: [1050, 1200, 870, 640, 740] },
            ],
          };
        case 'tier3':
          return {
            customerData: [50, 60, 65, 80, 230, 50, 30, 55, 90, 40, 35, 25],
            transactionData: [24000, 40000, 36000, 28000, 43000, 24000, 21000, 33000, 26000, 23000, 16000, 18000],
            seriesData: [
              { name: "Members", data: [430, 290, 450, 160, 350] },
              { name: "Average Transaction", data: [1100, 1250, 880, 650, 760] },
            ],
          };
        case 'tier4':
          return {
            customerData: [55, 65, 70, 85, 240, 55, 35, 60, 95, 45, 40, 30],
            transactionData: [25000, 41000, 37000, 29000, 44000, 25000, 22000, 34000, 27000, 24000, 17000, 19000],
            seriesData: [
              { name: "Members", data: [440, 300, 460, 170, 360] },
              { name: "Average Transaction", data: [1150, 1300, 890, 660, 780] },
            ],
          };
        default:
          return {
            customerData: [],
            transactionData: [],
            seriesData: [],
          };
      }
    }
    return {
      customerData: [],
      transactionData: [],
      seriesData: [],
    };
  };

  // Provide default data if selectedProgram or selectedTier is undefined
  const { customerData, transactionData, seriesData } = getDataForProgram(selectedProgram || 'program1', selectedTier || 'tier1');

  const chartLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const xCategories = ["9-12 Months", "6-9 Months", "3-6 Months", "1-3 Months", "< 1 Month"];

  return (
    <div>
      {alignment === "Customer Activity" && <LineColumnChart 
        customerData={customerData} 
        transactionData={transactionData} 
        chartLabels={chartLabels} 
      />}
      {alignment === "Customer Tenure" && <TwoSidedBarChart seriesData={seriesData} xCategories={xCategories} />}
    </div>
  );
};

export default EngagementChartSection;
