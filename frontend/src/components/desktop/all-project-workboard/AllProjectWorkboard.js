import React from "react";
import { Fragment } from "react";
import WorkboardContent from "./../../desktop/workboard/WorkboardContent";

export default function AllProjectWorkboard() {
  /*=================================================
                renderMain
  =================================================*/
  return (
    <div>
      <h2 className="workboard-list-of-boards">list of boards</h2>
      <WorkboardContent />
    </div>
  );
}
