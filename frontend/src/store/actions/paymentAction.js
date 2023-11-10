import axios from "axios";
import { url } from "./config";
import { workspaceId } from "./config";
import {
  SET_LOGIN,
  SET_BILLING_HISTORY,
  SET_FUTURE_PAYMENT_INVOICE,
  SET_PAYMENT_HISTORY,
  SET_PAYMENT_SAVED_CARDS,
  SET_CUSTOMER_ACCOUTN_BALENCE,
} from "./../types";
import {
  getOrganizationData,
  logoutUser,
  setFeaturesArray,
} from "./authAction";
import Toast from "light-toast";
import isEmpty from "./../validations/is-empty";

/*=============================================
            Before Payment Action
===============================================*/
export const beforePaymentAction = (formData, payApiCallback) => async (
  dispatch
) => {
  try {
    let { data, status } = await axios.post(`${url}/api/pay`, formData);
    if (data) {
      payApiCallback(data, status);
    }
  } catch (err) {
    console.log(err);
  }
};

/*==============================================
            After Payment Success
===============================================*/
export const afterPaymentSuccessAction = (formData, history) => async (
  dispatch
) => {
  try {
    let { data } = await axios.post(`${url}/api/pay/success`, formData);
    if (data) {
      history.push("/payment-success");
    }
  } catch (err) {
    console.log(err);
  }
};

/*==========================================================
  Update plan and expiration token after payment success
============================================================*/
export const updateDataAfterPaymentSuccess = () => async (dispatch) => {
  try {
    let { data } = await axios.get(`${url}/api/organizations/${workspaceId}`);
    if (data) {
      let previousData = localStorage.getItem("UserData");
      previousData = JSON.parse(previousData);
      previousData.billingType = data.billingType;
      previousData.expirationDate = data.expirationDate;
      const resData = data;
      Object.keys(previousData).forEach((key) => {
        Object.keys(resData).forEach((rkey) => {
          if (rkey === key && key !== "role") {
            previousData[key] = resData[rkey];
          }
        });
      });
      // localStorage.clear();
      localStorage.removeItem("OrganizationData");
      localStorage.removeItem("UserData");
      localStorage.setItem("UserData", JSON.stringify(previousData));
      localStorage.setItem("OrganizationData", JSON.stringify(data));
      dispatch(
        setFeaturesArray({
          plan:
            data.planName === "FREE"
              ? "Free-Plan"
              : data.planName === "ARK"
              ? "Ark"
              : "Metaverse",
        })
      );
      dispatch({ type: SET_LOGIN, payload: previousData });
    }
  } catch (err) {
    console.log(err);
  }
};

/*===============================================
          Upgrade plans for paid users
=================================================*/
export const upgradePlansOfPaidUsers = (
  organizationId,
  formData,
  callBackSubscriptionUpdate
) => async (dispatch) => {
  try {
    let { data } = await axios.post(
      `${url}/api/organizations/upgrade/${organizationId}`,
      formData
    );
    if (data) {
      callBackSubscriptionUpdate(data);
      dispatch(getOrganizationData());
      Toast.info("Subscription updated", 3000);
    }
  } catch (err) {
    console.log(err);
    Toast.info("Already subscribed", 3000);
  }
};

/*================================================
          Cancel Subscription Of User
=================================================*/
export const cancelUserSubscriptin = (
  organizationId,
  formData,
  callBackSubscriptionCancel
) => async (dispatch) => {
  try {
    let { data, status } = await axios.post(
      `${url}/api/organizations/cancel/${organizationId}`,
      formData
    );
    if (data) {
      callBackSubscriptionCancel(status);
      dispatch(getOrganizationData());
      dispatch(cancelNextSubscription(organizationId, formData));
    }
  } catch (err) {
    console.log(err);
  }
};

/*=================================================
        Cancel Next Month Subscription
===================================================*/
export const cancelNextSubscription = (
  organisationId,
  formData,
  callBackCancelSubscription
) => async (dispatch) => {
  try {
    let { data, status } = await axios.post(
      `${url}/api/organizations/cancelUpdate/${organisationId}`,
      formData
    );
    if (data) {
      dispatch(getOrganizationData());
      callBackCancelSubscription(status);
      Toast.info("Next subscription canceled", 3000);
    }
  } catch (err) {
    console.log(err);
  }
};

/*===================================================
            Resume current Subscription
====================================================*/
export const resumeSubscription = (organisationId) => async (dispatch) => {
  try {
    let { data } = await axios.post(
      `${url}/api/organizations/resume/${organisationId}`
    );
    if (data) {
      dispatch(getOrganizationData());
      Toast.info("Subscription resume successfully", 3000);
    }
  } catch (err) {
    console.log(err);
  }
};

