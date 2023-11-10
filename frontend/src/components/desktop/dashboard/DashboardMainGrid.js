import React, { Component, Fragment } from "react";
//  react-grid-layout
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
import { WidthProvider, Responsive } from "react-grid-layout";
// react-grid-layout end
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import Select from "react-select";
import Checkbox from "rc-checkbox";
import "rc-checkbox/assets/index.css";
import LeftNavbar from "../header/LeftNavbar";
import PageTitle from "../common/PageTitle";
import TopNavbar from "../header/TopNavbar";
import { connect } from "react-redux";
import { updateUserDemoWalkthroughFlag } from "./../../../store/actions/authAction";
import isEmpty from "../../../store/validations/is-empty";
import io from "socket.io-client";
import GreenButtonSmallFont from "../common/GreenButtonSmallFont";
import GrayButtonSmallFont from "../common/GrayButtonSmallFont";
import GreenLinkSmallFont from "../common/GreenLinkSmallFont";
import DashboardProjectStatusBarGraph from "./DashboardProjectStatusBarGraph";
import DashboardProjectReportBarGraph from "./DashboardProjectReportBarGraph";
import DashboardCostVarianceChart from "./DashboardCostVarianceChart";
import DashboardInvoicesIssuedChart from "./DashboardInvoicesIssuedChart";
import DashboardExpenseVsIncomeChart from "./DashboardExpenseVsIncomeChart";
import DashboardInvoiceSummaryChart from "./DashboardInvoiceSummaryChart";
import DashboardYearlyExpenseReportChart from "./DashboardYearlyExpenseReportChart";
import DashboardAddNewTaskModal from "./DashboardAddNewTaskModal";
import InputFieldNumber from "../common/InputFieldNumber";
import {
  getAllToDo,
  updateToDo,
  invoicesIssuedByMonth,
  paidInvoicesIssuedByMonth,
  getCurrentTaskData,
  getExpenseData,
  getYearlyTotalExpense,
  getYearlyBilledExpense,
  getYearlyMisExpense,
  getInvoiceSummary,
  createWorkLog,
  updateWorklogByid,
  getProjectTaskStatusReport,
  getCostVariance,
  getTicketSummary,
  getProjectTimeline,
  getProjectCountDown,
} from "./../../../store/actions/dashboardAction";
import {
  getAllExpanses,
  approveBulkExpense,
} from "./../../../store/actions/financeAction";
import {
  getApprovalPendingLeaves,
  getOnLeaveToday,
  approveBulkLeaves,
} from "./../../../store/actions/calenderAction";
import { getAllProjectAction } from "./../../../store/actions/projectAction";
import dateFns from "date-fns";
import { url } from "./../../../store/actions/config";
import getDayOfYear from "date-fns/get_day_of_year";

/*=========================================================================
        react-grid-layout
==========================================================================*/

const ResponsiveReactGridLayout = WidthProvider(Responsive);
const originalLayouts = getFromLS("layouts") || {};
// console.log(originalLayouts);

function getFromLS(key) {
  let ls = {};
  if (global.localStorage) {
    try {
      ls = JSON.parse(global.localStorage.getItem("rgl-8")) || {};
    } catch (e) {
      /*Ignore*/
    }
  }
  return ls[key];
}

function saveToLS(key, value) {
  if (global.localStorage) {
    global.localStorage.setItem(
      "rgl-8",
      JSON.stringify({
        [key]: value,
      })
    );
  }
}
/*=========================================================================
        react-grid-layout
==========================================================================*/

const dummyData = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

const optionsStatus = [
  { value: "Not Started", label: "Not Started" },
  { value: "In Progress", label: "In Progress" },
  { value: "Completed", label: "Completed" },
];

let userData = JSON.parse(localStorage.getItem("UserData"));

/*=============================
      Socket Connection
==============================*/
// let userData = JSON.parse(localStorage.getItem("UserData"));

const socket = io(`${url}`, {
  transports: ["false", "websocket"],
  query: {
    token: !isEmpty(userData) && userData.token,
  },
});

// const optionsProjectCountDown = [
//   { value: "Project 1", label: "Project 1" },
//   { value: "Project 2", label: "Project 2" },
//   { value: "Project 3", label: "Project 3" },
// ];

// const optionsProjectCostVar = [
//   { value: "Project 1", label: "Project 1" },
//   { value: "Project 2", label: "Project 2" },
//   { value: "Project 3", label: "Project 3" },
// ];

/*=============================
      Socket Connection
==============================*/
// let userData = JSON.parse(localStorage.getItem("UserData"));

// const socket = io(`${url}`, {
//   transports: ["false", "websocket"],
//   query: {
//     token: !isEmpty(userData) && userData.token,
//   },
// });

export class DashboardMainGrid extends Component {
  constructor() {
    super();
    this.state = {
      //  react-grid-layout
      activeButton: "",
      isResetLayout: false,
      layoutOneState: JSON.parse(JSON.stringify(originalLayouts)),
      layouts: JSON.parse(JSON.stringify(originalLayouts)),
      // row 1
      selectedOptionStatus: optionsStatus[0],
      // row 2
      selectedOptionProjectCountDown: "",
      selectedOptionProjectCostVar: "",
      // row 3
      projectSelected: "",
      // row 5
      selectedOptionCurrentTaskStatus: optionsStatus[0],
      currentTaskTotalHoursSpent: 0,
      isCurrentTaskHoursSpentEditable: false,
      // row 7
      expenseTableRowCheckbox: false,
      leaveTableRowCheckbox: false,
      allToDo: [],
      approveExpanseList: [],
      approveLeaveList: [],
      optionsProjectCostVar: [],
      projectOptionsTimeline: [],
      optionsProjectCountDown: [],
    };
    // socket.on("notifications", (data) => {
    //   console.log(data);
    // });
  }

