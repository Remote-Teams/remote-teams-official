import React, { Component } from "react";
import { Link, Redirect, withRouter } from "react-router-dom";
import InputFieldEmailTextPassword from "../common/InputFieldEmailTextPassword";
import GreenButtonBigFont from "../common/GreenButtonBigFont";
import { connect } from "react-redux";
import { loginUser } from "./../../../store/actions/authAction";
import { validateLogin } from "./../../../store/validations/authValidation/loginValidation";
import isEmpty from "../../../store/validations/is-empty";
import cookie from "react-cookies";

class LoginUsernamePassword extends Component {
  constructor() {
    super();
    this.state = {
      redirect: false,
      // login form
      loginEmail: "",
      loginPassword: "",
      errors: {},
    };
  }

  /*=========================================================
      Lifecycle methods
  ==========================================================*/
  componentDidMount() {
    let allCookies = cookie.loadAll();
    // console.log(allCookies);
    if (!isEmpty(allCookies.socialLoginInfo)) {
      let parseData = JSON.parse(allCookies.socialLoginInfo);
      // const formData = {
      //   email: parseData.email,
      //   password: parseData.googleId,
      // };
      this.props.loginUser(parseData, this.props.history);
    }
    localStorage.removeItem("forgetPasswordEmail");
    const { isAuthenticated, userData } = this.props;
    if (isAuthenticated && userData.demo === false) {
      this.props.history.push("/dashboard");
    } else if (isAuthenticated && userData.demo) {
      this.props.history.push("/welcome-user");
    }
  }
  /*============================================================
        handlers
  =============================================================*/

  handleChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
      errors: {},
    });
  };

  callBackLogin = (err) => {
    if (err.response.data.statusCode === 400) {
      let errors = {};
      errors.backendError = "Invalid credentials";
      this.setState({
        errors: errors,
      });
    }
  };

  handleLogin = (e) => {
    e.preventDefault();

    const { errors, isValid } = validateLogin(this.state);

    if (!isValid) {
      this.setState({
        errors: errors,
      });
    } else {
      console.log(this.state);
      const formData = {
        email: this.state.loginEmail,
        password: this.state.loginPassword,
      };

      this.props.loginUser(formData, this.props.history, this.callBackLogin);
    }

    // this.setState({
    //   redirect: true,
    // });
  };

  onChangeWorkspaceHandler = () => {
    if (process.env.NODE_ENV === "development") {
      this.props.history.push("/");
    } else {
      window.location.href = `https://login.remote-teams.io`;
    }
  };

  /*============================================================
        main 
  =============================================================*/
  render() {
    const { errors } = this.state;
    console.log(errors);
    return (
      <>
        {this.state.redirect && <Redirect to="/welcome-user" />}
        <div className="signup-success-container-column">
          <div className="signup-success-container">
            <div className="row mx-0 justify-content-center align-items-center">
              <img
                src={require("../../../assets/img/auth/new-small-logo.png")}
                alt="remote team logo"
                className="auth-logo-img"
              />
            </div>
            <div className="signup-success-block signup-success-block--login text-left">
              <div className="signup-success-block--email-password-title">
                <h1 className="text-center mb-0 pb-10">Login</h1>
              </div>
              {/* <p className="text-center font-18-italic">Workspace Name </p> */}
              <div className="login-form-container login-form-container--email-password">
                <h3 className="font-18-montserrat-gradient-text row mx-0 align-items-center w-100">
                  <img
                    src={require("../../../assets/img/auth/subtitle-img.png")}
                    alt=""
                    className="subtitle-icon-img"
                  />
                  <span>Hi! welcome back</span>
                </h3>
                <form noValidate autoComplete="off" onSubmit={this.handleLogin}>
                  {!isEmpty(errors.backendError) && errors.backendError && (
                    <p className="error-message invalid-credentials text-center">
                      Invalid credentials
                    </p>
                  )}
                  <div className="email-password-input-div">
                    <InputFieldEmailTextPassword
                      containerClassName="container-login-flow-input"
                      //label="Email Id"
                      name="loginEmail"
                      value={this.state.loginEmail}
                      onChange={this.handleChange}
                      type="email"
                      autoFocus={true}
                      placeholder="E-mail address"
                      error={!isEmpty(errors.loginEmail) && errors.loginEmail}
                    />
                    <InputFieldEmailTextPassword
                      containerClassName="container-login-flow-input"
                      //label="Password"
                      name="loginPassword"
                      value={this.state.loginPassword}
                      onChange={this.handleChange}
                      type="password"
                      placeholder="Password"
                      error={
                        !isEmpty(errors.loginPassword) && errors.loginPassword
                      }
                    />
                    <div className="row mx-0 justify-content-between">
                      <div>
                        <Link
                          to="/forgot-password"
                          className="forgot-password-link pb-20"
                        >
                          Forgot Password?
                        </Link>
                        <button
                          type="button"
                          onClick={this.onChangeWorkspaceHandler}
                          className="link-button-onclick forgot-password-link mt-20 mb-15"
                        >
                          Change workspace
                        </button>
                      </div>
                      <div className="text-right">
                        <GreenButtonBigFont
                          extraClassName="login-next-green-btn--login"
                          type="Submit"
                          text="Login"
                        />
                      </div>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }
}

const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated,
  userData: state.auth.user,
});

export default connect(mapStateToProps, { loginUser })(
  withRouter(LoginUsernamePassword)
);
