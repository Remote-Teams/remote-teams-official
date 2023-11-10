import axios from "axios";
import { url, workspaceId } from "./config";
import {
  SET_SIGNUP_USER_INFO,
  GET_PLANS,
  SET_ERRORS,
  SET_LOGIN,
  LOGOUT_USER,
  SET_COMPANY_DAYS_OFF,
  SET_COMPANY_WORKING_HOURS,
  SET_MEMBER_DAYS_OFF,
  SET_USER_ROLE,
  SET_ORGANIZATION_DATA,
  SET_LOADER,
  CLEAR_LOADER,
  GET_INVITE_LINK_USERS,
} from "./../types";
import { getStripeCustomerObject } from "./../actions/paymentAction";
import { getAllResourceAction } from "./../actions/resourcesAction";
import setAuthToken from "./../utils/setAuthToken";
import Toast from "light-toast";

/********************************************
 * @DESC - IMAGE UPLOADER - PROPOSAL
 ********************************************/
export const normalImageUpload = async (formData) => {
  try {
    const headers = { "Content-Type": "multipart/form-data" };
    let { data } = await axios.post(`${url}/api/upload`, formData, {
      headers: headers,
    });
    if (data) {
      return { success: true, imageResponse: data };
    }
  } catch (err) {
    return { success: false, imageResponse: err };
  }
};

/*=============================
       SignUp User 
===============================*/
export const userSignUpAction = (formData, history) => async (dispatch) => {
  try {
    let { data } = await axios.post(`${url}/public/signup`, formData);
    if (data) {
      localStorage.setItem("signupUserInfo", JSON.stringify({ data }));
      dispatch({
        type: SET_SIGNUP_USER_INFO,
        payload: data,
      });
      Toast.info("Signup Successfull", 3000);
      history.push("/congratulations");
    }
  } catch (err) {
    console.log(err);
  }
};

/*===================================
          Get Plans Action
=====================================*/

export const getPlansAction = (formData) => async (dispatch) => {
  try {
    let { data } = await axios.post(`${url}/public/featureplans`, formData);
    if (data) {
      // let filteredPlan = data.filter((plan) => plan.name !== "Free Forever");
      let finalData = [
        {
          priceId: "",
          currency: "inr",
          name: "FREE_PLAN",
          amount: "Free",
        },
      ];

      data.forEach((plan) => {
        finalData.push(plan);
      });

      dispatch({
        type: GET_PLANS,
        payload: finalData,
      });
    }
  } catch (err) {
    console.log(err);
  }
};

/*=============================
  Check Workspace exists or not
===============================*/

export const getWorkspace = (workspaceId, callback) => async (dispatch) => {
  try {
    let { data } = await axios.get(
      `${url}/public/workspace/exist?workspaceId=${workspaceId}`
    );
    if (data) {
      callback(data);
      dispatch({
        type: SET_ERRORS,
        payload: data,
      });
    }
  } catch (err) {
    console.log(err);
  }
};

/*==================================
        Login User Action
====================================*/

export const loginUser = (formData, history, callBackLogin) => async (
  dispatch
) => {
  const headers = {
    "Content-Type": "application/json",
    workspaceId: workspaceId,
  };

  try {
    let { data, status } = await axios.post(`${url}/public/login`, formData, {
      headers: headers,
    });
    if (data) {
      // checking if user is admin or superadmin
      if (data.role.name === "SuperAdmin") {
        // Save token to localstorage
        const { token } = data;
        localStorage.setItem("UserData", JSON.stringify(data));

        // localStorage.setItem("isUserLoggedIn", true);
        dispatch({ type: SET_LOGIN, payload: data });
        // Set token to auth header
        setAuthToken(token);
        dispatch(history.push("/organization"));
      } else {
        // Save token to localstorage
        const { token } = data;
        localStorage.setItem("UserData", JSON.stringify(data));
        // localStorage.setItem("isUserLoggedIn", true);
        dispatch({ type: SET_LOGIN, payload: data });
        // Set token to auth header
        setAuthToken(token);
        await dispatch(getOrganizationData());
        Toast.info("Login Sucessfull", 3000);
        if (data.demo) {
          history.push("/welcome-user");
        } else {
          if (process.env.NODE_ENV === "development") {
            window.location.href = "http://localhost:3000/dashboard";
          } else {
            window.location.href = `https://${workspaceId}.remote-teams.io/dashboard`;
          }
        }
      }
    }
  } catch (err) {
    console.log(err);
    callBackLogin(err);
    dispatch({
      type: SET_ERRORS,
      payload: err.response,
    });
  }
};

