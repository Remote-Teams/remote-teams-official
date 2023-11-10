import axios from "axios";
import { url, workspaceId } from "./config";
import setAuthToken from "./../utils/setAuthToken";
import Toast from "light-toast";
import {
  SET_KANBAN_BOARDS,
  SET_STACKLIST_OF_BOARD,
  SET_KANBAN_VIEW,
  SET_LOADER,
  CLEAR_LOADER,
} from "./../types";

/*===========================================================================================
                                      STACK SECTION
============================================================================================*/

/*====================================================
                  Create Kanban List (stack)
=====================================================*/

export const createKanBanStack = (formData, callbackAddStack) => async (
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
    let { data, status } = await axios.post(`${url}/api/stages`, formData, {
      headers: headers,
    });
    if (data) {
      Toast.info("Kanban Stage added", 3000);
      let projectData = JSON.parse(localStorage.getItem("projectData"));
      dispatch(getStackOfPerticularProject(projectData._id));
      callbackAddStack(status);
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
        Get stack of perticular board
=====================================================*/

export const getStackOfPerticularProject = (projectId) => async (dispatch) => {
  const headers = {
    "Content-Type": "application/json",
    workspaceId: workspaceId,
  };
  try {
    let { data, status } = await axios.get(
      `${url}/api/stages/kanban/${projectId}`,
      {
        headers: headers,
      }
    );
    if (data) {
      dispatch({
        type: SET_STACKLIST_OF_BOARD,
        payload: data,
      });
    }
  } catch (err) {
    console.log(err);
  }
};

/*===============================================
                    Update Stack
=================================================*/
export const updateStack = (stackId, formData, callBackUpdateCard) => async (
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
      `${url}/api/stages/${stackId}`,
      formData,
      {
        headers: headers,
      }
    );
    if (data) {
      // console.log(data);
      Toast.info("Stage Updated", 3000);
      let projectData = JSON.parse(localStorage.getItem("projectData"));
      dispatch(getStackOfPerticularProject(projectData._id));
      if (callBackUpdateCard) {
        callBackUpdateCard(status);
      }
      dispatch({
        type: CLEAR_LOADER,
        payload: false,
      });
    }
  } catch (err) {
    callBackUpdateCard(err.response.status);
    console.log(err);
    dispatch({
      type: CLEAR_LOADER,
      payload: false,
    });
  }
};

/*===============================================
                Delete Stack
=================================================*/
export const deleteStack = (stackId, callBackDeleteStack) => async (
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
    let { data, status } = await axios.delete(`${url}/api/stages/${stackId}`, {
      headers: headers,
    });
    if (data) {
      Toast.info("Stage Deleted", 3000);
      let projectData = JSON.parse(localStorage.getItem("projectData"));
      dispatch(getStackOfPerticularProject(projectData._id));
      dispatch({
        type: CLEAR_LOADER,
        payload: false,
      });
    }
  } catch (err) {
    callBackDeleteStack(err.response);
    dispatch({
      type: CLEAR_LOADER,
      payload: false,
    });
  }
};

/*===============================================================================
                                  Card Section
=================================================================================*/
export const createCardOfList = (stackId, formData, callBackAddCard) => async (
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
      `${url}/api/klists/${stackId}`,
      formData,
      {
        headers: headers,
      }
    );
    if (data) {
      // console.log(data);
      var boardData = JSON.parse(localStorage.getItem("boardData"));
      Toast.info("Card added", 3000);
      const formData = {
        pageNo: 1,
        pageSize: 10,
        query: {
          kanban: boardData._id,
        },
      };
      dispatch({
        type: CLEAR_LOADER,
        payload: false,
      });
      // dispatch(getStackOfPerticularBoard(formData));
      callBackAddCard(status);
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
                    Update Stack
=================================================*/
export const updateKanbanTaskById = (taskId, formData) => async (dispatch) => {
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
      `${url}/api/tasks/${taskId}`,
      formData,
      {
        headers: headers,
      }
    );
    if (data) {
      // console.log(data);
      Toast.info("Task Updated", 3000);
      let projectData = JSON.parse(localStorage.getItem("projectData"));
      dispatch(getStackOfPerticularProject(projectData._id));
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
                    Update Stack
=================================================*/
export const checkIfStageIsExist = (formData, callBackLeadExist) => async (
  dispatch
) => {
  const headers = {
    "Content-Type": "application/json",
    workspaceId: workspaceId,
  };
  try {
    let { data, status } = await axios.post(
      `${url}/api/stages/exist`,
      formData,
      {
        headers: headers,
      }
    );
    if (data) {
      callBackLeadExist(data.isExist);
    }
  } catch (err) {
    console.log(err);
  }
};
