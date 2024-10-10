import { useState,useEffect } from 'react';
import { DonutChart } from "../Charts/CutomerDonutCharts";
import { LineColumnChart } from "../Charts/CutomerLineChart";
import CustomerAcquisitionSection from './CustomerAcquisition';
import SelectInputBar from '../../../components/common/AdminSelection/SelectInputBar';
// Example data, replace with actual logic if needed
const programOptions = [
  { value: 'program1', label: 'Program 1' },
  { value: 'program2', label: 'Program 2' },
];

const tierOptions = [
  { value: 'tier0', label: 'Select All' },
  { value: 'tier1', label: 'Basic' },
  { value: 'tier2', label: 'Silver' },
  { value: 'tier3', label: 'Gold' },
  { value: 'tier4', label: 'Platinum' },
  // Add more options as needed
];

const durationOptions = [
  { value: '1year', label: 'Last Year' },
  { value: '6months', label: 'Last 6 Months' },
  { value: '1month', label: 'Last 1 Month' },
];

const formFields = [
  { label: 'Program', name: 'program', id: 'program', options: programOptions, placeholder: 'Select Program' },
  { label: 'Tier Group', name: 'tier-group', id: 'tier-group', options: tierOptions, placeholder: 'Select Tier Group' },
  { label: 'Duration', name: 'duration', id: 'duration', options: durationOptions, placeholder: 'Select Duration' }
];

// Example data for different programs and tiers
const loyaltyProgramData: any = {
  program1: {
    tier0: {
      '1year': { labels: ['Basic', 'Silver', 'Gold', 'Platinum'], series: [150, 300, 450, 300] },
      '6months': { labels: ['Basic', 'Silver', 'Gold', 'Platinum'], series: [120, 250, 400, 180] },
      '1month': { labels: ['Basic', 'Silver', 'Gold', 'Platinum'], series: [90, 200, 300, 150] }
    },
    tier1: { '1year': { labels:  ['Basic', 'Silver', 'Gold', 'Platinum'], series: [150, 0, 0, 0] }, '6months': { labels: ['Basic', 'Silver', 'Gold', 'Platinum'], series: [120, 0, 0, 0] }, '1month': { labels: ['Basic'], series: [90, 0, 0, 0] } },
    tier2: { '1year': { labels:  ['Basic', 'Silver', 'Gold', 'Platinum'], series:  [0, 300, 0, 0]  }, '6months': { labels:['Basic', 'Silver', 'Gold', 'Platinum'], series:  [0, 250, 0, 0]  }, '1month': { labels: ['Basic', 'Silver', 'Gold', 'Platinum'], series:  [0, 200, 0, 0]  } },
    tier3: { '1year': { labels:  ['Basic', 'Silver', 'Gold', 'Platinum'], series: [0,0,450,0] }, '6months': { labels: ['Basic', 'Silver', 'Gold', 'Platinum'], series: [0,0,400,0] }, '1month': { labels: ['Basic', 'Silver', 'Gold', 'Platinum'],series: [0,0,300,0] } },
    tier4: { '1year': { labels:  ['Basic', 'Silver', 'Gold', 'Platinum'], series: [0,0,0,300] }, '6months': { labels:['Basic', 'Silver', 'Gold', 'Platinum'], series: [0,0,0,180] }, '1month': { labels: ['Basic', 'Silver', 'Gold', 'Platinum'], series: [0,0,0,150] } }
  },
  program2: {
    tier0: {
      '1year': { labels: ['Basic', 'Silver', 'Gold', 'Platinum'], series: [100, 350, 400, 250] },
      '6months': { labels: ['Basic', 'Silver', 'Gold', 'Platinum'], series: [180, 300, 350, 230] },
      '1month': { labels: ['Basic', 'Silver', 'Gold', 'Platinum'], series: [160, 250, 300, 210] }
    },
    tier1: { '1year': { labels: ['Basic', 'Silver', 'Gold', 'Platinum'], series: [200, 0, 0, 0] }, '6months': { labels: ['Basic', 'Silver', 'Gold', 'Platinum'], series: [180, 0, 0, 0] }, '1month': { labels: ['Basic', 'Silver', 'Gold', 'Platinum'], series: [160,0,0] } },
    tier2: { '1year': { labels:  ['Basic', 'Silver', 'Gold', 'Platinum'], series: [0, 350, 0, 0]}, '6months': { labels: ['Basic', 'Silver', 'Gold', 'Platinum'], series: [0, 300, 0, 0] }, '1month': { labels: ['Basic', 'Silver', 'Gold', 'Platinum'],series: [0,250,0,0]} },
    tier3: { '1year': { labels:  ['Basic', 'Silver', 'Gold', 'Platinum'], series:[0,0,400,0] }, '6months': { labels: ['Basic', 'Silver', 'Gold', 'Platinum'], series:[0,0,350,0]  }, '1month': { labels: ['Basic', 'Silver', 'Gold', 'Platinum'],series:[0,0,300,0] } },
    tier4: { '1year': { labels:  ['Basic', 'Silver', 'Gold', 'Platinum'], series: [0,0,0,250]  }, '6months': { labels: ['Basic', 'Silver', 'Gold', 'Platinum'], series: [0,0,0,230]  }, '1month': { labels: ['Basic', 'Silver', 'Gold', 'Platinum'], series: [0,0,0,210]  } }
  }
};



