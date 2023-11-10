import {
  SET_MONTH_VIEW_TIMESHEET_DATA,
  SET_DAY_VIEW_TIMESHEET_DATA,
  SET_SELETCED_FILTERNAME_MEMBER_ID,
  SET_CSV_EXPORT_TIMESHEET_DATA,
} from "./../types";
import isEmpty from "../validations/is-empty";

const initialState = {
  monthViewTimesheetData: {},
  dayViewTimesheetData: {},
  selectedFilterMemberId: {},
  allExportTimesheetData: [],
};

export default function(state = initialState, action) {
  switch (action.type) {
    case SET_MONTH_VIEW_TIMESHEET_DATA:
      return {
        ...state,
        monthViewTimesheetData: action.payload,
      };
    case SET_DAY_VIEW_TIMESHEET_DATA:
      return {
        ...state,
        dayViewTimesheetData: action.payload,
      };
    case SET_SELETCED_FILTERNAME_MEMBER_ID:
      return {
        ...state,
        selectedFilterMemberId: action.payload,
      };
    case SET_CSV_EXPORT_TIMESHEET_DATA:
      return {
        ...state,
        allExportTimesheetData: action.payload,
      };
    default:
      return state;
  }
}
