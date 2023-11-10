import React, { useState, Fragment, useRef } from "react";
import { withRouter } from "react-router-dom";
import InputFieldEmailTextPassword from "../common/InputFieldEmailTextPassword";
import GreenButtonBigFont from "../common/GreenButtonBigFont";
import GrayButtonSmallFont from "../common/GrayButtonSmallFont";
import { connect } from "react-redux";
import {
  userSignUpAction,
  getWorkspace,
  loginUser,
  googleSignUpAction,
} from "./../../../store/actions/authAction";
import isEmpty from "../../../store/validations/is-empty";
import PlansContent from "../common/PlansContent";
import Toast from "light-toast";
import ReactFlagsSelect from "react-flags-select";
import { getAllInfoByISO } from "iso-country-currency";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router";
import debounce from "lodash.debounce";
import GoogleSocial from "./GoggleSocial";
import FacebookSocial from "./FacebookSocial";
import store from "./../../../store/store";
import { SET_LOADER, CLEAR_LOADER } from "./../../../store/types";
import { validateSignUp } from "./../../../store/validations/authValidation/signupValidation";
import { validateWorkspace } from "./../../../store/validations/authValidation/workspaceValidation";
//const totalScreen = 5;
const totalScreen = 2;

function SignUpForm() {
  const history = useHistory();
  const dispatch = useDispatch();
  const [values, setValues] = useState({
    screenNum: 0,
    redirect: false,
    // signup form
    loginWorkspaceName: "",
    fname: "",
    lname: "",
    email: "",
    password: "",
    confirmPassword: "",
    planSelected: "",
    // allPlans: {},
    // errors: {},
    selectedCountry: "IN",
  });

  const [errors, setErrors] = useState({});
  const [workspaceExist, setWorkspaceExist] = useState("");

  /*============================================================
        handlers
  =============================================================*/

  const callback = (data) => {
    console.log(data);
    let error = {};
    if (data.exist === true) {
      error.workspace = "Workspace already exist";
      // this.setState({
      //   errors: error,
      //   workspaceExist: true,
      // });
      setErrors(error);
      setWorkspaceExist(true);
    } else {
      // this.setState({
      //   errors: "",
      //   workspaceExist: false,
      // });
      setErrors("");
      setWorkspaceExist(false);
    }
  };

  // debounce start
  const debouncedSave = useRef(
    debounce((nextValue) => dispatch(getWorkspace(nextValue, callback)), 1000)
    // will be created only once initially
  ).current;
  // debounce end

  const handleChange = (e) => {
    if (e.target.name === "loginWorkspaceName") {
      // debounce_fun();
      const { value: nextValue } = e.target;
      debouncedSave(nextValue);
      // dispatch(getWorkspace(e.target.value, callBackWorkspaceCheck));
    }
    if (e.target.name === "loginWorkspaceName") {
      setValues({
        ...values,
        loginWorkspaceName: e.target.value.toLowerCase(),
      });
      // console.log(values.loginWorkspaceName, "***");
    } else if (e.target.name === "email") {
      setValues({
        ...values,
        email: e.target.value.toLowerCase(),
      });
    } else {
      setValues({
        ...values,
        [e.target.name]: e.target.value,
        displayConfirmPassword: false,
        // errors: {},
      });
    }
    setErrors({});
  };

  const handlePrev = () => {
    setValues({
      ...values,
      screenNum: values.screenNum - 1,
    });
  };

  const handleNext = () => {
    const { errors, isValid } = validateWorkspace(values);

    if (!isValid) {
      // console.log(errors);
      setErrors(errors);
    } else {
      if (values.screenNum === 0 && workspaceExist === false) {
        store.dispatch({
          type: SET_LOADER,
        });
        setTimeout(function() {
          store.dispatch({
            type: CLEAR_LOADER,
          });
        }, 1500);
      }
      if (workspaceExist === false) {
        setValues({
          ...values,
          screenNum: values.screenNum + 1,
        });
      } else if (
        !isEmpty(values.loginWorkspaceName) &&
        workspaceExist === true
      ) {
        Toast.info("Workspace already exist", 3000);
      }
    }
  };

  const handleFinish = () => {
    // console.log(this.state);

    const { errors, isValid } = validateSignUp(
      values,
      values.password,
      values.confirmPassword
    );
    if (!isValid) {
      setErrors(errors);
    } else {
      const formData = {
        organizationName: values.loginWorkspaceName,
        workspaceId: values.loginWorkspaceName,
        // billingType: values.planSelected,
        defaultUserEmailId: values.email,
        defaultUserPassword: values.password,
        defaultUserFirstName: values.fname,
        defaultUserLastName: values.lname,
        defaultUserCurrency: getAllInfoByISO(
          values.selectedCountry
        ).currency.toLowerCase(),
        features: ["call"],
      };

      dispatch(userSignUpAction(formData, history));
    }

    // this.setState({
    //   redirect: true,
    // });
  };

  const handleOnKeyDown = (e) => {
    //if (e.keyCode === 13 && values.screenNum === 4) {
    if (e.keyCode === 13 && values.screenNum === 2) {
      e.preventDefault();
    } else if (e.keyCode === 13) {
      e.preventDefault();
      handleNext();
    }
  };

  /*============================================================
        renderButtons
  =============================================================*/
  const renderButtons = () => {
    const { screenNum } = values;
    return (
      <div className="signup-buttons-div">
        {/** signup-buttons-div__button-block1 signup-buttons-div__button-block2*/}
        <div>
          {screenNum === 0 && (
            <div className="signup-buttons-div__button-block1--new text-center">
              <GreenButtonBigFont
                extraClassName="login-next-green-btn--signup"
                text="Next"
                onClick={handleNext}
              />
            </div>
          )}
        </div>
        <div className="row mx-0 justify-content-center ">
          {screenNum > 0 && screenNum < totalScreen && (
            <>
              {/*<GrayButtonSmallFont text="Back" onClick={handlePrev} />*/}
              <button
                className="sign-up-goback-btn sign-up-goback-btn--finish"
                onClick={handlePrev}
              >
                <div className="sign-up-goback-btn-arrow"></div>
                <span>go Back</span>
              </button>
              <button
                className="login-next-green-btn login-next-green-btn--login login-next-green-btn--login--finish"
                onClick={handleNext}
              >
                Next
              </button>
            </>
          )}
        </div>
        <div className="row mx-0 justify-content-center">
          {screenNum === totalScreen && (
            <>
              {/*<GrayButtonSmallFont text="Back" onClick={handlePrev} />*/}
              <button
                className="sign-up-goback-btn sign-up-goback-btn--finish"
                onClick={handlePrev}
              >
                <div className="sign-up-goback-btn-arrow"></div>
                <span>go Back</span>
              </button>
              <GreenButtonBigFont
                extraClassName="login-next-green-btn--login login-next-green-btn--login--finish"
                text="Finish"
                onClick={handleFinish}
              />
            </>
          )}
        </div>
      </div>
    );
  };

  const callBackLogin = () => {};

  const callBackGoogleSignup = (res, socialRespone) => {
    console.log(res);
    const { loginWorkspaceName } = values;

    if (res === 200) {
      if (process.env.NODE_ENV === "development") {
        dispatch(loginUser(socialRespone, history, callBackLogin));
      } else {
        //variables
        // var LastReportGenerated = "Jul 11 2013",
        var baseDomain = ".remote-teams.io";
        var expireAfter = new Date();

        //setting up  cookie expire date after a week
        expireAfter.setDate(expireAfter.getDate() + 7);

        //now setup cookie
        document.cookie =
          "socialLoginInfo=" +
          JSON.stringify(socialRespone) +
          "; domain=" +
          baseDomain +
          "; expires=" +
          expireAfter +
          "; path=/";

        window.location.href = `https://${loginWorkspaceName}.remote-teams.io/social-login`;
      }
    }
  };

  const responseGoogle = (response) => {
    console.log(response);
    console.log(values.loginWorkspaceName);
    console.log(values.selectedCountry);
    if (response.profileObj) {
      const formData = {
        organizationName: values.loginWorkspaceName,
        workspaceId: values.loginWorkspaceName,
        // billingType: values.planSelected,
        defaultUserEmailId: response.profileObj.email,
        defaultUserPassword: response.profileObj.googleId,
        defaultUserFirstName: response.profileObj.givenName,
        defaultUserLastName: response.profileObj.familyName,
        defaultUserCurrency: getAllInfoByISO(
          values.selectedCountry
        ).currency.toLowerCase(),
        features: ["call"],
      };
      let socialRespone = {
        email: response.profileObj.email,
        password: response.profileObj.googleId,
      };

      dispatch(
        googleSignUpAction(formData, socialRespone, callBackGoogleSignup)
      );
    }
  };

  const responseFacebook = (response) => {
    if (!isEmpty(response.email)) {
      let name = response.name.split(" ");
      const newUser = {
        organizationName: values.loginWorkspaceName,
        workspaceId: values.loginWorkspaceName,
        defaultUserEmailId: response.email,
        defaultUserPassword: response.userID,
        defaultUserFirstName: name[0],
        defaultUserLastName: name[1],
        defaultUserCurrency: getAllInfoByISO(
          values.selectedCountry
        ).currency.toLowerCase(),
        features: ["call"],
      };
      let socialRespone = {
        email: response.email,
        password: response.userID,
      };
      dispatch(
        googleSignUpAction(newUser, socialRespone, callBackGoogleSignup)
      );
    } else {
      alert("Please add mailId to your Facebook account");
    }
  };

  const renderSocialSignupButtons = () => {
    return (
      <Fragment>
        <h3 className="font-18-montserrat-gradient-text row mx-0 align-items-center w-100">
          <img
            src={require("../../../assets/img/auth/subtitle-img.png")}
            alt=""
            className="subtitle-icon-img"
          />
          <span>Create your account</span>
        </h3>
        <div className="text-center login-google-facebook-div">
          <GoogleSocial responseGoogle={responseGoogle} signup={true} />
          <FacebookSocial responseFacebook={responseFacebook} signup={true} />
          <h3 className="font-18-semiBold login-or-text"> Or</h3>{" "}
          <div className="row mx-0 justify-content-center">
            <button className="sign-up-goback-btn" onClick={handlePrev}>
              <div className="sign-up-goback-btn-arrow"></div>
              <span>go Back</span>
            </button>
            <button
              onClick={handleNext}
              className="login-next-green-btn login-next-green-btn--email-signup"
            >
              {" "}
              Sign Up Using Email
            </button>
          </div>
        </div>
      </Fragment>
    );
  };

  const { screenNum } = values;
  return (
    <>
      <div
        className={
          screenNum === totalScreen
            ? "login-form-container login-form-container--signup"
            : "login-form-container login-form-container--signup"
        }
      >
        <form noValidate autoComplete="off" onKeyDown={handleOnKeyDown}>
          {screenNum === 0 && (
            <div className="container-workspace-name mt-0">
              <div className="row mx-0 align-items-center">
                <img
                  src={require("../../../assets/img/auth/subtitle-img.png")}
                  alt=""
                  className="subtitle-icon-img"
                />
                <div>
                  <h3 className="font-18-montserrat-gradient-text row mx-0 align-items-center w-100">
                    <span>Create your own personal workspace!</span>
                  </h3>
                  <h5 className="signup-title-subtext">
                    A space for only you and your teams’s work to manage
                  </h5>
                </div>
              </div>
              <div className="signup-workspace-and-country-div">
                <InputFieldEmailTextPassword
                  containerClassName="container-login-flow-input container-login-flow-input--signup-workspace"
                  //label="Workspace Name"
                  name="loginWorkspaceName"
                  value={values.loginWorkspaceName}
                  onChange={handleChange}
                  type="text"
                  autoFocus={true}
                  error={errors.workspace}
                  placeholder="Workspace Name"
                />
                <div className="container-workspace-name container-workspace-name--country-select">
                  <div style={{ width: "100%" }}>
                    <ReactFlagsSelect
                      selected={values.selectedCountry}
                      onSelect={(code) =>
                        setValues({
                          ...values,
                          selectedCountry: code,
                        })
                      }
                      searchable
                    />
                  </div>
                </div>
              </div>{" "}
            </div>
          )}
          {screenNum === 1 && (
            <div className="container-workspace-name mt-0 ">
              <div style={{ width: "100%" }}>{renderSocialSignupButtons()}</div>
            </div>
          )}
          {screenNum === 2 && (
            <>
              <h3 className="font-18-montserrat-gradient-text row mx-0 align-items-center w-100">
                <img
                  src={require("../../../assets/img/auth/subtitle-img.png")}
                  alt=""
                  className="subtitle-icon-img"
                />
                <span>Create your account</span>
              </h3>
              <div className="container-workspace-name signup-personal-info-div mt-0">
                <div className="row mx-0 align-items-start mt-30">
                  <InputFieldEmailTextPassword
                    containerClassName="container-login-flow-input container-login-flow-input--signup-first-name mr-9"
                    //label="First Name"
                    placeholder="First Name"
                    name="fname"
                    value={values.fname}
                    onChange={handleChange}
                    type="text"
                    autoFocus={true}
                    error={!isEmpty(errors) && errors.fname}
                  />
                  {/*</div>
          )}
                {screenNum === 3 && (
                <div className="container-workspace-name">*/}
                  <InputFieldEmailTextPassword
                    containerClassName="container-login-flow-input container-login-flow-input--signup-first-name"
                    //label="Last Name"
                    placeholder="Last Name"
                    name="lname"
                    value={values.lname}
                    onChange={handleChange}
                    type="text"
                    //autoFocus={true}
                    error={!isEmpty(errors) && errors.lname}
                  />
                </div>
                {/*</div>
                 )}
{screenNum === 4 && (
            <div className="container-workspace-name">*/}
                <InputFieldEmailTextPassword
                  containerClassName="container-login-flow-input"
                  //label="Email Id"
                  placeholder="Email Id"
                  name="email"
                  value={values.email}
                  onChange={handleChange}
                  type="email"
                  //autoFocus={true}
                  error={!isEmpty(errors) && errors.email}
                />
                {/*            </div>
          )}
          {screenNum === 5 && (
          <div className="container-workspace-name container-workspace-name--password">*/}
                <InputFieldEmailTextPassword
                  containerClassName="container-login-flow-input"
                  //label="Password"
                  placeholder="Password"
                  name="password"
                  value={values.password}
                  onChange={handleChange}
                  type="password"
                  //autoFocus={true}
                  error={!isEmpty(errors) && errors.password}
                />
                <InputFieldEmailTextPassword
                  containerClassName="container-login-flow-input  mb-30"
                  //label="Confirm Password"
                  placeholder="Confirm Password"
                  name="confirmPassword"
                  value={values.confirmPassword}
                  onChange={handleChange}
                  type="password"
                  error={!isEmpty(errors) && errors.confirmPassword}
                />
              </div>
            </>
          )}
          {/* {screenNum === 6 && this.renderSelectPlan()} */}
        </form>

        {screenNum !== 1 && renderButtons()}
      </div>
    </>
  );
}

