import React, { Component } from "react";
import AccessRoleInfoColumns from "../common/AccessRoleInfoColumns";
import GrayLinkSmallFont from "../common/GrayLinkSmallFont";

class SettingsAccess extends Component {
  render() {
    return (
      <>
        <div className="main-page-padding">
          <div className="text-right">
            <GrayLinkSmallFont path="/settings" text="Back" />
          </div>
          <div className="settings-content">
            <h1 className="settings-access-roles-title">Access Roles</h1>
            <div className="row mx-auto align-items-start flex-nowrap">
              <AccessRoleInfoColumns />
            </div>
          </div>
        </div>
      </>
    );
  }
}

export default SettingsAccess;
