import React, { Component } from "react";
import { Link } from "react-router-dom";
import LeftNavbar from "../header/LeftNavbar";
import PageTitle from "../common/PageTitle";
import TopNavbar from "../header/TopNavbar";
import {
  getCompanyDaysOff,
  getCompanyWorkingHours,
  getAllMemberDaysOfF,
} from "./../../../store/actions/authAction";
import { connect } from "react-redux";

class Settings extends Component {
  componentDidMount() {
    this.props.getAllMemberDaysOfF();
    this.props.getCompanyDaysOff();
    this.props.getCompanyWorkingHours();
  }
  render() {
    return (
      <>
        {/* left navbar */}
        <LeftNavbar activeMenu="settings" />

        <div className="main-page-padding">
          {/* pagetitle and topnavbar */}
          <div className="pageTitle-topNavbar-div">
            <PageTitle title="settings" />
            <TopNavbar />
          </div>

          <div className="settings-content">
            {/**font-18-bold-space-light-uppercase color-white */}
            <Link to="/settings-organisation">
              <h3 className="settings-content-title1 mb-40">
                <img
                  src={require("../../../assets/img/settings/setting-arrow-icon-1.svg")}
                  alt=""
                  className="settings-organisation-circle-icon"
                />
                organisation settings
              </h3>
            </Link>

            <Link to="/settings-access">
              <h3 className="settings-content-title1 settings-content-title2  mb-50">
                <img
                  src={require("../../../assets/img/settings/setting-arrow-icon-2.svg")}
                  alt=""
                  className="settings-organisation-circle-icon"
                />
                access settings
              </h3>
            </Link>

            <Link to="/settings-help">
              <h3 className="settings-content-title1 settings-content-title3  mb-50">
                <img
                  src={require("../../../assets/img/settings/setting-arrow-icon-3.svg")}
                  alt=""
                  className="settings-organisation-circle-icon"
                />
                help
              </h3>
            </Link>
          </div>
        </div>
      </>
    );
  }
}

export default connect(null, {
  getCompanyDaysOff,
  getCompanyWorkingHours,
  getAllMemberDaysOfF,
})(Settings);
