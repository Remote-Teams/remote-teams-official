import React, { Component, Fragment } from "react";
import PageTitle from "../common/PageTitle";
import CountCardCommon from "../common/CountCardCommon";
import Select from "react-select";
import AllProjectsCards from "./AllProjectsCards";
import GreenButtonSmallFont from "../common/GreenButtonSmallFont";
import LoginFlowDashboardAddProject from "../auth/LoginFlowDashboardAddProject";
import GrayButtonSmallFont from "../common/GrayButtonSmallFont";
import SearchInput from "../common/SearchInput";
import LeftNavbar from "../header/LeftNavbar";
import TopNavbar from "../header/TopNavbar";
import {
  getAllProjectAction,
  getProjectOverview,
  getAllProjectCount,
  getAllPinProjects,
  projectSearchApi,
  getProjectCardCount,
} from "./../../../store/actions/projectAction";
// import { getAllClients } from "./../../../store/actions/clientAction";
// import {
//   getAllResourceAction,
//   resourceSearchApi,
// } from "./../../../store/actions/resourcesAction";
import { connect } from "react-redux";
import isEmpty from "../../../store/validations/is-empty";
import store from "../../../store/store";
import { SET_API_STATUS } from "./../../../store/types";
import WalkthroughAllProject2 from "../walkthrough/WalkthroughAllProject2";
import WalkthroughAllProject3 from "../walkthrough/WalkthroughAllProject3";
import GreenLinkSmallFont from "../common/GreenLinkSmallFont";
import AllProjectsNewCards from "./AllProjectsNewCards";
import axios from "axios";
import { SET_ALL_PROJECTS } from "./../../../store/types";
import Loader from "react-loader-spinner";
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";

const options = [
  { value: "allProjects", label: "All Projects" },
  { value: "myProject", label: "My Projects" },
  { value: "activeProjects", label: "Active Projects" },
  { value: "onHoldProjects", label: "On Hold Projects" },
];
export class AllProjects extends Component {
  constructor() {
    super();
    this.state = {
      isAddNew: false,
      selectedOption: options[0],
      searchInput: "",
      allProjects: [],
    };
  }

  static getDerivedStateFromProps(nextProps, nextState) {
    if (
      !isEmpty(nextProps.allProjects) &&
      nextProps.allProjects !== nextState.allProjects
    ) {
      return {
        allProjects: nextProps.allProjects,
      };
    }
    if (!isEmpty(nextProps.apiStatus) && nextProps.apiStatus === 200) {
      return {
        isAddNew: false,
      };
    }
    if (
      !isEmpty(nextProps.allProjectCount) &&
      nextProps.allProjectCount !== nextState.allProjectCount
    ) {
      return {
        allProjectCount: nextProps.allProjectCount,
      };
    }
    if (
      !isEmpty(nextProps.projectOverview) &&
      nextProps.projectOverview !== nextState.projectOverview
    ) {
      return {
        projectOverview: nextProps.projectOverview,
      };
    }
    return null;
  }

  /*============================================================
      lifecycle method
  ============================================================*/
  componentDidMount() {
    const formData = {
      // "pageNo":1,
      // "pageSize":10,
      query: {
        // INPROGRESS
      },
    };
    this.props.getAllProjectAction();
    // setTimeout(() => {
    //   this.props.projectSearchApi(formData);
    // }, 10);

    // this.props.getAllResourceAction();
    // this.props.resourceSearchApi(formData);

    // this.props.getAllProjectAction();
    // this.props.getAllClients();

    this.props.getProjectOverview();
    this.props.getAllProjectCount();
    this.props.getAllPinProjects();
    this.props.getProjectCardCount();
    localStorage.removeItem("activeProjectDetailTabIndex");
    localStorage.removeItem("projectData");
  }

  componentDidUpdate() {
    if (this.props.allProjectCount !== this.state.allProjectCount) {
      this.setState({
        allProjectCount: this.props.allProjectCount,
      });
    }
    if (this.props.allProjects !== this.state.allProjects) {
      this.setState({
        allProjects: this.props.allProjects,
      });
    }
  }

