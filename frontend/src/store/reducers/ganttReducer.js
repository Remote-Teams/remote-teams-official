import { SET_GANTT_TASK_EDIT_DATA, SET_TASK_COLLABORATORS } from "./../types";
import isEmpty from "../validations/is-empty";

const initialState = {
  ganttTaskEditData: {},
  taskCollaboraters: {},
};

export default function(state = initialState, action) {
  switch (action.type) {
    case SET_GANTT_TASK_EDIT_DATA:
      return {
        ...state,
        ganttTaskEditData: action.payload,
      };
    // case SET_TASK_COLLABORATORS:
    //   return {
    //     ...state,
    //     taskCollaboraters: action.payload,
    //   };
    default:
      return state;
  }
}