  componentDidMount() {
    console.log(socket);

    socket.on("connect", (data) => {
      console.log("socket connected successfully");
    });

    // activeProjectDetailTabIndex set to 3 ..
    // since project timeline check complete ..
    // redirect to history of project detail page

    var data = JSON.parse(localStorage.getItem("UserData"));

    this.props.getAllToDo();
    this.props.invoicesIssuedByMonth();
    this.props.paidInvoicesIssuedByMonth();
    this.props.getAllExpanses();
    this.props.getApprovalPendingLeaves();
    this.props.getOnLeaveToday();
    this.props.getExpenseData();
    this.props.getYearlyTotalExpense();
    this.props.getYearlyBilledExpense();
    this.props.getYearlyMisExpense();
    this.props.getInvoiceSummary();
    this.props.getProjectTaskStatusReport();
    this.props.getAllProjectAction();
    this.props.getTicketSummary();

    const formData = {
      date: getDayOfYear(new Date()),
      user: data.id,
    };

    this.props.getCurrentTaskData(formData);

    localStorage.setItem("activeProjectDetailTabIndex", 3);

    if (!isEmpty(userData)) {
      let user = userData;
      user.demo = false;
      this.props.updateUserDemoWalkthroughFlag(user.id, user);
    }
  }

  static getDerivedStateFromProps(nextProps, nextState) {
    if (
      !isEmpty(nextProps.allToDo) &&
      nextProps.allToDo !== nextState.allToDo
    ) {
      return {
        allToDo: nextProps.allToDo,
      };
    }
    if (
      !isEmpty(nextProps.approvalExpense) &&
      nextProps.approvalExpense !== nextState.approvalExpense
    ) {
      return {
        approvalExpense: nextProps.approvalExpense,
      };
    }
    if (
      !isEmpty(nextProps.allPendingLeaves) &&
      nextProps.allPendingLeaves !== nextState.allPendingLeaves
    ) {
      return {
        allPendingLeaves: nextProps.allPendingLeaves,
      };
    }
    if (
      !isEmpty(nextProps.todaysTask) &&
      nextProps.todaysTask !== nextState.todaysTask
    ) {
      return {
        todaysTask: nextProps.todaysTask,
      };
    }
    if (
      !isEmpty(nextProps.allProjects) &&
      nextProps.allProjects !== nextState.allProjects &&
      !nextState.hasProjectSet
    ) {
      nextProps.getCostVariance(nextProps.allProjects[0]._id);
      nextProps.getProjectTimeline(nextProps.allProjects[0]._id);
      nextProps.getProjectCountDown(nextProps.allProjects[0]._id);
      let newArray =
        !isEmpty(nextProps.allProjects) &&
        nextProps.allProjects.map((project) => ({
          value: project._id,
          label: project.name,
        }));
      // console.log(nextProps.allProjects);
      return {
        allProjects: nextProps.allProjects,
        optionsProjectCostVar: newArray,
        projectOptionsTimeline: newArray,
        optionsProjectCountDown: newArray,
        projectSelected: {
          value: nextProps.allProjects[0]._id,
          label: nextProps.allProjects[0].name,
        },
        selectedOptionProjectCostVar: {
          value: nextProps.allProjects[0]._id,
          label: nextProps.allProjects[0].name,
        },
        selectedOptionProjectCountDown: {
          value: nextProps.allProjects[0]._id,
          label: nextProps.allProjects[0].name,
        },
        hasProjectSet: true,
      };
    }
    if (
      !isEmpty(nextProps.projectTimeline) &&
      nextProps.projectTimeline !== nextState.projectTimeline
    ) {
      return {
        projectTimeline: nextProps.projectTimeline,
      };
    }
    if (
      !isEmpty(nextProps.projectCountDown) &&
      nextProps.projectCountDown !== nextState.projectCountDown
    ) {
      return {
        projectCountDown: nextProps.projectCountDown,
      };
    }
    if (
      !isEmpty(nextProps.ticketSummary) &&
      nextProps.ticketSummary !== nextState.ticketSummary
    ) {
      return {
        ticketSummary: nextProps.ticketSummary,
      };
    }
    return null;
  }

  componentDidUpdate() {
    if (this.props.allToDo !== this.state.allToDo) {
      this.setState({
        allToDo: this.props.allToDo,
      });
    }
  }

  componentWillUnmount() {
    // remove activeProjectDetailTabIndex
    localStorage.removeItem("activeProjectDetailTabIndex", 3);
  }

  /*============================================================
      renderRow1
  ============================================================*/
  handleOnClickRemove = () => {
    console.log("icon clicked");
  };

  handleChangeStatusDropdown = (todoData) => (e) => {
    // this.setState({ selectedOptionStatus });
    console.log(`Option selected:`, todoData, e.value);

    let updatedStatus =
      e.value === "In Progress"
        ? "INPROGRESS"
        : e.value === "Not Started"
        ? "NOT_STARTED"
        : "COMPLETED";

    let formData = todoData;
    todoData.status = updatedStatus;

    this.props.updateToDo(todoData._id, formData);
  };

  renderProjectName = () => {
    return (
      <div className="d-card d-card--row1Colm2Card text-center">
        <p className="d-r1-c1-text2 pb-10">
          Pinned Project{" "}
          <img
            src={require("../../../assets/img/dashboard/dashboard-pin-icon.svg")}
            alt="pin"
            className="d-r1-c1-icon"
          />
        </p>
        <img
          src={require("../../../assets/img/dashboard/dashboard-bag-icon.svg")}
          alt=""
          className="d-r1-c2-img"
        />
        <h3 className="d-r1-c2-text">Project Name</h3>
      </div>
    );
  };

