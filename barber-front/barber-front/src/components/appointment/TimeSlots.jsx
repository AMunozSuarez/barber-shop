import React from 'react';

const TimeSlots = ({ slots, onSelect }) => {
  return (
    <div className="time-slots">
      <h2>Select a Time Slot</h2>
      <ul>
        {slots.map((slot, index) => (
          <li key={index}>
            <button onClick={() => onSelect(slot)}>{slot}</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TimeSlots;