import React from "react";
import Modal from "react-responsive-modal";

const AlreadyCanceledSubscription = ({
  canceledSubscriptionPopup,
  onCloseHandler,
}) => {
  return (
    <div>
      <Modal
        open={canceledSubscriptionPopup}
        onClose={onCloseHandler}
        closeOnEsc={true}
        closeOnOverlayClick={false}
        center
        classNames={{
          overlay: "customOverlay customOverlay--warning_before_five_days",
          modal: "customModal customModal--cancel-subscription",
          //"customeModel_warning_befor_subscription_cancel warning_before_subscription_cancel",
          closeButton: "customCloseButton",
        }}
      >
        <span className="closeIconInModal" onClick={onCloseHandler} />

        {/* logo */}
        <div className="warning_before_plan_expired_container text-center">
          <div>
            {/* <img
              className="payment-illustration-images"
              src={require("./../../../assets/img/payment/cancel-befor-5days.svg")}
              alt=""
            /> */}
            <img
              className="cancel-subscription-success-img"
              //src={require("./../../../assets/img/payment/cancel-befor-5days.svg")}
              src={require("./../../../assets/img/illustrations/cancel-subscription-success.png")}
              alt=""
            />

            <h3 className="cancel-subscription-title">Subscription Canceled</h3>

            <p className="cancel-subscription-success-para font-18-regular pt-20">
              Your subscription has been cancelled as you canceled your
              <br />
              subscription, but don't worry you can pay now to continue using
              <br />
              your {/*dominate*/}remote team workspace.
            </p>

            <div
              className={"text-center cancel-subscription-btn-section mt-40"}
            >
              {/**className="go_to_dashboard" */}
              <button onClick={onCloseHandler} className="login-next-green-btn">
                Okay
              </button>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default AlreadyCanceledSubscription;
