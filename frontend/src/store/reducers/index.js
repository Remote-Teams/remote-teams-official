import { combineReducers } from "redux";
import authReducer from "./authReducer";
import errorReducer from "./errorReducer";
import paymentReducer from "./paymentReducer";
import resourceReducer from "./resourceReducer";
import projectReducer from "./projectReducer";
import superAdminReducer from "./superAdminReducer";
import calenderReducer from "./calenderReducer";
import clientReducer from "./clientReducer";
import financeReducer from "./financeReducer";
import supportReducer from "./supportReducer";
import notesReducer from "./notesReducer";
import chatReducer from "./chatReducer";
import kanbanReducer from "./kanbanReducer";
import scheduleReducer from "./scheduleReducer";
import ganttReducer from "./ganttReducer";
import vaultReducer from "./vaultReducer";
import proposalMainReducer from "../../components/desktop/ProposalEditor/store/reducers/index";
import connectReducer from "../../components/desktop/Connect/store/reducers/index";
import dashboardReducer from "./dashboardReducer";
import reportReducer from "./reportReducer";
import socketReducer from "./socketReducer";
import timesheetReducer from "./timesheetReducer";
import workflowsLocalReducer from "./workflowsLocalReducer";
import workboardReducer from "./workboardReducer";
import pipelineReducer from "./pipelineReducer";
import bookTheirCalenderReducer from "./bookTheirCalenderReducer";
import commandCenter from "./commandCenter";
import workflowApiReducer from "./workflowApiReducer";

export default combineReducers({
  auth: authReducer,
  errors: errorReducer,
  resources: resourceReducer,
  projects: projectReducer,
  payment: paymentReducer,
  calender: calenderReducer,
  superAdmin: superAdminReducer,
  client: clientReducer,
  finance: financeReducer,
  support: supportReducer,
  notes: notesReducer,
  chats: chatReducer,
  kanban: kanbanReducer,
  schedule: scheduleReducer,
  gantt: ganttReducer,
  vault: vaultReducer,
  proposals: proposalMainReducer,
  connectapp: connectReducer,
  dashboard: dashboardReducer,
  reports: reportReducer,
  socket: socketReducer,
  timesheet: timesheetReducer,
  workflowsLocal: workflowsLocalReducer,
  workboard: workboardReducer,
  pipeline: pipelineReducer,
  bookCalender: bookTheirCalenderReducer,
  commandCenter: commandCenter,
  workflowApi: workflowApiReducer,
});
