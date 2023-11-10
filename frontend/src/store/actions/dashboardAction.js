import axios from "axios";
import { url, workspaceId } from "./config";
import {} from "./../types";
import setAuthToken from "./../utils/setAuthToken";
import Toast from "light-toast";
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
  SET_LOADER,
  CLEAR_LOADER,
} from "./../types";
import getDayOfYear from "date-fns/get_day_of_year";

/*=====================================================================================
                            To Do Section
=======================================================================================*/

/*====================================================================
                        Create To Do Action
======================================================================*/

export const createToDo = (formData, callBackAddTodo) => async (dispatch) => {
  const headers = {
    "Content-Type": "application/json",
    workspaceId: workspaceId,
  };
  dispatch({
    type: SET_LOADER,
    payload: true,
  });
  try {
    let { data, status } = await axios.post(`${url}/api/todos`, formData, {
      headers: headers,
    });
    if (data) {
      Toast.info("To do Created", 3000);
      dispatch(getAllToDo());
      callBackAddTodo(status);
      dispatch({
        type: CLEAR_LOADER,
        payload: false,
      });
    }
  } catch (err) {
    console.log(err);
    dispatch({
      type: CLEAR_LOADER,
      payload: false,
    });
  }
};

/*====================================================================
                        Get All To Do action
======================================================================*/

export const getAllToDo = () => async (dispatch) => {
  const headers = {
    "Content-Type": "application/json",
    workspaceId: workspaceId,
  };

  try {
    let { data, status } = await axios.get(
      `${url}/api/todos?pageNo=1&pageSize=10`,
      {
        headers: headers,
      }
    );
    if (data) {
      dispatch({
        type: SET_TODOS,
        payload: data,
      });
    }
  } catch (err) {
    console.log(err);
  }
};

/*====================================================================
                        Update ToDo
======================================================================*/

export const updateToDo = (todoId, formData, callbackUpdate) => async (
  dispatch
) => {
  const headers = {
    "Content-Type": "application/json",
    workspaceId: workspaceId,
  };
  dispatch({
    type: SET_LOADER,
    payload: true,
  });
  try {
    let { data, status } = await axios.put(
      `${url}/api/todos/${todoId}`,
      formData,
      {
        headers: headers,
      }
    );
    if (data) {
      Toast.info("Todo Updated", 3000);
      dispatch(getAllToDo());
      if (callbackUpdate) {
        callbackUpdate(status);
      }
      dispatch({
        type: CLEAR_LOADER,
        payload: false,
      });
    }
  } catch (err) {
    console.log(err);
    dispatch({
      type: CLEAR_LOADER,
      payload: false,
    });
  }
};

/*====================================================================
                      Delete to do list
======================================================================*/

export const deleteToDoById = (todoId) => async (dispatch) => {
  const headers = {
    "Content-Type": "application/json",
    workspaceId: workspaceId,
  };
  dispatch({
    type: SET_LOADER,
    payload: true,
  });
  try {
    let { data, status } = await axios.delete(
      `${url}/api/todos/${todoId}`,

      {
        headers: headers,
      }
    );
    if (data) {
      Toast.info("Todo Deleted", 3000);
      dispatch(getAllToDo());
      dispatch({
        type: CLEAR_LOADER,
        payload: false,
      });
    }
  } catch (err) {
    console.log(err);
    dispatch({
      type: CLEAR_LOADER,
      payload: false,
    });
  }
};

/*====================================================================================
                                Dashboard Graph and Chart Section
======================================================================================*/

/*===================================================================
                Project Task Copletion Status 
=====================================================================*/
export const getProjectTaskCopletion = () => async (dispatch) => {
  const headers = {
    "Content-Type": "application/json",
    workspaceId: workspaceId,
  };
  try {
    let { data } = await axios.get(
      `${url}/api/tasks/projectTaskCompletionStatus`,

      {
        headers: headers,
      }
    );
    if (data) {
      dispatch({
        type: SET_PROJECT_COMPLETION_STATUS,
        payload: data,
      });
    }
  } catch (err) {
    console.log(err);
  }
};

