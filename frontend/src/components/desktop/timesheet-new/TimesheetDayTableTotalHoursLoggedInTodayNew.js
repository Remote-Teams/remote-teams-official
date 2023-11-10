import React, { useEffect, useState } from "react";
import isEmpty from "../../../store/validations/is-empty";

export default function TimesheetDayTableTotalHoursLoggedInTodayNew({
  dayViewTimesheetData,
}) {
  const [loogedHours, setLoggedHours] = useState(0);
  useEffect(() => {
    if (!isEmpty(dayViewTimesheetData)) {
      let totalHoursLogged = 0;
      dayViewTimesheetData.forEach((elements) => {
        // console.log(elements)
        if (elements.hours && !isNaN(parseFloat(elements.hours))) {
          totalHoursLogged = totalHoursLogged + parseFloat(elements.hours);
        }
      });
      setLoggedHours(totalHoursLogged);
    }
  }, [dayViewTimesheetData]);

  return (
    <div className="timesheet-per-day--div">
      <div className="finances-table-tbody finances-table-tbody--timesheetPerDay">
        <table className="finances-table finances-table--timesheetPerDay">
          <tbody>
            {/* Total Hours Row */}
            <tr className="timesheet-month-view-per-day-row1">
              <td>
                <span className="font-18-semiBold timesheet-month-view-per-day-row1__text">
                  TOTAL HOURS LOGGED PER DAY
                </span>
              </td>

              <td className="text-right">
                <span className="timesheet-month-view-per-day-row1__text-td timesheet-month-view-per-day-row1__text-td--dayView pr-50">
                  {loogedHours}
                </span>
              </td>

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