  renderToDoTable = () => {
    const { allToDo } = this.state;
    // console.log(this.state.selectedOptionStatus);
    return (
      <div className="finances-table-tbody finances-table-tbody--dashbaordToDo">
        <table className="finances-table finances-table--dashbaordToDo">
          <tbody>
            {!isEmpty(allToDo) ? (
              allToDo.map((data, index) => (
                <tr key={index}>
                  <td>
                    <span className="font-18-semiBold">{data.name}</span>
                  </td>
                  {/* <td>
                    <span className="d-r1-c4-text2">{data.name}</span>
                  </td> */}
                  <td>
                    <span>
                      {data.status === "COMPLETED" ? (
                        // disabled
                        <Select
                          isSearchable={false}
                          className="react-select-container react-select-container--addInvoice"
                          classNamePrefix="react-select-elements"
                          value={{ value: "Completed", label: "Completed" }}
                          placeholder="Select"
                          isDisabled={true}
                        />
                      ) : (
                        // active
                        <Select
                          isSearchable={false}
                          className="react-select-container react-select-container--addInvoice"
                          classNamePrefix="react-select-elements"
                          value={
                            data.status === "NOT_STARTED"
                              ? { value: "Not Started", label: "Not Started" }
                              : { value: "In Progress", label: "In Progress" }
                          }
                          onChange={this.handleChangeStatusDropdown(data)}
                          options={optionsStatus}
                          placeholder="Select"
                        />
                      )}
                    </span>
                  </td>
                  <td>
                    <span className="d-r1-c4-text2">
                      Due on {dateFns.format(data.dueDate, "DD/MM/YYYY")}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={0} className="text-center">
                  <span className="font-14-semibold table-data-empty-message">
                    No data found
                  </span>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    );
  };

  renderRow1__C1R1 = () => {
    let currentDate = new Date();
    return (
      <div className="d-card d-card--row1Colm1Card1">
        <div className="row mx-0 flex-nowrap justify-content-between">
          <div className="d-r1-c1-text-block flex-shrink-0">
            <h2 className="d-r1-c1-text1">
              {dateFns.format(currentDate, "Do MMM")}
            </h2>
            <p className="d-r1-c1-text2">
              {dateFns.format(currentDate, "YYYY")}
            </p>
            <p className="d-r1-c1-text2">
              {dateFns.format(currentDate, "dddd")}
            </p>
          </div>
          <div className="text-right">
            <h2 className="d-r1-c1-text1">
              {dateFns.format(currentDate, "HH:mm a")}
            </h2>
            <p className="d-r1-c1-text2">GMT+5.5</p>
            <p className="d-r1-c1-text2">Pune, India</p>
          </div>
        </div>
      </div>
    );
  };

  renderRow1__C1R2 = () => {
    return (
      <div className="d-card d-card--row1Colm1Card2">
        <div className="row mx-0 align-items-center justify-content-between flex-nowrap">
          <h3 className="font-18-semiBold">
            <img
              src={require("../../../assets/img/dashboard/dashboard-meeting-icon.svg")}
              alt="meeting"
              className="d-r1-c1-icon"
            />
            Meeting at 4:30 PM
          </h3>
          <i
            className="fa fa-times d-r1-c1-iconRemove"
            onClick={this.handleOnClickRemove}
          ></i>
        </div>
      </div>
    );
  };

  renderRow1__C1R3 = () => {
    return (
      <div className="d-card d-card--row1Colm1Card2">
        <div className="row mx-0 align-items-center justify-content-between flex-nowrap">
          <h3 className="font-18-semiBold">
            <img
              src={require("../../../assets/img/dashboard/dashboard-presentation-icon.svg")}
              alt="meeting"
              className="d-r1-c1-icon"
            />
            New Announcemt
          </h3>
          <i
            className="fa fa-times d-r1-c1-iconRemove"
            onClick={this.handleOnClickRemove}
          ></i>
        </div>
      </div>
    );
  };

  renderRow1__C2 = () => {
    return this.renderProjectName();
  };

  renderRow1__C3 = () => {
    return this.renderProjectName();
  };

  renderRow1__C4 = () => {
    return (
      <div className="d-card d-card--row1Colm4Card">
        <div className="row mx-0 justify-content-between">
          <h3 className="d-r1-c4-text1">to do list</h3>
          <DashboardAddNewTaskModal />
        </div>
        {this.renderToDoTable()}
      </div>
    );
  };

  /*============================================================
      renderRow2
  ============================================================*/

  handleChangeProjectDropdown = (selectedOptionProject) => {
    this.setState({ selectedOptionProjectCountDown: selectedOptionProject });
    console.log(`Option selected:`, selectedOptionProject);
    this.props.getProjectCountDown(selectedOptionProject.value);
  };

  renderRow2__C1 = () => {
    return (
      <div className="d-card d-card--row2Colm1Card">
        <h3 className="d-r2-c1-text1">project tasks completion status</h3>
        <DashboardProjectStatusBarGraph />
      </div>
    );
  };

  renderRow2__C2 = () => {
    const { projectCountDown } = this.state;
    return (
      <div className="d-card d-card--row2Colm2Card">
        <h3 className="d-r2-c1-text1 pb-10">project countdown</h3>
        <div className="row mx-0 pt-20 justify-content-between">
          <div className="text-center">
            <Select
              isSearchable={false}
              className="react-select-container"
              classNamePrefix="react-select-elements"
              value={this.state.selectedOptionProjectCountDown}
              onChange={this.handleChangeProjectDropdown}
              options={this.state.optionsProjectCountDown}
              placeholder="Select"
            />
            <h4 className="overview-percent-gradient-text mt-20">60%</h4>
            <p className="font-18-semiBold opacity-41">On Schedule</p>
          </div>
          <div className="d-r2-c2-circular-div">
            <div className="d-r2-c2-circular-div__text-block">
              <h4 className="d-r2-c2-circular-div__text-block-text">
                {!isEmpty(projectCountDown) ? projectCountDown.value : 0}
              </h4>
              <p className="d-r2-c2-circular-div__text-block-desc">Days left</p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  /*============================================================
      renderRow3
  ============================================================*/
  handleChangeSelectProject = (projectSelected) => {
    this.setState({ projectSelected });
    this.props.getProjectTimeline(projectSelected.value);
  };

  renderRow3 = () => {
    const { projectTimeline } = this.state;

    return (
      <div className="d-card d-card--row3">
        <div className="row mx-0 align-items-center justify-content-between d-card--row3__row1">
          <Select
            className="react-select-container react-select-container--addMember react-select-container--noBorder"
            classNamePrefix="react-select-elements"
            value={this.state.projectSelected}
            onChange={this.handleChangeSelectProject}
            options={this.state.projectOptionsTimeline}
            placeholder="Select"
            isSearchable={false}
          />
          <h3 className="d-r2-c1-text1">project timeline</h3>
          <GreenLinkSmallFont text="Check Complete" path="/dashboard" />
        </div>
        <div className="d-r3-overflow-div">
          <div className="row mx-0 flex-nowrap align-items-start d-r3-overflow-div__row-top">
            {!isEmpty(projectTimeline) &&
              projectTimeline.map(
                (data, index) =>
                  index % 2 === 1 && (
                    <div key={index} className="d-r3-text-block-top">
                      <p className="font-18-semiBold">{data.text}</p>
                      <p className="font-18-bold-space-light-uppercase color-white">
                        {dateFns.format(data.createdAt, "DD-MMM-YYYY")}
                      </p>
                    </div>
                  )
              )}
          </div>
          <div className="row mx-0 flex-nowrap align-items-center d-r3-overflow-div__img-row">
            {!isEmpty(projectTimeline) &&
              projectTimeline.map((data, index) => (
                <Fragment key={index}>
                  <img
                    src={require("../../../assets/img/dashboard/dashboard-project-timeline-dot.svg")}
                    alt=""
                    className="d-r3-dot-img"
                  />
                  <img
                    src={require("../../../assets/img/dashboard/dashboard-project-timeline-line.svg")}
                    alt=""
                    className="d-r3-dot-line"
                  />
                </Fragment>
              ))}
          </div>
          <div className="row mx-0 flex-nowrap align-items-start d-r3-overflow-div__row-bottom">
            {!isEmpty(projectTimeline) &&
              projectTimeline.map(
                (data, index) =>
                  index % 2 === 0 && (
                    <div key={index} className="d-r3-text-block-bottom">
                      <p className="font-18-semiBold">{data.text}</p>
                      <p className="font-18-bold-space-light-uppercase color-white">
                        {dateFns.format(data.createdAt, "DD-MMM-YYYY")}
                      </p>
                    </div>
                  )
              )}
          </div>
        </div>
      </div>
    );
  };

  /*============================================================
      renderRow4
  ============================================================*/
  handleChangeProjectCostVarDropdown = (selectedOptionProject) => {
    // this.setState({
    //   hasProjectSet: false,
    // });
    this.setState({ selectedOptionProjectCostVar: selectedOptionProject });
    // console.log(`Option selected:`, selectedOptionProject);
    this.props.getCostVariance(selectedOptionProject.value);
  };

  renderRow4__1C1 = () => {
    return (
      <div className="d-card d-card--row4Colm1Card">
        <h3 className="d-r2-c1-text1">project task status report</h3>
        <DashboardProjectReportBarGraph />
      </div>
    );
  };

  renderRow4__C1C1 = () => {
    return (
      <div className="d-card d-card--row4Colm1Card">
        <h3 className="d-r2-c1-text1">project task status report</h3>
        <DashboardProjectReportBarGraph />
      </div>
    );
  };

  renderRow4__C1C2 = () => {
    return (
      <div className="d-card d-card--row4Colm2Card ml-auto">
        <h3 className="d-r2-c1-text1">cost variance</h3>
        <Select
          isSearchable={false}
          className="react-select-container"
          classNamePrefix="react-select-elements"
          value={this.state.selectedOptionProjectCostVar}
          onChange={this.handleChangeProjectCostVarDropdown}
          options={this.state.optionsProjectCostVar}
          placeholder="Select"
        />
        <DashboardCostVarianceChart />
      </div>
    );
  };

  renderRow4__C2C1 = () => {
    return (
      <div className="d-card d-card--row4Colm1Card">
        <h3 className="d-r2-c1-text1">invoices issued</h3>
        <DashboardInvoicesIssuedChart />
      </div>
    );
  };

  renderRow4__C2C2 = () => {
    return (
      <div className="d-card d-card--row4Colm2Card">
        <h3 className="d-r2-c1-text1">expense vs income</h3>
        <DashboardExpenseVsIncomeChart />
      </div>
    );
  };

  /*============================================================
      renderRow5
  ============================================================*/

  handleChangeCurrentTaskStatusDropdown = (selectedTaskData) => (e) => {
    // this.setState({ selectedOptionCurrentTaskStatus });
    console.log(`Option selected:`, selectedTaskData);

    if (selectedTaskData.status === undefined) {
      const formData = {
        name: "th233",
        schedule: selectedTaskData._id,
        task: selectedTaskData.taskdata[0]._id,
        user: selectedTaskData.assignedTo,
        hours: this.state.currentTaskTotalHoursSpent,
        // createdBy: data.id,
        // lastModifiedBy: data.id,
        status:
          e.value === "Not Started"
            ? "NOTSTARTED"
            : e.value === "Completed"
            ? "COMPLETED"
            : "INPROGRESS",
      };

      // console.log(formData);

      this.props.createWorkLog(formData);
    } else {
      // console.log("call update api");

      const formData = {
        name: "th233",
        schedule: selectedTaskData._id,
        task: selectedTaskData.taskdata[0]._id,
        user: selectedTaskData.assignedTo,
        hours: selectedTaskData.hours,
        // createdBy: data.id,
        // lastModifiedBy: data.id,
        status:
          e.value === "Not Started"
            ? "NOTSTARTED"
            : e.value === "Completed"
            ? "COMPLETED"
            : "INPROGRESS",
      };

      this.props.updateWorklogByid(selectedTaskData.worklogId, formData);
    }
  };

  handleChangeNumberTable = (e) => {
    this.setState({
      [e.target.name]: e.target.validity.valid ? e.target.value : "",
    });
  };

  handleOnClickCurrentTaskHoursIconSave = (selectedTaskData) => {
    this.setState({
      isCurrentTaskHoursSpentEditable: false,
    });
    console.log(selectedTaskData, this.state.currentTaskTotalHoursSpent);

    if (selectedTaskData.hours === undefined) {
      const formData = {
        name: "th233",
        schedule: selectedTaskData._id,
        task: selectedTaskData.taskdata[0]._id,
        user: selectedTaskData.assignedTo,
        hours: this.state.currentTaskTotalHoursSpent,
        // createdBy: data.id,
        // lastModifiedBy: data.id,
        status:
          selectedTaskData.status === undefined
            ? "NOTSTARTED"
            : selectedTaskData.status,
      };

      // console.log(formData);

      this.props.createWorkLog(formData);
      this.setState({
        currentTaskTotalHoursSpent: 0,
      });
    } else {
      // console.log("call update api");

      const formData = {
        name: "th233",
        schedule: selectedTaskData._id,
        task: selectedTaskData.taskdata[0]._id,
        user: selectedTaskData.assignedTo,
        hours: this.state.currentTaskTotalHoursSpent,
        // createdBy: data.id,
        // lastModifiedBy: data.id,
        status: selectedTaskData.status,
      };

      this.props.updateWorklogByid(selectedTaskData.worklogId, formData);
      this.setState({
        currentTaskTotalHoursSpent: 0,
      });
    }
  };

  handleOnClickCurrentTaskHoursIconEdit = (selectedTaskData) => {
    this.setState({
      isCurrentTaskHoursSpentEditable: true,
      selectedTaskData: selectedTaskData,
    });
  };

  // renderTodayTasksTable
  renderTodayTasksTable = () => {
    const { isCurrentTaskHoursSpentEditable, todaysTask } = this.state;
    return (
      <>
        <div className="finances-table-thead">
          <table className="finances-table finances-table--dashboardTasks">
            <thead>
              <tr>
                <th>
                  <span className="font-18-bold-space-light-uppercase">
                    task
                  </span>
                </th>
                <th>
                  <span className="font-18-bold-space-light-uppercase">
                    project
                  </span>
                </th>
                <th>
                  <span className="font-18-bold-space-light-uppercase">
                    start date
                  </span>
                </th>
                <th>
                  <span className="font-18-bold-space-light-uppercase">
                    timings
                  </span>
                </th>
                <th>
                  <span className="font-18-bold-space-light-uppercase">
                    status
                  </span>
                </th>
                <th>
                  <span className="font-18-bold-space-light-uppercase">
                    hours spent <br /> today
                  </span>
                </th>
                <th>
                  <span className="font-18-bold-space-light-uppercase">
                    Total hours <br />
                    spent
                  </span>
                </th>
              </tr>
            </thead>
          </table>
        </div>
        <div className="finances-table-tbody finances-table-tbody--dashboardTasks">
          <table className="finances-table finances-table--dashboardTasks">
            <tbody>
              {!isEmpty(todaysTask) ? (
                todaysTask.map((data, index) => (
                  <tr key={index}>
                    <td>
                      <span>{data.taskdata[0].name}</span>
                    </td>
                    <td>
                      <span>{data.projectdata[0].name}</span>
                    </td>
                    <td>
                      <span>{dateFns.format(data.fromDate, "DD-MM-YYYY")}</span>
                    </td>
                    <td>
                      <span>
                        {dateFns.format(data.fromTime, "hh:mmA")}-
                        {dateFns.format(data.toTime, "hh:mmA")}{" "}
                      </span>
                    </td>
                    <td>
                      <span>
                        {data.status !== undefined &&
                        data.status === "COMPLETED" ? (
                          // disabled
                          <Select
                            isSearchable={false}
                            className="react-select-container react-select-container--addInvoice"
                            classNamePrefix="react-select-elements"
                            value={{ value: "Completed", label: "Completed" }}
                            placeholder="Select"
                            isDisabled={true}
                          />
                        ) : (
                          // active
                          <Select
                            isSearchable={false}
                            className="react-select-container react-select-container--addInvoice"
                            classNamePrefix="react-select-elements"
                            value={
                              data.status === undefined ||
                              data.status === "NOTSTARTED"
                                ? { value: "Not Started", label: "Not Started" }
                                : { value: "In Progress", label: "In Progress" }
                            }
                            onChange={this.handleChangeCurrentTaskStatusDropdown(
                              data
                            )}
                            options={optionsStatus}
                            placeholder="Select"
                          />
                        )}
                      </span>
                    </td>
                    <td>
                      <div className="row mx-0 flex-nowrap align-items-center current-tasks-hours-spent-td">
                        {isCurrentTaskHoursSpentEditable &&
                        data._id === this.state.selectedTaskData._id ? (
                          <>
                            <InputFieldNumber
                              containerClassName="container-login-flow-input container-login-flow-input--addExpenseSmall"
                              name="currentTaskTotalHoursSpent"
                              value={this.state.currentTaskTotalHoursSpent}
                              onChange={this.handleChangeNumberTable}
                              maxLength={2}
                              autoFocus={true}
                            />
                            <div
                              className="current-task-hours-spent-icon-div"
                              onClick={() =>
                                this.handleOnClickCurrentTaskHoursIconSave(data)
                              }
                            >
                              <i className="fa fa-save"></i>
                            </div>
                          </>
                        ) : (
                          <>
                            <InputFieldNumber
                              containerClassName="container-login-flow-input container-login-flow-input--addExpenseSmall container-login-flow-input--no-border"
                              value={
                                data.hours === undefined
                                  ? this.state.currentTaskTotalHoursSpent
                                  : data.hours
                              }
                              maxLength={2}
                              isDisabled={true}
                            />
                            <div
                              className="current-task-hours-spent-icon-div"
                              onClick={() =>
                                this.handleOnClickCurrentTaskHoursIconEdit(data)
                              }
                            >
                              <i className="fa fa-pencil"></i>
                            </div>
                          </>
                        )}
                      </div>
                    </td>
                    <td>
                      <span>
                        {data.totalhours === undefined ? 0 : data.totalhours}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={0} className="text-center">
                    <span className="font-14-semibold table-data-empty-message">
                      No data found
                    </span>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </>
    );
  };

  renderRow5 = () => {
    return (
      <div className="d-card d-card--row5Colm2Card">
        <div className="row mx-0 justify-content-between">
          <h3 className="d-r5-c2-text1">current tasks</h3>
          <GreenButtonSmallFont
            text="Complete Timsheet"
            onClick={this.handleOnClickAddNewTodoList}
          />
        </div>
        {this.renderTodayTasksTable()}
      </div>
    );
  };

  /*============================================================
      renderRow6
  ============================================================*/

  renderRow6__C1 = () => {
    const { ticketSummary } = this.state;

    let answeredTickets =
      !isEmpty(ticketSummary) &&
      ticketSummary.filter((ticket) => ticket.ticketStatus === "ANSWERED");
    let inprogressTickets =
      !isEmpty(ticketSummary) &&
      ticketSummary.filter((ticket) => ticket.ticketStatus === "INPROGRESS");
    let onholdTickets =
      !isEmpty(ticketSummary) &&
      ticketSummary.filter((ticket) => ticket.ticketStatus === "ONHOLD");
    return (
      <div className="d-card d-card--row6Colm1Card">
        <h3 className="d-r2-c1-text1">tickets summary</h3>
        <div className="row mx-0 mt-20 pt-10">
          {/* closed */}
          <div className="d-r6-c1__circular-progressbar">
            <CircularProgressbar
              value={
                !isEmpty(answeredTickets) && answeredTickets !== false
                  ? answeredTickets[0].ticketPercent
                  : 0
              }
              text={`${
                !isEmpty(answeredTickets) && answeredTickets !== false
                  ? answeredTickets[0].ticketPercent
                  : 0
              }%`}
              strokeWidth={15}
            />
            <p className="font-12-semibold">Closed</p>
          </div>
          {/* in progress */}
          <div className="d-r6-c1__circular-progressbar d-r6-c1__circular-progressbar--skyBlue">
            <CircularProgressbar
              value={
                !isEmpty(inprogressTickets) && inprogressTickets !== false
                  ? inprogressTickets[0].ticketPercent
                  : 0
              }
              text={`${
                !isEmpty(inprogressTickets) && inprogressTickets !== false
                  ? inprogressTickets[0].ticketPercent
                  : 0
              }%`}
              strokeWidth={15}
            />
            <p className="font-12-semibold">In Progress</p>
          </div>
          {/* on hold */}
          <div className="d-r6-c1__circular-progressbar d-r6-c1__circular-progressbar--orange">
            <CircularProgressbar
              value={
                !isEmpty(onholdTickets) && onholdTickets !== false
                  ? onholdTickets[0].ticketPercent
                  : 0
              }
              text={`${
                !isEmpty(onholdTickets) && onholdTickets !== false
                  ? onholdTickets[0].ticketPercent
                  : 0
              }%`}
              strokeWidth={15}
            />
            <p className="font-12-semibold">On Hold</p>
          </div>
        </div>
      </div>
    );
  };

  renderRow6__C2 = () => {
    return (
      <div className="d-card d-card--row6Colm2Card">
        <h3 className="d-r2-c1-text1">yearly expense report</h3>
        <DashboardYearlyExpenseReportChart />
      </div>
    );
  };

  renderRow6__C3 = () => {
    return (
      <div className="d-card d-card--row6Colm3Card">
        <h3 className="d-r2-c1-text1">invoice summary</h3>
        <DashboardInvoiceSummaryChart />
      </div>
    );
  };

  /*============================================================
      renderRow7
  ============================================================*/
  handleCheckboxChange = (e) => {
    this.setState({
      [e.target.id]: e.target.checked,
    });
  };

  handleOnClickApproveExpense = () => {
    console.log("clicked on approve expense");
    const { approveExpanseList } = this.state;

    const formData = {
      expenses: approveExpanseList,
    };
    // console.log(formData);
    this.props.approveBulkExpense(formData, "Expense Approved");
  };

  handleOnClickApproveLeave = () => {
    console.log("clicked on approve expense");
    const { approveLeaveList } = this.state;
    const formData = {
      leaves: approveLeaveList,
    };
    this.props.approveBulkLeaves(formData, "Leave Approved");
  };

  doEmailExist = (data) => {
    // console.log(data);
    let obj = this.state.approveExpanseList.find((emp) => emp === data);
    // console.log(obj);
    return obj ? this.state.approveExpanseList.indexOf(obj) : false;
  };

  onChangeCheckbox = (data) => (e) => {
    // console.log("Checkbox checked:", data);

    let approveExpenseList = this.state.approveExpanseList;

    let returnValue = this.doEmailExist(data);
    if (returnValue || returnValue === 0) {
      approveExpenseList.splice(returnValue, 1);
    } else {
      let newApprovedStatusData = data;
      newApprovedStatusData.status = "APPROVED";
      approveExpenseList.push(newApprovedStatusData);
    }
    this.setState({
      approveExpanseList: approveExpenseList,
    });
    // console.log(approveExpenseList);
  };

  renderExpenseTable = () => {
    const { approvalExpense } = this.state;
    return (
      <div className="finances-table-tbody finances-table-tbody--dashbaordExpense">
        <table className="finances-table finances-table--dashbaordExpense">
          <tbody>
            {!isEmpty(approvalExpense) ? (
              approvalExpense.map((data, index) => (
                <tr key={index}>
                  <td>
                    <div className="customCheckbox">
                      <Checkbox
                        // id="workingDaysCheckboxMonFri"
                        // value={this.state.workingDaysCheckboxMonFri}
                        // defaultChecked={true}
                        onChange={this.onChangeCheckbox(data)}
                        checked={
                          this.doEmailExist(data) ||
                          this.doEmailExist(data) === 0
                            ? true
                            : false
                        }
                      />
                    </div>
                  </td>
                  <td>
                    <span className="font-18-semiBold">
                      {data.expenseTitle}
                    </span>
                  </td>
                  <td>
                    <span className="d-r1-c4-text2">{data.expenseType}</span>
                  </td>
                  <td>
                    <span className="d-r1-c4-text2">{data.payee_name}</span>
                  </td>
                  <td>
                    <span className="font-24-semiBold">{data.total}</span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={0} className="text-center">
                  <span className="font-14-semibold table-data-empty-message">
                    No data found
                  </span>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    );
  };

  doLeaveExist = (data) => {
    // console.log(data);
    let obj = this.state.approveLeaveList.find((emp) => emp === data);
    // console.log(obj);
    return obj ? this.state.approveLeaveList.indexOf(obj) : false;
  };

  onChangeLeaveCheckbox = (data) => (e) => {
    // console.log("Checkbox checked:", data);

    let approveLeaveList = this.state.approveLeaveList;

    let returnValue = this.doEmailExist(data);
    if (returnValue || returnValue === 0) {
      approveLeaveList.splice(returnValue, 1);
    } else {
      let newApprovedStatusData = data;
      newApprovedStatusData.leaveStatus = "APPROVED";
      approveLeaveList.push(newApprovedStatusData);
    }
    this.setState({
      approveExpanseList: approveLeaveList,
    });
    console.log(approveLeaveList);
  };

  renderLeaveTable = () => {
    const { allPendingLeaves } = this.state;
    return (
      <div className="finances-table-tbody finances-table-tbody--dashbaordLeave">
        <table className="finances-table finances-table--dashbaordLeave">
          <tbody>
            {!isEmpty(allPendingLeaves) ? (
              allPendingLeaves.map((data, index) => (
                <tr key={index}>
                  <td>
                    <div className="customCheckbox">
                      <Checkbox
                        // id="workingDaysCheckboxMonFri"
                        // value={this.state.workingDaysCheckboxMonFri}
                        // defaultChecked={true}
                        onChange={this.onChangeLeaveCheckbox(data)}
                        checked={
                          this.doLeaveExist(data) ||
                          this.doLeaveExist(data) === 0
                            ? true
                            : false
                        }
                      />
                    </div>
                  </td>
                  <td>
                    <span className="d-r1-c4-text2">{data.user.name}</span>
                  </td>
                  <td>
                    <span className="d-r1-c4-text2">{data.leaveType}</span>
                  </td>
                  <td>
                    <span className="font-18-semiBold">Dates</span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={0} className="text-center">
                  <span className="font-14-semibold table-data-empty-message">
                    No data found
                  </span>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    );
  };

  renderRow7__C1 = () => {
    return (
      <div className="d-card d-card--row7Colm1Card">
        <h3 className="d-r7-c1-text1">Pending approvals</h3>
        <div className="d-r7-c1-row row mx-0 flex-nowrap">
          <div className="d-r7-c1-row__colm1">
            <h4 className="d-r7-c1-text2">Expense</h4>
            {this.renderExpenseTable()}

            <div className="d-r7-c1-greenBtnDiv">
              <GreenButtonSmallFont
                text="Approve"
                onClick={this.handleOnClickApproveExpense}
              />
            </div>
          </div>
          <div className="d-r7-c1-row__colm2">
            <h4 className="d-r7-c1-text2">Leave</h4>
            {this.renderLeaveTable()}
            <div className="d-r7-c1-greenBtnDiv">
              <GreenButtonSmallFont
                text="Approve"
                onClick={this.handleOnClickApproveLeave}
              />
            </div>
          </div>
        </div>
      </div>
    );
  };

  renderRow7__C2 = () => {
    const { onLeaveToday } = this.props;

    return (
      <div>
        <div className="d-card d-card--row7Colm2Card">
          <h3 className="d-r7-c2-text1">members on leave today</h3>
          <div className="row7Colm2Card-overflow">
            {!isEmpty(onLeaveToday) ? (
              onLeaveToday.map((data, index) => (
                <div key={index} className="row mx-0 flex-nowrap mb-30">
                  <i className="fa fa-circle d-r7-c2-fa-circle"></i>
                  <div>
                    <h4 className="font-18-semiBold">{data.user.name}</h4>
                    <p className="font-18-semiBold d-r7-c2-text2">
                      {data.leaveType}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center">
                <span className="font-14-semibold table-data-empty-message">
                  No data found
                </span>
              </div>
            )}
          </div>
        </div>
        <div className="dashboard-lorem-text">lorem ipsum</div>
      </div>
    );
  };

  /*=========================================================================
        react-grid-layout
  ==========================================================================*/

  // static get defaultProps() {
  //   return {
  //     className: "layout",
  //     cols: { lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 },
  //     rowHeight: 30,
  //   };
  // }

  resetLayout = (activeButtonText) => (e) => {
    this.setState({
      layouts: {},
      activeButton: activeButtonText,
      isResetLayout: true,
    });
  };

  layoutOne = (activeButtonText) => (e) => {
    this.setState({
      activeButton: activeButtonText,
      layouts: this.state.layoutOneState,
    });
  };

  onLayoutChange = (layout, layouts) => {
    saveToLS("layouts", layouts);
    console.log(layouts);
    this.setState({
      layouts: layouts,
      isResetLayout: false,
    });

    if (!this.state.isResetLayout) {
      this.setState({
        layoutOneState: layouts,
      });
    }
  };

  renderDraggableHandleBlock = () => {
    return (
      <img
        src={require("../../../assets/img/icons/diamond.svg")}
        alt="draggable handle diamond"
        className="draggableHandleDiamond"
      />
    );
  };

  /*=========================================================================
        react-grid-layout
  ==========================================================================*/

  /*============================================================
      main
  ============================================================*/
  render() {
    // console.log(this.state.projectTimeline);
    const { activeButton } = this.state;
    return (
      <div className="dashboard-bg-color-new">
        {/* left navbar */}
        <LeftNavbar activeMenu="dashboard" />

        <div className="main-page-padding pr-3">
          {/* pagetitle and topnavbar */}
          <div className="dashboard-mb pageTitle-topNavbar-div">
            <PageTitle title="Dashboard" />
            <TopNavbar />
          </div>

          {/* react-grid-layout */}
          <div className="row mx-0 mb-30">
            <GrayButtonSmallFont
              extraClassName={
                activeButton === "Default Layout" || activeButton === ""
                  ? "active-grid-layout-button"
                  : ""
              }
              text="Default Layout"
              onClick={this.resetLayout("Default Layout")}
            />
            <GrayButtonSmallFont
              extraClassName={
                activeButton === "Custom Layout"
                  ? "active-grid-layout-button"
                  : ""
              }
              text="Custom Layout"
              onClick={this.layoutOne("Custom Layout")}
            />
          </div>

          <ResponsiveReactGridLayout
            className="layout"
            cols={{ lg: 12, md: 12, sm: 12, xs: 12, xxs: 12 }}
            rowHeight={30}
            layouts={this.state.layouts}
            onLayoutChange={(layout, layouts) =>
              this.onLayoutChange(layout, layouts)
            }
            // onDragStart={() => console.log("Drag Started")}
            // onDrag={() => console.log("Drag movement")}
            // onDragStop={() => console.log("Drag completed")}
            draggableHandle=".draggableHandleDiamond"
          >
            <div
              key="r1c1r1"
              data-grid={{
                w: 3,
                h: 2,
                x: 0,
                y: 0,
                // isResizable: false,
              }}
            >
              <div className="relative-card-block">
                {this.renderDraggableHandleBlock()}
                {this.renderRow1__C1R1()}
              </div>
            </div>
            <div
              key="r1c1r2"
              data-grid={{
                w: 3,
                h: 1,
                x: 0,
                y: 0,
                // isResizable: false,
              }}
            >
              <div className="relative-card-block">
                {this.renderDraggableHandleBlock()}
                {this.renderRow1__C1R2()}
              </div>
            </div>
            <div
              key="r1c1r3"
              data-grid={{
                w: 3,
                h: 1,
                x: 0,
                y: 0,
                // isResizable: false,
              }}
            >
              <div className="relative-card-block">
                {this.renderDraggableHandleBlock()}
                {this.renderRow1__C1R3()}
              </div>
            </div>
            <div
              key="r1c2"
              data-grid={{
                w: 2,
                h: 4,
                x: 3,
                y: 0,
                // isResizable: false
              }}
            >
              <div className="relative-card-block">
                {this.renderDraggableHandleBlock()}
                {this.renderRow1__C2()}
              </div>
            </div>
            <div
              key="r1c3"
              data-grid={{
                w: 2,
                h: 4,
                x: 5,
                y: 0,
                // isResizable: false
              }}
            >
              <div className="relative-card-block">
                {this.renderDraggableHandleBlock()}
                {this.renderRow1__C3()}
              </div>
            </div>
            <div
              key="r1c4"
              data-grid={{
                w: 5,
                h: 4,
                x: 7,
                y: 0,
                // isResizable: false
              }}
            >
              <div className="relative-card-block">
                {this.renderDraggableHandleBlock()}
                {this.renderRow1__C4()}
              </div>
            </div>
            <div
              key="r2c1"
              data-grid={{
                w: 8,
                h: 7,
                x: 0,
                y: 5,
                // isResizable: false
              }}
            >
              <div className="relative-card-block">
                {this.renderDraggableHandleBlock()}
                {this.renderRow2__C1()}
              </div>
            </div>
            <div
              key="r2c2"
              data-grid={{
                w: 4,
                h: 7,
                x: 8,
                y: 5,
                // isResizable: false
              }}
            >
              <div className="relative-card-block">
                {this.renderDraggableHandleBlock()}
                {this.renderRow2__C2()}
              </div>
            </div>
            <div
              key="r3"
              data-grid={{
                w: 12,
                h: 7,
                x: 12,
                y: 12,
                // isResizable: false
              }}
            >
              <div className="relative-card-block">
                {this.renderDraggableHandleBlock()}
                {this.renderRow3()}
              </div>
            </div>
            <div
              key="r4c1c1"
              data-grid={{
                w: 6,
                h: 8,
                x: 0,
                y: 19,
                // isResizable: false
              }}
            >
              <div className="relative-card-block">
                {this.renderDraggableHandleBlock()}
                {this.renderRow4__C1C1()}
              </div>
            </div>
            <div
              key="r4c1c2"
              data-grid={{
                w: 6,
                h: 8,
                x: 6,
                y: 19,
                // isResizable: false
              }}
            >
              <div className="relative-card-block">
                {this.renderDraggableHandleBlock()}
                {this.renderRow4__C1C2()}
              </div>
            </div>
            <div
              key="r4c2c1"
              data-grid={{
                w: 6,
                h: 8,
                x: 0,
                y: 28,
                // isResizable: false
              }}
            >
              <div className="relative-card-block">
                {this.renderDraggableHandleBlock()}
                {this.renderRow4__C2C1()}
              </div>
            </div>
            <div
              key="r4c2c2"
              data-grid={{
                w: 6,
                h: 8,
                x: 6,
                y: 28,
                // isResizable: false
              }}
            >
              <div className="relative-card-block">
                {this.renderDraggableHandleBlock()}
                {this.renderRow4__C2C2()}
              </div>
            </div>
            <div
              key="r5"
              data-grid={{
                w: 12,
                h: 11,
                x: 12,
                y: 36,
                // isResizable: false
              }}
            >
              <div className="relative-card-block">
                {this.renderDraggableHandleBlock()}
                {this.renderRow5()}
              </div>
            </div>
            <div
              key="r6c1"
              data-grid={{
                w: 4,
                h: 7,
                x: 0,
                y: 36,
                // isResizable: false
              }}
            >
              <div className="relative-card-block">
                {this.renderDraggableHandleBlock()}
                {this.renderRow6__C1()}
              </div>
            </div>
            <div
              key="r6c2"
              data-grid={{
                w: 5,
                h: 7,
                x: 4,
                y: 36,
                // isResizable: false
              }}
            >
              <div className="relative-card-block">
                {this.renderDraggableHandleBlock()}
                {this.renderRow6__C2()}
              </div>
            </div>
            <div
              key="r6c3"
              data-grid={{
                w: 3,
                h: 7,
                x: 9,
                y: 36,
                // isResizable: false
              }}
            >
              <div className="relative-card-block">
                {this.renderDraggableHandleBlock()}
                {this.renderRow6__C3()}
              </div>
            </div>
            <div
              key="r7c1"
              data-grid={{
                w: 9,
                h: 7,
                x: 0,
                y: 44,
                // isResizable: false
              }}
            >
              <div className="relative-card-block">
                {this.renderDraggableHandleBlock()}
                {this.renderRow7__C1()}
              </div>
            </div>
            <div
              key="r7c2"
              data-grid={{
                w: 3,
                h: 7,
                x: 9,
                y: 44,
                // isResizable: false
              }}
            >
              <div className="relative-card-block">
                {this.renderDraggableHandleBlock()}
                {this.renderRow7__C2()}
              </div>
            </div>
          </ResponsiveReactGridLayout>
          {/* react-grid-layout end */}
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  allToDo: state.dashboard.allToDo,
  approvalExpense: state.finance.approvalExpense,
  allPendingLeaves: state.calender.pendingLeaves,
  onLeaveToday: state.calender.onLeaveToday,
  todaysTask: state.dashboard.todaysTask,
  allProjects: state.projects.allProjects,
  projectTimeline: state.dashboard.projectTimeline,
  projectCountDown: state.dashboard.projectCountDown,
  ticketSummary: state.dashboard.ticketSummary,
});

export { socket };

export default connect(mapStateToProps, {
  updateUserDemoWalkthroughFlag,
  getAllToDo,
  updateToDo,
  invoicesIssuedByMonth,
  paidInvoicesIssuedByMonth,
  getAllExpanses,
  getApprovalPendingLeaves,
  approveBulkExpense,
  approveBulkLeaves,
  getOnLeaveToday,
  getCurrentTaskData,
  getExpenseData,
  getYearlyTotalExpense,
  getYearlyBilledExpense,
  getYearlyMisExpense,
  getInvoiceSummary,
  createWorkLog,
  updateWorklogByid,
  getProjectTaskStatusReport,
  getCostVariance,
  getAllProjectAction,
  getTicketSummary,
  getProjectTimeline,
  getProjectCountDown,
})(DashboardMainGrid);
