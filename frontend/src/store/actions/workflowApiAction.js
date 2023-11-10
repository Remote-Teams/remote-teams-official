import axios from "axios";
import { url, workspaceId } from "./config";
import Toast from "light-toast";
import {
  SET_LOADER,
  CLEAR_LOADER,
  SET_SINGLE_WORKFLOW_DATA,
  SET_WORKFLOW_ALL_STEPS,
  SET_ALL_WORKFLOWS,
  SET_WORKFLOW_ALL_TASKS,
  SET_WORKFLOW_ALL_SUBTASKS,
  SET_ALL_INSTANCE_OF_USER,
  SET_SINGLE_INSTANCE_DATA,
} from "./../types";
import emoji from "node-emoji";

/*=======================================================================================================
                                             WORKFLOW ACTIONS
=========================================================================================================*/

/*====================================================================
                      CREATE WORKFLOW
======================================================================*/

export const createWorkFlowAction = (formData, history) => async (dispatch) => {
  const headers = {
    "Content-Type": "application/json",
    workspaceId: workspaceId,
  };
  try {
    let { data } = await axios.post(`${url}/api/workflows`, formData, {
      headers: headers,
    });
    if (data) {
      const formData = {
        name: `Step Name 1`,
        workflow: data._id,
        description: "Step Description",
        position: 1,
        additionalInfo: {
          emojiSelected: emoji.random().emoji,
          isStepTitleAndDescSaved: false,
        },
      };
      dispatch(createWorkFlowStepsAction(formData, data._id));
      // Toast.info("Workflow Created", 3000);
      history.push(`/workflow-add-new/${data._id}`);
    }
  } catch (err) {
    console.log(err);
  }
};

/*====================================================================
                      GET ALL WORKFLOW
======================================================================*/

export const getAllWorkFlowAction = (formData) => async (dispatch) => {
  const headers = {
    "Content-Type": "application/json",
    workspaceId: workspaceId,
  };
  try {
    let { data } = await axios.post(`${url}/api/workflows/search`, formData, {
      headers: headers,
    });
    if (data) {
      dispatch({
        type: SET_ALL_WORKFLOWS,
        payload: data,
      });
    }
  } catch (err) {
    console.log(err);
  }
};

/*====================================================================
                      UPDATE WORKFLOW
======================================================================*/

export const updateWorkflowAction = (formData, workflowId) => async (
  dispatch
) => {
  const headers = {
    "Content-Type": "application/json",
    workspaceId: workspaceId,
  };
  try {
    let { data } = await axios.put(
      `${url}/api/workflows/${workflowId}`,
      formData,
      {
        headers: headers,
      }
    );
    if (data) {
      console.log(data);
    }
  } catch (err) {
    console.log(err);
  }
};

/*====================================================================
                     GET WORKFLOW DATA BY ID
======================================================================*/

export const getWorkflowDataById = (workflowId) => async (dispatch) => {
  const headers = {
    "Content-Type": "application/json",
    workspaceId: workspaceId,
  };
  try {
    let { data } = await axios.get(
      `${url}/api/workflows/${workflowId}`,

      {
        headers: headers,
      }
    );
    if (data) {
      // console.log("addEditWorkflowData", data);
      dispatch({
        type: SET_SINGLE_WORKFLOW_DATA,
        payload: data,
      });
    }
  } catch (err) {
    console.log(err);
  }
};

/*=======================================================================================================
                                             WORKFLOW STEPS ACTION
=========================================================================================================*/

/*====================================================================
                      CREATE WORKFLOW STEPS
======================================================================*/

export const createWorkFlowStepsAction = (formData, workflowId) => async (
  dispatch
) => {
  const headers = {
    "Content-Type": "application/json",
    workspaceId: workspaceId,
  };
  try {
    let { data } = await axios.post(`${url}/api/wsteps`, formData, {
      headers: headers,
    });
    if (data) {
      // Toast.info("Step Created", 3000);
      dispatch(
        getPerticularWorkFlowStepsAction({
          query: {
            workflow: workflowId,
          },
        })
      );
    }
  } catch (err) {
    console.log(err);
  }
};

/*====================================================================
                        GET ALL WORKFLOW STEPS
  ======================================================================*/

export const getPerticularWorkFlowStepsAction = (formData) => async (
  dispatch
) => {
  const headers = {
    "Content-Type": "application/json",
    workspaceId: workspaceId,
  };
  try {
    let { data } = await axios.post(`${url}/api/wsteps/search`, formData, {
      headers: headers,
    });
    if (data) {
      dispatch({
        type: SET_WORKFLOW_ALL_STEPS,
        payload: data,
      });
    }
  } catch (err) {
    console.log(err);
  }
};

/*====================================================================
                        UPDATE WORKFLOW STEPS
  ======================================================================*/

export const updateWorkFlowStepSAction = (
  stepId,
  formData,
  workflowId
) => async (dispatch) => {
  const headers = {
    "Content-Type": "application/json",
    workspaceId: workspaceId,
  };
  try {
    let { data } = await axios.put(`${url}/api/wsteps/${stepId}`, formData, {
      headers: headers,
    });
    if (data) {
      console.log(data);
      // Toast.info("Step Updated", 3000);
      dispatch(
        getPerticularWorkFlowStepsAction({
          query: {
            workflow: workflowId,
          },
        })
      );
    }
  } catch (err) {
    console.log(err);
  }
};

