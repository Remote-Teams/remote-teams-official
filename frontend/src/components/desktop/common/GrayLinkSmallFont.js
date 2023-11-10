import React from "react";
import { Link } from "react-router-dom";

function GrayLinkSmallFont({ path, text, extraClassName, extraClassNameLink }) {
  return (
    <Link to={path} className={`mr-25 ${extraClassNameLink}`}>
      <span className={`login-dashboard-btn ${extraClassName}`}>{text}</span>
    </Link>
  );
}

GrayLinkSmallFont.defaultProps = {
  extraClassName: "",
  extraClassNameLink: "",
};

export default GrayLinkSmallFont;
