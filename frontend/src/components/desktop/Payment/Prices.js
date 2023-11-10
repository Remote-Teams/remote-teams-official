import React, { useState, useEffect } from "react";
import { withRouter } from "react-router-dom";
// import TopNavigationBar from './TopNavigationBar';
// import StripeSampleFooter from './StripeSampleFooter';
import PaymentForm from "./PaymentForm";
import Product from "./Product";
import isEmpty from "../../../store/validations/is-empty";
import { useSelector, useDispatch } from "react-redux";
import {
  getPriceIdByProduct,
  updateCustomerAddress,
} from "./../../../store/actions/paymentAction";
import Modal from "react-responsive-modal";

import WarningPopup from "./../popups/WarningPopup";
import PrePaymentPopup from "./../popups/PrePaymentPopup";
import EmployeeDeletePopup from "./../popups/EmployeeDeletePopup";
import AddPaymentAddress from "./../popups/AddPaymentAddress";
import {
  getAllResourceAction,
  deleteResource,
} from "./../../../store/actions/resourcesAction";

let OrganizationData = JSON.parse(localStorage.getItem("OrganizationData"));

const Prices = ({ location }) => {
  const dispatch = useDispatch();
  const [currentProductData, setCurrentProductData] = useState("");
  const [productSelected, setProduct] = useState(null);
  const [customerId, setCustomerId] = useState("");
  const [allProducts, setProducts] = useState([]);
  const [priceId, setPriceId] = useState("");
  const [activePlan, setActivePlan] = useState("");
  const [allUsers, setAllUsers] = useState([]);
  const [deleteEmployeeList, setDeleteEmployeeList] = useState([]);
  const [stripeCustomerObject, setStripeCustomerObject] = useState({});

  //popup states

  const [downgradeWarningPopup, setDowngradeWarningPopup] = useState(false);
  const [prePaymentPopup, setPrePaymentPopup] = useState(false);
  const [cardDetailPopup, setCardDetailPopup] = useState(false);
  const [empDeletePopup, setempDeletePopup] = useState(false);
  const [addPaymentAddresspopup, setaddPaymentAddresspopup] = useState(false);

  //componentDidMount
  useEffect(() => {
    let OrganizationData = JSON.parse(localStorage.getItem("OrganizationData"));
    if (!isEmpty(OrganizationData)) {
      setCustomerId(OrganizationData.customerId);
      if (OrganizationData.planStatus === "CANCELLED") {
        dispatch(getPriceIdByProduct("prod_IXDyftQuNSM441", callBackGetPrice));
      } else if (!isEmpty(OrganizationData.productId)) {
        dispatch(
          getPriceIdByProduct(OrganizationData.productId, callBackGetPrice)
        );
      }
    }
    dispatch(getAllResourceAction());
  }, []);

  //static getderived

  const allPlans = useSelector((state) => state.auth.plans);

  const allActiveUsersWithoutAdmin = useSelector(
    (state) => state.resources.allResources
  );

  const customerObject = useSelector(
    (state) => state.payment.customerStripeObject
  );

  useEffect(() => {
    if (!isEmpty(customerObject)) {
      setStripeCustomerObject(customerObject);
    }
  }, [customerObject]);

  useEffect(() => {
    if (!isEmpty(allPlans)) {
      let OrganizationData = JSON.parse(
        localStorage.getItem("OrganizationData")
      );
      setProducts(allPlans);

      if (
        OrganizationData.planStatus !== "CANCELLED" &&
        !isEmpty(OrganizationData.productId)
      ) {
        let currentProduct = {};
        currentProduct = allPlans.filter(
          (ele) => ele.id === OrganizationData.productId
        );
        setCurrentProductData(currentProduct[0]);
        setProduct(currentProduct[0]);
        setActivePlan(currentProduct[0].name);
      } else {
        // let currentProduct = {};
        // currentProduct = allPlans.filter(
        //   (ele) => ele.id === "prod_IXDyftQuNSM441"
        // );
        // setCurrentProductData(currentProduct[0]);
        // setProduct(currentProduct[0]);
        // setActivePlan(currentProduct[0].name);
      }
    }
  }, [allPlans]);

  useEffect(() => {
    if (!isEmpty(allActiveUsersWithoutAdmin)) {
      let filterData = allActiveUsersWithoutAdmin.filter(
        (user) =>
          user.role.name !== "Administrator" && user.status === "INVITED"
      );
      setAllUsers(filterData);
    }
  }, [allActiveUsersWithoutAdmin]);

  function handleClick(product) {
    let OrganizationData = JSON.parse(localStorage.getItem("OrganizationData"));
    //setting data in state

    const formData = {
      productId: product.id,
      currency: OrganizationData.currency,
    };
    dispatch(getPriceIdByProduct(formData, callBackGetPrice));
    setProduct(product);
    setActivePlan(product.name);

    //check for meployee delete popup
    if (parseInt(product.metadata.maxUsers) < allUsers.length + 1) {
      console.log("delete popup");
      setempDeletePopup(true);
    } else {
      console.log("continue");
      //check for downgrade and proceed popup

      if (!isEmpty(OrganizationData.productId)) {
        if (
          parseInt(product.metadata.maxUsers) <
          parseInt(currentProductData.metadata.maxUsers)
        ) {
          setDowngradeWarningPopup(true);
        } else {
          setPrePaymentPopup(true);
        }
      } else {
        setPrePaymentPopup(true);
      }
    }
  }

  const callBackGetPrice = (priceId) => {
    setPriceId(priceId);
  };

  const onCloseHandler = () => {
    setCardDetailPopup(false);
    setPrePaymentPopup(false);
    setDowngradeWarningPopup(false);
  };

  const continueHandler = () => {
    if (
      !isEmpty(stripeCustomerObject) &&
      stripeCustomerObject.address === null
    ) {
      setaddPaymentAddresspopup(true);
    } else {
      setCardDetailPopup(true);
    }
  };

  const continuePrepaymentHandler = () => {
    setPrePaymentPopup(true);
    setDowngradeWarningPopup(false);
  };

  const payNowHandler = () => {
    let OrganizationData = JSON.parse(localStorage.getItem("OrganizationData"));
    if (isEmpty(activePlan)) {
      alert("Please select plan to continue");
    } else {
      if (parseInt(productSelected.metadata.maxUsers) < allUsers.length + 1) {
        console.log("delete popup");
        setempDeletePopup(true);
      } else {
        console.log("continue");
        //check for downgrade and proceed popup
        if (!isEmpty(OrganizationData.productId)) {
          if (
            parseInt(productSelected.metadata.maxUsers) <
            parseInt(currentProductData.metadata.maxUsers)
          ) {
            setDowngradeWarningPopup(true);
          } else {
            setPrePaymentPopup(true);
          }
        } else {
          setPrePaymentPopup(true);
        }
      }
    }
  };

  const renderTakeCardDetails = () => {
    return (
      <Modal
        open={cardDetailPopup}
        onClose={() => console.log("unable to close")}
        // closeOnEsc={true}
        closeOnOverlayClick={false}
        center
        classNames={{
          overlay: "customOverlay",
          modal: "customModal-warning customModal--card-details",
          closeButton: "customCloseButton",
        }}
      >
        <span className="closeIconInModal" onClick={onCloseHandler} />
        <PaymentForm
          productSelected={productSelected}
          customerId={customerId}
          productPriceId={priceId}
        />
      </Modal>
    );
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
      alert("Please select employee");
      //   Alert.success("<h4>Please select employee</h4>", {
      //     position: "top-right",
      //     effect: "slide",
      //     beep: false,
      //     html: true,
      //     timeout: 5000,
      //     // offset: 100
      //   });
    } else {
      dispatch(deleteResource(deleteEmployeeList, callBackDelete));
    }
  };

  /*============================
        Checkbox events handler
  =============================*/

  const doEmailExist = (email) => {
    let obj = deleteEmployeeList.find((emp) => emp === email);
    console.log(obj);
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

  const onCloseModal = () => {
    setempDeletePopup(false);
    setaddPaymentAddresspopup(false);
  };

  const callBackAddAdress = (status) => {
    if (status === 200) {
      setaddPaymentAddresspopup(false);
    }
  };

  const saveAddressHandler = (values, selectedCountry) => (e) => {
    let OrganizationData = JSON.parse(localStorage.getItem("OrganizationData"));
    e.preventDefault();
    const formData = {
      customerId: OrganizationData.customerId,
      payLoad: {
        address: {
          city: values.city,
          country: selectedCountry,
          line1: values.companyAddress,
          line2: null,
          postal_code: values.pincode,
          state: values.state,
        },
      },
    };

    dispatch(updateCustomerAddress(formData, callBackAddAdress));
  };

  return (
    <div className="p-6">
      {/* <TopNavigationBar /> */}

      <AddPaymentAddress
        addPaymentAddresspopup={addPaymentAddresspopup}
        onCloseModal={onCloseModal}
        saveAddressHandler={saveAddressHandler}
      />

      <WarningPopup
        onCloseHandler={onCloseHandler}
        downgradeWarningPopup={downgradeWarningPopup}
        currentProductData={currentProductData}
        productSelected={productSelected}
        continueHandler={continuePrepaymentHandler}
      />
      <PrePaymentPopup
        onCloseHandler={onCloseHandler}
        prePaymentPopup={prePaymentPopup}
        productSelected={productSelected}
        continueHandler={continueHandler}
      />

      <EmployeeDeletePopup
        allUsers={allUsers}
        empDeletePopup={empDeletePopup}
        employeeDeleteHandler={employeeDeleteHandler}
        doEmailExist={doEmailExist}
        onChangeCheckbox={onChangeCheckbox}
        toggle={toggle}
        onCloseModal={onCloseModal}
      />

      <div>
        <div className="md:w-1/3 w-full mr-4 md:mb-8">
          <div className="plan-heading text-pasha font-bold text-2xl mt-4 mb-6">
            Current plan
          </div>
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
                      activePlan={activePlan}
                    />
                  );
                })}
            </div>
          </div>
          <button className="make-payment" onClick={payNowHandler}>
            {" "}
            Pay now
          </button>
          {/* 
          <div className="flex justify-between mb-8">
            {!isEmpty(allProducts) &&
              allProducts.map((product, index) => {
                return (
                  <Product
                    key={index}
                    product={product}
                    handleClick={handleClick}
                  />
                );
              })}
          </div> */}
          {productSelected
            ? renderTakeCardDetails()
            : // <PaymentForm
              //   productSelected={productSelected}
              //   customerId={customerId}
              //   productPriceId={priceId}
              // />
              null}
        </div>
      </div>

      {/* <StripeSampleFooter /> */}
    </div>
  );
};

export default withRouter(Prices);
