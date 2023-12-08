import React from "react";

const GlobalContext = React.createContext({
  monthIndex: 0,
  setMonthIndex: (index) => { },
  daySelected: null,
  setDaySelected: (day) => { },
  showEventModal: false,
  setShowEventModal: () => { },
  dispatchCalEvent: ({ type, payload }) => { },
  savedEvents: [],
  selectedEvent: null,
  setSelectedEvent: () => { },
  filteredEvents: [],
  currentDay: null,
  setCurrentDay: (day) => { },
  currentDayOfWeek: null,
  setCurrentDayOfWeek: (day) => { }
});

export default GlobalContext;
