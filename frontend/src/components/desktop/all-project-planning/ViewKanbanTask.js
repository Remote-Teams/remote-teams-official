import React, { useEffect } from "react";
import Modal from "react-responsive-modal";
import { useState } from "react";
import Select from "react-select";
import { Fragment } from "react";
import isEmpty from "../../../store/validations/is-empty";
import { format } from "date-fns";
import { useDispatch } from "react-redux";
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

function ViewKanbanTask({ kanbanAllStacks, taskData }) {
  const dispatch = useDispatch();
  const [values, setValues] = useState({
    open: false,
    selectOption: "",
  });

  const [stageOptions, setStageOptions] = useState([]);
  const [selectOption, setSelectOption] = useState([]);

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
        setSelectOption(selectedOption);
      }
    }

    // console.log(taskData);
  }, [kanbanAllStacks, taskData]);

  /*=====================================
            handler
  =====================================*/

  const onOpenModal = () => {
    setValues({ open: true });
  };

  const onCloseModal = () => {
    setValues({ open: false });
  };

  const callBackUpdateTask = (status) => {
    if (status === 200) {
      onCloseModal();
    }
  };

  const handleChangeSelectStage = (selectedOption) => {
    setValues({
      ...values,
      selectOption: selectedOption,
    });
    // console.log(selectedOption);
    const formData = taskData;
    formData.stage = selectedOption.value;
    dispatch(updateTaskById(formData._id, formData, callBackUpdateTask));
  };

  /*================================================
               main
  ===============================================*/

  return (
    <>
      {/*<button className="project-detail-add-new-task-btn" onClick={onOpenModal}>
       view kanban task
  </button>*/}
      <button
        className="project-detail-view-new-task-btn"
        onClick={onOpenModal}
      >
        <i className="fa fa-eye" />
      </button>

      <Modal
        open={values.open}
        onClose={onCloseModal}
        closeOnEsc={false}
        closeOnOverlayClick={false}
        center
        classNames={{
          overlay: "customOverlay",
          modal: "customModal customModal--viewNewTask",
          closeButton: "customCloseButton",
        }}
      >
        {/* close modal */}
        <span className="closeIconInModal" onClick={onCloseModal} />

        {/*<h1 className="add-meeting-title add-meeting-title--createNewTaskTitle">
          view kanban task
      </h1>*/}
        <h2 className="view-kanban-task-text-1">
          <span>{taskData.emoji}</span>
          {!isEmpty(taskData) && taskData.project.name}
        </h2>
        <div className="view-kanban-task-title-div">
          <h1 className="view-kanban-task-text-2">
            {!isEmpty(taskData) && taskData.name}
          </h1>
        </div>
        <div className="row mx-0">
          <h3 className="view-kanban-task-text-3">
            date
            <span>
              {" "}
              {format(taskData.startDate, "do MMM")} -{" "}
              {format(taskData.endDate, "do MMM")}
            </span>{" "}
          </h3>
          {/* <h3 className="view-kanban-task-text-3 view-kanban-task-text-3--time">
            time{" "}
            <span>
              {format(taskData.startDate, "HH:mm a")} -{" "}
              {format(taskData.endDate, "HH:mm a")}
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
            {!isEmpty(taskData.assignees) &&
              taskData.assignees.map((data, index) => (
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
      </Modal>
    </>
  );
}

export default ViewKanbanTask;
