import axios from "axios";
import { url, workspaceId } from "./config";
import {} from "./../types";
import setAuthToken from "./../utils/setAuthToken";
import Toast from "light-toast";
import {
  SET_ALL_CLIENTS,
  SET_CLIENT_OVERVIEW,
  SET_API_STATUS,
  SET_CLIENT_COUNT,
  SET_TOTAL_CLIENT_THIS_MONTH,
  SET_LOADER,
  CLEAR_LOADER,
} from "./../types";
import isEmpty from "../validations/is-empty";
import { createFieldValue, updateFieldValueById } from "./commandCenterAction";

/*=================================================
            Get Client Overview
==================================================*/
export const getAllOverview = () => async (dispatch) => {
  const headers = {
    "Content-Type": "application/json",
    workspaceId: workspaceId,
  };
  try {
    let { data } = await axios.get(`${url}/api/clients/overview?key=status`, {
      headers: headers,
    });
    if (data) {
      dispatch({
        type: SET_CLIENT_OVERVIEW,
        payload: data,
      });
    }
  } catch (err) {
    console.log(err);
  }
};

/*====================================================
                    Get All Clients
======================================================*/
export const getAllClients = () => async (dispatch) => {
  const headers = {
    "Content-Type": "application/json",
    workspaceId: workspaceId,
  };
  dispatch({
    type: SET_LOADER,
    payload: true,
  });
  try {
    let { data } = await axios.get(`${url}/api/clients?pageNo=1&pageSize=10`, {
      headers: headers,
    });
    if (data) {
      dispatch({
        type: SET_ALL_CLIENTS,
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

/*====================================================
                  Add New Client
======================================================*/
export const addNewClient = (
  formData,
  clientCustomFields,
  customTextboxfieldData,
  customeDropdownFieldData,
  history,
  callBackAddClient
) => async (dispatch) => {
  const headers = {
    "Content-Type": "application/json",
    workspaceId: workspaceId,
  };
  try {
    let { data, status } = await axios.post(`${url}/api/clients`, formData, {
      headers: headers,
    });
    if (data) {
      Toast.info("Client Added", 3000);
      callBackAddClient(status);
      dispatch(getAllClients());
      dispatch(getAllOverview());
      dispatch(getClientCount());
      //ADDING FIELD VALUE FOR CUSTOM FIELDS
      if (!isEmpty(clientCustomFields)) {
        clientCustomFields.forEach((element) => {
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
      history.push("/clients");
    }
  } catch (err) {
    console.log(err);
  }
};

/*====================================================
                  Get all client count
======================================================*/
export const getClientCount = () => async (dispatch) => {
  const headers = {
    "Content-Type": "application/json",
    workspaceId: workspaceId,
  };
  try {
    let { data } = await axios.get(`${url}/api/clients/count`, {
      headers: headers,
    });
    if (data) {
      dispatch({
        type: SET_CLIENT_COUNT,
        payload: data.count,
      });
      // console.log(data);
    }
  } catch (err) {
    console.log(err);
  }
};

/*======================================================
                    Delete Client
=======================================================*/

export const deleteClient = (clientId) => async (dispatch) => {
  const headers = {
    "Content-Type": "application/json",
    workspaceId: workspaceId,
  };
  try {
    let { data } = await axios.delete(`${url}/api/clients/${clientId}`, {
      headers: headers,
    });
    if (data) {
      Toast.info("Client Deleted", 3000);
      dispatch(getAllClients());
      dispatch(getAllOverview());
      dispatch(getClientCount());
    }
  } catch (err) {
    console.log(err);
  }
};

/*==============================================
            Update Client status
================================================*/
export const updateClientStatusWithId = (clientId, formData) => async (
  dispatch
) => {
  const headers = {
    "Content-Type": "application/json",
    workspaceId: workspaceId,
  };
  try {
    let { data, status } = await axios.put(
      `${url}/api/clients/${clientId}`,
      formData,
      {
        headers: headers,
      }
    );
    if (data) {
      Toast.info("Client Updated", 3000);

      dispatch(getAllClients());
      dispatch(getAllClients());
      dispatch(getAllOverview());
    }
  } catch (err) {
    console.log(err);
  }
};

/*==============================================
            Update Client With Id
================================================*/
export const updateClientWithId = (
  clientId,
  formData,
  customTextboxfieldData,
  customeDropdownFieldData,
  clientCustomFields,
  callBackUpdate
) => async (dispatch) => {
  const headers = {
    "Content-Type": "application/json",
    workspaceId: workspaceId,
  };
  try {
    let { data, status } = await axios.put(
      `${url}/api/clients/${clientId}`,
      formData,
      {
        headers: headers,
      }
    );
    if (data) {
      Toast.info("Client Updated", 3000);
      dispatch({
        type: SET_API_STATUS,
        payload: status,
      });
      dispatch(getAllClients());
      dispatch(getAllClients());
      dispatch(getAllOverview());
      callBackUpdate();
      //UPDATING FIELD VALUE FOR CUSTOM FIELDS
      if (!isEmpty(clientCustomFields)) {
        clientCustomFields.forEach((element) => {
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

/*==============================================
      Invite Client To Access Project
===============================================*/

export const inviteClient = (formData) => async (dispatch) => {
  const headers = {
    "Content-Type": "application/json",
    workspaceId: workspaceId,
  };
  try {
    let { data } = await axios.post(`${url}/api/users/invite`, formData, {
      headers: headers,
    });
    if (data) {
      console.log(data);
      Toast.info("Client Invited", 3000);
    }
  } catch (err) {
    console.log(err);
  }
};

/*==================================================
              Client Search Api
====================================================*/
export const clientSearchApi = (formData) => async (dispatch) => {
  const headers = {
    "Content-Type": "application/json",
    workspaceId: workspaceId,
  };
  try {
    let { data } = await axios.post(`${url}/api/clients/search`, formData, {
      headers: headers,
    });
    if (data) {
      dispatch({
        type: SET_ALL_CLIENTS,
        payload: data,
      });
    }
  } catch (err) {
    console.log(err);
  }
};

/*==================================================
             Total client count this month
====================================================*/
export const clientCountThisMonth = (formData) => async (dispatch) => {
  const headers = {
    "Content-Type": "application/json",
    workspaceId: workspaceId,
  };
  try {
    let { data } = await axios.post(`${url}/api/clients/search`, formData, {
      headers: headers,
    });
    if (data) {
      dispatch({
        type: SET_TOTAL_CLIENT_THIS_MONTH,
        payload: data.length,
      });
      console.log(data);
    }
  } catch (err) {
    console.log(err);
  }
};