// Dummy data for different durations
const LineColumnChartData: any = {
  program1: {
    tier0: {
      '1year': [
        { name: 'Accrued', type: 'column', data: [32, 45, 67, 89, 120, 54, 22, 37, 89, 45, 30, 18] },
        { name: 'Redeemed', type: 'line', data: [25000, 40000, 32000, 28000, 45000, 23000, 18000, 30000, 21000, 23000, 13000, 17000] },
        { name: 'Revenue', type: 'line', data: [22000, 43000, 34000, 26000, 44000, 21000, 16000, 32000, 23000, 24000, 11000, 15000] }
      ],
      '6months': [
        { name: 'Accrued', type: 'column', data: [45, 67, 89, 120, 54, 22] },
        { name: 'Redeemed', type: 'line', data: [40000, 32000, 28000, 45000, 23000, 18000] },
        { name: 'Revenue', type: 'line', data: [43000, 34000, 26000, 44000, 21000, 16000] }
      ],
      '1month': [
        { name: 'Accrued', type: 'column', data: [67, 89, 120, 54] },
        { name: 'Redeemed', type: 'line', data: [32000, 28000, 45000, 23000] },
        { name: 'Revenue', type: 'line', data: [34000, 26000, 44000, 21000] }
      ]
    },
    tier1: {
      '1year': [
        { name: 'Accrued', type: 'column', data: [150, 160, 250, 180, 230, 420, 210, 360, 770, 250, 235, 325] },
        { name: 'Redeemed', type: 'line', data: [24000, 43000, 34000, 26000, 44000, 21000, 18000, 31000, 23000, 22000, 13000, 15000] },
        { name: 'Revenue', type: 'line', data: [24000, 42000, 35000, 27000, 45000, 22000, 18000, 32000, 21000, 23000, 12000, 14000] }
      ],
      '6months': [
        { name: 'Accrued', type: 'column', data: [45, 67, 89, 120, 54, 22] },
        { name: 'Redeemed', type: 'line', data: [40000, 32000, 28000, 45000, 23000, 18000] },
        { name: 'Revenue', type: 'line', data: [43000, 34000, 26000, 44000, 21000, 16000] }
      ],
      '1month': [
        { name: 'Accrued', type: 'column', data: [67, 89, 120, 54] },
        { name: 'Redeemed', type: 'line', data: [32000, 28000, 45000, 23000] },
        { name: 'Revenue', type: 'line', data: [34000, 26000, 44000, 21000] }
      ]
    },
    tier2: {
      '1year': [
        { name: 'Accrued', type: 'column', data: [200, 220, 300, 250, 270, 430, 240, 370, 800, 260, 250, 330] },
        { name: 'Redeemed', type: 'line', data: [25000, 44000, 35000, 28000, 46000, 22000, 19000, 32000, 24000, 23000, 14000, 16000] },
        { name: 'Revenue', type: 'line', data: [25000, 43000, 36000, 28000, 46000, 23000, 19000, 32000, 22000, 24000, 13000, 15000] }
      ],
      '6months': [
        { name: 'Accrued', type: 'column', data: [50, 70, 100, 240, 70, 30] },
        { name: 'Redeemed', type: 'line', data: [42000, 34000, 29000, 45000, 24000, 19000] },
        { name: 'Revenue', type: 'line', data: [44000, 35000, 27000, 43000, 23000, 17000] }
      ],
      '1month': [
        { name: 'Accrued', type: 'column', data: [80, 100, 240, 70] },
        { name: 'Redeemed', type: 'line', data: [33000, 29000, 47000, 24000] },
        { name: 'Revenue', type: 'line', data: [35000, 28000, 43000, 22000] }
      ]
    },
    tier3: {
      '1year': [
        { name: 'Accrued', type: 'column', data: [180, 200, 280, 230, 250, 410, 220, 350, 780, 240, 245, 310] },
        { name: 'Redeemed', type: 'line', data: [26000, 44000, 35000, 27000, 45000, 22000, 19000, 32000, 24000, 23000, 14000, 15000] },
        { name: 'Revenue', type: 'line', data: [25000, 43000, 36000, 28000, 46000, 23000, 19000, 33000, 22000, 24000, 13000, 16000] }
      ],
      '6months': [
        { name: 'Accrued', type: 'column', data: [60, 80, 100, 240, 80, 30] },
        { name: 'Redeemed', type: 'line', data: [43000, 34000, 29000, 46000, 24000, 20000] },
        { name: 'Revenue', type: 'line', data: [44000, 36000, 27000, 44000, 23000, 17000] }
      ],
      '1month': [
        { name: 'Accrued', type: 'column', data: [90, 110, 250, 80] },
        { name: 'Redeemed', type: 'line', data: [34000, 29000, 47000, 24000] },
        { name: 'Revenue', type: 'line', data: [36000, 28000, 43000, 22000] }
      ]
    },
    tier4: {
      '1year': [
        { name: 'Accrued', type: 'column', data: [200, 220, 280, 250, 270, 430, 240, 360, 780, 260, 250, 340] },
        { name: 'Redeemed', type: 'line', data: [25000, 43000, 34000, 27000, 45000, 22000, 19000, 32000, 23000, 22000, 13000, 16000] },
        { name: 'Revenue', type: 'line', data: [25000, 42000, 35000, 26000, 44000, 23000, 19000, 33000, 22000, 23000, 12000, 14000] }
      ],
      '6months': [
        { name: 'Accrued', type: 'column', data: [70, 90, 110, 230, 80, 35] },
        { name: 'Redeemed', type: 'line', data: [42000, 34000, 28000, 46000, 23000, 19000] },
        { name: 'Revenue', type: 'line', data: [44000, 35000, 27000, 43000, 23000, 18000] }
      ],
      '1month': [
        { name: 'Accrued', type: 'column', data: [80, 100, 220, 60] },
        { name: 'Redeemed', type: 'line', data: [33000, 28000, 46000, 22000] },
        { name: 'Revenue', type: 'line', data: [35000, 29000, 44000, 21000] }
      ]
    }
  },
  program2: {
    tier0: {
      '1year': [
        { name: 'Accrued', type: 'column', data: [40, 55, 70, 95, 125, 60, 30, 40, 85, 50, 35, 25] },
        { name: 'Redeemed', type: 'line', data: [26000, 41000, 33000, 29000, 46000, 24000, 19000, 31000, 22000, 24000, 14000, 16000] },
        { name: 'Revenue', type: 'line', data: [24000, 42000, 34000, 27000, 45000, 23000, 20000, 32000, 23000, 25000, 12000, 15000] }
      ],
      '6months': [
        { name: 'Accrued', type: 'column', data: [50, 65, 85, 130, 55, 35] },
        { name: 'Redeemed', type: 'line', data: [40000, 33000, 27000, 46000, 23000, 20000] },
        { name: 'Revenue', type: 'line', data: [42000, 34000, 26000, 44000, 22000, 17000] }
      ],
      '1month': [
        { name: 'Accrued', type: 'column', data: [70, 85, 130, 55] },
        { name: 'Redeemed', type: 'line', data: [33000, 29000, 47000, 22000] },
        { name: 'Revenue', type: 'line', data: [35000, 28000, 43000, 21000] }
      ]
    },
    tier1: {
      '1year': [
        { name: 'Accrued', type: 'column', data: [160, 180, 260, 220, 280, 450, 230, 380, 800, 270, 240, 350] },
        { name: 'Redeemed', type: 'line', data: [27000, 44000, 35000, 29000, 46000, 23000, 20000, 32000, 24000, 23000, 13000, 16000] },
        { name: 'Revenue', type: 'line', data: [26000, 43000, 36000, 28000, 47000, 22000, 19000, 33000, 23000, 24000, 13000, 15000] }
      ],
      '6months': [
        { name: 'Accrued', type: 'column', data: [60, 80, 100, 250, 75, 30] },
        { name: 'Redeemed', type: 'line', data: [43000, 34000, 29000, 45000, 24000, 20000] },
        { name: 'Revenue', type: 'line', data: [44000, 36000, 27000, 44000, 23000, 18000] }
      ],
      '1month': [
        { name: 'Accrued', type: 'column', data: [80, 100, 250, 70] },
        { name: 'Redeemed', type: 'line', data: [34000, 30000, 47000, 24000] },
        { name: 'Revenue', type: 'line', data: [35000, 29000, 44000, 22000] }
      ]
    },
    tier2: {
      '1year': [
        { name: 'Accrued', type: 'column', data: [190, 220, 280, 250, 270, 430, 240, 360, 800, 260, 250, 340] },
        { name: 'Redeemed', type: 'line', data: [26000, 44000, 35000, 27000, 45000, 22000, 20000, 32000, 23000, 22000, 13000, 16000] },
        { name: 'Revenue', type: 'line', data: [25000, 42000, 35000, 26000, 44000, 23000, 20000, 33000, 22000, 23000, 12000, 14000] }
      ],
      '6months': [
        { name: 'Accrued', type: 'column', data: [70, 90, 120, 240, 85, 35] },
        { name: 'Redeemed', type: 'line', data: [42000, 34000, 29000, 46000, 23000, 20000] },
        { name: 'Revenue', type: 'line', data: [43000, 35000, 27000, 44000, 23000, 17000] }
      ],
      '1month': [
        { name: 'Accrued', type: 'column', data: [90, 110, 250, 70] },
        { name: 'Redeemed', type: 'line', data: [33000, 28000, 46000, 23000] },
        { name: 'Revenue', type: 'line', data: [34000, 29000, 44000, 22000] }
      ]
    },
    tier3: {
      '1year': [
        { name: 'Accrued', type: 'column', data: [190, 200, 270, 230, 250, 410, 220, 360, 800, 250, 230, 350] },
        { name: 'Redeemed', type: 'line', data: [27000, 44000, 35000, 27000, 45000, 22000, 19000, 32000, 24000, 23000, 13000, 15000] },
        { name: 'Revenue', type: 'line', data: [26000, 43000, 36000, 28000, 46000, 23000, 19000, 33000, 22000, 24000, 12000, 16000] }
      ],
      '6months': [
        { name: 'Accrued', type: 'column', data: [80, 100, 130, 230, 90, 40] },
        { name: 'Redeemed', type: 'line', data: [43000, 34000, 28000, 46000, 23000, 19000] },
        { name: 'Revenue', type: 'line', data: [44000, 35000, 27000, 43000, 23000, 18000] }
      ],
      '1month': [
        { name: 'Accrued', type: 'column', data: [90, 110, 250, 80] },
        { name: 'Redeemed', type: 'line', data: [34000, 29000, 47000, 22000] },
        { name: 'Revenue', type: 'line', data: [35000, 28000, 44000, 21000] }
      ]
    },
    tier4: {
      '1year': [
        { name: 'Accrued', type: 'column', data: [200, 220, 290, 260, 270, 440, 250, 370, 780, 270, 260, 340] },
        { name: 'Redeemed', type: 'line', data: [26000, 44000, 35000, 27000, 45000, 22000, 20000, 32000, 24000, 22000, 14000, 15000] },
        { name: 'Revenue', type: 'line', data: [25000, 42000, 36000, 26000, 44000, 23000, 19000, 33000, 22000, 23000, 12000, 15000] }
      ],
      '6months': [
        { name: 'Accrued', type: 'column', data: [90, 110, 130, 240, 85, 30] },
        { name: 'Redeemed', type: 'line', data: [43000, 34000, 28000, 47000, 23000, 20000] },
        { name: 'Revenue', type: 'line', data: [44000, 35000, 27000, 44000, 22000, 17000] }
      ],
      '1month': [
        { name: 'Accrued', type: 'column', data: [100, 120, 260, 70] },
        { name: 'Redeemed', type: 'line', data: [34000, 30000, 47000, 23000] },
        { name: 'Revenue', type: 'line', data: [35000, 29000, 44000, 22000] }
      ]
    }
  }
};