  /*============================================================
      handlers
  ============================================================*/

  handleChangeDropdown = (selectedOption) => {
    this.setState({ selectedOption });
    console.log(`Option selected:`, selectedOption);

    if (selectedOption.label === "All Projects") {
      const formData = {
        // "pageNo":1,
        // "pageSize":10,
        query: {
          // INPROGRESS
        },
      };
      this.props.projectSearchApi(formData);
    } else if (selectedOption.label === "My Projects") {
      var userData = JSON.parse(localStorage.getItem("UserData"));
      const formData = {
        query: {
          resources: { $in: [userData.id] },
        },
      };
      this.props.projectSearchApi(formData);
    } else if (selectedOption.label === "Active Projects") {
      const formData = {
        // "pageNo":1,
        // "pageSize":10,
        query: {
          status: "INPROGRESS",
        },
      };
      this.props.projectSearchApi(formData);
    }
  };

  handleChangeSearchInput = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  };

  handleOnClickAddNew = () => {
    store.dispatch({
      type: SET_API_STATUS,
      payload: {},
    });
    this.setState({
      isAddNew: true,
    });
  };

  handleOnClickBack = () => {
    this.setState({
      isAddNew: false,
    });
  };

  onCardClickHnadler = (status) => (e) => {
    if (status === "TOTAL") {
      const formData = {
        // "pageNo":1,
        // "pageSize":10,
        query: {
          // INPROGRESS
        },
      };
      this.props.projectSearchApi(formData);
    } else if (status === "INPROGRESS") {
      const formData = {
        // "pageNo":1,
        // "pageSize":10,
        query: {
          status: status,
          // INPROGRESS
        },
      };
      this.props.projectSearchApi(formData);
    } else {
      const formData = {
        // "pageNo":1,
        // "pageSize":10,
        query: {
          status: status,
          // INPROGRESS
        },
      };
      this.props.projectSearchApi(formData);
    }
  };

  /*============================================================
      main
  ============================================================*/
  render() {
    const {
      selectedOption,
      isAddNew,
      allProjectCount,
      projectOverview,
    } = this.state;
    // console.log(this.state.allProjects);
    const { allProjects } = this.state;
    // console.log(this.state.projectOverview);

    let upcomingProject =
      !isEmpty(projectOverview) &&
      projectOverview.filter((project) => project._id === "UPCOMING");

    let inProgress =
      !isEmpty(projectOverview) &&
      projectOverview.filter((project) => project._id === "INPROGRESS");

    let onHold =
      !isEmpty(projectOverview) &&
      projectOverview.filter((project) => project._id === "ONHOLD");

    // Search

    let filtereddata = [];
    if (!isEmpty(this.state.searchInput)) {
      let search = new RegExp(this.state.searchInput, "i");
      filtereddata = allProjects.filter((getall) => {
        if (search.test(getall.name)) {
          console.log(getall);
          return getall;
        }
        // if (search.test(getall.company)) {
        //   return getall;
        // }
        // if (search.test(getall.email)) {
        //   return getall;
        // }
      });
      // console.log(filtereddata);
    } else {
      filtereddata = this.state.allProjects;
    }

    const { loader } = this.props;

    return (
      <>
        {loader === true && (
          <Loader type="Triangle" color="#57cba1" className="remote-loader" />
        )}

        {isAddNew ? (
          <>
            <div className="login-flow-dashboard-buttons-block">
              <GrayButtonSmallFont
                text="Back"
                onClick={this.handleOnClickBack}
              />
            </div>
            <LoginFlowDashboardAddProject />
          </>
        ) : (
          <>
            {this.props.activeWalkthroughPage === "all-project-2" && (
              <WalkthroughAllProject2 />
            )}

            {this.props.activeWalkthroughPage === "all-project-3" && (
              <WalkthroughAllProject3 />
            )}

            {/* left navbar */}
            <LeftNavbar activeMenu="all projects" />
            <div className="main-page-padding">
              {/* pagetitle and topnavbar */}
              <div className="pageTitle-topNavbar-div">
                <PageTitle
                  title="All projects"
                  isLinkDisplay={true}
                  linkPath="/add-new-project"
                  linkText="+ New Project"
                />
                <TopNavbar />
              </div>
              {/* pagetitle and topnavbar end */}
              <div
                className={
                  this.props.activeWalkthroughPage === "all-project-2"
                    ? "new-walkthrough-active-buttton-add-new"
                    : ""
                }
              >
                {/*<GreenButtonSmallFont
                  //text="+ New Project"
                  text="Create Project"
                  onClick={this.handleOnClickAddNew}
                  extraClassName="add-project-btn"
                />*/}
                {/* <GreenLinkSmallFont
                  path={"/add-new-project"}
                  text="Create Project"
                  extraClassName={"add-project-btn"}
                /> */}
              </div>
              <div className="row mx-0 page-count-row">
                <CountCardCommon
                  title="TOTAL PROJECTS"
                  count={!isEmpty(allProjectCount) ? allProjectCount.count : 0}
                  onClick={this.onCardClickHnadler("TOTAL")}
                />
                <CountCardCommon
                  title="ongoing projects"
                  count={!isEmpty(inProgress[0]) ? inProgress[0].count : 0}
                  onClick={this.onCardClickHnadler("INPROGRESS")}
                />
                <CountCardCommon
                  title="on hold projects"
                  count={!isEmpty(onHold[0]) ? onHold[0].count : 0}
                  onClick={this.onCardClickHnadler("ONHOLD")}
                />
              </div>
              <div className="row mx-0 justify-content-between clients-btn-search-div">
                <Select
                  className="react-select-container"
                  classNamePrefix="react-select-elements"
                  value={selectedOption}
                  onChange={this.handleChangeDropdown}
                  options={options}
                  placeholder="Select"
                />
                <SearchInput
                  name="searchInput"
                  placeholder="Search"
                  onChange={this.handleChangeSearchInput}
                  value={this.state.searchInput}
                />
              </div>

              <div className="row mx-0 clients-cards-overflow-div clients-cards-overflow-div--all-project">
                {!isEmpty(filtereddata) ? (
                  <>
                    {!isEmpty(filtereddata) &&
                      filtereddata.map((project, index) => {
                        return (
                          <Fragment key={index}>
                            {/* <AllProjectsCards
                              project={project}
                              extraClassName={
                                this.props.activeWalkthroughPage ===
                                "all-project-3"
                                  ? "new-walkthrough-active-all-project-card"
                                  : ""
                              }
                            /> */}
                            <AllProjectsNewCards project={project} />
                          </Fragment>
                        );
                      })}
                  </>
                ) : (
                  <div className="all-projects-not-found-div">
                    <img
                      src={require("../../../assets/img/illustrations/all-projects.svg")}
                      alt="all project not found"
                      className="all-project-not-found-img"
                    />
                    <h5 className="all-project-not-found-text">
                      No projects found
                    </h5>
                    {/*<GreenButtonSmallFont
                      //text="+ New Project"
                      text="Create Project"
                      onClick={this.handleOnClickAddNew}
                      extraClassName="add-project-btn"
                    />*/}
                    <GreenLinkSmallFont
                      path={"/add-new-project"}
                      text="Create Project"
                      extraClassName={"add-project-btn"}
                    />
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </>
    );
  }
}

const mapStateToProps = (state) => ({
  allProjects: state.projects.allProjects,
  apiStatus: state.client.apiStatus,
  allProjectCount: state.projects.allProjectCount,
  projectOverview: state.projects.projectOverview,
  activeWalkthroughPage: state.auth.activeWalkthroughPage,
  loader: state.auth.loader,
});

export default connect(mapStateToProps, {
  getAllProjectAction,
  // getAllClients,
  // getAllResourceAction,
  getProjectOverview,
  getAllProjectCount,
  getAllPinProjects,
  projectSearchApi,
  getProjectCardCount,
  // resourceSearchApi,
})(AllProjects);
