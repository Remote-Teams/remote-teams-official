import React, { useState, useEffect } from "react";
import { withRouter } from "react-router-dom";
// import './App.css';
import Product from "./Product";
import PriceChangeForm from "./PriceChangeForm";
import isEmpty from "../../../store/validations/is-empty";
import { url, workspaceId } from "./../../../store/actions/config";
import { useSelector, useDispatch } from "react-redux";
import {
  getPriceIdByProduct,
  updateDataAfterPaymentSuccess,
  getFutureInvoice,
} from "./../../../store/actions/paymentAction";
import { deleteResource } from "./../../../store/actions/resourcesAction";
import { logoutUser } from "./../../../store/actions/authAction";

import SubscriptionUpdateSuccess from "./../../desktop/popups/SubscriptionUpdateSuccess";
import CancelSubscription from "./../../desktop/popups/CancelSubscription";
import CancelSubscriptionSuccess from "./../../desktop/popups/CancelSubscriptionSuccess";
import WarningPopup from "./../popups/WarningPopup";
import PrePaymentPopup from "./../popups/PrePaymentPopup";
import EmployeeDeletePopup from "./../popups/EmployeeDeletePopup";
import dateFns from "date-fns";
import axios from "axios";
import GreenButtonSmallFont from "../common/GreenButtonSmallFont";
import GrayButtonSmallFont from "../common/GrayButtonSmallFont";
import { useHistory } from "react-router";

import Toast from "light-toast";

