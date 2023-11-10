import React, { Component } from "react";
import Select from "react-select";
import Pagination from "rc-pagination";
import "rc-pagination/assets/index.css";
import CountCardCommon from "../common/CountCardCommon";
import DatePickerFromToDate from "../common/DatePickerFromToDate";
import InputFieldEmailTextPassword from "../common/InputFieldEmailTextPassword";
import TextareaField from "../common/TextareaField";
import AllProjectOverviewAddMemberModal from "./AllProjectOverviewAddMemberModal";
import AllProjectOverviewScheduleIndicatorChart from "./AllProjectOverviewScheduleIndicatorChart";
import { connect } from "react-redux";
import {
  onScheduleIndicator,
  ScheduleIndicatorTaskCompletionByWeek,
  avgCostOfEmployeePerHour,
  toatalCostOfEmployeePerHour,
  getHealthStatusOfModule,
  getHealthStatusOfSprint,
  // getAllModuleDataOfSingleProject,
  // getAllSprintsOfModuleProject,
  updateProject,
  getTaskStatusGrouping,
  getUpcomingScrum,
} from "./../../../store/actions/projectAction";
import isEmpty from "../../../store/validations/is-empty";
import dateFns from "date-fns";
import { startOfDay, endOfDay } from "date-fns";

const dummyDataMember = [1, 2, 3, 4];
const dummyDataModule = [
  "Ahead Schedule",
  "Slightly Ahead",
  "On Track",
  "Lagging",
  "Critical State",
];
const dummyDataSprint = [
  "On Track",
  "Lagging",
  "Ahead Schedule",
  "Slightly Ahead",
  "Critical State",
];

const totalRecordsInOnePage = 2;

const options = [
  { value: "UPCOMING", label: "Upcoming" },
  { value: "INPROGRESS", label: "In Progress" },
  { value: "ONHOLD", label: "On Hold" },
  { value: "FINISHED", label: "Finished" },
  { value: "CANCELLED", label: "Cancelled" },
];

