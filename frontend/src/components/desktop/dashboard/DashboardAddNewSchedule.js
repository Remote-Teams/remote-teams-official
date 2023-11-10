import React, { useState, useEffect } from "react";
import Modal from "react-responsive-modal";
import InputFieldEmailTextPassword from "./../../desktop/common/InputFieldEmailTextPassword";
import GreenButtonSmallFont from "./../common/GreenButtonSmallFont";
import GrayButtonSmallFont from "./../common/GrayButtonSmallFont";
import DatePickerFromToDate from "./../common/DatePickerFromToDate";
import Select from "react-select";
import { SketchPicker } from "react-color";
import { connect } from "react-redux";
import {
  createSchedule,
  createBulkSchedule,
  getScheduleWithCalender,
} from "./../../../store/actions/scheduleAction";
import { getAllTasksByProjectId } from "./../../../store/actions/projectAction";
import DatePickerFromToTime from "../common/DatePickerFromToTime";
import dateFns from "date-fns";
import * as moment from "moment";
import isEmpty from "../../../store/validations/is-empty";
import getDayOfYear from "date-fns/get_day_of_year";
import { useSelector, useDispatch } from "react-redux";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";
import Toggle from "../common/Toggle";
import { setHours, setMinutes } from "date-fns";
import AddNewScheduleMeeting from "./AddNewScheduleMeeting";
import AddNewScheduleDayOff from "./AddNewScheduleDayOff";
import emoji from "node-emoji";
import { startOfDay, endOfDay } from "date-fns";
import { startOfWeek, endOfWeek } from "date-fns";
import { getCurrentTaskData } from "./../../../store/actions/dashboardAction";
import getMonth from "date-fns/get_month";
import getDate from "date-fns/get_date";

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

