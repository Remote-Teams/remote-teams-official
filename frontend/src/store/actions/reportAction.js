import axios from "axios";
import { url, workspaceId } from "./config";
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
import setAuthToken from "./../utils/setAuthToken";
import Toast from "light-toast";
import isEmpty from "../validations/is-empty";
import dateFns from "date-fns";

/*=================================================================================================
                                        Project Status Report Section
==================================================================================================*/

/*============================================
    Project Status Report completion status
=============================================*/

export const getCompletionStatus = (projectId) => async (dispatch) => {
  const headers = {
    "Content-Type": "application/json",
    workspaceId: workspaceId,
  };
  try {
    let { data } = await axios.get(
      `${url}/api/projects/compReport/${projectId}`,
      {
        headers: headers,
      }
    );
    if (data) {
      dispatch({
        type: SET_PROJECT_TASK_COMPLETION_STATUS,
        payload: data,
      });
    }
  } catch (err) {
    console.log(err);
  }
};

/*============================================
       Project Health
=============================================*/

export const getProjectHealth = (projectId) => async (dispatch) => {
  const headers = {
    "Content-Type": "application/json",
    workspaceId: workspaceId,
  };
  try {
    let { data } = await axios.get(
      `${url}/api/projects/projectHealth/${projectId}`,
      {
        headers: headers,
      }
    );
    if (data) {
      dispatch({
        type: SET_PROJECT_HEALTH,
        payload: data,
      });
    }
  } catch (err) {
    console.log(err);
  }
};

/*================================================
            Get Project CountDown
==================================================*/

export const getProjectCountDown = (projectId) => async (dispatch) => {
  const headers = {
    "Content-Type": "application/json",
    workspaceId: workspaceId,
  };
  try {
    let { data } = await axios.get(
      `${url}/api/projects/countdown/${projectId}`,
      {
        headers: headers,
      }
    );
    if (data) {
      // console.log(data);
      dispatch({
        type: SET_PROJECT_COUNTDOWN_IN_REPORTS,
        payload: data,
      });
    }
  } catch (err) {
    console.log(err);
  }
};

/*============================================
   Get Overall Budget Spent And remaining
=============================================*/

export const getOverallBudgetSpent = (projectId) => async (dispatch) => {
  const headers = {
    "Content-Type": "application/json",
    workspaceId: workspaceId,
  };
  try {
    let { data } = await axios.get(
      `${url}/api/projects/budgetSpent/${projectId} `,
      {
        headers: headers,
      }
    );
    if (data) {
      dispatch({
        type: SET_OVERALL_BUDGET_SPENT_CHART,
        payload: data,
      });
    }
  } catch (err) {
    console.log(err);
  }
};

/*============================================
              Get Utilized Hours
=============================================*/

export const getUtilizedHors = (projectId) => async (dispatch) => {
  const headers = {
    "Content-Type": "application/json",
    workspaceId: workspaceId,
  };
  try {
    let { data } = await axios.get(
      `${url}/api/projects/utilizedHours/${projectId}`,
      {
        headers: headers,
      }
    );
    if (data) {
      dispatch({
        type: SET_UTILIZED_HOURS_CHART_DATA,
        payload: data,
      });
    }
  } catch (err) {
    console.log(err);
  }
};

/*=================================================================================================
                                                Resource Timesheet Report
==================================================================================================*/

/*============================================
    resource type distribution count
=============================================*/

