import React, { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { MobileDatePicker } from '@mui/x-date-pickers/MobileDatePicker';
import "./DateRangePicker.scss"

function DateRangePicker({selectedDate,setSelectedDate,lable}) {
  // const [selectedDate, setSelectedDate] = useState(dayjs());

  

  const handleDateChange = (newDate) => {
    setSelectedDate(dayjs(newDate).startOf('day'));
  };

  return (
    <div className='date-pocker-reusable-component'>
        <label className='datepickerlable'>{lable}</label>
      <LocalizationProvider dateAdapter={AdapterDayjs} >
        <MobileDatePicker 
        className='picker'
        
          value={selectedDate} 
          onChange={handleDateChange} 
          slotProps={{
            textField: {
              sx: {
                
                '& .MuiOutlinedInput-root': {
                  height: '45px',
                  backgroundColor: '#f3f6f9',
                  borderRadius: '10px',
                  '& .MuiOutlinedInput-notchedOutline': {
                    border: 'none',
                    borderRadius: '10px',
                  },
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    border: 'none',
                    borderRadius: '10px',
                  },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    border: 'none',
                    borderRadius: '10px',
                  },
                },
              },
            }
          }}
         
        />
      </LocalizationProvider>
    </div>
  );
}

export default DateRangePicker;