/*===========================
    SignUp User 
=============================*/

export const googleSignUpAction = (
  formData,
  socialRespone,
  callBackGoogleSignup
) => async (dispatch) => {
  dispatch({
    type: SET_LOADER,
  });
  axios
    .post(`${url}/public/signup`, formData)
    .then((res) => {
      Toast.info("Signup Successfull", 3000);
      callBackGoogleSignup(res.status, socialRespone);
      // history.push({
      //   pathname: "/success-msg",
      //   state: { signupInfo: res.data },
      // });
    })
    .catch(
      (err) =>
        dispatch({
          type: CLEAR_LOADER,
          payload: false,
        })
      // dispatch({
      //   type: SET_ERRORS,
      //   payload: err.response.data,
      // })
    );
};

/*==================================
            Logout Action
====================================*/

export const logoutUser = (history) => (dispatch) => {
  // try {

  Toast.info("Logout Sucessfull", 3000);
  //remove cookie

  //variables
  var LastReportGenerated = "Jul 11 2013",
    baseDomain = ".remote-teams.io",
    expireAfter = new Date();

  //setting up  cookie expire date after a week
  expireAfter.setDate(expireAfter.getDate() + 7);

  //now setup cookie
  document.cookie =
    "socialLoginInfo=" +
    "" +
    "; domain=" +
    baseDomain +
    "; expires=" +
    expireAfter +
    "; path=/";
  //remove token from localstorage
  localStorage.clear();
  // localStorage.clear();
  dispatch({
    type: LOGOUT_USER,
  });

  //remove token from header
  setAuthToken(false);
  if (process.env.NODE_ENV === "development") {
    // history.push("/login");
    // window.location.href = "https://login.dominate.ai";
  } else {
    // history.push("/login");
    // window.location.href = "https://login.remote-teams.io/";
  }
  // } catch (err) {
  //   console.log(err);
  // }
};

/*=====================================
    Get Organization data
======================================*/
export const getOrganizationData = () => async (dispatch) => {
  try {
    let { data } = await axios.get(`${url}/api/organizations/${workspaceId}`);
    if (data) {
      await dispatch(getStripeCustomerObject(data.customerId));
      await dispatch(
        setFeaturesArray({
          plan:
            data.planName === "FREE"
              ? "Free-Plan"
              : data.planName === "ARK"
              ? "Ark"
              : "Metaverse",
        })
      );
      localStorage.setItem("OrganizationData", JSON.stringify(data));

      dispatch({
        type: SET_ORGANIZATION_DATA,
        payload: data,
      });
    }
  } catch (err) {
    console.log(err);
  }
};

/*=====================================
          SET FEATURES ARRAY
======================================*/
export const setFeaturesArray = (formData) => async (dispatch) => {
  try {
    let { data } = await axios.post(`${url}/public/paidFeatures`, formData);
    if (data) {
      localStorage.setItem("UserFeatures", JSON.stringify(data.features));
    }
  } catch (err) {
    console.log(err);
  }
};

/*=========================================================
          FIND FEATURE FROM WHICH PLAN ITS BELONGS TO
===========================================================*/
export const findFeature = (formData) => async (dispatch) => {
  try {
    let { data } = await axios.post(`${url}/public/findFeature`, formData);
    if (data) {
      console.log(data);
    }
  } catch (err) {
    console.log(err);
  }
};

/*========================================
      Update Organization data
=========================================*/
export const updateOrganizationData = (
  organizationId,
  formData,
  callBack
) => async (dispatch) => {
  try {
    let { data, status } = await axios.put(
      `${url}/api/organizations/${organizationId}`,
      formData
    );
    if (data) {
      Toast.info("Company set", 3000);
      callBack(status);
      console.log(data);
    }
  } catch (err) {
    console.log(err);
  }
};

/*============================================
            Get Company Days Off
==============================================*/
export const getCompanyDaysOff = () => async (dispatch) => {
  const headers = {
    "Content-Type": "application/json",
    workspaceId: workspaceId,
  };
  try {
    let { data } = await axios.post(`${url}/api/leaves/search`, {
      headers: headers,
    });
    if (data) {
      let holidays = data.filter((leave) => leave.leaveType === "HOLIDAY");

      dispatch({
        type: SET_COMPANY_DAYS_OFF,
        payload: holidays,
      });
    }
  } catch (err) {
    console.log(err);
  }
};

