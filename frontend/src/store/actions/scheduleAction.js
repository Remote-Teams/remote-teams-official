import axios from "axios";
import { url, workspaceId } from "./config";
import {
  SET_SIGNLE_RESOURCE_SCHEDULE,
  SET_AUTH_API_STATUS,
  SET_ALL_RESOURCE_SCHEDULE,
  SET_SIGNLE_RESOURCE_SCHEDULE_CALENDER,
  SET_LOADER,
  CLEAR_LOADER,
} from "./../types";
import setAuthToken from "./../utils/setAuthToken";
import Toast from "light-toast";

/*====================================================================
                            Create Schedule
======================================================================*/

export const createSchedule = (
  formData,
  assignedId,
  callBackAddSchedule
) => async (dispatch) => {
  const headers = {
    "Content-Type": "application/json",
    workspaceId: workspaceId,
  };
  dispatch({
    type: SET_LOADER,
    payload: true,
  });
  try {
    let { data, status } = await axios.post(`${url}/api/schedules`, formData, {
      headers: headers,
    });
    if (data) {
      Toast.info("Schedule created", 3000);
      callBackAddSchedule(status);
      const formData = {
        query: {
          assignedTo: assignedId,
        },
      };
      dispatch(searchScheduleWithQuery(formData));
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

/*========================================================================
                  Search Schedule With Query
=========================================================================*/

export const searchScheduleWithQuery = (formData) => async (dispatch) => {
  const headers = {
    "Content-Type": "application/json",
    workspaceId: workspaceId,
  };
  try {
    let { data } = await axios.post(`${url}/api/schedules/search`, formData, {
      headers: headers,
    });
    if (data) {
      dispatch({
        type: SET_SIGNLE_RESOURCE_SCHEDULE,
        payload: data,
      });
    }
  } catch (err) {
    console.log(err);
  }
};

/*========================================================================
                        Create Bulk Schedule
=========================================================================*/

export const createBulkSchedule = (
  formData,
  assignedId,
  callBackAddSchedule
) => async (dispatch) => {
  const headers = {
    "Content-Type": "application/json",
    workspaceId: workspaceId,
  };
  dispatch({
    type: SET_LOADER,
    payload: true,
  });
  try {
    let { data, status } = await axios.post(
      `${url}/api/schedules/bulk`,
      formData,
      {
        headers: headers,
      }
    );
    if (data) {
      Toast.info("Schedule created", 3000);

      const formData = {
        query: {
          assignedTo: assignedId,
        },
      };
      dispatch(searchScheduleWithQuery(formData));
      callBackAddSchedule(status);
      dispatch({
        type: CLEAR_LOADER,
        payload: false,
      });
      // dispatch({
      //   type: SET_SIGNLE_RESOURCE_SCHEDULE,
      //   payload: data,
      // });
    }
  } catch (err) {
    console.log(err);
    dispatch({
      type: CLEAR_LOADER,
      payload: false,
    });
  }
};

/*========================================================================
                        Delete Schedule By Id
=========================================================================*/

export const deleteScheduleById = (
  scheduleId,
  assignedId,
  callBackDelete
) => async (dispatch) => {
  const headers = {
    "Content-Type": "application/json",
    workspaceId: workspaceId,
  };
  dispatch({
    type: SET_LOADER,
    payload: true,
  });
  try {
    let { data, status } = await axios.delete(
      `${url}/api/schedules/${scheduleId}`,
      {
        headers: headers,
      }
    );
    if (data) {
      Toast.info("Schedule deleted", 3000);
      const formData = {
        query: {
          assignedTo: assignedId,
        },
      };
      dispatch(searchScheduleWithQuery(formData));
      callBackDelete(status);
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

/*========================================================================
                        Delete Schedule By Group Id
=========================================================================*/

export const deleteScheduleByGroupId = (
  groupId,
  assignedId,
  callBackDelete
) => async (dispatch) => {
  const headers = {
    "Content-Type": "application/json",
    workspaceId: workspaceId,
  };
  dispatch({
    type: SET_LOADER,
    payload: true,
  });
  try {
    let { data, status } = await axios.delete(
      `${url}/api/schedules/bulk?id=${groupId}`,
      {
        headers: headers,
      }
    );
    if (data) {
      Toast.info("Schedules deleted", 3000);

      const formData = {
        query: {
          assignedTo: assignedId,
        },
      };
      dispatch(searchScheduleWithQuery(formData));
      callBackDelete(status);
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

/*========================================================================
                        Update Schedule By Id
=========================================================================*/

export const updateScheduleById = (
  scheduleId,
  formData,
  assignedId,
  callBackUpdate
) => async (dispatch) => {
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
      `${url}/api/schedules/${scheduleId}`,
      formData,
      {
        headers: headers,
      }
    );
    if (data) {
      Toast.info("Schedule updated", 3000);
      dispatch({
        type: SET_AUTH_API_STATUS,
        payload: status,
      });
      callBackUpdate(status);
      const formData = {
        query: {
          assignedTo: assignedId,
        },
      };
      dispatch(searchScheduleWithQuery(formData));
      dispatch({
        type: CLEAR_LOADER,
        payload: true,
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

/*========================================================================
                        Get Schedule By Resource
=========================================================================*/

export const getScheduleByResource = () => async (dispatch) => {
  const headers = {
    "Content-Type": "application/json",
    workspaceId: workspaceId,
  };
  try {
    let { data, status } = await axios.get(
      `${url}/api/schedules/resourceSchedule`,

      {
        headers: headers,
      }
    );
    if (data) {
      dispatch({
        type: SET_ALL_RESOURCE_SCHEDULE,
        payload: data,
      });
    }
  } catch (err) {
    console.log(err);
  }
};

/*========================================================================
                      GET SCHEDULER WITH CALENDER DATA
=========================================================================*/

export const getScheduleWithCalender = (formData) => async (dispatch) => {
  const headers = {
    "Content-Type": "application/json",
    workspaceId: workspaceId,
  };
  try {
    let { data, status } = await axios.post(
      `${url}/api/schedules/calendar`,
      formData,

      {
        headers: headers,
      }
    );
    if (data) {
      dispatch({
        type: SET_SIGNLE_RESOURCE_SCHEDULE_CALENDER,
        payload: data,
      });
    }
  } catch (err) {
    console.log(err);
  }
};
