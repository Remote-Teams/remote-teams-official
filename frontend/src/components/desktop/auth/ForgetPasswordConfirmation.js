import React, { Component } from "react";
import { connect } from "react-redux";
import GreenLinkBigFont from "../common/GreenLinkBigFont";
import isEmpty from "../../../store/validations/is-empty";

export class ForgetPasswordConfirmation extends Component {
  constructor() {
    super();
    this.state = {
      userEmail: "",
    };
  }
  async componentDidMount() {
    let userEmail = JSON.parse(localStorage.getItem("forgetPasswordEmail"));
    if (!isEmpty(userEmail)) {
      await this.setState({
        userEmail: userEmail,
      });
    }
  }
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
              Check your mailbox for reset link
            </h1>
            <div className="forgot-password-padding-block">
              {/*<p className="font-29-bold forgot-password-confirmation-text">
                A link has been sent to <b>{`"${this.state.userEmail}"`}</b>.
                Please reset your password with that link.
  </p>*/}

              <div className="text-center pt-40">
                <GreenLinkBigFont path="/login" text="Okay" />
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }
}

const mapStateToProps = (state) => ({
  forgetPasswordMail: state.auth.forgetPasswordMail,
});

export default connect(mapStateToProps, {})(ForgetPasswordConfirmation);
