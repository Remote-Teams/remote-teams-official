import React from "react";
import { Link } from "react-router-dom";

function GreenLinkSmallFont({ path, text, extraClassName }) {
  return (
    <Link to={path}>
      <span
        className={`login-next-green-btn login-next-green-btn--fontSize ${extraClassName}`}
      >
        {text}
      </span>
    </Link>
  );
}

GreenLinkSmallFont.defaultProps = {
  extraClassName: "",
};

export default GreenLinkSmallFont;
