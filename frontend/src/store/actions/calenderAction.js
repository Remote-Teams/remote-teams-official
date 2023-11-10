import axios from "axios";
import { url, workspaceId } from "./config";
import setAuthToken from "./../utils/setAuthToken";
import Toast from "light-toast";
import {
  SET_APPROVAL_PENDING_LEAVES,
  SET_UPCOMIG_LEAVES,
  SET_LEAVES_HISTORY,
  SET_UPCOMING_MEETING_COUNT,
  SET_ONLEAVE_TODAY,
  SET_AVAILABLE_LEAVES,
  SET_LOADER,
  CLEAR_LOADER,
  SET_DISPLAY_CALENDER_DATA,
  SET_CALENDER_DATA_OF_DAY,
} from "./../types";

/*===================================================================================================
                                           Calender Sections
====================================================================================================*/

/*====================================================
                  Get Calender Data
======================================================*/

export const getAllCalenderData = (month, year) => async (dispatch) => {
  const headers = {
    "Content-Type": "application/json",
    workspaceId: workspaceId,
  };
  try {
    let { data, status } = await axios.get(
      `${url}/api/calender/all?month=${month}&year=${year}`,
      {
        headers: headers,
      }
    );
    if (data) {
      dispatch({
        type: SET_DISPLAY_CALENDER_DATA,
        payload: data,
      });
    }
  } catch (err) {
    console.log(err);
  }
};

/*====================================================
           Get all data of calender day
======================================================*/

export const getAllDataOfTheDay = (day, month, year) => async (dispatch) => {
  const headers = {
    "Content-Type": "application/json",
    workspaceId: workspaceId,
  };
  try {
    let { data, status } = await axios.get(
      `${url}/api/calenders/getDayCalender?year=${year}&month=${month}&date=${day}`,
      {
        headers: headers,
      }
    );
    if (data) {
      dispatch({
        type: SET_CALENDER_DATA_OF_DAY,
        payload: data,
      });
    }
  } catch (err) {
    console.log(err);
  }
};

/*===================================================================================================
                                            Meeting Sections
====================================================================================================*/

/*====================================================
                  Add Meeting Action
======================================================*/

