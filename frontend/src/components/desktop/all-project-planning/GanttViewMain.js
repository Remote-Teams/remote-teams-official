import React, { useState, useEffect } from "react";
import isEmpty from "../../../store/validations/is-empty";
import GanttChartTimeline from "./../gantt-chart-timeline/GanttChartTimeline";
import { useSelector } from "react-redux";
import EditNewTask from "./EditNewTask";

function GanttViewMain() {
  const [values, setValues] = useState({ allModules: [] });

  return (
    <div className="gantt_view_main_container">
      <EditNewTask />
      <GanttChartTimeline />
    </div>
  );
}

export default GanttViewMain;
