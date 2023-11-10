import {
  SET_SIGNLE_RESOURCE_SCHEDULE,
  SET_ALL_RESOURCE_SCHEDULE,
  SET_SIGNLE_RESOURCE_SCHEDULE_CALENDER,
} from "./../types";
import isEmpty from "../validations/is-empty";

const initialState = {
  singleResourceSchedule: [],
  allResourceSchedule: [],
  singleResourceScheduleCalender: [],
};

export default function(state = initialState, action) {
  switch (action.type) {
    case SET_SIGNLE_RESOURCE_SCHEDULE:
      return {
        ...state,
        singleResourceSchedule: action.payload,
      };
    case SET_ALL_RESOURCE_SCHEDULE:
      return {
        ...state,
        allResourceSchedule: action.payload,
      };
    case SET_SIGNLE_RESOURCE_SCHEDULE_CALENDER:
      return {
        ...state,
        singleResourceScheduleCalender: action.payload,
      };
    default:
      return state;
  }
}
