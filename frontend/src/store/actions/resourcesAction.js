import axios from "axios";
import { url, workspaceId } from "./config";
import {
  SET_ALL_RESOURCES,
  SET_LOGIN,
  SET_MEMBER_COUNT,
  SET_RESOURCE_OVERVIEW,
  SET_SINGLE_RSOURCE_DATA,
  SET_LOADER,
  CLEAR_LOADER,
} from "./../types";
import setAuthToken from "./../utils/setAuthToken";
import Toast from "light-toast";
import { createFieldValue, updateFieldValueById } from "./commandCenterAction";
import isEmpty from "../validations/is-empty";
import { getAllActiveUserQuantity } from "./../actions/paymentAction";

/*==============================================
              Invite Tema Member
===============================================*/

export const inviteTeamMember = (
  formData,
  memberCustomFields,
  customTextboxfieldData,
  customeDropdownFieldData,
  history
) => async (dispatch) => {
  const headers = {
    "Content-Type": "application/json",
    workspaceId: workspaceId,
  };
  try {
    let { data, status } = await axios.post(
      `${url}/api/users/invite`,
      formData,
      {
        headers: headers,
      }
    );
    if (data) {
      let OrganizationData = JSON.parse(
        localStorage.getItem("OrganizationData")
      );
      if (OrganizationData.planStatus === "PAID") {
        dispatch(getAllActiveUserQuantity());
      }

      if (history.location.pathname === "/all-project-add-new-member") {
        var projectData = JSON.parse(localStorage.getItem("projectData"));
        dispatch(getAllResourceAction());
        history.push({
          pathname: "/all-projects-detail",
          state: { projectData: projectData },
        });
      } else {
        Toast.info("Member added", 3000);
        dispatch(getAllResourceAction());
        dispatch(getResourceOverview());
        dispatch(getResourceCount());
        //ADDING FIELD VALUE FOR CUSTOM FIELDS
        if (!isEmpty(memberCustomFields)) {
          memberCustomFields.forEach((element) => {
            if (element.type === "TEXTBOX") {
              element.name = element.name.split(" ").join("");
              const sendData = {
                field: element._id,
                entity_Id: data._id,
                value: customTextboxfieldData[element.name],
              };
              // console.log(sendData);

              dispatch(createFieldValue(sendData));
            } else if (element.type === "DROPDOWN") {
              element.name = element.name.split(" ").join("");
              const sendData = {
                field: element._id,
                entity_Id: data._id,
                value: isEmpty(customeDropdownFieldData)
                  ? ""
                  : customeDropdownFieldData[element.name].value,
              };
              // console.log(sendData);

              dispatch(createFieldValue(sendData));
            }
          });
        }
        history.push("/scheduler-two");
      }
    }
  } catch (err) {
    console.log(err);
  }
};

/*========================================================
                Get resource Overview
=========================================================*/
export const getResourceOverview = () => async (dispatch) => {
  const headers = {
    "Content-Type": "application/json",
    workspaceId: workspaceId,
  };
  try {
    let { data } = await axios.get(`${url}/api/users/overview?key=status`, {
      headers: headers,
    });
    if (data) {
      dispatch({
        type: SET_RESOURCE_OVERVIEW,
        payload: data,
      });
    }
  } catch (err) {
    console.log(err);
  }
};

/*========================================================
                Get Total Member Count
=========================================================*/
export const getResourceCount = () => async (dispatch) => {
  const headers = {
    "Content-Type": "application/json",
    workspaceId: workspaceId,
  };
  try {
    let { data } = await axios.get(`${url}/api/users/count`, {
      headers: headers,
    });
    if (data) {
      dispatch({
        type: SET_MEMBER_COUNT,
        payload: data.count,
      });
    }
  } catch (err) {
    console.log(err);
  }
};

/*=============================================
        Get All Resources Action
==============================================*/
export const getAllResourceAction = () => async (dispatch) => {
  const headers = {
    "Content-Type": "application/json",
    workspaceId: workspaceId,
  };
  dispatch({
    type: SET_LOADER,
    payload: true,
  });
  try {
    let { data } = await axios.get(`${url}/api/users?pageNo=1&pageSize=10`, {
      headers: headers,
    });
    if (data) {
      dispatch({
        type: SET_ALL_RESOURCES,
        payload: data,
      });
      dispatch({
        type: CLEAR_LOADER,
        payload: false,
      });
    }
  } catch (err) {
    console.log(err);
    dispatch({
      type: CLEAR_LOADER,
      payload: false,
    });
  }
};

