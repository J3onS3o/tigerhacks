
import React, { useState, useMemo } from 'react';
import { ArrowLeftIcon, ArrowRightIcon, XMarkIcon } from './icons/Icons';
import './Calendar.css';

interface CalendarProps {
  departureDate: Date | null;
  returnDate: Date | null;
  onDateSelect: (date: Date) => void;
  onClose: () => void;
  tripType: 'roundtrip' | 'oneway';
}

const Calendar: React.FC<CalendarProps> = ({
  departureDate,
  returnDate,
  onDateSelect,
  onClose,
  tripType
}) => {
  const [viewDate, setViewDate] = useState(departureDate || new Date());

  const firstMonth = useMemo(() => {
    return {
      year: viewDate.getFullYear(),
      month: viewDate.getMonth(),
    };
  }, [viewDate]);

  const secondMonth = useMemo(() => {
    const nextMonthDate = new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1);
    return {
      year: nextMonthDate.getFullYear(),
      month: nextMonthDate.getMonth(),
    };
  }, [viewDate]);

  const goToPreviousMonth = () => {
    setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1));
  };

  const goToNextMonth = () => {
    setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1));
  };

  const isSameDay = (d1: Date, d2: Date | null) => {
    if (!d2) return false;
    return d1.getFullYear() === d2.getFullYear() &&
           d1.getMonth() === d2.getMonth() &&
           d1.getDate() === d2.getDate();
  };

  const isInRange = (date: Date) => {
    if (tripType === 'oneway' || !departureDate || !returnDate) return false;
    return date > departureDate && date < returnDate;
  };
  
  const renderMonth = (year: number, month: number) => {
    const monthName = new Date(year, month).toLocaleString('default', { month: 'long', year: 'numeric' });
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDayOfMonth = new Date(year, month, 1).getDay();
    const today = new Date();
    today.setHours(0,0,0,0);

    const days = [];
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(<div key={`empty-start-${i}`} className="day empty"></div>);
    }

    // Add day cells for the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const isDisabled = date < today;
      
      const isDeparture = isSameDay(date, departureDate);
      const isReturn = isSameDay(date, returnDate);
      const isRange = isInRange(date);
      const isRangeStart = isDeparture && returnDate;
      const isRangeEnd = isReturn;

      const classNames = [
        'day',
        isDisabled ? 'disabled' : '',
        isDeparture ? 'selected departure' : '',
        isReturn ? 'selected return' : '',
        isRange ? 'in-range' : '',
        isRangeStart ? 'range-start' : '',
        isRangeEnd ? 'range-end' : ''
      ].join(' ');

      days.push(
        <button
          key={day}
          className={classNames}
          onClick={() => !isDisabled && onDateSelect(date)}
          disabled={isDisabled}
        >
          {day}
        </button>
      );
    }
    
    return (
      <div className="month-container">
        <h3 className="month-name">{monthName}</h3>
        <div className="day-names">
          {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(d => <div key={d}>{d}</div>)}
        </div>
        <div className="days-grid">{days}</div>
      </div>
    );
  };

  return (
    <div className="calendar-modal-overlay">
      <div className="calendar-modal">
        <div className="calendar-header">
          <button onClick={goToPreviousMonth} className="nav-button" aria-label="Previous month"><ArrowLeftIcon/></button>
          <h2>Select Dates</h2>
          <button onClick={goToNextMonth} className="nav-button" aria-label="Next month"><ArrowRightIcon/></button>
          <button onClick={onClose} className="close-button" aria-label="Close calendar"><XMarkIcon/></button>
        </div>
        <div className="calendar-body">
          {renderMonth(firstMonth.year, firstMonth.month)}
          {renderMonth(secondMonth.year, secondMonth.month)}
        </div>
        <div className="calendar-footer">
            <button onClick={onClose} className="done-button">Done</button>
        </div>
      </div>
    </div>
  );
};

export default Calendar;