export const getResourceTypeDistributionChartCount = () => async (dispatch) => {
  const headers = {
    "Content-Type": "application/json",
    workspaceId: workspaceId,
  };
  try {
    let { data } = await axios.get(`${url}/api/users/overview?key=memberType`, {
      headers: headers,
    });
    if (data) {
      let fullTimeCount = data.filter((emp) => emp._id === "FULLTIME");
      let freelancerCount = data.filter((emp) => emp._id === "FREELANCER");
      let contractCount = data.filter((emp) => emp._id === "CONTRACTUAL");

      // console.log(fullTimeCount, freelancerCount, contractCount);
      const chartData = {
        label: ["FULLTIME", "FREELANCER", "ON CONTARCT"],
        data: [
          !isEmpty(fullTimeCount) ? fullTimeCount[0].count : 0,
          !isEmpty(freelancerCount) ? freelancerCount[0].count : 0,
          !isEmpty(contractCount) ? contractCount[0].count : 0,
        ],
      };

      dispatch({
        type: SET_RESOURCE_DISTRIBUTION_COUNT,
        payload: chartData,
      });
    }
  } catch (err) {
    console.log(err);
  }
};

/*============================================
    resource type distribution percentage
=============================================*/

export const getResourceTypeDistributionChartPercent = () => async (
  dispatch
) => {
  const headers = {
    "Content-Type": "application/json",
    workspaceId: workspaceId,
  };
  try {
    let { data } = await axios.get(`${url}/api/users/userDistribution`, {
      headers: headers,
    });
    if (data) {
      dispatch({
        type: SET_RESOURCE_DISTRIBUTION_PERCENT,
        payload: data,
      });
    }
  } catch (err) {
    console.log(err);
  }
};

/*============================================
      Resource Summary
=============================================*/

export const getResourceSummary = () => async (dispatch) => {
  const headers = {
    "Content-Type": "application/json",
    workspaceId: workspaceId,
  };
  try {
    let { data } = await axios.get(`${url}/api/users/resourceSummary`, {
      headers: headers,
    });
    if (data) {
      dispatch({
        type: SET_RESOURCE_SUMMARY_REPORT,
        payload: data,
      });
    }
  } catch (err) {
    console.log(err);
  }
};

/*============================================
            Avg Utilization Rate
=============================================*/

export const getAvUtilizationRate = () => async (dispatch) => {
  const headers = {
    "Content-Type": "application/json",
    workspaceId: workspaceId,
  };
  try {
    let { data } = await axios.get(`${url}/api/users/avgUtilRate`, {
      headers: headers,
    });
    if (data) {
      dispatch({
        type: SET_AVG_UTILIZATION_RATE_OF_RESOURCE,
        payload: data,
      });
    }
  } catch (err) {
    console.log(err);
  }
};

/*============================================
    Resource Timesheet report table data
=============================================*/

export const getResourceTimesheetTableData = () => async (dispatch) => {
  const headers = {
    "Content-Type": "application/json",
    workspaceId: workspaceId,
  };
  try {
    let { data } = await axios.get(`${url}/api/users/summaryTab`, {
      headers: headers,
    });
    if (data) {
      // console.log(data);
      dispatch({
        type: SET_RESOURCE_TIMESHEET_TABLEDATA,
        payload: data,
      });
    }
  } catch (err) {
    console.log(err);
  }
};

/*=================================================================================================
                                        Expense vs Income Report
==================================================================================================*/

/*============================================
        Total Expense This Month
=============================================*/

export const getTotalExpenseThisMonth = () => async (dispatch) => {
  const headers = {
    "Content-Type": "application/json",
    workspaceId: workspaceId,
  };
  let startOfMonth = dateFns.startOfMonth(new Date()).toISOString();
  let endOfMonth = dateFns.endOfMonth(new Date()).toISOString();
  try {
    let { data } = await axios.get(
      `${url}/api/expenses/totalExpenseThisMonth?from=${startOfMonth}&to=${endOfMonth}`,
      {
        headers: headers,
      }
    );
    if (data) {
      dispatch({
        type: SET_TOTAL_EXPENSE_THIS_MONTH,
        payload: data,
      });
    }
  } catch (err) {
    console.log(err);
  }
};

/*============================================
        Total Paid Invoices this Month
=============================================*/

