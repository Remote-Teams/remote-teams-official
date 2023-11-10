import axios from "axios";
import { url, workspaceId } from "./config";
// import setAuthToken from "./../utils/setAuthToken";
import Toast from "light-toast";
import { SET_USER_PIPELINE, CLEAR_LOADER, SET_LOADER } from "./../types";

/*=================================================
        PIPELINE SEARCH API
===================================================*/

export const getPipelineOfUser = (formData) => async (dispatch) => {
  const headers = {
    "Content-Type": "application/json",
    workspaceId: workspaceId,
  };
  try {
    let { data, status } = await axios.post(
      `${url}/api/pipelines/search`,
      formData,
      {
        headers: headers,
      }
    );
    if (data) {
      dispatch({
        type: SET_USER_PIPELINE,
        payload: data,
      });
    }
  } catch (err) {
    console.log(err);
  }
};

/*=================================================
        UPDATE PIPELINE
===================================================*/

export const updatePipelineById = (pipelineId, formData, alertText) => async (
  dispatch
) => {
  const headers = {
    "Content-Type": "application/json",
    workspaceId: workspaceId,
  };
  dispatch({
    type: SET_LOADER,
    payload: true,
  });
  try {
    let { data, status } = await axios.put(
      `${url}/api/pipelines/${pipelineId}`,
      formData,
      {
        headers: headers,
      }
    );
    if (data) {
      if (alertText) {
        Toast.info("Pipeline Dismissed", 3000);
      }

      var userData = JSON.parse(localStorage.getItem("UserData"));
      const formData = {
        query: {
          user: userData.id,
          dismissed: false,
          bookingCreated: false,
        },
      };
      dispatch(getPipelineOfUser(formData));
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
