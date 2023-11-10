import React, { Fragment, Component } from "react";
// import PopupInputFields from "../common/PopupInputFields";
import { withRouter, Link } from "react-router-dom";
import { connect } from "react-redux";
import {
  verifyUserAction,
  userPasswordResetAction,
} from "./../../../store/actions/authAction";
import { workspaceId } from "./../../../store/actions/config";
import isEmpty from "./../../../store/validations/is-empty";

import Loader from "react-loader-spinner";
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import InputFieldEmailTextPassword from "../common/InputFieldEmailTextPassword";
import GreenButtonBigFont from "../common/GreenButtonBigFont";
import GreenLinkSmallFont from "../common/GreenLinkSmallFont";

export class SetEmployeePassword extends Component {
  constructor() {
    super();
    this.state = {
      open: true,
      employeePassword: "",
      verifyEmployeeData: {},
    };
  }

  async componentDidMount() {
    // Get Authcode From Pathname
    let authCodePart = this.props.match.params.id;
    console.log(authCodePart);
    await this.props.verifyUserAction(authCodePart, this.callBack);
  }

  callBack = (data) => {
    if (data) {
      this.setState({
        verifyEmployeeData: data,
      });
    }
  };

  handleChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  };

  onSubmitHandler = (e) => {
    e.preventDefault();

    // Get Authcode From Pathname
    let authCodePart = this.props.match.params.id;
    if (!isEmpty(this.state.employeePassword)) {
      const formData = {
        email: this.state.verifyEmployeeData.email,
        password: this.state.employeePassword,
      };

      this.props.userPasswordResetAction(
        formData,
        authCodePart,
        this.props.history
      );
      console.log(this.state);
    } else {
      console.log("password should not empty");
      // this.setState({
      //   errorMessage: "Password should not be empty"
      // });
    }
  };

  /*====================================
    Render Set Employee Password Model
  ======================================*/

  renderSetPasswordModel = () => {
    const { open, verifyEmployeeData } = this.state;
    // let errorMessageNew = errors.userPassword
    //   ? errors.userPassword
    //   : !isEmpty(this.state.errorMessage)
    //   ? this.state.errorMessage
    //   : "";
    return (
      <>
        {open && (
          <>
            <div className="signup-success-container">
              <div>
                <p className="font-29-bold text-center pt-20">
                  Welcome To Remote Teams!
                </p>
                <div className="signup-success-block signup-success-block--reset-password-link-broke">
                  <h1 className="signup-success-block__spaceText text-center mt-30">
                    Set Password
                  </h1>
                  <div className="forgot-password-padding-block forgot-password-padding-block--set-member">
                    <h3 className="font-18-bold-space-light-uppercase mb-0">
                      Workspace Name
                    </h3>
                    <p className="font-24-extraBold pt-10">
                      {workspaceId}.dominate.ai
                    </p>
                    <h3 className="font-18-bold-space-light-uppercase mb-0">
                      Email
                    </h3>
                    <p className="font-24-extraBold pt-10">
                      {verifyEmployeeData.email}
                    </p>
                    <InputFieldEmailTextPassword
                      containerClassName="container-login-flow-input"
                      label="Set Password"
                      name="employeePassword"
                      value={this.state.employeePassword}
                      onChange={this.handleChange}
                      type="password"
                      placeholder={"Set Password"}
                      // error={errorMessageNew}
                    />
                    {/*text-right*/}
                    <div className="text-center pt-10">
                      <GreenButtonBigFont
                        text="Submit"
                        onClick={this.onSubmitHandler}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </>
    );
  };

  renderContent = () => {
    const { verifyEmployeeData, open } = this.state;
    if (isEmpty(verifyEmployeeData)) {
      return (
        <Loader type="Triangle" color="#5ccc40" className="throttle-loader" />
      );
    } else if (verifyEmployeeData.success) {
      return this.renderSetPasswordModel();
    } else {
      return (
        <>
          {open && (
            <div className="signup-success-container text-center">
              <div className="signup-success-block signup-success-block--reset-password-link-broke">
                <h1 className="signup-success-block__spaceText text-center pt-40">
                  link broken/expired
                </h1>
                <div className="forgot-password-padding-block">
                  {/**text-left */}
                  <h2 className="font-24-bold pt-40">Link expired or broken</h2>
                  <p className="font-18-semiBold text-center pt-30">
                    The link you have clicked has already been used previously
                    or has expired.
                  </p>
                  <div className="text-center">
                    <GreenLinkSmallFont path="/login" text="Back" />
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      );
    }
  };

  render() {
    return <Fragment>{this.renderContent()}</Fragment>;
  }
}

export default connect(null, {
  verifyUserAction,
  userPasswordResetAction,
})(withRouter(SetEmployeePassword));
