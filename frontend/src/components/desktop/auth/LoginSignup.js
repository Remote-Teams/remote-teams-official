import React, { Component } from "react";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";
import LoginForm from "./LoginForm";
import SignUpForm from "./SignUpForm";
import { connect } from "react-redux";
import { getPlansAction } from "./../../../store/actions/authAction";
import { workspaceId } from "./../../../store/actions/config";
import Loader from "react-loader-spinner";
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";

class LoginSignup extends Component {
  /*==================================================
                  Lifecycle Methods
  ====================================================*/
  componentDidMount() {
    // console.log("asdasdasd", workspaceId);

    if (process.env.NODE_ENV === "production") {
      if (workspaceId !== "login") {
        window.location.href = `https://${workspaceId}.remote-teams.io/login`;
      } else {
        console.log("main page");
      }
    }

    this.props.getPlansAction();
  }
  render() {
    const { loader } = this.props;
    return (
      <>
        {loader === true && (
          <Loader type="Triangle" color="#57cba1" className="remote-loader" />
        )}
        <div className="login-signup-container-bg">
          <div className="login-signup-container login-signup-container--new">
            <div className="text-center">
              <img
                src={require("../../../assets/img/auth/new-small-logo.png")}
                alt="remote team logo"
                className="auth-logo-img"
              />
              <h2 className="work-remotely-text">Work Remotely</h2>
            </div>
            <div>
              <Tabs>
                <TabList>
                  <Tab className="react-tabs__tab react-tabs__tab--1">
                    <span>Login</span>
                  </Tab>
                  <Tab className="react-tabs__tab react-tabs__tab--2">
                    <span>Sign Up</span>
                  </Tab>
                </TabList>
                <TabPanel className="react-tabs__tab-panel react-tabs__tab-panel--1">
                  <LoginForm />
                </TabPanel>
                <TabPanel className="react-tabs__tab-panel react-tabs__tab-panel--2">
                  <SignUpForm />
                </TabPanel>
              </Tabs>
            </div>
          </div>
        </div>
      </>
    );
  }
}

const mapStateToProps = (state) => ({
  loader: state.auth.loader,
});

export default connect(mapStateToProps, { getPlansAction })(LoginSignup);