export const getTotalPaidInvoiceThisMonth = () => async (dispatch) => {
  const headers = {
    "Content-Type": "application/json",
    workspaceId: workspaceId,
  };
  let startOfMonth = dateFns.startOfMonth(new Date()).toISOString();
  let endOfMonth = dateFns.endOfMonth(new Date()).toISOString();
  try {
    let { data } = await axios.get(
      `${url}/api/invoices/revenueThisMonth?from=${startOfMonth}&to=${endOfMonth}`,
      {
        headers: headers,
      }
    );
    if (data) {
      dispatch({
        type: SET_TOTAL_REVENUE_THIS_MONTH,
        payload: data,
      });
    }
  } catch (err) {
    console.log(err);
  }
};

/*==============================================
    Get Total Subscription Cost This month
================================================*/

export const getTotalSubscriptionCostThisMonth = () => async (dispatch) => {
  const headers = {
    "Content-Type": "application/json",
    workspaceId: workspaceId,
  };
  try {
    let { data } = await axios.get(`${url}/api/expenseSubscriptions/tsubs`, {
      headers: headers,
    });
    if (data) {
      dispatch({
        type: SET_TOTAL_SUBSCRIPTION_COST_THIS_MONTH,
        payload: data,
      });
    }
  } catch (err) {
    console.log(err);
  }
};

/*======================================================
    Get Total Billed and Unbilled invoices this month
=========================================================*/

export const getTotalBilledAndUnbilledExpanseThisMonth = () => async (
  dispatch
) => {
  const headers = {
    "Content-Type": "application/json",
    workspaceId: workspaceId,
  };
  let startOfMonth = dateFns.startOfMonth(new Date()).toISOString();
  let endOfMonth = dateFns.endOfMonth(new Date()).toISOString();
  try {
    let { data } = await axios.get(
      `${url}/api/expenses/monthlyExpenseType?from=${startOfMonth}&to=${endOfMonth}`,
      {
        headers: headers,
      }
    );
    if (data) {
      dispatch({
        type: SET_TOTAL_BILLED_AND_UNBILLED_EXPENSES_THIS_MONTH,
        payload: data,
      });
    }
  } catch (err) {
    console.log(err);
  }
};

/*==============================================================
              EXPENSE VS INCOME
===============================================================*/

export const getExpenseData = () => async (dispatch) => {
  const headers = {
    "Content-Type": "application/json",
    workspaceId: workspaceId,
  };
  try {
    let { data } = await axios.get(
      `${url}/api/expenses/yearlyExpenseReport`,

      {
        headers: headers,
      }
    );
    if (data) {
      //   console.log(data);
      dispatch(paidInvoicesIssuedByMonth());
      dispatch({
        type: SET_EXPENSE_VS_INCOME_CHART_DATA,
        payload: data,
      });
    }
  } catch (err) {
    console.log(err);
  }
};

export const paidInvoicesIssuedByMonth = () => async (dispatch) => {
  const headers = {
    "Content-Type": "application/json",
    workspaceId: workspaceId,
  };
  try {
    let { data } = await axios.get(
      `${url}/api/invoices/paidInvoicesByMonths`,

      {
        headers: headers,
      }
    );
    if (data) {
      // console.log(data);
      dispatch({
        type: SET_PAID_INVOICE_REPORT_ISSUED_CHART_DATA,
        payload: data,
      });
    }
  } catch (err) {
    console.log(err);
  }
};

/*==============================================================
              EXPENSE VS INCOME TABLE DATA 
===============================================================*/

export const getExpanseVsIncomeTableData = (
  projectId,
  fromData,
  toDate
) => async (dispatch) => {
  const headers = {
    "Content-Type": "application/json",
    workspaceId: workspaceId,
  };
  try {
    let { data } = await axios.get(
      `${url}/api/expenses/summaryTab?project=${projectId}&from=${fromData}&to=${toDate}`,

      {
        headers: headers,
      }
    );
    if (data) {
      //   console.log(data);
      dispatch({
        type: SET_EXPENSE_VS_INCOME_TABLE_DATA,
        payload: data,
      });
    }
  } catch (err) {
    console.log(err);
  }
};

