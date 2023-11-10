import React, { useState, useRef } from "react";
import { Redirect } from "react-router-dom";
import InputFieldEmailTextPassword from "../common/InputFieldEmailTextPassword";
import GreenButtonBigFont from "../common/GreenButtonBigFont";
import {
  getWorkspace,
  checkWorkspaceAndEmailConnectedOrNot,
  loginUser,
} from "./../../../store/actions/authAction";
import isEmpty from "../../../store/validations/is-empty";
import Toast from "light-toast";
import { useDispatch, useSelector } from "react-redux";
import debounce from "lodash.debounce";
import { useHistory } from "react-router-dom";
import GoogleSocial from "./GoggleSocial";
import FacebookSocial from "./FacebookSocial";
import store from "./../../../store/store";
import { SET_LOADER, CLEAR_LOADER } from "./../../../store/types";
import { validateWorkspace } from "./../../../store/validations/authValidation/workspaceValidation";

function LoginForm() {
  const history = useHistory();
  const dispatch = useDispatch();
  const [values, setValues] = useState({
    redirect: false,
    // login form
    loginWorkspaceName: "",
    // errors: {},
    workspaceExist: "",
    displayWorkspaceField: true,
  });

  const [errors, setErrors] = useState({});
  const [workspaceExist, setWorkspaceExist] = useState("");

  /*============================================================
        handlers
  =============================================================*/
  const callback = (data) => {
    console.log(data);
    let error = {};

    if (data.exist === false) {
      error.workspace = "Workspace not exist";
      // setValues({
      //   ...values,
      //   // errors: error,
      //   // workspaceExist: false,
      // });
      setWorkspaceExist(false);
      setErrors(error);
    } else {
      // setValues({
      //   ...values,
      //   // errors: "",
      //   workspaceExist: true,
      // });
      setWorkspaceExist(true);
      setErrors({});
    }
  };

  // debounce start
  const debouncedSave = useRef(
    debounce((nextValue) => dispatch(getWorkspace(nextValue, callback)), 1000)
    // will be created only once initially
  ).current;
  // debounce end

  const handleChange = (e) => {
    setValues({
      ...values,
      [e.target.name]: e.target.value,
      // errors: {},
    });
    setErrors({});
    if (e.target.name === "loginWorkspaceName") {
      const { value: nextValue } = e.target;
      debouncedSave(nextValue);
    }
  };

  const handleNext = (e) => {
    e.preventDefault();
    // console.log(this.state);
    const { loginWorkspaceName } = values;

    const { errors, isValid } = validateWorkspace(values);

    if (!isValid) {
      // console.log(errors);
      setErrors(errors);
    } else {
      if (workspaceExist === false) {
        Toast.info("Workspace not exist", 3000);
      } else {
        // window.location.href = `https://${loginWorkspaceName}.remote-teams.io`;
        setValues({
          ...values,
          displayWorkspaceField: false,
        });
        store.dispatch({
          type: SET_LOADER,
        });
        setTimeout(function() {
          store.dispatch({
            type: CLEAR_LOADER,
          });
        }, 1500);
      }
      // if (workspaceExist === false) {
      //   Toast.info("Workspace not exist", 3000);
      // } else {
      //   // window.location.href = `https://${loginWorkspaceName}.remote-teams.io`;
      //   setValues({
      //     ...values,
      //     displayWorkspaceField: false,
      //   });
      //   store.dispatch({
      //     type: SET_LOADER,
      //   });
      //   setTimeout(function() {
      //     store.dispatch({
      //       type: CLEAR_LOADER,
      //     });
      //   }, 1500);
      // }
    }

    // if (process.env.NODE_ENV === "development") {
    //   if (workspaceExist === false) {
    //     Toast.info("Workspace not exist", 3000);
    //   } else {
    //     // window.location.href = `https://${loginWorkspaceName}.remote-teams.io`;
    //     store.dispatch({
    //       type: SET_LOADER,
    //     });
    //     setTimeout(function() {
    //       store.dispatch({
    //         type: CLEAR_LOADER,
    //       });
    //     }, 1500);
    //     setValues({
    //       ...values,
    //       displayWorkspaceField: false,
    //     });
    //   }
    // } else {
    // if (workspaceExist === false) {
    //   Toast.info("Workspace not exist", 3000);
    // } else {
    //   // window.location.href = `https://${loginWorkspaceName}.remote-teams.io`;
    //   setValues({
    //     ...values,
    //     displayWorkspaceField: false,
    //   });
    //   store.dispatch({
    //     type: SET_LOADER,
    //   });
    //   setTimeout(function() {
    //     store.dispatch({
    //       type: CLEAR_LOADER,
    //     });
    //   }, 1500);
    // }
    // }
  };

  const handleOnKeyDown = (e) => {
    if (e.keyCode === 13) {
      e.preventDefault();
    }
    if (e.keyCode === 13 && isEmpty(values.errors.workspace)) {
      e.preventDefault();
      setValues({
        ...values,
        redirect: true,
      });
    }
  };

  /*=============================
      Render Login Form Fields
  ===============================*/

  const redirectHandler = (e) => {
    const { loginWorkspaceName } = values;
    if (process.env.NODE_ENV === "development") {
      history.push("/login");
    } else {
      window.location.href = `https://${loginWorkspaceName}.remote-teams.io/login`;
    }
  };

  const callBackCheckWorkspace = (res, socialRespone) => {
    console.log(res);
    const { loginWorkspaceName } = values;
    if (res === true) {
      if (process.env.NODE_ENV === "development") {
        dispatch(loginUser(socialRespone, history));
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
    } else if (res === false) {
      store.dispatch({
        type: CLEAR_LOADER,
      });
      alert("Email is not exist for this workspace");
      setValues({
        ...values,
        displayWorkspaceField: true,
      });
    }
  };

  const responseGoogle = (response) => {
    const { loginWorkspaceName } = values;
    // console.log(response.profileObj);
    console.log(response);
    if (!isEmpty(response.profileObj)) {
      const checkFormData = {
        workspaceId: values.loginWorkspaceName,
        email: response.profileObj.email,
      };
      let socialRespone = {
        email: response.profileObj.email,
        password: response.profileObj.googleId,
      };
      dispatch(
        checkWorkspaceAndEmailConnectedOrNot(
          checkFormData,
          socialRespone,
          callBackCheckWorkspace
        )
      );

      // console.log("set cookies and redirect ", workspaceName);
    }
    // console.log(response.profileObj);
    // setgoogleResponse(response.profileObj);
  };

  const responseFacebook = (response) => {
    console.log(response);
    if (!isEmpty(response.email)) {
      const checkFormData = {
        workspaceId: values.loginWorkspaceName,
        email: response.email,
      };
      let socialRespone = {
        email: response.email,
        password: response.userID,
      };
      dispatch(
        checkWorkspaceAndEmailConnectedOrNot(
          checkFormData,
          socialRespone,
          callBackCheckWorkspace
        )
      );
    } else {
      alert("Please add mailId to your facebook account");
    }
  };

  const renderWorkSpace = () => {
    return (
      <div className="login-form-container login-form-container--workspace">
        <h3 className="font-18-montserrat-gradient-text row mx-0 align-items-center w-100">
          <img
            src={require("../../../assets/img/auth/subtitle-img.png")}
            alt=""
            className="subtitle-icon-img"
          />
          <span>Enter your workspace name</span>
        </h3>
        <form noValidate autoComplete="off" onKeyDown={handleOnKeyDown}>
          <div className="container-workspace-name mt-0">
            <InputFieldEmailTextPassword
              containerClassName="container-login-flow-input container-login-flow-input--login-workspace"
              //label="Workspace Name"
              name="loginWorkspaceName"
              value={values.loginWorkspaceName}
              onChange={handleChange}
              type="text"
              autoFocus={true}
              error={errors.workspace}
              placeholder="Workspace Name"
            />
            <div className="text-right login-form-next-btn-div">
              {/*<GreenButtonBigFont text="Next" onClick={this.handleNext} />*/}
              <button
                className="login-next-green-btn login-next-green-btn--login"
                onClick={handleNext}
              >
                Next
              </button>
            </div>
          </div>
        </form>
      </div>
    );
  };

  const renderNextFields = () => {
    return (
      <div className="login-form-container login-form-container--google">
        <h3 className="font-18-montserrat-gradient-text row mx-0 align-items-center w-100">
          <img
            src={require("../../../assets/img/auth/subtitle-img.png")}
            alt=""
            className="subtitle-icon-img"
          />
          <span>Hi! welcome back</span>
        </h3>
        <div className="text-center login-google-facebook-div">
          <GoogleSocial responseGoogle={responseGoogle} />
          <FacebookSocial responseFacebook={responseFacebook} />
          <h3 className="font-18-semiBold login-or-text"> Or</h3>
          <div className="text-center">
            <button
              onClick={redirectHandler}
              className="login-next-green-btn login-next-green-btn--login"
            >
              {" "}
              {/*Sign in Using Email*/}Continue with email
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      {values.redirect && <Redirect to="/login" />}
      {values.displayWorkspaceField ? renderWorkSpace() : renderNextFields()}
    </>
  );
}

export default LoginForm;

// import React, { Component } from "react";
// import { Redirect } from "react-router-dom";
// import InputFieldEmailTextPassword from "../common/InputFieldEmailTextPassword";
// import GreenButtonBigFont from "../common/GreenButtonBigFont";
// import { getWorkspace } from "./../../../store/actions/authAction";
// import { connect } from "react-redux";
// import isEmpty from "../../../store/validations/is-empty";
// import Toast from "light-toast";

// class LoginForm extends Component {
//   constructor() {
//     super();
//     this.state = {
//       redirect: false,
//       // login form
//       loginWorkspaceName: "",
//       errors: {},
//       workspaceExist: "",
//     };
//   }

//   /*============================================================
//         handlers
//   =============================================================*/
//   callback = (data) => {
//     console.log(data);
//     let error = {};

//     if (data.exist === false) {
//       error.workspace = "Workspace not exist";
//       this.setState({
//         errors: error,
//         workspaceExist: false,
//       });
//     } else {
//       this.setState({
//         errors: "",
//         workspaceExist: true,
//       });
//     }
//   };

//   handleChange = (e) => {
//     this.props.getWorkspace(e.target.value, this.callback);
//     this.setState({
//       [e.target.name]: e.target.value,
//       errors: {},
//     });
//   };

//   handleNext = (e) => {
//     e.preventDefault();
//     console.log(this.state);
//     const { loginWorkspaceName } = this.state;
//     if (process.env.NODE_ENV === "development") {
//       this.setState({
//         redirect: true,
//       });
//     } else {
//       if (this.state.workspaceExist === false) {
//         Toast.info("Workspace not exist", 3000);
//       } else {
//         window.location.href = `https://${loginWorkspaceName}.remote-teams.io`;
//       }
//     }
//   };

//   handleOnKeyDown = (e) => {
//     if (e.keyCode === 13) {
//       e.preventDefault();
//     }
//     if (e.keyCode === 13 && isEmpty(this.state.errors.workspace)) {
//       e.preventDefault();
//       this.setState({
//         redirect: true,
//       });
//     }
//   };

//   /*============================================================
//         main
//   =============================================================*/
//   render() {
//     const { errors, redirect } = this.state;
//     return (
//       <>
//         {this.state.redirect && <Redirect to="/login" />}
//         <div className="login-form-container">
//           <form noValidate autoComplete="off" onKeyDown={this.handleOnKeyDown}>
//             <div className="container-workspace-name">
//               <InputFieldEmailTextPassword
//                 containerClassName="container-login-flow-input"
//                 //label="Workspace Name"
//                 name="loginWorkspaceName"
//                 value={this.state.loginWorkspaceName}
//                 onChange={this.handleChange}
//                 type="text"
//                 autoFocus={true}
//                 error={errors.workspace}
//                 placeholder="Workspace Name"
//               />
//               <div className="text-right login-form-next-btn-div">
//                 {/*<GreenButtonBigFont text="Next" onClick={this.handleNext} />*/}
//                 <button
//                   className="login-next-green-btn login-next-green-btn--login"
//                   onClick={this.handleNext}
//                 >
//                   Next
//                 </button>
//               </div>
//             </div>
//           </form>
//         </div>
//       </>
//     );
//   }
// }

// export default connect(null, { getWorkspace })(LoginForm);
