import React, { useContext, useState, useEffect } from "react";
import GlobalContext from "../context/GlobalContext";

export default function EventModal() {
  const {
    setShowEventModal,
    daySelected,
    dispatchCalEvent,
    selectedEvent,
  } = useContext(GlobalContext);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("10:00");
  const [timeValidationMsg, setTimeValidationMsg] = useState("");

  const [isRecurring, setIsRecurring] = useState(false);


  const [selectedDays, setSelectedDays] = useState({
    Sunday: false,
    Monday: false,
    Tuesday: false,
    Wednesday: false,
    Thursday: false,
    Friday: false,
    Saturday: false,
  });

  function formatTo24Hour(time) {
    const [hour, minute, meridian] = time.split(/[:\s]/);
    let h = parseInt(hour, 10);
    if (meridian === "PM" && h < 12) {
      h += 12;
    }
    if (meridian === "AM" && h === 12) {
      h -= 12;
    }
    return `${String(h).padStart(2, "0")}:${minute}`;
  }

  useEffect(() => {
    if (selectedEvent) {
      setTitle(selectedEvent.title);
      setDescription(selectedEvent.description);
      setStartTime(formatTo24Hour(selectedEvent.startTime));
      setEndTime(formatTo24Hour(selectedEvent.endTime));
      setIsRecurring(selectedEvent.isRecurring || false);
      setSelectedDays(selectedEvent.selectedDays || {
        Sunday: false,
        Monday: false,
        Tuesday: false,
        Wednesday: false,
        Thursday: false,
        Friday: false,
        Saturday: false,
      });

    } else {
      setTitle("");
      setDescription("");
      setStartTime("09:00");
      setEndTime("10:00");
      setIsRecurring(false);
      setSelectedDays({
        Sunday: false,
        Monday: false,
        Tuesday: false,
        Wednesday: false,
        Thursday: false,
        Friday: false,
        Saturday: false,
      });
    }
  }, [selectedEvent]);



  function getShortForm(day) {
    switch (day) {
      case 'Sunday': return 'S';
      case 'Monday': return 'M';
      case 'Tuesday': return 'T';
      case 'Wednesday': return 'W';
      case 'Thursday': return 'T';
      case 'Friday': return 'F';
      case 'Saturday': return 'S';
      default: return day;
    }
  }


  function handleDayToggle(day) {
    setSelectedDays(prev => ({ ...prev, [day]: !prev[day] }));
  }

  function formatTo12Hour(time) {
    const [hour, minute] = time.split(':');
    const h = +hour;
    return {
      hour: h % 12 || 12,
      minute,
      meridian: h < 12 || h === 24 ? 'AM' : 'PM',
    };
  }

  function formatToTimeString(hour, minute, meridian) {
    return `${hour}:${minute} ${meridian}`;
  }


  function handleSubmit(e) {
    e.preventDefault();

    if (startTime >= endTime) {
      setTimeValidationMsg("Start time should be earlier than end time.");
      return;
    }

    if (isRecurring && !Object.values(selectedDays).some(val => val)) {
      setTimeValidationMsg("Please select at least one day for recurring events.");
      return;
    }

    const { hour: startHour, minute: startMinute, meridian: startMeridian } = formatTo12Hour(startTime);
    const formattedStartTime = formatToTimeString(startHour, startMinute, startMeridian);

    const { hour: endHour, minute: endMinute, meridian: endMeridian } = formatTo12Hour(endTime);
    const formattedEndTime = formatToTimeString(endHour, endMinute, endMeridian);

    const calendarEvent = {
      title,
      description,
      startTime: formattedStartTime,
      endTime: formattedEndTime,

      day: daySelected.valueOf(),
      id: selectedEvent ? selectedEvent.id : Date.now(),
      isRecurring,
      selectedDays,
    };

    console.log(calendarEvent);
    if (selectedEvent) {
      dispatchCalEvent({ type: "update", payload: calendarEvent });
    } else {
      dispatchCalEvent({ type: "push", payload: calendarEvent });
    }

    setShowEventModal(false);
  }



  return (
    <div className="h-screen w-full fixed left-0 top-0 flex justify-center items-center ml-80 mt-14" style={{ zIndex: 9999 }}>
      <form className="bg-white rounded-lg shadow-2xl w-1/3 p-6">
        <header className="flex justify-between items-center mb-5">

          <div className="space-x-4">

            {selectedEvent && (
              <span
                onClick={() => {
                  dispatchCalEvent({ type: "delete", payload: selectedEvent });
                  setShowEventModal(false);
                }}
                className="material-icons-outlined text-gray-400 hover:text-red-500 cursor-pointer"
              >delete</span>
            )}

          </div>

        </header>


        <h2 className="text-2xl text-black font-bold mb-5" >Book Slot(s)</h2>

        <div className="p-3">
          <div className="grid grid-cols-1/5 items-end gap-y-7">

            <div className="flex items-center gap-x-4 mt-4">
              <div>
                <label className="text-sm">Slot Validity From</label>
                <input
                  type="text"
                  value={daySelected.format("DD-MMM-YYYY")}
                  readOnly
                  className="border text-sm px-2 py-1 border-gray-200 rounded mr-3"
                />
              </div>
              <div>
                <label className="text-sm">To</label>
                <input
                  type="text"
                  value={daySelected.format("DD-MMM-YYYY")}
                  readOnly
                  className="border text-sm px-2 py-1 border-gray-200 rounded"
                />
              </div>
            </div>

            <div></div>
            <input
              type="text"
              name="title"
              placeholder="Add Meeting Title"
              value={title}
              required
              className="pt-3 border-0 text-gray-600 text-xl font-semibold pb-2 w-full border-b-2 border-gray-200 focus:outline-none focus:ring-0 focus:border-blue-500"
              onChange={(e) => setTitle(e.target.value)}
            />
            <span className="material-icons-outlined text-gray-400">segment</span>
            <input
              type="text"
              name="description"
              placeholder="Add a description"
              value={description}
              required
              className="pt-3 border-0 text-gray-600 pb-2 w-full border-b-2 border-gray-200 focus:outline-none focus:ring-0 focus:border-blue-500"
              onChange={(e) => setDescription(e.target.value)}
            />

          </div>

        </div>

        <div className="flex items-center gap-x-4">
          <span className="text-sm">Start Time</span>
          <input
            type="time"
            value={startTime}
            className="border text-sm px-2 py-1 border-gray-200 rounded mr-3"
            onChange={(e) => setStartTime(e.target.value)}
          />
          <span className="text-sm">End Time</span>
          <input
            type="time"
            value={endTime}
            className="border text-sm px-2 py-1 border-gray-200 rounded"
            onChange={(e) => setEndTime(e.target.value)}
          />
        </div>

        <div className="mt-10 cursor-pointer">
          {/* Checkbox for Recurring */}
          <div className="flex items-center mb-4">
            <input
              type="checkbox"
              checked={isRecurring}
              onChange={() => setIsRecurring(prev => !prev)}
            />
            <span className="ml-2">Recurring</span>
          </div>

          <label className="text-gray-600 mb-2"><b>Repeat Every</b> (optional)</label>
          <div className="flex border-2 border-grey" style={{ borderRadius: 50, width: "51.6%" }}>
            {Object.keys(selectedDays).map((day, index, array) => (
              <div
                key={day}
                className={`w-8 h-8 cursor-pointer ${index !== array.length - 1 ? 'border-r-2' : ''} border-grey
                ${selectedDays[day] ? 'bg-blue-200 text-dark' : 'text-dark'}
                ${(selectedDays['Sunday'] && index === 0) ? 'rounded-tl-full rounded-bl-full' : ''}
                ${(selectedDays['Saturday'] && index === array.length - 1) ? 'rounded-tr-full rounded-br-full' : ''}`}>
                <label>
                  <input
                    type="checkbox"
                    checked={selectedDays[day]}
                    onChange={() => handleDayToggle(day)}
                    className="hidden"
                  />
                  <span className="block text-center cursor-pointer">{getShortForm(day)}</span>
                </label>
              </div>
            ))}
          </div>
        </div>

        {timeValidationMsg && <p className="text-red-600 mt-2">{timeValidationMsg}</p>}

        <footer className="flex justify-between items-center border-t p-4 mt-5">
          <div>
            <button
              type="submit"
              onClick={handleSubmit}

              style={{ backgroundColor: "#06041f" }}
              className="text-white border p-2 rounded-full flex items-center shadow-md hover:shadow-2xl"
            >
              <span className="pl-3 pr-7"> Book slot</span>
            </button>
          </div>
          <button
            onClick={() => setShowEventModal(false)}
            className="px-6 py-2 rounded text-gray-600 bg-white rounded hover:bg-gray-200 focus:outline-none mr-44 rounded-full"
          >
            Cancel
          </button>
        </footer>

      </form>
    </div>
  );
}