/*=================================================================================================
                                            Task Status Report
==================================================================================================*/
/*============================================
      Get Task Status Report
=============================================*/

export const getTaskImportantDistributionByProject = () => async (dispatch) => {
  const headers = {
    "Content-Type": "application/json",
    workspaceId: workspaceId,
  };
  try {
    let { data } = await axios.get(`${url}/api/tasks/impPerProj`, {
      headers: headers,
    });
    if (data) {
      dispatch({
        type: SET_TASK_IMP_DISTRIBUTION_BY_PROJECT,
        payload: data,
      });
    }
  } catch (err) {
    console.log(err);
  }
};

/*============================================
      Get Task Status Report
=============================================*/

export const getTaskStatusReportTableData = () => async (dispatch) => {
  const headers = {
    "Content-Type": "application/json",
    workspaceId: workspaceId,
  };
  try {
    let { data } = await axios.get(`${url}/api/tasks/summaryTab`, {
      headers: headers,
    });
    if (data) {
      // console.log(data);
      dispatch({
        type: SET_TASK_STATUS_REPORT_TABLE_DATA,
        payload: data[0],
      });
    }
  } catch (err) {
    console.log(err);
  }
};

/*============================================
    Disrtibution of task by project chart
=============================================*/

export const getDistributionOfTasksByProjectChart = () => async (dispatch) => {
  const headers = {
    "Content-Type": "application/json",
    workspaceId: workspaceId,
  };
  try {
    let { data } = await axios.get(`${url}/api/tasks/countByProject`, {
      headers: headers,
    });
    if (data) {
      // console.log(data);
      let labelArray = [];
      let countArray = [];
      data.forEach((element) => {
        labelArray.push(element.project.name);
        countArray.push(element.count);
      });

      // console.log(labelArray);

      let chartData = {
        labelArray,
        countArray,
      };

      dispatch({
        type: SET_DISTRIBUTION_OF_TASK_BY_PROJECT,
        payload: chartData,
      });
    }
  } catch (err) {
    console.log(err);
  }
};

/*============================================
    Disrtibution of task by project priority
=============================================*/

export const getDistributionOfTasksByPriorityChart = () => async (dispatch) => {
  const headers = {
    "Content-Type": "application/json",
    workspaceId: workspaceId,
  };
  try {
    let { data } = await axios.get(`${url}/api/tasks/priorityDist`, {
      headers: headers,
    });
    if (data) {
      // console.log(data);
      dispatch({
        type: SET_TASK_BY_PRIORITY_REPORT,
        payload: data,
      });
    }
  } catch (err) {
    console.log(err);
  }
};

/*============================================
    TASK WITH MOST LOGGED HORS OVERALL
=============================================*/

export const taskWithMostLoggedHoursOverall = () => async (dispatch) => {
  const headers = {
    "Content-Type": "application/json",
    workspaceId: workspaceId,
  };
  try {
    let { data } = await axios.get(`${url}/api/tasks/hrsLog`, {
      headers: headers,
    });
    if (data) {
      dispatch({
        type: SET_TASK_WITH_MOST_LOGGED_HOURS_OVERALL,
        payload: data,
      });
    }
  } catch (err) {
    console.log(err);
  }
};

/*=================================================================================================
                                        Invoices Report
==================================================================================================*/

/*============================================
      Total Invoiced Amount Till Date
=============================================*/

export const getTotalInvoicedAmountTillDate = () => async (dispatch) => {
  const headers = {
    "Content-Type": "application/json",
    workspaceId: workspaceId,
  };
  try {
    let { data } = await axios.get(`${url}/api/invoices/reports/summary`, {
      headers: headers,
    });
    if (data) {
      dispatch({
        type: SET_TOTAL_PAID_AND_TOTAL_INVOICED_AMOUNT,
        payload: data,
      });
    }
  } catch (err) {
    console.log(err);
  }
};