// /*================================================
//   Update plan and expiration token after success
// ==================================================*/
// export const updateDataAfterPaymentSuccess = () => (dispatch) => {
//   let workspaceName = window.location.host.split(".")[0];
//   // let workspaceName = "google16";
//   axios
//     .get(`${url}/api/organizations/${workspaceName}`)
//     .then((res) => {
//       let previousData = localStorage.getItem("Data");
//       previousData = JSON.parse(previousData);
//       previousData.billingType = res.data.billingType;
//       previousData.expirationDate = res.data.expirationDate;
//       const resData = res.data;
//       Object.keys(previousData).forEach((key) => {
//         Object.keys(resData).forEach((rkey) => {
//           if (rkey === key && key !== "role") {
//             previousData[key] = resData[rkey];
//           }
//         });
//       });
//       // localStorage.clear();
//       localStorage.removeItem("oraganiationData");
//       localStorage.removeItem("Data");
//       localStorage.setItem("Data", JSON.stringify(previousData));
//       localStorage.setItem("oraganiationData", JSON.stringify(res.data));
//       dispatch({ type: SET_LOGIN, payload: previousData });
//       console.log(res.data);
//     })
//     .catch((err) => console.log(err));
// };

/*=========================================================
                    Api Billings
==========================================================*/
export const getAllPaymentHistory = (organizationId) => async (dispatch) => {
  try {
    let { data } = await axios.get(
      `${url}/api/billings/organization/${organizationId}`
    );
    if (data) {
      dispatch({
        type: SET_BILLING_HISTORY,
        payload: data,
      });
    }
  } catch (err) {
    console.log(err);
  }
};

/*===========================================================
                  Send Menual Retry
============================================================*/
export const sendMenualRetry = (formData, manualRetryCallback) => async (
  dispatch
) => {
  const headers = {
    "Content-Type": "application/json",
    workspaceId: workspaceId,
  };
  try {
    let { data, status } = await axios.post(
      `${url}/api/organizations/manual/retry`,
      formData,
      {
        headers: headers,
      }
    );
    if (data) {
      dispatch(getOrganizationData());
      manualRetryCallback(status);
      Toast.info("Manual Retry Send", 3000);
    }
  } catch (err) {
    console.log(err);
  }
};

/*============================================================
      Cancel subscription after payment failed flow
=============================================================*/
export const cancelImmediateSubscription = (formData) => async (dispatch) => {
  try {
    let { data } = await axios.post(
      `${url}/api/organizations/manual/cancel`,
      formData
    );
    if (data) {
      Toast.info("Subscription Canceled", 3000);
      dispatch(logoutUser());
    }
  } catch (err) {
    console.log(err);
  }
};

/*=========================================================================================================
                                         Stripe Payment Apis
==========================================================================================================*/
/*=========================================================================
                       get customer object
==========================================================================*/
export const getStripeCustomerObject = (customerId) => async (dispatch) => {
  let formData = {
    customerId: customerId,
  };
  try {
    let { data } = await axios.post(`${url}/api/get-customer-object`, formData);
    if (data) {
      localStorage.setItem("customerStripeObject", JSON.stringify(data));
      dispatch({
        type: SET_CUSTOMER_ACCOUTN_BALENCE,
        payload: data,
      });
    }
  } catch (err) {
    console.log(err);
  }
};

/*=========================================================================
                       Update Customer Address
==========================================================================*/
export const updateCustomerAddress = (formData, callBackAddAdress) => async (
  dispatch
) => {
  try {
    let { data, status } = await axios.post(
      `${url}/api/update-customer`,
      formData
    );
    if (data) {
      localStorage.setItem("customerStripeObject", JSON.stringify(data));
      Toast.info("Address updated", 3000);
      // Alert.success(`<h4>Address updated</h4>`, {
      //   position: "top-right",
      //   effect: "slide",
      //   beep: false,
      //   html: true,
      //   timeout: 5000,
      //   // offset: 100
      // });
      dispatch(getStripeCustomerObject(formData.customerId));
      callBackAddAdress(status);
    }
  } catch (err) {
    console.log(err);
  }
};

/*=========================================================================
                        Stripe Price id by productId
==========================================================================*/

export const getPriceIdByProduct = (formData, callBackGetPrice) => async (
  dispatch
) => {
  try {
    let { data } = await axios.post(`${url}/api/get-price`, formData);
    if (data) {
      callBackGetPrice(data.data[0].id);
    }
  } catch (err) {
    console.log(err);
  }
};

