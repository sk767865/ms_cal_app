import dayjs from "dayjs";
import React, { useContext, useState, useEffect } from "react";
import GlobalContext from "../context/GlobalContext";

function to24HourFormat(timeString) {
  const [hour, minute] = timeString.split(":").map(Number);
  const isPM = timeString.toLowerCase().includes("pm");

  if (isPM && hour !== 12) {
    return `${hour + 12}:${minute}`;
  } else if (!isPM && hour === 12) {
    return `00:${minute}`;
  }
  return timeString;
}

function computeMarginTop(startTime, overlapIndex = 0) {
  const [hour] = to24HourFormat(startTime).split(":").map(Number);
  const baseHour = 7;

  if (hour < baseHour || hour > 23) {
    return 0;
  }

  const hourDifference = hour - baseHour;
  return hourDifference * 40 + overlapIndex * 10;
}

function computeWidth(dayEvents, evt) {
  const overlappingEvents = dayEvents.filter(e => to24HourFormat(e.startTime) === to24HourFormat(evt.startTime)).length;
  return `${100 / overlappingEvents}%`;
}

function computeLeft(dayEvents, evt, index) {
  const previousSameTimeEvents = dayEvents.slice(0, index).filter(e => to24HourFormat(e.startTime) === to24HourFormat(evt.startTime)).length;
  return `${(100 / dayEvents.filter(e => to24HourFormat(e.startTime) === to24HourFormat(evt.startTime)).length) * previousSameTimeEvents}%`;
}

export default function Day({ day, events }) {
  const [dayEvents, setDayEvents] = useState([]);
  const {
    setDaySelected,
    setShowEventModal,
    filteredEvents,
    setSelectedEvent,
  } = useContext(GlobalContext);

  const isRecurringOnDay = (event, targetDay) => {
    const dayName = targetDay.format('dddd');
    return event.isRecurring && event.selectedDays[dayName] === true;
  };

  const handleDayClick = () => {
    setDaySelected(day);
    setShowEventModal(true);
  };

  useEffect(() => {
    const singleEventsForTheDay = filteredEvents.filter(
      (evt) => dayjs(evt.day).format("DD-MM-YY") === day.format("DD-MM-YY")
    );

    const recurringEventsForTheDay = events.filter(evt => isRecurringOnDay(evt, day));

    const combinedEvents = [...singleEventsForTheDay, ...recurringEventsForTheDay];

    const sortedEvents = combinedEvents.sort((a, b) =>
      to24HourFormat(a.startTime).localeCompare(to24HourFormat(b.startTime))
    );

    setDayEvents(sortedEvents);
  }, [filteredEvents, day, events]);



  return (
    <div className="border border-gray-200 flex flex-col" onClick={handleDayClick}>
      <header className="flex flex-col items-center">
        <p className="text-sm mt-1">
          {day.format("ddd").toUpperCase()}
        </p>
        <p>
          {day.format("DD")}
        </p>
      </header>
      <div className="flex-1 cursor-pointer relative">
        {dayEvents.map((evt, index) => {
          return (
            <div
              key={evt.id || evt.title}
              onClick={() => setSelectedEvent(evt)}
              className={`event-card bg-green-200 absolute`}
              style={{
                marginTop: `${computeMarginTop(evt.startTime)}px`,
                width: computeWidth(dayEvents, evt),
                left: computeLeft(dayEvents, evt, index)
              }}
            >
              <div className="event-time">
                <span>{evt.startTime}</span>
              </div>
              <h4 className="booked-slot-heading">Booked Slot</h4>
            </div>
          );
        })}
      </div>
    </div>
  );
}
