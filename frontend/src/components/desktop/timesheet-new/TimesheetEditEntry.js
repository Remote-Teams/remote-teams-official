import React, { useState, useEffect } from "react";
import "react-tabs/style/react-tabs.css";
import Modal from "react-responsive-modal";
import InputFieldEmailTextPassword from "./../../desktop/common/InputFieldEmailTextPassword";
import GreenButtonSmallFont from "./../common/GreenButtonSmallFont";
import DatePickerSingle from "./../common/DatePickerSingle";
import Select from "react-select";
import isEmpty from "../../../store/validations/is-empty";
import Toggle from "../common/Toggle";
import InputFieldNumber from "../common/InputFieldNumber";
import DatePickerFromToTimeTimesheet from "../common/DatePickerFromToTimeTimesheet";
import { setHours, setMinutes } from "date-fns";
import { eachDay, startOfWeek, endOfWeek } from "date-fns";
import { useDispatch, useSelector } from "react-redux";
import {
  createWorkLog,
  updateWorklogByid,
} from "./../../../store/actions/timesheetAction";
import { getAllTasksByProjectId } from "./../../../store/actions/projectAction";

const dummyOptions = [
  { value: "Lorem", label: "Lorem" },
  { value: "Ipsum", label: "Ipsum" },
  { value: "Lorem1", label: "Lorem1" },
  { value: "Ipsum1", label: "Ipsum1" },
];

