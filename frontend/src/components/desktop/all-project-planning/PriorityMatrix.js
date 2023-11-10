import React, { useState, useEffect } from "react";
import DropdownIcon from "rc-dropdown";
import "rc-dropdown/assets/index.css";
import Menu, { Item as MenuItem, Divider } from "rc-menu";
import { useDispatch, useSelector } from "react-redux";
import isEmpty from "../../../store/validations/is-empty";
import {
  deleteTaskById,
  updateTaskById,
} from "./../../../store/actions/projectAction";

const priorityMetrixRowOne = [
  {
    priorityName: "LOW",

    emoji: "🍪",
  },
  {
    priorityName: "NORMAL",

    emoji: "⏳",
  },
];

const priorityMetrixRowTwo = [
  {
    priorityName: "IMPORTANT",

    emoji: "🚨",
  },
  {
    priorityName: "CRITICAL",

    emoji: "🔥",
  },
];

export default function PriorityMatrix() {
  const dispatch = useDispatch();

  const allTasks = useSelector((state) => state.projects.allTasks);
  const [values, setValues] = useState({
    lowData: [],
    normalData: [],
    importantData: [],
    criticalData: [],
  });
  const [cardData, setCardData] = useState({});

  useEffect(() => {
    if (!isEmpty(allTasks)) {
      let lowData = [];
      let normalData = [];
      let importantData = [];
      let criticalData = [];

      lowData = allTasks.filter((ele) => ele.priority === "LOW");
      normalData = allTasks.filter((ele) => ele.priority === "NORMAL");
      importantData = allTasks.filter((ele) => ele.priority === "IMPORTANT");
      criticalData = allTasks.filter((ele) => ele.priority === "CRITICAL");

      setValues({
        ...values,
        lowData: lowData,
        normalData: normalData,
        importantData: importantData,
        criticalData: criticalData,
      });
    } else {
      setValues({
        ...values,
        lowData: [],
        normalData: [],
        importantData: [],
        criticalData: [],
      });
    }
  }, [allTasks]);

  /**=======================================================
   *                        renderDropDown
   *=======================================================*/
  const onVisibleChange = () => {
    console.log("handle visible");
  };

  const onSelect = (data) => (e) => {
    console.log("onClick select");
    dispatch(deleteTaskById(data._id));
  };

  const renderDropDown = (data) => {
    const menu = (
      <Menu>
        <MenuItem onClick={onSelect(data)}>Delete</MenuItem>
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

  /*==================================
        Drag And Drop Handler
  ===================================*/

  const onDragEndHandler = (e) => {
    // e.target.style.opacity = "";
    // e.currentTarget.style.background = "#ffffff";
    // e.currentTarget.style.color = "#000000";
  };
  const onDragStartHandler = (data) => (e) => {
    console.log("Drag Start", data);
    setCardData(data);
  };

  const callBackUpdateTask = () => {};

  const onDropHandler = (stackData) => (e) => {
    e.preventDefault();
    console.log(stackData);
    console.log(cardData);
    const formData = cardData;
    formData.priority = stackData.priorityName;
    dispatch(updateTaskById(formData._id, formData, callBackUpdateTask));
  };
  const onDragOverHandler = (e) => {
    e.preventDefault();
    // console.log("DragOver", e);
  };

  const handleDelete = (card) => (e) => {
    console.log("Onclick delete!!");
    dispatch(deleteTaskById(card._id));
  };

  /**=======================================================
   *                        renderLow
   *=======================================================*/
  const renderLow = () => {
    return (
      <>
        <div className="priority-matrix-main-card mr-30">
          <div className="priority-matrix-main-card-title-div">
            <h3 className="priority-matrix-main-card-title">
              <span>🍪</span>Low
            </h3>
          </div>
          <div className="priority-matrix-main-card-content-div priority-matrix-main-card-content-div--low row mx-0 align-items-start justify-content-between">
            {!isEmpty(values.lowData) &&
              values.lowData.map((data, index) => (
                <div
                  className="priority-matrix-task-card-outer-div"
                  key={index}
                >
                  <div className="priority-matrix-task-card row mx-0 align-items-center flex-nowrap justify-content-between">
                    <img
                      src={require("../../../assets/img/projects-detail/priority-matrix-left-icon.svg")}
                      className="priority-matrix-left-icon-img"
                      alt=""
                    />
                    <h5 className="priority-matrix-task-name">
                      <span>{data.emoji}</span>
                      {data.name}
                    </h5>
                    {renderDropDown(data)}
                    {/*<i className="fa fa-ellipsis-v" />*/}
                  </div>
                </div>
              ))}
          </div>
          {/* <div className="mb-20 mt-20 text-center row mx-0 justify-content-center align-items-center">
            <img
              src={require("../../../assets/img/projects-detail/low-icon-one.svg")}
              className="low-icon-one-img"
              alt=""
            />
            <img
              src={require("../../../assets/img/projects-detail/low-icon-two.svg")}
              className="low-icon-one-img"
              alt=""
            />
            <img
              src={require("../../../assets/img/projects-detail/low-icon-three.svg")}
              className="low-icon-one-img"
              alt=""
            />
          </div> */}
        </div>
      </>
    );
  };
  /*=====================================================================
                     renderNormal
 ====================================================================*/
  const renderNormal = () => {
    return (
      <>
        <div className="priority-matrix-main-card">
          <div className="priority-matrix-main-card-title-div priority-matrix-main-card-title-div--normal">
            <h3 className="priority-matrix-main-card-title ">
              <span>⏳</span>NORMAL
            </h3>
          </div>
          <div className="priority-matrix-main-card-content-div row mx-0 align-items-start justify-content-between">
            {!isEmpty(values.normalData) &&
              values.normalData.map((data, index) => (
                <div
                  className="priority-matrix-task-card-outer-div"
                  key={index}
                >
                  <div className="priority-matrix-task-card priority-matrix-task-card--normal row mx-0 align-items-center flex-nowrap justify-content-between">
                    <img
                      src={require("../../../assets/img/projects-detail/priority-matrix-left-icon.svg")}
                      className="priority-matrix-left-icon-img"
                      alt=""
                    />
                    <h5 className="priority-matrix-task-name">
                      <span>{data.emoji}</span> {data.name}
                    </h5>
                    {renderDropDown(data)}
                    {/*<i className="fa fa-ellipsis-v" />*/}
                  </div>
                </div>
              ))}
          </div>
        </div>
      </>
    );
  };
  /*=====================================================================
                     renderImportant
 ====================================================================*/
  const renderImportant = () => {
    return (
      <>
        <div className="priority-matrix-main-card mr-30">
          <div className="priority-matrix-main-card-title-div priority-matrix-main-card-title-div--important">
            <h3 className="priority-matrix-main-card-title ">
              <span>🚨</span>IMPORTANT
            </h3>
          </div>
          <div className="priority-matrix-main-card-content-div row mx-0 align-items-start justify-content-between">
            {!isEmpty(values.importantData) &&
              values.importantData.map((data, index) => (
                <div
                  className="priority-matrix-task-card-outer-div"
                  key={index}
                >
                  <div className="priority-matrix-task-card priority-matrix-task-card--important row mx-0 align-items-center flex-nowrap justify-content-between">
                    <img
                      src={require("../../../assets/img/projects-detail/priority-matrix-left-icon.svg")}
                      className="priority-matrix-left-icon-img"
                      alt=""
                    />
                    <h5 className="priority-matrix-task-name">
                      <span>{data.emoji}</span> {data.name}
                    </h5>
                    {renderDropDown(data)}
                    {/*<i className="fa fa-ellipsis-v" />*/}
                  </div>
                </div>
              ))}
          </div>
        </div>
      </>
    );
  };
  /*=====================================================================
                     renderCritical
 ====================================================================*/
  const renderCritical = () => {
    return (
      <>
        <div className="priority-matrix-main-card">
          <div className="priority-matrix-main-card-title-div priority-matrix-main-card-title-div--critical">
            <h3 className="priority-matrix-main-card-title ">
              <span>🔥</span>CRITICAL
            </h3>
          </div>
          <div className="priority-matrix-main-card-content-div justify-content-between row mx-0 align-items-start">
            {!isEmpty(values.criticalData) &&
              values.criticalData.map((data, index) => (
                <div
                  className="priority-matrix-task-card-outer-div"
                  key={index}
                >
                  <div className="priority-matrix-task-card priority-matrix-task-card--critical row mx-0 align-items-center flex-nowrap justify-content-between">
                    <img
                      src={require("../../../assets/img/projects-detail/priority-matrix-left-icon.svg")}
                      className="priority-matrix-left-icon-img"
                      alt=""
                    />
                    <h5 className="priority-matrix-task-name">
                      <span>{data.emoji}</span> {data.name}
                    </h5>
                    {renderDropDown(data)}
                    {/*<i className="fa fa-ellipsis-v" />*/}{" "}
                  </div>
                </div>
              ))}
          </div>
        </div>
      </>
    );
  };

  const renderCards = (stackData) => {
    let priorityData =
      stackData.priorityName === "LOW"
        ? values.lowData
        : stackData.priorityName === "NORMAL"
        ? values.normalData
        : stackData.priorityName === "IMPORTANT"
        ? values.importantData
        : values.criticalData;
    let list =
      !isEmpty(priorityData) &&
      priorityData.map((data, index) => (
        <div
          className="priority-matrix-task-card-outer-div"
          key={index}
          draggable="true"
          onDragStart={onDragStartHandler(data)}
          onDragEnd={onDragEndHandler}
        >
          <div className="priority-matrix-task-card row mx-0 align-items-center flex-nowrap justify-content-between">
            <img
              src={require("../../../assets/img/projects-detail/priority-matrix-left-icon.svg")}
              className="priority-matrix-left-icon-img"
              alt=""
            />
            <h5 className="priority-matrix-task-name">
              <span>{data.emoji}</span> {data.name}
            </h5>
            {renderDropDown(data)}
            {/*<i className="fa fa-ellipsis-v" />*/}
          </div>
        </div>
      ));

    return list;
  };

  return (
    <>
      <div className="priority-matrix-main-div row mx-0 align-items-start flex-nowrap">
        {!isEmpty(priorityMetrixRowOne) &&
          priorityMetrixRowOne.map((stack, index) => {
            return (
              <div
                key={index}
                onDrop={onDropHandler(stack)}
                onDragOver={onDragOverHandler}
                className="priority-matrix-main-card mr-30"
              >
                <div
                  className={
                    stack.priorityName === "LOW"
                      ? "priority-matrix-main-card-title-div"
                      : "priority-matrix-main-card-title-div priority-matrix-main-card-title-div--normal"
                  }
                >
                  <h3 className="priority-matrix-main-card-title">
                    <span>{stack.emoji}</span>
                    {stack.priorityName}
                  </h3>
                </div>
                <div className="priority-matrix-main-card-content-div priority-matrix-main-card-content-div--low row mx-0 align-items-start justify-content-between">
                  {renderCards(stack)}
                </div>
              </div>
            );
          })}
      </div>
      <div className="row mx-0 align-items-start flex-nowrap">
        {!isEmpty(priorityMetrixRowTwo) &&
          priorityMetrixRowTwo.map((stack, index) => {
            return (
              <div
                key={index}
                onDrop={onDropHandler(stack)}
                onDragOver={onDragOverHandler}
                className="priority-matrix-main-card mr-30"
              >
                <div
                  className={
                    stack.priorityName === "IMPORTANT"
                      ? "priority-matrix-main-card-title-div priority-matrix-main-card-title-div--important"
                      : "priority-matrix-main-card-title-div priority-matrix-main-card-title-div--critical"
                  }
                >
                  <h3 className="priority-matrix-main-card-title">
                    <span>{stack.emoji}</span>
                    {stack.priorityName}
                  </h3>
                </div>
                <div className="priority-matrix-main-card-content-div priority-matrix-main-card-content-div--low row mx-0 align-items-start justify-content-between">
                  {renderCards(stack)}
                </div>
              </div>
            );
          })}
      </div>
    </>
    // <>
    //   <div className="priority-matrix-main-div row mx-0 align-items-start flex-nowrap">
    //     {/**low */}
    //     {renderLow()}
    //     {/** Normal */}
    //     {renderNormal()}
    //   </div>
    //   <div className="row mx-0 align-items-start flex-nowrap">
    //     {/**  IMPORTANT */}
    //     {renderImportant()}
    //     {/**   CRITICAL */}
    //     {renderCritical()}
    //   </div>
    // </>
  );
}
