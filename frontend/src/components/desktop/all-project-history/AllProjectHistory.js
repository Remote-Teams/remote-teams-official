import React, { Component } from "react";
import ToggleTimesheet from "../common/ToggleTimesheet";
import SearchInput from "../common/SearchInput";
import { connect } from "react-redux";
import { getProjectTimeline } from "./../../../store/actions/dashboardAction";
import { getProjectActivity } from "./../../../store/actions/projectAction";
import isEmpty from "../../../store/validations/is-empty";
import dateFns from "date-fns";

const dummyData = [1, 2, 3, 4, 5, 6];

export class AllProjectHistory extends Component {
  constructor() {
    super();
    this.state = {
      isActivityTimeline: true,
      searchInput: "",
    };
  }

  componentDidMount() {
    let projectData = JSON.parse(localStorage.getItem("projectData"));
    if (!isEmpty(projectData)) {
      this.props.getProjectTimeline({
        query: {
          projectId: projectData._id,
          type: "TIMELINE",
        },
      });
      this.props.getProjectActivity({
        query: {
          projectId: projectData._id,
          type: "ACTIVITY",
        },
      });
    }
  }

  static getDerivedStateFromProps(nextProps, nextState) {
    if (
      !isEmpty(nextProps.projectTimeline) &&
      nextProps.projectTimeline !== nextState.projectTimeline
    ) {
      return {
        projectTimeline: nextProps.projectTimeline,
      };
    }
    if (
      !isEmpty(nextProps.allProjectActivity) &&
      nextProps.allProjectActivity !== nextState.allProjectActivity
    ) {
      return {
        allProjectActivity: nextProps.allProjectActivity,
      };
    }
    return null;
  }

  /*===========================================================================
      handlers
  ===========================================================================*/

  handleOnChangeToggle = (e) => {
    this.setState({
      [e.target.name]: e.target.checked,
    });
  };

  handleChangeSearchInput = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  };

  /*===========================================================================
      renderActivityTimeline
  ===========================================================================*/
  renderActivityTimeline = () => {
    console.log(this.state.allProjectActivity);
    const { allProjectActivity } = this.state;
    return (
      <div className="all-project-history-activity-timeline">
        <table className="all-project-activity-table">
          <tbody>
            {!isEmpty(allProjectActivity) &&
              allProjectActivity.map((activity, index) => (
                <tr key={index}>
                  <td>
                    <img
                      //src={require("../../../assets/img/icons/timeline-circle-icon.svg")}
                      // src={require("../../../assets/img/icons/new-timeline-circle-icon.png")}
                      src="/img/icons/new-project-timeline-circle-icon.png"
                      alt=""
                      className="activity-circle-img"
                    />
                  </td>
                  <td>
                    <h3 className="font-18-semiBold color-white-opacity-77">
                      {/* {activity.user.name}{" "} */}
                      {/* Lorem ipsum dolor sit amet, consectetur adipiscing elit,
                      sed do eiusmod tempor incididunt ut labore et d{" "} */}
                      {/* {activity.activityType === "CREATE" */}
                      {/* ? "created" */}
                      {/* : activity.activityType === "UPDATE" */}
                      {/* ? "updated" */}
                      {/* : ""}{" "} */}
                      {/* Updated  */}
                      {activity.text}
                      {/* Ipsum */}
                    </h3>
                  </td>
                  <td>
                    <p className="font-11-extraBold-space-light-uppercase color-E2E2E2">
                      {dateFns.format(activity.createdAt, "Do MMM")}
                      {/* {dateFns.format(new Date(), "Do MMM")} */}
                    </p>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>

        {/* for empty data */}
        {/* <table className="all-project-activity-table">
          <tbody>
            <tr>
              <td colSpan="0" className="text-center">
                <p className="font-14-semibold table-data-empty-message">
                  No data found
                </p>
              </td>
            </tr>
          </tbody>
        </table> */}
      </div>
    );
  };

  /*===========================================================================
      renderProjectTimeline
  ===========================================================================*/
  renderProjectTimelineTextBlock = (data) => {
    return (
      <div className="activity-project-text-block">
        <h3 className="font-24-semiBold color-white-opacity-77 pb-10">
          {data.text}
          {/* Lorem Ipsum Dolor Sit Amet, Consectetur Adipiscing Elit, Sed Do
          Eiusmod Tempor Incididunt Ut Labore Et D */}
        </h3>
        <p className="font-18-bold-space-light-uppercase color-E2E2E2">
          {dateFns.format(data.createdAt, "Do MMM")}
          {/* {dateFns.format(new Date(), "Do MMM")} */}
        </p>
      </div>
    );
  };

  renderProjectTimelineCirlceLineBlock = () => {
    return (
      <div className="activity-cirle-line-block">
        <img
          // src={require("../../../assets/img/icons/timeline-circle-icon.svg")}
          // src={require("../../../assets/img/icons/new-timeline-circle-icon.png")}
          src="/img/icons/new-project-timeline-circle-icon.png"
          alt=""
          className="activity-circle-img"
        />
        <img
          //src={require("../../../assets/img/icons/timeline-line-icon.svg")}
          src={require("../../../assets/img/icons/new-timeline-line-icon.png")}
          alt=""
          className="activity-line-img"
        />
      </div>
    );
  };

  renderProjectTimeline = () => {
    const { projectTimeline } = this.state;
    return (
      <div className="all-project-history-project-timeline">
        {!isEmpty(projectTimeline) &&
          projectTimeline.map((data, index) =>
            index % 2 === 0 ? (
              <div
                key={index}
                className="row mx-0 flex-nowrap history-project-timeline-row1"
              >
                {this.renderProjectTimelineTextBlock(data)}
                {this.renderProjectTimelineCirlceLineBlock()}
              </div>
            ) : (
              <div
                key={index}
                className="row mx-0 flex-nowrap history-project-timeline-row2"
              >
                {this.renderProjectTimelineCirlceLineBlock()}
                {this.renderProjectTimelineTextBlock(data)}
              </div>
            )
          )}

        {/* for empty data */}
        {/* <div className="text-center mb-50">
        <p className="font-14-semibold table-data-empty-message">No data found</p>
      </div> */}
      </div>
    );
  };

  /*===========================================================================
      main
  ===========================================================================*/
  render() {
    const { isActivityTimeline } = this.state;
    return (
      <>
        <div className="all-project-tab-panel all-project-tab-panel--timeline">
          <div className="row mx-0 justify-content-center">
            <ToggleTimesheet
              containerClassName="timesheet-toggle-all-project-history"
              textClassName="timesheet-toggle-text--all-project-history"
              name="isActivityTimeline"
              text1={"ACTIVITY TIMELINE"}
              text2={"PROJECT TIMELINE"}
              onChange={this.handleOnChangeToggle}
              defaultChecked={isActivityTimeline}
            />
            {/* <SearchInput
              name="searchInput"
              placeholder="Search"
              onChange={this.handleChangeSearchInput}
              value={this.state.SearchInput}
            /> */}
          </div>
          {isActivityTimeline
            ? this.renderActivityTimeline()
            : this.renderProjectTimeline()}
        </div>
      </>
    );
  }
}

const mapStateToProps = (state) => ({
  projectTimeline: state.dashboard.projectTimeline,
  allProjectActivity: state.projects.allProjectActivity,
});

export default connect(mapStateToProps, {
  getProjectTimeline,
  getProjectActivity,
})(AllProjectHistory);