/*====================================================================
                          INVOICES ISSUED  
======================================================================*/

export const invoicesIssuedByMonth = () => async (dispatch) => {
  const headers = {
    "Content-Type": "application/json",
    workspaceId: workspaceId,
  };
  try {
    let { data } = await axios.get(
      `${url}/api/invoices/invoicesIssuedByMonths`,

      {
        headers: headers,
      }
    );
    if (data) {
      //   console.log(data);
      dispatch({
        type: SET_ALL_INVOICE_ISSUED_CHART_DATA,
        payload: data,
      });
      dispatch(paidInvoicesIssuedByMonth());
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
        type: SET_PAID_INVOICE_ISSUED_CHART_DATA,
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
      dispatch({
        type: SET_EXPENSE_CHART_DATA,
        payload: data,
      });
    }
  } catch (err) {
    console.log(err);
  }
};

/*============================================================
                    YEARLY EXPENSE REPORT
==============================================================*/

export const getYearlyTotalExpense = () => async (dispatch) => {
  const headers = {
    "Content-Type": "application/json",
    workspaceId: workspaceId,
  };
  try {
    let { data } = await axios.get(`${url}/api/expenses/yearlyExpenseReport`, {
      headers: headers,
    });
    if (data) {
      dispatch({
        type: SET_YEARLY_TOTAL_EXPENSE,
        payload: data,
      });
    }
  } catch (err) {
    console.log(err);
  }
};

export const getYearlyBilledExpense = () => async (dispatch) => {
  const headers = {
    "Content-Type": "application/json",
    workspaceId: workspaceId,
  };
  try {
    let { data } = await axios.get(
      `${url}/api/expenses/yearlyBillableExpenses`,
      {
        headers: headers,
      }
    );
    if (data) {
      dispatch({
        type: SET_YEARLY_BILLED_EXPENSE,
        payload: data,
      });
    }
  } catch (err) {
    console.log(err);
  }
};

export const getYearlyMisExpense = () => async (dispatch) => {
  const headers = {
    "Content-Type": "application/json",
    workspaceId: workspaceId,
  };
  try {
    let { data } = await axios.get(
      `${url}/api/expenses/yearlyMiscellaneousExpenses`,
      {
        headers: headers,
      }
    );
    if (data) {
      dispatch({
        type: SET_YEARLY_MIS_EXPENSE,
        payload: data,
      });
    }
  } catch (err) {
    console.log(err);
  }
};

/*================================================
            INVOICE SUMMARY
==================================================*/

export const getInvoiceSummary = () => async (dispatch) => {
  const headers = {
    "Content-Type": "application/json",
    workspaceId: workspaceId,
  };
  try {
    let { data } = await axios.get(
      `${url}/api/invoices/invoiceSummaryPercent`,
      {
        headers: headers,
      }
    );
    if (data) {
      dispatch({
        type: SET_INVOICE_SUMMARY,
        payload: data,
      });
    }
  } catch (err) {
    console.log(err);
  }
};

/*================================================
            PROJECT TASK STATUS REPORT
==================================================*/

export const getProjectTaskStatusReport = () => async (dispatch) => {
  const headers = {
    "Content-Type": "application/json",
    workspaceId: workspaceId,
  };
  try {
    let { data } = await axios.get(`${url}/api/tasks/projectTaskStatusReport`, {
      headers: headers,
    });
    if (data) {
      // console.log(data);
      dispatch({
        type: SET_PROJECT_TASK_STATUS_REPORT,
        payload: data,
      });
    }
  } catch (err) {
    console.log(err);
  }
};

/*===================================================
                    Cost Varience
===================================================*/

export const getCostVariance = (projectId) => async (dispatch) => {
  const headers = {
    "Content-Type": "application/json",
    workspaceId: workspaceId,
  };
  try {
    let { data } = await axios.get(
      `${url}/api/projects/costVariance/${projectId}`,
      {
        headers: headers,
      }
    );
    if (data) {
      dispatch({
        type: SET_COST_VARIANCE,
        payload: data,
      });
    }
  } catch (err) {
    console.log(err);
  }
};

