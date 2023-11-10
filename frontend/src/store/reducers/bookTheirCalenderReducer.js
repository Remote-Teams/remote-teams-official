import {
  SET_BOOK_CALENDER_ADDED_TASK_DATA,
  SET_ALL_BOOK_CALENDER_SCHEDULES,
  SET_ASSIGNED_MEMBERS_ARRAY,
  SET_ASSIGNED_MEMBERS_LEFT_ARRAY,
} from "./../types";
import isEmpty from "../validations/is-empty";

const initialState = {
  bookAddedTaskData: {},
  bookCalenderAllSchedules: {},
  updateTaskMemberLeftArray: [],
};

export default function(state = initialState, action) {
  switch (action.type) {
    case SET_BOOK_CALENDER_ADDED_TASK_DATA:
      return {
        ...state,
        bookAddedTaskData: action.payload,
      };

    case SET_ALL_BOOK_CALENDER_SCHEDULES:
      return {
        ...state,
        bookCalenderAllSchedules: action.payload,
      };
    case SET_ASSIGNED_MEMBERS_LEFT_ARRAY:
      return {
        ...state,
        updateTaskMemberLeftArray: action.payload,
      };

    default:
      return state;
  }
}