/*============================================
          Total Invoices Count
=============================================*/

export const totalInvoicesCount = () => async (dispatch) => {
  const headers = {
    "Content-Type": "application/json",
    workspaceId: workspaceId,
  };
  try {
    let { data } = await axios.get(`${url}/api/invoices/count`, {
      headers: headers,
    });
    if (data) {
      dispatch({
        type: SET_TOTAL_NUMBER_OF_INVOICES,
        payload: data,
      });
    }
  } catch (err) {
    console.log(err);
  }
};

/*===============================================
            Due Invoice Amount
=================================================*/

export const getDueInvoiceAmount = () => async (dispatch) => {
  const headers = {
    "Content-Type": "application/json",
    workspaceId: workspaceId,
  };
  try {
    let { data } = await axios.get(`${url}/api/invoices/dueTillDate`, {
      headers: headers,
    });
    if (data) {
      dispatch({
        type: SET_DUE_INVOICE_AMOUNT,
        payload: data,
      });
    }
  } catch (err) {
    console.log(err);
  }
};

/*===============================================
             Set Distribution Chart
=================================================*/

export const getDistributionChartData = () => async (dispatch) => {
  const headers = {
    "Content-Type": "application/json",
    workspaceId: workspaceId,
  };
  try {
    let { data } = await axios.get(`${url}/api/invoices/invDist`, {
      headers: headers,
    });
    if (data) {
      let overdueInvoiceData = data.filter((data) => data._id === "OVERDUE");
      let paidInvoiceData = data.filter((data) => data._id === "PAID");
      let openInvoiceData = data.filter((data) => data._id === "OPEN");
      let draftInvoiceData = data.filter((data) => data._id === "DRAFT");
      let sentInvoiceData = data.filter((data) => data._id === "SENT");

      let chartData = {
        label: ["OVERDUE", "PAID", "OPEN", "DRAFT", "SENT"],
        data: [
          overdueInvoiceData[0].count,
          paidInvoiceData[0].count,
          openInvoiceData[0].count,
          draftInvoiceData[0].count,
          sentInvoiceData[0].count,
        ],
      };

      dispatch({
        type: SET_DISTRIBUTION_CHART_DATA,
        payload: chartData,
      });
      // console.log(data);
    }
  } catch (err) {
    console.log(err);
  }
};

/*===============================================
        Invoice Report Table Data
=================================================*/

export const getInvoiceTableData = (fromData, toDate) => async (dispatch) => {
  const headers = {
    "Content-Type": "application/json",
    workspaceId: workspaceId,
  };
  try {
    let { data } = await axios.get(
      `${url}/api/invoices/summaryTab?from=${fromData}&to=${toDate}`,
      {
        headers: headers,
      }
    );
    if (data) {
      dispatch({
        type: SET_INVOICE_TABLE_DATA,
        payload: data,
      });
    }
  } catch (err) {
    console.log(err);
  }
};

/*=================================================================================================
                                        Client Details Report
==================================================================================================*/

/*=====================================
    Get Composition Of Clients
=======================================*/
export const getCompositionOfClients = () => async (dispatch) => {
  const headers = {
    "Content-Type": "application/json",
    workspaceId: workspaceId,
  };
  try {
    let { data } = await axios.get(`${url}/api/clients/overview?key=status`, {
      headers: headers,
    });
    if (data) {
      // console.log(data);

      let activeClient = data.filter((client) => client._id === "ACTIVE");
      let inActiveClient = data.filter((client) => client._id === "INACTIVE");

      const finalData = {
        activeClientCount: !isEmpty(activeClient) ? activeClient[0].count : 0,
        inactiveClientCount: !isEmpty(inActiveClient)
          ? inActiveClient[0].count
          : 0,
        chartData: [
          !isEmpty(activeClient) ? activeClient[0].count : 0,
          !isEmpty(inActiveClient) ? inActiveClient[0].count : 0,
        ],
      };

      dispatch({
        type: SET_CLIENTS_COMPOSITION,
        payload: finalData,
      });
    }
  } catch (err) {
    console.log(err);
  }
};