export default SignUpForm;

// import React, { Component } from "react";
// import { withRouter } from "react-router-dom";
// import InputFieldEmailTextPassword from "../common/InputFieldEmailTextPassword";
// import GreenButtonBigFont from "../common/GreenButtonBigFont";
// import GrayButtonSmallFont from "../common/GrayButtonSmallFont";
// import { connect } from "react-redux";
// import {
//   userSignUpAction,
//   getWorkspace,
// } from "./../../../store/actions/authAction";
// import isEmpty from "../../../store/validations/is-empty";
// import PlansContent from "../common/PlansContent";
// import Toast from "light-toast";
// import ReactFlagsSelect from "react-flags-select";
// import { getAllInfoByISO } from "iso-country-currency";

// const totalScreen = 5;

// class LoginForm extends Component {
//   constructor() {
//     super();
//     this.state = {
//       screenNum: 0,
//       redirect: false,
//       // signup form
//       workspaceName: "",
//       fname: "",
//       lname: "",
//       email: "",
//       password: "",
//       confirmPassword: "",
//       planSelected: "",
//       allPlans: {},
//       errors: {},
//       selectedCountry: "IN",
//     };
//   }
//   /*==================================================
//                   Lifecycle Methods
//   ====================================================*/
//   componentDidMount() {
//     if (!isEmpty(this.props.allPlans)) {
//       this.setState({
//         planSelected: this.props.allPlans[3].label,
//       });
//     }
//   }

