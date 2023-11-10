import React, { Component } from "react";
import { connect } from "react-redux";
import { sendForgetPasswordLink } from "./../../../store/actions/authAction";
import { withRouter } from "react-router-dom";
import GrayLinkSmallFont from "../common/GrayLinkSmallFont";
import InputFieldEmailTextPassword from "../common/InputFieldEmailTextPassword";
import GreenButtonSmallFont from "../common/GreenButtonSmallFont";
export class ForgetPassword extends Component {
  constructor() {
    super();
    this.state = {
      email: "",
      errors: {},
    };
  }

  /*=========================
      Form event handlers
  ==========================*/

  handleChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  };

  callBack = (status) => {
    if (status === 200) {
      localStorage.setItem(
        "forgetPasswordEmail",
        JSON.stringify(this.state.email)
      );
      this.props.history.push("/confirmation");
    }
  };

  onSubmitHandler = (e) => {
    e.preventDefault();
    const { email } = this.state;
    console.log(this.state.email);
    this.props.sendForgetPasswordLink(email, this.callBack);
  };

  render() {
    return (
      <>
        <div className="signup-success-container">
          <div className="signup-success-block1 signup-success-block--forgot-password">
            {/*<h1 className="signup-success-block__spaceText text-center mt-30">
              password reset form
               </h1>*/}
            <img
              src={require("../../../assets/img/auth/new-small-logo.png")}
              alt="remote team logo"
              className="auth-logo-img"
            />
            <h1 className="forgot-password-title">
              Please enter your email address
            </h1>
            <div className="forgot-password-padding-block">
              {/*<p className="font-24-bold opacity-26">
                Please enter your registered email. We will send a link to reset
                your password
               </p>*/}
              <InputFieldEmailTextPassword
                containerClassName="container-login-flow-input"
                //label="Email Id"
                name="email"
                value={this.state.email}
                onChange={this.handleChange}
                type="email"
                placeholder="Email Address"
                error={this.state.errors.emailError}
              />

              <div className="row mx-0 forgot-password-button-block">
                <>
                  <GrayLinkSmallFont path="/login" text="Back" />
                  <GreenButtonSmallFont
                    text="Next"
                    onClick={this.onSubmitHandler}
                  />
                </>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }
}

export default connect(null, { sendForgetPasswordLink })(
  withRouter(ForgetPassword)
);
