import {
  SET_SINGLE_WORKFLOW_DATA,
  SET_WORKFLOW_ALL_STEPS,
  SET_ALL_WORKFLOWS,
  SET_WORKFLOW_ALL_TASKS,
  SET_WORKFLOW_ALL_SUBTASKS,
  SET_ALL_INSTANCE_OF_USER,
  SET_SINGLE_INSTANCE_DATA,
} from "./../types";

const initialState = {
  allWorkflows: [],
  addOrEditSingleWorkflowData: [],
  workFlowAllSteps: [],
  workflowAllTasks: [],
  workflowAllSubTasks: [],
  userAllInstances: [],
  singleInstanceData: {},
};

export default function(state = initialState, action) {
  switch (action.type) {
    case SET_ALL_WORKFLOWS:
      return {
        ...state,
        allWorkflows: action.payload,
      };
    case SET_SINGLE_WORKFLOW_DATA:
      return {
        ...state,
        addOrEditSingleWorkflowData: action.payload,
      };
    case SET_WORKFLOW_ALL_STEPS:
      return {
        ...state,
        workFlowAllSteps: action.payload,
      };
    case SET_WORKFLOW_ALL_TASKS:
      return {
        ...state,
        workflowAllTasks: action.payload,
      };
    case SET_WORKFLOW_ALL_SUBTASKS:
      return {
        ...state,
        workflowAllSubTasks: action.payload,
      };
    case SET_ALL_INSTANCE_OF_USER:
      return {
        ...state,
        userAllInstances: action.payload,
      };
    case SET_SINGLE_INSTANCE_DATA:
      return {
        ...state,
        singleInstanceData: action.payload,
      };
    default:
      return state;
  }
}
