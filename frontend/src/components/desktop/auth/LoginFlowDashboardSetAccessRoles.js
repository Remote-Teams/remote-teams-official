import React, { Component } from "react";
import Checkbox from "rc-checkbox";
import "rc-checkbox/assets/index.css";
import PageTitle from "../common/PageTitle";

const data = [
  {
    img: require("../../../assets/img/dummy/access-role-admin.svg"),
    title: "Admin",
    projects: {
      edit: false,
      create: false,
      view: false,
      all: true,
    },
    resources: {
      edit: false,
      create: false,
      view: false,
      all: true,
    },
    finances: {
      edit: false,
      create: false,
      view: false,
      all: true,
    },
    customers: {
      edit: false,
      create: false,
      view: false,
      all: true,
    },
    reports: {
      edit: false,
      create: false,
      view: false,
      all: true,
    },
  },
  {
    img: require("../../../assets/img/dummy/access-role-manager.svg"),
    title: "Project manager",
    projects: {
      edit: false,
      create: false,
      view: false,
      all: true,
    },
    resources: {
      edit: true,
      create: false,
      view: true,
      all: false,
    },
    finances: {
      edit: false,
      create: false,
      view: false,
      all: true,
    },
    customers: {
      edit: false,
      create: false,
      view: false,
      all: true,
    },
    reports: {
      edit: false,
      create: false,
      view: false,
      all: true,
    },
  },
  {
    img: require("../../../assets/img/dummy/access-role-resource.svg"),
    title: "Resource",
    projects: {
      edit: false,
      create: false,
      view: true,
      all: false,
    },
    resources: {
      edit: false,
      create: false,
      view: true,
      all: false,
    },
    finances: {
      edit: false,
      create: false,
      view: false,
      all: false,
    },
    customers: {
      edit: false,
      create: false,
      view: true,
      all: false,
    },
    reports: {
      edit: false,
      create: false,
      view: false,
      all: false,
    },
  },
  {
    img: require("../../../assets/img/dummy/access-role-client.svg"),
    title: "Client",
    projects: {
      edit: false,
      create: false,
      view: true,
      all: false,
    },
    resources: {
      edit: false,
      create: false,
      view: false,
      all: false,
    },
    finances: {
      edit: false,
      create: false,
      view: false,
      all: false,
    },
    customers: {
      edit: false,
      create: false,
      view: false,
      all: false,
    },
    reports: {
      edit: false,
      create: false,
      view: false,
      all: false,
    },
  },
];

class LoginFlowDashboardSetAccessRoles extends Component {
  /*=======================================================
      renderContentRow
  =======================================================*/
  renderContentRow = (name, val1, val2, val3, val4) => {
    return (
      <div className="row mx-0 mb-18 login-access-roles-content__row">
        <div className="col-4">
          <h5 className="font-24-semiBold">{name}</h5>
        </div>
        <div className="col-2">
          <div className="customCheckbox">
            <Checkbox disabled={true} checked={val1} />
          </div>
        </div>
        <div className="col-2">
          <div className="customCheckbox">
            <Checkbox disabled={true} checked={val2} />
          </div>
        </div>
        <div className="col-2">
          <div className="customCheckbox">
            <Checkbox disabled={true} checked={val3} />
          </div>
        </div>
        <div className="col-2">
          <div className="customCheckbox">
            <Checkbox disabled={true} checked={val4} />
          </div>
        </div>
      </div>
    );
  };

  /*=======================================================
      renderMainContent
  =======================================================*/
  renderMainContent = () => {
    return (
      <>
        {data.map((data, index) => (
          <div key={index} className="col-6">
            <div className="login-access-roles-content__img-div">
              <img src={data.img} alt="person" className="img-wh-100" />
            </div>
            <h4 className="font-18-bold-space-light-uppercase text-center mb-30">
              {data.title}
            </h4>
            {/* title row */}
            <div className="row mx-0 mb-18 login-access-roles-content__title-row">
              <div className="col-4"></div>
              <div className="col-2">
                <h5 className="font-20-semiBold">edit</h5>
              </div>
              <div className="col-2">
                <h5 className="font-20-semiBold">create</h5>
              </div>
              <div className="col-2">
                <h5 className="font-20-semiBold">view</h5>
              </div>
              <div className="col-2">
                <h5 className="font-20-semiBold">all</h5>
              </div>
            </div>
            {this.renderContentRow(
              "Projects",
              data.projects.edit,
              data.projects.create,
              data.projects.view,
              data.projects.all
            )}
            {this.renderContentRow(
              "Resources",
              data.resources.edit,
              data.resources.create,
              data.resources.view,
              data.resources.all
            )}
            {this.renderContentRow(
              "Finances",
              data.finances.edit,
              data.finances.create,
              data.finances.view,
              data.finances.all
            )}
            {this.renderContentRow(
              "Customers",
              data.customers.edit,
              data.customers.create,
              data.customers.view,
              data.customers.all
            )}
            {this.renderContentRow(
              "Reports",
              data.reports.edit,
              data.reports.create,
              data.reports.view,
              data.reports.all
            )}
          </div>
        ))}
      </>
    );
  };

  render() {
    return (
      <div className="login-member-day-offs">
        {/* page title */}
        <PageTitle title="access roles" />

        <div className="login-access-roles-content">
          <h2 className="font-24-semiBold">Here are the default roles</h2>
          <h3 className="font-20-semiBold">
            You can select these when you are adding a member on board
          </h3>
          <div className="row mx-0 login-access-roles-content__row">
            {this.renderMainContent()}
          </div>
          <h3 className="font-20-semiBold">
            Please note : all includes access to create , view and edit
          </h3>
        </div>
      </div>
    );
  }
}

export default LoginFlowDashboardSetAccessRoles;