class AllProjectOverviewOld extends Component {
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
    };
  }

  componentDidMount() {
    let projectData = JSON.parse(localStorage.getItem("projectData"));
    if (!isEmpty(projectData)) {
      this.props.onScheduleIndicator(projectData._id);
      this.props.ScheduleIndicatorTaskCompletionByWeek(projectData._id);
      this.props.avgCostOfEmployeePerHour(projectData._id);
      this.props.toatalCostOfEmployeePerHour(projectData._id);
      this.props.getHealthStatusOfModule(projectData._id);
      this.props.getHealthStatusOfSprint(projectData._id);
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

  // renderRow1
  renderRow1 = () => {
    const { isRow1Colm1Edit } = this.state;
    const { taskStatusGroupingCount } = this.state;
    return (
      <div className="row mx-0 flex-nowrap">
        {/* column 1 */}
        <div className="overview-block overview-block--row1Colm1">
          <div className="row mx-0 flex-nowrap overview-block--row1Colm1-row">
            {isRow1Colm1Edit ? (
              <>
                <div>
                  <h3 className="font-14-extraBold-letter-spacing-text1 mb-20">
                    client name
                  </h3>
                  <InputFieldEmailTextPassword
                    containerClassName="container-login-flow-input container-login-flow-input--forms overview-block__no-border"
                    //label="client name"
                    placeholder="client name"
                    name="clientName"
                    value={this.state.clientName}
                    onChange={this.handleChange}
                    type="text"
                  />
                </div>
                <div className="overview-block__row1Colm1Date">
                  <DatePickerFromToDate
                    labelStart="Start Date"
                    startDateValue={this.state.startDate}
                    labelEnd="End date"
                    endDateValue={this.state.endDate}
                    handleChangeStart={this.handleChangeStart}
                    handleChangeEnd={this.handleChangeEnd}
                  />
                </div>
                <div>
                  <h3 className="font-14-extraBold-letter-spacing-text1 mb-20">
                    status
                  </h3>
                  <Select
                    isSearchable={false}
                    className="react-select-container react-select-container--addMember react-select-container--addMember--project-overview"
                    classNamePrefix="react-select-elements"
                    value={this.state.selectedOption}
                    onChange={this.handleChangeDropdown}
                    options={options}
                    placeholder="Select"
                  />
                </div>
              </>
            ) : (
              this.renderRow1Colm1DisplayData()
            )}

            {!isRow1Colm1Edit ? (
              <i
                className="fa fa-pencil overview-block__pencil-edit"
                onClick={this.handleOnClickEditRow1Colm1}
              ></i>
            ) : (
              <div className="row mr-0 flex-nowrap overview-block__save-and-close ml-auto mb-30">
                <i
                  className="fa fa-save overview-block__pencil-edit mr-30"
                  onClick={this.handleOnClickSaveRow1Colm1}
                ></i>
                <i
                  className="fa fa-times overview-block__pencil-edit ml-0"
                  onClick={this.handleOnClickDiscardRow1Colm1}
                ></i>
              </div>
            )}
          </div>
        </div>
        {/* column 2 */}
        <div className="overview-block overview-block--row1Colm2">
          <div className="row mx-0 flex-nowrap align-items-center justify-content-between">
            <h3 className="font-14-extraBold-letter-spacing-text2">
              task status
            </h3>
            {/* <div>
              <h4 className="web-reasource-circle1">
                {!isEmpty(taskStatusGroupingCount) &&
                  taskStatusGroupingCount.ongoingCount +
                    taskStatusGroupingCount.upcomingCount +
                    taskStatusGroupingCount.completedCount +
                    taskStatusGroupingCount.pendingCount}
              </h4>
              <p className="font-24-semiBold">Total</p>
            </div> */}
            <div>
              <h4 className="web-reasource-circle1">
                {!isEmpty(taskStatusGroupingCount) &&
                  taskStatusGroupingCount.ongoingCount}
              </h4>
              <p className="font-16-normal-italic">Ongoing</p>
            </div>
            <div>
              <h4 className="web-reasource-circle1 web-reasource-circle1--2">
                {!isEmpty(taskStatusGroupingCount) &&
                  taskStatusGroupingCount.upcomingCount}
              </h4>
              <p className="font-16-normal-italic">Upcoming</p>
            </div>
            <div>
              <h4 className="web-reasource-circle1 web-reasource-circle1--3">
                {!isEmpty(taskStatusGroupingCount) &&
                  taskStatusGroupingCount.pendingCount}
              </h4>
              <p className="font-16-normal-italic">Pending</p>
            </div>
            <div>
              <h4 className="web-reasource-circle1 web-reasource-circle1--4">
                {!isEmpty(taskStatusGroupingCount) &&
                  taskStatusGroupingCount.completedCount}
              </h4>
              <p className="font-16-normal-italic">Completed</p>
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
    const {
      avgCostOfEmployee,
      totalCostOfEmployee,
      singleProjectData,
      allResources,
      //from row 3
      projectScheduleIndicator,
      description,
      isDescriptionEdit,
    } = this.state;
    const { upcomingScrum } = this.props;
    console.log(upcomingScrum);

    return (
      <div className="row mx-0 flex-nowrap all-project-overview__row2">
        <div>
          <div className="row align-items-start mx-0 flex-nowrap mt-20">
            <CountCardCommon
              title="avg cost of emp per hour( $ )"
              count={!isEmpty(avgCostOfEmployee) ? avgCostOfEmployee : 0}
            />
            <CountCardCommon
              title="Total cost of emp per hour( $ )"
              count={!isEmpty(totalCostOfEmployee) ? totalCostOfEmployee : 0}
            />
            <div className="overview-block overview-block--scrum">
              {!isEmpty(upcomingScrum) ? (
                <>
                  {" "}
                  <h3 className="font-14-extraBold-letter-spacing-text2">
                    Upcoming scrum in
                  </h3>
                  <p className="overview-block__row2-p">
                    {dateFns.format(
                      upcomingScrum[0].fromTime,
                      "do MMM hh:mm aa"
                    )}
                  </p>{" "}
                </>
              ) : (
                "No upcoming scrum"
              )}
            </div>
          </div>
          {/* colm1 */}
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

        <div>
          <div className="overview-block overview-block--member">
            <h3 className="font-14-extraBold-letter-spacing-text2">Members</h3>

            <div className="row mx-0 flex-nowrap align-items-start mt-20">
              <div className="row mx-0 flex-nowrap align-items-center overview-row2-img-text-overflow">
                {!isEmpty(singleProjectData) &&
                  singleProjectData.resources.map((data, index) => (
                    <div key={index} className="overview-row2-img-text-block">
                      <img
                        src={require("../../../assets/img/dummy/new-profile-img.svg")}
                        //src={require("../../../assets/img/dummy/selected-member-profile-new.svg")}
                        //src={require("../../../assets/img/dummy/access-role-resource.svg")}
                        alt="person"
                      />
                      <p className="font-14-regular-italic">{data.name}</p>
                    </div>
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
            <div
              className={
                isDescriptionEdit
                  ? "row mx-0 justify-content-between align-items-center"
                  : "row mx-0"
              }
            >
              <h3 className="font-14-extraBold-letter-spacing-text2 mb-30 mr-30">
                Description
              </h3>
              {!isDescriptionEdit ? (
                <i
                  className="fa fa-pencil overview-block__pencil-edit"
                  onClick={this.handleOnClickEditDesc}
                ></i>
              ) : (
                <div className="row mx-0 mb-30">
                  <i
                    className="fa fa-save overview-block__pencil-edit mr-30"
                    onClick={this.handleOnClickSaveDesc}
                  ></i>
                  <i
                    className="fa fa-times overview-block__pencil-edit"
                    onClick={this.handleOnClickDiscardDesc}
                  ></i>
                </div>
              )}
            </div>
            {isDescriptionEdit ? (
              <TextareaField
                containerClassName="container-login-flow-textarea container-login-flow-textarea--all-project-overview"
                label=""
                name="description"
                value={this.state.description}
                onChange={this.handleChange}
              />
            ) : (
              <div className="overview-block--desc2-desc-block">
                <p className="font-14-semiBold overview-text-capitalize">
                  {description}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  /*============================================================
    renderRow3
  ============================================================*/
  // handlers
  //  handleOnClickEditDesc = () => {
  //   this.setState({
  //     isDescriptionEdit: true,
  //   });
  // };

  //handleOnClickSaveDesc = () => {
  //  const { singleProjectData } = this.state;

  // console.log(this.state);

  // let formData = singleProjectData;

  //singleProjectData.description = this.state.description;
  //this.props.updateProject(
  // singleProjectData._id,
  // formData,
  // this.callBackUpdateProject,
  //"Project Detail updated"
  //);
  //};

  //handleOnClickDiscardDesc = () => {
  // this.setState({
  //   isDescriptionEdit: false,
  // });
  //};

  // renderRow3
  //renderRow3 = () => {
  //  const {
  //   projectScheduleIndicator,
  //   description,
  //   isDescriptionEdit,
  //} = this.state;
  //return (
  //  <div className="row mx-0 flex-nowrap">
  //   {/* colm1 */}
  //   <div className="overview-block overview-block--desc1">
  //    <h3 className="font-14-extraBold-letter-spacing-text2 mb-30 mr-30">
  //      On Schedule indicator
  //    </h3>
  //    <div className="row mx-0 flex-nowrap justify-content-between">
  //      <div className="overview-block-schedular-colm-1">
  //       <span className="overview-percent-gradient-text">
  //        {!isEmpty(projectScheduleIndicator)
  //         ? parseInt(projectScheduleIndicator[0].onschedulepercentage)
  //        : 0}
  //     %
  //   </span>
  //   <p className="font-14-regular-italic pt-10">On Schedule</p>
  // </div>
  //<div className="overview-block-schedular-colm-2">
  // <AllProjectOverviewScheduleIndicatorChart />
  //</div>
  // </div>
  // </div>
  // {/* colm2 */}
  // <div className="overview-block overview-block--desc2">
  //  <div
  //    className={
  //       isDescriptionEdit
  //         ? "row mx-0 justify-content-between align-items-center"
  //         : "row mx-0"
  //     }
  //   >
  //     <h3 className="font-14-extraBold-letter-spacing-text2 mb-30 mr-30">
  //       Description
  //     </h3>
  //     {!isDescriptionEdit ? (
  //       <i
  //         className="fa fa-pencil overview-block__pencil-edit"
  //         onClick={this.handleOnClickEditDesc}
  //        ></i>
  //     ) : (
  //      <div className="row mx-0 mb-30">
  //        <i
  //           className="fa fa-save overview-block__pencil-edit mr-30"
  //           onClick={this.handleOnClickSaveDesc}
  //        ></i>
  //        <i
  //          className="fa fa-times overview-block__pencil-edit"
  //          onClick={this.handleOnClickDiscardDesc}
  //        ></i>
  //      </div>
  //    )}
  //  </div>
  //  {isDescriptionEdit ? (
  //    <TextareaField
  //      containerClassName="container-login-flow-textarea container-login-flow-textarea--all-project-overview"
  //      label=""
  //      name="description"
  //      value={this.state.description}
  //      onChange={this.handleChange}
  //   />
  // ) : (
  //    <div className="overview-block--desc2-desc-block">
  //      <p className="font-14-semiBold overview-text-capitalize">
  //        {description}
  //     </p>
  //    </div>
  //  )}
  // </div>
  // </div>
  //);
  //};

  /*============================================================
    renderRow4
  ============================================================*/
  // handlers
  onChangePaginationModule = (page) => {
    this.setState({
      currentPaginationModule: page,
    });
  };

  onChangePaginationSprint = (page) => {
    this.setState({
      currentPaginationSprint: page,
    });
  };

  renderSprintsTitleRow = () => {
    return (
      <div className="row mx-0 flex-nowrap">
        <div className="mb-20 mr-25">
          <h4 className="font-18-semiBold">
            {/*<i className="fa fa-circle fa-circle-pink"></i>*/}
            <i className="fa fa-circle all-project-overview-sprint-circle--pink"></i>
            <span className="opacity-41">Ahead Schedule</span>
          </h4>
        </div>
        <div className="mb-20 mr-25">
          <h4 className="font-18-semiBold">
            {/*<i className="fa fa-circle fa-circle-darkBlue"></i>*/}
            <i className="fa fa-circle all-project-overview-sprint-circle--darkBlue"></i>
            <span className="opacity-41">Slightly Ahead</span>
          </h4>
        </div>
        <div className="mb-20 mr-25">
          <h4 className="font-18-semiBold">
            {/*<i className="fa fa-circle fa-circle-lightBlue"></i>*/}
            <i className="fa fa-circle all-project-overview-sprint-circle--lightBlue"></i>
            <span className="opacity-41">On Track</span>
          </h4>
        </div>
        <div className="mb-20 mr-25">
          <h4 className="font-18-semiBold">
            <i className="fa fa-circle fa-circle-yellow"></i>
            <span className="opacity-41">Lagging</span>
          </h4>
        </div>
        <div className="mb-20 mr-25">
          <h4 className="font-18-semiBold">
            <i className="fa fa-circle all-project-overview-sprint-circle--orange"></i>
            {/*<i className="fa fa-circle fa-circle-orange"></i>*/}
            <span className="opacity-41">Critical State</span>
          </h4>
        </div>
      </div>
    );
  };

  renderModulesBlock = (currentPagination) => {
    const { healthStatusOfModules } = this.state;

    // console.log(healthStatusOfModules);
    let finalHealthData = [];

    let healthStatusOfProjects =
      !isEmpty(healthStatusOfModules) && healthStatusOfModules[1];

    let filterData =
      !isEmpty(healthStatusOfModules) &&
      healthStatusOfModules[0].forEach((module, index) => {
        // console.log(module, index);

        let healthData = module;
        healthData.healthStatus = healthStatusOfProjects[index];
        // console.log(healthData);
        finalHealthData.push(healthData);
      });

    // console.log(finalHealthData);
    return (
      <div className="row mx-0 flex-nowrap align-items-center overview-block-sprint-block-main">
        {!isEmpty(finalHealthData) &&
          finalHealthData.map(
            (data, index) =>
              index >= (currentPagination - 1) * totalRecordsInOnePage &&
              index < currentPagination * totalRecordsInOnePage && (
                <div key={index} className="overview-block-sprint-block">
                  <div className="row mx-0 flex-nowrap align-items-center">
                    <div className="all-project-overview-sprint-circle-text-block">
                      <div
                        className={
                          data.healthStatus === "above average" ||
                          data.healthStatus === "ahead schedule"
                            ? "all-project-overview-sprint-circle all-project-overview-sprint-circle--pink"
                            : data.healthStatus === "slightly ahead"
                            ? "all-project-overview-sprint-circle all-project-overview-sprint-circle--darkBlue"
                            : data.healthStatus === "excellent" ||
                              data.healthStatus === "average" ||
                              data.healthStatus === "good" ||
                              data.healthStatus === "on track"
                            ? "all-project-overview-sprint-circle all-project-overview-sprint-circle--lightBlue"
                            : data.healthStatus === "below average" ||
                              data.healthStatus === "needs intervention"
                            ? "all-project-overview-sprint-circle all-project-overview-sprint-circle--yellow"
                            : data.healthStatus === "none" ||
                              data.healthStatus === "very critical" ||
                              data.healthStatus === "Critical State"
                            ? "all-project-overview-sprint-circle all-project-overview-sprint-circle--orange"
                            : ""
                        }
                      >
                        <span>{data.daysLeft.toFixed()}</span>
                      </div>
                      <p className="overview-block-sprint-block__circle-bottom-text">
                        Days left
                      </p>
                    </div>
                    <div>
                      <h4 className="font-24-bold overview-block-sprint-block__title">
                        {data.name}
                      </h4>

                      <div className="row mx-0 flex-nowrap">
                        <p className="font-20-semiBold overview-block-sprint-block__text-light">
                          Start Date
                        </p>
                        <p className="font-18-semiBold">
                          {dateFns.format(data.startDate, "DD-MMM-YYYY")}
                        </p>
                      </div>

                      <div className="row mx-0 flex-nowrap">
                        <p className="font-20-semiBold overview-block-sprint-block__text-light">
                          End Date
                        </p>
                        <p className="font-18-semiBold">
                          {dateFns.format(data.endDate, "DD-MMM-YYYY")}
                        </p>
                      </div>

                      <div className="row mx-0 flex-nowrap">
                        <p className="font-20-semiBold overview-block-sprint-block__text-light">
                          Status
                        </p>
                        <p className="font-18-semiBold">{data.status}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )
          )}
      </div>
    );
  };

  renderSprintsBlock = (currentPagination) => {
    const { healthStatusOfSprints } = this.state;

    // console.log(healthStatusOfModules);
    let finalHealthData = [];

    let healthStatusOfProjects =
      !isEmpty(healthStatusOfSprints) && healthStatusOfSprints[1];

    let filterData =
      !isEmpty(healthStatusOfSprints) &&
      healthStatusOfSprints[0].forEach((sprint, index) => {
        // console.log(sprint, index);

        let healthData = sprint;
        healthData.healthStatus = healthStatusOfProjects[index];
        // console.log(healthData);
        finalHealthData.push(healthData);
      });

    // console.log(finalHealthData);

    return (
      <div className="row mx-0 flex-nowrap align-items-center overview-block-sprint-block-main">
        {!isEmpty(finalHealthData) &&
          finalHealthData.map(
            (data, index) =>
              index >= (currentPagination - 1) * totalRecordsInOnePage &&
              index < currentPagination * totalRecordsInOnePage && (
                <div key={index} className="overview-block-sprint-block">
                  <div className="row mx-0 flex-nowrap align-items-center">
                    <div className="all-project-overview-sprint-circle-text-block">
                      <div
                        className={
                          data.healthStatus === "above average" ||
                          data.healthStatus === "ahead schedule"
                            ? "all-project-overview-sprint-circle all-project-overview-sprint-circle--pink"
                            : data.healthStatus === "slightly ahead"
                            ? "all-project-overview-sprint-circle all-project-overview-sprint-circle--darkBlue"
                            : data.healthStatus === "excellent" ||
                              data.healthStatus === "average" ||
                              data.healthStatus === "good" ||
                              data.healthStatus === "on track"
                            ? "all-project-overview-sprint-circle all-project-overview-sprint-circle--lightBlue"
                            : data.healthStatus === "below average" ||
                              data.healthStatus === "needs intervention"
                            ? "all-project-overview-sprint-circle all-project-overview-sprint-circle--yellow"
                            : data.healthStatus === "none" ||
                              data.healthStatus === "very critical"
                            ? "all-project-overview-sprint-circle all-project-overview-sprint-circle--orange"
                            : ""
                        }
                      >
                        <span>{data.daysLeft.toFixed()}</span>
                      </div>
                      <p className="overview-block-sprint-block__circle-bottom-text">
                        Days left
                      </p>
                    </div>
                    <div>
                      <h4 className="font-24-semiBold overview-block-sprint-block__title">
                        {data.name}
                      </h4>

                      <div className="row mx-0 flex-nowrap">
                        <p className="font-20-semiBold overview-block-sprint-block__text-light">
                          Start Date
                        </p>
                        <p className="font-20-semiBold">
                          {dateFns.format(data.startDate, "DD-MMM-YYYY")}
                        </p>
                      </div>

                      <div className="row mx-0 flex-nowrap">
                        <p className="font-20-semiBold overview-block-sprint-block__text-light">
                          End Date
                        </p>
                        <p className="font-20-semiBold">
                          {dateFns.format(data.endDate, "DD-MMM-YYYY")}
                        </p>
                      </div>

                      <div className="row mx-0 flex-nowrap">
                        <p className="font-20-semiBold overview-block-sprint-block__text-light">
                          Status
                        </p>
                        <p className="font-20-semiBold">{data.status}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )
          )}
      </div>
    );
  };

  // renderSprintsBlock = (arrOfObj, currentPagination) => {
  //   return (
  //     <div className="row mx-0 flex-nowrap align-items-center overview-block-sprint-block-main">
  //       {arrOfObj.map(
  //         (data, index) =>
  //           index >= (currentPagination - 1) * totalRecordsInOnePage &&
  //           index < currentPagination * totalRecordsInOnePage && (
  //             <div key={index} className="overview-block-sprint-block">
  //               <div className="row mx-0 flex-nowrap align-items-center">
  //                 <div className="all-project-overview-sprint-circle-text-block">
  //                   <div
  //                     className={
  //                       data === "Ahead Schedule"
  //                         ? "all-project-overview-sprint-circle all-project-overview-sprint-circle--pink"
  //                         : data === "Slightly Ahead"
  //                         ? "all-project-overview-sprint-circle all-project-overview-sprint-circle--darkBlue"
  //                         : data === "On Track"
  //                         ? "all-project-overview-sprint-circle all-project-overview-sprint-circle--lightBlue"
  //                         : data === "Lagging"
  //                         ? "all-project-overview-sprint-circle all-project-overview-sprint-circle--yellow"
  //                         : data === "Critical State" &&
  //                           "all-project-overview-sprint-circle all-project-overview-sprint-circle--orange"
  //                     }
  //                   >
  //                     <span>20</span>
  //                   </div>
  //                   <p className="overview-block-sprint-block__circle-bottom-text">
  //                     Days left
  //                   </p>
  //                 </div>
  //                 <div>
  //                   <h4 className="font-24-semiBold overview-block-sprint-block__title">
  //                     Name
  //                   </h4>

  //                   <div className="row mx-0 flex-nowrap">
  //                     <p className="font-20-semiBold overview-block-sprint-block__text-light">
  //                       Start Date
  //                     </p>
  //                     <p className="font-20-semiBold">01-Jan-2019</p>
  //                   </div>

  //                   <div className="row mx-0 flex-nowrap">
  //                     <p className="font-20-semiBold overview-block-sprint-block__text-light">
  //                       End Date
  //                     </p>
  //                     <p className="font-20-semiBold">01-Mar-2019</p>
  //                   </div>

  //                   <div className="row mx-0 flex-nowrap">
  //                     <p className="font-20-semiBold overview-block-sprint-block__text-light">
  //                       Status
  //                     </p>
  //                     <p className="font-20-semiBold">{data}</p>
  //                   </div>
  //                 </div>
  //               </div>
  //             </div>
  //           )
  //       )}
  //     </div>
  //   );
  // };

  // renderRow4
  renderRow4 = () => {
    const { healthStatusOfSprints, healthStatusOfModules } = this.state;

    // console.log(healthStatusOfModules);
    let finalHealthModuleData = [];

    let healthModuleStatusOfProjects =
      !isEmpty(healthStatusOfModules) && healthStatusOfModules[1];

    let filterModuleData =
      !isEmpty(healthStatusOfModules) &&
      healthStatusOfModules[0].forEach((module, index) => {
        // console.log(module, index);

        let healthData = module;
        healthData.healthStatus = healthModuleStatusOfProjects[index];
        // console.log(healthData);
        finalHealthModuleData.push(healthData);
      });

    // console.log(finalHealthData);

    // console.log(healthStatusOfModules);
    let finalHealthData = [];

    let healthStatusOfProjects =
      !isEmpty(healthStatusOfSprints) && healthStatusOfSprints[1];

    let filterData =
      !isEmpty(healthStatusOfSprints) &&
      healthStatusOfSprints[0].forEach((sprint, index) => {
        // console.log(sprint, index);

        let healthData = sprint;
        healthData.healthStatus = healthStatusOfProjects[index];
        // console.log(healthData);
        finalHealthData.push(healthData);
      });

    // console.log(finalHealthData);

    return (
      <div className="row mx-0 flex-nowrap">
        {/* colm1 */}
        <div className="overview-block overview-block--sprints1">
          <h3 className="font-14-extraBold-letter-spacing-text2 mb-15">
            health status of modules
          </h3>
          {this.renderSprintsTitleRow()}
          {this.renderModulesBlock(this.state.currentPaginationModule)}
          {finalHealthModuleData.length > totalRecordsInOnePage && (
            <div className="custom-pagination custom-pagination--overview">
              <Pagination
                onChange={this.onChangePaginationModule}
                current={this.state.currentPaginationModule}
                defaultPageSize={totalRecordsInOnePage}
                total={finalHealthModuleData.length}
                showTitle={false}
              />
            </div>
          )}
        </div>

        {/* colm2 */}
        <div className="overview-block overview-block--sprints2">
          <h3 className="font-14-extraBold-letter-spacing-text2 mb-15">
            health status of sprints
          </h3>
          {this.renderSprintsTitleRow()}
          {this.renderSprintsBlock(this.state.currentPaginationSprint)}
          {finalHealthData.length > totalRecordsInOnePage && (
            <div className="custom-pagination custom-pagination--overview">
              <Pagination
                onChange={this.onChangePaginationSprint}
                current={this.state.currentPaginationSprint}
                defaultPageSize={totalRecordsInOnePage}
                total={finalHealthData.length}
                showTitle={false}
              />
            </div>
          )}
        </div>
      </div>
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
        {/*this.renderRow3()*/}
        {this.renderRow4()}
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
  getHealthStatusOfModule,
  getHealthStatusOfSprint,
  // getAllModuleDataOfSingleProject,
  // getAllSprintsOfModuleProject,
  updateProject,
  getTaskStatusGrouping,
  getUpcomingScrum,
})(AllProjectOverviewOld);
