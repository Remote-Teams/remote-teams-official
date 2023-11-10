import {
  SET_PROJECT_TASK_COMPLETION_STATUS,
  SET_RESOURCE_DISTRIBUTION_COUNT,
  SET_RESOURCE_DISTRIBUTION_PERCENT,
  SET_TOTAL_EXPENSE_THIS_MONTH,
  SET_TOTAL_BILLED_AND_UNBILLED_EXPENSES_THIS_MONTH,
  SET_TOTAL_PAID_AND_TOTAL_INVOICED_AMOUNT,
  SET_TOTAL_NUMBER_OF_INVOICES,
  SET_CLIENTS_COMPOSITION,
  SET_TOTAL_CLIENTS_COUNT,
  SET_TOTAL_REVENUE_THIS_MONTH,
  SET_TOTAL_SUBSCRIPTION_COST_THIS_MONTH,
  SET_EXPENSE_VS_INCOME_CHART_DATA,
  SET_PAID_INVOICE_REPORT_ISSUED_CHART_DATA,
  SET_PROJECT_COUNTDOWN_IN_REPORTS,
  SET_PROJECT_HEALTH,
  SET_OVERALL_BUDGET_SPENT_CHART,
  SET_UTILIZED_HOURS_CHART_DATA,
  SET_REVENUE_GENERATED_CHART_DATA,
  SET_PROJECT_SUMMARY_CHART_DATA,
  SET_RESOURCE_SUMMARY_REPORT,
  SET_AVG_UTILIZATION_RATE_OF_RESOURCE,
  SET_TASK_BY_PRIORITY_REPORT,
  SET_TASK_IMP_DISTRIBUTION_BY_PROJECT,
  SET_TASK_WITH_MOST_LOGGED_HOURS_OVERALL,
  SET_DUE_INVOICE_AMOUNT,
  SET_DISTRIBUTION_CHART_DATA,
  SET_TICKET_SUMMARY_TILL_DATE_AND_MONTH,
  SET_TICKET_TABLE_DATA,
  SET_EXPENSE_VS_INCOME_TABLE_DATA,
  SET_INVOICE_TABLE_DATA,
  SET_LEAVES_REPORT_DATA_TABLE,
  SET_LAST_MONTH_LEAVES_BY_EMPLOYEE,
  SET_CLIENT_DETAIL_REPORT_TABLE_DATA,
  SET_TASK_STATUS_REPORT_TABLE_DATA,
  SET_NUMBER_OF_TICKETS_RAISED_BY_REASONS_CHART,
  SET_RESOURCE_TIMESHEET_TABLEDATA,
  SET_COMPOSITION_OF_LEAVE,
  SET_TOTAL_COMPANY_DAYOFFS,
  SET_DISTRIBUTION_OF_TASK_BY_PROJECT,
} from "./../types";
import isEmpty from "../validations/is-empty";

const initialState = {
  projectTaskCompletion: [],
  projectCountDown: [],
  projectHealth: "",
  overallBudgetSpent: [],
  utilizedHoursChart: [],
  resourceDistributionCount: [],
  resourceDistributionPercent: [],
  resourceSummary: [],
  avgUtilizationRate: [],
  resourceTimesheetReportTableData: [],
  totalExpenseThisMonth: [],
  totalBilledAndUnbilledExpenseThisMonth: [],
  totalPaidAndTotalInvoicedAmount: [],
  totalIncomeThisMonth: [],
  totalSubscriptionCostThisMonth: [],
  expenseVsIncomeChartExpense: [],
  expenseVsIncomeChartIncome: [],
  expenseVsIncomeTableData: [],
  totalNumberOfInvoices: [],
  dueInvoiceAmount: [],
  invoiceReportTableData: [],
  distributionChart: [],
  taskPriorityReportChartData: [],
  taskImportantDistributionByProject: [],
  distributionOfTaskByProject: [],
  taskStatusReportTableData: [],
  taskWithMostLoggedHors: [],
  compositionOfClients: [],
  totalClientsCount: [],
  clientDetailReportTableData: [],
  revenueGeneratedChartData: [],
  projectSummaryChartData: [],
  leavesReportTableData: [],
  totalComapnyDayOffs: [],
  compositionOfLeaveChart: [],
  ticketSummaryChart: [],
  ticketSummaryTableData: [],
  ticketsRaisedByReasonChartData: [],
  lastMonthLeavesTakenByUsers: [],
};