//   static getDerivedStateFromProps(nextProps, nextState) {
//     if (
//       !isEmpty(nextProps.allPlans) &&
//       nextProps.allPlans !== nextState.allPlans
//     ) {
//       return {
//         allPlans: nextProps.allPlans,
//       };
//     }
//     return null;
//   }

//   /*============================================================
//         handlers
//   =============================================================*/

//   callback = (data) => {
//     console.log(data);
//     let error = {};

//     if (data.exist === true) {
//       error.workspace = "Workspace already exist";
//       this.setState({
//         errors: error,
//         workspaceExist: true,
//       });
//     } else {
//       this.setState({
//         errors: "",
//         workspaceExist: false,
//       });
//     }
//   };

//   handleChange = (e) => {
//     this.props.getWorkspace(e.target.value, this.callback);
//     this.setState({
//       [e.target.name]: e.target.value,
//       displayConfirmPassword: false,
//       errors: {},
//     });
//   };

//   handlePrev = () => {
//     this.setState({
//       screenNum: this.state.screenNum - 1,
//     });
//   };

//   handleNext = () => {
//     if (this.state.workspaceExist === false) {
//       this.setState({
//         screenNum: this.state.screenNum + 1,
//       });
//     } else if (
//       !isEmpty(this.state.workspaceName) &&
//       this.state.workspaceExist === true
//     ) {
//       Toast.info("Workspace already exist", 3000);
//     }
//   };