/*================================================
            Dashboard ticket summary
==================================================*/

export const getTicketSummary = () => async (dispatch) => {
  const headers = {
    "Content-Type": "application/json",
    workspaceId: workspaceId,
  };
  try {
    let { data } = await axios.get(`${url}/api/tickets/ticketSummary`, {
      headers: headers,
    });
    if (data) {
      // console.log(data);
      let finalArray = [];

      let percentage = data[1];

      let filterData = data[0].forEach((ticket, index) => {
        let ticketStatus = ticket;
        let ticketPercent = percentage[index].toFixed();

        // console.log(ticketPercent);

        let object = {
          ticketStatus,
          ticketPercent,
        };
        finalArray.push(object);
      });

      dispatch({
        type: SET_TICKET_SUMMARY_PERCENT,
        payload: finalArray,
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
        type: SET_PROJECT_COUNTDOWN,
        payload: data,
      });
    }
  } catch (err) {
    console.log(err);
  }
};

/*================================================
            get Project Timeline
==================================================*/

export const getProjectTimeline = (formData) => async (dispatch) => {
  const headers = {
    "Content-Type": "application/json",
    workspaceId: workspaceId,
  };
  try {
    let { data } = await axios.post(`${url}/api/activities/search`, formData, {
      headers: headers,
    });
    if (data) {
      // console.log(data);
      dispatch({
        type: SET_PROJECT_TIMELINE,
        payload: data,
      });
    }
  } catch (err) {
    console.log(err);
  }
};

/*====================================================================
                Dashboard Current task action 
=====================================================================*/

export const getCurrentTaskData = (formData) => async (dispatch) => {
  const headers = {
    "Content-Type": "application/json",
    workspaceId: workspaceId,
  };
  try {
    let { data } = await axios.post(
      `${url}/api/schedules/search`,
      formData,

      {
        headers: headers,
      }
    );
    if (data) {
      dispatch({
        type: SET_TODAYS_TASK,
        payload: data,
      });
    }
  } catch (err) {
    console.log(err);
  }
};

export const createWorkLog = (formData) => async (dispatch) => {
  const headers = {
    "Content-Type": "application/json",
    workspaceId: workspaceId,
  };
  try {
    let { data } = await axios.post(
      `${url}/api/worklogs`,
      formData,

      {
        headers: headers,
      }
    );
    if (data) {
      Toast.info("Task status changed", 3000);
      var userData = JSON.parse(localStorage.getItem("UserData"));

      const formData = {
        date: getDayOfYear(new Date()),
        user: userData.id,
      };
      dispatch(getCurrentTaskData(formData));
    }
  } catch (err) {
    console.log(err);
  }
};

export const updateWorklogByid = (worklogID, formData) => async (dispatch) => {
  const headers = {
    "Content-Type": "application/json",
    workspaceId: workspaceId,
  };
  try {
    let { data } = await axios.put(
      `${url}/api/worklogs/${worklogID} `,
      formData,
      {
        headers: headers,
      }
    );
    if (data) {
      Toast.info("Task updated", 3000);
      var userData = JSON.parse(localStorage.getItem("UserData"));

      const formData = {
        date: getDayOfYear(new Date()),
        user: userData.id,
      };
      dispatch(getCurrentTaskData(formData));
    }
  } catch (err) {
    console.log(err);
  }
};

export const getAllWorklog = () => async (dispatch) => {
  const headers = {
    "Content-Type": "application/json",
    workspaceId: workspaceId,
  };
  try {
    let { data } = await axios.get(
      `${url}/api/worklogs?pageNo=1&pageSize=100`,

      {
        headers: headers,
      }
    );
    if (data) {
      console.log(data);
    }
  } catch (err) {
    console.log(err);
  }
};
