import React, { Fragment, useState, useEffect } from "react";
import Prices from "./Prices";
import Modal from "react-responsive-modal";
import isEmpty from "../../../store/validations/is-empty";
import { useDispatch } from "react-redux";
import {
  logoutUser,
  getPlansAction,
} from "./../../../store/actions/authAction";
import { getStripeCustomerObject } from "./../../../store/actions/paymentAction";

const PaymentMain = () => {
  const dispatch = useDispatch();
  const [plansPopUp, setPopup] = useState(true);

  useEffect(() => {
    let OrganizationData = JSON.parse(localStorage.getItem("OrganizationData"));
    setTimeout(() => {
      dispatch(
        getPlansAction({
          currency: OrganizationData.currency,
        })
      );
    }, 10);

    dispatch(getStripeCustomerObject(OrganizationData.customerId));
  }, []);

  const FreeTrailEndSectionDisplay = () => {
    return (
      <Fragment>
        <Prices />
      </Fragment>
    );
  };

  const newCardSubscriptionHandler = () => {
    console.log("sdsd");
  };

  const PaymentFailedSectionDisplay = () => {
    return (
      <Fragment>
        <label htmlFor="workspaceName">Renew Subscription</label>
        <div className="subscription container">
          <div className="row">
            <div
              className="mt-5 mb-5"
              style={{
                display: "flex",
                width: "100%",
                justifyContent: "space-evenly",
              }}
            >
              <div className="new_card_block">
                <button
                  style={{ padding: "10px" }}
                  onClick={newCardSubscriptionHandler}
                >
                  Using New Card
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="buttons-section">
          <button
            onClick={() => dispatch(logoutUser())}
            className="cancel-payment"
          >
            Cancel
          </button>

          {/* <button onClick={this.planUpdateHandler} className="make-payment">
            {data.subscriptionType === "FREE" ? "Pay now" : "Update"}
          </button> */}
        </div>
      </Fragment>
    );
  };
  let OrganizationData = JSON.parse(localStorage.getItem("OrganizationData"));
  return (
    <Modal
      open={plansPopUp}
      onClose={() => console.log("unable to close")}
      closeOnEsc={true}
      closeOnOverlayClick={false}
      center
      classNames={{
        overlay: "expired-plans-update-sections",
        modal: "customModal customModal--addLead ",
        closeButton: "customCloseButton",
      }}
    >
      <Fragment>
        <div className="justify-content-space-between">
          <div className="payment-main-conatiner">
            {OrganizationData.planStatus === "TRIAL_OVER"
              ? // &&
                // organizationData.status === "EXPIRED"
                FreeTrailEndSectionDisplay()
              : PaymentFailedSectionDisplay()}
          </div>
        </div>
      </Fragment>
    </Modal>
  );
};

export default PaymentMain;