/*=====================================
    Get Composition Of Clients
=======================================*/
export const getTotalClientCount = () => async (dispatch) => {
  const headers = {
    "Content-Type": "application/json",
    workspaceId: workspaceId,
  };
  try {
    let { data } = await axios.get(`${url}/api/clients/count`, {
      headers: headers,
    });
    if (data) {
      dispatch({
        type: SET_TOTAL_CLIENTS_COUNT,
        payload: data,
      });
    }
  } catch (err) {
    console.log(err);
  }
};

/*=====================================
   Revenue Generated Chart 
=======================================*/
export const getRevenueGeneratedTillDate = () => async (dispatch) => {
  const headers = {
    "Content-Type": "application/json",
    workspaceId: workspaceId,
  };
  try {
    let { data } = await axios.get(`${url}/api/invoices/revenueTillDate`, {
      headers: headers,
    });
    if (data) {
      // console.log(data);
      let revenueTillDateData = !isEmpty(data) ? data[0].totalamount : 0;
      dispatch(getRevenueGeneratedThisMonth(revenueTillDateData));
    }
  } catch (err) {
    console.log(err);
  }
};

/*=====================================
   Revenue Generated Chart 
=======================================*/
export const getRevenueGeneratedThisMonth = (revenueTillDateData) => async (
  dispatch
) => {
  const headers = {
    "Content-Type": "application/json",
    workspaceId: workspaceId,
  };
  let startOfMonth = dateFns.startOfMonth(new Date()).toISOString();
  let endOfMonth = dateFns.endOfMonth(new Date()).toISOString();
  try {
    let { data } = await axios.get(
      `${url}/api/invoices/revenueThisMonth?from=${startOfMonth}&to=${endOfMonth}`,
      {
        headers: headers,
      }
    );
    if (data) {
      // console.log(revenueTillDateData);
      // console.log(data);
      let revenueThisMonth = !isEmpty(data) ? data[0].totalamount : 0;
      const chartData = {
        label: ["TILL DATE", "THIS MONTH"],
        data: [revenueTillDateData, revenueThisMonth],
      };

      dispatch({
        type: SET_REVENUE_GENERATED_CHART_DATA,
        payload: chartData,
      });
    }
  } catch (err) {
    console.log(err);
  }
};

/*=====================================
        Project Summary Chart
=======================================*/
export const getTotalNumberOfTasksTillDate = () => async (dispatch) => {
  const headers = {
    "Content-Type": "application/json",
    workspaceId: workspaceId,
  };
  try {
    let { data } = await axios.get(`${url}/api/tasks/count`, {
      headers: headers,
    });
    if (data) {
      // console.log(data);
      let totalTasksCount = data.count;
      dispatch(getTotalNumberOfTasksThisMonth(totalTasksCount));
    }
  } catch (err) {
    console.log(err);
  }
};

/*=====================================
        Project Summary Chart
=======================================*/
export const getTotalNumberOfTasksThisMonth = (totalTasksCount) => async (
  dispatch
) => {
  const headers = {
    "Content-Type": "application/json",
    workspaceId: workspaceId,
  };
  let startOfMonth = dateFns.startOfMonth(new Date()).toISOString();
  let endOfMonth = dateFns.endOfMonth(new Date()).toISOString();
  try {
    let { data } = await axios.get(
      `${url}/api/tasks/totalTasksThisMonth?from=${startOfMonth}&to=${endOfMonth}`,
      {
        headers: headers,
      }
    );
    if (data) {
      // console.log(totalTasksCount);
      let totalTasksCountThisMonth = !isEmpty(data) ? data[0].count : 0;

      const chartData = {
        label: ["TILL NOW", "THIS MONTH"],
        data: [totalTasksCount, totalTasksCountThisMonth],
      };

      dispatch({
        type: SET_PROJECT_SUMMARY_CHART_DATA,
        payload: chartData,
      });
    }
  } catch (err) {
    console.log(err);
  }
};