/*=========================================================================
                        Stripe Get Future Invoice
==========================================================================*/
export const getFutureInvoice = (newPriceId) => async (dispatch) => {
  let OrganizationData = JSON.parse(localStorage.getItem("OrganizationData"));
  const formData = {
    customerId: OrganizationData.customerId,
    subscriptionId: OrganizationData.subscriptionId,
    newPriceId: newPriceId,
  };
  try {
    let { data } = await axios.post(`${url}/api/get-future-invoice`, formData);
    if (data) {
      dispatch({
        type: SET_FUTURE_PAYMENT_INVOICE,
        payload: data,
      });
    }
  } catch (err) {
    console.log(err);
  }
};

/*=========================================================================
                        Stripe Subscription by sub id
==========================================================================*/

export const getSubscriptionById = () => async (dispatch) => {
  let OrganizationData = JSON.parse(localStorage.getItem("OrganizationData"));

  try {
    let { data } = await axios.get(
      `${url}/api/get-subscription/${OrganizationData.subscriptionId}`
    );
    if (data) {
      console.log(data);
    }
  } catch (err) {
    console.log(err);
  }
};

/*=========================================================================
                Gte Stripe payment history by customer id
==========================================================================*/
export const getPaymentHistoryByCustomerId = () => async (dispatch) => {
  let OrganizationData = JSON.parse(localStorage.getItem("OrganizationData"));
  let formData = {
    customerId: OrganizationData.customerId,
  };

  try {
    let { data } = await axios.post(`${url}/api/get-payment-intents`, formData);
    if (data) {
      dispatch({
        type: SET_PAYMENT_HISTORY,
        payload: data.data,
      });
    }
  } catch (err) {
    console.log(err);
  }
};

/*=========================================================================
               Get Saved Cards Of Customer
==========================================================================*/
export const getCustomerSavedCards = () => async (dispatch) => {
  let OrganizationData = JSON.parse(localStorage.getItem("OrganizationData"));
  let formData = {
    customerId: OrganizationData.customerId,
  };

  try {
    let { data } = await axios.post(
      `${url}/api/get-payment-method-for-customer`,
      formData
    );
    if (data) {
      dispatch({
        type: SET_PAYMENT_SAVED_CARDS,
        payload: data.data,
      });
    }
  } catch (err) {
    console.log(err);
  }
};

/*========================================
      Update Organization  data
=========================================*/
export const updateOrganizationData = (organizationId, formData) => async (
  dispatch
) => {
  try {
    let { data, status } = await axios.put(
      `${url}/api/organizations/${organizationId}`,
      formData
    );
    if (data) {
      localStorage.removeItem("OrganizationData");
      localStorage.setItem("OrganizationData", JSON.stringify(data));
    }
  } catch (err) {
    console.log(err);
  }
};

/*=========================================================================
                        Attach card for customer
==========================================================================*/
export const AddNewCardForCustomer = (formData, callBackAddCard) => async (
  dispatch
) => {
  let OrganizationData = JSON.parse(localStorage.getItem("OrganizationData"));
  try {
    let { data, status } = await axios.post(
      `${url}/api/attach-payment-method`,
      formData
    );
    if (data) {
      dispatch(getCustomerSavedCards(OrganizationData.customerId));

      if (OrganizationData.planStatus === "PAYMENT_FAILED") {
        OrganizationData.planStatus = "PAID";
        dispatch(
          updateOrganizationData(OrganizationData._id, OrganizationData)
        );
      }
      callBackAddCard(status);
    }
  } catch (err) {
    console.log(err);
  }
};

/*=========================================================================
                        Detach card for customer
==========================================================================*/
export const RemoveCardForCustomer = (formData) => async (dispatch) => {
  let OrganizationData = JSON.parse(localStorage.getItem("OrganizationData"));
  try {
    let { data } = await axios.post(
      `${url}/api/detach-payment-method`,
      formData
    );
    if (data) {
      Toast.info("Card remove", 3000);
      // Alert.success(`<h4>Card remove</h4>`, {
      //   position: "top-right",
      //   effect: "slide",
      //   beep: false,
      //   html: true,
      //   timeout: 5000,
      //   // offset: 100
      // });
      dispatch(getCustomerSavedCards(OrganizationData.customerId));
    }
  } catch (err) {
    console.log(err);
  }
};

/*=========================================================================
                 Stripe Set Default Payment Method 
==========================================================================*/

