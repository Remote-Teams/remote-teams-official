import {
  SET_TODOS,
  SET_ALL_INVOICE_ISSUED_CHART_DATA,
  SET_PAID_INVOICE_ISSUED_CHART_DATA,
  SET_EXPENSE_CHART_DATA,
  SET_YEARLY_TOTAL_EXPENSE,
  SET_YEARLY_BILLED_EXPENSE,
  SET_YEARLY_MIS_EXPENSE,
  SET_INVOICE_SUMMARY,
  SET_TODAYS_TASK,
  SET_COST_VARIANCE,
  SET_PROJECT_TIMELINE,
  SET_PROJECT_TASK_STATUS_REPORT,
  SET_PROJECT_COUNTDOWN,
  SET_TICKET_SUMMARY_PERCENT,
  SET_PROJECT_COMPLETION_STATUS,
} from "./../types";

const initialState = {
  allToDo: [],
  paidInvoicesIssued: [],
  allInvoicesIssued: [],
  expenseChartData: [],
  yearlyTotalExpense: [],
  yearlyBilledExpense: [],
  yearlyMisExpense: [],
  invoiceSummary: [],
  todaysTask: [],
  costVariance: [],
  projectTimeline: [],
  projectTaskStatus: [],
  projectCountDown: [],
  ticketSummary: [],
  projectCompletionStatus: [],
};

export default function(state = initialState, action) {
  switch (action.type) {
    case SET_TODOS:
      return {
        ...state,
        allToDo: action.payload,
      };
    case SET_ALL_INVOICE_ISSUED_CHART_DATA:
      return {
        ...state,
        allInvoicesIssued: action.payload,
      };
    case SET_PAID_INVOICE_ISSUED_CHART_DATA:
      return {
        ...state,
        paidInvoicesIssued: action.payload,
      };
    case SET_EXPENSE_CHART_DATA:
      return {
        ...state,
        expenseChartData: action.payload,
      };
    case SET_YEARLY_TOTAL_EXPENSE:
      return {
        ...state,
        yearlyTotalExpense: action.payload,
      };
    case SET_YEARLY_BILLED_EXPENSE:
      return {
        ...state,
        yearlyBilledExpense: action.payload,
      };
    case SET_YEARLY_MIS_EXPENSE:
      return {
        ...state,
        yearlyMisExpense: action.payload,
      };
    case SET_INVOICE_SUMMARY:
      return {
        ...state,
        invoiceSummary: action.payload,
      };
    case SET_TODAYS_TASK:
      return {
        ...state,
        todaysTask: action.payload,
      };
    case SET_COST_VARIANCE:
      return {
        ...state,
        costVariance: action.payload,
      };
    case SET_PROJECT_TIMELINE:
      return {
        ...state,
        projectTimeline: action.payload,
      };
    case SET_PROJECT_TASK_STATUS_REPORT:
      return {
        ...state,
        projectTaskStatus: action.payload,
      };
    case SET_PROJECT_COUNTDOWN:
      return {
        ...state,
        projectCountDown: action.payload,
      };
    case SET_TICKET_SUMMARY_PERCENT:
      return {
        ...state,
        ticketSummary: action.payload,
      };
    case SET_PROJECT_COMPLETION_STATUS:
      return {
        ...state,
        projectCompletionStatus: action.payload,
      };
    default:
      return state;
  }
}