/*=====================================
    Get Client Detail Report table Data
=======================================*/
export const getClientDetailReportTableData = () => async (dispatch) => {
  const headers = {
    "Content-Type": "application/json",
    workspaceId: workspaceId,
  };
  try {
    let { data } = await axios.get(`${url}/api/clients/summaryTab`, {
      headers: headers,
    });
    if (data) {
      // console.log(data);
      dispatch({
        type: SET_CLIENT_DETAIL_REPORT_TABLE_DATA,
        payload: data,
      });
    }
  } catch (err) {
    console.log(err);
  }
};

/*=================================================================================================
                                        Leave Data Report
==================================================================================================*/

/*=====================================
        Get leave table report
=======================================*/
export const getLeaveDataTable = (fromDate, toDate) => async (dispatch) => {
  const headers = {
    "Content-Type": "application/json",
    workspaceId: workspaceId,
  };
  try {
    let { data } = await axios.get(
      `${url}/api/leaves/summaryTab?from=${fromDate}&to=${toDate}`,
      {
        headers: headers,
      }
    );
    if (data) {
      dispatch({
        type: SET_LEAVES_REPORT_DATA_TABLE,
        payload: data,
      });
    }
  } catch (err) {
    console.log(err);
  }
};

/*=============================================
    Composition of leaves taken this month
===============================================*/
export const getCompositionOfLeavesTakenThisMonthChart = () => async (
  dispatch
) => {
  const headers = {
    "Content-Type": "application/json",
    workspaceId: workspaceId,
  };
  try {
    let { data } = await axios.get(`${url}/api/leaves/composition`, {
      headers: headers,
    });
    if (data) {
      let annualLeaves = data.filter((leave) => leave._id === "ANNUAL_LEAVES");
      let sickLeaves = data.filter((leave) => leave._id === "SICK_LEAVE");
      let paidLeaves = data.filter((leave) => leave._id === "PAID_LEAVES");
      let unpaidLeaves = data.filter((leave) => leave._id === "UNPAID_LEAVE");

      let chartData = {
        label: ["ANNUAL", "OTHER", "MEDICAL"],
        data: [
          0,
          !isEmpty(unpaidLeaves) ? unpaidLeaves[0].count : 0,
          !isEmpty(sickLeaves) ? sickLeaves[0].count : 0,
        ],
      };

      console.log(sickLeaves);

      dispatch({
        type: SET_COMPOSITION_OF_LEAVE,
        payload: chartData,
      });
    }
  } catch (err) {
    console.log(err);
  }
};

/*=====================================
    Get Company Dayoff Count
=======================================*/
export const getCompanyDaysOffCount = () => async (dispatch) => {
  const headers = {
    "Content-Type": "application/json",
    workspaceId: workspaceId,
  };
  try {
    let { data } = await axios.get(`${url}/api/leaves/holiday`, {
      headers: headers,
    });
    if (data) {
      // console.log(data);
      dispatch({
        type: SET_TOTAL_COMPANY_DAYOFFS,
        payload: data,
      });
    }
  } catch (err) {
    console.log(err);
  }
};

/*=============================================
    Resources who availed leaves last month
================================================*/
export const getResourcesWhoAvailedLeavesLastMonth = () => async (dispatch) => {
  const headers = {
    "Content-Type": "application/json",
    workspaceId: workspaceId,
  };
  try {
    let { data } = await axios.get(`${url}/api/leaves/last-month-leaves`, {
      headers: headers,
    });
    if (data) {
      // console.log(data);
      dispatch({
        type: SET_LAST_MONTH_LEAVES_BY_EMPLOYEE,
        payload: data,
      });
    }
  } catch (err) {
    console.log(err);
  }
};