/*=================================================
       Add Company Days off
==================================================*/
export const addCompanyDaysOff = (formData, callBackAdd) => async (
  dispatch
) => {
  const headers = {
    "Content-Type": "application/json",
    workspaceId: workspaceId,
  };
  try {
    let { data, status } = await axios.post(
      `${url}/api/leaves/holiday`,
      formData,
      {
        headers: headers,
      }
    );
    if (data) {
      Toast.info("Company day offs added", 3000);
      callBackAdd(status);
      dispatch(getCompanyDaysOff());
    }
  } catch (err) {
    console.log(err);
  }
};

/*===================================================
          Get All Company Working Hours 
====================================================*/
export const getCompanyWorkingHours = () => async (dispatch) => {
  const headers = {
    "Content-Type": "application/json",
    workspaceId: workspaceId,
  };
  try {
    let { data } = await axios.get(
      `${url}/api/workinghours?pageNo=1&pageSize=10`,
      {
        headers: headers,
      }
    );
    if (data) {
      dispatch({
        type: SET_COMPANY_WORKING_HOURS,
        payload: data,
      });
    }
  } catch (err) {
    console.log(err);
  }
};

/*=================================================
          Add Comapny Working Hours
===================================================*/
export const addCompanyWorkingHours = (
  formData,
  alertText,
  callblackAdd
) => async (dispatch) => {
  const headers = {
    "Content-Type": "application/json",
    workspaceId: workspaceId,
  };
  try {
    let { data, status } = await axios.post(
      `${url}/api/workinghours`,
      formData,
      {
        headers: headers,
      }
    );
    if (data) {
      if (alertText) {
        Toast.info(`${alertText}`, 3000);
      }
      callblackAdd(status);
      dispatch(getCompanyWorkingHours());
    }
  } catch (err) {
    console.log(err);
  }
};

/*================================================
          Update Working Hours
==================================================*/
export const updateCompanyWorkingHours = (organizationId, formData) => async (
  dispatch
) => {
  const headers = {
    "Content-Type": "application/json",
    workspaceId: workspaceId,
  };
  try {
    let { data } = await axios.put(
      `${url}/api/workinghours/${organizationId}`,
      formData,
      {
        headers: headers,
      }
    );
    if (data) {
      Toast.info("Working hours updated", 3000);
      dispatch(getCompanyWorkingHours());
    }
  } catch (err) {
    console.log(err);
  }
};

/*=======================================
        Get all member days off
========================================*/
export const getAllMemberDaysOfF = () => async (dispatch) => {
  const headers = {
    "Content-Type": "application/json",
    workspaceId: workspaceId,
  };
  try {
    let { data } = await axios.get(
      `${url}/api/memberdayoffs?pageNo=1&pageSize=10`,
      {
        headers: headers,
      }
    );
    if (data) {
      dispatch({
        type: SET_MEMBER_DAYS_OFF,
        payload: data,
      });
    }
  } catch (err) {
    console.log(err);
  }
};

/*========================================
    Create Member Days Off in bulk
==========================================*/
export const createMemberDaysoff = (formData) => async (dispatch) => {
  const headers = {
    "Content-Type": "application/json",
    workspaceId: workspaceId,
  };
  try {
    let { data } = await axios.post(`${url}/api/memberdayoffs/bulk`, formData, {
      headers: headers,
    });
    if (data) {
      Toast.info("Member day offs added", 3000);
      dispatch(getAllMemberDaysOfF());
    }
  } catch (err) {
    console.log(err);
  }
};

/*================================================
                  Get All Roles
==================================================*/
export const getAllUserRoles = () => async (dispatch) => {
  const headers = {
    "Content-Type": "application/json",
    workspaceId: workspaceId,
  };
  try {
    let { data } = await axios.get(`${url}/api/roles`, { headers: headers });
    if (data) {
      dispatch({
        type: SET_USER_ROLE,
        payload: data,
      });
    }
  } catch (err) {
    console.log(err);
  }
};

