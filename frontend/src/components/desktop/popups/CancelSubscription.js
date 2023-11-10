import React from "react";
import Modal from "react-responsive-modal";

const CancelSubscription = ({
  cancelSubscriptionPopup,
  onCloseHandler,
  cancelSubscriptionHandler,
}) => {
  return (
    <div>
      <Modal
        open={cancelSubscriptionPopup}
        onClose={onCloseHandler}
        closeOnEsc={true}
        closeOnOverlayClick={false}
        center
        classNames={{
          overlay: "customOverlay customOverlay--warning_before_five_days",
          modal: "customModal customModal--cancel-subscription",
          //customeModel_warning_befor_subscription_cancel warning_before_subscription_cancel
          closeButton: "customCloseButton",
        }}
      >
        <span className="closeIconInModal" onClick={onCloseHandler} />

        {/* logo */}
        <div className="warning_before_plan_expired_container text-center">
          <div className="text-center">
            <img
              className="cancel-subscription-img"
              //src={require("./../../../assets/img/payment/cancel-sub.svg")}
              src={require("./../../../assets/img/illustrations/cancel-subscription.png")}
              alt=""
            />
            <h3 className="cancel-subscription-title ">
              Are you sure you want to cancel your subscription?
            </h3>
            <p className="cancel-subscription-para pt-10 font-18-regular">
              {/*We have more exciting stuff coming on the way!*/}
              We have so many exciting stuff coming your way!
            </p>
            <div className="mt-40 cancel-subscription-btn-section">
              <button
                onClick={onCloseHandler}
                className="mr-30 login-dashboard-btn"
              >
                No
              </button>
              {/**button_section upgrade_button later_button*/}
              <button
                onClick={cancelSubscriptionHandler}
                className="login-next-green-btn"
              >
                Yes
              </button>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default CancelSubscription;
