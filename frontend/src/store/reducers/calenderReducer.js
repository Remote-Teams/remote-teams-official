import {
  SET_SELECTED_DATE,
  SET_SELECTED_DATE_DATA,
  SET_APPROVAL_PENDING_LEAVES,
  SET_UPCOMIG_LEAVES,
  SET_LEAVES_HISTORY,
  SET_UPCOMING_MEETING_COUNT,
  SET_ONLEAVE_TODAY,
  SET_AVAILABLE_LEAVES,
  SET_DISPLAY_CALENDER_DATA,
  SET_CALENDER_DATA_OF_DAY,
} from "./../types";

const initialState = {
  selectedDate: new Date().toISOString(),
  selectedDateData: [],
  pendingLeaves: [],
  upcomingLeaves: [],
  leavesHistory: [],
  upcomingMeetingCount: "",
  onLeaveToday: [],
  displayCalenderData: [],
  allDataOfDay: [],
};

export default function(state = initialState, action) {
  switch (action.type) {
    case SET_SELECTED_DATE:
      return {
        ...state,
        selectedDate: action.payload,
      };
    case SET_SELECTED_DATE_DATA:
      return {
        ...state,
        selectedDateData: action.payload,
      };
    case SET_APPROVAL_PENDING_LEAVES:
      return {
        ...state,
        pendingLeaves: action.payload,
      };
    case SET_UPCOMIG_LEAVES:
      return {
        ...state,
        upcomingLeaves: action.payload,
      };
    case SET_LEAVES_HISTORY:
      return {
        ...state,
        leavesHistory: action.payload,
      };
    case SET_UPCOMING_MEETING_COUNT:
      return {
        ...state,
        upcomingMeetingCount: action.payload,
      };
    case SET_ONLEAVE_TODAY:
      return {
        ...state,
        onLeaveToday: action.payload,
      };
    case SET_AVAILABLE_LEAVES:
      return {
        ...state,
        availableLeaves: action.payload,
      };
    case SET_DISPLAY_CALENDER_DATA:
      return {
        ...state,
        displayCalenderData: action.payload,
      };
    case SET_CALENDER_DATA_OF_DAY:
      return {
        ...state,
        allDataOfDay: action.payload,
      };
    default:
      return state;
  }
}