const customerAcquisitionData: any = {
  program1: {
    tier0: {
      '1year': {
        pointAccrued: { value: '1.5M', percentageChange: '▲20.5%', changeColor: 'green' },
        pointRedeemed: { value: '42.1K', percentageChange: '▼10.2%', changeColor: 'red' },
        pointExpired: { value: '90K', percentageChange: '▲45%', changeColor: 'green' },
        pointBalance: { value: '80.5k', percentageChange: '', changeColor: 'blue' },
        revenueGrowth: { value: '800.4k', percentageChange: '▼15.12%', changeColor: 'red' }
      },
      '6months': {
        pointAccrued: { value: '750K', percentageChange: '▲15.0%', changeColor: 'green' },
        pointRedeemed: { value: '21.0K', percentageChange: '▼5.1%', changeColor: 'red' },
        pointExpired: { value: '45K', percentageChange: '▲30%', changeColor: 'green' },
        pointBalance: { value: '40.5k', percentageChange: '', changeColor: 'blue' },
        revenueGrowth: { value: '400.2k', percentageChange: '▼10.05%', changeColor: 'red' }
      },
      '1month': {
        pointAccrued: { value: '125K', percentageChange: '▲10.0%', changeColor: 'green' },
        pointRedeemed: { value: '7.0K', percentageChange: '▼2.5%', changeColor: 'red' },
        pointExpired: { value: '15K', percentageChange: '▲20%', changeColor: 'green' },
        pointBalance: { value: '15.5k', percentageChange: '', changeColor: 'blue' },
        revenueGrowth: { value: '100.1k', percentageChange: '▼5.0%', changeColor: 'red' }
      }
    },
    tier1: {
      '1year': {
        pointAccrued: { value: '1M', percentageChange: '▲14.6%', changeColor: 'green' },
        pointRedeemed: { value: '36.3K', percentageChange: '▼13.5%', changeColor: 'red' },
        pointExpired: { value: '50K', percentageChange: '▲30%', changeColor: 'green' },
        pointBalance: { value: '61.1k', percentageChange: '', changeColor: 'blue' },
        revenueGrowth: { value: '654.2k', percentageChange: '▼15.64%', changeColor: 'red' }
      },
      '6months': {
        pointAccrued: { value: '500K', percentageChange: '▲12.0%', changeColor: 'green' },
        pointRedeemed: { value: '18.0K', percentageChange: '▼10.0%', changeColor: 'red' },
        pointExpired: { value: '25K', percentageChange: '▲25%', changeColor: 'green' },
        pointBalance: { value: '30.5k', percentageChange: '', changeColor: 'blue' },
        revenueGrowth: { value: '327.1k', percentageChange: '▼12.0%', changeColor: 'red' }
      },
      '1month': {
        pointAccrued: { value: '85K', percentageChange: '▲8.0%', changeColor: 'green' },
        pointRedeemed: { value: '5.0K', percentageChange: '▼3.0%', changeColor: 'red' },
        pointExpired: { value: '10K', percentageChange: '▲15%', changeColor: 'green' },
        pointBalance: { value: '10.5k', percentageChange: '', changeColor: 'blue' },
        revenueGrowth: { value: '60.1k', percentageChange: '▼4.0%', changeColor: 'red' }
      }
    },
    tier2: {
      '1year': {
        pointAccrued: { value: '1.2M', percentageChange: '▲18.5%', changeColor: 'green' },
        pointRedeemed: { value: '45.1K', percentageChange: '▼16.2%', changeColor: 'red' },
        pointExpired: { value: '60K', percentageChange: '▲46%', changeColor: 'green' },
        pointBalance: { value: '65.5k', percentageChange: '', changeColor: 'blue' },
        revenueGrowth: { value: '700.4k', percentageChange: '▼16.12%', changeColor: 'red' }
      },
      '6months': {
        pointAccrued: { value: '600K', percentageChange: '▲17.0%', changeColor: 'green' },
        pointRedeemed: { value: '25.0K', percentageChange: '▼14.0%', changeColor: 'red' },
        pointExpired: { value: '30K', percentageChange: '▲40%', changeColor: 'green' },
        pointBalance: { value: '35.5k', percentageChange: '', changeColor: 'blue' },
        revenueGrowth: { value: '350.2k', percentageChange: '▼14.0%', changeColor: 'red' }
      },
      '1month': {
        pointAccrued: { value: '100K', percentageChange: '▲12.0%', changeColor: 'green' },
        pointRedeemed: { value: '8.0K', percentageChange: '▼5.0%', changeColor: 'red' },
        pointExpired: { value: '12K', percentageChange: '▲30%', changeColor: 'green' },
        pointBalance: { value: '12.5k', percentageChange: '', changeColor: 'blue' },
        revenueGrowth: { value: '80.1k', percentageChange: '▼6.0%', changeColor: 'red' }
      }
    },
    tier3: {
      '1year': {
        pointAccrued: { value: '1.5M', percentageChange: '▲20.5%', changeColor: 'green' },
        pointRedeemed: { value: '42.1K', percentageChange: '▼19.2%', changeColor: 'red' },
        pointExpired: { value: '80K', percentageChange: '▲55%', changeColor: 'green' },
        pointBalance: { value: '70.5k', percentageChange: '', changeColor: 'blue' },
        revenueGrowth: { value: '800.4k', percentageChange: '▼19.12%', changeColor: 'red' }
      },
      '6months': {
        pointAccrued: { value: '750K', percentageChange: '▲18.0%', changeColor: 'green' },
        pointRedeemed: { value: '21.0K', percentageChange: '▼15.0%', changeColor: 'red' },
        pointExpired: { value: '40K', percentageChange: '▲50%', changeColor: 'green' },
        pointBalance: { value: '30.5k', percentageChange: '', changeColor: 'blue' },
        revenueGrowth: { value: '400.2k', percentageChange: '▼20.0%', changeColor: 'red' }
      },
      '1month': {
        pointAccrued: { value: '125K', percentageChange: '▲14.0%', changeColor: 'green' },
        pointRedeemed: { value: '7.0K', percentageChange: '▼7.0%', changeColor: 'red' },
        pointExpired: { value: '15K', percentageChange: '▲35%', changeColor: 'green' },
        pointBalance: { value: '15.5k', percentageChange: '', changeColor: 'blue' },
        revenueGrowth: { value: '100.1k', percentageChange: '▼8.0%', changeColor: 'red' }
      }
    },
    tier4: {
      '1year': {
        pointAccrued: { value: '1.1M', percentageChange: '▲15.5%', changeColor: 'green' },
        pointRedeemed: { value: '37.1K', percentageChange: '▼12.2%', changeColor: 'red' },
        pointExpired: { value: '55K', percentageChange: '▲48%', changeColor: 'green' },
        pointBalance: { value: '56.5k', percentageChange: '', changeColor: 'blue' },
        revenueGrowth: { value: '669.4k', percentageChange: '▼15.44%', changeColor: 'red' }
      },
      '6months': {
        pointAccrued: { value: '550K', percentageChange: '▲14.0%', changeColor: 'green' },
        pointRedeemed: { value: '18.0K', percentageChange: '▼10.0%', changeColor: 'red' },
        pointExpired: { value: '30K', percentageChange: '▲40%', changeColor: 'green' },
        pointBalance: { value: '28.5k', percentageChange: '', changeColor: 'blue' },
        revenueGrowth: { value: '340.2k', percentageChange: '▼18.0%', changeColor: 'red' }
      },
      '1month': {
        pointAccrued: { value: '90K', percentageChange: '▲10.0%', changeColor: 'green' },
        pointRedeemed: { value: '5.0K', percentageChange: '▼6.0%', changeColor: 'red' },
        pointExpired: { value: '12K', percentageChange: '▲30%', changeColor: 'green' },
        pointBalance: { value: '10.5k', percentageChange: '', changeColor: 'blue' },
        revenueGrowth: { value: '80.1k', percentageChange: '▼7.0%', changeColor: 'red' }
      }
    }
  },
  program2: {
    tier0: {
      '1year': {
        pointAccrued: { value: '1.6M', percentageChange: '▲22.0%', changeColor: 'green' },
        pointRedeemed: { value: '45.0K', percentageChange: '▼9.5%', changeColor: 'red' },
        pointExpired: { value: '95K', percentageChange: '▲50%', changeColor: 'green' },
        pointBalance: { value: '85.0k', percentageChange: '', changeColor: 'blue' },
        revenueGrowth: { value: '820.3k', percentageChange: '▼13.8%', changeColor: 'red' }
      },
      '6months': {
        pointAccrued: { value: '800K', percentageChange: '▲18.0%', changeColor: 'green' },
        pointRedeemed: { value: '25.0K', percentageChange: '▼8.0%', changeColor: 'red' },
        pointExpired: { value: '50K', percentageChange: '▲45%', changeColor: 'green' },
        pointBalance: { value: '50.0k', percentageChange: '', changeColor: 'blue' },
        revenueGrowth: { value: '500.2k', percentageChange: '▼12.0%', changeColor: 'red' }
      },
      '1month': {
        pointAccrued: { value: '100K', percentageChange: '▲12.0%', changeColor: 'green' },
        pointRedeemed: { value: '7.0K', percentageChange: '▼6.0%', changeColor: 'red' },
        pointExpired: { value: '20K', percentageChange: '▲25%', changeColor: 'green' },
        pointBalance: { value: '10.0k', percentageChange: '', changeColor: 'blue' },
        revenueGrowth: { value: '75.1k', percentageChange: '▼7.0%', changeColor: 'red' }
      }
    },
    tier1: {
      '1year': {
        pointAccrued: { value: '1.2M', percentageChange: '▲14.5%', changeColor: 'green' },
        pointRedeemed: { value: '38.0K', percentageChange: '▼12.0%', changeColor: 'red' },
        pointExpired: { value: '85K', percentageChange: '▲55%', changeColor: 'green' },
        pointBalance: { value: '75.0k', percentageChange: '', changeColor: 'blue' },
        revenueGrowth: { value: '760.5k', percentageChange: '▼16.3%', changeColor: 'red' }
      },
      '6months': {
        pointAccrued: { value: '600K', percentageChange: '▲12.0%', changeColor: 'green' },
        pointRedeemed: { value: '20.0K', percentageChange: '▼10.0%', changeColor: 'red' },
        pointExpired: { value: '45K', percentageChange: '▲50%', changeColor: 'green' },
        pointBalance: { value: '45.0k', percentageChange: '', changeColor: 'blue' },
        revenueGrowth: { value: '400.5k', percentageChange: '▼15.0%', changeColor: 'red' }
      },
      '1month': {
        pointAccrued: { value: '80K', percentageChange: '▲8.0%', changeColor: 'green' },
        pointRedeemed: { value: '4.0K', percentageChange: '▼5.0%', changeColor: 'red' },
        pointExpired: { value: '10K', percentageChange: '▲30%', changeColor: 'green' },
        pointBalance: { value: '8.0k', percentageChange: '', changeColor: 'blue' },
        revenueGrowth: { value: '60.0k', percentageChange: '▼6.0%', changeColor: 'red' }
      }
    },
    tier2: {
      '1year': {
        pointAccrued: { value: '1.6M', percentageChange: '▲22.0%', changeColor: 'green' },
        pointRedeemed: { value: '45.0K', percentageChange: '▼19.5%', changeColor: 'red' },
        pointExpired: { value: '95K', percentageChange: '▲60%', changeColor: 'green' },
        pointBalance: { value: '85.0k', percentageChange: '', changeColor: 'blue' },
        revenueGrowth: { value: '820.3k', percentageChange: '▼18.8%', changeColor: 'red' }
      },
      '6months': {
        pointAccrued: { value: '800K', percentageChange: '▲20.0%', changeColor: 'green' },
        pointRedeemed: { value: '28.0K', percentageChange: '▼15.0%', changeColor: 'red' },
        pointExpired: { value: '50K', percentageChange: '▲55%', changeColor: 'green' },
        pointBalance: { value: '50.0k', percentageChange: '', changeColor: 'blue' },
        revenueGrowth: { value: '400.5k', percentageChange: '▼20.0%', changeColor: 'red' }
      },
      '1month': {
        pointAccrued: { value: '110K', percentageChange: '▲15.0%', changeColor: 'green' },
        pointRedeemed: { value: '9.0K', percentageChange: '▼8.0%', changeColor: 'red' },
        pointExpired: { value: '18K', percentageChange: '▲35%', changeColor: 'green' },
        pointBalance: { value: '12.0k', percentageChange: '', changeColor: 'blue' },
        revenueGrowth: { value: '85.0k', percentageChange: '▼10.0%', changeColor: 'red' }
      }
    },
    tier3: {
      '1year': {
        pointAccrued: { value: '1.8M', percentageChange: '▲25.20%', changeColor: 'green' },
        pointRedeemed: { value: '65.0K', percentageChange: '▼29.5%', changeColor: 'red' },
        pointExpired: { value: '98K', percentageChange: '▲70%', changeColor: 'green' },
        pointBalance: { value: '92.0k', percentageChange: '', changeColor: 'blue' },
        revenueGrowth: { value: '920.3k', percentageChange: '▼23.8%', changeColor: 'red' }
      },
      '6months': {
        pointAccrued: { value: '900K', percentageChange: '▲20.0%', changeColor: 'green' },
        pointRedeemed: { value: '30.0K', percentageChange: '▼25.0%', changeColor: 'red' },
        pointExpired: { value: '60K', percentageChange: '▲65%', changeColor: 'green' },
        pointBalance: { value: '50.0k', percentageChange: '', changeColor: 'blue' },
        revenueGrowth: { value: '450.2k', percentageChange: '▼25.0%', changeColor: 'red' }
      },
      '1month': {
        pointAccrued: { value: '150K', percentageChange: '▲18.0%', changeColor: 'green' },
        pointRedeemed: { value: '10.0K', percentageChange: '▼10.0%', changeColor: 'red' },
        pointExpired: { value: '20K', percentageChange: '▲40%', changeColor: 'green' },
        pointBalance: { value: '18.0k', percentageChange: '', changeColor: 'blue' },
        revenueGrowth: { value: '120.0k', percentageChange: '▼12.0%', changeColor: 'red' }
      }
    },
    tier4: {
      '1year': {
        pointAccrued: { value: '1.4M', percentageChange: '▲16.0%', changeColor: 'green' },
        pointRedeemed: { value: '40.0K', percentageChange: '▼20.5%', changeColor: 'red' },
        pointExpired: { value: '90K', percentageChange: '▲59%', changeColor: 'green' },
        pointBalance: { value: '80.0k', percentageChange: '', changeColor: 'blue' },
        revenueGrowth: { value: '790.3k', percentageChange: '▼17.8%', changeColor: 'red' }
      },
      '6months': {
        pointAccrued: { value: '700K', percentageChange: '▲14.0%', changeColor: 'green' },
        pointRedeemed: { value: '25.0K', percentageChange: '▼12.0%', changeColor: 'red' },
        pointExpired: { value: '45K', percentageChange: '▲50%', changeColor: 'green' },
        pointBalance: { value: '35.0k', percentageChange: '', changeColor: 'blue' },
        revenueGrowth: { value: '300.5k', percentageChange: '▼22.0%', changeColor: 'red' }
      },
      '1month': {
        pointAccrued: { value: '70K', percentageChange: '▲10.0%', changeColor: 'green' },
        pointRedeemed: { value: '3.0K', percentageChange: '▼8.0%', changeColor: 'red' },
        pointExpired: { value: '15K', percentageChange: '▲35%', changeColor: 'green' },
        pointBalance: { value: '10.0k', percentageChange: '', changeColor: 'blue' },
        revenueGrowth: { value: '55.0k', percentageChange: '▼10.0%', changeColor: 'red' }
      }
    }
  }
};


