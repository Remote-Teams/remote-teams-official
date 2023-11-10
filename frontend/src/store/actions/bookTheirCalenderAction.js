import axios from "axios";
import { url, workspaceId } from "./config";
import {
  SET_ALL_BOOK_CALENDER_SCHEDULES,
  SET_ASSIGNED_MEMBERS_LEFT_ARRAY,
} from "./../types";
import setAuthToken from "./../utils/setAuthToken";
import Toast from "light-toast";
import isEmpty from "../validations/is-empty";

/*====================================================================
                            Create Schedule
======================================================================*/

export const createScheduleInBookCalender = (
  formData,
  callBackAddSchedule
) => async (dispatch) => {
  const headers = {
    "Content-Type": "application/json",
    workspaceId: workspaceId,
  };
  try {
    let { data, status } = await axios.post(`${url}/api/schedules`, formData, {
      headers: headers,
    });
    if (data) {
      dispatch(getAllSchedulesForBookCalender({ query: {} }));
      const formData = {
        query: {
          user: data.assignedTo,
          task: {
            _id: data.task,
          },
        },
      };
      dispatch(searchPipelineInBookCalender(formData));
      callBackAddSchedule(status);
    }
  } catch (err) {
    console.log(err);
  }
};

/*========================================================================
               GET BOOKBYCLENDER ALL SCHEDULES
=========================================================================*/

export const getAllSchedulesForBookCalender = (formData) => async (
  dispatch
) => {
  const headers = {
    "Content-Type": "application/json",
    workspaceId: workspaceId,
  };
  try {
    let { data } = await axios.post(`${url}/api/schedules/search`, formData, {
      headers: headers,
    });
    if (data) {
      dispatch({ type: SET_ALL_BOOK_CALENDER_SCHEDULES, payload: data });
    }
  } catch (err) {
    console.log(err);
  }
};

/*========================================================================
                        Create Bulk Schedule
=========================================================================*/

export const createBulkScheduleInBookCalender = (
  formData,
  callBackAddSchedule
) => async (dispatch) => {
  const headers = {
    "Content-Type": "application/json",
    workspaceId: workspaceId,
  };
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
      dispatch(getAllSchedulesForBookCalender({ query: {} }));
      const formData = {
        query: {
          user: data.assignedTo,
          task: {
            _id: data.task,
          },
        },
      };
      dispatch(searchPipelineInBookCalender(formData));
      callBackAddSchedule(status);
    }
  } catch (err) {
    console.log(err);
  }
};

/*========================================================================
                     SEARCH PIPELINE IN BOOK CALENDER
=========================================================================*/

export const searchPipelineInBookCalender = (formData) => async (dispatch) => {
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
      console.log(data);
      if (!isEmpty(data)) {
        dispatch(deletePipelineInBookCalender(data[0]._id));
      }
    }
  } catch (err) {
    console.log(err);
  }
};

/*========================================================================
                    DELETE PIPELINE IN BOOKCALENDER
=========================================================================*/

export const deletePipelineInBookCalender = (pipelineId) => async (
  dispatch
) => {
  const headers = {
    "Content-Type": "application/json",
    workspaceId: workspaceId,
  };
  try {
    let { data, status } = await axios.delete(
      `${url}/api/pipelines/${pipelineId}`,
      {
        headers: headers,
      }
    );
    if (data) {
    }
  } catch (err) {
    console.log(err);
  }
};

/*========================================================================
                        Delete Schedule By Id
=========================================================================*/

// export const deleteScheduleById = (
//   scheduleId,
//   assignedId,
//   callBackDelete
// ) => async (dispatch) => {
//   const headers = {
//     "Content-Type": "application/json",
//     workspaceId: workspaceId,
//   };
//   try {
//     let { data, status } = await axios.delete(
//       `${url}/api/schedules/${scheduleId}`,
//       {
//         headers: headers,
//       }
//     );
//     if (data) {
//       Toast.info("Schedule deleted", 3000);
//       const formData = {
//         query: {
//           assignedTo: assignedId,
//         },
//       };
//       dispatch(searchScheduleWithQuery(formData));
//       callBackDelete(status);
//     }
//   } catch (err) {
//     console.log(err);
//   }
// };

/*========================================================================
                        Delete Schedule By Group Id
=========================================================================*/

// export const deleteScheduleByGroupId = (
//   groupId,
//   assignedId,
//   callBackDelete
// ) => async (dispatch) => {
//   const headers = {
//     "Content-Type": "application/json",
//     workspaceId: workspaceId,
//   };
//   try {
//     let { data, status } = await axios.delete(
//       `${url}/api/schedules/bulk?id=${groupId}`,
//       {
//         headers: headers,
//       }
//     );
//     if (data) {

//     }
//   } catch (err) {
//     console.log(err);
//   }
// };

/*========================================================================
                        Update Schedule By Id
=========================================================================*/

// export const updateScheduleById = (
//   scheduleId,
//   formData,
//   callBackUpdate
// ) => async (dispatch) => {
//   const headers = {
//     "Content-Type": "application/json",
//     workspaceId: workspaceId,
//   };
//   try {
//     let { data, status } = await axios.put(
//       `${url}/api/schedules/${scheduleId}`,
//       formData,
//       {
//         headers: headers,
//       }
//     );
//     if (data) {

//     }
//   } catch (err) {
//     console.log(err);
//   }
// };
