import React from "react";

import { connect } from "react-redux";
import { Route, Redirect } from "react-router-dom";
import FreeTrielAndSubscriptionEnded from "../../components/desktop/Payment/FreeTrielAndSubscriptionEnded";
import isEmpty from "./../validations/is-empty";
// import WarningBeforePlanExpired from "../../components/desktop/popups/WarningBeforePlanExpired";
import SubscriptionFailedDueToPaymentFailed from "../../components/desktop/Payment/SubscriptionFailedDueToPaymentFailed";
import dateFns from "date-fns";
import OverviewDemoModalFirstTimeUser from "./../../components/desktop/demo-overview/OverviewDemoModalFirstTimeUser";
import Loader from "react-loader-spinner";
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";

const PrivateRoute = ({ component: Component, auth, ...rest }) => {
  let OrganizationData = JSON.parse(localStorage.getItem("OrganizationData"));
  let isRefundRequested =
    !isEmpty(OrganizationData) && OrganizationData.isRefundRequested;
  let billingInfo = !isEmpty(OrganizationData) && OrganizationData.billingInfo;
  var renderFreeTrialEndedPopup;
  var renderSubscriptionEndedPopup;
  var renderSubscriptionFailedDueToPaymentFailed;
  // console.log(isEmpty(auth.user.role), "Funca");
  if (auth.isAuthenticated) {
    renderSubscriptionFailedDueToPaymentFailed = (
      <SubscriptionFailedDueToPaymentFailed open={true} />
    );

    renderFreeTrialEndedPopup = (
      <FreeTrielAndSubscriptionEnded
        heading="Sorry!"
        role={!isEmpty(auth.user.role) && auth.user.role.name}
        open={true}
        description={
          !isEmpty(auth.user.role) &&
          (auth.user.role.name === "Support" ||
            auth.user.role.name === "Administrator")
            ? "Your free trial has expired. Please pay now to continue using Dominate."
            : "Sorry, your free trial ended. Please Contact Your Administrator"
        }
      />
    );
    // Subscription end popup
    renderSubscriptionEndedPopup = (
      <FreeTrielAndSubscriptionEnded
        open={true}
        role={!isEmpty(auth.user.role) ? auth.user.role.name : "Employee"}
        heading="Subscription Ended"
        description={
          ""
          // !isEmpty(auth.user.role) &&
          // auth.user.role.name === "Support" &&
          // isRefundRequested === false
          //   ? "proceedForPayment"
          //   : !isEmpty(auth.user.role) &&
          //     auth.user.role.name === "Support" &&
          //     isRefundRequested === true
          //   ? "notProceedForPayment"
          //   : "Sorry, your Subscription has been ended. Please Contact Your Administrator"
        }
      />
    );
  }

  // TAKING TOKEN AND WARNING FLAG FROM LOCALSTORAGE

  var data = JSON.parse(localStorage.getItem("UserData"));
  // var Warning = JSON.parse(localStorage.getItem("WarningBeforeFreeTrialEnded"));

  if (!isEmpty(data)) {
    var currentDate = new Date();
    var currentTime = currentDate.getTime();
    var tikenExpiresOn = data.tokenExpiresOn;
  }

  // WARNING BEFORE 5 DAYS FREE TRIEL EXPIRATION

  let planExpirationDate = !isEmpty(data) && data.tenantExpiryDate;

  var dateFirst = new Date(dateFns.format(new Date(), "MM/DD/YYYY"));
  var dateSecond = new Date(dateFns.format(planExpirationDate, "MM/DD/YYYY"));
  var timeDiff = dateSecond.getTime() - dateFirst.getTime();

  var diffDays = Math.ceil(Math.abs(timeDiff) / (1000 * 3600 * 24));

  // console.log(planExpirationDate);
  if (isEmpty(OrganizationData)) {
    return <Loader type="Triangle" color="#57cba1" className="remote-loader" />;
  } else {
    return (
      <Route
        {...rest}
        render={
          (props) =>
            // USER SUBSCRIPTION ENDED WHEN PAYMENT FAILED
            auth.isAuthenticated === true &&
            auth.user.subscriptionType === "PAID" &&
            auth.user.status === "EXPIRED" &&
            billingInfo.isOrganisationAtPendingState ? (
              renderSubscriptionFailedDueToPaymentFailed
            ) : //USER FREE TRAIL END CONDITION
            auth.isAuthenticated === true &&
              OrganizationData.planStatus === "TRIAL_OVER" ? (
              renderFreeTrialEndedPopup
            ) : //USER SUBSCRIPTION CANCELED  CONDITION
            auth.isAuthenticated === true &&
              // organisationData.billingId !== "" &&
              OrganizationData.planStatus === "CANCELLED" ? (
              <>
                {window.scrollTo(0, 0)}
                <Redirect to="/profile" />
                <Component {...props} />
              </>
            ) : //USER PAYMENT FAILED CONDITION
            auth.isAuthenticated === true &&
              // organisationData.billingId !== "" &&
              OrganizationData.planStatus === "PAYMENT_FAILED" ? (
              <>
                {window.scrollTo(0, 0)}
                <Redirect to="/profile" />
                <Component {...props} />
              </>
            ) : (
              // : auth.isAuthenticated === true &&
              //   auth.user.subscriptionType === "FREE" &&
              //   auth.user.role.name === "Administrator" &&
              //   Warning.WarningBeforeFreeTrialEnded === true &&
              //   diffDays <= 5 ? (
              //   <>
              //     <WarningBeforePlanExpired
              //       open={diffDays <= 5 && true}
              //       daysRemaining={diffDays}
              //     />
              //     <Component {...props} />
              //   </>
              // )
              // TOKEN VALID OR NOT CONDITION
              // auth.isAuthenticated === true &&
              //   (auth.user.role.name === "Administrator" ||
              //     auth.user.role.name === "Project Manager" ||
              //     auth.user.role.name === "Resource" ||
              //     auth.user.role.name === "Support") &&
              //   currentTime < tikenExpiresOn ? (
              <>
                {window.scrollTo(0, 0)}
                <Component {...props} />
              </>
            )
          // ) : (
          //   <Redirect to="/login" />
          // )
        }
      />
    );
  }
};

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps)(PrivateRoute);
