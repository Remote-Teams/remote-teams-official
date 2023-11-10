import axios from "axios";
import { url, workspaceId } from "./config";
import {
  SET_ALL_PROJECTS_WORKBOARD,
  SET_LOADER,
  CLEAR_LOADER,
} from "./../types";
import setAuthToken from "./../utils/setAuthToken";
import Toast from "light-toast";

/*====================================================================
                Create Workboard Action
======================================================================*/

export const createWorkboardAction = (formData) => async (dispatch) => {
  const headers = {
    "Content-Type": "application/json",
    workspaceId: workspaceId,
  };
  dispatch({
    type: SET_LOADER,
    payload: true,
  });
  try {
    let { data } = await axios.post(`${url}/api/workboards`, formData, {
      headers: headers,
    });
    if (data) {
      var projectData = JSON.parse(localStorage.getItem("projectData"));
      Toast.info("Workboard Created", 3000);

      const formDataGet = {
        query: {
          project: projectData._id,
        },
      };
      dispatch(getAllWorkboardOfProject(formDataGet));
      dispatch({
        type: CLEAR_LOADER,
        payload: false,
      });
      // window.location.href = "http://localhost:3000/workboard";
    }
  } catch (err) {
    console.log(err);
    dispatch({
      type: CLEAR_LOADER,
      payload: false,
    });
  }
};

/*====================================================================
                Get All Workboards by project id
======================================================================*/

export const getAllWorkboardOfProject = (formData) => async (dispatch) => {
  const headers = {
    "Content-Type": "application/json",
    workspaceId: workspaceId,
  };
  try {
    let { data } = await axios.post(`${url}/api/workboards/search`, formData, {
      headers: headers,
    });
    if (data) {
      dispatch({
        type: SET_ALL_PROJECTS_WORKBOARD,
        payload: data,
      });
    }
  } catch (err) {
    console.log(err);
  }
};

export const deleteWorkboardById = (workBoardId) => async (dispatch) => {
  const headers = {
    "Content-Type": "application/json",
    workspaceId: workspaceId,
  };
  dispatch({
    type: SET_LOADER,
    payload: true,
  });
  try {
    let { data } = await axios.delete(`${url}/api/workboards/${workBoardId}`, {
      headers: headers,
    });
    if (data) {
      console.log(data);
      Toast.info("Workboard Deleted", 3000);
      dispatch(getAllWorkboardOfProject());
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

/*===============================================
                  Upload Files 
================================================*/

export const fileUpload = (formData, done, callBackFileUpload) => async (
  dispatch
) => {
  const headers = {
    "Content-Type": "multipart/form-data",
    workspaceId: workspaceId,
    Authorization:
      "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7Il9pZCI6IjQ2M2RkODUwLTk4M2MtMTFlYi04YjhjLWQxNTRlNDIxMzFlNSIsImVtYWlsIjoiYWtzaGF5bmFnYXJnb2plMDcxNkBnbWFpbC5jb20iLCJ3b3Jrc3BhY2VJZCI6ImRlbW8zMDIifSwic3ViIjoiU3lzdGVtX1Rva2VuIiwiaXNzIjoiZG9taW5hdGUuYWkiLCJhdWQiOiJkb21pbmF0ZWFkbWluQGRvbWluYXRlLmFpIiwiaWF0IjoxNjE4NDc4NzEwLCJleHAiOjE2Mzg0Nzg3MTB9.-appa9PXDxbpFSOeNzeZYEZkTI3DGfBBlxaPZkHZDBs",
  };
  dispatch({
    type: SET_LOADER,
    payload: true,
  });
  try {
    let { data } = await axios.post(
      `https://login.dominate.ai/api/upload`,
      formData,
      {
        headers: headers,
      }
    );
    if (data) {
      callBackFileUpload(data, done);
      console.log(data);
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