//   handleFinish = () => {
//     console.log(this.state);
//     const formData = {
//       organizationName: this.state.workspaceName,
//       workspaceId: this.state.workspaceName,
//       billingType: this.state.planSelected,
//       defaultUserEmailId: this.state.email,
//       defaultUserPassword: this.state.password,
//       defaultUserFirstName: this.state.fname,
//       defaultUserLastName: this.state.lname,
//       defaultUserCurrency: getAllInfoByISO(
//         this.state.selectedCountry
//       ).currency.toLowerCase(),
//       features: ["call"],
//     };

//     this.props.userSignUpAction(formData, this.props.history);
//     // this.setState({
//     //   redirect: true,
//     // });
//   };

//   handleOnKeyDown = (e) => {
//     if (e.keyCode === 13 && this.state.screenNum === 4) {
//       e.preventDefault();
//     } else if (e.keyCode === 13) {
//       e.preventDefault();
//       this.handleNext();
//     }
//   };

//   handleSelectPlan = (planData) => (e) => {
//     this.setState({
//       planSelected: planData.label,
//     });
//   };

//   /*============================================================
//         renderButtons
//   =============================================================*/
//   renderButtons = () => {
//     const { screenNum } = this.state;
//     return (
//       <div className="signup-buttons-div">
//         <div className="text-right signup-buttons-div__button-block1">
//           {screenNum === 0 && (
//             <>
//               <GreenButtonBigFont
//                 extraClassName="login-next-green-btn--signup"
//                 text="Next"
//                 onClick={this.handleNext}
//               />
//             </>
//           )}
//         </div>
//         <div className="row mx-0 justify-content-between signup-buttons-div__button-block2">
//           {screenNum > 0 && screenNum < totalScreen && (
//             <>
//               <GrayButtonSmallFont text="Back" onClick={this.handlePrev} />
//               <button
//                 className="login-next-green-btn login-next-green-btn--login"
//                 onClick={this.handleNext}
//               >
//                 Next
//               </button>
//             </>
//           )}
//         </div>
//         <div className="row mx-0 justify-content-between signup-buttons-div__button-block2">
//           {screenNum === totalScreen && (
//             <>
//               <GrayButtonSmallFont text="Back" onClick={this.handlePrev} />
//               <GreenButtonBigFont
//                 extraClassName="login-next-green-btn--login"
//                 text="Finish"
//                 onClick={this.handleFinish}
//               />
//             </>
//           )}
//         </div>
//       </div>
//     );
//   };