/*=====================================
      Delete Resource 
=======================================*/
export const deleteResource = (formData, callBackDelete) => (dispatch) => {
  const users = [formData];
  const headers = {
    "Content-Type": "application/json",
    workspaceId: workspaceId,
  };
  axios
    .post(`${url}/api/users/archive`, { users }, { headers: headers })
    .then((res) => {
      Toast.info("Member Deleted", 3000);
      callBackDelete(res.status);
      dispatch(getAllResourceAction());
    })
    .catch((err) => console.log(err));
};

/*===============================================
                  Upload Files 
================================================*/

export const fileUpload = (formData, callBackFileUpload) => async (
  dispatch
) => {
  const headers = {
    "Content-Type": "multipart/form-data",
    workspaceId: workspaceId,
  };
  try {
    let { data } = await axios.post(
      `https://login.remote-teams.io/api/upload`,
      formData,
      {
        headers: headers,
      }
    );
    if (data) {
      callBackFileUpload(data);
      console.log(data);
    }
  } catch (err) {
    console.log(err);
  }
};

/*================================================
              Update User Action
=================================================*/

export const updateUserAction = (formDate, userId) => async (dispatch) => {
  try {
    let { data } = await axios.put(`${url}/api/users/${userId}`, formDate);
    if (data) {
      let previousData = localStorage.getItem("UserData");
      previousData = JSON.parse(previousData);
      previousData.firstname = data.firstname;
      previousData.lastName = data.lastname;
      previousData.profileImage = data.profileImage;
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
      Toast.info("Profile updated", 3000);
    }
  } catch (err) {
    console.log(err);
  }
};

/*=======================================================
              Delete Resource Action
=========================================================*/

export const deleteResourceAction = (resourceId) => async (dispatch) => {
  const headers = {
    "Content-Type": "application/json",
    workspaceId: workspaceId,
  };
  try {
    let { data } = await axios.delete(`${url}/api/users/${resourceId}`, {
      headers: headers,
    });
    if (data) {
      Toast.info("Resource Deleted", 3000);
      dispatch(getAllResourceAction());
    }
  } catch (err) {
    console.log(err);
  }
};

/*=======================================================
              Update Resource With Id
=========================================================*/

export const updateResourceAction = (
  resourceId,
  formData,
  customTextboxfieldData,
  customeDropdownFieldData,
  memberCustomFields,
  callBackUpdateResource
) => async (dispatch) => {
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
      dispatch(getResourceOverview());
      dispatch(getResourceCount());
      callBackUpdateResource(status);
      //UPDATING FIELD VALUE FOR CUSTOM FIELDS
      if (!isEmpty(memberCustomFields)) {
        memberCustomFields.forEach((element) => {
          if (element.fieldData.type === "TEXTBOX") {
            element.fieldData.name = element.fieldData.name.split(" ").join("");
            let sendData = element;
            sendData.value = isEmpty(customTextboxfieldData)
              ? ""
              : customTextboxfieldData[element.fieldData.name];

            dispatch(updateFieldValueById(sendData));
          } else if (element.fieldData.type === "DROPDOWN") {
            element.fieldData.name = element.fieldData.name.split(" ").join("");
            let sendData = element;
            sendData.value = isEmpty(customeDropdownFieldData)
              ? ""
              : customeDropdownFieldData[element.fieldData.name].value;

            dispatch(updateFieldValueById(sendData));
          }
        });
      }
    }
  } catch (err) {
    console.log(err);
  }
};

/*==================================================
              Resource Search Api
====================================================*/
export const resourceSearchApi = (formData) => async (dispatch) => {
  const headers = {
    "Content-Type": "application/json",
    workspaceId: workspaceId,
  };
  dispatch({
    type: SET_LOADER,
    payload: true,
  });
  try {
    let { data } = await axios.post(`${url}/api/users/search`, formData, {
      headers: headers,
    });
    if (data) {
      dispatch({
        type: SET_ALL_RESOURCES,
        payload: data,
      });
      dispatch({
        type: CLEAR_LOADER,
        payload: false,
      });
    }
  } catch (err) {
    console.log(err);
    dispatch({
      type: CLEAR_LOADER,
      payload: false,
    });
  }
};

/*==================================================
              GET RESOURCE DATA BY ID
====================================================*/
export const getResourceDataById = (userId) => async (dispatch) => {
  const headers = {
    "Content-Type": "application/json",
    workspaceId: workspaceId,
  };
  try {
    let { data } = await axios.get(`${url}/api/users/${userId}`, {
      headers: headers,
    });
    if (data) {
      dispatch({
        type: SET_SINGLE_RSOURCE_DATA,
        payload: data,
      });
    }
  } catch (err) {
    console.log(err);
  }
};
