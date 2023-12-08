import dayjs from "dayjs";
import React, { useContext } from "react";
import GlobalContext from "../context/GlobalContext";

export default function CalendarHeader() {
  const { monthIndex, setMonthIndex } = useContext(GlobalContext);

  function handlePrevMonth() {
    setMonthIndex(monthIndex - 1);
  }
  function handleNextMonth() {
    setMonthIndex(monthIndex + 1);
  }

  return (
    <header className="px-4 py-2 w-6/10">
      <h1 className="mr-10 text-xl font-bold">Book Slot(s)</h1>

      <div className="flex items-center mt-2 w-1/5 justify-between">
        <button onClick={handlePrevMonth}>
          <span className="material-icons-outlined cursor-pointer text-gray-800 mx-2 font-bold">
            chevron_left
          </span>
        </button>

        <h2 className="text-xl text-gray-500 font-semibold">
          {dayjs(new Date(dayjs().year(), monthIndex)).format("MMMM YYYY")}
        </h2>

        <button onClick={handleNextMonth}>
          <span className="material-icons-outlined cursor-pointer text-gray-800 mx-2 font-bold">
            chevron_right
          </span>
        </button>
      </div>
    </header>
  );
}
