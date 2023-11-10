import axios from "axios";
import { url, workspaceId } from "./config";
// import setAuthToken from "./../utils/setAuthToken";
// import Toast from "light-toast";
import {
  SET_MONTH_VIEW_TIMESHEET_DATA,
  SET_DAY_VIEW_TIMESHEET_DATA,
  SET_CSV_EXPORT_TIMESHEET_DATA,
  SET_LOADER,
  CLEAR_LOADER,
} from "./../types";
import Toast from "light-toast";
import { startOfDay, endOfDay } from "date-fns";
import { eachDay, startOfWeek, endOfWeek } from "date-fns";

/*====================================================
                Day View Timesheet
======================================================*/

export const getDayViewTimeSheet = (formData) => async (dispatch) => {
  const headers = {
    "Content-Type": "application/json",
    workspaceId: workspaceId,
  };
  try {
    let { data } = await axios.post(`${url}/api/worklogs/search`, formData, {
      headers: headers,
    });
    if (data) {
      dispatch({
        type: SET_DAY_VIEW_TIMESHEET_DATA,
        payload: data,
      });
    }
  } catch (err) {
    console.log(err);
  }
};

/*====================================================
                 Month View Timesheet
======================================================*/

export const getMonthViewTimeSheet = (formData) => async (dispatch) => {
  const headers = {
    "Content-Type": "application/json",
    workspaceId: workspaceId,
  };
  try {
    let { data } = await axios.post(
      `${url}/api/worklogs/weeklytimesheet`,
      formData,
      {
        headers: headers,
      }
    );
    if (data) {
      dispatch({
        type: SET_MONTH_VIEW_TIMESHEET_DATA,
        payload: data,
      });
    }
  } catch (err) {
    console.log(err);
  }
};

/*====================================
            Create Worklog
======================================*/

export const createWorkLog = (
  formData,
  startDate,
  endDate,
  memberId,
  callBackAddEntry
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
      `${url}/api/worklogs`,
      formData,

      {
        headers: headers,
      }
    );
    if (data) {
      Toast.info("Entry Created ", 3000);

      let startDay = startOfDay(new Date()).toISOString();
      let endDay = endOfDay(new Date()).toISOString();
      const formData = {
        query: {
          $and: [
            { date: { $gt: startDay } },
            { date: { $lt: endDay } },
            { user: memberId },
          ],
        },
      };
      dispatch(getDayViewTimeSheet(formData));
      const monthViewData = {
        startDate: startDate,
        endDate: endDate,
        member: memberId,
      };
      dispatch(getMonthViewTimeSheet(monthViewData));
      callBackAddEntry(status);
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

/*====================================
            Worklog Updated
======================================*/

export const updateWorklogByid = (
  worklogID,
  formData,
  startDate,
  endDate,
  memberId,
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
      `${url}/api/worklogs/${worklogID} `,
      formData,
      {
        headers: headers,
      }
    );
    if (data) {
      Toast.info("Worklog updated", 3000);
      // dispatch(getMonthViewTimeSheet(startDate, endDate, memberId));
      let startDay = startOfDay(new Date()).toISOString();
      let endDay = endOfDay(new Date()).toISOString();
      const formData = {
        query: {
          $and: [
            { date: { $gt: startDay } },
            { date: { $lt: endDay } },
            { user: memberId.id },
          ],
        },
      };
      dispatch(getDayViewTimeSheet(formData));
      const monthViewData = {
        startDate: startDate,
        endDate: endDate,
        member: memberId,
      };
      dispatch(getMonthViewTimeSheet(monthViewData));
      callBackUpdate(status);
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

/*====================================
            Create Worklog
======================================*/

export const deleteWorklogById = (
  worklogId,
  startDate,
  endDate,
  userId
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
      `${url}/api/worklogs/${worklogId}`,

      {
        headers: headers,
      }
    );
    if (data) {
      Toast.info("Entry Deleted ", 3000);

      let startDay = startOfDay(new Date()).toISOString();
      let endDay = endOfDay(new Date()).toISOString();
      const formData = {
        query: {
          $and: [
            { date: { $gt: startDay } },
            { date: { $lt: endDay } },
            { user: userId },
          ],
        },
      };
      dispatch(getDayViewTimeSheet(formData));
      const monthViewData = {
        startDate: startDate,
        endDate: endDate,
        member: userId,
      };
      dispatch(getMonthViewTimeSheet(monthViewData));
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
                 Month View Timesheet
======================================================*/

export const AllTimesheetDataExport = (formData, callback) => async (
  dispatch
) => {
  const headers = {
    "Content-Type": "application/json",
    workspaceId: workspaceId,
  };
  try {
    let { data, status } = await axios.post(
      `${url}/api/worklogs/weeklytimesheet`,
      formData,
      {
        headers: headers,
      }
    );
    if (data) {
      dispatch({
        type: SET_CSV_EXPORT_TIMESHEET_DATA,
        payload: data,
      });
      callback(data);
    }
  } catch (err) {
    console.log(err);
  }
};
