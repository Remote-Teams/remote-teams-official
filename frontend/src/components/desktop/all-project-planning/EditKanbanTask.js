import React, { useState, useEffect } from "react";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";
import Modal from "react-responsive-modal";
import InputFieldEmailTextPassword from "./../../desktop/common/InputFieldEmailTextPassword";
import GreenButtonSmallFont from "./../common/GreenButtonSmallFont";
import GrayButtonSmallFont from "./../common/GrayButtonSmallFont";
import DatePickerFromToDate from "./../common/DatePickerFromToDate";
import { updateTaskById } from "./../../../store/actions/projectAction";
// import { connect } from "react-redux";
import Select from "react-select";
import isEmpty from "../../../store/validations/is-empty";
// import { useDispatch } from "react-redux";
// import { validateAddTask } from "./../../../store/validations/projectValidation/AddTaskValidation";
import Toggle from "../common/Toggle";
import TaskMemberDisplayList from "../common/TaskMemberDisplayList";
import emoji from "node-emoji";
import { useDispatch, useSelector } from "react-redux";
import { maxLengths } from "../../../store/validations/maxLengths/MaxLengths";

const taskStatusOptions = [
  { value: "New", label: "New" },
  { value: "In Progress", label: "In Progress" },
  { value: "Completed", label: "Completed" },
  { value: "On Hold", label: "On Hold" },
  { value: "Overdue", label: "Overdue" },
];

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

function EditKanbanTask({
  buttonText,
  buttonClass,
  kanbanAllStacks,
  taskData,
}) {
  const dispatch = useDispatch();
  const [values, setValues] = useState({
    open: false,
    taskName: "",
    startDate: new Date(),
    endDate: new Date(),
    selectedTaskStatus: {},
    assignToMembers: false,
    selectOption: "",
    displayListSelected: [],
    options: [],
    currentScreen: 0,
    emojiSelected: "",
    errors: {},
    prioritySelected: "",
  });

  const [stageOptions, setStageOptions] = useState([]);
  const [selectedTaskStatus, setselectedTaskStatus] = useState({});

  const [resourceOption, setResourcesOption] = useState([]);

  const resources = useSelector((state) => state.resources.allResources);

  useEffect(() => {
    if (!isEmpty(resources)) {
      let newArray = [];
      resources.forEach((ele) => {
        newArray.push({ value: ele._id, label: ele.name });
      });
      setResourcesOption(newArray);
      // setValues({
      //   ...values,
      //   selectOption: newArray[0],
      //   displayListSelected: [newArray[0]],
      // });
    }
  }, [resources]);

  useEffect(() => {
    if (!isEmpty(kanbanAllStacks)) {
      let newArray = [];
      kanbanAllStacks.forEach((ele) => {
        newArray.push({ value: ele._id, label: ele.name });
      });
      setStageOptions(newArray);
      if (!isEmpty(taskData) && !isEmpty(kanbanAllStacks)) {
        let selectedOption = newArray.filter(
          (ele) => ele.label === taskData.stage.name
        );
        setselectedTaskStatus(selectedOption);
      }
      let defaultMemeber = !isEmpty(taskData.assignees)
        ? taskData.assignees.map((user) => ({
            value: user._id,
            label: user.firstName,
          }))
        : [];
      if (!isEmpty(taskData)) {
        // console.log(taskData);
        setValues({
          ...values,
          taskName: taskData.name,
          emojiSelected: taskData.emoji,
          startDate: new Date(taskData.startDate),
          endDate: new Date(taskData.endDate),
          prioritySelected:
            taskData.priority === "LOW"
              ? priorityOptions[0].text
              : taskData.priority === "NORMAL"
              ? priorityOptions[1].text
              : taskData.priority === "HIGH"
              ? priorityOptions[2].text
              : priorityOptions[3].text,
          displayListSelected: defaultMemeber,
          assignToMembers: !isEmpty(taskData.assignees) ? true : false,
        });
      }
    }
  }, [kanbanAllStacks, taskData]);

  // useEffect(() => {
  //   if (!isEmpty(taskData)) {
  //     console.log(taskData);
  //     setValues({
  //       ...values,
  //       taskName: taskData.name,
  //       emojiSelected: taskData.emoji,
  //       startDate: new Date(taskData.startDate),
  //       endDate: new Date(taskData.endDate),
  //     });
  //   }
  // }, [taskData]);

  /*=============================================================
        modal handlers 
  =============================================================*/
  const onOpenModal = () => {
    setValues({ ...values, open: true });
  };

  const onCloseModal = () => {
    setValues({ ...values, open: false });
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
    setValues({ ...values, errors: {} });
    setselectedTaskStatus(selectedOption);
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

  const handleOnClickSkipAndAddTask = () => {
    onCloseModal();
  };

  const handleOnClickBookTheirCalendar = () => {
    setValues({
      ...values,
      currentScreen: 1,
    });
  };

  const callBackUpdateTask = (status) => {
    if (status === 200) {
      onCloseModal();
    }
  };

  const handleOnClickAddTask = () => {
    let projectData = JSON.parse(localStorage.getItem("projectData"));

    let assignedArray = [];
    if (!isEmpty(values.displayListSelected)) {
      values.displayListSelected.forEach((ele) => {
        assignedArray.push(ele.value);
      });
    }
    // onCloseModal();

    const formData = taskData;
    formData.name = values.taskName;
    formData.startDate = values.startDate.toISOString();
    formData.endDate = values.endDate.toISOString();
    formData.stage = selectedTaskStatus.value;
    formData.assignees = assignedArray;
    formData.priority = values.prioritySelected.toUpperCase();
    formData.emoji = values.emojiSelected;

    if (selectedTaskStatus.label === "COMPLETED") {
      formData.completionDate = new Date().toISOString();
    }

    dispatch(updateTaskById(formData._id, formData, callBackUpdateTask));
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
          error={!isEmpty(values.errors.taskName) && values.errors.taskName}
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
            value={selectedTaskStatus}
            onChange={handleChangeSelectTaskStatus}
            options={stageOptions}
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

        <div className="text-center pt-50">
          <GreenButtonSmallFont
            extraClassName="task-save-btn"
            onClick={handleOnClickAddTask}
            text={
              <>
                Edit Task
                {arrowImgTag}
              </>
            }
          />
        </div>
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

  const handleOnClickConfirm = () => {
    onCloseModal();
  };

  useEffect(() => {
    return () => {
      localStorage.removeItem("activeIndexNewTaskBookCalendar");
    };
  }, []);

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
              <TabPanel key={index}> {data.label}</TabPanel>
            ))}
          </Tabs>
        </div>

        <div className="text-center pt-50">
          <GreenButtonSmallFont
            extraClassName="task-save-btn"
            onClick={handleOnClickConfirm}
            text={
              <>
                Confirm
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
      {/*<button className="project-detail-add-new-task-btn" onClick={onOpenModal}>
        edit kanban task
  </button>*/}
      <button
        className={
          buttonClass ? buttonClass : "project-detail-view-new-task-btn"
        }
        onClick={onOpenModal}
      >
        {buttonText ? (
          buttonText
        ) : (
          <>
            <i className="fa fa-pencil" />
          </>
        )}
      </button>

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
          edit task
        </h1>
        {values.currentScreen === 0
          ? renderScreen1()
          : values.currentScreen === 1 && renderScreen2()}
      </Modal>
    </>
  );
}

export default EditKanbanTask;