export default function(state = initialState, action) {
  switch (action.type) {
    case SET_PROJECT_TASK_COMPLETION_STATUS:
      return {
        ...state,
        projectTaskCompletion: action.payload,
      };
    case SET_RESOURCE_DISTRIBUTION_COUNT:
      return {
        ...state,
        resourceDistributionCount: action.payload,
      };
    case SET_RESOURCE_DISTRIBUTION_PERCENT:
      return {
        ...state,
        resourceDistributionPercent: action.payload,
      };
    case SET_TOTAL_EXPENSE_THIS_MONTH:
      return {
        ...state,
        totalExpenseThisMonth: action.payload,
      };
    case SET_TOTAL_BILLED_AND_UNBILLED_EXPENSES_THIS_MONTH:
      return {
        ...state,
        totalBilledAndUnbilledExpenseThisMonth: action.payload,
      };
    case SET_TOTAL_PAID_AND_TOTAL_INVOICED_AMOUNT:
      return {
        ...state,
        totalPaidAndTotalInvoicedAmount: action.payload,
      };
    case SET_TOTAL_NUMBER_OF_INVOICES:
      return {
        ...state,
        totalNumberOfInvoices: action.payload,
      };
    case SET_CLIENTS_COMPOSITION:
      return {
        ...state,
        compositionOfClients: action.payload,
      };
    case SET_TOTAL_CLIENTS_COUNT:
      return {
        ...state,
        totalClientsCount: action.payload,
      };
    case SET_TOTAL_REVENUE_THIS_MONTH:
      return {
        ...state,
        totalIncomeThisMonth: action.payload,
      };
    case SET_TOTAL_SUBSCRIPTION_COST_THIS_MONTH:
      return {
        ...state,
        totalSubscriptionCostThisMonth: action.payload,
      };
    case SET_EXPENSE_VS_INCOME_CHART_DATA:
      return {
        ...state,
        expenseVsIncomeChartExpense: action.payload,
      };
    case SET_PAID_INVOICE_REPORT_ISSUED_CHART_DATA:
      return {
        ...state,
        expenseVsIncomeChartIncome: action.payload,
      };
    case SET_PROJECT_COUNTDOWN_IN_REPORTS:
      return {
        ...state,
        projectCountDown: action.payload,
      };
    case SET_PROJECT_HEALTH:
      return {
        ...state,
        projectHealth: action.payload,
      };
    case SET_OVERALL_BUDGET_SPENT_CHART:
      return {
        ...state,
        overallBudgetSpent: action.payload,
      };
    case SET_UTILIZED_HOURS_CHART_DATA:
      return {
        ...state,
        utilizedHoursChart: action.payload,
      };
    case SET_REVENUE_GENERATED_CHART_DATA:
      return {
        ...state,
        revenueGeneratedChartData: action.payload,
      };
    case SET_PROJECT_SUMMARY_CHART_DATA:
      return {
        ...state,
        projectSummaryChartData: action.payload,
      };
    case SET_RESOURCE_SUMMARY_REPORT:
      return {
        ...state,
        resourceSummary: action.payload,
      };
    case SET_AVG_UTILIZATION_RATE_OF_RESOURCE:
      return {
        ...state,
        avgUtilizationRate: action.payload,
      };
    case SET_TASK_BY_PRIORITY_REPORT:
      return {
        ...state,
        taskPriorityReportChartData: action.payload,
      };

    case SET_TASK_IMP_DISTRIBUTION_BY_PROJECT:
      return {
        ...state,
        taskImportantDistributionByProject: action.payload,
      };
    case SET_TASK_WITH_MOST_LOGGED_HOURS_OVERALL:
      return {
        ...state,
        taskWithMostLoggedHors: action.payload,
      };
    case SET_DUE_INVOICE_AMOUNT:
      return {
        ...state,
        dueInvoiceAmount: action.payload,
      };
    case SET_DISTRIBUTION_CHART_DATA:
      return {
        ...state,
        distributionChart: action.payload,
      };
    case SET_TICKET_SUMMARY_TILL_DATE_AND_MONTH:
      return {
        ...state,
        ticketSummaryChart: action.payload,
      };
    case SET_TICKET_TABLE_DATA:
      return {
        ...state,
        ticketSummaryTableData: action.payload,
      };
    case SET_EXPENSE_VS_INCOME_TABLE_DATA:
      return {
        ...state,
        expenseVsIncomeTableData: action.payload,
      };
    case SET_INVOICE_TABLE_DATA:
      return {
        ...state,
        invoiceReportTableData: action.payload,
      };
    case SET_LEAVES_REPORT_DATA_TABLE:
      return {
        ...state,
        leavesReportTableData: action.payload,
      };
    case SET_CLIENT_DETAIL_REPORT_TABLE_DATA:
      return {
        ...state,
        clientDetailReportTableData: action.payload,
      };
    case SET_TASK_STATUS_REPORT_TABLE_DATA:
      return {
        ...state,
        taskStatusReportTableData: action.payload,
      };
    case SET_NUMBER_OF_TICKETS_RAISED_BY_REASONS_CHART:
      return {
        ...state,
        ticketsRaisedByReasonChartData: action.payload,
      };
    case SET_RESOURCE_TIMESHEET_TABLEDATA:
      return {
        ...state,
        resourceTimesheetReportTableData: action.payload,
      };
    case SET_COMPOSITION_OF_LEAVE:
      return {
        ...state,
        compositionOfLeaveChart: action.payload,
      };
    case SET_TOTAL_COMPANY_DAYOFFS:
      return {
        ...state,
        totalComapnyDayOffs: action.payload,
      };
    case SET_DISTRIBUTION_OF_TASK_BY_PROJECT:
      return {
        ...state,
        distributionOfTaskByProject: action.payload,
      };
    case SET_LAST_MONTH_LEAVES_BY_EMPLOYEE:
      return {
        ...state,
        lastMonthLeavesTakenByUsers: action.payload,
      };
    default:
      return state;
  }
}
