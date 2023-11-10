import {
  SET_BILLING_HISTORY,
  SET_FUTURE_PAYMENT_INVOICE,
  SET_PAYMENT_HISTORY,
  SET_PAYMENT_SAVED_CARDS,
  SET_CUSTOMER_ACCOUTN_BALENCE,
} from "./../types";

const initialState = {
  billingHistory: {},
  getFutureInvoice: {},
  paymentHistory: [],
  savedCards: [],
  customerStripeObject: [],
};

export default function(state = initialState, action) {
  switch (action.type) {
    case SET_BILLING_HISTORY:
      return {
        ...state,
        billingHistory: action.payload,
      };
    case SET_FUTURE_PAYMENT_INVOICE:
      return {
        ...state,
        getFutureInvoice: action.payload,
      };
    case SET_PAYMENT_HISTORY:
      return {
        ...state,
        paymentHistory: action.payload,
      };
    case SET_PAYMENT_SAVED_CARDS:
      return {
        ...state,
        savedCards: action.payload,
      };
    case SET_CUSTOMER_ACCOUTN_BALENCE:
      return {
        ...state,
        customerStripeObject: action.payload,
      };

    default:
      return state;
  }
}
