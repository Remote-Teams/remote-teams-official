import React from "react";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import isEmpty from "../../../store/validations/is-empty";
import AddPaymentCards from "./AddPaymentCards";
import {
  RemoveCardForCustomer,
  setDefaultPaymentCardAction,
} from "./../../../store/actions/paymentAction";
import { useDispatch } from "react-redux";

const SavedCards = () => {
  const dispatch = useDispatch();
  const [savedCards, setsavedCards] = useState([]);
  const [allCustomerObject, setcustomerObject] = useState([]);
  const [defaultPaymentCard, setDefaultPaymentCard] = useState([]);

  const allSavedCards = useSelector((state) => state.payment.savedCards);

  const customerObject = useSelector(
    (state) => state.payment.customerStripeObject
  );

  useEffect(() => {
    if (!isEmpty(customerObject && !isEmpty(allSavedCards))) {
      setsavedCards(allSavedCards);
      setcustomerObject(customerObject);

      if (!isEmpty(customerObject)) {
        let defaultCardDetails =
          !isEmpty(allSavedCards) &&
          allSavedCards.filter(
            (ele) =>
              ele.id === customerObject.invoice_settings.default_payment_method
          );

        let otherSavedCards =
          !isEmpty(allSavedCards) &&
          allSavedCards.filter(
            (ele) =>
              ele.id !== customerObject.invoice_settings.default_payment_method
          );

        setDefaultPaymentCard(defaultCardDetails[0]);
        setsavedCards(otherSavedCards);
      }
    }
  }, [customerObject, allSavedCards]);

  const removeCardHnadler = (paymentId) => (e) => {
    e.preventDefault();

    const formData = {
      paymentMethodId: paymentId,
    };
    dispatch(RemoveCardForCustomer(formData));
  };

  const setDefaultCardHanlder = (paymentId) => (e) => {
    e.preventDefault();
    let OrganizationData = JSON.parse(localStorage.getItem("OrganizationData"));
    const formData = {
      customerId: OrganizationData.customerId,
      paymentMethodId: paymentId,
    };
    dispatch(setDefaultPaymentCardAction(formData));
  };

  // const renderSavedCards = () => {
  //   console.log(savedCards);
  //   if (!isEmpty(savedCards)) {
  //     return savedCards.map((date, index) => {
  //       return (
  //         <div key={index}>
  //           <p>{date.card.last4}</p>
  //           <button onClick={removeCardHnadler(date.id)}>Detach Card</button>
  //         </div>
  //       );
  //     });
  //   } else {
  //     return "no cards found";
  //   }
  // };

  // console.log(defaultPaymentCard);
  // console.log(savedCards);

  return (
    <div className="saved_cards_container">
      {!isEmpty(defaultPaymentCard) && (
        <div className="first-row">
          <div>
            <div className="row mx-0 align-items-center default-card-div">
              {/* <img
                src={require("../../../assets/img/profile/saved-card-title-icon.svg")}
                alt=""
                className="saved-card-title-icon-img"
              /> */}
              <h3 className="font-18-bold saved_cards-default-title">
                Default Card
              </h3>
            </div>
            <div className="default-card-bg">
              <div className="default_card_box">
                <div className="row justify-content-between mx-0 align-items-center">
                  <div>
                    <h4 className="default-card-title">Bank Name</h4>
                    <p className="defult-card-credit-text">
                      {defaultPaymentCard.card.funding}
                    </p>
                  </div>
                  <img
                    src={require("./../../../assets/img/icons/master-card-icon.png")}
                    alt="master card"
                    className="master-card-icon"
                  />
                </div>
                <h5 className="defult-card-credit-no-text">
                  XXXX XXXX XXXX {defaultPaymentCard.card.last4}
                </h5>
                <div className="row mx-0 align-items-start">
                  <p className="defult-card-expire-text defult-card-expire-text1">
                    Valid From 12/1/20
                  </p>
                  <p className="defult-card-expire-text">
                    Expires on{" "}
                    {`${defaultPaymentCard.card.exp_month}/${defaultPaymentCard.card.exp_year}`}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div>
            <div className="row mx-0 align-items-center default-card-div">
              {/* <img
                src={require("../../../assets/img/profile/saved-card-title-icon.svg")}
                alt=""
                className="saved-card-title-icon-img"
              /> */}
              <h3 className="font-18-bold saved_cards-balance-title">
                Available Balance
              </h3>
            </div>
            <div className="available_balence_card">
              <h2 className="available_balence_card-title">
                $ {!isEmpty(allCustomerObject) && allCustomerObject.balance}
              </h2>
              <p className="available_balence_card-para">
                As of last transaction on 29/1/2020
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="second-row">
        <div className="row mx-0 align-items-center profile-card-title-text-div">
          {/* <img
            src={require("../../../assets/img/profile/saved-card-title-icon.svg")}
            alt=""
            className="saved-card-title-icon-img"
          /> */}
          <h3 className="font-18-bold other-saved-cards-title">
            {" "}
            Other Saved Cards{" "}
          </h3>
          <AddPaymentCards />
        </div>
        <table className="table profile-card-table">
          <tbody>
            {!isEmpty(savedCards) &&
              savedCards !== false &&
              savedCards !== undefined &&
              savedCards.map((data, index) => {
                return (
                  <tr key={index}>
                    <td>Bank Name</td>
                    <td>
                      <span className="font-14-rubix">Ending in</span>{" "}
                      {data.card.last4}
                    </td>
                    <td>
                      <img
                        src={require("./../../../assets/img/icons/master-card-icon.png")}
                        alt="master card"
                        className="master-card-icon"
                      />
                    </td>

                    <td>
                      <span className="font-14-rubix">
                        Name of Account Holder
                      </span>
                    </td>
                    <td>
                      <span className="font-14-rubix">
                        Expires on{" "}
                        {`${data.card.exp_month}/${data.card.exp_year}`}
                      </span>
                    </td>

                    <td>
                      <button
                        onClick={setDefaultCardHanlder(data.id)}
                        className="login-next-green-btn login-next-green-btn--profile-saved-cards"
                      >
                        {/*Set as default card*/}
                        Set Default
                      </button>
                    </td>
                    <td>
                      <i
                        onClick={removeCardHnadler(data.id)}
                        className="fa fa-trash"
                        aria-hidden="true"
                      ></i>
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>
      {/* <AddPaymentCards />
      {renderSavedCards()} */}
    </div>
  );
};

export default SavedCards;
