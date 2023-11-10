import React, { useEffect } from "react";
import { useState } from "react";
import Select from "react-select";
import { Fragment } from "react";
import { useDispatch, useSelector } from "react-redux";
import isEmpty from "../../../store/validations/is-empty";
import { format } from "date-fns";
import { updateTaskById } from "./../../../store/actions/projectAction";
import AddKanbanTask from "./AddKanBanTask";

function ViewGantDummyTask({ style }) {
  /*=====================================
            handler
  =====================================*/

  return (
    <div
      style={{
        position: "absolute",
        marginTop: "70px",
        marginLeft: style.left,
      }}
      className="view-gantt-task-popup view-gantt-task-popup--dummydata"
    >
      {/* if portal not used please uncomment above inline style */}
      <div className="gantt-view-task-div">
        {/* <span className="closeIconInModal" onClick={() => onCloseHandler()} /> */}
        <div className="gantt-view-task-div-dummy-text-div">
          <p className="gantt-view-task-div-dummy-text1">
            So glad you did that!
          </p>
          <p className="gantt-view-task-div-dummy-text2">
            This is your project Schedule
          </p>
        </div>
        <p className="gantt-view-task-div-dummy-text3">
          Where you can plan your project tasks{" "}
        </p>
        <p className="gantt-view-task-div-dummy-text4">How?</p>
        <p className="gantt-view-task-div-dummy-text3">
          Well you can just click that bright and shiny green button that <br />{" "}
          calls itself “+ new Task”
        </p>
        <AddKanbanTask
          buttonClass="gantt-view-task-div-dummy-text4 gantt-view-task-div-dummy-text4--btn mb-0"
          buttonText="Come’ on try it out!"
        />
        {/*<p className="gantt-view-task-div-dummy-text4 mb-0">
          Come’ on try it out!
    </p>*/}
      </div>
    </div>
  );
}

export default ViewGantDummyTask;
