import axios from "axios";
import { url, workspaceId } from "./config";
import {
  SET_ALL_PROJECTS,
  SET_API_STATUS,
  SET_ALL_PROJECT_COUNT,
  SET_PROJECT_OVERVIEW,
  SET_SINGLE_PROJECT_DATA,
  SET_GANTT_DATA,
  SET_TASK_COLLABORATORS,
  SET_ALL_FILES,
  SET_SCHEDULE_INDICATOR,
  SET_TASK_STATUS_BREAKDOWN,
  SET_BURNDOWN_CHART_DATA,
  SET_TASK_PROGRESS_CHART,
  SET_SCHEDULE_INDICATOR_TASK_COMPLETION,
  SET_AVG_COST_OF_EMP,
  SET_TOTAL_COST_OF_EMP,
  SET_ESTIMATED_COST_VS_ACTUAL_COST_CHART_DATA,
  SET_PLANNED_HOURS_VS_ACTUAL_HOURS_CHART_DATA,
  SET_TASK_STATUS_GROUPING,
  SET_PROJECT_SCRUMS,
  SET_ALL_PIN_PROJECTS,
  SET_PROJECT_ACTIVITY,
  SET_PROJECT_EXPENSE_OVERVIEW,
  SET_ALL_NOTES_OF_SINGLE_SCRUM,
  SET_UPCOMING_SCRUM,
  SET_ALL_PROJECT_TASK,
  SET_BOOK_CALENDER_ADDED_TASK_DATA,
  SET_ASSIGNED_MEMBERS_LEFT_ARRAY,
  SET_PROJECT_ALL_DOCS,
  SET_SIGNLE_SCRUM_DATA,
  SET_SINGLE_DOC_DATA,
  SET_PROJECT_CARD_COUNT_DATA,
  SET_LOADER,
  CLEAR_LOADER,
} from "./../types";
import setAuthToken from "./../utils/setAuthToken";
import Toast from "light-toast";
import isEmpty from "../validations/is-empty";
import { getStackOfPerticularProject } from "./../actions/kanbanAction";
import { createFieldValue, updateFieldValueById } from "./commandCenterAction";

/*=============================================
      Get All Project Count
===============================================*/
export const getAllProjectCount = () => async (dispatch) => {
  const headers = {
    "Content-Type": "application/json",
    workspaceId: workspaceId,
  };
  try {
    let { data } = await axios.get(`${url}/api/projects/count`, {
      headers: headers,
    });
    if (data) {
      dispatch({
        type: SET_ALL_PROJECT_COUNT,
        payload: data,
      });
      // console.log(data);
    }
  } catch (err) {
    console.log(err);
  }
};

/*=============================================
          Get Project Overview
===============================================*/
export const getAllProjectOverview = () => async (dispatch) => {
  const headers = {
    "Content-Type": "application/json",
    workspaceId: workspaceId,
  };
  try {
    let { data } = await axios.get(`${url}/api/projects/overview?key=status`, {
      headers: headers,
    });
    if (data) {
      console.log(data);
    }
  } catch (err) {
    console.log(err);
  }
};

