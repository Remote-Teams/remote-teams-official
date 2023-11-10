import React, { useState, useEffect } from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-alpine.css";
import { useSelector } from "react-redux";
import isEmpty from "../../../store/validations/is-empty";

export default function TasksLoggedHoursTable() {
  let taskNameRenderer = function(params) {
    return `<span class="task-status-hours-logged-table-text-1">
        ${params.value}
      </span>`;
  };

  let projectNameRenderer = function(params) {
    return `<span class="task-status-hours-logged-table-text-2">
        ${params.value}
      </span>`;
  };

  let hoursLoggedRenderer = function(params) {
    return `<span class="report-project-status-card-title-2 task-status-hours-logged-table-text-3">
        ${params.value}
      </span>`;
  };

  const [values, setValues] = useState({
    // ag-grid table
    columnDefs: [
      {
        headerName: "TASK NAME",
        field: "TASK_NAME",
        width: 140,
        cellRenderer: taskNameRenderer,
      },
      {
        headerName: "PROJECT NAME",
        field: "PROJECT_NAME",
        width: 140,
        cellRenderer: projectNameRenderer,
      },
      {
        headerName: "HOURS LOGGED",
        field: "HOURS_LOGGED",
        width: 140,
        cellRenderer: hoursLoggedRenderer,
      },
    ],
    rowData: [
      // {
      //   TASK_NAME: "Task Name",
      //   PROJECT_NAME: "Project Name",
      //   HOURS_LOGGED: "100 hours",
      // },
      // {
      //   TASK_NAME: "Task Name",
      //   PROJECT_NAME: "Project Name",
      //   HOURS_LOGGED: "100 hours",
      // },
      // {
      //   TASK_NAME: "Task Name",
      //   PROJECT_NAME: "Project Name",
      //   HOURS_LOGGED: "100 hours",
      // },
    ],
  });

  const taskWithMostLoggedHors = useSelector(
    (state) => state.reports.taskWithMostLoggedHors
  );

  useEffect(() => {
    if (!isEmpty(taskWithMostLoggedHors)) {
      let finalArray = [];
      let filterData = taskWithMostLoggedHors.forEach((element) => {
        let object = {
          TASK_NAME: element.taskName,
          PROJECT_NAME: element.projectName,
          HOURS_LOGGED: element.totalHours,
        };

        finalArray.push(object);
      });
      setValues({
        ...values,
        rowData: finalArray,
      });
    } else {
      setValues({
        ...values,
        rowData: [],
      });
    }
  }, [taskWithMostLoggedHors]);

  return (
    <>
      <div
        className="ag-theme-alpine-dark ag-grid-custom-table ag-grid-custom-table--reports"
        style={{
          height: "190px",
          width: "100%",
        }}
      >
        <AgGridReact
          columnDefs={values.columnDefs}
          rowData={values.rowData}
        ></AgGridReact>
      </div>
    </>
  );
}
