import React, { useContext } from "react";
import dayjs from "dayjs";
import GlobalContext from "../context/GlobalContext";

export default function Labels() {
  const { savedEvents } = useContext(GlobalContext);

  console.log("Events from context:", savedEvents);

  return (
    <React.Fragment>
      <p className="text-dark font-bold mt-10">My Booked Slot(s)</p>

      <div className="events-list">
        {savedEvents.map((event, index) => (
          <div key={index} className="event-item">
            <h3 className="font-bold text-lg"> Title :{event.title}</h3>
            <p>Date: {dayjs(event.day).format("DD-MM-YYYY")}</p>
            <p>Start Time: {event.startTime}</p>
            <p>End Date: {event.endTime}</p>
            <p>Description: {event.description}</p>
          </div>
        ))}
      </div>

      <style jsx>{`
        .events-list {
          max-height: 800px;
          overflow-y: auto;
          border: 1px solid #e2e8f0;
          padding: 1rem;
          border-radius: 8px;
        
        }

        .event-item {
          padding: 1rem;
          border-radius: 6px;
          background-color: #edf2f7;
          margin-bottom: 1rem;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
          transition: transform 0.2s;

          &:hover {
            transform: translateY(-3px);
          }
        }
      `}</style>
    </React.Fragment>
  );
}
