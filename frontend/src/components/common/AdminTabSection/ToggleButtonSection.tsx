import * as React from 'react';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';

interface ToggleButtonSectionProps {
  alignment: string;
  onAlignmentChange: (event: React.MouseEvent<HTMLElement>, newAlignment: string) => void;
}

const ToggleButtonSection: React.FC<ToggleButtonSectionProps> = ({ alignment, onAlignmentChange }) => {
  return (
    <ToggleButtonGroup
      color="primary"
      value={alignment}
      exclusive
      onChange={onAlignmentChange}
      aria-label="Engagement options"
    >
      <ToggleButton value="Customer Activity" sx={{
        boxShadow: alignment === 'Customer Activity' ? '0px 4px 10px rgba(0, 0, 0, 0.3)' : 'none',
        fontWeight: alignment === 'Customer Activity' ? 'bold' : 'normal',
      }}>Customer Activity</ToggleButton>
      <ToggleButton value="Customer Tenure" sx={{
        boxShadow: alignment === 'Customer Tenure' ? '0px 4px 10px rgba(0, 0, 0, 0.3)' : 'none',
        fontWeight: alignment === 'Customer Tenure' ? 'bold' : 'normal',
      }}>Customer Tenure</ToggleButton>
    </ToggleButtonGroup>
  );
}

export default ToggleButtonSection;
