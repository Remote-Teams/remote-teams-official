import React, { Component } from "react";
import PageTitle from "../common/PageTitle";
import GrayLinkSmallFont from "../common/GrayLinkSmallFont";
import LoginFlowDashboardSetWorkingHours from "../auth/LoginFlowDashboardSetWorkingHours";
import LoginFlowDashboardAddCompanyDayOffs from "../auth/LoginFlowDashboardAddCompanyDayOffs";
import LoginFlowDashboardAddMembersDayOffs from "../auth/LoginFlowDashboardAddMembersDayOffs";
import GrayButtonSmallFont from "../common/GrayButtonSmallFont";
import { connect } from "react-redux";
import isEmpty from "../../../store/validations/is-empty";
import {
  getCompanyDaysOff,
  getCompanyWorkingHours,
  getAllMemberDaysOfF,
} from "./../../../store/actions/authAction";

class SettingsOrganisation extends Component {
  constructor() {
    super();
    this.state = {
      manageStateCount: 0,
      companyDaysOff: {},
      companyWorkingHours: {},
      memberDaysOff: {},
    };
  }

  componentDidMount() {
    this.props.getAllMemberDaysOfF();
    this.props.getCompanyDaysOff();
    this.props.getCompanyWorkingHours();
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

    return null;
  }

  /*=======================================================
      handlers
  =======================================================*/

  handleOnClickManage = (count) => (e) => {
    this.setState({
      manageStateCount: count,
    });
  };

  /*=======================================================
      renderMainPageContent
  =======================================================*/
  renderMainPageContent = () => {
    return (
      <div className="main-page-padding">
        <div className="mb-30">
          <PageTitle title="organisation settings" shadow="settings" />
        </div>

        <div className="settings-content">
          <div className="mb-30 pb-10">
            <h3 className="font-18-bold-space-light-uppercase mb-15">
              working hours
            </h3>
            <GrayButtonSmallFont
              text="Manage"
              onClick={this.handleOnClickManage(1)}
            />
          </div>
          <div className="mb-30 pb-10">
            <h3 className="font-18-bold-space-light-uppercase mb-15">
              company day offs
            </h3>
            <GrayButtonSmallFont
              text="Manage"
              onClick={this.handleOnClickManage(2)}
            />
          </div>
          <div className="mb-30 pb-10">
            <h3 className="font-18-bold-space-light-uppercase mb-15">
              member day offs
            </h3>
            <GrayButtonSmallFont
              text="Manage"
              onClick={this.handleOnClickManage(3)}
            />
          </div>
        </div>
      </div>
    );
  };

  /*=======================================================
      main
  =======================================================*/
  render() {
    console.log(
      this.state.companyDaysOff,
      this.state.companyWorkingHours,
      this.state.memberDaysOff
    );
    const { manageStateCount } = this.state;

    const { companyDaysOff, companyWorkingHours, memberDaysOff } = this.state;
    return (
      <>
        {/* back buttons */}
        <div className="login-flow-dashboard-buttons-block">
          {manageStateCount !== 0 ? (
            <GrayButtonSmallFont
              text="Go Back"
              onClick={this.handleOnClickManage(0)}
            />
          ) : (
            <GrayLinkSmallFont path="/settings" text="Back" />
          )}
        </div>

        {/* company working hours */}
        {manageStateCount === 1 && (
          <LoginFlowDashboardSetWorkingHours
            companyWorkingHours={companyWorkingHours}
          />
        )}

        {/* company day offs  */}
        {manageStateCount === 2 && (
          <LoginFlowDashboardAddCompanyDayOffs
            companyDaysOff={companyDaysOff}
          />
        )}

        {/* member day offs */}
        {manageStateCount === 3 && (
          <LoginFlowDashboardAddMembersDayOffs memberDaysOff={memberDaysOff} />
        )}

        {/* main page organisation */}
        {manageStateCount === 0 && this.renderMainPageContent()}
      </>
    );
  }
}

const mapStateToprops = (state) => ({
  companyDaysOff: state.auth.companyDaysOff,
  companyWorkingHours: state.auth.companyWorkingHours,
  memberDaysOff: state.auth.memberDaysOff,
});

export default connect(mapStateToprops, {
  getCompanyDaysOff,
  getCompanyWorkingHours,
  getAllMemberDaysOfF,
})(SettingsOrganisation);
