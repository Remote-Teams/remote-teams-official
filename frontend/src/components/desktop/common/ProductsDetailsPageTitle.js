import React from "react";
import { useHistory } from "react-router";

export default function ProductsDetailsPageTitle({ title, extraClassName }) {
  const history = useHistory();
  return (
    <div className={`products-details-page-title-block ${extraClassName}`}>
      <button
        className="product-details-page-go-back"
        onClick={() => history.goBack()}
      >
        <i className="fa fa-arrow-left"></i>
      </button>
      <span className="products-details-page-title products-overview-color-title-text">
        {title}
      </span>
    </div>
  );
}

ProductsDetailsPageTitle.defaultProps = {
  extraClassName: "",
};
