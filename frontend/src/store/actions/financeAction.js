import axios from "axios";
import { url, workspaceId } from "./config";
import {
  SET_ALL_ANVOICES,
  SET_FINANCE_SUBSCIPTION,
  SET_ALL_SUBSCRIPTION_COUNT,
  SET_SUBSCRIPTION_OVERVIEW,
  SET_ALL_EXPANSES,
  SET_APPROVAL_EXPENSE,
  SET_EXPENSE_OVERVIEW,
  SET_INVOICE_OVERVIEW_TABLE,
  SET_EXPENSE_OVERVIEW_TABLE,
  SET_ALL_MESCELLANEOUS_EXPENSES,
  SET_LOADER,
  CLEAR_LOADER,
} from "./../types";
import setAuthToken from "./../utils/setAuthToken";
import Toast from "light-toast";
import { startOfMonth, endOfMonth } from "date-fns";

/*===========================================================================================================
                                              Invoice Sections
============================================================================================================*/

/*=============================================
        Create Invoice Action
==============================================*/
export const createInvoice = (formData, history) => async (dispatch) => {
  const headers = {
    "Content-Type": "application/json",
    workspaceId: workspaceId,
  };
  try {
    let { data } = await axios.post(`${url}/api/invoices`, formData, {
      headers: headers,
    });
    if (data) {
      const formData = {
        from: startOfMonth(new Date()).toISOString(),
        to: endOfMonth(new Date()).toISOString(),
      };

      dispatch(invoiceOverviewTableByDate(formData));
      history.push("/finances");
      console.log(data);
    }
  } catch (err) {
    console.log(err);
  }
};

