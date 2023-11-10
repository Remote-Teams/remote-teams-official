import React, { Component } from "react";
import Select from "react-select";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import ReportsTabPanelTitle from "./ReportsTabPanelTitle";
import ProjectStatusReportBudgetGraph from "./ProjectStatusReportBudgetGraph";
import ProjectStatusReportHoursGraph from "./ProjectStatusReportHoursGraph";
import ProjectStatusReportBudgetSpentBarGraph from "./ProjectStatusReportBudgetSpentBarGraph";
import ProjectStatusReportUtilizedHoursBarGraph from "./ProjectStatusReportUtilizedHoursBarGraph";
import { connect } from "react-redux";
import {
  getCompletionStatus,
  getOverallBudgetSpent,
  getUtilizedHors,
  getProjectHealth,
  getProjectCountDown,
} from "./../../../store/actions/reportAction";
import { getAllProjectAction } from "./../../../store/actions/projectAction";
import isEmpty from "../../../store/validations/is-empty";

const dummyProjectHealth = "Critical State";

class ProjectStatusReport extends Component {
  constructor() {
    super();
    this.state = {
      projectSelected: "",
      projectOptions: [],
      projectTaskCompletion: [],
    };
  }

  /*=================================================================
      lifecycle methods
  ==================================================================*/
  componentDidMount() {
    this.props.getAllProjectAction();

    window.scrollTo(0, 0);
  }

