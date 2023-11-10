import React, { Component } from "react";
import isEmpty from "../../../store/validations/is-empty";
import Select from "react-select";
import ReportsTabPanelTitle from "./ReportsTabPanelTitle";
import TasksStatusReportDoughnutChart from "./TasksStatusReportDoughnutChart";

import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-alpine.css";

//import imgPerson from "../../../assets/img/dummy/access-role-resource.svg";
import imgPerson from "../../../assets/img/dummy/new-profile-without-border.png";

import { connect } from "react-redux";
import { getAllProjectAction } from "./../../../store/actions/projectAction";
import {
  // getTaskImportantDistributionByProject,
  getTaskStatusReportTableData,
  getDistributionOfTasksByProjectChart,
  getDistributionOfTasksByPriorityChart,
  taskWithMostLoggedHoursOverall,
} from "./../../../store/actions/reportAction";
import dateFns from "date-fns";
import TasksStatusReportBarGraph from "./TasksStatusReportBarGraph";
import TasksLoggedHoursTable from "./TasksLoggedHoursTable";
import TasksByImportancePerProjectGraph from "./TasksByImportancePerProjectGraph";
import { getProjectTaskCopletion } from "./../../../store/actions/dashboardAction";

const dummyData = [1, 2, 3, 4, 5, 6];

// const projectOptions = [
//   { value: "Project 1", label: "Project 1" },
//   { value: "Project 2", label: "Project 2" },
//   { value: "Project 3", label: "Project 3" },
//   { value: "Project 4", label: "Project 4" },
// ];

// const moduleOptions = [
//   { value: "Module 1", label: "Module 1" },
//   { value: "Module 2", label: "Module 2" },
//   { value: "Module 3", label: "Module 3" },
//   { value: "Module 4", label: "Module 4" },
// ];

// const sprintOptions = [
//   { value: "Sprint 1", label: "Sprint 1" },
//   { value: "Sprint 2", label: "Sprint 2" },
//   { value: "Sprint 3", label: "Sprint 3" },
//   { value: "Sprint 4", label: "Sprint 4" },
// ];

let assignToRenderer = function(params) {
  // var imageElement = document.createElement("img");
  // imageElement.src = imgPerson;
  return (
    `<img src=${imgPerson} class="ag-grid-resource-img"></img>` +
    `<span><i class="fa fa-times ag-grid-fa-times"></i></span>` +
    params.value
  );
};

export class TasksStatusReport extends Component {
  constructor(props) {
    super(props);
    this.state = {
      projectSelected: "",
      moduleSelected: "",
      sprintSelected: "",
      projectOptions: [],
      moduleOptions: [],
      sprintOptions: [],
      // ag-grid table
      columnDefs: [
        {
          headerName: "TASK NAME",
          field: "TASK_NAME",
          width: 200,
          //width: 100,
        },
        {
          headerName: "STARTS ON",
          field: "STARTS_ON",
          width: 170,
          //width: 90,
        },
        {
          headerName: "ASSIGNED TO",
          field: "ASSIGNED_TO",
          width: 200,
          cellRenderer: assignToRenderer,
          //width: 90,
        },
        {
          headerName: "ENDS ON",
          field: "ENDS_ON",
          width: 170,
          //width: 90,
        },

        {
          // headerName: "ACTUAL HOURS",
          headerName: "LOGGED HOURS",
          field: "ACTUAL_HOURS",
          width: 160,
          //width: 90,
        },
        {
          headerName: "PLANNED HOURS",
          field: "PLANNED_HOURS",
          width: 160,
          //width: 90,
        },
        {
          // headerName: "COMPLETION STATUS",
          headerName: "PRIORITY",
          field: "COMPLETION_STATUS",
          width: 190,
          //width: 90,
        },
      ],
      rowData: [],
    };
  }

  /*==================================-===============================
      lifecycle methods
  ==================================================================*/
  componentDidMount() {
    window.scrollTo(0, 0);
    this.props.getAllProjectAction();
    this.props.getTaskStatusReportTableData();
    this.props.getDistributionOfTasksByProjectChart();
    this.props.getDistributionOfTasksByPriorityChart();
    // this.props.getTaskImportantDistributionByProject();
    this.props.getProjectTaskCopletion();
    this.props.taskWithMostLoggedHoursOverall();
  }

