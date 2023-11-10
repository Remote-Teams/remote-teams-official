import React, { Component, Fragment } from "react";
import ResourcesCard from "./ResourcesCard";
import CountCardCommon from "../common/CountCardCommon";
import PageTitle from "../common/PageTitle";
import GreenButtonSmallFont from "../common/GreenButtonSmallFont";
import GrayButtonSmallFont from "../common/GrayButtonSmallFont";
import GreenLinkSmallFont from "../common/GreenLinkSmallFont";
import SearchInput from "../common/SearchInput";
import LoginFlowDashboardAddTeamMembers from "../auth/LoginFlowDashboardAddTeamMembers";
import LeftNavbar from "../header/LeftNavbar";
import TopNavbar from "../header/TopNavbar";
import { getCompanyWorkingHours } from "./../../../store/actions/authAction";
import {
  getAllResourceAction,
  getResourceOverview,
  getResourceCount,
  resourceSearchApi,
} from "./../../../store/actions/resourcesAction";
import { connect } from "react-redux";
import isEmpty from "../../../store/validations/is-empty";
import store from "../../../store/store";
import { SET_API_STATUS } from "./../../../store/types";
import { workspaceId } from "./../../../store/actions/config";
import WalkthroughResources1 from "../walkthrough/WalkthroughResources1";
import WalkthroughResources2 from "../walkthrough/WalkthroughResources2";

class Resources extends Component {
  constructor() {
    super();
    this.state = {
      isAddNew: false,
      searchInput: "",
      companyWorkingHours: {},
      allResources: {},
      allResourceCount: "",
    };
  }

  /*==============================================
                  Lifecycle Method
  ================================================*/
  componentDidMount() {
    this.props.getCompanyWorkingHours();
    this.props.getAllResourceAction();
    this.props.getResourceOverview();
    this.props.getResourceCount();
  }

