import React from "react";

const dummyData = [1, 2, 3, 4, 5, 6, 7];

export default function TimesheetMonthTableTotalHoursPerDay({
  dateArray,
  calculateTotalActualHourPerDay,
  calculateTotalPlannedHourPerDay,
}) {
  return (
    <div className="timesheet-per-day--div">
      <div className="finances-table-tbody finances-table-tbody--timesheetPerDay">
        <table className="finances-table finances-table--timesheetPerDay">
          <tbody>
            {/* Total Hours Row */}
            <tr className="timesheet-month-view-per-day-row1">
              <td>
                <span className="font-18-semiBold timesheet-month-view-per-day-row1__text">
                  total HOURS worked per day
                </span>
              </td>

              {dateArray.map((date, index) => {
                return (
                  <td key={index}>
                    <span className="timesheet-month-view-per-day-row1__text-td">
                      {calculateTotalActualHourPerDay(date)}
                    </span>
                  </td>
                );
              })}
              <td>
                <span className="opacity-0">0</span>
              </td>
            </tr>

            {/* Planned Hours Row */}
            <tr className="timesheet-month-view-per-day-row2">
              <td>
                <span className="font-18-semiBold timesheet-month-view-per-day-row2__text">
                  total HOURS worked per day
                </span>
              </td>

              {dateArray.map((date, index) => {
                return (
                  <td key={index}>
                    <span className="font-18-semiBold">
                      {calculateTotalPlannedHourPerDay(date)}
                    </span>
                  </td>
                );
              })}
              <td>
                <span className="opacity-0">0</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
