import React from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';

const CalendarData = ({ initial, allPresenceData }) => {
    console.log('initial :', initial);

    const handleDateClick = (arg) => {
        alert(arg.dateStr);
    };

    // Helper function to format date to YYYY-MM-DD
    const formatDateToYMD = (dateString) => {
        const [day, month, year] = dateString.split('-');
        return `${year}-${month}-${day}`;
    };

    const formattedInitialDate = formatDateToYMD(initial);

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
            events={events}
            dateClick={handleDateClick}
            locales={'fr/FR'}
            timeZone='local'
        />
    );
};

export default CalendarData;
