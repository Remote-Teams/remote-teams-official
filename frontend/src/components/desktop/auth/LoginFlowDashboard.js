import React, { Component } from "react";
import { connect } from "react-redux";
import {
  getCompanyDaysOff,
  getCompanyWorkingHours,
  getAllMemberDaysOfF,
} from "./../../../store/actions/authAction";
import { getAllResourceAction } from "./../../../store/actions/resourcesAction";
import { getAllProjectAction } from "./../../../store/actions/projectAction";
import LoginFlowDashboardAddCompanyDayOffs from "./LoginFlowDashboardAddCompanyDayOffs";
import LoginFlowDashboardAddMembersDayOffs from "./LoginFlowDashboardAddMembersDayOffs";
import LoginFlowDashboardSetWorkingHours from "./LoginFlowDashboardSetWorkingHours";
import LoginFlowDashboardSetAccessRoles from "./LoginFlowDashboardSetAccessRoles";
import LoginFlowDashboardAddTeamMembers from "./LoginFlowDashboardAddTeamMembers";
import LoginFlowDashboardAddProject from "./LoginFlowDashboardAddProject";
import LoginFlowDashboardDoItLaterModal from "./LoginFlowDashboardDoItLaterModal";
import LoginFlowDashboardDoneModal from "./LoginFlowDashboardDoneModal";
import GreenButtonSmallFont from "../common/GreenButtonSmallFont";
import GrayButtonSmallFont from "../common/GrayButtonSmallFont";
import isEmpty from "../../../store/validations/is-empty";

// 1 to 6
const totalForms = 6;
const circleTextImgs = [
  {
    imgNum: 1,
    imgName: "Add company day offs",
  },
  {
    imgNum: 2,
    imgName: "Set member day offs",
  },
  {
    imgNum: 3,
    imgName: "Set working hours",
  },
  {
    imgNum: 4,
    imgName: "Set access roles",
  },
  {
    imgNum: 5,
    imgName: "Add team members",
  },
  {
    imgNum: 6,
    imgName: "Add project",
  },
];

class LoginFlowDashboard extends Component {
  constructor() {
    super();
    this.state = {
      dashboardFlowCount: 0,
      companyDaysOff: {},
      companyWorkingHours: {},
      memberDaysOff: {},
      allResources: {},
      allProjects: {},
    };
  }

  /*=================================================================
      lifecycle methods
  ==================================================================*/

  componentDidMount() {
    this.props.getAllProjectAction();
    this.props.getAllResourceAction();
    this.props.getAllMemberDaysOfF();
    this.props.getCompanyDaysOff();
    this.props.getCompanyWorkingHours();
    localStorage.setItem("isAllPagesVisit", "false");
  }

