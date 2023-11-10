import axios from "axios";
import { url, workspaceId } from "./config";
// import setAuthToken from "./../utils/setAuthToken";
// import Toast from "light-toast";
import {
  SET_ALL_PROJECT_DISCUSSION,
  SET_ALL_PROJECT_DISCUSSION_COMMENTS,
  SET_LOADER,
  CLEAR_LOADER,
} from "./../types";

/*============================================================================
        Add New All Project Discussion
==============================================================================*/

export const addNewAllProjectDiscussion = (
  formData,
  callBackIsSuccess
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
    let { data } = await axios.post(`${url}/api/discussions`, formData, {
      headers: headers,
    });
    if (data) {
      callBackIsSuccess(true);
      dispatch(getAllProjectDiscussions());
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

/*============================================================================
        Add New All Project Discussion Comment
==============================================================================*/

export const addNewAllProjectDiscussionComment = (
  formData,
  callBackIsSuccess
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
    let { data } = await axios.post(
      `${url}/api/discussions/comments`,
      formData,
      {
        headers: headers,
      }
    );
    if (data) {
      callBackIsSuccess(true);
      // dispatch(getAllProjectDiscussions());
      dispatch(getAllProjectDiscussionComments(data.discussion));
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

/*============================================================================
            Get All Project Discussion
==============================================================================*/

export const getAllProjectDiscussions = () => async (dispatch) => {
  const headers = {
    "Content-Type": "application/json",
    workspaceId: workspaceId,
  };
  try {
    let { data } = await axios.get(`${url}/api/discussions`, {
      headers: headers,
    });
    if (data) {
      dispatch({
        type: SET_ALL_PROJECT_DISCUSSION,
        payload: data,
      });
    }
  } catch (err) {
    console.log(err);
  }
};

/*============================================================================
            Get All Project Discussion Comments
==============================================================================*/

export const getAllProjectDiscussionComments = (discussionId) => async (
  dispatch
) => {
  const headers = {
    "Content-Type": "application/json",
    workspaceId: workspaceId,
  };
  try {
    let { data } = await axios.get(
      `${url}/api/discussions/comments?discussionId=${discussionId}`,
      {
        headers: headers,
      }
    );
    if (data) {
      dispatch({
        type: SET_ALL_PROJECT_DISCUSSION_COMMENTS,
        payload: data,
      });
    }
  } catch (err) {
    console.log(err);
  }
};

/*======================================
    Vault file Upload inside folder
=======================================*/
export const uploadFile = (formData, callBackUpload) => (dispatch) => {
  dispatch({
    type: SET_LOADER,
    payload: true,
  });
  axios
    .post(`https://login.remote-teams.io/api/upload`, formData)
    .then((res) => {
      callBackUpload(res.data);
      dispatch({
        type: CLEAR_LOADER,
        payload: false,
      });
    })
    .catch((err) =>
      dispatch({
        type: CLEAR_LOADER,
        payload: false,
      })
    );
};

/*============================================================================
            Get All Project Discussion Comments
==============================================================================*/

// export const getAllProjectDiscussionComments = (discussionId) => async (
//   dispatch
// ) => {
//   const headers = {
//     "Content-Type": "application/json",
//     workspaceId: workspaceId,
//   };
//   try {
//     let { data } = await axios.get(
//       `${url}/api/discussions/comments?discussionId=${discussionId}`,
//       {
//         headers: headers,
//       }
//     );
//     if (data) {
//       dispatch({
//         type: SET_ALL_PROJECT_DISCUSSION_COMMENTS,
//         payload: data,
//       });
//     }
//   } catch (err) {
//     console.log(err);
//   }
// };

/*=============================================================================
        Update All Project Discussion By Id
===============================================================================*/
export const updateAllProjectDiscussion = (
  discussionId,
  formData,
  callBackIsSuccess
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
    let { data } = await axios.put(
      `${url}/api/discussions/${discussionId}`,
      formData,
      {
        headers: headers,
      }
    );
    if (data) {
      callBackIsSuccess(true);
      dispatch(getAllProjectDiscussions());
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

/*=============================================================================
        Delete All Project Discussion
===============================================================================*/
export const deleteAllProjectDiscussion = (discussionId) => async (
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
    let { data } = await axios.delete(
      `${url}/api/discussions/${discussionId}`,
      {
        headers: headers,
      }
    );
    if (data) {
      dispatch(getAllProjectDiscussions());
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

/*=============================================================================
        Delete All Project Discussion
===============================================================================*/
export const deleteAllProjectDiscussionComment = (commentId) => async (
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
    let { data } = await axios.delete(
      `${url}/api/discussions/comments/${commentId}`,
      {
        headers: headers,
      }
    );
    if (data) {
      dispatch(getAllProjectDiscussions());
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
