import React from "react";

import { connect } from "react-redux";
import { Route, Redirect } from "react-router-dom";
import Loader from "react-loader-spinner";
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";

const PaymentPrivateRoute = ({ component: Component, auth, ...rest }) => {
  let OrganizationData = JSON.parse(localStorage.getItem("OrganizationData"));
  return (
    <Route
      {...rest}
      render={(props) =>
        auth.isAuthenticated === true &&
        OrganizationData.planStatus === "TRIAL_OVER" ? (
          // auth.user.role.name === "Support"
          <Component {...props} />
        ) : (
          <Redirect to="/login" />
        )
      }
    />
  );
};

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps)(PaymentPrivateRoute);