/*==================================================
          User Forget password Email link
====================================================*/
export const sendForgetPasswordLink = (userEmail, callBack) => async (
  dispatch
) => {
  const headers = {
    "Content-Type": "application/json",
    workspaceId: workspaceId,
  };
  try {
    let { data, status } = await axios.get(
      `${url}/public/forgotPassword?email=${userEmail}`,
      {
        headers: headers,
      }
    );
    if (status) {
      Toast.info("Link sent", 3000);
      callBack(status);
    }
  } catch (err) {
    console.log(err);
  }
};

/*====================================================
    Verify Employee Action
======================================================*/

export const verifyUserAction = (authCode, callBack) => async (dispatch) => {
  const headers = {
    "Content-Type": "application/json",
    workspaceId: workspaceId,
  };
  try {
    let { data } = await axios.get(
      `${url}/public/authCode/verify?authCode=${authCode}`,
      {
        headers: headers,
      }
    );
    if (data) {
      callBack(data);
    }
  } catch (err) {
    console.log(err);
  }
};

/*================================
  User Reset password Action
================================*/
export const userPasswordResetAction = (
  formData,
  authCode,
  history
  // errorHandler
) => async (dispatch) => {
  const headers = {
    "Content-Type": "application/json",
    workspaceId: workspaceId,
  };
  try {
    let { data } = await axios.patch(
      `${url}/public/users?authCode=${authCode}`,
      formData,
      {
        headers: headers,
      }
    );
    if (data) {
      dispatch(loginUser(formData, history));
    }
  } catch (err) {
    // errorHandler(err.response.data);
  }
};

/*==========================================
      Update user demo overview flag
===========================================*/

export const updateUserDemoWalkthroughFlag = (
  userId,
  formData,
  callBackUpdateWalkthrough
) => async (dispatch) => {
  try {
    let { data, status } = await axios.put(
      `${url}/api/users/${userId}`,
      formData
    );
    if (data) {
      let previousData = localStorage.getItem("UserData");
      previousData = JSON.parse(previousData);
      previousData.demo = false;
      const resData = data;
      Object.keys(previousData).forEach((key) => {
        Object.keys(resData).forEach((rkey) => {
          if (rkey === key && key !== "role") {
            previousData[key] = resData[rkey];
          }
        });
      });
      // localStorage.clear();
      localStorage.removeItem("UserData");
      localStorage.setItem("UserData", JSON.stringify(previousData));
      dispatch({ type: SET_LOGIN, payload: previousData });
      callBackUpdateWalkthrough(status);
    }
  } catch (err) {
    console.log(err);
  }
};

/*=======================================
            Update Usesr
========================================*/
export const updateUser = (userId, formData) => (dispatch) => {
  axios
    .put(`${url}/api/users/${userId}`, formData)
    .then((res) => {
      Toast.info("Profile updated", 3000);
      let previousData = localStorage.getItem("UserData");
      previousData = JSON.parse(previousData);
      previousData.firstName = res.data.firstname;
      previousData.lastName = res.data.lastName;
      const resData = res.data;
      Object.keys(previousData).forEach((key) => {
        Object.keys(resData).forEach((rkey) => {
          if (rkey === key && key !== "role") {
            previousData[key] = resData[rkey];
          }
        });
      });
      // localStorage.clear();
      localStorage.removeItem("UserData");
      localStorage.setItem("UserData", JSON.stringify(previousData));
      dispatch({ type: SET_LOGIN, payload: previousData });
    })
    .catch((err) => console.log(err));
};

/*===================================================
      Check Workspace and email connected or not
====================================================*/

export const checkWorkspaceAndEmailConnectedOrNot = (
  checkFormData,
  socialRespone,
  callBackCheckWorkspace
) => (dispatch) => {
  dispatch({
    type: SET_LOADER,
  });
  axios
    .post(`${url}/public/organizations/checkWorkspaceUser`, checkFormData)
    .then(
      (res) => callBackCheckWorkspace(res.data, socialRespone)
      // console.log(res.data)
    )
    .catch((err) =>
      dispatch({
        type: CLEAR_LOADER,
        payload: false,
      })
    );
};

export const createNewProjectFromWelcomeScreen = (formData, history) => async (
  dispatch
) => {
  const headers = {
    "Content-Type": "application/json",
    workspaceId: workspaceId,
  };
  try {
    let { data, status } = await axios.post(`${url}/api/projects`, formData, {
      headers: headers,
    });
    if (data) {
      Toast.info("Project Created", 3000);
      localStorage.setItem("activeProjectDetailTabIndex", 1);
      localStorage.setItem("projectData", JSON.stringify(data));
      history.push({
        pathname: "/all-projects-detail",
        state: {
          projectData: data,
        },
      });
    }
  } catch (err) {
    console.log(err);
  }
};

