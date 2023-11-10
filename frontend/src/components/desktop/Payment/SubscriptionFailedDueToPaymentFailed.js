import React, { Component, Fragment } from "react";
import Modal from "react-responsive-modal";
import { Link, withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { logoutUser } from "./../../../store/actions/authAction";
import isEmpty from "../../../store/validations/is-empty";
import GrayButtonSmallFont from "./../common/GrayButtonSmallFont";
import GreenButtonSmallFont from "./../common/GreenButtonSmallFont";
import {
  afterPaymentSuccessAction,
  sendMenualRetry,
  cancelImmediateSubscription,
} from "./../../../store/actions/paymentAction";

export class SubscriptionFailedDueToPaymentFailed extends Component {
  constructor() {
    super();
    this.state = {
      open: true,
      cancelSubscriptionWarning: false,
      menualRetryPopup: false,
      manualRetrySucess: false,
    };
  }

  /*================================
    Cancel subscription handlers
  =================================*/
  cancelSubscriptionWarning = () => {
    console.log("dssd");
    this.setState({
      cancelSubscriptionWarning: true,
      open: false,
    });
  };

  /*=============================
      Razorpay Handler
  ==============================*/
  addNewCardHandler = (after) => (e) => {
    let organizationData = JSON.parse(localStorage.getItem("OrganizationData"));

    e.preventDefault();
    console.log("clicked");
    let options = {
      key_id: "rzp_test_ZDy1AcYxHc2peM",
      key_secret: "ZYbRjKyIOr8GrHHLHRhwM6i1",
      // key: "rzp_test_oOhCH5JNFeFkuI",
      subscription_id: organizationData.billingId,
      subscription_card_change: 1,
      amount: "1000", // 2000 paise = INR 20, amount in paisa
      currency: "INR",
      // order_id: this.state.orderIdData.id,
      name: "Dominate",
      description: "Billing",
      image:
        "https://res.cloudinary.com/myrltech/image/upload/v1578390114/Group_1546.svg",
      handler: function (response) {
        // window.location.href = "/payment-success";
        after(response);
        // alert(response.razorpay_payment_id);
        // alert(response.razorpay_order_id);
        // alert(response.razorpay_signature);
      },
      prefill: {
        name: "Harshil Mathur",
        email: "harshil@razorpay.com",
      },
      notes: {
        address: "Hello World",
      },
      theme: {
        color: "#502effab",
      },
    };

    let rzp = new window.Razorpay(options);
    rzp.open();
  };

  /*==================================
      After Payment Sucess Handler
====================================*/
  afterPyment = (paymentResponse) => {
    console.log(paymentResponse);
    let organizationData = JSON.parse(localStorage.getItem("OrganizationData"));
    console.log(paymentResponse);

    if (paymentResponse) {
      const afterPayment = {
        workspaceId: organizationData.workspaceId,
        organizationId: organizationData._id,
        plan: organizationData.billingType,
        success: true,
        subscriptionId: organizationData.billingId,
        paymentId: paymentResponse.razorpay_payment_id,
      };
      this.props.afterPaymentSuccessAction(afterPayment, this.props.history);
    } else {
      console.log("failsed");
    }
  };

  logoutHandler = () => {
    this.props.logoutUser();
  };

  onCloseModal = () => {
    this.setState({
      cancelSubscriptionWarning: false,
      open: true,
      menualRetryPopup: false,
    });
  };

  menualRetryHandle = () => {
    this.setState({
      menualRetryPopup: true,
      open: false,
    });
  };

  manualRetryCallback = (status) => {
    if (status === 200) {
      this.setState({
        manualRetrySucess: true,
      });
    }
  };

  sendMenualRetryHandler = () => {
    let organizationData = JSON.parse(localStorage.getItem("OrganizationData"));

    const formData = {
      organisation_id: organizationData._id,
    };
    this.props.sendMenualRetry(formData, this.manualRetryCallback);
  };

  logoutHandle = () => {
    this.props.logoutUser();
  };

  cancelSubscriptionHandler = () => {
    let organizationData = JSON.parse(localStorage.getItem("OrganizationData"));

    const formData = {
      organisation_id: organizationData._id,
    };
    this.props.cancelImmediateSubscription(formData);
  };

  renderManualRetrySucess = () => {
    const { manualRetrySucess } = this.state;
    return (
      <Fragment>
        <Modal
          open={manualRetrySucess}
          onClose={this.onCloseModal}
          closeOnEsc={true}
          closeOnOverlayClick={false}
          center
          classNames={{
            overlay: "",
            modal: "manual_retry_success_popup",
            closeButton: "customCloseButton",
          }}
        >
          {/* <span className="closeIconInModal" onClick={this.onCloseModal} /> */}

          {/* logo */}
          <div className="subscription_ended_due_to_payment_failed text-center">
            <img
              src={require("./../../../assets/img/payment/manual_request_sent.svg")}
              alt=""
            />
            <h3>Your request has been sent.</h3>
            <p>
              If your payment is <span>successful</span>, you will receive
              confirmation by mail<br></br> and subscription will turn into
              active state again.
              <br></br>
              Otherwise, you will be informed via mail in case of a failure.
            </p>
            <div className="button_section">
              <GreenButtonSmallFont
                onClick={this.logoutHandle}
                text={"Logout"}
              />
            </div>
          </div>
        </Modal>
      </Fragment>
    );
  };

  renderCancelSubscriptionWarning = () => {
    const { cancelSubscriptionWarning } = this.state;
    return (
      <Fragment>
        <Modal
          open={cancelSubscriptionWarning}
          onClose={this.onCloseModal}
          closeOnEsc={true}
          closeOnOverlayClick={false}
          center
          classNames={{
            overlay: "",
            modal: "cancel_immediate_subscription_warning",
            closeButton: "customCloseButton",
          }}
        >
          {/* <span className="closeIconInModal" onClick={this.onCloseModal} /> */}

          {/* logo */}
          <div className="warning_before_plan_expired_container">
            <div>
              <img
                className="cancel_subscription_img"
                src={require("./../../../assets/img/payment/cancel_immediate_subscription.svg")}
                alt=""
              />
              <h3>Are you sure </h3>
              <p>
                you want to cancel your subscription? <br></br>
                Please note that this cancellation will be effective
                immediately.
              </p>
              <div className="button_section">
                <GrayButtonSmallFont
                  onClick={this.onCloseModal}
                  text={"No,go back"}
                />

                <GreenButtonSmallFont
                  onClick={this.cancelSubscriptionHandler}
                  text={"Yes,Continue"}
                />
              </div>
            </div>
          </div>
        </Modal>
      </Fragment>
    );
  };

  renderMenualRetryWarning = () => {
    const { menualRetryPopup } = this.state;
    return (
      <Fragment>
        <Modal
          open={menualRetryPopup}
          onClose={this.onCloseModal}
          closeOnEsc={true}
          closeOnOverlayClick={false}
          center
          classNames={{
            overlay: "",
            modal: "payment_failed_popup",
            closeButton: "customCloseButton",
          }}
        >
          {/* <span className="closeIconInModal" onClick={this.onCloseModal} /> */}

          {/* logo */}
          <div className="subscription_ended_due_to_payment_failed text-center">
            <div className="payment-popup-alert">
              <p>
                <i className="fa fa-exclamation-triangle"></i> Payment failure
              </p>
            </div>
            <img
              src={require("./../../../assets/img/payment/raise_menual_request.svg")}
              alt=""
            />
            <h4>
              Are you sure you want to request for manual retry?<br></br> you
              can only try once.{" "}
            </h4>
            <p>
              Please check if your credit/debit card is active and has
              sufficient <br></br> balance before proceeding.
            </p>
            <div className="button_section">
              <GrayButtonSmallFont
                onClick={this.onCloseModal}
                text={"No,go back"}
              />

              <GreenButtonSmallFont
                onClick={this.sendMenualRetryHandler}
                text={"Yes,Continue"}
              />
            </div>
          </div>
        </Modal>
      </Fragment>
    );
  };

  render() {
    const { open, heading, description, role } = this.props;
    let OrganizationData = JSON.parse(localStorage.getItem("OrganizationData"));
    let billingInfo =
      !isEmpty(OrganizationData) && OrganizationData.billingInfo;
    return (
      <Fragment>
        {this.renderCancelSubscriptionWarning()}
        {this.renderMenualRetryWarning()}
        {this.renderManualRetrySucess()}
        <Modal
          onClose={() => console.log("Unable to close")}
          open={this.state.open}
          // onClose={onCloseModal}
          closeOnEsc={true}
          closeOnOverlayClick={false}
          center
          classNames={{
            overlay: "",
            modal: "payment_failed_popup",
            closeButton: "customCloseButton",
          }}
        >
          <span className="closeIconInModal" onClick={this.logoutHandle} />
          <div className="subscription_ended_due_to_payment_failed text-center">
            <div className="payment-popup-alert">
              <p>
                <i className="fa fa-exclamation-triangle"></i> Payment failure
              </p>
            </div>
            <img
              src={require("./../../../assets/img/payment/payment_failed.svg")}
              alt=""
            />
            <h3>Uh-oh!</h3>
            <p>
              Looks like your subscription has paused due to payment failure
              <br></br>
              Would you like to
            </p>

            <div className="button_section">
              <GrayButtonSmallFont
                onClick={this.addNewCardHandler(this.afterPyment)}
                text={"Add new card"}
              />

              {billingInfo.isManualRequestGenerated === false && (
                <GreenButtonSmallFont
                  extraClassName={"request_manual_retry"}
                  onClick={this.menualRetryHandle}
                  text={"Request manual Retry"}
                />
              )}

              <p
                className="cancel_subscription"
                onClick={this.cancelSubscriptionWarning}
              >
                Cancel Subscription
              </p>
              <hr></hr>
            </div>
            {billingInfo.isManualRequestGenerated === true &&
            billingInfo.isManualRequestFailed === false ? (
              <p className="text-left please_note">
                Please note: You are not seeing the manual retry option because{" "}
                <br></br>your previous request for payment is in progress.
                <br></br> Kindly wait for its completion.
              </p>
            ) : billingInfo.isManualRequestGenerated === true &&
              billingInfo.isManualRequestFailed === true ? (
              <p className="text-left please_note">
                Please note: You are not seeing the manual retry option because
                <br></br>your previous request for payment has failed.
              </p>
            ) : (
              <p className="text-left please_note">
                Please note: If you don't take any action and close this page,
                we will retry auto-debit for 3 days<br></br> from the day first
                payment failure occurred.
              </p>
            )}
          </div>
        </Modal>
      </Fragment>
    );
  }
}

export default connect(null, {
  logoutUser,
  afterPaymentSuccessAction,
  sendMenualRetry,
  cancelImmediateSubscription,
})(withRouter(SubscriptionFailedDueToPaymentFailed));
