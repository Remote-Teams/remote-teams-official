import React from "react";
import { Link } from "react-router-dom";

export default function AddNewFormLink({
  path,
  stateData,
  text,
  extraClassName,
}) {
  return (
    <div className={`row mx-0 align-items-center ${extraClassName}`}>
      <Link
        to={{
          pathname: path,
          state: stateData,
        }}
      >
        <div className="products-survey-add-new-image-block common-box-shadow-product-survey">
          <img
            src={require("../../../assets/img/icons/products-add-new-plus-circle-icon.svg")}
            alt=""
          />
        </div>
      </Link>
      <span className="products-create-new-survey-text">{text}</span>
    </div>
  );
}

AddNewFormLink.defaultProps = {
  extraClassName: "",
};
