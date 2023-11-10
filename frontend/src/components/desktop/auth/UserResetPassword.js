import React, { Component, Fragment } from "react";
import { workspaceId } from "./../../../store/actions/config";
import Modal from "react-responsive-modal";
import isEmpty from "./../../../store/validations/is-empty";
import Loader from "react-loader-spinner";
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import { connect } from "react-redux";
import {
  userPasswordResetAction,
  verifyUserAction,
} from "./../../../store/actions/authAction";
import { withRouter, Link } from "react-router-dom";
import GreenLinkSmallFont from "../common/GreenLinkSmallFont";
import GreenButtonBigFont from "../common/GreenButtonBigFont";
import InputFieldEmailTextPassword from "../common/InputFieldEmailTextPassword";

export class UserResetPassword extends Component {
  constructor() {
    super();
    this.state = {
      userPasswordModel: true,
      userPassword: "",
      verifyEmployeeData: "",
      errors: {},
    };
  }

  /*=================================
    Component Lifecycle Method
  ==================================*/
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

  errorHandler = (validationError) => {
    // console.log(validationError);
    this.setState({
      errorMessage: validationError.message,
    });
  };

  /*==================================
        event Handlers
  ====================================*/

  handleChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
      errorMessage: "",
    });
  };

  onSubmitHandler = (e) => {
    e.preventDefault();
    console.log(this.state.userPassword);

    // Get Authcode From Pathname
    let authCodePart = this.props.match.params.id;
    if (!isEmpty(this.state.userPassword)) {
      const formData = {
        email: this.state.verifyEmployeeData.email,
        password: this.state.userPassword,
      };

      this.props.userPasswordResetAction(
        formData,
        authCodePart,
        this.props.history
      );
      console.log(this.state);
    } else {
      // this.setState({
      //   errorMessage: "Password should not be empty"
      // });
    }
  };

  /*==================================
      Reset User Password model
  ===================================*/

  renderSetUserPasswordModel = () => {
    const { userPasswordModel, verifyEmployeeData, errors } = this.state;
    let errorMessageNew = errors.userPassword
      ? errors.userPassword
      : !isEmpty(this.state.errorMessage)
      ? this.state.errorMessage
      : "";
    return (
      <>
        {userPasswordModel && (
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
                  <div className="forgot-password-padding-block">
                    <h3 className="font-18-bold-space-light-uppercase mb-0">
                      Workspace Name
                    </h3>
                    <p className="font-24-extraBold pt-10">
                      {workspaceId}.remote-teams.ai
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
                      name="userPassword"
                      value={this.state.userPassword}
                      onChange={this.handleChange}
                      type="password"
                      error={errorMessageNew}
                    />
                    <div className="text-right pt-10">
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
    const { verifyEmployeeData, userPasswordModel } = this.state;
    if (isEmpty(verifyEmployeeData)) {
      return (
        <Loader type="Triangle" color="#5ccc40" className="throttle-loader" />
      );
    } else if (verifyEmployeeData.success) {
      return this.renderSetUserPasswordModel();
    } else {
      return (
        <>
          {userPasswordModel && (
            <div className="signup-success-container">
              <div className="signup-success-block signup-success-block--reset-password-link-broke">
                <h1 className="signup-success-block__spaceText text-center mt-30">
                  link broken/expired
                </h1>
                <div className="forgot-password-padding-block">
                  <h2 className="font-24-bold text-left">
                    Link expired or broken
                  </h2>
                  <p className="font-18-semiBold">
                    The link you have clicked has already been used previously
                    or has expired.
                  </p>
                  <GreenLinkSmallFont path="/login" text="Back" />
                </div>
              </div>
            </div>
          )}
        </>
      );
    }
  };

  render() {
    // console.log(this.props.verifyEmployeeData);
    return <Fragment>{this.renderContent()}</Fragment>;
  }
}

export default connect(null, {
  userPasswordResetAction,
  verifyUserAction,
})(withRouter(UserResetPassword));
