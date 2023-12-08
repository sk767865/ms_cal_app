import React, { useState, useEffect, useContext } from "react";
import Day from "./Day";
import GlobalContext from '../context/GlobalContext';

export default function Month({ month }) {
  const [currentWeekStartIdx, setCurrentWeekStartIdx] = useState(0);
  const { currentDay } = useContext(GlobalContext);


  const { savedEvents } = useContext(GlobalContext);

  useEffect(() => {
    const targetWeekIndex = month.findIndex(week => {
      return week.some(day => day.isSame(currentDay, 'day'));
    });

    if (targetWeekIndex !== -1) {
      setCurrentWeekStartIdx(targetWeekIndex * 7);
    }
  }, [month, currentDay]);

  const handlePrevWeek = () => {
    if (currentWeekStartIdx - 7 >= 0) {
      setCurrentWeekStartIdx(currentWeekStartIdx - 7);
    }
  };

  const handleNextWeek = () => {
    if (currentWeekStartIdx + 7 <= month.flat().length - 7) {
      setCurrentWeekStartIdx(currentWeekStartIdx + 7);
    }
  };

  const currentWeek = month.flat().slice(currentWeekStartIdx, currentWeekStartIdx + 7);
  const weekStart = currentWeek[0];
  const weekEnd = currentWeek[currentWeek.length - 1];
  const formattedWeek = `${weekStart.format('D MMM')} - ${weekEnd.format('D MMM YYYY')}`;

  const timeSlots = Array.from({ length: 17 }, (_, i) => {
    if (i < 5) {
      return `${i + 7} AM`;
    } else if (i === 5) {
      return '12 PM';
    } else {
      return `${i - 5} PM`;
    }
  });

  const timeSlots2 = [
    `EST\nGMT-5`,
    ...Array.from({ length: 17 }, (_, i) => {
      if (i < 5) {
        return `${i + 7} AM`;
      } else if (i === 5) {
        return '12 PM';
      } else {
        return `${i - 5} PM`;
      }
    }),
  ];


  const { setShowEventModal } = useContext(GlobalContext);

  return (
    <div className="flex-1 h-screen flex flex-col ml-[-80px]">
      <div className="w-full flex justify-between items-center mb-4">
        {/* Date Navigation */}

        <div className="date-navigation w-1/4 flex justify-start items-center nav-button" style={{ marginLeft: '100px' }}>

          <button className="nav-button font-bold" onClick={handlePrevWeek}>&lt;</button>

          <span className="current-week nav-button mx-4 text-gray-500 extra-small-text">{formattedWeek}</span>


          <button className="nav-button font-bold" onClick={handleNextWeek}>&gt;</button>
        </div>
        {/* Book Slot Button above the last day */}
        <div className="border-b border-r last:border-r-0 flex justify-end items-start p-2 mr-20">

          <button
            onClick={() => setShowEventModal(true)}
            style={{ backgroundColor: "#06041f" }}
            className="text-white border p-2 rounded-full flex items-center shadow-md hover:shadow-2xl"
          >

            <span className="pl-3 pr-7"> Book slot</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-9 flex-grow overflow-y-auto">
        <div className="border-b mt-12 border-r text-gray-500">
          {timeSlots.map((time, timeIdx) => (
            <div key={timeIdx} className="last:border-b-0 p-2 text-right">{time}</div>
          ))}
        </div>

        {currentWeek.map((day, idx) => (
          <div
            className={`border-b border-r last:border-r-0 cursor-pointer hover:bg-gray-50 ${day.isSame(currentDay, 'day') ? 'bg-blue-100' : idx === 0 || idx === 6 ? 'bg-gray-100' : 'bg-white'}`}
            key={idx}
          >
            <Day day={day} events={savedEvents} />
          </div>
        ))}

        <div className="border-b -mt-2 last:border-r-0 border-r text-gray-500">
          {timeSlots2.map((time, timeIdx) => (
            <div key={timeIdx} className="last:border-b-0 p-2">
              {time.split('\n').map((line, lineIdx) => (
                <React.Fragment key={lineIdx}>
                  {line}
                  {lineIdx !== time.split('\n').length - 1 && <br />}
                </React.Fragment>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div >
  );
}







