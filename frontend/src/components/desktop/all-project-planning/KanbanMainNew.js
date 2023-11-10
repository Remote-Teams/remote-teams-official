import React, { useState, useEffect } from "react";
import Menu, { Item as MenuItem, Divider } from "rc-menu";
import EditKanBanList from "./EditKanBanList";
import DropdownIcon from "rc-dropdown";
import "rc-dropdown/assets/index.css";
import isEmpty from "../../../store/validations/is-empty";
import AddKanBanTask from "../../desktop/all-project-planning/AddKanBanTask";
import AddKanBanList from "../../desktop/all-project-planning/AddKanBanList";
import { useDispatch, useSelector } from "react-redux";
import {
  updateKanbanTaskById,
  deleteStack,
} from "./../../../store/actions/kanbanAction";
import Toast from "light-toast";
import DeleteStageWithTaskWarning from "./DeleteStageWithTaskWarning";
import DeleteCompletedStageWaring from "./DeleteCompletedStageWaring";
import ViewKanbanTask from "./ViewKanbanTask";
import EditKanbanTask from "./EditKanbanTask";
import { deleteTaskById } from "./../../../store/actions/projectAction";
import displaySmallText from "./../../../store/utils/sliceString";

function KanbanMainNew() {
  const dispatch = useDispatch();
  const [values, setValues] = useState({
    kanBanView: false,
    dragStartData: {},
    dragStartCardData: {},
    dragStartCardIndex: {},
    selectedCardName: "",
    selectedCardDescription: "",
    selectedCardIndex: "",
    selectedStackData: "",
    activeTabIndex: 0,
  });

  const [kanbanAllStacks, setKanbanAllStacks] = useState([]);
  const [deleteStageWarning, setDeleteStageWarning] = useState(false);
  const [
    deleteCompletedStageWarning,
    setDeleteCompletedStageWarning,
  ] = useState(false);

  const stackListOfBoard = useSelector(
    (state) => state.kanban.stackListOfBoard
  );

  /*=====================================
        add kanban task plus button
  ====================================*/

  const plusButton = (
    <>
      <i className="fa fa-plus" />
    </>
  );
  useEffect(() => {
    if (!isEmpty(stackListOfBoard)) {
      setKanbanAllStacks(stackListOfBoard);
    } else {
      setKanbanAllStacks([]);
    }
  }, [stackListOfBoard]);

  /*===============================================================================================
                                              kanban view
  ================================================================================================*/

  const callBackDeleteCard = (status) => {};

  const deleteCardHandler = () => {
    const {
      selectedCardIndex,
      selectedStackData,
      selectedCardName,
      selectedCardDescription,
    } = values;

    let finalPreviousStackData = selectedStackData;
    let finalPreviousCardData = selectedStackData.cards;
    finalPreviousCardData.splice(selectedCardIndex, 1);
    // console.log(cardData);
    finalPreviousStackData.cards = finalPreviousCardData;
    console.log(finalPreviousStackData);

    // this.props.updateStack(
    //   finalPreviousStackData._id,
    //   finalPreviousStackData,
    //   this.callBackDeleteCard
    // );
  };

  const updateCardHandler = () => {
    const {
      selectedCardIndex,
      selectedStackData,
      selectedCardName,
      selectedCardDescription,
    } = values;
    // console.log(selectedCardIndex, selectedStackData);
    let previousCardData = selectedStackData.cards;
    let previousStackData = selectedStackData;
    if (selectedCardIndex !== -1) {
      previousCardData[selectedCardIndex] = {
        name: selectedCardName,
        description: selectedCardDescription,
      };
    }

    previousStackData.cards = previousCardData;

    // this.props.updateStack(
    //   previousStackData._id,
    //   previousStackData,
    //   this.callBackUpdateCard
    // );

    console.log(previousCardData);
  };

  const callBackDeleteStack = (res) => {
    console.log(res);
    if (res.status === 400 && res.data.code === "STAGE_HAS_TASKS_CANT_DELETE") {
      setDeleteStageWarning(true);
    } else {
      setDeleteCompletedStageWarning(true);
    }
  };

  /*================================================
             Render Stack edit dropdown
  =================================================*/
  const onSelect = (action, stackData) => {
    if (action === "edit") {
      console.log("edit", stackData);
    } else {
      dispatch(deleteStack(stackData._id, callBackDeleteStack));
    }
  };

  const renderStackEditDropdown = (stackData) => {
    // const { admin } = this.state;
    // const { userRole } = this.props;
    const menu = (
      <Menu>
        {stackData.name !== "COMPLETED" && (
          <MenuItem onClick={() => onSelect("edit", stackData)}>
            <EditKanBanList stackData={stackData} />
          </MenuItem>
        )}
        <Divider />
        <MenuItem onClick={() => onSelect("delete", stackData)}>
          Delete Stage
        </MenuItem>
      </Menu>
    );

    return (
      <DropdownIcon
        trigger={["click"]}
        overlay={menu}
        animation="none"
        onVisibleChange={onVisibleChange}
      >
        <i className="fa fa-ellipsis-v" />
      </DropdownIcon>
    );
  };

  const onVisibleChange = () => {};

  /*==================================
        Drag And Drop Handler
  ===================================*/

  const onDragEndHandler = (e) => {
    // e.target.style.opacity = "";
    // e.currentTarget.style.background = "#ffffff";
    // e.currentTarget.style.color = "#000000";
  };
  const onDragStartHandler = (stackData, data, index) => (e) => {
    // console.log("Drag Start", stackData, data, index);

    setValues({
      ...values,
      dragStartStackData: stackData,
      dragStartCardData: data,
      dragStartCardIndex: index,
    });
  };

  const onDropHandler = (stackData) => (e) => {
    e.preventDefault();
    const {
      dragStartStackData,
      dragStartCardData,
      dragStartCardIndex,
    } = values;

    if (stackData !== dragStartStackData) {
      let finalPreviousStackData = dragStartStackData;
      let finalPreviousCardData = dragStartStackData.tasks;
      finalPreviousCardData.splice(dragStartCardIndex, 1);
      // console.log(cardData);
      finalPreviousStackData.tasks = finalPreviousCardData;
      console.log(finalPreviousStackData);

      stackData.tasks.push(dragStartCardData);
      // console.log(stackData);
      // dispatch(updateStack(finalPreviousStackData._id, finalPreviousStackData));
      // dispatch(updateStack(stackData._id, stackData));
      let formData = dragStartCardData;
      formData.stage = stackData._id;

      if (stackData.name === "COMPLETED") {
        formData.completionDate = new Date().toISOString();
      }

      console.log(formData);
      dispatch(updateKanbanTaskById(dragStartCardData._id, formData));
    }

    // console.log(this.state.dragStartData);
    // const { dragStartData } = this.state;

    // console.log("Drop Hanlder",e.dataTransfer, value );
  };
  const onDragOverHandler = (e) => {
    e.preventDefault();
    // console.log("DragOver", e);
  };

  const handleDelete = (card) => (e) => {
    console.log("Onclick delete!!");
    dispatch(deleteTaskById(card._id));
  };

  /*===================================
            Render Cards
  ====================================*/
  const onCardClickHandler = (cardData, stackData, cardIndex) => (e) => {
    // console.log(cardData, stackData, cardIndex);
    // setValues({
    //   ...values,
    //   selectedCardName: cardData.name,
    //   selectedCardDescription: cardData.description,
    //   selectedCardIndex: cardIndex,
    //   selectedStackData: stackData,
    // });
  };

  const renderCards = (stackData) => {
    let list =
      !isEmpty(stackData.tasks) &&
      stackData.tasks.map((card, index) => (
        <div
          onClick={onCardClickHandler(card, stackData, index)}
          key={index}
          className="list_single_card_container justify-content-between align-items-start"
          draggable="true"
          onDragStart={onDragStartHandler(stackData, card, index)}
          onDragEnd={onDragEndHandler}
        >
          {/*<div className="list_single_card_container__image"></div>*/}
          <p className="list_single_card_container__greenText">{card.name}</p>
          <div className="row mx-0 align-items-center justify-content-end w-100">
            <ViewKanbanTask kanbanAllStacks={kanbanAllStacks} taskData={card} />
            <EditKanbanTask kanbanAllStacks={kanbanAllStacks} taskData={card} />
            <button
              className="project-detail-view-new-task-btn mr-0"
              onClick={handleDelete(card)}
            >
              <i className="fa fa-trash" />
            </button>
          </div>
        </div>
      ));
    return list;
  };

  /*===========================================
             Scroll KanBan View
  =============================================*/

  const sideScroll = (element, direction, speed, distance, step) => {
    let scrollAmount = 0;
    var slideTimer = setInterval(function() {
      if (direction === "left") {
        element.scrollLeft -= step;
      } else {
        element.scrollLeft += step;
      }
      scrollAmount += step;
      if (scrollAmount >= distance) {
        window.clearInterval(slideTimer);
      }
    }, speed);
  };

  const nextHandler = () => {
    // console.log("hello");
    var container = document.getElementById("container");
    sideScroll(container, "right", 25, 300, 20);
  };

  const prevHandler = () => {
    var container = document.getElementById("container");
    sideScroll(container, "left", 25, 300, 20);
  };

  const renderKanBanViewOfPerticularBoard = () => {
    var boardData = JSON.parse(localStorage.getItem("boardData"));
    return (
      <>
        <div className="project-details-arrow-outer-div">
          <div
            //style={{ marginLeft: "80px", marginBottom: "20px" }}
            className="project-details-arrow-div"
          >
            {/*          <img
            onClick={prevHandler}
            id="slideBack"
            src={require("./../../../assets/img/kanban/prev.svg")}
            alt=""
          />
          &nbsp;
          <img
            id="slide"
            onClick={nextHandler}
            src={require("./../../../assets/img/kanban/next.svg")}
            alt=""
/>*/}
            {/* arrow left */}
            <button
              className="timesheet-table-week-view__arrow timesheet-table-week-view__arrow--kanban-left"
              onClick={prevHandler}
            >
              <i className="fa fa-arrow-left cursor-pointer"></i>
            </button>
            {/* arrow right */}
            <button
              className="timesheet-table-week-view__arrow timesheet-table-week-view__arrow--kanban-right"
              onClick={nextHandler}
            >
              <i className="fa fa-arrow-right cursor-pointer"></i>
            </button>
          </div>
        </div>
        <div id="container" className="kanban_view_main_container ml-0">
          {!isEmpty(kanbanAllStacks) &&
            kanbanAllStacks.map((stack, index) => {
              return (
                <div key={index} className="kanban_list_columns">
                  <div className="heads">
                    <div className="stack_heading_dropdown stack_heading_dropdown--list row mx-0 flex-nowrap">
                      <h3 className="heads__title heads__title--list">
                        <span>{displaySmallText(stack.name, 15, true)} </span>
                      </h3>
                      <AddKanBanTask
                        stackData={stack}
                        buttonText={plusButton}
                        buttonClass={"project-detail-add-new-task-plus-btn"}
                      />
                      {renderStackEditDropdown(stack)}
                    </div>
                  </div>
                  <div
                    className="list_conatiner"
                    onDrop={onDropHandler(stack)}
                    onDragOver={onDragOverHandler}
                  >
                    {renderCards(stack)}
                    <AddKanBanTask
                      stackData={stack}
                      buttonText={"+ Add New Task"}
                    />
                  </div>
                </div>
              );
            })}
        </div>
        <AddKanBanList />
      </>
    );
  };

  return (
    <div>
      {deleteStageWarning === true && (
        <DeleteStageWithTaskWarning
          setDeleteStageWarning={setDeleteStageWarning}
        />
      )}{" "}
      {deleteCompletedStageWarning === true && (
        <DeleteCompletedStageWaring
          setDeleteCompletedStageWarning={setDeleteCompletedStageWarning}
        />
      )}
      {renderKanBanViewOfPerticularBoard()}
    </div>
  );
}

export default KanbanMainNew;
