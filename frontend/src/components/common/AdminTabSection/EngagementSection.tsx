import React, { useState } from 'react';
import ToggleButtonSection from './ToggleButtonSection';
import EngagementChartSection from './EngagementChartSection';

interface EngagementSectionProps {
  selectedProgram: string;
  selectedTier: string; // Add this line
}

const EngagementSection: React.FC<EngagementSectionProps> = ({ selectedProgram, selectedTier }) => {
  const [alignment, setAlignment] = useState('Customer Activity');

  const handleAlignmentChange = (_event: React.MouseEvent<HTMLElement>, newAlignment: string) => {
    setAlignment(newAlignment);
  };

  return (
    <div>
      <ToggleButtonSection
        alignment={alignment}
        onAlignmentChange={handleAlignmentChange}
      />
      <EngagementChartSection 
        alignment={alignment} 
        selectedProgram={selectedProgram} 
        selectedTier={selectedTier} // Pass selectedTier here
      />
    </div>
  );
};

export default EngagementSection;
