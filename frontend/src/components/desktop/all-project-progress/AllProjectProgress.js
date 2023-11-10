import React, { Component } from "react";
import Select from "react-select";
import AllProjectProgressRow1Colm1Graph from "./AllProjectProgressRow1Colm1Graph";
import BurndownChart from "./BurndownChart";
import AllProjectProgressRow1Colm2Graph from "./AllProjectProgressRow1Colm2Graph";
import AllProjectProgressRow2Colm1Graph from "./AllProjectProgressRow2Colm1Graph";
import TaskStatusChart from "./TaskStatusChart";
import { connect } from "react-redux";
import {
  getTaskStatusBreakdown,
  getBurnDownChart,
  // getAllModuleDataOfSingleProject,
  getTaskProgressChart,
  // getAllSprintsOfModuleProject,
  getEstimatedCostVsActualCost,
  getPlannedVsActualHours,
} from "./../../../store/actions/projectAction";
import isEmpty from "../../../store/validations/is-empty";

const options = [
  { value: "Module Name", label: "Module Name" },
  { value: "Module Name 2", label: "Module Name 2" },
];

class AllProjectProgress extends Component {
  constructor() {
    super();
    this.state = {
      selectedOption: "",
      selectedOptionSprint: "",
      options: [],
      optionsSprints: [],
    };
  }

  componentDidMount() {
    // console.log("progress");
    let projectData = JSON.parse(localStorage.getItem("projectData"));
    if (!isEmpty(projectData)) {
      this.props.getTaskStatusBreakdown(projectData._id);
      // this.props.getAllModuleDataOfSingleProject(projectData._id);
      this.props.getEstimatedCostVsActualCost(projectData._id);
      this.props.getPlannedVsActualHours(projectData._id);
      this.props.getTaskProgressChart(projectData._id);
      const formData = {
        pageNo: 1,
        pageSize: 10,
        query: {
          project: projectData._id,
        },
      };
      // this.props.getAllSprintsOfModuleProject(formData);
    }
  }

  /*============================================================
      handlers
  ============================================================*/

  // handleChangeDropdown = (selectedOption) => {
  //   this.setState({ selectedOption });
  //   console.log(`Option selected:`, selectedOption);
  //   this.props.getTaskProgressChart(selectedOption.value);
  // };

  // handleChangeBurndownDropdown = (selectedOptionSprint) => {
  //   this.setState({ selectedOptionSprint });
  //   this.props.getBurnDownChart(selectedOptionSprint.value);
  // };

  /*============================================================
      renderRow1
  ============================================================*/
  renderRow1 = () => {
    return (
      <div className="row mx-0 flex-nowrap">
        <div className="overview-progress overview-progress--row1-colm1">
          <h3 className="font-16-extraBold-letter-spacing mb-20">
            Estimated Cost VS Actual Cost
          </h3>
          <AllProjectProgressRow1Colm1Graph />
        </div>
        <div className="overview-progress overview-progress--row1-colm2">
          <h3 className="font-16-extraBold-letter-spacing mb-20">
            Planned hours VS Actual Hours
          </h3>
          <AllProjectProgressRow1Colm2Graph />
        </div>
      </div>
    );
  };

  /*============================================================
      renderRow2
  ============================================================*/
  renderRow2 = () => {
    const { sprintProgressChartData } = this.state;
    return (
      <div className="row mx-0 flex-nowrap">
        <div className="overview-progress overview-progress--row2-colm1">
          <div className="row mx-0 align-items-center justify-content-between">
            <h3 className="font-16-extraBold-letter-spacing mb-20">
              {/*Sprint progress chart*/}Task Progress Chart
            </h3>
            {/*<Select
              isSearchable={false}
              className="react-select-container react-select-container--addMember react-select-container--allProjectGraphModule"
              classNamePrefix="react-select-elements"
              value={this.state.selectedOption}
              onChange={this.handleChangeDropdown}
              options={this.state.options}
              placeholder="Select"
            />*/}
          </div>
          <AllProjectProgressRow2Colm1Graph />
        </div>
        <div className="overview-progress overview-progress--row2-colm2">
          <h3 className="font-16-extraBold-letter-spacing mb-20">
            {/*task status breakdown*/}Priority wise task breakdown
          </h3>
          <TaskStatusChart />
        </div>
      </div>
    );
  };

  /*============================================================
      renderRow3
  ============================================================*/
  renderRow3 = () => {
    return (
      <div className="row mx-0 flex-nowrap">
        <div className="overview-progress overview-progress--row3-colm1">
          <div className="row mx-0 align-items-center justify-content-between">
            <h3 className="font-16-extraBold-letter-spacing">
              burndown chart
              {/*<span className="color-white"></span> chart sprint 7
              (ongoing)*/}
            </h3>
            {/*<Select
              isSearchable={false}
              className="react-select-container react-select-container--addMember react-select-container--allProjectGraphModule"
              classNamePrefix="react-select-elements"
              value={this.state.selectedOptionSprint}
              onChange={this.handleChangeBurndownDropdown}
              options={this.state.optionsSprints}
              placeholder="Select"
            />*/}
          </div>
          <BurndownChart />
        </div>
      </div>
    );
  };

  /*============================================================
      main
  ============================================================*/
  render() {
    return (
      <>
        {/* row1  */}
        {this.renderRow1()}
        {/* row2 */}
        {this.renderRow2()}
        {/* row3 */}
        {this.renderRow3()}
      </>
    );
  }
}

const mapStateToProps = (state) => ({
  allModules: state.projects.allModules,
  allSprints: state.projects.allSprints,
});

export default connect(mapStateToProps, {
  getTaskStatusBreakdown,
  getBurnDownChart,
  // getAllModuleDataOfSingleProject,
  getTaskProgressChart,
  // getAllSprintsOfModuleProject,
  getEstimatedCostVsActualCost,
  getPlannedVsActualHours,
})(AllProjectProgress);