  static getDerivedStateFromProps(nextProps, nextState) {
    if (
      !isEmpty(nextProps.allProjects) &&
      nextProps.allProjects !== nextState.allProjects &&
      !nextState.hasModuleSet
    ) {
      // console.log(nextProps.allProjects);
      nextProps.getCompletionStatus(nextProps.allProjects[0]._id);
      nextProps.getOverallBudgetSpent(nextProps.allProjects[0]._id);
      nextProps.getUtilizedHors(nextProps.allProjects[0]._id);
      nextProps.getProjectHealth(nextProps.allProjects[0]._id);
      nextProps.getProjectCountDown(nextProps.allProjects[0]._id);
      let newArray =
        !isEmpty(nextProps.allProjects) &&
        nextProps.allProjects.map((project) => ({
          value: project._id,
          label: project.name,
        }));
      return {
        projectOptions: newArray,
        projectSelected: {
          value: nextProps.allProjects[0]._id,
          label: nextProps.allProjects[0].name,
        },
        hasModuleSet: true,
      };
    }

    if (
      !isEmpty(nextProps.projectTaskCompletion) &&
      nextProps.projectTaskCompletion !== nextState.projectTaskCompletion
    ) {
      return {
        projectTaskCompletion: nextProps.projectTaskCompletion,
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
      !isEmpty(nextProps.projectHealth) &&
      nextProps.projectHealth !== nextState.projectHealth
    ) {
      return {
        projectHealth: nextProps.projectHealth,
      };
    }

    return null;
  }

  componentDidUpdate() {
    if (this.props.projectTaskCompletion !== this.state.projectTaskCompletion) {
      this.setState({
        projectTaskCompletion: this.props.projectTaskCompletion,
      });
    }
  }

  /*============================================================
      handlers
  ============================================================*/

  handleOnClickDownload = () => {
    console.log("clicked on download");
  };

  handleChangeSelectProject = (selectedOption) => {
    this.setState({ projectSelected: selectedOption });
    this.props.getCompletionStatus(selectedOption.value);
    this.props.getOverallBudgetSpent(selectedOption.value);
    this.props.getUtilizedHors(selectedOption.value);
    this.props.getProjectHealth(selectedOption.value);
    this.props.getProjectCountDown(selectedOption.value);
  };

  /*============================================================
      renderProjectHealthStatus
  ============================================================*/
  renderProjectHealthStatus = () => {
    return (
      <div className="project-report-status-health-text-block">
        <div className="pb-10 mr-25">
          <h4 className="font-18-extraBold-space-light-uppercase">
            {/*<i className="fa fa-circle fa-circle-pink"></i>*/}
            {/* <i className="fa fa-circle all-project-overview-sprint-circle--pink"></i> */}
            <i className="fa fa-circle all-project-overview-sprint-circle--lightBlue"></i>
            <span>Ahead Schedule</span>
          </h4>
        </div>
        <div className="pb-10 mr-25">
          <h4 className="font-18-extraBold-space-light-uppercase">
            {/*<i className="fa fa-circle fa-circle-darkBlue"></i>*/}
            {/* <i className="fa fa-circle all-project-overview-sprint-circle--darkBlue"></i> */}
            <i className="fa fa-circle all-project-overview-sprint-circle--pink"></i>
            <span>Slightly Ahead</span>
          </h4>
        </div>
        <div className="pb-10 mr-25">
          <h4 className="font-18-extraBold-space-light-uppercase">
            {/*<i className="fa fa-circle fa-circle-lightBlue"></i>*/}
            {/* <i className="fa fa-circle all-project-overview-sprint-circle--lightBlue"></i> */}
            <i className="fa fa-circle all-project-overview-sprint-circle--darkBlue"></i>
            <span>On Track</span>
          </h4>
        </div>
        <div className="pb-10 mr-25">
          <h4 className="font-18-extraBold-space-light-uppercase">
            <i className="fa fa-circle fa-circle-yellow"></i>
            <span>Lagging</span>
          </h4>
        </div>
        <div className="pb-10 mr-25">
          <h4 className="font-18-extraBold-space-light-uppercase">
            {/*<i className="fa fa-circle fa-circle-orange"></i>*/}
            <i className="fa fa-circle all-project-overview-sprint-circle--orange"></i>
            <span>Critical State</span>
          </h4>
        </div>
      </div>
    );
  };

  /*============================================================
      main
  ============================================================*/
  render() {
    const {
      projectTaskCompletion,
      projectCountDown,
      projectHealth,
    } = this.state;

    let percentCompleted = !isEmpty(projectTaskCompletion)
      ? projectTaskCompletion[1]
      : 0;
    let taskCompleted = !isEmpty(projectTaskCompletion)
      ? projectTaskCompletion[3]
      : 0;
    let taskAssigned = !isEmpty(projectTaskCompletion)
      ? projectTaskCompletion[5]
      : 0;
    return (
      <>
        <ReportsTabPanelTitle
          title="project status report"
          onClick={this.handleOnClickDownload}
        />
        <div className="mb-50 pb-10">
          {/*<h3 className="font-18-bold-space-light-uppercase color-white pb-10">
            Project name
    </h3>*/}
          <Select
            className="react-select-container react-select-container--addMember react-select-container--noBorder"
            classNamePrefix="react-select-elements"
            value={this.state.projectSelected}
            onChange={this.handleChangeSelectProject}
            options={this.state.projectOptions}
            placeholder="Project name"
            //placeholder="Select"
            isSearchable={false}
          />
        </div>
        <div className="row mx-0 project-status-report-card-container">
          {/* card 1 */}
          <div>
            <h4 className="font-18-bold-space-light-uppercase report-project-status-card-title-1 row reports-circle-icon-text mx-0">
              <img
                //src={require("../../../assets/img/reports/circle-icons/orange-circle-icon.svg")}
                src={require("../../../assets/img/reports/circle-icons/gradient-green-circle-icon.svg")}
                alt=""
                className="reports-circle-icon"
              />
              completion status
            </h4>
            <div className="reports-card reports-card--project-status project-status-report-card--status">
              <div className="project-status-report-card__circular-progressbar">
                <CircularProgressbar
                  value={`${percentCompleted.toFixed(0)}`}
                  text={`${percentCompleted.toFixed(0)}%`}
                  strokeWidth={15}
                />
                <p className="font-24-regular text-center pr-20">
                  {/*percentCompleted.toFixed(0)%*/} completed
                </p>
              </div>
              <div className="project-status-report-card__text-div">
                <h4 className="project-status-report-card__title">
                  {taskAssigned}
                </h4>
                <p className="font-18-extraBold-space-light-uppercase">
                  Tasks Assigned
                </p>
                <hr className="project-status-report-card__hr" />
                <h4 className="project-status-report-card__title project-status-report-card__title2">
                  {taskCompleted}
                </h4>
                <p className="font-18-extraBold-space-light-uppercase">
                  Tasks Completed
                </p>
              </div>
            </div>
          </div>

          {/* card 2 */}
          <div>
            <h4 className="font-18-bold-space-light-uppercase report-project-status-card-title-2  row reports-circle-icon-text mx-0">
              <img
                //src={require("../../../assets/img/reports/circle-icons/pink-circle-icon.svg")}
                src={require("../../../assets/img/reports/circle-icons/gradient-purple-circle-icon.svg")}
                alt=""
                className="reports-circle-icon"
              />
              project health
            </h4>
            <div className="reports-card reports-card--project-status reports-card--project-status--project-health row mx-0 align-items-center">
              <div className="all-project-overview-sprint-circle-text-block all-project-overview-sprint-circle-text-block--reports">
                <div
                  className={
                    projectHealth === "ahead schedule"
                      ? "all-project-overview-sprint-circle all-project-overview-sprint-circle--lightBlue"
                      : projectHealth === "above average" ||
                        projectHealth === "slightly ahead" ||
                        projectHealth === "excellent"
                      ? "all-project-overview-sprint-circle all-project-overview-sprint-circle--pink"
                      : projectHealth === "on track" || projectHealth === "good"
                      ? "all-project-overview-sprint-circle all-project-overview-sprint-circle--darkBlue"
                      : projectHealth === "needs intervention" ||
                        projectHealth === "below average"
                      ? "all-project-overview-sprint-circle all-project-overview-sprint-circle--yellow"
                      : projectHealth === "very critical" ||
                        projectHealth === "critical" ||
                        projectHealth === "none"
                      ? "all-project-overview-sprint-circle all-project-overview-sprint-circle--orange"
                      : isEmpty(projectHealth)
                      ? "all-project-overview-sprint-circle all-project-overview-sprint-circle--yellow"
                      : ""
                  }
                >
                  <div>
                    <span>
                      {!isEmpty(projectCountDown)
                        ? projectCountDown.value < 0
                          ? 0
                          : projectCountDown.value
                        : 0}
                    </span>
                    <p className="overview-block-sprint-block__circle-bottom-text">
                      Days left
                    </p>
                  </div>
                </div>
              </div>
              {this.renderProjectHealthStatus()}
            </div>
          </div>

          {/* card 3 */}
          <div>
            <h4 className="font-18-bold-space-light-uppercase report-project-status-card-title-3  row reports-circle-icon-text mx-0">
              <img
                //src={require("../../../assets/img/reports/circle-icons/green-circle-icon.svg")}
                src={require("../../../assets/img/reports/circle-icons/gradient-blue-circle-icon.svg")}
                alt=""
                className="reports-circle-icon"
              />
              overall budget spent
            </h4>
            <div className="reports-card reports-card--project-status2">
              {/* <ProjectStatusReportBudgetGraph /> */}
              <ProjectStatusReportBudgetSpentBarGraph />
            </div>
          </div>

          {/* card 4 */}
          <div>
            <h4 className="font-18-bold-space-light-uppercase report-project-status-card-title-4 row reports-circle-icon-text mx-0">
              <img
                //src={require("../../../assets/img/reports/circle-icons/blue-circle-icon.svg")}
                src={require("../../../assets/img/reports/circle-icons/gradient-pink-circle-icon.svg")}
                alt=""
                className="reports-circle-icon"
              />
              Utilized hours
            </h4>
            <div className="reports-card reports-card--project-status2 reports-card--project-status2--card-4">
              {/* <ProjectStatusReportHoursGraph /> */}
              <ProjectStatusReportUtilizedHoursBarGraph />
            </div>
          </div>
        </div>
      </>
    );
  }
}

const mapStateToProps = (state) => ({
  allProjects: state.projects.allProjects,
  projectTaskCompletion: state.reports.projectTaskCompletion,
  projectCountDown: state.reports.projectCountDown,
  projectHealth: state.reports.projectHealth,
});

export default connect(mapStateToProps, {
  getCompletionStatus,
  getAllProjectAction,
  getOverallBudgetSpent,
  getUtilizedHors,
  getProjectHealth,
  getProjectCountDown,
})(ProjectStatusReport);
