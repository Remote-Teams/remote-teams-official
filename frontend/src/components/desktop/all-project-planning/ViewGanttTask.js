import React, { useEffect } from "react";
import { useState } from "react";
import Select from "react-select";
import { Fragment } from "react";
import { useDispatch, useSelector } from "react-redux";
import isEmpty from "../../../store/validations/is-empty";
import { format } from "date-fns";
import { updateTaskById } from "./../../../store/actions/projectAction";

// const stageOption = [
//   { value: "New", label: "New" },
//   { value: "In Progress", label: "In Progress" },
//   { value: "Completed", label: "Completed" },
//   { value: "On Hold", label: "On Hold" },
//   { value: "Overdue", label: "Overdue" },
// ];
const dummyData = [
  {
    id: 1,
    imgPath: require("../../../assets/img/dummy/all-projects-discussion-card-img.svg"),
  },
  {
    id: 2,
    imgPath: require("../../../assets/img/dummy/all-projects-discussion-card-img.svg"),
  },

  {
    id: 3,
    imgPath: require("../../../assets/img/dummy/all-projects-discussion-card-img.svg"),
  },
];

function ViewGanttTask({
  style,
  item,
  onCloseHandler,
  editTaskHandler,
  deleteHanlder,
}) {
  const dispatch = useDispatch();

  const [stageOptions, setStageOptions] = useState([]);
  const [selectOption, setSelectOption] = useState([]);

  const stackListOfBoard = useSelector(
    (state) => state.kanban.stackListOfBoard
  );

  const [values, setValues] = useState({ stageOption: "" });

  useEffect(() => {
    if (!isEmpty(stackListOfBoard)) {
      let newArray = [];
      stackListOfBoard.forEach((ele) => {
        newArray.push({ value: ele._id, label: ele.name });
      });
      setStageOptions(newArray);
      if (!isEmpty(item) && !isEmpty(stackListOfBoard)) {
        let selectedOption = newArray.filter(
          (ele) => ele.label === item.stage.name
        );
        setSelectOption(selectedOption);
      }
    }
  }, [stackListOfBoard]);

  /*=====================================
            handler
  =====================================*/

  const callBackUpdateTask = (status) => {
    if (status === 200) {
      onCloseHandler();
    }
  };

  const handleChangeSelectStage = (selectedOption) => {
    setValues({
      ...values,
      stageOption: selectedOption,
    });
    console.log(selectedOption);
    const formData = item;
    formData.stage = selectedOption.value;
    if (selectedOption.label === "COMPLETED") {
      formData.completionDate = new Date().toISOString();
    }
    dispatch(updateTaskById(formData._id, formData, callBackUpdateTask));
  };

  let projectData = JSON.parse(localStorage.getItem("projectData"));
  return (
    <div
      style={{
        position: "absolute",
        marginTop: "70px",
        marginLeft: style.left,
      }}
      className="view-gantt-task-popup"
    >
      {/* if portal not used please uncomment above inline style */}
      <div className="gantt-view-task-div">
        <span className="closeIconInModal" onClick={() => onCloseHandler()} />
        <h2 className="view-kanban-task-text-1">
          <span>{item.emoji}</span>
          {projectData.name}
        </h2>
        <div className="view-kanban-task-title-div row mx-0 align-items-center justify-content-between flex-nowrap">
          <h1 className="view-kanban-task-text-2">{item.name}</h1>
          <div className="row mx-0 flex-nowrap">
            <button
              onClick={() => editTaskHandler()}
              className="view-kanban-task-edit-btn flex-nowrap row mx-0"
            >
              <img
                src={require("../../../assets/img/icons/dashboard-to-do-edit-icon.svg")}
                alt="edit"
                className="view-kanban-task-edit-img"
              />
              Edit
            </button>
            <button
              onClick={() => deleteHanlder(item)}
              className="view-kanban-task-edit-btn mr-0 flex-nowrap row mx-0"
            >
              <img
                src={require("../../../assets/img/icons/dashboard-to-do-delete-icon.svg")}
                alt="delete"
                className="view-kanban-task-edit-img"
              />
              Delete
            </button>
          </div>
        </div>
        <div className="row mx-0">
          <h3 className="view-kanban-task-text-3">
            date
            <span>
              {" "}
              {format(item.startDate, "Do MMM")} -{" "}
              {format(item.endDate, "Do MMM")}
            </span>{" "}
          </h3>
          {/* <h3 className="view-kanban-task-text-3 view-kanban-task-text-3--time">
            time{" "}
            <span>
              {" "}
              {format(item.startDate, "HH:mm a")} -{" "}
              {format(item.endDate, "HH:mm a")}
            </span>
          </h3> */}
        </div>
        <div>
          <h3 className="view-kanban-task-text-3 pt-30">stage</h3>
          <Select
            className="react-select-container react-select-container--view-kanban-task mt-10"
            classNamePrefix="react-select-elements"
            value={selectOption}
            onChange={handleChangeSelectStage}
            options={stageOptions}
            isSearchable={false}
            placeholder="Select Stage"
          />
        </div>
        <div>
          <h3 className="view-kanban-task-text-3 pt-20">Collaborators</h3>
          <div className="row mx-0 pt-10 flex-nowrap pl-30">
            {!isEmpty(item.assignees) &&
              item.assignees.map((data, index) => (
                <Fragment key={index}>
                  <img
                    src={require("../../../assets/img/dummy/all-projects-discussion-card-img.svg")}
                    alt="collaborator"
                    className="view-kanban-task-collaborators-img"
                  />
                </Fragment>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ViewGanttTask;