/*===================================================
        Update Organization Address And Logo
====================================================*/

export const updateOrganizationAddress = (organizationId, formData) => (
  dispatch
) => {
  axios
    .patch(`${url}/api/organizations/user/${organizationId}`, formData)
    .then((res) => {
      Toast.info("Organization updated", 3000);
      localStorage.removeItem("OrganizationData");
      localStorage.setItem("OrganizationData", JSON.stringify(res.data));
      // dispatch({
      //   type: SET_ORGANIZATION_DETAILS,
      //   payload: res.data,
      // });
    })
    .catch((err) => console.log(err));
};

/*=============================================================================================
                                ADMIN SETTING PAGE ACTIONS
===============================================================================================*/

/*==============================================
        GET USER INVITE LINKS
================================================*/

export const getUsersInviteLinks = () => async (dispatch) => {
  const headers = {
    "Content-Type": "application/json",
    workspaceId: workspaceId,
  };
  try {
    let { data } = await axios.get(`${url}/api/users/inviteLinks`, {
      headers: headers,
    });
    if (data) {
      dispatch({
        type: GET_INVITE_LINK_USERS,
        payload: data,
      });
    }
  } catch (err) {
    console.log(err);
  }
};

/*==============================================
        SEND USER INVITE LINK
================================================*/
export const sendInviteMailAgain = (formData) => async (dispatch) => {
  const headers = {
    "Content-Type": "application/json",
    workspaceId: workspaceId,
  };
  try {
    let { data } = await axios.post(`${url}/api/users/inviteMail`, formData, {
      headers: headers,
    });
    if (data) {
      Toast.info("Invite Mail Sent", 3000);
      console.log(data);
    }
  } catch (err) {
    console.log(err);
  }
};

/*==============================================
          USER COMPARE PASSWORD FUNCTION
================================================*/
export const userComparePassword = (
  formData,
  callBackComparePassword
) => async (dispatch) => {
  const headers = {
    "Content-Type": "application/json",
    workspaceId: workspaceId,
  };
  try {
    let { data } = await axios.post(
      `${url}/api/users/comparePassword`,
      formData,
      {
        headers: headers,
      }
    );
    if (data) {
      console.log(data);
      if (data === true) {
        Toast.info("Password Verified", 3000);
      }
      callBackComparePassword(data);
    }
  } catch (err) {
    console.log(err);
  }
};

/*==============================================
          USER INVITE
================================================*/

export const inviteTeamMember = (formData) => async (dispatch) => {
  const headers = {
    "Content-Type": "application/json",
    workspaceId: workspaceId,
  };
  try {
    let { data } = await axios.post(`${url}/api/users/invite`, formData, {
      headers: headers,
    });
    if (data) {
      Toast.info("Member Invited", 3000);
      dispatch(getAllResourceAction());
      dispatch(getUsersInviteLinks());
    }
  } catch (err) {
    console.log(err);
  }
};

/*==============================================
              USER UPDATE
================================================*/

export const updateResourceAction = (resourceId, formData) => async (
  dispatch
) => {
  const headers = {
    "Content-Type": "application/json",
    workspaceId: workspaceId,
  };
  try {
    let { data, status } = await axios.put(
      `${url}/api/users/${resourceId}`,
      formData,
      {
        headers: headers,
      }
    );
    if (data) {
      Toast.info("Resource Updated", 3000);
      dispatch(getAllResourceAction());
      dispatch(getUsersInviteLinks());
    }
  } catch (err) {
    console.log(err);
  }
};

/*=========================================================
             USER CHNAGE PASSWORD WITHOUT AUTHCODE
===========================================================*/

export const userUpdatePassword = (formData, callBackUpdatePassword) => async (
  dispatch
) => {
  const headers = {
    "Content-Type": "application/json",
    workspaceId: workspaceId,
  };
  try {
    let { data, status } = await axios.post(
      `${url}/api/users/changePassword`,
      formData,
      {
        headers: headers,
      }
    );
    if (data) {
      Toast.info("Password Updated", 3000);
      callBackUpdatePassword(status);
    }
  } catch (err) {
    console.log(err);
  }
};
