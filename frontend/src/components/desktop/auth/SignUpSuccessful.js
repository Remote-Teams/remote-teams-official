import React, { Component } from "react";
import GreenButtonBigFont from "../common/GreenButtonBigFont";
import isEmpty from "../../../store/validations/is-empty";
import { withRouter } from "react-router-dom";

class SignUpSuccessful extends Component {
  componentWillUnmount() {
    localStorage.removeItem("signupUserInfo");
  }

  goToLinkHandler = () => {
    let signupUserInfo = JSON.parse(localStorage.getItem("signupUserInfo"));

    // window.location.href = `https://${signupUserInfo.data.workspaceUrl}`;

    if (process.env.NODE_ENV === "development") {
      this.props.history.push("/");
    } else {
      this.props.history.push("/");
      // this.props.history.push("/login");
      // window.location.href = `https://${signupUserInfo.data.workspaceUrl}`;
    }
  };
  render() {
    let signupUserInfo = JSON.parse(localStorage.getItem("signupUserInfo"));

    let url = !isEmpty(signupUserInfo) && signupUserInfo.data.workspaceUrl;
    let workspaceId =
      !isEmpty(signupUserInfo) && signupUserInfo.data.workspaceId;
    return (
      <div className="signup-success-container">
        <div className="signup-success-block signup-success-block--new-signup">
          <div className="signup-success-block__spaceText-title-div signup-success-block__spaceText-title-div--new-signup">
            <h1 className="signup-success-block__spaceText-title--new-signup">
              congratulations
            </h1>
            {/**signup-success-block__spaceText-title  */}
          </div>
          {/**font-24-bold */}
          <h2 className="color-offwhite font-24-semiBold">
            You Have Signed Up On Remote Teams With Workspace <br /> Domain:
            {signupUserInfo.data.workspaceId}
            {/*you have signed up on remote teams with Workspace Domain:{" "}
            <span className="text-lowercase">https://{url}</span>*/}
          </h2>
          <img
            src={require("../../../assets/img/auth/signup-successfull-icon.png")}
            alt=""
            className="signup-success-block__img"
          />
          <h3 className="signup-success-block__workspace-name">
            {/*Workspace Name*/}
            {workspaceId}
          </h3>
          {/**signup-success-block__spaceText */}
          <h4 className="signup-success-block__spaceText--signup font-18-bold">
            {/*workspaceId*/}
            <span className="text-lowercase">https://{url}</span>
          </h4>
          <div className="signup-successfull-btn-div">
            <GreenButtonBigFont
              onClick={this.goToLinkHandler}
              //text="Login"
              text={"Continue to Workspace"}
              extraClassName={"signup-successfull-btn"}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default withRouter(SignUpSuccessful);
