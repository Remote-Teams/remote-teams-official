import React from "react";
import { Link } from "react-router-dom";

function GreenLinkSmallFontState({
  path,
  stateData,
  text,
  extraClassName,
  extraClassNameLink,
}) {
  return (
    <Link
      className={`${extraClassNameLink}`}
      to={{ pathname: path, state: stateData }}
    >
      <span
        className={`login-next-green-btn login-next-green-btn--fontSize ${extraClassName}`}
      >
        {text}
      </span>
    </Link>
  );
}

GreenLinkSmallFontState.defaultProps = {
  extraClassName: "",
  extraClassNameLink: "",
};

export default GreenLinkSmallFontState;
