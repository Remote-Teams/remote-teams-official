import React, { Component, Fragment } from "react";
import AllProjectOverviewAddMemberModal from "./AllProjectOverviewAddMemberModal";
import AllProjectOverviewScheduleIndicatorChart from "./AllProjectOverviewScheduleIndicatorChart";
import { connect } from "react-redux";
import {
  onScheduleIndicator,
  ScheduleIndicatorTaskCompletionByWeek,
  avgCostOfEmployeePerHour,
  toatalCostOfEmployeePerHour,
  updateProject,
  getTaskStatusGrouping,
  getUpcomingScrum,
} from "./../../../store/actions/projectAction";
import isEmpty from "../../../store/validations/is-empty";
import dateFns from "date-fns";
import { startOfDay, endOfDay } from "date-fns";
import differenceInHours from "date-fns/difference_in_hours";
import differenceInMinutes from "date-fns/difference_in_minutes";
import differenceInCalendarDays from "date-fns/difference_in_calendar_days";
import format from "date-fns/format";

import clockIcon from "../../../assets/img/icons/peach-gradient-clock-icon.svg";
import AllProjectOverviewMemberCard from "./AllProjectOverviewMemberCard";

class AllProjectOverview extends Component {
  constructor() {
    super();
    this.state = {
      clientName: "",
      startDate: "",
      endDate: "",
      selectedOption: [],
      isRow1Colm1Edit: false,
      description: "",
      isDescriptionEdit: false,
      currentPaginationModule: 1,
      currentPaginationSprint: 1,
      singleProjectData: {},
    };
  }

  componentDidMount() {
    let projectData = JSON.parse(localStorage.getItem("projectData"));
    if (!isEmpty(projectData)) {
      this.props.onScheduleIndicator(projectData._id);
      this.props.ScheduleIndicatorTaskCompletionByWeek(projectData._id);
      this.props.avgCostOfEmployeePerHour(projectData._id);
      this.props.toatalCostOfEmployeePerHour(projectData._id);

      this.props.getTaskStatusGrouping(projectData._id);

      let newStartDate = startOfDay(new Date());

      const formData = {
        query: {
          project: projectData._id,
          fromTime: { $gte: new Date(newStartDate) },
        },
      };

      this.props.getUpcomingScrum(formData);
      // this.props.getAllModuleDataOfSingleProject(projectData._id);
      // const formData = {
      //   pageNo: 1,
      //   pageSize: 10,
      //   query: {
      //     project: projectData._id,
      //   },
      // };
      // this.props.getAllSprintsOfModuleProject(formData);
    }
  }

  static getDerivedStateFromProps(nextProps, nextState) {
    if (
      !isEmpty(nextProps.projectScheduleIndicator) &&
      nextProps.projectScheduleIndicator !== nextState.projectScheduleIndicator
    ) {
      return {
        projectScheduleIndicator: nextProps.projectScheduleIndicator,
      };
    }
    if (
      !isEmpty(nextProps.avgCostOfEmployee) &&
      nextProps.avgCostOfEmployee !== nextState.avgCostOfEmployee
    ) {
      return {
        avgCostOfEmployee: nextProps.avgCostOfEmployee,
      };
    }
    if (
      !isEmpty(nextProps.totalCostOfEmployee) &&
      nextProps.totalCostOfEmployee !== nextState.totalCostOfEmployee
    ) {
      return {
        totalCostOfEmployee: nextProps.totalCostOfEmployee,
      };
    }

    if (
      !isEmpty(nextProps.healthStatusOfModules) &&
      nextProps.healthStatusOfModules !== nextState.healthStatusOfModules
    ) {
      return {
        healthStatusOfModules: nextProps.healthStatusOfModules,
      };
    }
    if (
      !isEmpty(nextProps.healthStatusOfSprints) &&
      nextProps.healthStatusOfSprints !== nextState.healthStatusOfSprints
    ) {
      return {
        healthStatusOfSprints: nextProps.healthStatusOfSprints,
      };
    }
    if (
      !isEmpty(nextProps.singleProjectData) &&
      nextProps.singleProjectData !== nextState.singleProjectData
    ) {
      let label =
        nextProps.singleProjectData.status === "UPCOMING"
          ? "Upcoming"
          : nextProps.singleProjectData.status === "INPROGRESS"
          ? "In Progress"
          : nextProps.singleProjectData.status === "ONHOLD"
          ? "On Hold"
          : nextProps.singleProjectData.status === "FINISHED"
          ? "Finished"
          : nextProps.singleProjectData.status === "CANCELLED"
          ? "Cancelled"
          : "";
      return {
        singleProjectData: nextProps.singleProjectData,
        clientName: "demo",
        startDate: new Date(nextProps.singleProjectData.startDate),
        endDate: new Date(nextProps.singleProjectData.endDate),
        description: nextProps.singleProjectData.description,
        selectedOption: {
          value: nextProps.singleProjectData.status,
          label: label,
        },
      };
    }
    if (
      !isEmpty(nextProps.allResources) &&
      nextProps.allResources !== nextState.allResources
    ) {
      return {
        allResources: nextProps.allResources,
      };
    }
    if (
      !isEmpty(nextProps.taskStatusGroupingCount) &&
      nextProps.taskStatusGroupingCount !== nextState.taskStatusGroupingCount
    ) {
      return {
        taskStatusGroupingCount: nextProps.taskStatusGroupingCount,
      };
    }
    return null;
  }