  static getDerivedStateFromProps(nextProps, nextState) {
    // if (
    //   !isEmpty(nextProps.allProjects) &&
    //   nextProps.allProjects !== nextState.allProjects &&
    //   !nextState.hasProjectSet
    // ) {
    //   let newArray =
    //     !isEmpty(nextProps.allProjects) &&
    //     nextProps.allProjects.map((project) => ({
    //       value: project._id,
    //       label: project.name,
    //     }));
    //   return {
    //     projectOptions: newArray,
    //     // projectSelected: {
    //     //   value: nextProps.allProjects[0]._id,
    //     //   label: nextProps.allProjects[0].name,
    //     // },
    //     hasProjectSet: true,
    //   };
    // }

    // if (
    //   !isEmpty(nextProps.allModules) &&
    //   nextProps.allModules !== nextState.allModules
    // ) {
    //   let newArray =
    //     !isEmpty(nextProps.allModules) &&
    //     nextProps.allModules.map((module) => ({
    //       value: module._id,
    //       label: module.name,
    //       data: module,
    //     }));
    //   console.log(nextProps.allModules);
    //   return {
    //     moduleOptions: newArray,
    //   };
    // }

    if (
      !isEmpty(nextProps.taskStatusReportTableData) &&
      nextProps.taskStatusReportTableData !==
        nextState.taskStatusReportTableData
    ) {
      let finalArray = [];
      let filterData = nextProps.taskStatusReportTableData.forEach(
        (element) => {
          let object = {
            TASK_NAME: element.taskname,
            STARTS_ON: dateFns.format(element.startdate, "DD/MM/YYYY"),
            ASSIGNED_TO: element.assignedto,
            ENDS_ON: dateFns.format(element.enddate, "DD/MM/YYYY"),
            ACTUAL_HOURS: element.actualhours,
            PLANNED_HOURS: element.plannedhours,
            COMPLETION_STATUS: element.status,
          };

          finalArray.push(object);
        }
      );
      // console.log(finalArray);

      return {
        taskStatusReportTableData: nextProps.taskStatusReportTableData,
        rowData: finalArray,
      };
    }

    return null;
  }

  componentDidUpdate() {
    if (isEmpty(this.props.allModules) && !this.state.hasModuleSet) {
      this.setState({
        moduleOptions: [],
        sprintOptions: [],
        hasModuleSet: true,
      });
    }
  }

  /*============================================================
      handlers
  ============================================================*/

  handleOnClickDownload = () => {
    console.log("clicked on download");
  };

  handleChangeSelectProject = (projectSelected) => {
    this.setState({ hasModuleSet: false });
    this.setState({ projectSelected, moduleSelected: "" });

    // this.props.getAllModuleDataOfSingleProject(projectSelected.value);
  };

  handleChangeSelectModule = (moduleSelected) => {
    this.setState({ moduleSelected });
    this.setState({ sprintSelected: "" });

    let finalArray = [];
    moduleSelected.data.sprints.forEach((sprint) => {
      if (!isEmpty(sprint._id)) {
        finalArray.push({
          value: sprint._id,
          label: sprint.name,
        });
      }
    });
    this.setState({
      sprintOptions: finalArray,
    });
  };

  handleChangeSelectSprint = (sprintSelected) => {
    this.setState({ sprintSelected });
    console.log(sprintSelected);
    this.props.getTaskStatusReport(sprintSelected.value);
  };

  /*============================================================
      renderDropdowns
  ============================================================*/
  // renderDropdowns = () => {
  //   return (
  //     <div className="row mx-0">
  //       <div className="mb-30">
  //         <h3 className="font-18-bold-space-light-uppercase color-white pb-10">
  //           Project name
  //         </h3>
  //         <Select
  //           className="react-select-container react-select-container--reportTasksStatus react-select-container--noBorder mr-30"
  //           classNamePrefix="react-select-elements"
  //           value={this.state.projectSelected}
  //           onChange={this.handleChangeSelectProject}
  //           options={this.state.projectOptions}
  //           placeholder="Select"
  //           isSearchable={false}
  //         />
  //       </div>
  //       <div className="mb-30">
  //         <h3 className="font-18-bold-space-light-uppercase color-white pb-10">
  //           Modules
  //         </h3>
  //         <Select
  //           className="react-select-container react-select-container--reportTasksStatus react-select-container--noBorder"
  //           classNamePrefix="react-select-elements"
  //           value={this.state.moduleSelected}
  //           onChange={this.handleChangeSelectModule}
  //           options={this.state.moduleOptions}
  //           placeholder="Select"
  //           isSearchable={false}
  //         />
  //       </div>
  //       <div className="mb-30">
  //         <h3 className="font-18-bold-space-light-uppercase color-white pb-10">
  //           Sprint
  //         </h3>
  //         <Select
  //           className="react-select-container react-select-container--reportTasksStatus react-select-container--noBorder"
  //           classNamePrefix="react-select-elements"
  //           value={this.state.sprintSelected}
  //           onChange={this.handleChangeSelectSprint}
  //           options={this.state.sprintOptions}
  //           placeholder="Select"
  //           isSearchable={false}
  //         />
  //       </div>
  //     </div>
  //   );
  // };

