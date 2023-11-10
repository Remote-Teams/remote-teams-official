import React from "react";
import Modal from "react-responsive-modal";

function PermissionWarning({ permissionWarning, onCloseHandler }) {
  return (
    <Modal
      open={permissionWarning}
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
      {/* <div className="warning_before_plan_expired_container text-center"> */}
      <div className="text-center permission-warning-div">
        <img
          className="permission-warning-img"
          //src={require("./../../../assets/img/payment/cancel-sub.svg")}
          // src={require("./../../../assets/img/illustrations/cancel-subscription.png")}
          src={require("./../../../assets/img/illustrations/permission-warning.png")}
          alt=""
        />
        <h2 className="permission-warning-gradient-text">Uh-oh!</h2>
        <h5 className="font-18-regular pt-30">
          {/* You do not have the required permissions to access this feature,
          please contact your admin */}
          Looks like you do not have the required persmisisons to access this
          feature,
          <br />
          please contact administrator
        </h5>
      </div>
      {/* </div> */}
    </Modal>
  );
}

export default PermissionWarning;