function Account({ location }) {
  let organizationData = JSON.parse(localStorage.getItem("oraganiationData"));
  const dispatch = useDispatch();
  const history = useHistory();
  //   const [accountInformation] = useState(location.state.accountInformation);
  const [currentProductData, setCurrentProductData] = useState("");
  const [productSelected, setProduct] = useState(null);
  let [customerPaymentMethod, setCustomerPaymentmethod] = useState(null);
  let [showChangePriceForm, setShowChangePriceForm] = useState(false);
  let [subscriptionCancelled, setSubscriptionCancelled] = useState(false);
  let [newProductSelected, setNewProdctSelected] = useState("");
  let [selectedProducted, setSelectedProduct] = useState("");
  let [subscriptionId, setSubscriptionId] = useState("");
  let [customerId, setCustomerId] = useState("");
  let [userData, setUserData] = useState({});
  const [allProducts, setProducts] = useState([]);
  const [priceId, setPriceId] = useState("");
  const [activePlan, setActivePlan] = useState("");
  const [allUsers, setAllUsers] = useState([]);
  const [deleteEmployeeList, setDeleteEmployeeList] = useState([]);

  const [futureInvoiceInfo, setFutureInvoiceInfo] = useState({});

  //popup states

  const [downgradeWarningPopup, setDowngradeWarningPopup] = useState(false);
  const [subscriptionUpdateSuccess, setSubscriptionUpdateSuccess] = useState(
    false
  );
  const [cancelSubscriptionPopup, setCancelSubscription] = useState(false);
  const [cancelSubscriptionSuccess, setCancelSubscriptionSuccess] = useState(
    false
  );
  const [prePaymentPopup, setPrePaymentPopup] = useState(false);
  const [empDeletePopup, setempDeletePopup] = useState(false);

  //componentDidMount
  useEffect(() => {
    let OrganizationData = JSON.parse(localStorage.getItem("OrganizationData"));
    let UserData = JSON.parse(localStorage.getItem("UserData"));
    if (!isEmpty(UserData)) {
      setUserData(UserData);
    }
    if (!isEmpty(OrganizationData)) {
      setSelectedProduct(OrganizationData.priceId);
      setSubscriptionId(OrganizationData.billingId);
      setCustomerId(OrganizationData.customerId);
      if (!isEmpty(OrganizationData.newPriceId)) {
        dispatch(getFutureInvoice(OrganizationData.newPriceId));
      }
    }
  }, []);

  //static getderived

  const allPlans = useSelector((state) => state.auth.plans);

  const allActiveUsersWithoutAdmin = useSelector(
    (state) => state.resources.allResources
  );
  useEffect(() => {
    if (!isEmpty(allPlans)) {
      let OrganizationData = JSON.parse(
        localStorage.getItem("OrganizationData")
      );
      setProducts(allPlans);

      // let currentProduct = {};
      // currentProduct = allPlans.filter(
      //   (ele) => ele.id === OrganizationData.productId
      // );
      // // console.log(currentProduct);
      // setCurrentProductData(currentProduct[0]);
      // setProduct(currentProduct[0]);
      // setActivePlan(currentProduct[0].description);
    }
  }, [allPlans]);

  useEffect(() => {
    if (!isEmpty(allActiveUsersWithoutAdmin)) {
      // let filterData = allActiveUsersWithoutAdmin.filter(
      //   (user) =>
      //     user.role.name !== "Administrator" && user.status === "INVITED"
      // );
      setAllUsers(allActiveUsersWithoutAdmin);
    }
  }, [allActiveUsersWithoutAdmin]);

  //   useEffect(() => {
  //     async function fetchData() {
  //       // You can await here
  //       const response = await fetch("/retrieve-customer-payment-method", {
  //         method: "post",
  //         headers: {
  //           "Content-type": "application/json",
  //         },
  //         body: JSON.stringify({
  //           paymentMethodId: accountInformation.paymentMethodId,
  //         }),
  //       });
  //       const responseBody = await response.json();
  //       const paymentMethod =
  //         responseBody.card.brand + " •••• " + responseBody.card.last4;

  //       setCustomerPaymentmethod(paymentMethod);
  //     }
  //     fetchData();
  //   }, [accountInformation.paymentMethodId]);

  // function handleChangePriceForm() {
  //   setShowChangePriceForm(true);
  // }

  const handleClick = (product) => (e) => {
    let OrganizationData = JSON.parse(localStorage.getItem("OrganizationData"));

    setProduct(product);
    setNewProdctSelected(product.name);
    setActivePlan(product.name);

    if (product.name === "FREE_PLAN") {
      setCancelSubscription(true);
    } else {
      continueHandler(product);
    }

    // if (
    //   parseInt(product.metadata.maxUsers) <
    //   parseInt(currentProductData.metadata.maxUsers)
    // ) {
    //   setDowngradeWarningPopup(true);
    // } else {
    //   setPrePaymentPopup(true);
    // }
    //check for employee delete popup
    // if (parseInt(product.metadata.maxUsers) < allUsers.length + 1) {
    //   console.log("delete popup");
    //   setempDeletePopup(true);
    // } else {
    //   console.log("continue");
    //   //check for downgrade and proceed popup
    //   if (!isEmpty(OrganizationData.productId)) {
    //     if (
    //       parseInt(product.metadata.maxUsers) <
    //       parseInt(currentProductData.metadata.maxUsers)
    //     ) {
    //       setDowngradeWarningPopup(true);
    //     } else {
    //       setPrePaymentPopup(true);
    //     }
    //   } else {
    //     setPrePaymentPopup(true);
    //   }
    // }
  };

  // const callBackGetPrice = (priceId) => {
  //   setPriceId(priceId);
  // };

  function cancelSubscription() {
    fetch(`${url}/api/new-cancel-subscription`, {
      method: "post",
      headers: {
        "Content-Type": "application/json",
        workspaceId: workspaceId,
        Authorization: `Bearer ${userData.token}`,
      },
      body: JSON.stringify({
        subscriptionId: subscriptionId,
        // customerId: customerId,
      }),
    })
      .then((response) => {
        console.log(response.status);
        if (response.status === 200) {
          setCancelSubscription(false);
          setCancelSubscriptionSuccess(true);
          if (allUsers.length > 10) {
            let filterUsers = allUsers.filter(
              (user) => user.role.name !== "Administrator"
            );
            let finalArray = [];
            filterUsers.forEach((element) => {
              finalArray.push(element.email);
            });
            dispatch(deleteResource(finalArray, callBackDelete));
          }
        }

        return response.json();
      })
      .then((cancelSubscriptionResponse) => {
        setSubscriptionCancelled(true);
      });
  }

  const onCloseHandler = () => {
    setNewProdctSelected("");
    setSubscriptionUpdateSuccess(false);
    setCancelSubscription(false);
    setDowngradeWarningPopup(false);
    setPrePaymentPopup(false);
  };

  const continueHandler = (product) => {
    axios
      .post(
        `${url}/api/update-subscription`,

        {
          subscriptionId: subscriptionId,
          priceId: product.priceId,
          customerId: customerId,
          plan: product.name === "The Ark" ? "ARK" : "METAVERSE",
        },
        {
          headers: {
            "Content-Type": "application/json",
            workspaceId: workspaceId,
            Authorization: `Bearer ${userData.token}`,
          },
        }
      )
      .then((response) => {
        console.log(response);
        if (response.status === 200) {
          Toast.info("Subscription Updated", 3000);
          setSubscriptionUpdateSuccess(true);
          setDowngradeWarningPopup(false);
          setPrePaymentPopup(false);
          dispatch(updateDataAfterPaymentSuccess());
          dispatch(getFutureInvoice(response.data.plan.id));
        }

        // return response.json();
      })
      .catch((result) => {
        // setSelectedProduct(newProductSelected);
        // setShowChangePriceForm(false);
        // props.history.push('/prices?customerId=' + customer.id);
      });
  };

  const continueToUpgradeHandler = () => {
    setPrePaymentPopup(true);
    setDowngradeWarningPopup(false);
  };

  const onClickSubscriptionCancel = () => {
    setCancelSubscription(true);
  };

  // const planUpdateHandler = () => {
  //   console.log("update");
  //   let OrganizationData = JSON.parse(localStorage.getItem("OrganizationData"));

  //   if (parseInt(productSelected.metadata.maxUsers) < allUsers.length + 1) {
  //     console.log("delete popup");
  //     setempDeletePopup(true);
  //   } else {
  //     console.log("continue");
  //     //check for downgrade and proceed popup
  //     if (!isEmpty(OrganizationData.productId)) {
  //       if (
  //         parseInt(productSelected.metadata.maxUsers) <
  //         parseInt(currentProductData.metadata.maxUsers)
  //       ) {
  //         setDowngradeWarningPopup(true);
  //       } else {
  //         setPrePaymentPopup(true);
  //       }
  //     } else {
  //       setPrePaymentPopup(true);
  //     }
  //   }
  // };

  const logoutHandler = () => {
    dispatch(logoutUser());
    history.push("/login");
  };
  /*========================================
            get future Invoice
==========================================*/
  const futureInvoice = useSelector((state) => state.payment.getFutureInvoice);
  useEffect(() => {
    if (!isEmpty(futureInvoice) && !isEmpty(allPlans)) {
      let futureInvoicePlan = allPlans.filter(
        (plan) => plan.id === futureInvoice.plan.product
      );

      // setFutureInvoiceInfo({
      //   planName: futureInvoicePlan[0].name,
      //   monthlyPrice: futureInvoicePlan[0].metadata.monthlyPrice,
      //   period: new Date(futureInvoice.period.start * 1000),
      // });
    }
  }, [futureInvoice, allPlans]);

  const renderFutureInvoice = () => {
    if (!isEmpty(futureInvoiceInfo)) {
      return (
        <h5 className="upcoming_plan_info">
          Your upcoming plan is {futureInvoiceInfo.planName} with price{" "}
          {futureInvoiceInfo.monthlyPrice}, which will start on{" "}
          {dateFns.format(futureInvoiceInfo.period, "DD MMM YYYY")}
        </h5>
      );
    } else {
      return null;
    }
  };
  // console.log(futureInvoiceInfo.period);

  const onCloseModal = () => {
    setempDeletePopup(false);
    // setaddPaymentAddresspopup(false);
  };

  /*=============================
      Delete Employee Handler
  ==============================*/
  const callBackDelete = (status) => {
    if (status === 200) {
      setempDeletePopup(false);
    }
  };

  const employeeDeleteHandler = () => {
    if (isEmpty(deleteEmployeeList)) {
      Toast.info("Please select employee", 3000);
      //   Alert.success("<h4>Please select employee</h4>", {
      //     position: "top-right",
      //     effect: "slide",
      //     beep: false,
      //     html: true,
      //     timeout: 5000,
      //     // offset: 100
      //   });
    } else {
      // alert("delete employee");
      dispatch(deleteResource(deleteEmployeeList, callBackDelete));
    }
  };

  /*============================
        Checkbox events handler
  =============================*/

  const doEmailExist = (email) => {
    let obj = deleteEmployeeList.find((emp) => emp === email);
    // console.log(obj);
    return obj ? deleteEmployeeList.indexOf(obj) : false;
  };

  const onChangeCheckbox = (email) => (e) => {
    console.log("Checkbox checked:", email);
    let deleteEmployeeLists = deleteEmployeeList;

    let returnValue = doEmailExist(email);
    if (returnValue || returnValue === 0) {
      deleteEmployeeLists.splice(returnValue, 1);
    } else {
      deleteEmployeeLists.push(email);
    }

    // this.setState({
    //   deleteEmployeeList: deleteEmployeeList,
    // });
    setDeleteEmployeeList([...deleteEmployeeLists], deleteEmployeeLists);
  };

  const toggle = () => {
    this.setState((state) => ({
      disabled: !state.disabled,
    }));
  };

  let OrganizationData = JSON.parse(localStorage.getItem("OrganizationData"));

  return (
    <div className="p-6">
      {/* <WarningPopup
        onCloseHandler={onCloseHandler}
        downgradeWarningPopup={downgradeWarningPopup}
        currentProductData={currentProductData}
        productSelected={productSelected}
        continueHandler={continueToUpgradeHandler}
      /> */}
      {/* ) : ( */}
      {/* <PrePaymentPopup
        onCloseHandler={onCloseHandler}
        prePaymentPopup={prePaymentPopup}
        productSelected={productSelected}
        continueHandler={continueHandler}
      /> */}
      {/* <SubscriptionUpdateSuccess
        subscriptionUpdateSuccess={subscriptionUpdateSuccess}
        onCloseHandler={onCloseHandler}
      /> */}
      <CancelSubscription
        cancelSubscriptionPopup={cancelSubscriptionPopup}
        onCloseHandler={onCloseHandler}
        cancelSubscriptionHandler={cancelSubscription}
      />
      <CancelSubscriptionSuccess
        cancelSubscriptionSuccess={cancelSubscriptionSuccess}
        logoutHandler={logoutHandler}
      />

      {/* <EmployeeDeletePopup
        allUsers={allUsers}
        empDeletePopup={empDeletePopup}
        employeeDeleteHandler={employeeDeleteHandler}
        doEmailExist={doEmailExist}
        onChangeCheckbox={onChangeCheckbox}
        toggle={toggle}
        onCloseModal={onCloseModal}
      /> */}
      <div>
        <div className="flex flex-wrap justify-center mt-4">
          <div className="md:w-2/5 w-full inline-block rounded-md p-4">
            <p className="plan-sub-heading">Your paid plan is going on</p>
            <div id="prices-form" className="w-full md:mb-8">
              <div className="plan-heading plan-heading--update-plan text-pasha font-bold text-2xl mt-4">
                {/* Update plan */}
              </div>
              {/* {renderFutureInvoice()} */}

              <div className="subscription container">
                <div className="row">
                  {!isEmpty(allProducts) &&
                    allProducts.map((product, index) => {
                      return (
                        <Product
                          key={index}
                          index={index}
                          product={product}
                          handleClick={handleClick}
                          // activePlan={activePlan}
                        />
                      );
                    })}
                </div>
              </div>

              {/* <GrayButtonSmallFont
                text={"Cancel Subscription"}
                extraClassName="cancel-subscription-btn"
                onClick={onClickSubscriptionCancel}
              /> */}
              {/* <button
                onClick={onClickSubscriptionCancel}
                className="subscription-cancel"
              >
                Cancel Subscription
              </button> */}
              {/* <button onClick={planUpdateHandler} className="make-payment">
                Update
              </button> */}
              {/* <GreenButtonSmallFont
                text={"Update"}
                onClick={planUpdateHandler}
              /> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default withRouter(Account);