export default function TimesheetEditEntry({
  buttonText,
  buttonClassName,
  cardData,
}) {
  const dispatch = useDispatch();
  const [values, setValues] = useState({
    open: false,
    isProjectTask: true,
    startDate: new Date(),
    selectedProject: "",
    selectedTaskTitle: "",
    bookingName: "",
    numOfHrsLogged: "",
    fromTime: setHours(setMinutes(new Date(), 0), 9),
    toTime: setHours(setMinutes(new Date(), 0), 19),
    errors: {},
  });

  const [projectOption, setProjectOption] = useState([]);
  const [taskOption, setTaskOption] = useState([]);

  const allProjects = useSelector((state) => state.projects.allProjects);
  const allTasks = useSelector((state) => state.projects.allTasks);

  useEffect(() => {
    if (!isEmpty(cardData)) {
      setValues({
        ...values,
        isProjectTask: cardData.category === "GENERAL" ? false : true,
        startDate: new Date(cardData.date),
        fromTime: new Date(cardData.fromTime),
        toTime: new Date(cardData.toTime),
        numOfHrsLogged: cardData.hours,
        bookingName: cardData.name,
      });
    }
  }, [cardData]);

  useEffect(() => {
    if (!isEmpty(allProjects)) {
      let newArray = [];
      allProjects.forEach((ele) => {
        newArray.push({ value: ele._id, label: ele.name });
      });
      setProjectOption(newArray);
      console.log(cardData);
      if (!isEmpty(cardData) && cardData.category === "PROJECT") {
        if (!isEmpty(newArray) && !isEmpty(cardData.projectdata)) {
          let filteredProject = newArray.filter(
            (project) => project.value === cardData.projectdata[0]._id
          );
          setValues({
            ...values,
            selectedProject: filteredProject,
            isProjectTask: cardData.category === "GENERAL" ? false : true,
            startDate: new Date(cardData.date),
            fromTime: new Date(cardData.fromTime),
            toTime: new Date(cardData.toTime),
            numOfHrsLogged: cardData.hours,
            bookingName: cardData.name,
          });
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
  }, [allProjects]);

  useEffect(() => {
    if (!isEmpty(allTasks)) {
      let newArray = [];
      allTasks.forEach((ele) => {
        newArray.push({ value: ele._id, label: ele.name });
      });

      setTaskOption(newArray);
      if (!isEmpty(cardData) && cardData.category === "PROJECT") {
        if (!isEmpty(newArray) && !isEmpty(cardData.taskdata)) {
          let filteredTask = newArray.filter(
            (task) => task.value === cardData.taskdata._id
          );
          console.log(filteredTask);
          setValues({
            ...values,
            selectedTaskTitle: filteredTask,
            isProjectTask: cardData.category === "GENERAL" ? false : true,
            startDate: new Date(cardData.date),
            fromTime: new Date(cardData.fromTime),
            toTime: new Date(cardData.toTime),
            numOfHrsLogged: cardData.hours,
            bookingName: cardData.name,
          });
        }
      }
    }
  }, [allTasks, cardData]);

  const handleOnChangeToggle = (e) => {
    setValues({
      ...values,
      [e.target.name]: e.target.checked,
      //   startDate: new Date(),
      //   selectedProject: "",
      //   selectedTaskTitle: "",
      //   bookingName: "",
      //   numOfHrsLogged: "",
      //   fromTime: setHours(setMinutes(new Date(), 0), 9),
      //   toTime: setHours(setMinutes(new Date(), 0), 19),
      //   errors: {},
    });
  };

  /*=============================================================
        modal handlers 
  =============================================================*/
  const onOpenModal = () => {
    setValues({
      ...values,
      open: true,
    });
  };

  const onCloseModal = () => {
    setValues({
      ...values,
      open: false,
    });
  };

  /*=============================================================
        handlers screen 1
  =============================================================*/

  const handleChangeSelectProject = (selectedOption) => {
    setValues({ ...values, selectedProject: selectedOption, errors: {} });
    dispatch(
      getAllTasksByProjectId({
        query: {
          project: selectedOption.value,
        },
      })
    );
  };

  const handleChangeSelectTaskTitle = (selectedOption) => {
    setValues({ ...values, selectedTaskTitle: selectedOption, errors: {} });
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

  const handleChange = (e) => {
    setValues({
      ...values,
      [e.target.name]: e.target.value,
      errors: {},
    });
  };

  const handleChangeNumber = (e) => {
    setValues({
      ...values,
      [e.target.name]: e.target.validity.valid ? e.target.value : "",
      errors: {},
    });
  };

  /*=======================================================================
        renderScreen1
  =======================================================================*/

  const callBackUpdate = (status) => {
    if (status === 200) {
      onCloseModal();
    }
  };

  const handleOnClickUpdateTask = () => {
    var userData = JSON.parse(localStorage.getItem("UserData"));
    // console.log("update", values);

    const formData = cardData;
    cardData.date = values.startDate;
    cardData.fromTime = values.fromTime;
    cardData.toTime = values.toTime;
    cardData.category = values.isProjectTask === true ? "PROJECT" : "GENERAL";
    cardData.hours = values.numOfHrsLogged;
    cardData.name =
      values.isProjectTask === true
        ? values.selectedTaskTitle.label
        : values.bookingName;

    dispatch(
      updateWorklogByid(
        formData._id,
        formData,
        startOfWeek(new Date()).toISOString(),
        endOfWeek(new Date()).toISOString(),
        userData.id,
        callBackUpdate
      )
    );
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

  const renderScreen1 = () => {
    return (
      <div className="create-new-task-screen-1">
        <div className="mb-40">
          <h3 className="font-18-bold common-peach-color-text mb-25">
            Entry Type
          </h3>
          <Toggle
            containerClassName="timesheet-toggle-all-project-history"
            name="isProjectTask"
            text1={"Project Task"}
            text2={"General Entry"}
            onChange={handleOnChangeToggle}
            defaultChecked={values.isProjectTask}
          />
        </div>

        <h3 className="font-14-bold common-peach-color-text mb-30">
          Enter Details
        </h3>

        <DatePickerSingle
          //labelStart="Start date"
          selected={values.startDate}
          onChange={handleChangeStart}
          placeholder="End date"
        />

        {values.isProjectTask ? (
          <>
            <div className="mb-40">
              <Select
                className="react-select-container react-select-container--addMember react-select-container--addMember--newTimesheet"
                classNamePrefix="react-select-elements"
                value={values.selectedProject}
                onChange={handleChangeSelectProject}
                options={projectOption}
                placeholder="Select Project"
                isSearchable={false}
              />
              {!isEmpty(values.errors.selectedProject) && (
                <p className="error-message">{values.errors.selectedProject}</p>
              )}
            </div>
            <div className="mb-40">
              <Select
                className="react-select-container react-select-container--addMember react-select-container--addMember--newTimesheetTask"
                classNamePrefix="react-select-elements"
                value={values.selectedTaskTitle}
                onChange={handleChangeSelectTaskTitle}
                options={taskOption}
                placeholder="Select Task Title"
                isSearchable={false}
              />
              {!isEmpty(values.errors.selectedTaskTitle) && (
                <p className="error-message">
                  {values.errors.selectedTaskTitle}
                </p>
              )}
            </div>
          </>
        ) : (
          <InputFieldEmailTextPassword
            containerClassName="container-login-flow-input container-login-flow-input--newTimesheetName"
            label=""
            name="bookingName"
            value={values.bookingName}
            onChange={handleChange}
            type="text"
            placeholder="Entry Name"
            autoFocus={true}
            error={
              !isEmpty(values.errors.bookingName) && values.errors.bookingName
            }
          />
        )}

        <div className="row mx-0 align-items-center mb-30">
          <InputFieldNumber
            containerClassName="container-login-flow-input container-login-flow-input--newTimesheet"
            label=""
            name="numOfHrsLogged"
            value={values.numOfHrsLogged}
            onChange={handleChangeNumber}
            placeholder="No of hours logged"
            autoFocus={true}
            error={
              !isEmpty(values.errors.numOfHrsLogged) &&
              values.errors.numOfHrsLogged
            }
          />
          <p className="font-14-semibold pb-30 color-white-45">
            or you can select the time range
          </p>
        </div>

        <div className="row mx-0 align-items-center timesheet-from-to-time-row">
          <DatePickerFromToTimeTimesheet
            title={true}
            fromTimeValue={values.fromTime}
            toTimeValue={values.toTime}
            handleChangeFromTime={handleChangeFromTime}
            handleChangeToTime={handleChangeToTime}
            defaultToTime={setHours(setMinutes(new Date(), 0), 17)}
          />
          <h3 className="font-24-extraBold common-peach-color-text-timesheet">
            03:30 Hrs
          </h3>
        </div>

        <div className="text-center pt-50">
          <GreenButtonSmallFont
            extraClassName="timesheet-add-entry-btn"
            onClick={handleOnClickUpdateTask}
            text="Save Entry"
          />
        </div>
      </div>
    );
  };

  /*=======================================================================
        main
  =======================================================================*/
  return (
    <>
      <GreenButtonSmallFont
        extraClassName={buttonClassName}
        onClick={onOpenModal}
        text={buttonText}
      />

      <Modal
        open={values.open}
        onClose={onCloseModal}
        closeOnEsc={false}
        closeOnOverlayClick={false}
        center
        classNames={{
          overlay: "customOverlay",
          modal: "customModal customModal--addNewTask",
          closeButton: "customCloseButton",
        }}
      >
        {/* close modal */}
        <span className="closeIconInModal" onClick={onCloseModal} />

        <div className="mb-50">
          <h1 className="add-meeting-title add-meeting-title--createNewTaskTitle">
            Edit Timesheet Entry
          </h1>
        </div>

        {renderScreen1()}
      </Modal>
    </>
  );
}

TimesheetEditEntry.defaultProps = {
  buttonText: (
    <>
      <i className="fa fa-plus"></i> Add New Timesheet Entry
    </>
  ),
  buttonClassName: "task-save-btn task-save-btn--timesheetNew",
};
