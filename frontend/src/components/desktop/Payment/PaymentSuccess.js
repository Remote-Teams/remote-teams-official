import React, { Component } from "react";
import { updateDataAfterPaymentSuccess } from "./../../../store/actions/paymentAction";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { logoutUser } from "./../../../store/actions/authAction";
import GreenButtonSmallFont from "../common/GreenButtonSmallFont";
import GreenLinkSmallFont from "../common/GreenLinkSmallFont";

export class PaymentSuccess extends Component {
  /*===============================
          Lifecycle Methods
  =================================*/
  componentDidMount() {
    this.props.updateDataAfterPaymentSuccess();
  }

  afterPaymentSuccessLogout = () => {
    this.props.logoutUser();
  };

  render() {
    const { userRole } = this.props;
    let OrganizationData = JSON.parse(localStorage.getItem("OrganizationData"));
    return (
      <>
        <div className="payment-success-main-container">
          <div className="payment-success-box">
            <img
              src={require("../../../assets/img/illustrations/payment-success.svg")}
              alt=""
              className="payment-success-img"
            />
            <h3 className="payment-success-box__text1">Yay!</h3>
            <p className="font-24-semiBold">
              Your Payment has been made successfully.
            </p>
            <div className="payment-success-box__btnDiv">
              {OrganizationData.planStatus === "TRIAL_OVER" ? (
                <GreenButtonSmallFont
                  text="Login"
                  onClick={this.afterPaymentSuccessLogout}
                />
              ) : (
                <GreenLinkSmallFont path="/profile" text="Continue" />
              )}
            </div>
          </div>
        </div>
      </>
    );
  }
}

const mapStateToProps = (state) => ({
  userRole: state.auth.user,
});

export default connect(mapStateToProps, {
  updateDataAfterPaymentSuccess,
  logoutUser,
})(PaymentSuccess);
