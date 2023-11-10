import React, { Component, Fragment } from "react";
import Modal from "react-responsive-modal";
import { Link, withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { logoutUser } from "./../../../store/actions/authAction";
import isEmpty from "../../../store/validations/is-empty";
import GrayButtonSmallFont from "./../../desktop/common/GrayButtonSmallFont";
import GreenButtonSmallFont from "./../../desktop/common/GreenButtonSmallFont";
import GreenLinkSmallFont from "./../../desktop/common/GreenLinkSmallFont";

export class FreeTrielAndSubscriptionEnded extends Component {
  constructor() {
    super();
    this.state = {};
  }

  /*===========================================

  =============================================*/

  logoutHandler = () => {
    this.props.logoutUser();
    this.props.history.push("/login");
  };

  ongreenButtonHandler = () => {
    window.location.href = "http://remote-teams.io";
  };

  render() {
    // console.log(this.props.organizationData);
    const { open, heading, description, role } = this.props;
    let OrganizationData = JSON.parse(localStorage.getItem("OrganizationData"));
    // let isRefundRequested =
    //   !isEmpty(OrganizationData) && OrganizationData.isRefundRequested;
    // let subscriptionType =
    //   !isEmpty(OrganizationData) && OrganizationData.subscriptionType;
    if (OrganizationData.planStatus === "TRIAL_OVER") {
      return (
        <Fragment>
          <Modal
            onClose={() => console.log("Unable to close")}
            open={open}
            // onClose={onCloseModal}
            closeOnEsc={true}
            closeOnOverlayClick={false}
            center
            classNames={{
              overlay: "",
              modal: "free_trail_ended_popup",
              closeButton: "customCloseButton",
            }}
          >
            {/* <span className="closeIconInModal" onClick={onCloseModal} /> */}
            <div className="text-center">
              <img
                src={require("./../../../assets/img/payment/free_trail_ended.svg")}
                alt=""
              />
              <h3>{heading}</h3>
              <p className="mt-3 mb-3">{description}</p>
              <div className="button_section">
                <GrayButtonSmallFont
                  onClick={this.logoutHandler}
                  text={"Logout"}
                />
                <GreenLinkSmallFont path="/payment" text={"Proceed Payment"} />
              </div>
            </div>
          </Modal>
        </Fragment>
      );
    } else if (OrganizationData.planStatus === "CANCELLED") {
      return (
        <Fragment>
          <Modal
            onClose={() => console.log("Unable to close")}
            open={open}
            // onClose={onCloseModal}
            closeOnEsc={true}
            closeOnOverlayClick={false}
            center
            classNames={{
              overlay: "",
              modal: "payment_popups_custom",
              closeButton: "customCloseButton",
            }}
          >
            {/* <span className="closeIconInModal" onClick={onCloseModal} /> */}
            <div className="warning-popup-container text-center">
              {/* <GrayButtonSmallFont
                extraClassName="go_to_logout"
                onClick={this.logoutHandler}
                text={"Go Back To Login"}
              /> */}
              <img
                className="payment_warning_popup_img"
                src={require("./../../../assets/img/payment/refund_initiated.svg")}
                alt=""
              />
              {/* {!isEmpty(OrganizationData) &&
              OrganizationData.isRefundRequested === true ? (
                <h1>Hi there!</h1>
              ) : ( */}
              <h1>Hello!</h1>
              {/* )} */}

              {/* {!isEmpty(OrganizationData) &&
              OrganizationData.isRefundRequested === true ? (
                <p className="mt-3 mb-3">
                  Your refund request post cancellation of free trial is under
                  process and will be completed in <span>1-2 days.</span> Don't
                  Worry! you will be able to subscribe for this workspace post
                  completion of the request. Meanwhile, you can
                </p>
              ) : ( */}
              <p className="mt-3 mb-3">
                Your subscription has ended, but don't worry you can pay now to
                continue using your dominate workspace.
              </p>
              {/* )} */}
              <div className="button_section">
                {role === "Support" ||
                  (role === "Administrator" && (
                    <GrayButtonSmallFont
                      extraClassName="go_to_logout"
                      onClick={this.logoutHandler}
                      text={"Cancel"}
                    />
                  ))}

                {role === "Support" ||
                  (role === "Administrator" && (
                    <GreenLinkSmallFont path="/payment" text={"Pay Now"} />
                  ))}
              </div>
            </div>
          </Modal>
        </Fragment>
      );
    }
  }
}

const mapStateToProps = (state) => ({
  organizationData: state.auth.organizationData,
});

export default connect(null, { logoutUser })(
  withRouter(FreeTrielAndSubscriptionEnded)
);
