import React, { Component, Fragment } from "react";
import { Redirect } from "react-router-dom";
import InputFieldEmailTextPassword from "./../common/InputFieldEmailTextPassword";
import isEmpty from "../../../store/validations/is-empty";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import UploadImage from "../common/UploadImage";
import InputFieldNumber from "../common/InputFieldNumber";
import GreenButtonSmallFont from "../common/GreenButtonSmallFont";
import { connect } from "react-redux";

const percentage = 66;

export class ProfileWorkspaceDetails extends Component {
  constructor() {
    super();
    this.state = {
      redirect: false,
      workspaceName: "",
      teamSize: "",
      fileName:
        "https://www.rd.com/wp-content/uploads/2017/09/01-shutterstock_476340928-Irina-Bg.jpg",
    };
  }

  /*=================================================
                Lifecycle Methods
  ===================================================*/
  componentDidMount() {
    let organizationData = JSON.parse(localStorage.getItem("OrganizationData"));
    if (!isEmpty(organizationData)) {
      const { allPlans } = this.props;

      let currentPlan =
        !isEmpty(allPlans) &&
        allPlans.filter((plan) => plan.label === organizationData.billingType);
      console.log(currentPlan);
      this.setState({
        fileName: organizationData.logo,
        workspaceName: organizationData.organizationName,
        teamSize: currentPlan[0].maxUsers,
      });
    }
  }

  handleChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  };

  handleChangeNumber = (e) => {
    this.setState({
      [e.target.name]: e.target.validity.valid ? e.target.value : "",
    });
  };

  handleOnChangeUploadImg = (e) => {
    e.preventDefault();
    this.setState({
      fileName:
        e.target.files.length > 0
          ? URL.createObjectURL(e.target.files[0])
          : e.target.value,
    });
  };

  handleSubmitDetails = (e) => {
    e.preventDefault();
    console.log(this.state);
    alert("sd");
    // this.setState({
    //   redirect: true,
    // });
  };

  render() {
    return (
      <Fragment>
        {this.state.redirect && <Redirect to="/login-dashboard" />}
        <div className="profile_workspace_details_main_container">
          <form
            noValidate
            autoComplete="off"
            onSubmit={this.handleSubmitDetails}
          >
            <div>
              <InputFieldEmailTextPassword
                containerClassName="container-login-flow-input container-login-flow-input--forms"
                label="WORKSPACE NAME"
                name="workspaceName"
                value={this.state.workspaceName}
                onChange={this.handleChange}
                type="text"
                placeholder="Ex. Akshay"
              />
              <h3 className="font-18-bold-space-light-uppercase">
                workspace setup
              </h3>
              <CircularProgressbar
                value={percentage}
                text={`${percentage}%`}
                strokeWidth={15}
              />
              <div>
                <GreenButtonSmallFont type="submit" text="Finish Setup" />
              </div>
            </div>
            <div>
              <InputFieldNumber
                containerClassName="container-login-flow-input container-login-flow-input--forms"
                label="TEAM SIZE"
                name="teamSize"
                value={this.state.teamSize}
                onChange={this.handleChangeNumber}
                placeholder="Ex. 10"
              />
            </div>
            <div>
              <UploadImage
                containerClassName="upload-img__mainBlock upload-img__mainBlock--profile"
                buttonName="+ Upload Image"
                fileNameValue={this.state.fileName}
                acceptType="image/jpeg, image/png"
                onChange={this.handleOnChangeUploadImg}
              />
            </div>
          </form>
        </div>
      </Fragment>
    );
  }
}

const mapStateToProps = (state) => ({
  allPlans: state.auth.plans.plans,
});

export default connect(mapStateToProps)(ProfileWorkspaceDetails);
