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

// const projectOption = [
//   { value: "Project1", label: "Project1" },
//   { value: "Project2", label: "Project2" },
//   { value: "Project3", label: "Project3" },
//   { value: "Project4", label: "Project4" },
// ];

// const taskOption = [
//   { value: "Task1", label: "Task1" },
//   { value: "Task2", label: "Task2" },
//   { value: "Task3", label: "Task3" },
//   { value: "Task4", label: "Task4" },
// ];

function EditDashboardSchedule({ scheduleData, onCloseModal, open }) {
  const dispatch = useDispatch();
  const [values, setValues] = useState({
    deleteByGroupId: false,
    projectTask: true,
    // selectedProject: "",
    selectedTask: "",
    startDate: "",
    endDate: "",
    fromTime: setHours(setMinutes(new Date(), 0), 9),
    toTime: setHours(setMinutes(new Date(), 0), 19),
    taskColor: "#737AAE",
    bookingName: "",
    emojiSelected: emoji.random().emoji,
  });

  const [projectOption, setProjectOption] = useState([]);
  const [taskOption, setTaskOption] = useState([]);
  const [selectedProject, setselectedProject] = useState({});

  const allProjects = useSelector((state) => state.projects.allProjects);
  const allTasks = useSelector((state) => state.projects.allTasks);

  const [displayColorPicker, setDisplayColorPicker] = useState(false);

  useEffect(() => {
    if (!isEmpty(scheduleData)) {
      setValues({
        ...values,
        projectTask: scheduleData.type === "PROJECT" ? true : false,
        startDate: new Date(scheduleData.startDate),
        endDate: new Date(scheduleData.endDate),
        fromTime: new Date(scheduleData.fromTime),
        toTime: new Date(scheduleData.toTime),
        bookingName: scheduleData.bookingName,
        emojiSelected: scheduleData.emoji,
      });
    }
  }, [scheduleData]);

  useEffect(() => {
    if (!isEmpty(allProjects)) {
      let newArray = [];
      allProjects.forEach((ele) => {
        newArray.push({ value: ele._id, label: ele.name });
      });
      setProjectOption(newArray);

      if (!isEmpty(scheduleData) && scheduleData.type === "PROJECT") {
        console.log(scheduleData);
        console.log(newArray);
        if (!isEmpty(newArray) && !isEmpty(scheduleData.task)) {
          let filteredProject = newArray.filter(
            (project) => project.value === scheduleData.task.project._id
          );
          setValues({
            ...values,
            // selectedProject: filteredProject,
            projectTask: scheduleData.type === "PROJECT" ? true : false,
            startDate: new Date(scheduleData.startDate),
            endDate: new Date(scheduleData.endDate),
            fromTime: new Date(scheduleData.fromTime),
            toTime: new Date(scheduleData.toTime),
            bookingName: scheduleData.bookingName,
            emojiSelected: scheduleData.emoji,
          });
          setselectedProject(filteredProject);
          dispatch(
            getAllTasksByProjectId({
              query: {
                project: filteredProject.value,
              },
            })
          );
        }
      }
    }
  }, [allProjects, scheduleData]);

  useEffect(() => {
    if (!isEmpty(allTasks)) {
      let newArray = [];
      allTasks.forEach((ele) => {
        newArray.push({ value: ele._id, label: ele.name });
      });

      setTaskOption(newArray);
      if (!isEmpty(scheduleData) && scheduleData.type === "PROJECT") {
        if (!isEmpty(newArray) && !isEmpty(scheduleData.task)) {
          let filteredTask = newArray.filter(
            (task) => task.value === scheduleData.task._id
          );
          console.log(filteredTask);
          setValues({
            ...values,
            selectedTask: filteredTask,
            projectTask: scheduleData.type === "PROJECT" ? true : false,
            startDate: new Date(scheduleData.startDate),
            endDate: new Date(scheduleData.endDate),
            fromTime: new Date(scheduleData.fromTime),
            toTime: new Date(scheduleData.toTime),
            bookingName: scheduleData.bookingName,
            emojiSelected: scheduleData.emoji,
          });
        }
      }
    }
  }, [allTasks, scheduleData]);

  /*===================================
              button text
  =====================================*/

  const grayButtonText = (
    <>
      <img
        src={require("../../../assets/img/icons/new-schedule-randomise-icon.svg")}
        alt=""
        className="new-schedule-randomise-icon-img"
      />
      <span>Randomise</span>
    </>
  );

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
    var userData = JSON.parse(localStorage.getItem("UserData"));
    const { deleteByGroupId } = values;
    if (deleteByGroupId === true) {
      dispatch(
        deleteScheduleByGroupId(
          scheduleData.groupId,
          userData.id,
          callBackDelete
        )
      );
    } else {
      dispatch(
        deleteScheduleById(scheduleData._id, userData.id, callBackDelete)
      );
    }
  };
  const handleOnChangeToggle = (e) => {
    setValues({
      ...values,
      [e.target.name]: e.target.checked,
    });
  };

  const handleChange = (e) => {
    setValues({
      ...values,
      [e.target.name]: e.target.value,
    });
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
  const handleChangeProject = (selectedOption) => {
    // setValues({
    //   ...values,
    //   selectedProject: selectedOption,
    // });
    console.log(selectedOption, values.selectedProject);
    setselectedProject(selectedOption);
    dispatch(
      getAllTasksByProjectId({
        query: {
          project: selectedOption.value,
        },
      })
    );
  };

  const handleChangeTasks = (selectedOption) => {
    setValues({
      ...values,
      selectedTask: selectedOption,
    });
  };

  const handleClickOpenColorPalette = () => {
    setDisplayColorPicker(!displayColorPicker);
  };

  const handleChangeSelectTaskColorComplete = (color, event) => {
    setValues({ ...values, taskColor: color.hex });
    console.log(color.hex);
  };

  const callBackUpdateSchedule = (status) => {
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

      let todaysStart = startOfDay(new Date());
      let todaysEnd = endOfDay(new Date());
      const todaysTask = {
        query: {
          $and: [
            { fromDate: { $lte: new Date(todaysEnd) } },
            { fromDate: { $gte: new Date(todaysStart) } },
          ],
        },
      };

      dispatch(getCurrentTaskData(todaysTask));
    }
  };

  const getDaysArray = (start, end) => {
    for (
      var arr = [], dt = new Date(start);
      dt <= end;
      dt.setDate(dt.getDate() + 1)
    ) {
      arr.push(new Date(dt).toISOString());
    }
    return arr;
  };

  const updateScheduleHandler = (e) => {
    e.preventDefault();
    setDisplayColorPicker(false);
    var userData = JSON.parse(localStorage.getItem("UserData"));
    console.log(values);
    const { startDate, endDate } = values;
    var group_id = `GROUP` + moment().unix();
    //   // console.log(startDate, endDate);
    if (
      getDate(startDate) === getDate(endDate) &&
      getMonth(startDate) === getMonth(endDate)
    ) {
      let formData = scheduleData;
      formData.bookingName =
        values.projectTask === true
          ? values.selectedTask.label
          : values.bookingName;
      formData.fromDate = values.startDate.toISOString();
      formData.toDate = values.endDate.toISOString();
      formData.fromTime = values.fromTime.toISOString();
      formData.toTime = values.toTime.toISOString();
      formData.type = values.projectTask === true ? "PROJECT" : "GENERAL";
      formData.emoji = values.emojiSelected;
      formData.project =
        values.projectTask === true ? selectedProject.value : "";
      formData.task =
        values.projectTask === true ? values.selectedTask.value : "";
      dispatch(
        updateScheduleById(
          formData._id,
          formData,
          userData.id,
          callBackUpdateSchedule
        )
      );
    } else {
      const { startDate, endDate } = values;
      let dateArray = getDaysArray(
        new Date(dateFns.format(startDate, "YYYY-MM-DD")),
        new Date(dateFns.format(endDate, "YYYY-MM-DD"))
      );
      let requestArray = dateArray.map((day) => ({
        groupId: group_id,
        bookingName:
          values.projectTask === true
            ? values.selectedTask.label
            : values.bookingName,
        assignedTo: userData.id,
        project: values.projectTask === true ? selectedProject.value : "",
        task: values.projectTask === true ? values.selectedTask.value : "",
        fromDate: day,
        toDate: day,
        fromTime: values.fromTime.toISOString(),
        toTime: values.toTime.toISOString(),
        type: values.projectTask === true ? "PROJECT" : "GENERAL",
        taskColor:
          "linear-gradient(360deg,rgba(45, 49, 53, 1) 100%,rgba(45, 49, 53, 1) 100%),linear-gradient(270.01deg,rgba(253, 117, 66, 1) 12.81%,rgba(246, 211, 101, 1) 93.06%)",
        bookedBy: userData.id,
        emoji: values.emojiSelected,
      }));
      // console.log(requestArray);
      const formData = {
        data: requestArray,
      };

      console.log(formData);
      dispatch(
        createBulkSchedule(formData, userData.id, callBackUpdateSchedule)
      );
    }
  };

  const handleCheckboxChange = (e) => {
    setValues({
      ...values,
      [e.target.id]: e.target.checked,
    });
  };

  const handleOnclickRandomise = () => {
    setValues({
      ...values,
      emojiSelected: emoji.random().emoji,
    });
    console.log(values.emojiSelected);
  };

  /*================================================
                renderTaskColor
  =================================================*/

  const renderTaskColor = () => {
    return (
      <div className="task-color-div">
        <div
          className="row mx-0 align-items-center flex-nowrap color-swatch-block"
          onClick={handleClickOpenColorPalette}
        >
          <div
            className="color-custom"
            style={{
              backgroundColor: `${values.taskColor}`,
            }}
          />
          <div className="swatch-custom">
            <i className="fa fa-chevron-down"></i>
          </div>
        </div>
        <div className="task-color-dropdown">
          {displayColorPicker && (
            <div className="popover-custom">
              <div
                className="cover-custom"
                onClick={handleClickOpenColorPalette}
              />
              <SketchPicker
                width={"17vw"}
                color={values.taskColor}
                onChangeComplete={handleChangeSelectTaskColorComplete}
              />
            </div>
          )}
        </div>
      </div>
    );
  };

  /*========================================================
                         renderTask
  ========================================================*/

  const renderTasks = () => {
    return (
      <div className="mt-50">
        <h4 className="add-new-schedule-task-details">Select Type</h4>
        <div className="row mx-0 align-items-center justify-content-between">
          <Toggle
            //textClassName="client-card-subtittle-text"
            containerClassName="timesheet-toggle-all-project-history mt-30"
            name="projectTask"
            text1={"Project Task"}
            text2={"General Booking"}
            onChange={handleOnChangeToggle}
            defaultChecked={values.projectTask === true}
          />
          <div className="row mx-0 align-items-center">
            {/*<img
              src={require("../../../assets/img/icons/new-schedule-emoji-img.svg")}
              alt=""
              className="new-schedule-emoji-img"
            />*/}
            <span className="task-modal-emoji task-modal-emoji--dashboard">
              {values.emojiSelected}
            </span>
            <GrayButtonSmallFont
              text={grayButtonText}
              extraClassName="randomise-btn"
              onClick={handleOnclickRandomise}
            />
          </div>
        </div>
        <h4 className="add-new-schedule-task-details mt-50">Enter Details</h4>
        {!values.projectTask ? (
          <>
            <div className="row mx-0 align-items-start justify-content-between mt-50">
              <InputFieldEmailTextPassword
                containerClassName="container-login-flow-input container-login-flow-input--add-new-shedule-member container-login-flow-input--forms"
                label="Booking Name"
                placeholder="Booking Name"
                name="bookingName"
                value={values.bookingName}
                onChange={handleChange}
                type="text"
              />

              {renderTaskColor()}
            </div>
          </>
        ) : (
          <>
            <div className="row mx-0 align-items-center justify-content-between mt-50">
              <Select
                className="react-select-container react-select-container--addMember react-select-container--add-new-schedule-member"
                classNamePrefix="react-select-elements"
                value={selectedProject}
                onChange={handleChangeProject}
                options={projectOption}
                isSearchable={false}
                placeholder="Select Project"
              />
              {renderTaskColor()}
            </div>
            <Select
              className="react-select-container mt-30 react-select-container--addMember react-select-container--add-new-scedule-member-task"
              classNamePrefix="react-select-elements"
              value={values.selectedTask}
              onChange={handleChangeTasks}
              options={taskOption}
              isSearchable={false}
              placeholder="Select Task"
            />
          </>
        )}
        <div className="row mx-0 align-items-center justify-content-between mt-30 flex-nowrap">
          <div className="add-new-schedule-member-date-picker">
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
            />
          </div>
          <div className="add-new-schedule-member-date-picker">
            <DatePickerFromToTime
              //title="Working hours"
              fromTimeValue={values.fromTime}
              toTimeValue={values.toTime}
              handleChangeFromTime={handleChangeFromTime}
              handleChangeToTime={handleChangeToTime}
              defaultToTime={setHours(setMinutes(new Date(), 0), 17)}
              //placeholder="Working hours"
            />
          </div>
        </div>
      </div>
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
          modal: "customModal customModal--add-new-schedule-member",
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
            Edit schedule
          </h2>
          {renderTasks()}
          <div className="row mx-0 mt-30  justify-content-between align-items-center">
            {/*<div className="d-flex justify-content-between align-items-center">*/}
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
          </div>
          <div className="text-center row mx-0 mt-40 mb-30 justify-content-center">
            <GrayButtonSmallFont
              onClick={deleteScheduleHandler}
              text={"Delete"}
              extraClassName={"edit-booking-save-btn"}
            />
            <GreenButtonSmallFont
              onClick={updateScheduleHandler}
              text={"Edit Booking"}
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

export default EditDashboardSchedule;
