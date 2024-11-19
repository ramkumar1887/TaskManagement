import React from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid'; 
import interactionPlugin from '@fullcalendar/interaction';

const Calendar = () => {

  const handleDateClick = (info) => {
    alert(`Clicked date: ${info.dateStr}`);
  };

  const events = [
    { title: 'Task 1', date: '2024-11-20' },
    { title: 'Task 2', date: '2024-11-22' },
  ];

  return (
    <div className='page-container'>
      <h1 className='page-title'>Calendar</h1>
      <p className='page-description'>A calendar view of your schedule</p>
      <div 
      className='calendar'>
      <FullCalendar
      themeSystem='standard'
      plugins={[dayGridPlugin, interactionPlugin]}
      initialView="dayGridMonth"
      events={events} // Assign your events here
      dateClick={handleDateClick} // Handle date clicks
    />
      </div>
\

    </div>
  )
}

export default Calendar