function DashboardAddNewSchedule() {
  const dispatch = useDispatch();
  const [values, setValues] = useState({
    open: false,
    projectTask: true,
    selectedProject: "",
    selectedTask: "",
    startDate: new Date(),
    endDate: new Date(),
    fromTime: setHours(setMinutes(new Date(), 0), 10),
    toTime: setHours(setMinutes(new Date(), 0), 11),
    taskColor: "#737AAE",
    bookingName: "",
    emojiSelected: emoji.random().emoji,
  });

  const [projectOption, setProjectOption] = useState([]);
  const [taskOption, setTaskOption] = useState([]);

  const allProjects = useSelector((state) => state.projects.allProjects);
  const allTasks = useSelector((state) => state.projects.allTasks);

  useEffect(() => {
    if (!isEmpty(allProjects)) {
      let newArray = [];
      allProjects.forEach((ele) => {
        newArray.push({ value: ele._id, label: ele.name });
      });
      setProjectOption(newArray);
      // setValues({
      //   ...values,
      //   selectedProject: newArray[0],
      // });
      // dispatch(
      //   getAllTasksByProjectId({
      //     query: {
      //       project: newArray[0].value,
      //     },
      //   })
      // );
    }
  }, [allProjects]);

  useEffect(() => {
    if (!isEmpty(allTasks)) {
      let newArray = [];
      allTasks.forEach((ele) => {
        newArray.push({ value: ele._id, label: ele.name });
      });

      setTaskOption(newArray);
    }
  }, [allTasks]);

  const [displayColorPicker, setDisplayColorPicker] = useState(false);
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

  const onOpenModal = () => {
    setValues({ ...values, open: true });
  };

  const onCloseModal = () => {
    setValues({ ...values, open: false });
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
    setValues({
      ...values,
      selectedProject: selectedOption,
    });
    dispatch(
      getAllTasksByProjectId({
        query: {
          project: selectedOption.value,
        },
      })
    );
    console.log(selectedOption, values.selectedProject);
  };

  const handleChangeTasks = (selectedOption) => {
    setValues({
      ...values,
      selectedTask: selectedOption,
    });
  };

  const callBackAddSchedule = (status) => {
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

  const handleSave = (e) => {
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
      const formData = {
        groupId: group_id,
        bookingName:
          values.projectTask === true
            ? values.selectedTask.label
            : values.bookingName,
        assignedTo: userData.id,
        project:
          values.projectTask === true ? values.selectedProject.value : "",
        task: values.projectTask === true ? values.selectedTask.value : "",
        fromDate: values.startDate.toISOString(),
        toDate: values.endDate.toISOString(),
        fromTime: values.fromTime.toISOString(),
        toTime: values.toTime.toISOString(),
        type: values.projectTask === true ? "PROJECT" : "GENERAL",
        taskColor:
          "linear-gradient(360deg,rgba(45, 49, 53, 1) 100%,rgba(45, 49, 53, 1) 100%),linear-gradient(270.01deg,rgba(253, 117, 66, 1) 12.81%,rgba(246, 211, 101, 1) 93.06%)",
        bookedBy: userData.id,
        emoji: values.emojiSelected,
      };
      console.log(formData);
      dispatch(createSchedule(formData, userData.id, callBackAddSchedule));
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
        project:
          values.projectTask === true ? values.selectedProject.value : "",
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
      dispatch(createBulkSchedule(formData, userData.id, callBackAddSchedule));
    }
  };

  const handleClickOpenColorPalette = () => {
    setDisplayColorPicker(!displayColorPicker);
  };

  const handleChangeSelectTaskColorComplete = (color, event) => {
    setValues({ ...values, taskColor: color.hex });
    console.log(color.hex);
  };

  const handleOnclickRandomise = () => {
    setValues({
      ...values,
      emojiSelected: emoji.random().emoji,
    });
    console.log(values.emojiSelected);
  };

  const renderTasks = () => {
    return (
      <div className="add-new-schedule-task-div">
        <div className="row mx-0 align-items-center">
          <h4 className="add-new-schedule-task-details">Task Details</h4>
          <div className="row mx-0 align-items-center justify-content-end">
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
        <Toggle
          //textClassName="client-card-subtittle-text"
          containerClassName="timesheet-toggle-all-project-history mt-30"
          name="projectTask"
          text1={"Project Task"}
          text2={"General Booking"}
          onChange={handleOnChangeToggle}
          defaultChecked={values.projectTask === true}
        />
        {!values.projectTask ? (
          <>
            <InputFieldEmailTextPassword
              containerClassName="container-login-flow-input mt-50 container-login-flow-input--add-new-shedule-task container-login-flow-input--forms"
              label="Booking Name"
              placeholder="Booking Name"
              name="bookingName"
              value={values.bookingName}
              onChange={handleChange}
              type="text"
            />
          </>
        ) : (
          <>
            <Select
              className="react-select-container mt-50 react-select-container--addMember react-select-container--add-new-schedule"
              classNamePrefix="react-select-elements"
              value={values.selectedProject}
              onChange={handleChangeProject}
              options={projectOption}
              isSearchable={false}
              placeholder="Project Name"
            />
            <Select
              className="react-select-container mt-40 react-select-container--addMember react-select-container--add-new-schedule"
              classNamePrefix="react-select-elements"
              value={values.selectedTask}
              onChange={handleChangeTasks}
              options={taskOption}
              isSearchable={false}
              placeholder="Task Name"
            />
          </>
        )}
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
        <div className="add-new-schedule-date-picker">
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
        </div>
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
        <div className="text-center">
          <GreenButtonSmallFont
            onClick={handleSave}
            text="Add Booking"
            extraClassName="add-booking-btn"
          />
        </div>
      </div>
    );
  };
  return (
    <div>
      <GrayButtonSmallFont
        onClick={onOpenModal}
        text="Book Calendar"
        //text="Add Task"
        //text={"+ Add Schedule"}
        extraClassName="add-task-btn"
      />
      <Modal
        open={values.open}
        onClose={onCloseModal}
        closeOnEsc={false}
        closeOnOverlayClick={false}
        center
        classNames={{
          overlay: "customOverlay",
          modal: "customModal customModal--add-new-schedule",
          closeButton: "customCloseButton",
        }}
      >
        {/* close modal */}
        <span className="closeIconInModal" onClick={onCloseModal} />
        <div className="add-new-schedule-div">
          <div className="add-new-custom-fields-title">Create New Booking</div>
          <div className="add-new-schedule-tabs mt-70">
            <Tabs>
              <TabList>
                <div className="add-new-schedule-tabs-border-div">
                  <Tab>
                    <span>Task</span>
                  </Tab>
                  <Tab>
                    <span>Meetings</span>
                  </Tab>
                  <Tab>
                    <span>Day off</span>
                  </Tab>
                </div>
              </TabList>
              <TabPanel>{renderTasks()}</TabPanel>

              <TabPanel>
                <AddNewScheduleMeeting onCloseModal={onCloseModal} />
              </TabPanel>
              <TabPanel>
                <AddNewScheduleDayOff onCloseModal={onCloseModal} />
              </TabPanel>
            </Tabs>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default DashboardAddNewSchedule;
