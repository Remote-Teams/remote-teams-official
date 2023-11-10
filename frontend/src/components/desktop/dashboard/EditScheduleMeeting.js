import React, { useState, useEffect } from "react";
import Modal from "react-responsive-modal";
import InputFieldEmailTextPassword from "./../../desktop/common/InputFieldEmailTextPassword";
import GreenButtonSmallFont from "./../common/GreenButtonSmallFont";
import GrayButtonSmallFont from "./../common/GrayButtonSmallFont";
import DatePickerFromToDate from "./../common/DatePickerFromToDate";
import Select from "react-select";
import { SketchPicker } from "react-color";
import DatePickerFromToTime from "./../../desktop/common/DatePickerFromToTime";
import dateFns from "date-fns";
import * as moment from "moment";
import isEmpty from "../../../store/validations/is-empty";
import Checkbox from "rc-checkbox";
import "rc-checkbox/assets/index.css";
import getDate from "date-fns/get_date";
import { useSelector, useDispatch } from "react-redux";
import {
  createBulkSchedule,
  deleteScheduleById,
  deleteScheduleByGroupId,
  getScheduleWithCalender,
  updateScheduleById,
} from "./../../../store/actions/scheduleAction";
import Toggle from "../common/Toggle";
import { setHours, setMinutes } from "date-fns";
import emoji from "node-emoji";
import { startOfDay, endOfDay } from "date-fns";
import { startOfWeek, endOfWeek } from "date-fns";
import getMonth from "date-fns/get_month";
import { getCurrentTaskData } from "./../../../store/actions/dashboardAction";
import { getAllTasksByProjectId } from "./../../../store/actions/projectAction";
import TaskMemberDisplayList from "../common/TaskMemberDisplayList";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {
  deleteMeetingById,
  updateMeetingById,
} from "./../../../store/actions/calenderAction";
import { format } from "date-fns";

// const option = [
//   { value: "Lorem1", label: "Lorem1" },
//   { value: "Lorem2", label: "Lorem2" },
//   { value: "Lorem3", label: "Lorem3" },
//   { value: "Lorem4", label: "Lorem4" },
// ];

function EditScheduleMeeting({ scheduleData, onCloseModal, open }) {
  const dispatch = useDispatch();
  const [values, setValues] = useState({
    meetingTitle: "",
    startDate: new Date(),
    // endDate: new Date(),
    fromTime: setHours(setMinutes(new Date(), 0), 10),
    toTime: setHours(setMinutes(new Date(), 0), 11),
    selectOption: "",
    displayListSelected: [],
    options: [],
    deleteByGroupId: false,
  });

  const [options, setOptions] = useState([]);

  const allResources = useSelector((state) => state.resources.allResources);

  useEffect(() => {
    if (!isEmpty(scheduleData)) {
      console.log(scheduleData);

      let defaultMemeber = !isEmpty(scheduleData.attendees)
        ? scheduleData.attendees.map((user) => ({
            value: user._id,
            label: user.firstName,
          }))
        : [];

      setValues({
        ...values,
        meetingTitle: scheduleData.subject,
        startDate: new Date(scheduleData.meetingDate),
        fromTime: new Date(scheduleData.fromTime),
        toTime: new Date(scheduleData.toTime),
        displayListSelected: defaultMemeber,
      });
    }
  }, [scheduleData]);

  useEffect(() => {
    if (!isEmpty(allResources)) {
      let newArray = [];
      allResources.forEach((ele) => {
        newArray.push({ value: ele._id, label: ele.name });
      });
      setOptions(newArray);
    }
  }, [allResources]);
  /*=====================================

                 handler

  ======================================*/

  const callBackDeleteMeeting = (status) => {
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

  const deleteScheduleHandler = () => {
    console.log("schedule delete");
    dispatch(deleteMeetingById(scheduleData._id, callBackDeleteMeeting));
  };

  const handleChange = (e) => {
    setValues({
      ...values,
      [e.target.name]: e.target.value,
    });
  };

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

  const callBackUpdate = (status) => {
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

  const updateScheduleHandler = (e) => {
    e.preventDefault();
    console.log(values);

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
    dispatch(updateMeetingById(scheduleData._id, formData, callBackUpdate));
  };

  const handleCheckboxChange = (e) => {
    setValues({
      ...values,
      [e.target.id]: e.target.checked,
    });
  };

  /*==========================================================
                   selectMembers
==========================================================*/
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

  /*========================================================
                         render
  ========================================================*/

  return (
    <div>
      <Modal
        open={open}
        onClose={onCloseModal}
        closeOnEsc={false}
        closeOnOverlayClick={false}
        center
        classNames={{
          overlay: "customOverlay",
          modal: "customModal customModal--add-new-schedule",
          //customModal--createSchedule
          closeButton: "customCloseButton",
        }}
      >
        {/* close modal */}
        <span className="closeIconInModal" onClick={onCloseModal} />
        {/*<div className="add_schedule_model_container">*/}
        {/*<h3 className="font-38-semiBold text-center mb-50">Manage Task</h3>*/}
        {/*<div className="add-meeting-title-div add-meeting-title-div--add-task">*/}
        <div className="add-new-schedule-div add-new-schedule-div--member">
          <h2 className="add-meeting-title add-meeting-title--edit-schedule">
            Edit Meeting
          </h2>
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
          </div>

          {/* <div className="row mx-0 mt-30  justify-content-between align-items-center">
            
            <div className="customCheckbox customCheckbox--edit-dashboard-schedule">
              <Checkbox
                id="deleteByGroupId"
                onChange={handleCheckboxChange}
                value={values.deleteByGroupId}
                checked={values.deleteByGroupId}
                defaultChecked={true}
              />
              <span className="edit-dashboard-schedule-span-text">
                Delete task from schedule of all day
              </span>
            </div>
          </div> */}
          <div className="text-center row mx-0 mt-40 mb-30 justify-content-center">
            <GrayButtonSmallFont
              onClick={deleteScheduleHandler}
              text={"Delete"}
              extraClassName={"edit-booking-save-btn"}
            />
            <GreenButtonSmallFont
              onClick={updateScheduleHandler}
              text={"Edit Meeting"}
              extraClassName={"edit-booking-save-btn"}
            />
          </div>
          {/*</div>*/}
          {/*</div>*/}
        </div>
      </Modal>
    </div>
  );
}

export default EditScheduleMeeting;