export const setDefaultPaymentCardAction = (formData) => async (dispatch) => {
  try {
    let { data } = await axios.post(`${url}/api/make-default`, formData);
    if (data) {
      Toast.info("Set as default card", 3000);
      // Alert.success(`<h4>Set as default card</h4>`, {
      //   position: "top-right",
      //   effect: "slide",
      //   beep: false,
      //   html: true,
      //   timeout: 5000,
      //   // offset: 100
      // });

      dispatch(getStripeCustomerObject(formData.customerId));
      dispatch(getCustomerSavedCards(formData.customerId));
    }
  } catch (err) {
    console.log(err);
  }
};

/*=========================================================================
              GET USERS QUANTITY TO UPDATE SUBSCRIPTION
==========================================================================*/

export const getAllActiveUserQuantity = () => async (dispatch) => {
  try {
    let { data } = await axios.get(`${url}/api/users?pageNo=1&pageSize=1000`);
    if (data) {
      console.log("asdadadasdad", data);

      let activeUsers = !isEmpty(data)
        ? data.filter((ele) => ele.status === "ACTIVE")
        : [];

      let OrganizationData = JSON.parse(
        localStorage.getItem("OrganizationData")
      );
      const formData = {
        subscriptionId: OrganizationData.subscriptionId,
        quantity: activeUsers.length,
      };
      dispatch(updateQuantity(formData));
    }
  } catch (err) {
    console.log(err);
  }
};

/*=========================================================================
                       UPDATE SUBSCRIPTION
==========================================================================*/

export const updateQuantity = (formData) => async (dispatch) => {
  try {
    let { data } = await axios.post(`${url}/api/update-quantity`, formData);
    if (data) {
      console.log(data);
    }
  } catch (err) {
    console.log(err);
  }
};

/*=====================================================================================================
                                             NEW PAYMENT FLOW
=======================================================================================================*/

/*=========================================================================
         Create customer source using source id --> step 2
==========================================================================*/

// export const createCustomerSourceUsingSourceId = (formData) => async (
//   dispatch
// ) => {
//   try {
//     let { data } = await axios.post(
//       `${url}/api/create-customer-source`,
//       formData
//     );
//     if (data) {
//       alert("Customer source created");
//       const customerUpdateData = {
//         customerId: data.id,
//         payLoad: {
//           address: {
//             city: "pune",
//             country: "IN",
//             line1: "line one address",
//             line2: null,
//             postal_code: "444604",
//             state: "maharashtra",
//           },
//         },
//       };

//       await dispatch(updateCustomer(customerUpdateData));

//       // console.log(data);
//       const formData = {
//         customer: data.id,
//         card: data.default_source,
//         url:
//           process.env.NODE_ENV === "development"
//             ? "http://localhost:3000/payment-success"
//             : `http://${workspaceId}.dominate.ai/payment-success`,
//         amount: "100",
//         currency: "inr",
//       };
//       dispatch(createSecureSource(formData));
//     }
//   } catch (err) {
//     console.log(err);
//   }
// };

/*=========================================================================
              Create secure source --> step 3
==========================================================================*/

// export const createSecureSource = (formData) => async (dispatch) => {
//   try {
//     let { data } = await axios.post(
//       `${url}/api/create-secure-source`,
//       formData
//     );
//     if (data) {
//       console.log(data);
//       alert("Secure source created");
//       localStorage.setItem("secureSource", JSON.stringify(data));
//       window.location.href = data.redirect.url;
//     }
//   } catch (err) {
//     console.log(err);
//   }
// };

/*=========================================================================
              Create Charge --> step 4
==========================================================================*/

// export const createCharge = (formData) => async (dispatch) => {
//   try {
//     let { data } = await axios.post(`${url}/api/create-charge`, formData);
//     if (data) {
//       console.log(data);
//       await alert("Charge created");
//       const formData = {
//         customer: data.customer,
//         price: "price_1IVzesFHfcG4tGd9PqJ7Jbzt",
//         trial_end: 1616466774,
//       };
//       dispatch(createSubsciptionTrial(formData));
//     }
//   } catch (err) {
//     console.log(err);
//   }
// };

/*=========================================================================
              Create Subscription trial --> step 6
==========================================================================*/

// export const createSubsciptionTrial = (formData) => async (dispatch) => {
//   try {
//     let { data } = await axios.post(`${url}/api/create-subs-trial`, formData);
//     if (data) {
//       alert("subscription trial created");
//       console.log(data);
//     }
//   } catch (err) {
//     console.log(err);
//   }
// };

/*=========================================================================
                       Update Customer Address
==========================================================================*/
// export const updateCustomer = (formData) => async (dispatch) => {
//   try {
//     let { data, status } = await axios.post(
//       `${url}/api/update-customer`,
//       formData
//     );
//     if (data) {
//       alert("Customer updated");
//     }
//   } catch (err) {
//     console.log(err);
//   }
// };