  /*============================================================
      renderTable
  ============================================================*/
  // renderTable = () => {
  //   return (
  //     <>
  //       <div className="finances-table-thead">
  //         <table className="finances-table finances-table--reportTasks">
  //           <thead>
  //             <tr>
  //               <th>
  //                 <span>
  //                   task
  //                   <br /> name
  //                 </span>
  //               </th>
  //               <th>
  //                 <span>
  //                   starts <br /> on
  //                 </span>
  //               </th>
  //               <th>
  //                 <span>
  //                   Assigned
  //                   <br /> to
  //                 </span>
  //               </th>
  //               <th>
  //                 <span>due date</span>
  //               </th>
  //               <th>
  //                 <span>Completion status</span>
  //               </th>
  //             </tr>
  //           </thead>
  //         </table>
  //       </div>
  //       <div className="finances-table-tbody finances-table-tbody--invoice">
  //         <table className="finances-table finances-table--reportTasks">
  //           <tbody>
  //             {!isEmpty(dummyData) ? (
  //               dummyData.map((invoice, index) => (
  //                 <tr key={index}>
  //                   <td>
  //                     <span>Design Inbox</span>
  //                   </td>
  //                   <td>
  //                     <span>01/04/2020</span>
  //                   </td>
  //                   <td>
  //                     <span>
  //                       <img
  //                         src={require("../../../assets/img/dummy/access-role-resource.svg")}
  //                         alt="person"
  //                         className="tasks-status-report-table-img"
  //                       />
  //                       <span className="text-lowercase">x</span>
  //                       <span className="tasks-status-report__underline">
  //                         3
  //                       </span>
  //                     </span>
  //                   </td>
  //                   <td>
  //                     <span>03/04/2020</span>
  //                   </td>
  //                   <td>
  //                     <span>In progress</span>
  //                   </td>
  //                 </tr>
  //               ))
  //             ) : (
  //               <tr>
  //                 <td colSpan={0} className="text-center">
  //                   <span className="font-14-semibold table-data-empty-message">
  //                     No data found
  //                   </span>
  //                 </td>
  //               </tr>
  //             )}
  //           </tbody>
  //         </table>
  //       </div>
  //     </>
  //   );
  // };

  /*============================================================
      main
  ============================================================*/
  render() {
    return (
      <>
        <ReportsTabPanelTitle
          title="Tasks Status Report"
          onClick={this.handleOnClickDownload}
        />
        <div className="row mx-0 task-status-report-row1">
          <div className="col-7 pr-0 mb-35">
            {/* {this.renderDropdowns()} */}
            <h3 className="font-18-bold font-18-bold--reports-task-status-text1 row reports-circle-icon-text mx-0">
              <img
                src={require("../../../assets/img/reports/circle-icons/light-green-gradient-circle-icon.svg")}
                alt=""
                className="reports-circle-icon"
              />
              Distribution of no of tasks by project
            </h3>
            <div className="reports-card reports-card--tasks-status-bar-graph">
              <TasksStatusReportBarGraph />
            </div>
          </div>
          <div className="col-5 px-0 mb-35">
            <h3 className="font-18-bold font-18-bold--reports-task-status-text2 row reports-circle-icon-text mx-0 mb-20">
              <img
                src={require("../../../assets/img/reports/circle-icons/purple-gradient-circle-icon.svg")}
                alt=""
                className="reports-circle-icon"
              />
              <span className="color-white">
                {/* Distribution of tasks by status */}
                Overall Distribution of tasks by priority
              </span>
            </h3>
            <div className="reports-card reports-card--tasks-status-graph ag-grid-custom-table--reports">
              <TasksStatusReportDoughnutChart />
            </div>
          </div>
          <div className="col-7 pr-0">
            <h3 className="font-18-bold font-18-bold--reports-task-status-text1 row reports-circle-icon-text mx-0">
              <img
                src={require("../../../assets/img/reports/circle-icons/light-green-gradient-circle-icon.svg")}
                alt=""
                className="reports-circle-icon"
              />
              Distribution of tasks by importance per project
            </h3>
            <div
              className="reports-card reports-card--tasks-status-bar-graph"
              style={{ height: "220px" }}
            >
              <TasksByImportancePerProjectGraph />
            </div>
          </div>
          <div className="col-5 px-0">
            <h3 className="font-18-bold font-18-bold--reports-task-status-text2 row reports-circle-icon-text mx-0 mb-20">
              <img
                src={require("../../../assets/img/reports/circle-icons/purple-gradient-circle-icon.svg")}
                alt=""
                className="reports-circle-icon"
              />
              <span className="color-white">
                Tasks with most logged hours overall
              </span>
            </h3>
            <div className="reports-card reports-card--tasks-status-graph ag-grid-custom-table--reports reports-card--tasksLoggedHoursTable">
              <TasksLoggedHoursTable />
            </div>
          </div>
        </div>
        {/* {this.renderTable()} */}
        <div
          className="ag-theme-alpine-dark ag-grid-custom-table ag-grid-custom-table--reports"
          style={{
            height: "200px",
            width: "100%",
          }}
        >
          <AgGridReact
            columnDefs={this.state.columnDefs}
            rowData={this.state.rowData}
          ></AgGridReact>
        </div>
      </>
    );
  }
}

const mapStateToProps = (state) => ({
  allProjects: state.projects.allProjects,
  allModules: state.projects.allModules,
  taskStatusReportTableData: state.reports.taskStatusReportTableData,
});

export default connect(mapStateToProps, {
  getProjectTaskCopletion,
  // getTaskImportantDistributionByProject,
  getAllProjectAction,
  taskWithMostLoggedHoursOverall,
  getTaskStatusReportTableData,
  getDistributionOfTasksByProjectChart,
  getDistributionOfTasksByPriorityChart,
})(TasksStatusReport);