//   /*============================================================
//         renderSelectPlan
//   =============================================================*/
//   renderSelectPlan = () => {
//     let { planSelected, allPlans } = this.state;
//     return (
//       <div className="select-plans-container">
//         <div className="container-login-flow-input mb-0">
//           <label className="mb-0">Select Plan</label>
//         </div>
//         <div className="row mx-0 select-plans-div">
//           {!isEmpty(allPlans) &&
//             allPlans.map((planData, index) => (
//               <div
//                 key={index}
//                 className={
//                   planSelected === planData.label
//                     ? "select-plans-div__block select-plans-div__block--active"
//                     : "select-plans-div__block"
//                 }
//                 onClick={this.handleSelectPlan(planData)}
//               >
//                 {planData.label === "ASTRONAUT" && (
//                   <PlansContent
//                     img={require("../../../assets/img/plans/plans-astronaut.svg")}
//                     containerClassName={"profile-plans-row--astroSignup"}
//                     price={planData.monthlyPrice}
//                     plan={planData.label}
//                     users={planData.maxUsers}
//                   />
//                 )}
//                 {planData.label === "ROVER" && (
//                   <PlansContent
//                     img={require("../../../assets/img/plans/plans-rover.svg")}
//                     containerClassName={
//                       "profile-plans-row--astroSignup profile-plans-row--astroSignup--rover"
//                     }
//                     price={planData.monthlyPrice}
//                     plan={planData.label}
//                     users={planData.maxUsers}
//                   />
//                 )}
//                 {planData.label === "SPACESHIP" && (
//                   <PlansContent
//                     img={require("../../../assets/img/plans/plans-spaceship.svg")}
//                     containerClassName={"profile-plans-row--astroSignup"}
//                     price={planData.monthlyPrice}
//                     plan={planData.label}
//                     users={planData.maxUsers}
//                   />
//                 )}

