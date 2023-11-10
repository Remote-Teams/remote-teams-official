import React from "react";
import Modal from "react-responsive-modal";
import isEmpty from "../../../store/validations/is-empty";
import getSymbolFromCurrency from "currency-symbol-map";
import GreenButtonSmallFont from "../common/GreenButtonSmallFont";
import GrayButtonSmallFont from "../common/GrayButtonSmallFont";

const PrePaymentPopup = ({
  prePaymentPopup,
  productSelected,
  onCloseHandler,
  continueHandler,
}) => {
  let OrganizationData = JSON.parse(localStorage.getItem("OrganizationData"));
  // NEW PAYMENT FLOW
  // organizationData.currency = "inr";

  if (!isEmpty(productSelected)) {
    return (
      <div>
        <Modal
          open={prePaymentPopup}
          onClose={() => console.log("unable to close")}
          closeOnEsc={true}
          closeOnOverlayClick={false}
          center
          classNames={{
            overlay: "customOverlay",
            modal:
              "warning-employee-model customModal-warning customModal--addLead",
            closeButton: "customCloseButton",
          }}
        >
          <span className="closeIconInModal" onClick={onCloseHandler} />
          <div className="employee-warning-popup-container">
            {OrganizationData.planStatus === "CANCELLED" ||
            OrganizationData.planStatus === "TRIAL" ||
            OrganizationData.planStatus === "TRIAL_OVER" ? (
              <h3>Proceed To Payment</h3>
            ) : (
              <h3>Proceed To Upgrade</h3>
            )}
          </div>
          <div className="warning-downgarade-section">
            <div className="current-plan-section">
              <h3>Your Selected Plan</h3>
              <div className="detail-section">
                <div className="detail-section-img-div">
                  <img
                    src={
                      productSelected.name === "ROVER"
                        ? require("./../../../assets/img/plans/plans-rover.svg")
                        : productSelected.name === "ASTRONAUT"
                        ? require("./../../../assets/img/plans/plans-astronaut.svg")
                        : productSelected.name === "SPACESHIP"
                        ? require("./../../../assets/img/plans/plans-spaceship.svg")
                        : productSelected.name === "SPACESTATION"
                        ? require("./../../../assets/img/plans/plans-space-colony.svg")
                        : require("./../../../assets/img/plans/plans-rover.svg")
                    }
                    alt={""}
                  />
                </div>
                <div>
                  <h4>{productSelected.name}</h4>
                  <p>
                    {" "}
                    {productSelected.name === "ASTRONAUT"
                      ? `${!isEmpty(productSelected) &&
                          productSelected.metadata.maxUsers} User`
                      : productSelected.name === "ROVER"
                      ? `2-${!isEmpty(productSelected) &&
                          productSelected.metadata.maxUsers} Users`
                      : productSelected.name === "SPACESHIP"
                      ? `6-${!isEmpty(productSelected) &&
                          productSelected.metadata.maxUsers} Users`
                      : productSelected.name === "SPACESTATION"
                      ? `11-${!isEmpty(productSelected) &&
                          productSelected.metadata.maxUsers} Users`
                      : ""}
                  </p>
                  <h5>
                    {!isEmpty(productSelected) && (
                      <>
                        {" "}
                        {OrganizationData.currency === "inr"
                          ? "Rs."
                          : getSymbolFromCurrency(
                              OrganizationData.currency.toUpperCase()
                            )}
                        {productSelected.priceData.unit_amount / 100}
                        /Mo
                      </>
                    )}
                  </h5>
                </div>
              </div>
            </div>

            <div className="btn-section">
              {/*<button onClick={onCloseHandler} className="cancel-btn">
                Cancel
              </button>
              <button onClick={continueHandler} className="continue-btn">
                Continue
                          </button>*/}
              <GrayButtonSmallFont
                onClick={onCloseHandler}
                text="Cancel"
                extraClassName="payment-cancel-btn"
              />
              <GreenButtonSmallFont
                onClick={continueHandler}
                text={"Continue"}
              />
            </div>
          </div>
        </Modal>
      </div>
    );
  } else {
    return null;
  }
};

export default PrePaymentPopup;
