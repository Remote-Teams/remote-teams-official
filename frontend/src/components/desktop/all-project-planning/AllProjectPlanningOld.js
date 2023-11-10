import React, { Component } from "react";
import GrayButtonSmallFont from "../common/GrayButtonSmallFont";
import GreenButtonSmallFont from "../common/GreenButtonSmallFont";
//import SearchInput from "../common/SearchInput";
import KanBanMain from "./KanBanMain";
import isEmpty from "../../../store/validations/is-empty";
import GanttViewMain from "./GanttViewMain";
import { connect } from "react-redux";
import // getGanttChartData,
// getAllModuleDataOfSingleProject,
"./../../../store/actions/projectAction";

class AllProjectPlanningOld extends Component {
  constructor() {
    super();
    this.state = {
      //searchInput: "",
      isKanbanView: false,
    };
  }

  componentDidMount() {
    let projectData = JSON.parse(localStorage.getItem("projectData"));
    if (!isEmpty(projectData)) {
      // this.props.getGanttChartData(projectData._id);
      // this.props.getAllModuleDataOfSingleProject(projectData._id);
    }
  }

  //  handleChangeSearchInput = (e) => {
  //    this.setState({
  //      [e.target.name]: e.target.value,
  //    });
  //  };

  handleOnClickKanbanView = () => {
    this.setState({
      isKanbanView: true,
    });
  };

  handleOnClickGanttView = () => {
    this.setState({
      isKanbanView: false,
    });
  };

  render() {
    const { singleProjectData } = this.props;
    const { isKanbanView } = this.state;
    return (
      <>
        <div className="mb-30">
          <div className="planning-btn-div">
            {isKanbanView ? (
              <>
                <div className="display-inline-block mr-30">
                  <GreenButtonSmallFont
                    onClick={this.handleOnClickKanbanView}
                    text={"Kanban View"}
                    extraClassName="kanban-view-btn"
                  />
                </div>
                <GrayButtonSmallFont
                  onClick={this.handleOnClickGanttView}
                  text={"Gantt View"}
                  extraClassName="gantt-view-btn"
                />
              </>
            ) : (
              <>
                <GrayButtonSmallFont
                  onClick={this.handleOnClickKanbanView}
                  text={"Kanban View"}
                  extraClassName="gantt-view-btn"
                />
                <GreenButtonSmallFont
                  onClick={this.handleOnClickGanttView}
                  text={"Gantt View"}
                  extraClassName="kanban-view-btn"
                />
              </>
            )}
          </div>
          {/*<div className="palnning-search-div row justify-content-end">
            <SearchInput
              name="searchInput"
              placeholder="Search"
              onChange={this.handleChangeSearchInput}
              value={this.state.SearchInput}
            />
            </div>*/}
        </div>
        <div>
          {isKanbanView ? (
            <KanBanMain
              singleProjectData={
                !isEmpty(singleProjectData) && singleProjectData
              }
            />
          ) : (
            <GanttViewMain />
          )}
        </div>
      </>
    );
  }
}

export default connect(null, {
  // getGanttChartData,
  // getAllModuleDataOfSingleProject,
})(AllProjectPlanningOld);