//                 {planData.label === "SPACESTATION" && (
//                   <PlansContent
//                     img={require("../../../assets/img/plans/plans-space-colony.svg")}
//                     containerClassName={"profile-plans-row--astroSignup"}
//                     price={planData.monthlyPrice}
//                     plan={planData.label}
//                     users={planData.maxUsers}
//                   />
//                 )}
//               </div>
//             ))}
//         </div>
//       </div>
//     );
//   };

//   /*============================================================
//         main
//   =============================================================*/
//   render() {
//     const { screenNum, errors } = this.state;
//     return (
//       <>
//         <div
//           className={
//             screenNum === totalScreen
//               ? "login-form-container"
//               : "login-form-container"
//           }
//         >
//           <form noValidate autoComplete="off" onKeyDown={this.handleOnKeyDown}>
//             {screenNum === 0 && (
//               <div className="container-workspace-name">
//                 <InputFieldEmailTextPassword
//                   containerClassName="container-login-flow-input"
//                   //label="Workspace Name"
//                   name="workspaceName"
//                   value={this.state.workspaceName}
//                   onChange={this.handleChange}
//                   type="text"
//                   autoFocus={true}
//                   error={errors.workspace}
//                   placeholder="Workspace Name"
//                 />
//               </div>
//             )}
//             {screenNum === 1 && (
//               <div className="container-workspace-name">
//                 <div style={{ width: "100%" }}>
//                   <ReactFlagsSelect
//                     selected={this.state.selectedCountry}
//                     onSelect={(code) =>
//                       this.setState({
//                         selectedCountry: code,
//                       })
//                     }
//                     searchable
//                   />
//                 </div>
//               </div>
//             )}
//             {screenNum === 2 && (
//               <div className="container-workspace-name">
//                 <InputFieldEmailTextPassword
//                   containerClassName="container-login-flow-input"
//                   //label="First Name"
//                   placeholder="First Name"
//                   name="fname"
//                   value={this.state.fname}
//                   onChange={this.handleChange}
//                   type="text"
//                   autoFocus={true}
//                 />
//               </div>
//             )}
//             {screenNum === 3 && (
//               <div className="container-workspace-name">
//                 <InputFieldEmailTextPassword
//                   containerClassName="container-login-flow-input"
//                   //label="Last Name"
//                   placeholder="Last Name"
//                   name="lname"
//                   value={this.state.lname}
//                   onChange={this.handleChange}
//                   type="text"
//                   autoFocus={true}
//                 />
//               </div>
//             )}
//             {screenNum === 4 && (
//               <div className="container-workspace-name">
//                 <InputFieldEmailTextPassword
//                   containerClassName="container-login-flow-input"
//                   //label="Email Id"
//                   placeholder="Email Id"
//                   name="email"
//                   value={this.state.email}
//                   onChange={this.handleChange}
//                   type="email"
//                   autoFocus={true}
//                 />
//               </div>
//             )}
//             {screenNum === 5 && (
//               <div className="container-workspace-name container-workspace-name--password">
//                 <InputFieldEmailTextPassword
//                   containerClassName="container-login-flow-input"
//                   //label="Password"
//                   placeholder="Password"
//                   name="password"
//                   value={this.state.password}
//                   onChange={this.handleChange}
//                   type="password"
//                   autoFocus={true}
//                 />
//                 <InputFieldEmailTextPassword
//                   containerClassName="container-login-flow-input"
//                   //label="Confirm Password"
//                   placeholder="Confirm Password"
//                   name="confirmPassword"
//                   value={this.state.confirmPassword}
//                   onChange={this.handleChange}
//                   type="password"
//                 />
//               </div>
//             )}
//             {screenNum === 6 && this.renderSelectPlan()}
//           </form>

//           {this.renderButtons()}
//         </div>
//       </>
//     );
//   }
// }

// const mapStateToProps = (state) => ({
//   allPlans: state.auth.plans.plans,
// });

// export default connect(mapStateToProps, {
//   userSignUpAction,
//   getWorkspace,
// })(withRouter(LoginForm));
