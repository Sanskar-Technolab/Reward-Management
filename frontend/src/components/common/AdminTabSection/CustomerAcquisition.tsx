import React from 'react';

// Define the props type
interface AcquisitionSectionProps {
  pointAccrued: { value: string; percentageChange: string; changeColor: string };
  pointRedeemed: { value: string; percentageChange: string; changeColor: string };
  pointExpired: { value: string; percentageChange: string; changeColor: string };
  pointBalance: { value: string; percentageChange: string; changeColor: string };
  revenueGrowth: { value: string; percentageChange: string; changeColor: string };
}

const CustomerAcquisitionSection: React.FC<AcquisitionSectionProps> = ({
  pointAccrued,
  pointRedeemed,
  pointExpired,
  pointBalance,
  revenueGrowth
}) => {
  return (
    <>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        padding: '10px 8px',
        backgroundColor: 'white',
        boxShadow: '0 0 10px rgba(0,0,0,0.1)'
      }}>
        {/* Customer Count/Trend */}
        <div>
          <div>Point Accrued</div>
          <div className='flex items-end gap-4'>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{pointAccrued.value}</div>
            <div style={{ color: pointAccrued.changeColor, fontSize: '1rem', paddingBottom: '4px' }}>{pointAccrued.percentageChange}</div>
          </div>
        </div>

        {/* Point Redeemed */}
        <div>
          <div>Point Redeemed</div>
          <div className='flex items-end gap-4'>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{pointRedeemed.value}</div>
            <div style={{ color: pointRedeemed.changeColor, fontSize: '1rem', paddingBottom: '4px' }}>{pointRedeemed.percentageChange}</div>
          </div>
        </div>

        {/* Point Expired */}
        <div>
          <div>Point Expired</div>
          <div className='flex items-end gap-4'>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{pointExpired.value}</div>
            <div style={{ color: pointExpired.changeColor, fontSize: '1rem', paddingBottom: '4px' }}>{pointExpired.percentageChange}</div>
          </div>
        </div>

        {/* Point Balance to Date */}
        <div>
          <div>Point Balance to Date</div>
          <div className='flex items-end gap-4'>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{pointBalance.value}</div>
            <div style={{ color: pointBalance.changeColor, fontSize: '1rem', paddingBottom: '4px' }}>{pointBalance.percentageChange}</div>
          </div>
        </div>

        {/* Revenue Growth */}
        <div>
          <div>Revenue Growth</div>
          <div className='flex items-end gap-4'>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{revenueGrowth.value}</div>
            <div style={{ color: revenueGrowth.changeColor, fontSize: '1rem', paddingBottom: '4px' }}>{revenueGrowth.percentageChange}</div>
          </div>
        </div>
      </div>
      {/* Remove or define ChartSection */}
    </>
  );
};

export default CustomerAcquisitionSection;