/*====================================================================
                        DELETE WORKFLOW STEP
======================================================================*/

export const deleteWorkFlowStepAction = (stepId, workflowId) => async (
  dispatch
) => {
  const headers = {
    "Content-Type": "application/json",
    workspaceId: workspaceId,
  };
  try {
    let { data } = await axios.delete(`${url}/api/wsteps/${stepId}`, {
      headers: headers,
    });
    if (data) {
      // Toast.info("Step Deleted", 3000);
      dispatch(
        getPerticularWorkFlowStepsAction({
          query: {
            workflow: workflowId,
          },
        })
      );
    }
  } catch (err) {
    console.log(err);
  }
};

/*=======================================================================================================
                                             WORKFLOW TASKS ACTION
=========================================================================================================*/

/*====================================================================
                      CREATE WORKFLOW TASKS
======================================================================*/

export const createWorkFlowTaskAction = (formData, workflowId) => async (
  dispatch
) => {
  const headers = {
    "Content-Type": "application/json",
    workspaceId: workspaceId,
  };
  try {
    let { data } = await axios.post(`${url}/api/wtasks`, formData, {
      headers: headers,
    });
    if (data) {
      console.log(data);
      // Toast.info("Task Created", 3000);
      const formDataTasks = {
        query: {
          workflow: workflowId,
        },
      };
      dispatch(getAllWorkFlowTaskAction(formDataTasks));
    }
  } catch (err) {
    console.log(err);
  }
};

/*====================================================================
                        GET ALL WORKFLOW TASK
  ======================================================================*/

export const getAllWorkFlowTaskAction = (formData) => async (dispatch) => {
  const headers = {
    "Content-Type": "application/json",
    workspaceId: workspaceId,
  };
  try {
    let { data } = await axios.post(`${url}/api/wtasks/search`, formData, {
      headers: headers,
    });
    if (data) {
      dispatch({
        type: SET_WORKFLOW_ALL_TASKS,
        payload: data,
      });
    }
  } catch (err) {
    console.log(err);
  }
};

/*====================================================================
                        UPDATE WORKFLOW TASK
  ======================================================================*/

export const updateWorkFlowTaskAction = (
  taskId,
  formData,
  workflowId
) => async (dispatch) => {
  const headers = {
    "Content-Type": "application/json",
    workspaceId: workspaceId,
  };
  try {
    let { data } = await axios.put(`${url}/api/wtasks/${taskId}`, formData, {
      headers: headers,
    });
    if (data) {
      console.log(data);
      // Toast.info("Task Updated", 3000);
      const formDataTasks = {
        query: {
          workflow: workflowId,
        },
      };
      dispatch(getAllWorkFlowTaskAction(formDataTasks));
    }
  } catch (err) {
    console.log(err);
  }
};

/*====================================================================
                        DELETE WORKFLOW TASK
======================================================================*/

export const deleteWorkFlowTaskAction = (taskId, workflowId) => async (
  dispatch
) => {
  const headers = {
    "Content-Type": "application/json",
    workspaceId: workspaceId,
  };
  try {
    let { data } = await axios.delete(`${url}/api/wtasks/${taskId}`, {
      headers: headers,
    });
    if (data) {
      console.log(data);
      // Toast.info("Task Deleted", 3000);
      const formDataTasks = {
        query: {
          workflow: workflowId,
        },
      };
      dispatch(getAllWorkFlowTaskAction(formDataTasks));
    }
  } catch (err) {
    console.log(err);
  }
};

/*=======================================================================================================
                                             WORKFLOW  SUBTASKS ACTION
=========================================================================================================*/

/*====================================================================
                      CREATE WORKFLOW SUBTASKS
======================================================================*/

export const createWorkFlowSubTaskAction = (formData, workflowId) => async (
  dispatch
) => {
  const headers = {
    "Content-Type": "application/json",
    workspaceId: workspaceId,
  };
  try {
    let { data } = await axios.post(`${url}/api/wsubtasks`, formData, {
      headers: headers,
    });
    if (data) {
      // Toast.info("Subtask Created", 3000);
      console.log(data);
      const formDataSubTasks = {
        query: {
          workflow: workflowId,
        },
      };
      dispatch(getAllWorkFlowSubTaskAction(formDataSubTasks));
    }
  } catch (err) {
    console.log(err);
  }
};

/*====================================================================
                        GET ALL WORKFLOW SUBTASKS
  ======================================================================*/

export const getAllWorkFlowSubTaskAction = (formData) => async (dispatch) => {
  const headers = {
    "Content-Type": "application/json",
    workspaceId: workspaceId,
  };
  try {
    let { data } = await axios.post(`${url}/api/wsubtasks/search`, formData, {
      headers: headers,
    });
    if (data) {
      dispatch({
        type: SET_WORKFLOW_ALL_SUBTASKS,
        payload: data,
      });
    }
  } catch (err) {
    console.log(err);
  }
};

