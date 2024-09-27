import React, { useEffect, useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';

const CalendarData = ({ initial, allPresenceData, currentDate }) => {
    console.log('initial :', initial);
    const [formattedCurrentDate, setFormattedCurrentDate] = useState(null)
    const handleDateClick = (arg) => {
        alert(arg.dateStr);
    };

    // Helper function to format date to YYYY-MM-DD
    const formatDateToYMD = (dateString) => {
        const [day, month, year] = dateString.split('-');
        return `${year}-${month}-${day}`;
    };
    const formatCurrentDate = (dateObj) => {
        const year = dateObj.getFullYear();
        const month = (`0${dateObj.getMonth() + 1}`).slice(-2); // Months are 0-based, so we add 1 and pad with 0
        const day = (`0${dateObj.getDate()}`).slice(-2); // Pad day with 0 if needed
        return `${year}-${month}-${day}`;
    };
    useEffect(()=>{
        setFormattedCurrentDate(formatCurrentDate(new Date(currentDate)));
    },[currentDate])

    // Function to convert Date object to YYYY-MM-DD format
    

     // Format the currentDate to YYYY-MM-DD

    // Extract events from all presence data
    const extractEventsFromAllData = (allData) => {
        const events = [];

        allData.forEach((dataObj) => {
            const presenceData = dataObj.presence_data;

            // Iterate over each day's presence data in the month
            Object.keys(presenceData).forEach((date) => {
                const data = presenceData[date];
                const formattedDate = formatDateToYMD(date);

                // Determine title and status for the event
                let title = 'Present';
                let eventClass = ''; // Default to success (green) for present

                if (data.raison) {
                    title = data.raison;
                    eventClass = 'danger'; // Use danger (red) for absent
                } else if (data.status === 0) {
                    title = 'Absent';
                    eventClass = 'danger'; // Use danger (red) for absent
                }

                // Push the event object to the events array
                events.push({
                    title: title,
                    date: formattedDate,
                    classNames: [eventClass], // Add class for event styling
                });
            });
        });

        return events;
    };

    const events = extractEventsFromAllData(allPresenceData);

    return (
        <FullCalendar
            plugins={[dayGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            initialDate={formattedCurrentDate}
            events={events}
            dateClick={handleDateClick}
            locales={'fr/FR'}
            timeZone='local'
        />
    );
};

export default CalendarData;
