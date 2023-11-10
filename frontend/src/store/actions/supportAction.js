import axios from "axios";
import { url, workspaceId } from "./config";
// import setAuthToken from "./../utils/setAuthToken";
// import Toast from "light-toast";
import { SET_ALL_TICKETS, SET_LOADER, CLEAR_LOADER } from "./../types";
import { startOfMonth, endOfMonth } from "date-fns";
import Toast from "light-toast";

/*====================================================
                  Add New Ticket
======================================================*/

export const addNewTicket = (formData, history) => async (dispatch) => {
  const headers = {
    "Content-Type": "application/json",
    workspaceId: workspaceId,
  };
  try {
    let { data } = await axios.post(`${url}/api/tickets`, formData, {
      headers: headers,
    });
    if (data) {
      let newStartDate = startOfMonth(new Date());
      let endStartDate = endOfMonth(new Date());
      const formData = {
        query: {
          $and: [
            { createdAt: { $lte: new Date(endStartDate) } },
            { createdAt: { $gte: new Date(newStartDate) } },
          ],
        },
      };
      dispatch(getAllTickets(formData));
      history.push("/support");
    }
  } catch (err) {
    console.log(err);
  }
};

/*====================================================
                  Get All Ticket
======================================================*/

export const getAllTickets = (formData) => async (dispatch) => {
  const headers = {
    "Content-Type": "application/json",
    workspaceId: workspaceId,
  };
  dispatch({
    type: SET_LOADER,
    payload: true,
  });
  try {
    let { data } = await axios.post(`${url}/api/tickets/search`, formData, {
      headers: headers,
    });
    if (data) {
      dispatch({
        type: SET_ALL_TICKETS,
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

/*=====================================================
              Update Ticket By Id
=======================================================*/
export const updateTicket = (ticketId, formData, history) => async (
  dispatch
) => {
  const headers = {
    "Content-Type": "application/json",
    workspaceId: workspaceId,
  };
  try {
    let { data } = await axios.put(`${url}/api/tickets/${ticketId}`, formData, {
      headers: headers,
    });
    if (data) {
      let newStartDate = startOfMonth(new Date());
      let endStartDate = endOfMonth(new Date());
      const formData = {
        query: {
          $and: [
            { createdAt: { $lte: new Date(endStartDate) } },
            { createdAt: { $gte: new Date(newStartDate) } },
          ],
        },
      };
      dispatch(getAllTickets(formData));

      history.push("/support");
    }
  } catch (err) {
    console.log(err);
  }
};

/*====================================================================
                    Delete Ticket
=====================================================================*/
export const deleteTicket = (ticketId) => async (dispatch) => {
  const headers = {
    "Content-Type": "application/json",
    workspaceId: workspaceId,
  };
  try {
    let { data } = await axios.delete(`${url}/api/tickets/${ticketId}`, {
      headers: headers,
    });
    if (data) {
      let newStartDate = startOfMonth(new Date());
      let endStartDate = endOfMonth(new Date());
      const formData = {
        query: {
          $and: [
            { createdAt: { $lte: new Date(endStartDate) } },
            { createdAt: { $gte: new Date(newStartDate) } },
          ],
        },
      };
      dispatch(getAllTickets(formData));
    }
  } catch (err) {
    console.log(err);
  }
};

/*====================================================
                TICKETS QUERY
======================================================*/

export const ticketsFilter = (formData) => async (dispatch) => {
  const headers = {
    "Content-Type": "application/json",
    workspaceId: workspaceId,
  };
  dispatch({
    type: SET_LOADER,
    payload: true,
  });
  try {
    let { data } = await axios.post(`${url}/api/tickets/search`, formData, {
      headers: headers,
    });
    if (data) {
      dispatch({
        type: SET_ALL_TICKETS,
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
                    SUBMIT QUERY
======================================================*/
export const submitQuery = (formData, callBackAdd) => async (dispatch) => {
  const headers = {
    "Content-Type": "application/json",
    workspaceId: workspaceId,
  };
  try {
    let { data, status } = await axios.post(`${url}/api/support`, formData, {
      headers: headers,
    });
    if (data) {
      Toast.info("Query Submited", 3000);
      callBackAdd(status);
    }
  } catch (err) {
    console.log(err);
  }
};
