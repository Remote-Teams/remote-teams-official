import {
  SET_ALL_ANVOICES,
  SET_FINANCE_SUBSCIPTION,
  SET_ALL_SUBSCRIPTION_COUNT,
  SET_SUBSCRIPTION_OVERVIEW,
  SET_ALL_EXPANSES,
  SET_EXPENSE_OVERVIEW,
  SET_APPROVAL_EXPENSE,
  SET_INVOICE_OVERVIEW_TABLE,
  SET_EXPENSE_OVERVIEW_TABLE,
  SET_ALL_MESCELLANEOUS_EXPENSES,
} from "./../types";

const initialState = {
  allInvoices: {},
  allSubscriptions: {},
  totalSubscriptionCount: {},
  subscriptionOverview: {},
  getAllExpanses: {},
  AllMiscellaneousExpense: [],
  approvalExpense: {},
  expenseOverview: {},
  invoiceTableOverviewCount: {},
  expenseTableOverviewCount: {},
};

export default function(state = initialState, action) {
  switch (action.type) {
    case SET_ALL_ANVOICES:
      return {
        ...state,
        allInvoices: action.payload,
      };
    case SET_FINANCE_SUBSCIPTION:
      return {
        ...state,
        allSubscriptions: action.payload,
      };
    case SET_ALL_SUBSCRIPTION_COUNT:
      return {
        ...state,
        totalSubscriptionCount: action.payload,
      };
    case SET_SUBSCRIPTION_OVERVIEW:
      return {
        ...state,
        subscriptionOverview: action.payload,
      };
    case SET_ALL_EXPANSES:
      return {
        ...state,
        allExpanses: action.payload,
      };
    case SET_EXPENSE_OVERVIEW:
      return {
        ...state,
        expenseOverview: action.payload,
      };
    case SET_APPROVAL_EXPENSE:
      return {
        ...state,
        approvalExpense: action.payload,
      };
    case SET_INVOICE_OVERVIEW_TABLE:
      return {
        ...state,
        invoiceTableOverviewCount: action.payload,
      };
    case SET_EXPENSE_OVERVIEW_TABLE:
      return {
        ...state,
        expenseTableOverviewCount: action.payload,
      };
    case SET_ALL_MESCELLANEOUS_EXPENSES:
      return {
        ...state,
        AllMiscellaneousExpense: action.payload,
      };
    default:
      return state;
  }
}
