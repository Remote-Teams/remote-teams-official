import React from "react";
import Modal from "react-responsive-modal";
import GreenButtonSmallFont from "../common/GreenButtonSmallFont";

const PaymentFailed = ({ paymentFailedPopup, onCloseHandler }) => {
  return (
    <div>
      <Modal
        open={paymentFailedPopup}
        onClose={onCloseHandler}
        closeOnEsc={true}
        closeOnOverlayClick={false}
        center
        classNames={{
          overlay: "customOverlay customOverlay--warning_before_five_days",
          modal: "customModal customModal--cancel-subscription",
          // customeModel_warning_befor_subscription_cancel warning_before_subscription_cancel
          closeButton: "customCloseButton",
        }}
      >
        <span className="closeIconInModal" onClick={onCloseHandler} />

        {/* logo */}
        {/* warning_before_plan_expired_container text-center */}
        <div className="text-center permission-warning-div">
          <div>
            <img
              // className="payment-illustration-images"
              // src={require("./../../../assets/img/payment/free_trial_end.svg")}
              // alt=""
              className="permission-warning-img"
              src={require("./../../../assets/img/illustrations/payment-failed.png")}
              alt=""
            />
            <h3 className="permission-warning-gradient-text">Uh-oh!</h3>
            <p className="font-18-regular pt-30">
              {/* Your subscription has been paused due to payment failure on your
              current card. Please add another card to retry payement */}
              Looks like your subscription has been paused due to payment
              failure on your current card. <br />
              Please add another card to retry payement
            </p>
            {/* go_to_dashboard */}
            <div className={"text-center"} className="mt-50">
              {/* <button onClick={onCloseHandler} className="">
                Okay
              </button> */}
              <GreenButtonSmallFont onClick={onCloseHandler} text={"Okay"} />
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default PaymentFailed;