  componentDidUpdate() {
    if (this.props.healthStatusOfModules !== this.state.healthStatusOfModules) {
      this.setState({
        healthStatusOfModules: this.props.healthStatusOfModules,
      });
    }
    if (this.props.singleProjectData !== this.state.singleProjectData) {
      let label =
        this.props.singleProjectData.status === "UPCOMING"
          ? "Upcoming"
          : this.props.singleProjectData.status === "INPROGRESS"
          ? "In Progress"
          : this.props.singleProjectData.status === "ONHOLD"
          ? "On Hold"
          : this.props.singleProjectData.status === "FINISHED"
          ? "Finished"
          : this.props.singleProjectData.status === "CANCELLED"
          ? "Cancelled"
          : "";
      this.setState({
        singleProjectData: this.props.singleProjectData,
        clientName: "demo",
        startDate: new Date(this.props.singleProjectData.startDate),
        endDate: new Date(this.props.singleProjectData.endDate),
        description: this.props.singleProjectData.description,
        selectedOption: {
          value: this.props.singleProjectData.status,
          label: label,
        },
      });
    }
    if (
      this.props.taskStatusGroupingCount !== this.state.taskStatusGroupingCount
    ) {
      this.setState({
        taskStatusGroupingCount: this.props.taskStatusGroupingCount,
      });
    }
  }

  /*============================================================
      renderRow1
  ============================================================*/
  // handlers

  handleChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  };

  handleChangeStart = (date) => {
    if (date === null) {
      this.setState({
        startDate: new Date(),
      });
    } else {
      this.setState({
        startDate: date,
      });
    }
  };

  handleChangeEnd = (date) => {
    if (date === null) {
      this.setState({
        endDate: new Date(),
      });
    } else {
      this.setState({
        endDate: date,
      });
    }
  };

  handleChangeDropdown = (selectedOption) => {
    this.setState({ selectedOption });
    console.log(`Option selected:`, selectedOption);
  };

  handleOnClickEditRow1Colm1 = () => {
    this.setState({
      isRow1Colm1Edit: true,
    });
  };

  callBackUpdateProject = (status) => {
    if (status === 200) {
      this.setState({
        isRow1Colm1Edit: false,
        isDescriptionEdit: false,
      });
    }
  };

  handleOnClickSaveRow1Colm1 = () => {
    const { singleProjectData } = this.state;

    console.log(this.state);

    let formData = singleProjectData;
    singleProjectData.startDate = this.state.startDate.toISOString();
    singleProjectData.startDate = this.state.endDate.toISOString();
    singleProjectData.status = this.state.selectedOption.value;
    this.props.updateProject(
      singleProjectData._id,
      formData,
      this.callBackUpdateProject,
      "Project Details updated"
    );
  };

  handleOnClickDiscardRow1Colm1 = () => {
    this.setState({
      isRow1Colm1Edit: false,
    });
  };

  // renderRow1Colm1DisplayData
  renderRow1Colm1DisplayData = () => {
    const { singleProjectData } = this.state;
    return (
      <>
        <div className="overview-block__row1Colm1ClientNameDisplay">
          <h3 className="font-18-bold-space-light-uppercase mb-20">
            client name
          </h3>
          <p className="font-20-semiBold"> {this.state.clientName}</p>
        </div>
        <div className="row mx-0 overview-block__row1Colm1DateDisplay">
          <div className=" overview-block__row1Colm1DateDisplay__1">
            <h3 className="font-18-bold-space-light-uppercase mb-20">
              Start Date
            </h3>
            <p className="font-20-semiBold">
              {dateFns.format(this.state.startDate, "DD/MM/YYYY")}
            </p>
          </div>
          <div className=" overview-block__row1Colm1DateDisplay__2">
            <h3 className="font-18-bold-space-light-uppercase mb-20">
              End Date
            </h3>
            <p className="font-20-semiBold">
              {dateFns.format(this.state.endDate, "DD/MM/YYYY")}
            </p>
          </div>
        </div>
        <div className="overview-block__row1Colm1StatusDisplay">
          <h3 className="font-18-bold-space-light-uppercase mb-20">status</h3>
          <p className="font-20-semiBold">
            {!isEmpty(singleProjectData) && singleProjectData.status}
          </p>
        </div>
      </>
    );
  };

  calculateDayTimeDifference = (val) => {
    let today = new Date();
    let min = differenceInMinutes(today, val);
    let hr = differenceInHours(today, val);
    let day = differenceInCalendarDays(today, val);
    return (
      <p className="font-12-extrabold-space-light-uppercase discussion-display-block-posted-time-text">
        {min < 60 ? (
          min === 0 ? (
            "Now"
          ) : (
            <>{min} Min Ago</>
          )
        ) : hr < 24 ? (
          hr === 1 ? (
            <>{hr} Hour Ago</>
          ) : (
            <>{hr} Hours Ago</>
          )
        ) : day === 1 ? (
          <>{day} Day Ago</>
        ) : day < 7 ? (
          <>{day} Days Ago</>
        ) : (
          format(val, "DD-MMM-YYYY")
        )}
      </p>
    );
  };

  // renderRow1
  renderRow1 = () => {
    const { taskStatusGroupingCount, projectScheduleIndicator } = this.state;
    const { upcomingScrum } = this.props;

    return (
      <div className="row mx-0 flex-nowrap">
        {/* column 1 */}
        <div>
          <div className="overview-block overview-block--row1Colm1 row mx-0 flex-nowrap overview-block--row1Colm1-row">
            {this.renderRow1Colm1DisplayData()}
          </div>
          <div className="overview-block overview-block--desc1">
            <h3 className="font-14-extraBold-letter-spacing-text2 mb-30 mr-30">
              On Schedule indicator
            </h3>
            <div className="row mx-0 flex-nowrap justify-content-between">
              <div className="overview-block-schedular-colm-1">
                <span className="overview-percent-gradient-text">
                  {!isEmpty(projectScheduleIndicator)
                    ? parseInt(projectScheduleIndicator[0].onschedulepercentage)
                    : 0}
                  %
                </span>
                <p className="font-14-regular-italic pt-10">On Schedule</p>
              </div>
              <div className="overview-block-schedular-colm-2">
                <AllProjectOverviewScheduleIndicatorChart />
              </div>
            </div>
          </div>
        </div>
        {/* column 2 */}
        <div>
          <div className="overview-block overview-block--row1Colm2">
            <h3 className="font-14-extraBold-letter-spacing-text2 overview-block--row1Colm2__taskStatusTitle">
              {/* task status */}
              tasks by priority
            </h3>
            <div className="row mx-0 flex-nowrap align-items-start project-new-task-status-row">
              <div>
                <h4 className="web-reasource-circle1 web-reasource-circle1--0">
                  <span>
                    {" "}
                    {!isEmpty(taskStatusGroupingCount) && (
                      <span>
                        {taskStatusGroupingCount.lowCount +
                          taskStatusGroupingCount.normalCount +
                          taskStatusGroupingCount.highCount +
                          taskStatusGroupingCount.criticalCount}
                      </span>
                    )}
                  </span>
                </h4>
                <p className="font-16-normal-italic">Total</p>
              </div>
              <div>
                <h4 className="web-reasource-circle1 web-reasource-circle1--3">
                  {!isEmpty(taskStatusGroupingCount) && (
                    <span>{taskStatusGroupingCount.lowCount}</span>
                  )}
                </h4>
                <p className="font-16-normal-italic">
                  {/* Pending */}
                  Low
                </p>
              </div>
              <div>
                <h4 className="web-reasource-circle1 web-reasource-circle1--1">
                  {!isEmpty(taskStatusGroupingCount) && (
                    <span>{taskStatusGroupingCount.normalCount}</span>
                  )}
                </h4>
                <p className="font-16-normal-italic">
                  {/* Ongoing */}
                  Normal
                </p>
              </div>
              <div>
                <h4 className="web-reasource-circle1 web-reasource-circle1--2">
                  {!isEmpty(taskStatusGroupingCount) && (
                    <span>{taskStatusGroupingCount.highCount}</span>
                  )}
                </h4>
                <p className="font-16-normal-italic">
                  {/* Completed */}
                  Important
                </p>
              </div>
              <div>
                {/* <h4 className="web-reasource-circle1 web-reasource-circle1--2">
                  {!isEmpty(taskStatusGroupingCount) &&
                    taskStatusGroupingCount.upcomingCount}
                </h4>
                <p className="font-16-normal-italic">Upcoming</p> */}
                <h4 className="web-reasource-circle1 web-reasource-circle1--4">
                  <span>
                    {" "}
                    {!isEmpty(taskStatusGroupingCount) && (
                      <span>{taskStatusGroupingCount.criticalCount}</span>
                    )}
                  </span>
                </h4>
                <p className="font-16-normal-italic">
                  {/* Overdue */}
                  Critical
                </p>
              </div>
            </div>
          </div>

          <div className="row align-items-start mx-0 flex-nowrap mt-20">
            <div className="row mx-0 align-items-center justify-content-between overview-block overview-block--scrum">
              {!isEmpty(upcomingScrum) ? (
                <>
                  {" "}
                  <h3 className="font-14-extraBold-letter-spacing-text2 mr-30 mb-0">
                    Upcoming scrum in
                  </h3>
                  {/* <p className="overview-block__row2-p">23 mins</p> */}
                  {/* {!isEmpty(upcomingScrum) && ( */}
                  <p className="overview-block__row2-p mb-0 pt-0">
                    {dateFns.format(
                      upcomingScrum[0].fromTime,
                      "do MMM hh:mm aa"
                    )}
                    <img
                      src={clockIcon}
                      alt="clock"
                      className="overview-block__row2__clock-icon"
                    />
                  </p>
                </>
              ) : (
                "No  Upcoming scrum"
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  /*============================================================
      renderRow2
  ============================================================*/
  // handlers
  handleOnClickEditDesc = () => {
    this.setState({
      isDescriptionEdit: true,
    });
  };

  handleOnClickSaveDesc = () => {
    const { singleProjectData } = this.state;

    // console.log(this.state);

    let formData = singleProjectData;

    singleProjectData.description = this.state.description;
    this.props.updateProject(
      singleProjectData._id,
      formData,
      this.callBackUpdateProject,
      "Project Detail updated"
    );
  };

  handleOnClickDiscardDesc = () => {
    this.setState({
      isDescriptionEdit: false,
    });
  };

  renderRow2 = () => {
    const { singleProjectData, allResources, description } = this.state;
    // console.log(singleProjectData.resourcesData);
    return (
      <>
        <div className="row mx-0 flex-nowrap">
          <div className="overview-block overview-block--member">
            <h3 className="font-14-extraBold-letter-spacing-text2">Members</h3>

            <div className="row mx-0 flex-nowrap align-items-center mt-20">
              <div className="row mx-0 flex-nowrap align-items-center overview-row2-img-text-overflow">
                {!isEmpty(singleProjectData) &&
                  singleProjectData.resourcesData.map((data, index) => (
                    <Fragment key={index}>
                      {/* <div key={index} className="overview-row2-img-text-block">
                      <img
                        src={require("../../../assets/img/dummy/new-profile-img.svg")}
                        //src={require("../../../assets/img/dummy/selected-member-profile-new.svg")}
                        //src={require("../../../assets/img/dummy/access-role-resource.svg")}
                        alt="person"
                      />
                      <p className="font-14-regular-italic">{data.name}</p>
                    </div> */}
                      <AllProjectOverviewMemberCard
                        resourceData={data}
                        singleProjectData={singleProjectData}
                      />
                    </Fragment>
                  ))}
              </div>
              <div className="pl-30 mb-20">
                <AllProjectOverviewAddMemberModal
                  allResources={allResources}
                  singleProjectData={singleProjectData}
                />
              </div>
            </div>
          </div>
          {/* colm2 */}
          <div className="overview-block overview-block--desc2">
            <h3 className="font-14-extraBold-letter-spacing-text2 mb-30 mr-30">
              Description
            </h3>
            <div className="overview-block--desc2-desc-block">
              <p
                dangerouslySetInnerHTML={{ __html: description }}
                className="font-14-semiBold overview-text-capitalize"
              >
                {/* {description} */}
              </p>
            </div>
          </div>
        </div>
      </>
    );
  };

  /*============================================================
      main
  ============================================================*/
  render() {
    // console.log(this.state.healthStatusOfModules);
    return (
      <>
        {this.renderRow1()}
        {this.renderRow2()}
      </>
    );
  }
}

const mapStateToProps = (state) => ({
  projectScheduleIndicator: state.projects.projectScheduleIndicator,
  avgCostOfEmployee: state.projects.avgCostOfEmployee,
  totalCostOfEmployee: state.projects.totalCostOfEmployee,
  healthStatusOfModules: state.projects.healthStatusOfModules,
  healthStatusOfSprints: state.projects.healthStatusOfSprints,
  singleProjectData: state.projects.singleProjectData,
  allResources: state.resources.allResources,
  taskStatusGroupingCount: state.projects.taskStatusGroupingCount,
  upcomingScrum: state.projects.upcomingScrum,
});

export default connect(mapStateToProps, {
  onScheduleIndicator,
  ScheduleIndicatorTaskCompletionByWeek,
  avgCostOfEmployeePerHour,
  toatalCostOfEmployeePerHour,

  updateProject,
  getTaskStatusGrouping,
  getUpcomingScrum,
})(AllProjectOverview);
