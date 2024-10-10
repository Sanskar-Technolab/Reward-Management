import React from 'react';
import SelectInput from './SelectInputBar';

const programOptions = [
  { value: 'program1', label: 'Program 1' },
  { value: 'program2', label: 'Program 2' },
];

const tierOptions = [
  { value: 'tier1', label: 'Tier 1' },
  { value: 'tier2', label: 'Tier 2' },
  // Add more options as needed
];

const nonQualifyCurrencyOptions = [
  { value: 'currency1', label: 'Currency 1' },
  { value: 'currency2', label: 'Currency 2' },
];

const durationOptions = [
  { value: '1month', label: '1 Month' },
  { value: '6months', label: '6 Months' },
];

const formFields = [
  { label: 'Program', name: 'program', id: 'program', options: programOptions, placeholder: 'Select Program' },
  { label: 'Tier Group', name: 'tier-group', id: 'tier-group', options: tierOptions, placeholder: 'Select Tier Group' },
  // { label: 'Non-Qualifying Currency', name: 'non-qualifying-currency', id: 'non-qualifying-currency', options: nonQualifyCurrencyOptions, placeholder: 'Select Currency' },
  { label: 'Duration', name: 'duration', id: 'duration', options: durationOptions, placeholder: 'Select Duration' }
];

const SelectBar: React.FC = () => {
  return (
    <div className='grid md:grid-cols-3 gap-3'>
      {formFields.map(field => (
        <SelectInput
          key={field.id}
          label={field.label}
          name={field.name}
          id={field.id}
          options={field.options}
          placeholder={field.placeholder}
        />
      ))}
    </div>
  );
};

export default SelectBar;