/*=============================================
        Get All Projects Action
==============================================*/
export const getAllProjectAction = () => async (dispatch) => {
  const headers = {
    "Content-Type": "application/json",
    workspaceId: workspaceId,
  };
  dispatch({
    type: SET_LOADER,
    payload: true,
  });
  try {
    let { data } = await axios.get(
      `${url}/api/projects?pageNo=1&pageSize=100`,
      {
        headers: headers,
      }
    );
    if (data) {
      dispatch({
        type: SET_ALL_PROJECTS,
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

/*================================================
              Create New Project
=================================================*/

export const createNewProject = (
  formData,
  projectCustomFields,
  customTextboxfieldData,
  customeDropdownFieldData,
  history
) => async (dispatch) => {
  const headers = {
    "Content-Type": "application/json",
    workspaceId: workspaceId,
  };
  try {
    let { data, status } = await axios.post(`${url}/api/projects`, formData, {
      headers: headers,
    });
    if (data) {
      Toast.info("Project Added", 3000);
      dispatch(getAllProjectAction());
      dispatch(getAllProjectCount());
      dispatch(getProjectOverview());
      //ADDING FIELD VALUE FOR CUSTOM FIELDS
      if (!isEmpty(projectCustomFields)) {
        projectCustomFields.forEach((element) => {
          if (element.type === "TEXTBOX") {
            element.name = element.name.split(" ").join("");
            const sendData = {
              field: element._id,
              entity_Id: data._id,
              value: customTextboxfieldData[element.name],
            };
            // console.log(sendData);

            dispatch(createFieldValue(sendData));
          } else if (element.type === "DROPDOWN") {
            element.name = element.name.split(" ").join("");
            const sendData = {
              field: element._id,
              entity_Id: data._id,
              value: isEmpty(customeDropdownFieldData)
                ? ""
                : customeDropdownFieldData[element.name].value,
            };
            // console.log(sendData);

            dispatch(createFieldValue(sendData));
          }
        });
      }
      history.push("/all-projects");
    }
  } catch (err) {
    console.log(err);
  }
};

/*==================================================
              Get Project Overview
====================================================*/
export const getProjectOverview = () => async (dispatch) => {
  const headers = {
    "Content-Type": "application/json",
    workspaceId: workspaceId,
  };
  try {
    let { data } = await axios.get(`${url}/api/projects/overview?key=status`, {
      headers: headers,
    });
    if (data) {
      // console.log(data);
      dispatch({
        type: SET_PROJECT_OVERVIEW,
        payload: data,
      });
    }
  } catch (err) {
    console.log(err);
  }
};

/*==================================================
        Get Project Data By project Id
====================================================*/
export const getProjectDataById = (projectId) => async (dispatch) => {
  const headers = {
    "Content-Type": "application/json",
    workspaceId: workspaceId,
  };
  try {
    let { data } = await axios.get(`${url}/api/projects/${projectId}`, {
      headers: headers,
    });
    if (data) {
      dispatch({
        type: SET_SINGLE_PROJECT_DATA,
        payload: data,
      });
      // console.log(data);
    }
  } catch (err) {
    console.log(err);
  }
};

/*==================================================
        Get Project Data By project Id
====================================================*/
export const checkCompleteProjectTimelineAction = (
  projectId,
  history
) => async (dispatch) => {
  const headers = {
    "Content-Type": "application/json",
    workspaceId: workspaceId,
  };
  try {
    let { data } = await axios.get(`${url}/api/projects/${projectId}`, {
      headers: headers,
    });
    if (data) {
      localStorage.setItem("activeProjectDetailTabIndex", 9);
      localStorage.setItem("projectData", JSON.stringify(data));
      history.push({
        pathname: "/all-projects-detail",
        state: {
          projectData: data,
        },
      });
      // console.log(data);
    }
  } catch (err) {
    console.log(err);
  }
};

/*==================================================
            Update Project by id
====================================================*/
export const updateProject = (
  projectId,
  formData,
  customTextboxfieldData,
  customeDropdownFieldData,
  projectCustomFields,
  callBackUpdateProject,
  alertTextMessage
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
      `${url}/api/projects/${projectId}`,
      formData,
      {
        headers: headers,
      }
    );
    if (data) {
      Toast.info(`${alertTextMessage}`, 3000);
      // var projectData = JSON.parse(localStorage.getItem("projectData"));
      dispatch(getAllProjectAction());
      callBackUpdateProject(status);
      //UPDATING FIELD VALUE FOR CUSTOM FIELDS
      if (!isEmpty(projectCustomFields)) {
        projectCustomFields.forEach((element) => {
          if (element.fieldData.type === "TEXTBOX") {
            element.fieldData.name = element.fieldData.name.split(" ").join("");
            let sendData = element;
            sendData.value = isEmpty(customTextboxfieldData)
              ? ""
              : customTextboxfieldData[element.fieldData.name];

            dispatch(updateFieldValueById(sendData));
          } else if (element.fieldData.type === "DROPDOWN") {
            element.fieldData.name = element.fieldData.name.split(" ").join("");
            let sendData = element;
            sendData.value = isEmpty(customeDropdownFieldData)
              ? ""
              : customeDropdownFieldData[element.fieldData.name].value;

            dispatch(updateFieldValueById(sendData));
          }
        });
      }
      dispatch({
        type: CLEAR_LOADER,
        payload: false,
      });
      // dispatch(getProjectDataById(projectData._id));
      // console.log(data);
    }
  } catch (err) {
    console.log(err);
    dispatch({
      type: CLEAR_LOADER,
      payload: false,
    });
  }
};

/*==================================================
                  Pin Project
====================================================*/
export const createPinProject = (formData) => async (dispatch) => {
  const headers = {
    "Content-Type": "application/json",
    workspaceId: workspaceId,
  };
  dispatch({
    type: SET_LOADER,
    payload: true,
  });
  try {
    let { data } = await axios.post(`${url}/api/pins`, formData, {
      headers: headers,
    });
    if (data) {
      Toast.info(`Project pinned`, 3000);
      dispatch(getAllPinProjects());
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

/*==================================================
               Get All Pin Projects   
====================================================*/
export const getAllPinProjects = () => async (dispatch) => {
  const headers = {
    "Content-Type": "application/json",
    workspaceId: workspaceId,
  };
  try {
    let { data } = await axios.get(`${url}/api/pins`, {
      headers: headers,
    });
    if (data) {
      dispatch({
        type: SET_ALL_PIN_PROJECTS,
        payload: data,
      });
    }
  } catch (err) {
    console.log(err);
  }
};

/*==================================================
              Delete pin Project By ID  
====================================================*/
export const deletePin = (pinId) => async (dispatch) => {
  const headers = {
    "Content-Type": "application/json",
    workspaceId: workspaceId,
  };
  dispatch({
    type: SET_LOADER,
    payload: true,
  });
  try {
    let { data } = await axios.delete(`${url}/api/pins/${pinId}`, {
      headers: headers,
    });
    if (data) {
      dispatch(getAllPinProjects());
      Toast.info(`Project Unpinned`, 3000);
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

/*==================================================
              Project Search Api
====================================================*/
export const projectSearchApi = (formData) => async (dispatch) => {
  const headers = {
    "Content-Type": "application/json",
    workspaceId: workspaceId,
  };
  dispatch({
    type: SET_LOADER,
    payload: true,
  });
  try {
    let { data } = await axios.post(`${url}/api/projects/search`, formData, {
      headers: headers,
    });
    if (data) {
      dispatch({
        type: SET_ALL_PROJECTS,
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

/*==========================================================================================================
                                 PROJECT PLANNING -->  GANTT CHART MODULE, SPRINT, TASK
============================================================================================================*/
export const getGanttChartData = (formData) => async (dispatch) => {
  const headers = {
    "Content-Type": "application/json",
    workspaceId: workspaceId,
  };
  try {
    let { data } = await axios.post(`${url}/api/tasks/search`, formData, {
      headers: headers,
    });
    if (data) {
      dispatch({
        type: SET_GANTT_DATA,
        payload: data,
      });
      dispatch({
        type: SET_ALL_PROJECT_TASK,
        payload: data,
      });
    }
  } catch (err) {
    console.log(err);
  }
};

export const createNewTaskAction = (formData, callBackAddTask) => async (
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
    let { data, status } = await axios.post(`${url}/api/tasks`, formData, {
      headers: headers,
    });
    if (data) {
      Toast.info(`Task Created`, 3000);
      callBackAddTask(status, data);
      let projectData = JSON.parse(localStorage.getItem("projectData"));

      dispatch(
        getGanttChartData({
          query: {
            project: projectData._id,
          },
        })
      );
      dispatch(getStackOfPerticularProject(projectData._id));
      dispatch({
        type: SET_BOOK_CALENDER_ADDED_TASK_DATA,
        payload: data,
      });
      dispatch({
        type: SET_ASSIGNED_MEMBERS_LEFT_ARRAY,
        payload: data.assignees,
      });
      dispatch({
        type: CLEAR_LOADER,
        payload: false,
      });
      // localStorage.setItem("assignedArray",data.assignees)
    }
  } catch (err) {
    console.log(err);
    dispatch({
      type: CLEAR_LOADER,
      payload: false,
    });
  }
};

export const updateTaskById = (taskId, formData, callBackUpdateTask) => async (
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
      `${url}/api/tasks/${taskId}`,
      formData,
      {
        headers: headers,
      }
    );
    if (data) {
      let projectData = JSON.parse(localStorage.getItem("projectData"));
      Toast.info("Task Updated", 3000);
      dispatch(
        getGanttChartData({
          query: {
            project: projectData._id,
          },
        })
      );
      dispatch(getStackOfPerticularProject(projectData._id));
      if (callBackUpdateTask) {
        callBackUpdateTask(status);
      }
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

export const getTaskCollaboraters = (taskId) => async (dispatch) => {
  const headers = {
    "Content-Type": "application/json",
    workspaceId: workspaceId,
  };
  try {
    let { data } = await axios.get(
      `${url}/api/schedules/collaborators/tasks/${taskId}`,
      {
        headers: headers,
      }
    );
    if (data) {
      dispatch({
        type: SET_TASK_COLLABORATORS,
        payload: data,
      });
    }
  } catch (err) {
    console.log(err);
  }
};

export const deleteTaskById = (taskId, callBackDelete) => async (dispatch) => {
  const headers = {
    "Content-Type": "application/json",
    workspaceId: workspaceId,
  };
  dispatch({
    type: SET_LOADER,
    payload: true,
  });
  try {
    let { data, status } = await axios.delete(`${url}/api/tasks/${taskId}`, {
      headers: headers,
    });
    if (data) {
      Toast.info("Task Deleted", 3000);
      let projectData = JSON.parse(localStorage.getItem("projectData"));
      if (callBackDelete) {
        callBackDelete(status);
      }

      dispatch(
        getGanttChartData({
          query: {
            project: projectData._id,
          },
        })
      );
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

/*=============================================
                Task SEARCH API
===============================================*/

export const getAllTasksByProjectId = (taskId, callBackDelete) => async (
  dispatch
) => {
  const headers = {
    "Content-Type": "application/json",
    workspaceId: workspaceId,
  };
  try {
    let { data, status } = await axios.post(`${url}/api/tasks/search`, {
      headers: headers,
    });
    if (data) {
      dispatch({ type: SET_ALL_PROJECT_TASK, payload: data });
    }
  } catch (err) {
    console.log(err);
  }
};

/*=======================================================================================
                            Project Files Section
=========================================================================================*/

/*=============================================
                 Add Expanse
===============================================*/
export const addProjectExpanses = (formData, history) => async (dispatch) => {
  const headers = {
    "Content-Type": "application/json",
    workspaceId: workspaceId,
  };
  try {
    let { data } = await axios.post(`${url}/api/expenses`, formData, {
      headers: headers,
    });
    if (data) {
      let projectData = JSON.parse(localStorage.getItem("projectData"));
      Toast.info("Expense Created", 3000);
      history.push({
        pathname: "/all-projects-detail",
        state: {
          projectData: projectData,
        },
      });
    }
  } catch (err) {
    console.log(err);
  }
};

/*=======================================================================================
                            Project Files Section
=========================================================================================*/

/*=================================
      Create File
==================================*/

export const createFile = (formData) => async (dispatch) => {
  const headers = {
    "Content-Type": "application/json",
    workspaceId: workspaceId,
  };
  try {
    let { data } = await axios.post(`${url}/api/files`, formData, {
      headers: headers,
    });
    if (data) {
      Toast.info("File Created", 3000);
      dispatch(getAllFiles());
    }
  } catch (err) {
    console.log(err);
  }
};

/*=================================
      Get All Files
==================================*/

export const getAllFiles = () => async (dispatch) => {
  const headers = {
    "Content-Type": "application/json",
    workspaceId: workspaceId,
  };
  try {
    let { data } = await axios.get(`${url}/api/files?pageNo=1&pageSize=100`, {
      headers: headers,
    });
    if (data) {
      dispatch({
        type: SET_ALL_FILES,
        payload: data,
      });
    }
  } catch (err) {
    console.log(err);
  }
};

/*=================================
      Delete Files With Id
==================================*/

export const deleteFileWithId = (fileId) => async (dispatch) => {
  const headers = {
    "Content-Type": "application/json",
    workspaceId: workspaceId,
  };
  try {
    let { data } = await axios.delete(`${url}/api/files/${fileId}`, {
      headers: headers,
    });
    if (data) {
      Toast.info("File Deleted", 3000);
      dispatch(getAllFiles());
    }
  } catch (err) {
    console.log(err);
  }
};

/*============================================================================================
                                      Project Scrum Section
==============================================================================================*/
/*========================================
              Create Scrum
==========================================*/
export const createScrum = (formData, callBackAddScrum) => async (dispatch) => {
  const headers = {
    "Content-Type": "application/json",
    workspaceId: workspaceId,
  };
  dispatch({
    type: SET_LOADER,
    payload: true,
  });
  try {
    let { data, status } = await axios.post(`${url}/api/scrums`, formData, {
      headers: headers,
    });
    if (data) {
      Toast.info("Scrum Created", 3000);
      const formDataGetScrum = {
        query: {
          project: formData.project,
        },
      };
      dispatch(getAllScrums(formDataGetScrum));
      callBackAddScrum(status);
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

/*========================================
          Create Scrum Notes
==========================================*/
export const createScrumNotes = (formData, callBackCreateNotes) => async (
  dispatch
) => {
  const headers = {
    "Content-Type": "application/json",
    workspaceId: workspaceId,
  };
  try {
    let { data, status } = await axios.post(
      `${url}/api/scrums/notes`,
      formData,
      {
        headers: headers,
      }
    );
    if (data) {
      Toast.info("Notes Created for scrum", 3000);
      callBackCreateNotes(status);
      dispatch(
        getScrumNotesByScrumId({
          query: {
            scrumId: formData._id,
          },
        })
      );
    }
  } catch (err) {
    console.log(err);
  }
};

/*========================================
    GET ALL SCRUM NOTES BY SCRUM ID
==========================================*/
export const getScrumNotesByScrumId = (formData) => async (dispatch) => {
  const headers = {
    "Content-Type": "application/json",
    workspaceId: workspaceId,
  };
  try {
    let { data, status } = await axios.post(
      `${url}/api/scrums/notes/get`,
      formData,
      {
        headers: headers,
      }
    );
    if (data) {
      dispatch({
        type: SET_ALL_NOTES_OF_SINGLE_SCRUM,
        payload: data,
      });
    }
  } catch (err) {
    console.log(err);
  }
};
/*========================================
              Get All Scrums
==========================================*/
export const getAllScrums = (formData) => async (dispatch) => {
  const headers = {
    "Content-Type": "application/json",
    workspaceId: workspaceId,
  };
  try {
    let { data } = await axios.post(`${url}/api/scrums/search`, formData, {
      headers: headers,
    });
    if (data) {
      dispatch({
        type: SET_PROJECT_SCRUMS,
        payload: data,
      });
    }
  } catch (err) {
    console.log(err);
  }
};

/*========================================
             Get Scrum by Id
==========================================*/
export const getScrumById = (scrumId) => async (dispatch) => {
  const headers = {
    "Content-Type": "application/json",
    workspaceId: workspaceId,
  };
  try {
    let { data } = await axios.get(`${url}/api/scrums/${scrumId}`, {
      headers: headers,
    });
    if (data) {
      dispatch({
        type: SET_SIGNLE_SCRUM_DATA,
        payload: data,
      });
      // dispatch(getScrumNotesByScrumId(scrumId));
    }
  } catch (err) {
    console.log(err);
  }
};

/*========================================
      Delete scrum note by id
==========================================*/
export const deleteNoteById = (noteId, scrumId) => async (dispatch) => {
  const headers = {
    "Content-Type": "application/json",
    workspaceId: workspaceId,
  };
  try {
    let { data } = await axios.delete(`${url}/api/scrums/notes/${noteId}`, {
      headers: headers,
    });
    if (data) {
      console.log(data);
      Toast.info("Note deleted", 3000);
      dispatch(
        getScrumNotesByScrumId({
          query: {
            scrumId: scrumId,
          },
        })
      );
    }
  } catch (err) {
    console.log(err);
  }
};

/*========================================
      UPDATE SCRUM NOTE BY ID
==========================================*/
export const updateScrumNoteById = (
  formData,
  noteId,
  scrumId,
  callBackUpdate
) => async (dispatch) => {
  const headers = {
    "Content-Type": "application/json",
    workspaceId: workspaceId,
  };
  try {
    let { data, status } = await axios.put(
      `${url}/api/scrums/notes/${noteId}`,
      formData,
      {
        headers: headers,
      }
    );
    if (data) {
      // console.log(data);

      Toast.info("Note Updated", 3000);
      dispatch(
        getScrumNotesByScrumId({
          query: {
            scrumId: scrumId,
          },
        })
      );
      callBackUpdate(status);
    }
  } catch (err) {
    console.log(err);
  }
};

/*========================================
           Update Scrum By Id
==========================================*/
export const updateScrumById = (formData, callBackUpdate) => async (
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
    let { data } = await axios.put(
      `${url}/api/scrums/${formData._id}`,
      formData,
      {
        headers: headers,
      }
    );
    if (data) {
      Toast.info("Scrum updated", 3000);

      const formDataGetScrum = {
        query: {
          project: formData.project,
        },
      };
      dispatch(getAllScrums(formDataGetScrum));
      if (callBackUpdate) {
        callBackUpdate();
      }
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

/*========================================
        Get Upcoming Scrum
==========================================*/
export const getUpcomingScrum = (formData) => async (dispatch) => {
  const headers = {
    "Content-Type": "application/json",
    workspaceId: workspaceId,
  };
  try {
    let { data } = await axios.post(`${url}/api/scrums/search`, formData, {
      headers: headers,
    });
    if (data) {
      dispatch({
        type: SET_UPCOMING_SCRUM,
        payload: data,
      });
    }
  } catch (err) {
    console.log(err);
  }
};

/*========================================
       Delete scrum by id
==========================================*/
export const deleteScrumById = (scrumId) => async (dispatch) => {
  const headers = {
    "Content-Type": "application/json",
    workspaceId: workspaceId,
  };
  dispatch({
    type: SET_LOADER,
    payload: true,
  });
  try {
    let { data } = await axios.delete(`${url}/api/scrums/${scrumId}`, {
      headers: headers,
    });
    if (data) {
      let projectData = JSON.parse(localStorage.getItem("projectData"));

      const formDataGetScrum = {
        query: {
          project: projectData._id,
        },
      };
      dispatch(getAllScrums(formDataGetScrum));
      Toast.info("Scrum Deleted", 3000);
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

/*==============================================================================================
                                Project Overview Section
===============================================================================================*/

/*=================================
      Get Task Status Grouping
==================================*/

export const getTaskStatusGrouping = (projectId) => async (dispatch) => {
  const headers = {
    "Content-Type": "application/json",
    workspaceId: workspaceId,
  };
  try {
    let { data } = await axios.get(
      `${url}/api/tasks/tasksGrouping/${projectId}`,
      {
        headers: headers,
      }
    );
    if (data) {
      // console.log(data);

      let lowCount = data.filter((task) => task._id === "LOW");
      let highCount = data.filter((task) => task._id === "HIGH");
      let criticalCount = data.filter((task) => task._id === "CRITICAL");
      let normalCount = data.filter((task) => task._id === "NORMAL");

      let finalData = {
        lowCount: !isEmpty(lowCount) ? lowCount[0].count : 0,
        highCount: !isEmpty(highCount) ? highCount[0].count : 0,
        criticalCount: !isEmpty(criticalCount) ? criticalCount[0].count : 0,
        normalCount: !isEmpty(normalCount) ? normalCount[0].count : 0,
      };

      dispatch({
        type: SET_TASK_STATUS_GROUPING,
        payload: finalData,
      });
    }
  } catch (err) {
    console.log(err);
  }
};

/*=================================
      ON SCHEDULE INDICATOR
==================================*/

export const onScheduleIndicator = (projectId) => async (dispatch) => {
  const headers = {
    "Content-Type": "application/json",
    workspaceId: workspaceId,
  };
  try {
    let { data } = await axios.get(
      `${url}/api/tasks/scheduleindicator/${projectId}`,
      {
        headers: headers,
      }
    );
    if (data) {
      dispatch({
        type: SET_SCHEDULE_INDICATOR,
        payload: data,
      });
    }
  } catch (err) {
    console.log(err);
  }
};

/*===========================================
      ON SCHEDULE INDICATOR Task Copmletion
=============================================*/

export const ScheduleIndicatorTaskCompletionByWeek = (projectId) => async (
  dispatch
) => {
  const headers = {
    "Content-Type": "application/json",
    workspaceId: workspaceId,
  };
  try {
    let { data } = await axios.get(
      `${url}/api/tasks/taskCompletionByWeeks?project=${projectId}`,
      {
        headers: headers,
      }
    );
    if (data) {
      dispatch({
        type: SET_SCHEDULE_INDICATOR_TASK_COMPLETION,
        payload: data,
      });
    }
  } catch (err) {
    console.log(err);
  }
};

/*=====================================
    Average Cost Of Employee Per Hour
=======================================*/

export const avgCostOfEmployeePerHour = (projectId) => async (dispatch) => {
  const headers = {
    "Content-Type": "application/json",
    workspaceId: workspaceId,
  };
  try {
    let { data } = await axios.get(
      `${url}/api/projects/rates/${projectId}?type=AVG`,
      {
        headers: headers,
      }
    );
    if (data) {
      dispatch({
        type: SET_AVG_COST_OF_EMP,
        payload: data,
      });
    }
  } catch (err) {
    console.log(err);
  }
};

/*=====================================
    Total Cost Of Employee Per Hour
=======================================*/

export const toatalCostOfEmployeePerHour = (projectId) => async (dispatch) => {
  const headers = {
    "Content-Type": "application/json",
    workspaceId: workspaceId,
  };
  try {
    let { data } = await axios.get(
      `${url}/api/projects/rates/${projectId}?type=TOTAL`,
      {
        headers: headers,
      }
    );
    if (data) {
      dispatch({
        type: SET_TOTAL_COST_OF_EMP,
        payload: data,
      });
    }
  } catch (err) {
    console.log(err);
  }
};

/*==============================================================================================
                                Project Progress Section
===============================================================================================*/

/*=====================================
      ESTIMATED COST VS ACTUAL COST
=======================================*/

export const getEstimatedCostVsActualCost = (projectId) => async (dispatch) => {
  const headers = {
    "Content-Type": "application/json",
    workspaceId: workspaceId,
  };
  try {
    let { data } = await axios.get(
      `${url}/api/projects/estVsAct/${projectId}`,
      {
        headers: headers,
      }
    );
    if (data) {
      dispatch({
        type: SET_ESTIMATED_COST_VS_ACTUAL_COST_CHART_DATA,
        payload: data,
      });
    }
  } catch (err) {
    console.log(err);
  }
};

/*=====================================
    PLANNED HOURS VS ACTUAL HOURS
=======================================*/

export const getPlannedVsActualHours = (projectId) => async (dispatch) => {
  const headers = {
    "Content-Type": "application/json",
    workspaceId: workspaceId,
  };
  try {
    let { data } = await axios.get(
      `${url}/api/projects/planVsActHours/${projectId}`,
      {
        headers: headers,
      }
    );
    if (data) {
      dispatch({
        type: SET_PLANNED_HOURS_VS_ACTUAL_HOURS_CHART_DATA,
        payload: data,
      });
    }
  } catch (err) {
    console.log(err);
  }
};

/*===================================
      TASK STATUS BREAKDOWN
====================================*/

export const getTaskStatusBreakdown = (projectId) => async (dispatch) => {
  const headers = {
    "Content-Type": "application/json",
    workspaceId: workspaceId,
  };
  try {
    let { data } = await axios.get(
      `${url}/api/tasks/overview/${projectId}?key="priority"`,
      {
        headers: headers,
      }
    );
    if (data) {
      dispatch({
        type: SET_TASK_STATUS_BREAKDOWN,
        payload: data,
      });
    }
  } catch (err) {
    console.log(err);
  }
};

/*===================================
      BURNDOWN CHART
====================================*/

export const getBurnDownChart = (spintId) => async (dispatch) => {
  const headers = {
    "Content-Type": "application/json",
    workspaceId: workspaceId,
  };
  try {
    let { data } = await axios.get(
      `${url}/api/tasks/graph/burndown/${spintId}`,
      {
        headers: headers,
      }
    );
    if (data) {
      dispatch({
        type: SET_BURNDOWN_CHART_DATA,
        payload: data,
      });
    }
  } catch (err) {
    console.log(err);
  }
};

/*===================================
      SPRINT PROGRESS CHART
====================================*/

export const getTaskProgressChart = (projectId) => async (dispatch) => {
  const headers = {
    "Content-Type": "application/json",
    workspaceId: workspaceId,
  };
  try {
    let { data } = await axios.get(
      `${url}/api/tasks/tasksProgress/${projectId}`,
      {
        headers: headers,
      }
    );
    if (data) {
      dispatch({
        type: SET_TASK_PROGRESS_CHART,
        payload: data,
      });
    }
  } catch (err) {
    console.log(err);
  }
};

/*==============================================================================================
                                Project History Section
===============================================================================================*/

/*================================================
            get Project Timeline
==================================================*/

export const getProjectActivity = (formData) => async (dispatch) => {
  const headers = {
    "Content-Type": "application/json",
    workspaceId: workspaceId,
  };
  try {
    let { data } = await axios.post(`${url}/api/activities/search`, formData, {
      headers: headers,
    });
    if (data) {
      // console.log(data);
      dispatch({
        type: SET_PROJECT_ACTIVITY,
        payload: data,
      });
    }
  } catch (err) {
    console.log(err);
  }
};

/*==============================================================================================
                                Project Expense Section
===============================================================================================*/

/*================================================
            get Project Expense Overview
==================================================*/

export const getProjectExpenseOverview = (projectId) => async (dispatch) => {
  const headers = {
    "Content-Type": "application/json",
    workspaceId: workspaceId,
  };
  try {
    let { data } = await axios.get(
      `${url}/api/projects/expbyproj/${projectId}`,
      {
        headers: headers,
      }
    );
    if (data) {
      // console.log(data);
      dispatch({
        type: SET_PROJECT_EXPENSE_OVERVIEW,
        payload: data,
      });
    }
  } catch (err) {
    console.log(err);
  }
};

/*==============================================================================================
                                        PROJECT DOCS SETCION
===============================================================================================*/

/*================================================
           CREATE PROJECT DOCS
==================================================*/

export const createProjectDocs = (formData, history) => async (dispatch) => {
  const headers = {
    "Content-Type": "application/json",
    workspaceId: workspaceId,
  };

  try {
    let { data } = await axios.post(`${url}/api/docs`, formData, {
      headers: headers,
    });
    if (data) {
      let projectData = JSON.parse(localStorage.getItem("projectData"));
      // console.log(data);
      Toast.info("Doc Created", 3000);

      history.push({
        pathname: "/all-projects-detail",
        state: {
          projectData: projectData,
        },
      });
    }
  } catch (err) {
    console.log(err);
  }
};

/*================================================
           GET ALL PROJECT DOCS
==================================================*/

export const getAllProjectDocs = (formData) => async (dispatch) => {
  const headers = {
    "Content-Type": "application/json",
    workspaceId: workspaceId,
  };
  dispatch({
    type: SET_LOADER,
    payload: true,
  });
  try {
    let { data } = await axios.post(`${url}/api/docs/search`, formData, {
      headers: headers,
    });
    if (data) {
      // console.log(data);
      dispatch({
        type: SET_PROJECT_ALL_DOCS,
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

/*================================================
         DELETE PROJECT DOCS
==================================================*/

export const deleteProjectDocs = (docId) => async (dispatch) => {
  const headers = {
    "Content-Type": "application/json",
    workspaceId: workspaceId,
  };
  dispatch({
    type: SET_LOADER,
    payload: true,
  });
  try {
    let { data } = await axios.delete(`${url}/api/docs/${docId}`, {
      headers: headers,
    });
    if (data) {
      Toast.info("Doc Deleted", 3000);
      let projectData = JSON.parse(localStorage.getItem("projectData"));
      const formData = {
        query: {
          project: projectData._id,
        },
      };
      dispatch(getAllProjectDocs(formData));
      dispatch({
        type: CLEAR_LOADER,
        payload: false,
      });
      // console.log(data);
    }
  } catch (err) {
    console.log(err);
    dispatch({
      type: CLEAR_LOADER,
      payload: false,
    });
  }
};

/*================================================
         GET SINGLE PROJECT DOC BY ID
==================================================*/

export const getProjectDocById = (docId) => async (dispatch) => {
  const headers = {
    "Content-Type": "application/json",
    workspaceId: workspaceId,
  };
  try {
    let { data } = await axios.get(`${url}/api/docs/${docId}`, {
      headers: headers,
    });
    if (data) {
      dispatch({
        type: SET_SINGLE_DOC_DATA,
        payload: data,
      });
    }
  } catch (err) {
    console.log(err);
  }
};

/*================================================
         GET SINGLE PROJECT DOC BY ID
==================================================*/

export const getProjectCardCount = () => async (dispatch) => {
  const headers = {
    "Content-Type": "application/json",
    workspaceId: workspaceId,
  };
  try {
    let { data } = await axios.get(`${url}/api/projects/projectData`, {
      headers: headers,
    });
    if (data) {
      dispatch({
        type: SET_PROJECT_CARD_COUNT_DATA,
        payload: data,
      });
    }
  } catch (err) {
    console.log(err);
  }
};