/*===============================================
                Get All Invoices
=================================================*/
export const getAllInvoices = (formDate) => async (dispatch) => {
  const headers = {
    "Content-Type": "application/json",
    workspaceId: workspaceId,
  };
  dispatch({
    type: SET_LOADER,
    payload: true,
  });
  try {
    let { data } = await axios.post(`${url}/api/invoices/search`, formDate, {
      headers: headers,
    });
    if (data) {
      dispatch({
        type: SET_ALL_ANVOICES,
        payload: data,
      });
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

/*=====================================================
              Update Invoice By Id
=======================================================*/
export const updateInvoice = (invoiceId, formData, history) => async (
  dispatch
) => {
  const headers = {
    "Content-Type": "application/json",
    workspaceId: workspaceId,
  };
  try {
    let { data } = await axios.put(
      `${url}/api/invoices/${invoiceId}`,
      formData,
      {
        headers: headers,
      }
    );
    if (data) {
      let newStartDate = startOfMonth(new Date());
      let endStartDate = endOfMonth(new Date());

      const formDataGetInvoice = {
        query: {
          $and: [
            { createdAt: { $lte: new Date(endStartDate) } },
            { createdAt: { $gte: new Date(newStartDate) } },
          ],
        },
      };

      const formData = {
        from: startOfMonth(new Date()).toISOString(),
        to: endOfMonth(new Date()).toISOString(),
      };

      dispatch(invoiceOverviewTableByDate(formData));
      dispatch(getAllInvoices(formDataGetInvoice));
      history.push("/finances");
    }
  } catch (err) {
    console.log(err);
  }
};

/*=====================================================
                    Delete Invoice
=======================================================*/
export const deleteInvoices = (invoiceId) => async (dispatch) => {
  const headers = {
    "Content-Type": "application/json",
    workspaceId: workspaceId,
  };
  try {
    let { data } = await axios.delete(`${url}/api/invoices/${invoiceId}`, {
      headers: headers,
    });
    if (data) {
      let newStartDate = startOfMonth(new Date());
      let endStartDate = endOfMonth(new Date());

      const formDataGetInvoice = {
        query: {
          $and: [
            { createdAt: { $lte: new Date(endStartDate) } },
            { createdAt: { $gte: new Date(newStartDate) } },
          ],
        },
      };

      const formData = {
        from: startOfMonth(new Date()).toISOString(),
        to: endOfMonth(new Date()).toISOString(),
      };

      dispatch(invoiceOverviewTableByDate(formData));
      dispatch(getAllInvoices(formDataGetInvoice));
    }
  } catch (err) {
    console.log(err);
  }
};

/*========================================================
                Filter Invoices
==========================================================*/
export const filterInvoices = (formData) => async (dispatch) => {
  const headers = {
    "Content-Type": "application/json",
    workspaceId: workspaceId,
  };
  try {
    let { data } = await axios.post(`${url}/api/invoices/search`, formData, {
      headers: headers,
    });
    if (data) {
      console.log(data);
      dispatch({
        type: SET_ALL_ANVOICES,
        payload: data,
      });
    }
  } catch (err) {
    console.log(err);
  }
};

/*========================================================
            INVOICE OVERVIEW TABLE BY DATE
==========================================================*/
export const invoiceOverviewTableByDate = (formData) => async (dispatch) => {
  const headers = {
    "Content-Type": "application/json",
    workspaceId: workspaceId,
  };
  try {
    let { data } = await axios.post(`${url}/api/invoices/table`, formData, {
      headers: headers,
    });
    if (data) {
      dispatch({
        type: SET_INVOICE_OVERVIEW_TABLE,
        payload: data,
      });
    }
  } catch (err) {
    console.log(err);
  }
};

/*=========================================================================================================
                                              Expanse Section
===========================================================================================================*/
/*=============================================
                 Add Expanse
===============================================*/
export const addExpanses = (formData, history) => async (dispatch) => {
  const headers = {
    "Content-Type": "application/json",
    workspaceId: workspaceId,
  };
  try {
    let { data } = await axios.post(`${url}/api/expenses`, formData, {
      headers: headers,
    });
    if (data) {
      Toast.info("Expense Created", 3000);
      const formData = {
        from: startOfMonth(new Date()).toISOString(),
        to: endOfMonth(new Date()).toISOString(),
      };

      dispatch(expenseOverviewTableByDate(formData));
      history.push("/finances");
    }
  } catch (err) {
    console.log(err);
  }
};

/*===============================================
                Get All Expanses
==================================================*/
export const getAllExpanses = (fromData) => async (dispatch) => {
  const headers = {
    "Content-Type": "application/json",
    workspaceId: workspaceId,
  };
  dispatch({
    type: SET_LOADER,
    payload: true,
  });
  try {
    let { data } = await axios.post(`${url}/api/expenses/search`, fromData, {
      headers: headers,
    });
    if (data) {
      let sentExpense = data.filter((expanse) => expanse.status === "SENT");
      dispatch({
        type: SET_ALL_EXPANSES,
        payload: data,
      });
      dispatch({
        type: SET_APPROVAL_EXPENSE,
        payload: sentExpense,
      });
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

/*====================================================
              Get Expense By Query
======================================================*/

export const getExpenseByQuery = (queryData) => async (dispatch) => {
  const headers = {
    "Content-Type": "application/json",
    workspaceId: workspaceId,
  };
  try {
    let { data } = await axios.post(`${url}/api/expenses/search`, queryData, {
      headers: headers,
    });
    if (data) {
      dispatch({
        type: SET_ALL_EXPANSES,
        payload: data,
      });
    }
  } catch (err) {
    console.log(err);
  }
};

/*=======================================================
                  Get total Expense count 
=========================================================*/
export const getExpenseTotalCount = () => async (dispatch) => {
  const headers = {
    "Content-Type": "application/json",
    workspaceId: workspaceId,
  };
  try {
    let { data } = await axios.get(`${url}/api/expenses/count`, {
      headers: headers,
    });
    if (data) {
      console.log(data);
      // dispatch({
      //   type: SET_EXPENSE_TOTAL_COUNT,
      //   payload: data,
      // });
    }
  } catch (err) {
    console.log(err);
  }
};

/*=======================================================
                  Get Expense Overview
=========================================================*/
export const getExpenseOverview = () => async (dispatch) => {
  const headers = {
    "Content-Type": "application/json",
    workspaceId: workspaceId,
  };
  try {
    let { data } = await axios.get(`${url}/api/expenses/overview?key=status`, {
      headers: headers,
    });
    if (data) {
      // console.log(data);
      dispatch({
        type: SET_EXPENSE_OVERVIEW,
        payload: data,
      });
    }
  } catch (err) {
    console.log(err);
  }
};

/*======================================================
                Update Expanse 
========================================================*/
export const updateExpense = (expanseId, formData, history) => async (
  dispatch
) => {
  const headers = {
    "Content-Type": "application/json",
    workspaceId: workspaceId,
  };
  try {
    let { data } = await axios.put(
      `${url}/api/expenses/${expanseId}`,
      formData,
      {
        headers: headers,
      }
    );
    if (data) {
      Toast.info("Expense Updated", 3000);
      let newStartDate = startOfMonth(new Date());
      let endStartDate = endOfMonth(new Date());

      const formData = {
        query: {
          $and: [
            { createdAt: { $lte: new Date(endStartDate) } },
            { createdAt: { $gte: new Date(newStartDate) } },
          ],
        },
      };
      this.props.getAllExpanses(formData);

      // dispatch(getAllExpanses());
      history.push("/finances");
    }
  } catch (err) {
    console.log(err);
  }
};

/*======================================================
                Approve Bulk Expanse
========================================================*/
export const approveBulkExpense = (formData, toastText) => async (dispatch) => {
  const headers = {
    "Content-Type": "application/json",
    workspaceId: workspaceId,
  };
  try {
    let { data } = await axios.post(`${url}/api/expenses/approve`, formData, {
      headers: headers,
    });
    if (data) {
      Toast.info(`${toastText}`, 3000);

      let newStartDate = startOfMonth(new Date());
      let endStartDate = endOfMonth(new Date());
      const formData = {
        query: {
          expenseType: "PROJECT",
          $and: [
            { createdAt: { $lte: new Date(endStartDate) } },
            { createdAt: { $gte: new Date(newStartDate) } },
          ],
        },
      };
      dispatch(getAllExpanses(formData));
      dispatch(getExpenseOverview());
    }
  } catch (err) {
    console.log(err);
  }
};

/*======================================================
                    Delete Expanse By Id
========================================================*/
export const deleteExpanse = (expanseId) => async (dispatch) => {
  const headers = {
    "Content-Type": "application/json",
    workspaceId: workspaceId,
  };
  try {
    let { data } = await axios.delete(`${url}/api/expenses/${expanseId}`, {
      headers: headers,
    });
    if (data) {
      Toast.info("Expense Deleted", 3000);
      let newStartDate = startOfMonth(new Date());
      let endStartDate = endOfMonth(new Date());
      const formData = {
        query: {
          expenseType: "PROJECT",
          $and: [
            { createdAt: { $lte: new Date(endStartDate) } },
            { createdAt: { $gte: new Date(newStartDate) } },
          ],
        },
      };

      const formDataMiscellaneaous = {
        query: {
          expenseType: "MISCELLENOUS",
          $and: [
            { createdAt: { $lte: new Date(endStartDate) } },
            { createdAt: { $gte: new Date(newStartDate) } },
          ],
        },
      };

      dispatch(getAllExpanses(formData));
      dispatch(getMiscellaneousExpense(formDataMiscellaneaous));
      const formDataOverview = {
        from: startOfMonth(new Date()).toISOString(),
        to: endOfMonth(new Date()).toISOString(),
      };

      dispatch(expenseOverviewTableByDate(formDataOverview));
    }
  } catch (err) {
    console.log(err);
  }
};

/*=========================================================
                    Search Expense
==========================================================*/
export const filterExpense = (formData) => async (dispatch) => {
  const headers = {
    "Content-Type": "application/json",
    workspaceId: workspaceId,
  };
  try {
    let { data } = await axios.post(`${url}/api/expenses/search`, formData, {
      headers: headers,
    });
    if (data) {
      // console.log(data);
      dispatch({
        type: SET_APPROVAL_EXPENSE,
        payload: data,
      });
    }
  } catch (err) {
    console.log(err);
  }
};

/*========================================================
            EXPENSE OVERVIEW TABLE BY DATE
==========================================================*/
export const expenseOverviewTableByDate = (formData) => async (dispatch) => {
  const headers = {
    "Content-Type": "application/json",
    workspaceId: workspaceId,
  };
  try {
    let { data } = await axios.post(`${url}/api/expenses/table`, formData, {
      headers: headers,
    });
    if (data) {
      dispatch({
        type: SET_EXPENSE_OVERVIEW_TABLE,
        payload: data,
      });
    }
  } catch (err) {
    console.log(err);
  }
};

/*====================================================
              GET MISCELLENEOUS EXPENSE
======================================================*/

export const getMiscellaneousExpense = (queryData) => async (dispatch) => {
  const headers = {
    "Content-Type": "application/json",
    workspaceId: workspaceId,
  };
  try {
    let { data } = await axios.post(`${url}/api/expenses/search`, queryData, {
      headers: headers,
    });
    if (data) {
      dispatch({
        type: SET_ALL_MESCELLANEOUS_EXPENSES,
        payload: data,
      });
    }
  } catch (err) {
    console.log(err);
  }
};

/*=============================================================================================================
                                                  Subscription  Section
===============================================================================================================*/

/*==========================================
        Create Subsciption
===========================================*/

export const createSubscription = (formData, history) => async (dispatch) => {
  const headers = {
    "Content-Type": "application/json",
    workspaceId: workspaceId,
  };
  try {
    let { data } = await axios.post(
      `${url}/api/expenseSubscriptions`,
      formData,
      {
        headers: headers,
      }
    );
    if (data) {
      Toast.info("Subdcription Created", 3000);

      history.push("/finances");
      console.log(data);
    }
  } catch (err) {
    console.log(err);
  }
};

/*===========================================
          Get All Subscription
============================================*/

export const getAllSubsciption = (formData) => async (dispatch) => {
  const headers = {
    "Content-Type": "application/json",
    workspaceId: workspaceId,
  };
  dispatch({
    type: SET_LOADER,
    payload: true,
  });
  try {
    let { data } = await axios.post(
      `${url}/api/expenseSubscriptions/search`,
      formData,
      {
        headers: headers,
      }
    );
    if (data) {
      dispatch({
        type: SET_FINANCE_SUBSCIPTION,
        payload: data,
      });
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

/*=============================================
          Get Total Subscription Count
===============================================*/

export const getTotalSubscriptionCount = () => async (dispatch) => {
  const headers = {
    "Content-Type": "application/json",
    workspaceId: workspaceId,
  };
  try {
    let { data } = await axios.get(`${url}/api/expenseSubscriptions/count`, {
      headers: headers,
    });
    if (data) {
      dispatch({
        type: SET_ALL_SUBSCRIPTION_COUNT,
        payload: data,
      });
    }
  } catch (err) {
    console.log(err);
  }
};

/*================================================
        Get Subscription Overview
==================================================*/

export const getSubscriptionOverview = () => async (dispatch) => {
  const headers = {
    "Content-Type": "application/json",
    workspaceId: workspaceId,
  };
  try {
    let { data } = await axios.get(
      `${url}/api/expenseSubscriptions/overview?key=status`,
      {
        headers: headers,
      }
    );
    if (data) {
      dispatch({
        type: SET_SUBSCRIPTION_OVERVIEW,
        payload: data,
      });
    }
  } catch (err) {
    console.log(err);
  }
};

/*============================================
          Edit Subscription By Id
==============================================*/
export const editSubscription = (
  subscriptionId,
  formData,
  callBackEdit
) => async (dispatch) => {
  const headers = {
    "Content-Type": "application/json",
    workspaceId: workspaceId,
  };

  try {
    let { data, status } = await axios.put(
      `${url}/api/expenseSubscriptions/${subscriptionId}`,
      formData,
      {
        headers: headers,
      }
    );
    if (data) {
      Toast.info("Subdcription Updated", 3000);
      let newStartDate = startOfMonth(new Date());
      let endStartDate = endOfMonth(new Date());
      const formDataGetSubscription = {
        query: {
          $and: [
            { createdAt: { $lte: new Date(endStartDate) } },
            { createdAt: { $gte: new Date(newStartDate) } },
          ],
        },
      };

      dispatch(getAllSubsciption(formDataGetSubscription));
      callBackEdit(status);
    }
  } catch (err) {
    console.log(err);
  }
};

/*============================================
      Delete Subscription By Id
==============================================*/
export const deleteSubsciption = (subscriptionId) => async (dispatch) => {
  const headers = {
    "Content-Type": "application/json",
    workspaceId: workspaceId,
  };
  try {
    let { data } = await axios.delete(
      `${url}/api/expenseSubscriptions/${subscriptionId}`,
      {
        headers: headers,
      }
    );
    if (data) {
      Toast.info("Subdcription Deleted", 3000);
      let newStartDate = startOfMonth(new Date());
      let endStartDate = endOfMonth(new Date());
      const formDataGetSubscription = {
        query: {
          $and: [
            { createdAt: { $lte: new Date(endStartDate) } },
            { createdAt: { $gte: new Date(newStartDate) } },
          ],
        },
      };

      dispatch(getAllSubsciption(formDataGetSubscription));

      dispatch(getTotalSubscriptionCount());
      dispatch(getSubscriptionOverview());
    }
  } catch (err) {
    console.log(err);
  }
};

/*==================================================
               Search Subscription
===================================================*/
export const filterSubscription = (formData) => async (dispatch) => {
  const headers = {
    "Content-Type": "application/json",
    workspaceId: workspaceId,
  };
  try {
    let { data } = await axios.post(
      `${url}/api/expenseSubscriptions/search`,
      formData,
      {
        headers: headers,
      }
    );
    if (data) {
      dispatch({
        type: SET_FINANCE_SUBSCIPTION,
        payload: data,
      });
      // console.log(data);
    }
  } catch (err) {
    console.log(err);
  }
};
