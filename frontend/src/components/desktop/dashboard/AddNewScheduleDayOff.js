import React, { useState } from "react";
import GreenButtonSmallFont from "./../common/GreenButtonSmallFont";
import DatePickerFromToTime from "../common/DatePickerFromToTime";
import { setHours, setMinutes } from "date-fns";
import DatePickerFromToDate from "../common/DatePickerFromToDate";
import Select from "react-select";
import { useDispatch } from "react-redux";
import { addLeaveAction } from "./../../../store/actions/calenderAction";
import { startOfDay, endOfDay } from "date-fns";
import { startOfWeek, endOfWeek } from "date-fns";
import { getScheduleWithCalender } from "./../../../store/actions/scheduleAction";
import { format } from "date-fns";

const leaveOption = [
  { value: "Paid", label: "Paid" },
  { value: "Medical", label: "Medical" },
  { value: "Unpaid", label: "Unpaid" },
];
export default function AddNewScheduleDayOff({ onCloseModal }) {
  const dispatch = useDispatch();
  const [values, setValues] = useState({
    meetingTitle: "",
    startDate: new Date(),
    endDate: new Date(),
    fromTime: setHours(setMinutes(new Date(), 0), 10),
    toTime: setHours(setMinutes(new Date(), 0), 11),
    leave: "",
  });

  const handleChangeStart = (date) => {
    if (date === null) {
      setValues({
        ...values,
        startDate: new Date(),
      });
    } else {
      setValues({
        ...values,
        startDate: date,
      });
    }
  };

  const handleChangeEnd = (date) => {
    if (date === null) {
      setValues({
        ...values,
        endDate: new Date(),
      });
    } else {
      setValues({
        ...values,
        endDate: date,
      });
    }
  };

  const handleChangeFromTime = (time) => {
    if (time === null) {
      setValues({
        ...values,
        fromTime: new Date(),
      });
    } else {
      setValues({
        ...values,
        fromTime: time,
      });
    }
  };

  const handleChangeToTime = (time) => {
    if (time === null) {
      setValues({
        ...values,
        toTime: new Date(),
      });
    } else {
      setValues({
        ...values,
        toTime: time,
      });
    }
  };

  const handleChangeLeave = (selectedOption) => {
    setValues({
      ...values,
      leave: selectedOption,
    });
  };

  const callBackAddLeave = (status) => {
    if (status === 200) {
      onCloseModal();
      var userData = JSON.parse(localStorage.getItem("UserData"));
      let startWeek = startOfWeek(new Date());
      let endWeek = endOfWeek(new Date());

      let newStartDate = startOfDay(startWeek);
      let endStartDate = endOfDay(endWeek);
      const scheduleData = {
        startDate: newStartDate,
        endDate: endStartDate,
        member: userData.id,
      };
      dispatch(getScheduleWithCalender(scheduleData));
    }
  };

  const handleSave = (e) => {
    e.preventDefault();
    console.log(values);

    const formData = {
      leaveType:
        values.leave.value === "Unpaid"
          ? "UNPAID_LEAVE"
          : values.leave.value === "Paid"
          ? "PAID_LEAVE"
          : values.leave.value === "Medical"
          ? "SICK_LEAVE"
          : "PAID_LEAVE",
      leaveStatus: "PENDING",
      fromDate: `${format(values.startDate, "YYYY-MM-DD")}T00:00:00.000Z`,
      toDate: `${format(values.endDate, "YYYY-MM-DD")}T00:00:00.000Z`,
      reason: values.leave.value,
    };
    // console.log(formData);
    dispatch(addLeaveAction(formData, callBackAddLeave));
  };

  return (
    <div className="mt-40">
      <h4 className="add-new-schedule-task-details">Details</h4>
      <div className="add-new-schedule-date-picker mt-30">
        <DatePickerFromToDate
          //labelStart="Start Date"
          placeholderStart="Start Date"
          startDateValue={values.startDate}
          //labelEnd={labelEndDate}
          placeholderEnd="End Date"
          endDateValue={values.endDate}
          handleChangeStart={handleChangeStart}
          handleChangeEnd={handleChangeEnd}
          //error={errors}
          isTo={true}
        />
      </div>
      {/* <div className="add-new-schedule-date-picker">
        <DatePickerFromToTime
          //title="Working hours"
          fromTimeValue={values.fromTime}
          toTimeValue={values.toTime}
          handleChangeFromTime={handleChangeFromTime}
          handleChangeToTime={handleChangeToTime}
          defaultToTime={setHours(setMinutes(new Date(), 0), 17)}
          placeholder="Working hours"
          isTo={true}
        />
      </div>{" "} */}
      <Select
        className="react-select-container mt-30 react-select-container--addMember react-select-container--add-new-schedule-day-off"
        classNamePrefix="react-select-elements"
        value={values.leave}
        onChange={handleChangeLeave}
        options={leaveOption}
        isSearchable={false}
        placeholder="Type of leave"
      />
      <div className="text-center">
        <GreenButtonSmallFont
          onClick={handleSave}
          text="Add Times Off"
          extraClassName="add-booking-btn"
        />
      </div>
    </div>
  );
}
