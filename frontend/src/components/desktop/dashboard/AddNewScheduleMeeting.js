import React, { useState, useEffect } from "react";
import GreenButtonSmallFont from "./../common/GreenButtonSmallFont";
import DatePickerFromToTime from "../common/DatePickerFromToTime";
import TaskMemberDisplayList from "../common/TaskMemberDisplayList";
import { setHours, setMinutes } from "date-fns";
import Select from "react-select";
import InputFieldEmailTextPassword from "./../../desktop/common/InputFieldEmailTextPassword";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useDispatch, useSelector } from "react-redux";
import isEmpty from "../../../store/validations/is-empty";
import { addMeetingAction } from "./../../../store/actions/calenderAction";
import { getScheduleWithCalender } from "./../../../store/actions/scheduleAction";
import { startOfDay, endOfDay } from "date-fns";
import { startOfWeek, endOfWeek } from "date-fns";
import { format } from "date-fns";

export default function AddNewScheduleMeeting({ onCloseModal }) {
  const dispatch = useDispatch();
  const [values, setValues] = useState({
    meetingTitle: "",
    startDate: new Date(),
    endDate: new Date(),
    fromTime: setHours(setMinutes(new Date(), 0), 10),
    toTime: setHours(setMinutes(new Date(), 0), 11),
    selectOption: "",
    displayListSelected: [],
    options: [],
  });

  const [options, setOptions] = useState([]);

  const allResources = useSelector((state) => state.resources.allResources);

  useEffect(() => {
    if (!isEmpty(allResources)) {
      let newArray = [];
      allResources.forEach((ele) => {
        newArray.push({ value: ele._id, label: ele.name });
      });
      setOptions(newArray);
    }
  }, [allResources]);

  const handleChangeDate = (date) => {
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

  const handleChange = (e) => {
    setValues({
      ...values,
      [e.target.name]: e.target.value,
    });
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

  const callBackAddMeeting = (status) => {
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
    // console.log(values);

    var userData = JSON.parse(localStorage.getItem("UserData"));

    let finalAssignArray = [];
    if (!isEmpty(values.displayListSelected)) {
      values.displayListSelected.forEach((ele) => {
        finalAssignArray.push(ele.value);
      });
    }
    const formData = {
      subject: values.meetingTitle,
      meetingDate: `${format(values.startDate, "YYYY-MM-DD")}T00:00:00.000Z`,
      meetingTimeFrom: values.fromTime.toISOString(),
      meetingTimeTo: values.toTime.toISOString(),
      attendees: finalAssignArray,
      organizer: userData.id,
    };

    dispatch(addMeetingAction(formData, callBackAddMeeting));
  };
  const renderSelectMembers = () => {
    const handleChangeSelectClient = (selectedOption) => {
      let newList = values.displayListSelected;
      if (newList.indexOf(selectedOption) === -1) {
        newList.push(selectedOption);
        setValues({
          ...values,
          selectOption: selectedOption,
          displayListSelected: newList,
        });
      } else {
        setValues({
          ...values,
          selectOption: selectedOption,
        });
      }
    };

    const handleRemoveMember = (index) => (e) => {
      let newList = values.displayListSelected;
      newList.splice(index, 1);
      setValues({
        ...values,
        displayListSelected: newList,
        selectOption: "",
      });
    };
    return (
      <>
        <h5 className="add-new-schedule-task-details">Invite Members</h5>
        <Select
          className="react-select-container mt-30 react-select-container--addMember react-select-container--add-new-schedule-meeting react-select-container--addMember--selectMember"
          classNamePrefix="react-select-elements"
          value={values.selectOption}
          onChange={handleChangeSelectClient}
          options={options}
          isSearchable={false}
          placeholder="Select Members"
        />

        <h4 className="font-18-extraBold-space-light-uppercase mt-40">
          Selected members
        </h4>
        <TaskMemberDisplayList
          displayListSelected={values.displayListSelected}
          handleRemoveMember={handleRemoveMember}
        />
      </>
    );
  };

  console.log(values.fromTime);

  return (
    <div className="mt-50">
      <h3 className="add-new-schedule-task-details">Enter Details</h3>
      <InputFieldEmailTextPassword
        containerClassName="mt-30 container-login-flow-input container-login-flow-input--add-new-shedule-meeting container-login-flow-input--forms"
        label="Meeting title"
        placeholder="Meeting title"
        name="meetingTitle"
        value={values.meetingTitle}
        onChange={handleChange}
        type="text"
      />
      <div className="add-new-schedule-date-picker">
        <div className="date-picker-common ">
          <DatePicker
            minDate={new Date()}
            selected={values.startDate}
            onChange={handleChangeDate}
            //placeholderText="date of birth"
          />
          <div className="datepeacker-date-icon-div">
            <img
              src={require("../../../assets/img/icons/new-date-icon.svg")}
              alt="date"
            />
          </div>
        </div>
      </div>
      <div className="add-new-schedule-date-picker">
        <DatePickerFromToTime
          //title="Working hours"
          fromTimeValue={values.fromTime}
          toTimeValue={values.toTime}
          handleChangeFromTime={handleChangeFromTime}
          handleChangeToTime={handleChangeToTime}
          defaultToTime={setHours(setMinutes(new Date(), 0), 17)}
          //placeholder="Working hours"
          isTo={true}
        />
      </div>
      {renderSelectMembers()}
      <div className="text-center">
        <GreenButtonSmallFont
          onClick={handleSave}
          text="Add Meeting"
          extraClassName="add-booking-btn"
        />
      </div>
    </div>
  );
}
