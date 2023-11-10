import React from "react";
import Modal from "react-responsive-modal";

const CancelSubscriptionSuccess = ({
  cancelSubscriptionSuccess,
  logoutHandler,
}) => {
  return (
    <div>
      <Modal
        open={cancelSubscriptionSuccess}
        onClose={logoutHandler}
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
        <span className="closeIconInModal" onClick={logoutHandler} />

        {/* logo */}
        <div className="warning_before_plan_expired_container text-center">
          <div>
            <img
              className="cancel-subscription-success-img"
              //src={require("./../../../assets/img/payment/cancel-befor-5days.svg")}
              src={require("./../../../assets/img/illustrations/cancel-subscription-success.png")}
              alt=""
            />
            <h3 className="cancel-subscription-title">
              {/*We are sad to see you go so soon!*/}
              We will miss you :(
            </h3>
            <p className="cancel-subscription-success-para font-18-regular pt-10">
              {/*Your subscription has now been cancelled and you will not be
              billed from next month.*/}
              Your subscription has been cancelled and you will not be billed
              <br />
              from next month
            </p>
            {/**go_to_dashboard */}
            <div
              className={"text-center cancel-subscription-btn-section mt-40"}
            >
              <button onClick={logoutHandler} className="login-next-green-btn">
                Exit
              </button>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default CancelSubscriptionSuccess;
