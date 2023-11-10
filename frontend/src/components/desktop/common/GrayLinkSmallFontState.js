import React from "react";
import { Link } from "react-router-dom";

function GrayLinkSmallFontState({
  path,
  stateData,
  text,
  extraClassName,
  extraClassNameLink,
}) {
  return (
    <Link
      to={{ pathname: path, state: stateData }}
      className={`mr-25 ${extraClassNameLink}`}
    >
      <span className={`login-dashboard-btn ${extraClassName}`}>{text}</span>
    </Link>
  );
}

GrayLinkSmallFontState.defaultProps = {
  extraClassName: "",
  extraClassNameLink: "",
};

export default GrayLinkSmallFontState;
