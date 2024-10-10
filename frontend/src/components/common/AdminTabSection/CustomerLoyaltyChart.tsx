import Box from '@mui/material/Box';
import CustomerAcquisitionSection from './CustomerAcquisition';

const AdminTab = () => {
  return (
    <Box sx={{ width: '100%', typography: 'body1', marginTop: '20px' }}>
      <Box sx={{ borderColor: 'divider', backgroundColor: 'white' }}>
        <div className="p-3 flex flex-row justify-between">
          <span className='font-bold text-defaulttextcolor'>Customer Loyalty Program</span>
          <span className='font-bold text-defaulttextcolor'>Status: Active</span>
        </div>
      </Box>
      <Box className='p-2 bg-white'>
        <CustomerAcquisitionSection 
          pointAccrued={{ value: '1.2M', percentageChange: '▲14.63%', changeColor: 'green' }}
          pointRedeemed={{ value: '36.3K', percentageChange: '▼14.5%', changeColor: 'red' }}
          pointExpired={{ value: '81K', percentageChange: '▲52%', changeColor: 'green' }}
          pointBalance={{ value: '72.1k', percentageChange: '', changeColor: 'blue' }}
          revenueGrowth={{ value: '735.2k', percentageChange: '▼18.64%', changeColor: 'red' }}
        />
      </Box>
    </Box>
  );
};

export default AdminTab;
