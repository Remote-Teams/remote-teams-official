import React from "react";

let allMonthData = [
  { name: "Jan", monthCount: 0 },
  { name: "Feb", monthCount: 1 },
  { name: "Mar", monthCount: 2 },
  { name: "Apr", monthCount: 3 },
  { name: "May", monthCount: 4 },
  { name: "June", monthCount: 5 },
  { name: "July", monthCount: 6 },
  { name: "Aug", monthCount: 7 },
  { name: "Sep", monthCount: 8 },
  { name: "Oct", monthCount: 9 },
  { name: "Nov", monthCount: 10 },
  { name: "Dec", monthCount: 11 },
];
export default function MonthCard({ activeMonth, onClick }) {
  return (
    <div className="month_box">
      {allMonthData.map((month, index) => {
        return (
          <div
            onClick={onClick(month)}
            key={index}
            className={
              activeMonth === month.monthCount
                ? "month_div active_month"
                : "month_div"
            }
          >
            {month.name}
          </div>
        );
      })}
    </div>
  );
}