export const addMeetingAction = (formData, callBackAddMeet) => async (
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
    let { data, status } = await axios.post(`${url}/api/meetings`, formData, {
      headers: headers,
    });
    if (data) {
      Toast.info("Meeting Added", 3000);
      callBackAddMeet(status);
      dispatch({
        type: CLEAR_LOADER,
        payload: false,
      });

      //   console.log(data);
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
                 Get MeetingCount
======================================================*/

export const getUpcomingMeetingCount = (userId) => async (dispatch) => {
  const headers = {
    "Content-Type": "application/json",
    workspaceId: workspaceId,
  };
  try {
    let { data } = await axios.get(`${url}/api/meetings/count/${userId}`, {
      headers: headers,
    });
    if (data) {
      // console.log(data);
      dispatch({
        type: SET_UPCOMING_MEETING_COUNT,
        payload: data,
      });
    }
  } catch (err) {
    console.log(err);
  }
};

/*====================================================
                DELETE MEETING BY ID
======================================================*/

export const deleteMeetingById = (meetingId, callBackDeleteMeeting) => async (
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
    let { data, status } = await axios.delete(
      `${url}/api/meetings/${meetingId}`,
      {
        headers: headers,
      }
    );
    if (data) {
      callBackDeleteMeeting(status);
      Toast.info("Meeting Deleted", 3000);
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
               UPDATE MEETING BY ID
======================================================*/

export const updateMeetingById = (
  meetingId,
  formData,
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
      `${url}/api/meetings/${meetingId}`,
      formData,
      {
        headers: headers,
      }
    );
    if (data) {
      callBackUpdate(status);
      Toast.info("Meeting Updated", 3000);
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

/*====================================================================================================
                                                    Leave Section
=====================================================================================================*/

/*====================================================
                  Add Leave Section
======================================================*/

export const addLeaveAction = (formData, callBackAddLeave) => async (
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
    let { data, status } = await axios.post(`${url}/api/leaves`, formData, {
      headers: headers,
    });
    if (data) {
      Toast.info("Leave Added", 3000);
      dispatch(getApprovalPendingLeaves());
      callBackAddLeave(status);
      dispatch({
        type: CLEAR_LOADER,
        payload: false,
      });

      //   console.log(data);
    }
  } catch (err) {
    console.log(err);
    dispatch({
      type: CLEAR_LOADER,
      payload: false,
    });
  }
};

/*=======================================================
            Get Approval Pending Leaves
=========================================================*/
export const getApprovalPendingLeaves = () => async (dispatch) => {
  const headers = {
    "Content-Type": "application/json",
    workspaceId: workspaceId,
  };
  try {
    let { data, status } = await axios.get(
      `${url}/api/leaves/approval-pending`,
      {
        headers: headers,
      }
    );
    if (data) {
      dispatch({
        type: SET_APPROVAL_PENDING_LEAVES,
        payload: data,
      });
      //   console.log(data);
    }
  } catch (err) {
    console.log(err);
  }
};

/*=========================================================
                    Get Upcoming Leaves
==========================================================*/
export const getUpcomingLeaves = () => async (dispatch) => {
  const headers = {
    "Content-Type": "application/json",
    workspaceId: workspaceId,
  };
  try {
    let { data, status } = await axios.get(
      `${url}/api/leaves/upcoming-leaves`,
      {
        headers: headers,
      }
    );
    if (data) {
      dispatch({
        type: SET_UPCOMIG_LEAVES,
        payload: data,
      });
      //   console.log(data);
    }
  } catch (err) {
    console.log(err);
  }
};

/*=========================================================
                    Get Available Leaves count
==========================================================*/
export const getAvailableLeavesCount = (memberId, memberType) => async (
  dispatch
) => {
  const headers = {
    "Content-Type": "application/json",
    workspaceId: workspaceId,
  };
  try {
    let { data, status } = await axios.get(
      `${url}/api/leaves/history?id=${memberId}&type=${memberType}`,
      {
        headers: headers,
      }
    );
    if (data) {
      dispatch({
        type: SET_AVAILABLE_LEAVES,
        payload: data,
      });
      //   console.log(data);
    }
  } catch (err) {
    console.log(err);
  }
};

/*==============================================================
                      Update Leave With Id
================================================================*/
export const updateLeave = (leaveId, formData) => async (dispatch) => {
  const headers = {
    "Content-Type": "application/json",
    workspaceId: workspaceId,
  };
  dispatch({
    type: SET_LOADER,
    payload: true,
  });
  try {
    let { data } = await axios.put(`${url}/api/leaves/${leaveId}`, formData, {
      headers: headers,
    });
    if (data) {
      console.log(data);
      dispatch(getApprovalPendingLeaves());
      Toast.info("Leave Updated", 3000);
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

/*==================================================================
                        Approve Leaves
====================================================================*/
export const approveLeave = (leaveId, formData) => async (dispatch) => {
  const headers = {
    "Content-Type": "application/json",
    workspaceId: workspaceId,
  };
  try {
    let { data } = await axios.put(
      `${url}/api/leaves/approve/${leaveId}`,
      formData,
      {
        headers: headers,
      }
    );
    if (data) {
      console.log(data);
      dispatch(getApprovalPendingLeaves());
      Toast.info("Leave Updated", 3000);
    }
  } catch (err) {
    console.log(err);
  }
};

/*======================================================
                Approve Bulk Leaves
========================================================*/
export const approveBulkLeaves = (formData, toastText) => async (dispatch) => {
  const headers = {
    "Content-Type": "application/json",
    workspaceId: workspaceId,
  };
  try {
    let { data } = await axios.post(`${url}/api/leaves/approve`, formData, {
      headers: headers,
    });
    if (data) {
      Toast.info(`${toastText}`, 3000);
      dispatch(getApprovalPendingLeaves());
      // dispatch(getAllExpanses());
      // dispatch(getExpenseOverview());
    }
  } catch (err) {
    console.log(err);
  }
};

/*==================================================================
                      Leave History
====================================================================*/
export const getLeaveHistory = (formData) => async (dispatch) => {
  const headers = {
    "Content-Type": "application/json",
    workspaceId: workspaceId,
  };
  try {
    let { data } = await axios.post(`${url}/api/leaves/history`, formData, {
      headers: headers,
    });
    if (data) {
      let finalData = data.filter((leave) => leave.leaveType !== "HOLIDAY");
      dispatch({
        type: SET_LEAVES_HISTORY,
        payload: finalData,
      });
    }
  } catch (err) {
    console.log(err);
  }
};

/*==================================================================
                      Get On Leave Today
====================================================================*/
export const getOnLeaveToday = () => async (dispatch) => {
  const headers = {
    "Content-Type": "application/json",
    workspaceId: workspaceId,
  };
  try {
    let { data } = await axios.get(`${url}/api/leaves/on-leave`, {
      headers: headers,
    });
    if (data) {
      dispatch({
        type: SET_ONLEAVE_TODAY,
        payload: data,
      });
    }
  } catch (err) {
    console.log(err);
  }
};

/*==================================================================
                      Get On Leave Today
====================================================================*/
export const deleteLeaveById = (leaveId, callBackDelete) => async (
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
    let { data, status } = await axios.delete(`${url}/api/leaves/${leaveId}`, {
      headers: headers,
    });
    if (data) {
      Toast.info("Leave Deleted", 3000);
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

/*==================================================================
                     UPDATE SCHEDULE LEAVE BY ID
====================================================================*/
export const updateScheduleLeaveById = (
  leaveId,
  formData,
  callbackUpdate
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
      `${url}/api/leaves/${leaveId}`,
      formData,
      {
        headers: headers,
      }
    );
    if (data) {
      Toast.info("Leave Updated", 3000);
      callbackUpdate(status);
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
