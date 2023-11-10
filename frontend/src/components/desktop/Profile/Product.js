import React from "react";
import getSymbolFromCurrency from "currency-symbol-map";
// import "./App.css";
import isEmpty from "../../../store/validations/is-empty";
import { Fragment } from "react";

const freeData = [
  { text: "10 users" },
  { text: "Project" },
  { text: "Members" },
  { text: "Client" },
  { text: "Calender" },
];

const arkData = [
  { text: "200 Users" },
  { text: "Presentation" },
  { text: "Finance" },
  { text: "Schedules" },
  { text: "Timesheet" },
];

const metaverseData = [
  { text: "200 Users" },
  { text: "Workboard" },
  { text: "Presentation" },
  { text: "Finance" },
  { text: "Workflow" },
];

const Product = ({
  product,
  currentProductSelected,
  handleClick,
  index,
  activePlan,
}) => {
  let OrganizationData = JSON.parse(localStorage.getItem("OrganizationData"));

  let frePlanDescription =
    "Use our forever free plan with your team that gives you access to essential features to get your projects off the ground.";
  let arkPlanDescription =
    "Features that help you track projects better, get granular control over the tasks and time management for the team.";
  let metaversePlanDescription =
    "Advanced features for highly efficient project management Follow the best practices of the giants and minimize probability of failure.";
  return (
    <>
      <div
        key={index}
        className={
          (product.priceId === OrganizationData.priceId &&
            OrganizationData.planStatus === "PAID") ||
          (OrganizationData.planStatus === "FREE_PLAN" &&
            product.name === "FREE_PLAN")
            ? "active-plan leads-red-gradient-block subscription-box col-md-4"
            : "leads-red-gradient-block subscription-box col-md-4"
        }
      >
        <div className="plan-content text-left">
          <p className="plan-name">
            {product.name === "FREE_PLAN" ? "Free Plan" : product.name}
          </p>
          <p className="plan-price row mx-0 align-items-center">
            {" "}
            <span className="plan-price-span-text">
              {!isEmpty(OrganizationData) && OrganizationData.currency === "inr"
                ? "Rs."
                : !isEmpty(OrganizationData) &&
                  getSymbolFromCurrency(
                    OrganizationData.currency.toUpperCase()
                  )}{" "}
              {product.amount}
            </span>
            /Mo
          </p>
          <p className="plan-description">
            {product.name === "FREE_PLAN"
              ? frePlanDescription
              : product.name === "The Ark"
              ? arkPlanDescription
              : metaversePlanDescription}
          </p>
          {/* <p className="plan-name">{product.name}</p> */}
          {/* </div>
                          <div> */}
          {/* <p className="plan-users">2 users</p> */}
        </div>

        <div className="plan-list-div">
          {product.name === "The Ark" ? (
            <>
              <h3 className="plan-list-title">All of Free plus:</h3>
              {arkData.map((data, index) => (
                <Fragment key={index}>
                  <h4 className="plan-list-text">
                    <img
                      src={require("../../../assets/img/icons/check-icon.svg")}
                      alt="check"
                      className="plans-check-icon"
                    />
                    {data.text}
                  </h4>
                </Fragment>
              ))}{" "}
            </>
          ) : product.name === "FREE_PLAN" ? (
            <>
              <h3 className="plan-list-title">In Free plan you will get</h3>
              {freeData.map((data, index) => (
                <Fragment key={index}>
                  <h4 className="plan-list-text">
                    <img
                      src={require("../../../assets/img/icons/check-icon.svg")}
                      alt="check"
                      className="plans-check-icon"
                    />
                    {data.text}
                  </h4>
                </Fragment>
              ))}{" "}
            </>
          ) : product.name === "The Metaverse" ? (
            <>
              <h3 className="plan-list-title">All of Basic plus:</h3>
              {metaverseData.map((data, index) => (
                <Fragment key={index}>
                  <h4 className="plan-list-text">
                    <img
                      src={require("../../../assets/img/icons/check-icon.svg")}
                      alt="check"
                      className="plans-check-icon"
                    />
                    {data.text}
                  </h4>
                </Fragment>
              ))}{" "}
            </>
          ) : (
            ""
          )}
        </div>
        {OrganizationData.planStatus === "FREE_PLAN" &&
        product.name === "FREE_PLAN" ? (
          <div className="subscription-box-btn-section">
            <button className="subscription-box-current-plan-btn">
              <span className="subscription-box-current-plan-btn-text">
                Current Plan
              </span>
            </button>
          </div>
        ) : product.priceId === OrganizationData.priceId &&
          OrganizationData.planStatus === "PAID" ? (
          <div className="subscription-box-btn-section">
            <button className="subscription-box-current-plan-btn">
              <span className="subscription-box-current-plan-btn-text">
                Current Plan
              </span>
            </button>
          </div>
        ) : OrganizationData.planStatus === "PAID" &&
          product.name === "FREE_PLAN" ? (
          <div className="subscription-box-btn-section subscription-box-btn-section--downgrade">
            <button
              onClick={handleClick(product)}
              className="login-next-green-btn login-next-green-btn--subscription-box-downgrade"
            >
              Downgrade
            </button>
          </div>
        ) : (
          <div className="subscription-box-btn-section subscription-box-btn-section--upgrade">
            <button
              onClick={handleClick(product)}
              className="login-next-green-btn login-next-green-btn--subscription-box"
            >
              Upgrade
            </button>
          </div>
        )}
        {product.name === "FREE_PLAN" ? (
          <div className="plans-img-div">
            <img
              src={require("../../../assets/img/plans/plans-astronaut.svg")}
              alt="free"
              className="plans-free-img"
            />
          </div>
        ) : product.name === "The Ark" ? (
          <div className="plans-img-div plans-img-div--ark">
            <img
              src={require("../../../assets/img/plans/ark.svg")}
              alt="free"
              className="plans-ark-img"
            />
          </div>
        ) : product.name === "The Metaverse" ? (
          <div className="plans-img-div plans-img-div--metaverse">
            <img
              src={require("../../../assets/img/plans/metaverse.svg")}
              alt="free"
              className="plans-metaverse-img"
            />
          </div>
        ) : (
          ""
        )}
      </div>
    </>
  );
};

export default Product;