/*====================================================================
                        UPDATE WORKFLOW SUBTASKS
  ======================================================================*/

export const updateWorkFlowSubTaskAction = (
  subTaskId,
  formData,
  workflowId
) => async (dispatch) => {
  const headers = {
    "Content-Type": "application/json",
    workspaceId: workspaceId,
  };
  try {
    let { data } = await axios.put(
      `${url}/api/wsubtasks/${subTaskId}`,
      formData,
      {
        headers: headers,
      }
    );
    if (data) {
      console.log(data);
      // Toast.info("Subtask Updated", 3000);
      const formDataSubTasks = {
        query: {
          workflow: workflowId,
        },
      };
      dispatch(getAllWorkFlowSubTaskAction(formDataSubTasks));
    }
  } catch (err) {
    console.log(err);
  }
};

/*====================================================================
                        DELETE WORKFLOW SUBTASKS
======================================================================*/

export const deleteWorkFlowSubTaskAction = (subTaskId, workflowId) => async (
  dispatch
) => {
  const headers = {
    "Content-Type": "application/json",
    workspaceId: workspaceId,
  };
  try {
    let { data } = await axios.delete(`${url}/api/wsubtasks/${subTaskId}`, {
      headers: headers,
    });
    if (data) {
      console.log(data);
      // Toast.info("Subtask Deleted", 3000);
      const formDataSubTasks = {
        query: {
          workflow: workflowId,
        },
      };
      dispatch(getAllWorkFlowSubTaskAction(formDataSubTasks));
    }
  } catch (err) {
    console.log(err);
  }
}; /*====================================================================
                      CREATE WORKFLOW INSTANCE
======================================================================*/

/*=======================================================================================================
                                             WORKFLOW INSTANCE ACTIONS
=========================================================================================================*/

export const createWorkFlowInstanceAction = (formData, history) => async (
  dispatch
) => {
  const headers = {
    "Content-Type": "application/json",
    workspaceId: workspaceId,
  };
  try {
    let { data } = await axios.post(`${url}/api/winstances`, formData, {
      headers: headers,
    });
    if (data) {
      Toast.info("Instance Created", 3000);
      history.push(`/workflow-details/${data._id}`);
    }
  } catch (err) {
    console.log(err);
  }
};

/*====================================================================
                        GET ALL WORKFLOW INSTANCES
  ======================================================================*/

export const getAllWorkFlowInstanceAction = (formData) => async (dispatch) => {
  const headers = {
    "Content-Type": "application/json",
    workspaceId: workspaceId,
  };
  try {
    let { data } = await axios.post(`${url}/api/winstances/search`, formData, {
      headers: headers,
    });
    if (data) {
      dispatch({
        type: SET_ALL_INSTANCE_OF_USER,
        payload: data,
      });
    }
  } catch (err) {
    console.log(err);
  }
};

/*====================================================================
                       GET SINGLE INSTANCE DATA BY ID
  ======================================================================*/

export const getSingleInstanceDataById = (instanceId) => async (dispatch) => {
  const headers = {
    "Content-Type": "application/json",
    workspaceId: workspaceId,
  };
  try {
    let { data } = await axios.get(
      `${url}/api/winstances/${instanceId}`,

      {
        headers: headers,
      }
    );
    if (data) {
      dispatch({
        type: SET_SINGLE_INSTANCE_DATA,
        payload: data,
      });
    }
  } catch (err) {
    console.log(err);
  }
};

/*====================================================================
                        UPDATE WORKFLOW INSTANCE
  ======================================================================*/

export const updateWorkFlowInstanceAction = (formData, instanceId) => async (
  dispatch
) => {
  const headers = {
    "Content-Type": "application/json",
    workspaceId: workspaceId,
  };
  try {
    let { data } = await axios.put(
      `${url}/api/winstances/${instanceId}`,
      formData,
      {
        headers: headers,
      }
    );
    if (data) {
      // console.log(data);
      Toast.info("Instance Updated", 3000);
      dispatch(getSingleInstanceDataById(instanceId));
      var userData = JSON.parse(localStorage.getItem("UserData"));
      const formData = {
        query: {
          user: userData.id,
        },
      };
      dispatch(getAllWorkFlowInstanceAction(formData));
    }
  } catch (err) {
    console.log(err);
  }
};

/*====================================================================
                        DELETE WORKFLOW INSTANCE
======================================================================*/

export const deleteWorkFlowInstanceAction = (stepId) => async (dispatch) => {
  const headers = {
    "Content-Type": "application/json",
    workspaceId: workspaceId,
  };
  try {
    let { data } = await axios.delete(`${url}/api/winstances/${stepId}`, {
      headers: headers,
    });
    if (data) {
      Toast.info("Instance Deleted", 3000);
      var userData = JSON.parse(localStorage.getItem("UserData"));
      const formData = {
        query: {
          user: userData.id,
        },
      };
      dispatch(getAllWorkFlowInstanceAction(formData));
    }
  } catch (err) {
    console.log(err);
  }
};
