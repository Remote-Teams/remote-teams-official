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
import {
  deleteLeaveById,
  updateScheduleLeaveById,
} from "./../../../store/actions/calenderAction";
import { format } from "date-fns";

const leaveOption = [
  { value: "Paid", label: "Paid" },
  { value: "Medical", label: "Medical" },
  { value: "Unpaid", label: "Unpaid" },
];

function EditScheduleDayOff({ scheduleData, onCloseModal, open }) {
  const dispatch = useDispatch();
  const [values, setValues] = useState({
    // deleteByGroupId: false,

    startDate: new Date(),
    endDate: new Date(),
    // fromTime: setHours(setMinutes(new Date(), 0), 10),
    // toTime: setHours(setMinutes(new Date(), 0), 11),
    leave: "",
  });

  useEffect(() => {
    if (!isEmpty(scheduleData)) {
      console.log(scheduleData);
      setValues({
        ...values,
        startDate: new Date(scheduleData.fromDate),
        endDate: new Date(scheduleData.toDate),
        leave:
          scheduleData.leaveType === "UNPAID_LEAVE"
            ? leaveOption[2]
            : scheduleData.leaveType === "PAID_LEAVE"
            ? leaveOption[0]
            : scheduleData.leaveType === "SICK_LEAVE"
            ? leaveOption[1]
            : "PAID_LEAVE",
      });
    }
  }, [scheduleData]);

  /*=====================================

                 handler

  ======================================*/

  const callBackDelete = (status) => {
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
    // console.log("schedule delete", scheduleData);
    dispatch(deleteLeaveById(scheduleData._id, callBackDelete));
  };
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
    //setDisplayColorPicker(false);
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

    dispatch(
      updateScheduleLeaveById(scheduleData._id, formData, callBackUpdate)
    );
  };

  const handleCheckboxChange = (e) => {
    setValues({
      ...values,
      [e.target.id]: e.target.checked,
    });
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
          //modal: "customModal customModal--add-new-schedule-member",
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
            Edit Dayoff
          </h2>
          <div className="mt-40">
            <h4 className="add-new-schedule-task-details">Details</h4>
            {/*this input use for datepicker autoFoucs false / datepicker calendar do not focus on load */}
            <input className="timesheet-export-csv-input" autoFocus />
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
              text={"Edit DayOff"}
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

export default EditScheduleDayOff;