  static getDerivedStateFromProps(nextProps, nextState) {
    if (
      !isEmpty(nextProps.companyWorkingHours) &&
      nextProps.companyWorkingHours !== nextState.companyWorkingHours
    ) {
      return {
        companyWorkingHours: nextProps.companyWorkingHours,
      };
    }
    if (!isEmpty(nextProps.apiStatus) && nextProps.apiStatus === 200) {
      return {
        isAddNew: false,
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
      !isEmpty(nextProps.allResourceCount) &&
      nextProps.allResourceCount !== nextState.allResourceCount
    ) {
      return {
        allResourceCount: nextProps.allResourceCount,
      };
    }
    if (
      !isEmpty(nextProps.resourceOverview) &&
      nextProps.resourceOverview !== nextState.resourceOverview
    ) {
      return {
        resourceOverview: nextProps.resourceOverview,
      };
    }
    return null;
  }

  componentDidUpdate() {
    if (this.props.allResources !== this.state.allResources) {
      this.setState({
        allResources: this.props.allResources,
      });
    }
    if (this.props.resourceOverview !== this.state.resourceOverview) {
      this.setState({
        resourceOverview: this.props.resourceOverview,
      });
    }
    // if (this.props.allResourceCount !== this.state.allResourceCount) {
    //   this.setState({
    //     allResourceCount: this.props.allResourceCount,
    //   });
    // }
  }

  /*============================================================
      handlers
  ============================================================*/

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

  onClickOnSchedule = () => {
    if (process.env.NODE_ENV === "development") {
      window.location.href = "http://localhost:3000/scheduler-two";
      // this.props.history.push("/scheduler-two");
    } else {
      window.location.href = `https://${workspaceId}.remote-teams.io/scheduler-two`;
      // this.props.history.push("/scheduler-two");
    }
  };

  onCardClickHnadler = (status) => (e) => {
    console.log(status);
    if (status === "TOTAL") {
      const formData = {
        // "pageNo":1,
        // "pageSize":10,
        query: {
          // INPROGRESS
        },
      };
      this.props.resourceSearchApi(formData);
    } else if (status === "ACTIVE") {
      const formData = {
        // "pageNo":1,
        // "pageSize":10,
        query: {
          status: status,
          // INPROGRESS
        },
      };
      this.props.resourceSearchApi(formData);
    } else if (status === "INACTIVE") {
      const formData = {
        // "pageNo":1,
        // "pageSize":10,
        query: {
          status: status,
          // INPROGRESS
        },
      };
      this.props.resourceSearchApi(formData);
    }
  };

  /*============================================================
      main
  ============================================================*/
  render() {
    // console.log(this.state.allResourceCount);

    const {
      isAddNew,
      companyWorkingHours,
      allResources,
      allResourceCount,
      resourceOverview,
    } = this.state;
    // console.log(this.state.resourceOverview);
    let activeResource =
      !isEmpty(resourceOverview) &&
      resourceOverview.filter((resource) => resource._id === "ACTIVE");

    let inactiveResource =
      !isEmpty(resourceOverview) &&
      resourceOverview.filter((resource) => resource._id === "INACTIVE");

    let filtereddata = [];
    if (!isEmpty(this.state.searchInput)) {
      let search = new RegExp(this.state.searchInput, "i");
      filtereddata = allResources.filter((getall) => {
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
      filtereddata = this.state.allResources;
    }

    return (
      <>
        {isAddNew ? (
          <>
            <div className="login-flow-dashboard-buttons-block">
              <GrayButtonSmallFont
                text="Back"
                onClick={this.handleOnClickBack}
              />
            </div>
            <LoginFlowDashboardAddTeamMembers
              companyWorkingHours={companyWorkingHours}
            />
          </>
        ) : (
          <>
            {this.props.activeWalkthroughPage === "resources-1" && (
              <WalkthroughResources1 />
            )}

            {this.props.activeWalkthroughPage === "resources-2" && (
              <WalkthroughResources2 />
            )}

            {/* left navbar */}
            <LeftNavbar activeMenu="members" />
            <div className="main-page-padding">
              {/* pagetitle and topnavbar */}
              <div className="pageTitle-topNavbar-div">
                {/*<PageTitle title="Resources" />*/}
                <PageTitle title="Members" />
                <TopNavbar />
              </div>
              {/* pagetitle and topnavbar end */}
              <div
                className={
                  this.props.activeWalkthroughPage === "resources-1"
                    ? "new-walkthrough-active-buttton-add-new"
                    : ""
                }
              >
                {/*<GreenButtonSmallFont
                  text="Add Member"
                  //text="+ New Resource"
                  onClick={this.handleOnClickAddNew}
                  extraClassName="add-member-btn"
                />*/}
                <GreenLinkSmallFont
                  path={"/add-member-new"}
                  text="Add Member"
                  extraClassName={"add-member-btn"}
                />
              </div>
              <div className="row mx-0 page-count-row">
                <CountCardCommon
                  //title="TOTAL EMployees"
                  title="Total members"
                  count={!isEmpty(allResourceCount) ? allResourceCount : 0}
                  onClick={this.onCardClickHnadler("TOTAL")}
                />
                <CountCardCommon
                  //title="Active EMployees"
                  title="Active members"
                  count={
                    !isEmpty(activeResource[0]) ? activeResource[0].count : 0
                  }
                  onClick={this.onCardClickHnadler("ACTIVE")}
                />
                <CountCardCommon
                  //title="InActive EMployees"
                  title="Inactive members"
                  count={
                    !isEmpty(inactiveResource[0])
                      ? inactiveResource[0].count
                      : 0
                  }
                  onClick={this.onCardClickHnadler("INACTIVE")}
                />
              </div>
              <div className="row mx-0 justify-content-between clients-btn-search-div">
                <div
                  className={
                    this.props.activeWalkthroughPage === "resources-2"
                      ? "new-walkthrough-active-buttton-add-new"
                      : ""
                  }
                >
                  <GreenButtonSmallFont
                    onClick={this.onClickOnSchedule}
                    // path="/scheduler-two"
                    //text="Schedule"
                    text="Plan Schedule"
                    extraClassName="plan-schedule-btn"
                  />
                </div>
                {/* <GreenLinkSmallFont path="/scheduler-two" text="Schedule" /> */}
                <SearchInput
                  name="searchInput"
                  placeholder="Search"
                  onChange={this.handleChangeSearchInput}
                  value={this.state.searchInput}
                />
              </div>
              {!isEmpty(filtereddata) ? (
                <div className="row mx-0 clients-cards-overflow-div">
                  {!isEmpty(filtereddata) &&
                    filtereddata.map((resource, index) => {
                      return (
                        <Fragment key={index}>
                          <ResourcesCard
                            cardData={resource}
                            extraClassName={
                              this.props.activeWalkthroughPage === "resources-1"
                                ? "new-walkthrough-active-all-project-card"
                                : ""
                            }
                          />
                        </Fragment>
                      );
                    })}
                </div>
              ) : (
                <div className="text-center">
                  <img
                    src={require("../../../assets/img/illustrations/member.svg")}
                    alt="member not found"
                    className="member-not-found-img"
                  />
                  <h5 className="all-project-not-found-text">
                    No members found
                  </h5>
                  {/*<GreenButtonSmallFont
                    text="Add Member"
                    onClick={this.handleOnClickAddNew}
                    extraClassName="add-member-btn"
                  />*/}
                  <GreenLinkSmallFont
                    path={"/add-member-new"}
                    text="Add Member"
                    extraClassName={"add-member-btn"}
                  />
                </div>
              )}
            </div>
          </>
        )}
      </>
    );
  }
}

const mapStateToprops = (state) => ({
  companyWorkingHours: state.auth.companyWorkingHours,
  apiStatus: state.client.apiStatus,
  allResources: state.resources.allResources,
  allResourceCount: state.resources.allResourceCount,
  resourceOverview: state.resources.resourceOverview,
  activeWalkthroughPage: state.auth.activeWalkthroughPage,
});

export default connect(mapStateToprops, {
  getCompanyWorkingHours,
  getAllResourceAction,
  getResourceOverview,
  getResourceCount,
  resourceSearchApi,
})(Resources);
