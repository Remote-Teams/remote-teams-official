import React, { useState, useEffect } from "react";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";
import Modal from "react-responsive-modal";
import InputFieldEmailTextPassword from "./../../desktop/common/InputFieldEmailTextPassword";
import GreenButtonSmallFont from "./../common/GreenButtonSmallFont";
import GrayButtonSmallFont from "./../common/GrayButtonSmallFont";
import DatePickerFromToDate from "./../common/DatePickerFromToDate";
import {
  createNewTaskAction,
  updateTaskById,
} from "./../../../store/actions/projectAction";
import Select from "react-select";
import isEmpty from "../../../store/validations/is-empty";
// import { validateAddTask } from "./../../../store/validations/projectValidation/AddTaskValidation";
import Toggle from "../common/Toggle";
import TaskMemberDisplayList from "../common/TaskMemberDisplayList";
import emoji from "node-emoji";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router";
import BookTheirCalenderSchedule from "./BookTheirCalenderSchedule";
import { validateAddTask } from "./../../../store/validations/projectValidation/AddTaskValidation";
import { addDays } from "date-fns";
import { maxLengths } from "../../../store/validations/maxLengths/MaxLengths";
import AskHimForWalkthrough from "./AskHimForWalkthrough";
const priorityOptions = [
  {
    img: "/img/project-details/task-low-priority-icon.svg",
    text: "Low",
  },
  {
    img: "/img/project-details/task-normal-priority-icon.svg",
    text: "Normal",
  },
  {
    img: "/img/project-details/task-important-priority-icon.svg",
    text: "Important",
  },
  {
    img: "/img/project-details/task-critical-priority-icon.svg",
    text: "Critical",
  },
];

