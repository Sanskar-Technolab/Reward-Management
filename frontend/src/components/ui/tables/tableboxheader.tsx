// components/common/BoxHeader.tsx

import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { Notyf } from 'notyf';
import 'notyf/notyf.min.css'; 

interface BoxHeaderProps {
    title: string;
    onSearch: (value: string) => void;
    onAddButtonClick: () => void;
    buttonText?: string;
    showButton?: boolean;
    showToDate?:boolean;
    showFromDate?:boolean;
    icon?: string;
    onDateFilter?: (from: Date | null, to: Date | null) => void; 
}

const BoxHeader: React.FC<BoxHeaderProps> = ({ title, onSearch, onAddButtonClick, icon, buttonText = "Add Product", showButton = true,onDateFilter,showFromDate=false, showToDate=false }) => {
    const [fromDate, setFromDate] = useState<Date | null>(null);
    const [toDate, setToDate] = useState<Date | null>(null);
    const [searchValue, setSearchValue] = useState('');
  


    const notyf = new Notyf({
        position: {
            x: 'right',
            y: 'top',
        },
        duration: 3000, 
    });

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setSearchValue(value);
        onSearch(value);
    };

    const handleFromDateChange = (date: Date | null) => {
        if (date && toDate && date > toDate) {
            notyf.error("From Date cannot be greater than To Date");
            setFromDate(null);
        } else {
            setFromDate(date);
            if (onDateFilter) onDateFilter(date, toDate);
        }
    };
    const handleToDateChange = (date: Date | null) => {
        if (date && fromDate && date < fromDate) {
            notyf.error("To Date cannot be less than From Date");
            setToDate(null);
        } else {
            setToDate(date);
            if (onDateFilter) onDateFilter(fromDate, date);
        }
    };


    return (
        <div className="box-header flex justify-between items-center p-4 border-b">
            <div className="box-title text-[.9375rem] font-bold text-defaulttextcolor">
                {title}
            </div>
            <div className="flex me-3 my-1 h-[36px]">
            {showFromDate && (
                <div className='flex '>
                    <DatePicker
                        selected={fromDate}
                        onChange={handleFromDateChange}
                        dateFormat="dd-MM-yyyy"
                        placeholderText="From Date"
                        className="mb-[0.25rem] text-[0.8rem] ti-form-control form-control-sm rounded-sm mr-2 p-0 py-[3px] px-2"
                    />
              
                </div>
                      )}
                {showToDate && (
                <div className='flex '>
                    <DatePicker
                        selected={toDate}
                        onChange={handleToDateChange}
                        dateFormat="dd-MM-yyyy"
                        placeholderText="To Date"
                        className="mb-[0.25rem] text-[0.8rem] ti-form-control form-control-sm rounded-sm mr-2 p-0 py-[3px] px-2"
                    />
                </div>
                )}

                <div className='flex '>
                    <input
                        className="mb-[0.25rem] text-[0.8rem] ti-form-control form-control-sm rounded-sm"
                        type="text"
                        placeholder="Search Here"
                        value={searchValue}
                        onChange={handleSearchChange}
                        aria-label=".form-control-sm example"
                    />
                </div>
                {showButton && (
                    <div className='flex ms-2'>
                        <button
                            type="button"
                            className="ti-btn !py-1 !px-2 text-xs !text-white !font-medium bg-[var(--primaries)]"
                            onClick={onAddButtonClick}
                        >
                            {icon && <i className={`${icon} font-semibold align-middle me-1`}></i>}
                            {buttonText}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default BoxHeader;