  static getDerivedStateFromProps(nextProps, nextState) {
    if (
      !isEmpty(nextProps.companyDaysOff) &&
      nextProps.companyDaysOff !== nextState.companyDaysOff
    ) {
      return {
        companyDaysOff: nextProps.companyDaysOff,
      };
    }
    if (
      !isEmpty(nextProps.companyWorkingHours) &&
      nextProps.companyWorkingHours !== nextState.companyWorkingHours
    ) {
      return {
        companyWorkingHours: nextProps.companyWorkingHours,
      };
    }
    if (!isEmpty(nextProps.memberDaysOff) && nextState.memberDaysOff) {
      return {
        memberDaysOff: nextProps.memberDaysOff,
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
      !isEmpty(nextProps.allProjects) &&
      nextProps.allProjects !== nextState.allProjects
    ) {
      return {
        allProjects: nextProps.allProjects,
      };
    }
    return null;
  }

  componentWillUnmount() {
    localStorage.removeItem("visitPage4");
    localStorage.removeItem("isAllPagesVisit");
  }

  /*=================================================================
      handlers
  ==================================================================*/

  setVisitAllPage = () => {
    if (localStorage.getItem("visitPage4") === "true") {
      localStorage.setItem("isAllPagesVisit", "true");
    }
  };

  handleOnClickCircleText = (count) => (e) => {
    this.setState({
      dashboardFlowCount: count,
    });

    if (count === 4) {
      localStorage.setItem("visitPage4", "true");
    }

    // console.log(count);
    this.setVisitAllPage();
  };

  handleOnClickNext = () => {
    this.setState({
      dashboardFlowCount: this.state.dashboardFlowCount + 1,
    });

    if (this.state.dashboardFlowCount + 1 === 4) {
      localStorage.setItem("visitPage4", "true");
    }

    this.setVisitAllPage();
  };

  /*=================================================================
      renderDashboard
  ==================================================================*/
  renderDashboard = () => {
    const {
      companyDaysOff,
      companyWorkingHours,
      memberDaysOff,
      allResources,
      allProjects,
    } = this.props;
    return (
      <div className="login-flow-dashboard">
        <div className="w-100 text-center">
          <img
            src={require("../../../assets/img/auth/new-small-logo.png")}
            alt="remote team logo"
            className="auth-logo-img"
          />
          {/*font-29-bold*/}
          <h1 className="font-24-semiBold">
            Okay! Now lets continue by setting up your
            <br /> workspace
          </h1>

          <div className="login-flow-dashboard__img-div">
            {/* line */}
            {/*<img
              src={require("../../../assets/img/auth/dot-line.svg")}
              className="login-flow-dashboard__dot-line"
              alt=""
            />*/}
            <img
              src={require("../../../assets/img/auth/new-dot-line.svg")}
              className="login-flow-dashboard__dot-line"
              alt=""
            />
            {/* line end */}

            {/* options 
            {circleTextImgs.map((data, index) => (
              <img
                key={index}
                src={require(`../../../assets/img/auth/dot-${data.imgNum}.png`)}
                alt={data.imgName}
                className={`login-flow-dashboard__dot-${data.imgNum}`}
                onClick={this.handleOnClickCircleText(data.imgNum)}
              />
            ))}*/}
            {circleTextImgs.map((data, index) => (
              <img
                key={index}
                src={require(`../../../assets/img/auth/new-dot-${data.imgNum}.png`)}
                alt={data.imgName}
                className={`login-flow-dashboard__dot-${data.imgNum}`}
                onClick={this.handleOnClickCircleText(data.imgNum)}
              />
            ))}
            {/* options end */}

            {/* check circle1 */}
            {!isEmpty(companyDaysOff) && (
              <img
                //src={require("../../../assets/img/auth/dot-check.svg")}
                src={require("../../../assets/img/auth/new-dot-check.svg")}
                className="login-flow-dashboard__dot-check1"
                alt=""
              />
            )}

            {/* check circle2 */}
            {!isEmpty(memberDaysOff) && (
              <img
                //src={require("../../../assets/img/auth/dot-check.svg")}
                src={require("../../../assets/img/auth/new-dot-check.svg")}
                className="login-flow-dashboard__dot-check2"
                alt=""
              />
            )}

            {/* check circle3 */}
            {!isEmpty(companyWorkingHours) && (
              <img
                //src={require("../../../assets/img/auth/dot-check.svg")}
                src={require("../../../assets/img/auth/new-dot-check.svg")}
                className="login-flow-dashboard__dot-check3"
                alt=""
              />
            )}

            {/* check circle4 */}
            {localStorage.getItem("visitPage4") === "true" && (
              <img
                //src={require("../../../assets/img/auth/dot-check.svg")}
                src={require("../../../assets/img/auth/new-dot-check.svg")}
                className="login-flow-dashboard__dot-check4"
                alt=""
              />
            )}

            {/* check circle5 */}
            {!isEmpty(allResources) && allResources.length > 1 && (
              <img
                //src={require("../../../assets/img/auth/dot-check.svg")}
                src={require("../../../assets/img/auth/new-dot-check.svg")}
                className="login-flow-dashboard__dot-check5"
                alt=""
              />
            )}

            {/* check circle6 */}
            {/*{!isEmpty(allProjects) && (*/}
            <img
              //src={require("../../../assets/img/auth/dot-check.svg")}
              src={require("../../../assets/img/auth/new-dot-check.svg")}
              className="login-flow-dashboard__dot-check6"
              alt=""
            />
            {/*)}*/}
          </div>

          {/* modal */}
          {!isEmpty(companyDaysOff) &&
          !isEmpty(memberDaysOff) &&
          !isEmpty(companyWorkingHours) &&
          localStorage.getItem("visitPage4") === "true" &&
          !isEmpty(allResources) &&
          !isEmpty(allProjects) ? (
            <LoginFlowDashboardDoneModal />
          ) : (
            <LoginFlowDashboardDoItLaterModal />
          )}
        </div>
      </div>
    );
  };

  /*=================================================================
      renderDashboardNextButtons
  ==================================================================*/
  renderDashboardNextButtons = () => {
    const { dashboardFlowCount } = this.state;

    return (
      <>
        {dashboardFlowCount > 0 && dashboardFlowCount < totalForms && (
          <div className="login-flow-dashboard-buttons-block">
            <GrayButtonSmallFont
              text="Dashboard"
              onClick={this.handleOnClickCircleText(0)}
              extraClassName="login-flow-dashboard-buttons-block-btn"
            />
            <GreenButtonSmallFont
              text="Next"
              onClick={this.handleOnClickNext}
            />
          </div>
        )}
        {dashboardFlowCount === totalForms && (
          <div className="login-flow-dashboard-buttons-block">
            <GrayButtonSmallFont
              text="Dashboard"
              onClick={this.handleOnClickCircleText(0)}
              extraClassName="login-flow-dashboard-buttons-block-btn"
            />
          </div>
        )}
      </>
    );
  };

  /*=================================================================
      main
  ==================================================================*/
  render() {
    // console.log(this.props.allProjects);
    const { companyDaysOff, allResources } = this.state;
    const {
      dashboardFlowCount,
      companyWorkingHours,
      memberDaysOff,
    } = this.state;
    return (
      <>
        {this.renderDashboardNextButtons()}
        {dashboardFlowCount === 0 && this.renderDashboard()}
        {dashboardFlowCount === 1 && (
          <LoginFlowDashboardAddCompanyDayOffs
            companyDaysOff={companyDaysOff}
          />
        )}
        {dashboardFlowCount === 2 && (
          <LoginFlowDashboardAddMembersDayOffs memberDaysOff={memberDaysOff} />
        )}
        {dashboardFlowCount === 3 && (
          <LoginFlowDashboardSetWorkingHours
            companyWorkingHours={companyWorkingHours}
          />
        )}
        {dashboardFlowCount === 4 && <LoginFlowDashboardSetAccessRoles />}
        {dashboardFlowCount === 5 && (
          <LoginFlowDashboardAddTeamMembers
            allResources={allResources}
            companyWorkingHours={companyWorkingHours}
          />
        )}
        {dashboardFlowCount === 6 && (
          <LoginFlowDashboardAddProject allResources={allResources} />
        )}
      </>
    );
  }
}

const mapStateToprops = (state) => ({
  loginFlowNext: state.auth.loginFlowNext,
  companyDaysOff: state.auth.companyDaysOff,
  companyWorkingHours: state.auth.companyWorkingHours,
  memberDaysOff: state.auth.memberDaysOff,
  allResources: state.resources.allResources,
  allProjects: state.projects.allProjects,
});

export default connect(mapStateToprops, {
  getCompanyDaysOff,
  getCompanyWorkingHours,
  getAllMemberDaysOfF,
  getAllResourceAction,
  getAllProjectAction,
})(LoginFlowDashboard);