export default function AddNewTask() {
  const dispatch = useDispatch();
  const history = useHistory();

  const [values, setValues] = useState({
    open: false,
    taskName: "",
    startDate: new Date(),
    endDate: addDays(new Date(), 5),
    selectedTaskStatus: {},
    assignToMembers: false,
    selectOption: "",
    displayListSelected: [],
    options: [],
    currentScreen: 0,
    emojiSelected: emoji.random().emoji,
    prioritySelected: priorityOptions[0].text,
    errors: {},
  });

  const [errors, setErrors] = useState({});

  const [taskStatusOptions, setTaskStatusOptions] = useState([]);
  const [resourceOption, setResourcesOption] = useState([]);
  const [allMemberSchedules, setAllMemberSchedules] = useState([]);
  const [startWalkthrough, setStartWalkthrough] = useState(false);

  const stackListOfBoard = useSelector(
    (state) => state.kanban.stackListOfBoard
  );
  const resources = useSelector((state) => state.resources.allResources);

  const bookCalenderAllSchedules = useSelector(
    (state) => state.bookCalender.bookCalenderAllSchedules
  );

  const bookAddedTaskData = useSelector(
    (state) => state.bookCalender.bookAddedTaskData
  );
  const updateTaskMemberLeftArray = useSelector(
    (state) => state.bookCalender.updateTaskMemberLeftArray
  );

  useEffect(() => {
    if (!isEmpty(stackListOfBoard)) {
      let newArray = [];
      stackListOfBoard.forEach((ele) => {
        newArray.push({ value: ele._id, label: ele.name });
      });
      setTaskStatusOptions(newArray);
      setValues({
        ...values,
        selectedTaskStatus: newArray[0],
      });
    }
  }, [stackListOfBoard]);

  useEffect(() => {
    if (!isEmpty(resources)) {
      let newArray = [];
      resources.forEach((ele) => {
        newArray.push({ value: ele._id, label: ele.name });
      });
      setResourcesOption(newArray);
      setValues({
        ...values,
        selectOption: newArray[0],
        displayListSelected: [newArray[0]],
      });
    }
  }, [resources]);

  useEffect(() => {
    if (!isEmpty(bookCalenderAllSchedules)) {
      setAllMemberSchedules(bookCalenderAllSchedules);
    } else {
      setAllMemberSchedules([]);
    }
  }, [bookCalenderAllSchedules]);

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
      taskName: "",
      startDate: new Date(),
      endDate: new Date(),
      // selectedTaskStatus: taskStatusOptions[0],
      assignToMembers: false,
      selectOption: "",
      displayListSelected: [],
      currentScreen: 0,
      emojiSelected: emoji.random().emoji,
      prioritySelected: priorityOptions[0].text,
    });
  };

  /*=============================================================
        handlers screen 1
  =============================================================*/

  const handleOnChangeToggle = (e) => {
    if (!e.target.checked) {
      setValues({
        ...values,
        [e.target.name]: e.target.checked,
        selectOption: "",
        displayListSelected: [],
      });
    } else {
      setValues({
        ...values,
        [e.target.name]: e.target.checked,
      });
    }
  };

  const handleChangeSelectTaskStatus = (selectedOption) => {
    setValues({ ...values, selectedTaskStatus: selectedOption, errors: {} });
    setErrors({});
  };

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

  const handleChange = (e) => {
    setValues({
      ...values,
      [e.target.name]: e.target.value,
      errors: {},
    });
    setErrors({});
  };

  /*=======================================================================
        arrowImgTag
  =======================================================================*/

  const arrowImgTag = (
    <img
      src="/img/project-details/arrow-right-white.svg"
      alt="next"
      className="arrow-img"
    />
  );

  /*=======================================================================
        renderScreen1
  =======================================================================*/

  const callbackAddTaskAndPipeline = (status, data) => {
    if (status === 200) {
      var userData = JSON.parse(localStorage.getItem("UserData"));
      onCloseModal();
      if (userData.demo === true) {
        setStartWalkthrough(true);
      }

      // const formData = data;
      // formData.members_left = formData.assignees;
      // formData.grade = "NEW_TASK";

      // dispatch(updateTaskById(formData._id, formData));
    }
  };

  const handleOnClickSkipAndAddTask = () => {
    var userData = JSON.parse(localStorage.getItem("UserData"));
    let projectData = JSON.parse(localStorage.getItem("projectData"));

    let assignedArray = [];
    if (!isEmpty(values.displayListSelected)) {
      values.displayListSelected.forEach((ele) => {
        assignedArray.push(ele.value);
      });
    }
    // onCloseModal();
    console.log(values);

    const { errors, isValid } = validateAddTask(values);

    if (!isValid) {
      console.log(errors);
      setErrors(errors);
    } else {
      const formData = {
        name: values.taskName,
        project: projectData._id,
        startDate: values.startDate.toISOString(),
        endDate: values.endDate.toISOString(),
        assignees: assignedArray,
        members_left: assignedArray,
        stage: values.selectedTaskStatus.value,
        additionObjects: {},
        priority: values.prioritySelected.toUpperCase(),
        emoji: values.emojiSelected,
        bookedBy: userData.name,
        // completionDate: "2020-05-01T07:03:47.995Z",
      };
      dispatch(createNewTaskAction(formData, callbackAddTaskAndPipeline));
    }
  };

  const callbackBookCalender = (status, data) => {
    if (status === 200) {
      setValues({
        ...values,
        currentScreen: 1,
      });
      // const formData = data;
      // formData.members_left = formData.assignees;
      // formData.grade = "NEW_TASK";

      // dispatch(updateTaskById(formData._id, formData));
    }
  };

  const handleOnClickBookTheirCalendar = () => {
    var userData = JSON.parse(localStorage.getItem("UserData"));
    let projectData = JSON.parse(localStorage.getItem("projectData"));

    let assignedArray = [];
    if (!isEmpty(values.displayListSelected)) {
      values.displayListSelected.forEach((ele) => {
        assignedArray.push(ele.value);
      });
    }
    // onCloseModal();
    // console.log(values);

    const { errors, isValid } = validateAddTask(values);

    if (!isValid) {
      console.log(errors);
      setErrors(errors);
    } else {
      const formData = {
        name: values.taskName,
        project: projectData._id,
        startDate: values.startDate.toISOString(),
        endDate: values.endDate.toISOString(),
        assignees: assignedArray,
        members_left: assignedArray,
        stage: values.selectedTaskStatus.value,
        additionObjects: {},
        priority: values.prioritySelected.toUpperCase(),
        emoji: values.emojiSelected,
        bookedBy: userData.name,
        // completionDate: "2020-05-01T07:03:47.995Z",
      };
      dispatch(createNewTaskAction(formData, callbackBookCalender));
    }
  };

  const callbackAddTask = (status) => {
    if (status === 200) {
      onCloseModal();
      var userData = JSON.parse(localStorage.getItem("UserData"));
      onCloseModal();
      if (userData.demo === true) {
        setStartWalkthrough(true);
      }
    }
  };

  const handleOnClickAddTask = () => {
    let projectData = JSON.parse(localStorage.getItem("projectData"));
    // onCloseModal();
    console.log(values);

    const { errors, isValid } = validateAddTask(values);

    if (!isValid) {
      console.log(errors);
      setErrors(errors);
    } else {
      const formData = {
        name: values.taskName,
        project: projectData._id,
        startDate: values.startDate.toISOString(),
        endDate: values.endDate.toISOString(),
        assignees: [],
        members_left: [],
        stage: values.selectedTaskStatus.value,
        additionObjects: {},
        priority: values.prioritySelected.toUpperCase(),
        emoji: values.emojiSelected,
        // completionDate: "2020-05-01T07:03:47.995Z",
      };
      dispatch(createNewTaskAction(formData, callbackAddTask));
    }
  };

  const handleOnClickRandomiseEmoji = () => {
    setValues({
      ...values,
      emojiSelected: emoji.random().emoji,
    });
  };

  const handleOnClickPriorityOption = (val) => (e) => {
    setValues({
      ...values,
      prioritySelected: val,
    });
  };

  const renderScreen1 = () => {
    return (
      <div className="create-new-task-screen-1">
        <div className="row mx-0 align-items-center justify-content-between create-new-task-modal-task-details-row">
          <h3 className="font-18-bold common-peach-color-text">Task Details</h3>
          <div>
            <span className="task-modal-emoji">{values.emojiSelected}</span>
            <GrayButtonSmallFont
              extraClassName="task-icon-randomise-btn"
              onClick={handleOnClickRandomiseEmoji}
              text={
                <>
                  <i className="fa fa-random"></i>
                  Randomise
                </>
              }
            />
          </div>
        </div>

        <InputFieldEmailTextPassword
          containerClassName="container-login-flow-input container-login-flow-input--taskName add-task-task-name-font"
          label="Name"
          name="taskName"
          value={values.taskName}
          onChange={handleChange}
          type="text"
          placeholder="Task Name"
          autoFocus={true}
          error={!isEmpty(errors.taskName) && errors.taskName}
          maxLength={maxLengths.char50}
        />

        <DatePickerFromToDate
          //labelStart="Start date"
          startDateValue={values.startDate}
          //labelEnd="End date"
          endDateValue={values.endDate}
          handleChangeStart={handleChangeStart}
          handleChangeEnd={handleChangeEnd}
          placeholderStart="Start date"
          placeholderEnd="End date"
        />

        <div className="mb-40">
          <Select
            className="react-select-container react-select-container--addMember react-select-container--addMember--newTask"
            classNamePrefix="react-select-elements"
            value={values.selectedTaskStatus}
            onChange={handleChangeSelectTaskStatus}
            options={taskStatusOptions}
            placeholder="New Stage"
            isSearchable={false}
          />
          {!isEmpty(values.errors.selectedTaskStatus) && (
            <p className="error-message">{values.errors.selectedTaskStatus}</p>
          )}
        </div>

        <div className="mb-30">
          <h3 className="task-modal-priority-title">priority</h3>
          <div className="row mx-0 align-items-center">
            {priorityOptions.map((data, index) => (
              <button
                key={index}
                className={
                  values.prioritySelected === data.text
                    ? "task-modal-priority-button task-modal-priority-button--active"
                    : "task-modal-priority-button"
                }
                onClick={handleOnClickPriorityOption(data.text)}
              >
                <img src={data.img} alt="" />
                <span>{data.text}</span>
              </button>
            ))}
          </div>
        </div>

        <h3 className="font-18-bold common-peach-color-text mb-20">
          Assign to members
        </h3>

        <Toggle
          containerClassName="timesheet-toggle-all-project-history timesheet-toggle-all-project-history--addTaskModal"
          name="assignToMembers"
          text1={"Yes"}
          text2={"No"}
          onChange={handleOnChangeToggle}
          defaultChecked={values.assignToMembers}
        />

        {values.assignToMembers && (
          <>
            <Select
              className="react-select-container react-select-container--addMember react-select-container--addMember--selectMember"
              classNamePrefix="react-select-elements"
              value={values.selectOption}
              onChange={handleChangeSelectClient}
              options={resourceOption}
              isSearchable={false}
              placeholder="Select Members"
            />

            <h4 className="add-new-task-selected-member-text">
              Selected members
            </h4>
            <TaskMemberDisplayList
              displayListSelected={values.displayListSelected}
              handleRemoveMember={handleRemoveMember}
            />
          </>
        )}

        {values.assignToMembers ? (
          <div className="text-center pt-50">
            <h5 className="task-would-you-like-text">
              Would you like to book their calendar?
            </h5>
            <div className="pt-40">
              <GrayButtonSmallFont
                extraClassName="task-skip-and-add-btn"
                onClick={handleOnClickSkipAndAddTask}
                text={"No, Let them decide"}
                //text={"Let them decide"}
              />
              <GreenButtonSmallFont
                extraClassName="task-save-btn"
                onClick={handleOnClickBookTheirCalendar}
                text={
                  <>
                    Yes, Select a time
                    {/*Book their calendar*/}
                    {arrowImgTag}
                  </>
                }
              />
            </div>
          </div>
        ) : (
          <div className="text-center pt-50">
            <GreenButtonSmallFont
              extraClassName="task-save-btn"
              onClick={handleOnClickAddTask}
              text={
                <>
                  Add Task
                  {arrowImgTag}
                </>
              }
            />
          </div>
        )}
      </div>
    );
  };

  /*======================================================================
        renderScreen2
  ======================================================================*/

  const handleOnSelectTab = (val) => {
    // activeIndexNewTaskBookCalendar
    localStorage.setItem("activeIndexNewTaskBookCalendar", val);
  };

  const handleOnClickGoBack = () => {
    setValues({
      ...values,
      currentScreen: 0,
    });
  };

  const callbackConfirm = (status) => {
    if (status === 200) {
      onCloseModal();
    }
  };

  const handleOnClickConfirm = () => {
    onCloseModal();
    // const formData = bookAddedTaskData;
    // formData.members_left = updateTaskMemberLeftArray;
    // formData.grade = "NEW_TASK";

    // dispatch(updateTaskById(formData._id, formData, callbackConfirm));
  };

  useEffect(() => {
    return () => {
      localStorage.removeItem("activeIndexNewTaskBookCalendar");
    };
  }, []);

  const getPerticularMemberSchedule = (memberData) => {
    let filteredSchedules = [];
    if (!isEmpty(memberData) && !isEmpty(allMemberSchedules)) {
      filteredSchedules = allMemberSchedules.filter(
        (schedule) => schedule.assignedTo === memberData.value
      );
    }

    return filteredSchedules;
  };

  const renderScreen2 = () => {
    return (
      <>
        <button className="task-go-back-btn" onClick={handleOnClickGoBack}>
          <i className="fa fa-chevron-left"></i>
          Go Back
        </button>
        <div className="add-new-task-modal-tabs">
          <Tabs
            defaultIndex={parseInt(
              localStorage.getItem("activeIndexNewTaskBookCalendar")
            )}
            onSelect={handleOnSelectTab}
          >
            <TabList>
              {values.displayListSelected.map((data, index) => (
                <Tab key={index}>
                  <div className="row mx-0 align-items-center flex-nowrap">
                    <div className="task-tab-img-person">
                      <img
                        src="/img/project-details/task-modal-member.svg"
                        alt="member"
                      />
                    </div>
                    <span className="font-14-bold">{data.label}</span>
                    <button
                      className="task-tab-remove-btn"
                      onClick={handleRemoveMember(index)}
                    >
                      <i className="fa fa-times"></i>
                    </button>
                  </div>
                </Tab>
              ))}
            </TabList>
            {values.displayListSelected.map((data, index) => (
              <TabPanel key={index}>
                {" "}
                <BookTheirCalenderSchedule
                  appointments={getPerticularMemberSchedule(data)}
                  memberId={data.value}
                />
              </TabPanel>
            ))}
          </Tabs>
        </div>

        <div className="text-center pt-50">
          <GreenButtonSmallFont
            extraClassName="task-save-btn"
            onClick={handleOnClickConfirm}
            text={
              <>
                Skip
                {arrowImgTag}
              </>
            }
          />
        </div>
      </>
    );
  };

  /*=======================================================================
        main
  =======================================================================*/
  return (
    <>
      <button className="project-detail-add-new-task-btn" onClick={onOpenModal}>
        + New Task
      </button>
      {startWalkthrough === true && <AskHimForWalkthrough />}

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

        <h1 className="add-meeting-title add-meeting-title--createNewTaskTitle">
          create new task
        </h1>

        {values.currentScreen === 0
          ? renderScreen1()
          : values.currentScreen === 1 && renderScreen2()}
      </Modal>
    </>
  );
}
