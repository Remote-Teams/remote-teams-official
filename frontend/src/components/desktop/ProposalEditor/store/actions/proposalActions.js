import axios from "axios";
import React from "react";
import ReactDOM from "react-dom";
import {
  READ_ALL_PROPOSAL,
  READ_PROPOSAL,
  SET_PROPOSAL_OVERVIEW_COUNT,
} from "../types";
import {
  ProposalSendAndSaved,
  ErrorWhileSaving,
  ProposalSaved,
} from "../../Component/ReusableComponents/ErrorModals";

import { url, workspaceId } from "../../../../../store/actions/config";

// let workspaceName = window.location.host.split(".")[0];
// let url = `https://${workspaceName}.dominate.ai`;
// if (process.env.NODE_ENV === "development") {
//   url = `https://login.dominate.ai`;
// }

/***************************************
 * @DESC - GET PROPOSAL COUNT
 **************************************/

export const getProposalsOverview = () => (dispatch) => {
  axios
    .get(`${url}/api/proposals/overview`)
    .then((res) => {
      // console.log(res.data);
      dispatch({
        type: SET_PROPOSAL_OVERVIEW_COUNT,
        payload: res.data,
      });
    })
    .catch((err) => console.log(err));
};

/***************************************
 * @DESC - CREATE NEW PROPOSAL
 **************************************/
export const create_new_propsal = (formData) => async (dispatch) => {
  let headers = {
    "Content-Type": "application/json",
    workspaceId: workspaceId,
  };
  try {
    let { data } = await axios.post(`${url}/api/proposals`, formData, {
      headers: headers,
    });
    if (data) {
      ReactDOM.render(
        <ProposalSendAndSaved
          callback={() => (window.location.href = "/proposals")}
        />,
        document.getElementById("error_message")
      );
    }
  } catch (err) {
    console.log(err);
    ReactDOM.render(
      <ErrorWhileSaving />,
      document.getElementById("error_message")
    );
  }
};

export const save_new_propsal = (formData) => async (dispatch) => {
  let headers = {
    "Content-Type": "application/json",
    workspaceId: workspaceId,
  };
  try {
    let { data } = await axios.post(`${url}/api/proposals`, formData, {
      headers: headers,
    });
    if (data) {
      ReactDOM.render(
        <ProposalSaved
          callback={() => (window.location.href = "/proposals")}
        />,
        document.getElementById("error_message")
      );
    }
  } catch (err) {
    console.log(err);
    ReactDOM.render(
      <ErrorWhileSaving />,
      document.getElementById("error_message")
    );
  }
};

/**************************************
 * @DESC - READ ALL PROPOSALS
 *************************************/
export const get_all_proposal_list = () => async (dispatch) => {
  try {
    let { data } = await axios.get(`${url}/api/proposals?pageNo=1&pageSize=10`);
    if (data) {
      dispatch({
        type: READ_ALL_PROPOSAL,
        payload: data,
      });
    }
  } catch (err) {
    console.log(err);
    ReactDOM.render(
      <ErrorWhileSaving />,
      document.getElementById("error_message")
    );
  }
};

/***************************************
 * @DESC - READ SELECTED PROPOSAL
 ***************************************/
export const get_selected_proposal_data = (id) => async (dispatch) => {
  try {
    let { data } = await axios.get(`${url}/api/proposals/${id}`);
    if (data) {
      dispatch({
        type: READ_PROPOSAL,
        payload: data,
      });
    }
  } catch (err) {
    console.log(err);
    ReactDOM.render(
      <ErrorWhileSaving />,
      document.getElementById("error_message")
    );
  }
};

/***************************************
 * @DESC - DELETE PROPOSAL
 ***************************************/
export const delete_proposal_data = (id) => async (dispatch) => {
  try {
    let data = await axios.delete(`${url}/api/proposals/${id}`);
    if (data) {
      dispatch(get_all_proposal_list());
      // window.location.reload();
    }
  } catch (err) {
    console.log(err);
    ReactDOM.render(
      <ErrorWhileSaving />,
      document.getElementById("error_message")
    );
  }
};

/*******************************************
 * @DESC - UPDATE PROPOSAL
 ******************************************/
export const update_proposal = (formData, id) => async (dispatch) => {
  try {
    let { data } = await axios.put(`${url}/api/proposals/${id}`, formData);
    if (data) {
      alert("data updated successfully");
      window.location.href = "/proposals";
    }
  } catch (err) {
    console.log(err);
    ReactDOM.render(
      <ErrorWhileSaving />,
      document.getElementById("error_message")
    );
  }
};