/*=================================================================================================
                                        Support Summary Report
==================================================================================================*/

/*=====================================
    Ticket summary this month
=======================================*/
export const ticketSummaryThisMonth = () => async (dispatch) => {
  const headers = {
    "Content-Type": "application/json",
    workspaceId: workspaceId,
  };
  let startOfMonth = dateFns.startOfMonth(new Date()).toISOString();
  let endOfMonth = dateFns.endOfMonth(new Date()).toISOString();

  try {
    let { data } = await axios.get(
      `${url}/api/tickets/ticketSummaryByTimeRange?from=${startOfMonth}&to=${endOfMonth}`,
      {
        headers: headers,
      }
    );
    if (data) {
      dispatch(ticketSummaryTillDate(data));
    }
  } catch (err) {
    console.log(err);
  }
};

/*=====================================
    Ticket summary till date
=======================================*/
export const ticketSummaryTillDate = (ticketSummaryThisMonthData) => async (
  dispatch
) => {
  const headers = {
    "Content-Type": "application/json",
    workspaceId: workspaceId,
  };
  try {
    let { data } = await axios.get(`${url}/api/tickets/ticketSummaryTillDate`, {
      headers: headers,
    });
    if (data) {
      // console.log(ticketSummaryThisMonthData);

      let chartDataTillDate = {
        label: ["RAISED", "CLOSED"],
        data: [data[1], data[3]],
      };

      let chartDataThisMonth = {
        label: ["RAISED", "CLOSED"],
        data: [ticketSummaryThisMonthData[1], ticketSummaryThisMonthData[3]],
      };

      let finalData = {
        chartDataTillDate,
        chartDataThisMonth,
      };

      dispatch({
        type: SET_TICKET_SUMMARY_TILL_DATE_AND_MONTH,
        payload: finalData,
      });
    }
  } catch (err) {
    console.log(err);
  }
};

/*=====================================
    Get number of tickets raised
=======================================*/
export const ticketRaisedChart = () => async (dispatch) => {
  const headers = {
    "Content-Type": "application/json",
    workspaceId: workspaceId,
  };
  try {
    let { data } = await axios.get(`${url}/api/support/overview?key=status`, {
      headers: headers,
    });
    if (data) {
      // console.log(data);
    }
  } catch (err) {
    console.log(err);
  }
};

/*=====================================
    Ticket Summary Table Report
=======================================*/
export const getTicketSummaryTableReport = (fromData, toDate) => async (
  dispatch
) => {
  const headers = {
    "Content-Type": "application/json",
    workspaceId: workspaceId,
  };

  try {
    let { data } = await axios.get(
      `${url}/api/tickets/summaryTab?from=${fromData}&to=${toDate}`,
      {
        headers: headers,
      }
    );
    if (data) {
      dispatch({
        type: SET_TICKET_TABLE_DATA,
        payload: data,
      });
    }
  } catch (err) {
    console.log(err);
  }
};

/*=================================================
    Get number of tickets raised by reason graph
===================================================*/
export const getNumberOfTicketsRaisedByReasonChart = () => async (dispatch) => {
  const headers = {
    "Content-Type": "application/json",
    workspaceId: workspaceId,
  };

  try {
    let { data } = await axios.get(`${url}/api/tickets/summaryReport`, {
      headers: headers,
    });
    if (data) {
      // console.log(data);

      let chartData = {
        label: data[0],
        data: data[1],
      };

      dispatch({
        type: SET_NUMBER_OF_TICKETS_RAISED_BY_REASONS_CHART,
        payload: chartData,
      });
    }
  } catch (err) {
    console.log(err);
  }
};
