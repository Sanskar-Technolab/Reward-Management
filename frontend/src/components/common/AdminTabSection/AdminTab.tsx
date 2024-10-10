import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import AcquisitionSection from './AcquisitionSection';
import EngagementSection from './EngagementSection';
import SelectInputBar from '../../../components/common/AdminSelection/SelectInputBar';

const AdminTab: React.FC = () => {
  const programOptions = [
    { value: 'program1', label: 'Program 1' },
    { value: 'program2', label: 'Program 2' },
  ];

  const tierOptions = [
    { value: 'tier0', label: 'Select' },
    { value: 'tier1', label: 'Call Center' },
    { value: 'tier2', label: 'Email' },
    { value: 'tier3', label: 'Social' },
    { value: 'tier4', label: 'Web' },
  ];



  const formFields = [
    { label: 'Program', name: 'program', id: 'program', options: programOptions, placeholder: 'Select Program' },
    { label: 'Channel Group', name: 'tier', id: 'tier', options: tierOptions, placeholder: 'Select Channel Group' },
  ];

  const [value, setValue] = useState('1');
  const [formData, setFormData] = useState({ program: 'program1', tier: 'tier0' });

  const handleChange = (_event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  const handleSelectChange = (selectedOption: { value: string; label: string } | null, fieldName: string) => {
    setFormData((prevState) => ({
      ...prevState,
      [fieldName]: selectedOption ? selectedOption.value : '',
    }));
  };

  return (
    <Box sx={{ width: '100%', typography: 'body1', marginTop: '20px' }}>
      <div className="grid md:grid-cols-2 gap-3 pb-5">
        {formFields.map((field) => (
          <SelectInputBar
            key={field.id}
            label={field.label}
            name={field.name}
            id={field.id}
            options={field.options}
            placeholder={field.placeholder}
            onChange={(selectedOption) => handleSelectChange(selectedOption, field.name)}
          />
        ))}
      </div>

      <TabContext value={value}>
        <Box sx={{ borderColor: 'divider', backgroundColor: 'white' }}>
          <TabList onChange={handleChange} aria-label="Tab View">
            <Tab label="Acquisition" value="1" />
            <Tab label="Engagement" value="2" />
          </TabList>
        </Box>
        <div className="p-2 bg-white">
          <TabPanel value="1" className="!p-0">
            <AcquisitionSection selectedProgram={formData.program} selectedTier={formData.tier} />
          </TabPanel>
          <TabPanel value="2" className="!p-4">
            <EngagementSection alignment="Customer Activity" selectedProgram={formData.program} selectedTier={formData.tier} />
          </TabPanel>
        </div>
      </TabContext>
    </Box>
  );
};

export default AdminTab;
