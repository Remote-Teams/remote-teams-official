import React, { Component } from "react";
import LoginFlowDashboardAddTeamMembers from "../auth/LoginFlowDashboardAddTeamMembers";
import GrayButtonSmallFont from "../common/GrayButtonSmallFont";

class AllProjectAddNewmember extends Component {
  handleOnClickGoBack = () => {
    window.history.back();
  };

  render() {
    return (
      <div>
        <div className="login-flow-dashboard-buttons-block">
          <GrayButtonSmallFont
            text="Go Back"
            onClick={this.handleOnClickGoBack}
          />
        </div>
        <LoginFlowDashboardAddTeamMembers />
      </div>
    );
  }
}

export default AllProjectAddNewmember;