const AcquisitionChart = () => {
  const [selectedProgram, setSelectedProgram] = useState('program1');
  const [selectedTier, setSelectedTier] = useState('tier0');
  const [selectedDuration, setSelectedDuration] = useState('1year');
  const [chartData, setChartData] = useState({ labels: [], series: [] });

    // Update chart data whenever the selectedProgram, selectedTier, or selectedDuration changes
    useEffect(() => {
      const newChartData = loyaltyProgramData[selectedProgram]?.[selectedTier]?.[selectedDuration] || { labels: [], series: [] };
      setChartData(newChartData);
    }, [selectedProgram, selectedTier, selectedDuration]);

  const getLabels = () => {
    switch (selectedDuration) {
      case '1year':
        return ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      case '6months':
        return ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
      case '1month':
        return ['Week 1', 'Week 2', 'Week 3', 'Week 4'];
      default:
        return [];
    }
  };

  const labels = getLabels();
  // const chartData = loyaltyProgramData[selectedProgram]?.[selectedTier]?.[selectedDuration] || { labels: [], series: [] };

  const LineColumnChartDatas = LineColumnChartData[selectedProgram]?.[selectedTier]?.[selectedDuration] || [];

  const acquisitionData = customerAcquisitionData[selectedProgram]?.[selectedTier]?.[selectedDuration] || [];

  const handleProgramChange = (selectedOption: any) => {
    if (selectedOption) {
      setSelectedProgram(selectedOption.value);
    }
  };

  const handleTierChange = (selectedOption: any) => {
    if (selectedOption) {
      setSelectedTier(selectedOption.value);
    }
  };

  const handleDurationChange = (selectedOption: any) => {
    if (selectedOption) {
      setSelectedDuration(selectedOption.value);
    }
  };
  return (
    <div style={{ width: '100%', marginTop: '20px' }}>
      <div className="pb-5 grid md:grid-cols-3 gap-3">
        {formFields.map(field => (
          <SelectInputBar
          key={field.id}
          label={field.label}
          name={field.name}
          id={field.id}
          options={field.options}
          placeholder={field.placeholder}
          onChange={field.name === 'program' ? handleProgramChange :
                    field.name === 'tier-group' ? handleTierChange :
                    handleDurationChange}
        />
      ))}
      </div>
      <div style={{ borderColor: 'divider', backgroundColor: 'white' }}>
        <div className="p-3 flex flex-row justify-between">
          <span className='font-bold text-defaulttextcolor'>Customer Loyalty Program</span>
          <span className='font-bold text-defaulttextcolor'>Status: Active</span>
        </div>
      </div>
      <div className='p-2 bg-white'>
        <CustomerAcquisitionSection 
          pointAccrued={acquisitionData.pointAccrued}
          pointRedeemed={acquisitionData.pointRedeemed}
          pointExpired={acquisitionData.pointExpired}
          pointBalance={acquisitionData.pointBalance}
          revenueGrowth={acquisitionData.revenueGrowth}
        />
      </div>
      
      <div className="grid grid-cols-12 gap-4 bg-white">
        <div className="lg:col-span-4">
          <center className="font-semibold text-[1.125rem] text-defaulttextcolor dark:text-defaulttextcolor/70 !mb-0 text-start pl-2">
            Customer By Tiers
          </center>
          <div className="box-body overflow-hidden">
            <div className="leads-source-chart flex items-center justify-center relative">
            <DonutChart chartLabels={chartData.labels} chartSeries={chartData.series} />
            </div>
          </div>
        </div>
        
        <div className="lg:col-span-8">
          <LineColumnChart
            series={LineColumnChartDatas}
            labels={labels}
            title="Monthly Data"
            yAxisTitles={{ primary: { text: 'Redeemed' }, secondary: { text: '' } }}
          />
        </div>
      </div>
    </div>
  );
};

export default AcquisitionChart;
