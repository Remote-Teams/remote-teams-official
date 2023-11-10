import React from "react";
import { useEffect, useState } from "react";
import {
  CardElement,
  Elements,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import Modal from "react-responsive-modal";
import { useDispatch } from "react-redux";
import { AddNewCardForCustomer } from "./../../../store/actions/paymentAction";
// import add from "./../../../assets/img/icons/box-plus.svg";
import { stripeApiKey } from "./../../../store/actions/config";
import GreenButtonSmallFont from "./../common/GreenButtonSmallFont";

const stripePromise = loadStripe(stripeApiKey);

const AddCards = () => {
  const stripe = useStripe();
  const elements = useElements();
  const dispatch = useDispatch();

  const [subscribing, setSubscribing] = useState(false);
  const [errorToDisplay, setErrorToDisplay] = useState("");
  const [saveCardsPopup, setsaveCardsPopup] = useState(false);

  const handleSubmit = async (e) => {
    let OrganizationData = JSON.parse(localStorage.getItem("OrganizationData"));
    e.preventDefault();
    setSubscribing(true);

    if (!stripe || !elements) {
      // Stripe.js has not loaded yet. Make sure to disable
      // form submission until Stripe.js has loaded.
      return;
    }

    // Get a reference to a mounted CardElement. Elements knows how
    // to find your CardElement because there can only ever be one of
    // each type of element.
    const cardElement = elements.getElement(CardElement);

    // console.log(cardElement);

    // If a previous payment was attempted, get the lastest invoice
    // const latestInvoicePaymentIntentStatus = localStorage.getItem(
    //   "latestInvoicePaymentIntentStatus"
    // );

    // Use your card Element with other Stripe.js APIs
    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: "card",
      card: cardElement,
    });

    if (error) {
      console.log("[createPaymentMethod error]", error);
      setSubscribing(false);
      setErrorToDisplay(error && error.message);
      return;
    }
    // console.log("[PaymentMethod]", paymentMethod);

    const paymentMethodId = paymentMethod.id;

    const formData = {
      customerId: OrganizationData.customerId,
      paymentMethodId: paymentMethodId,
    };
    dispatch(AddNewCardForCustomer(formData, callBackAddCard));
  };

  const callBackAddCard = (status) => {
    if (status === 200) {
      setSubscribing(false);
      setsaveCardsPopup(false);
    }
  };

  const onCloseHandler = () => {
    setsaveCardsPopup(false);
    setErrorToDisplay("");
  };

  const openHandlder = () => {
    setsaveCardsPopup(true);
  };

  return (
    <>
      <Modal
        open={saveCardsPopup}
        onClose={() => console.log("unable to close")}
        // closeOnEsc={true}
        closeOnOverlayClick={false}
        center
        classNames={{
          overlay: "customOverlay",
          modal: "customModal customModal-warning customModal--saveCards",
          closeButton: "customCloseButton",
        }}
      >
        <span className="closeIconInModal" onClick={onCloseHandler} />
        <div id="payment-form" className=" flex justify-center">
          {/*card-detail-popup */}
          {/**className="w-full p-4 rounded-md" */}
          <div>
            {/*<div className="font-bold text-xl mb-2">*/}
            {/*<h3>Enter your card details.</h3> <br />*/}
            <h3 className="add-meeting-title add-meeting-title--payment-from-title">
              Add Card Details
            </h3>
            {/* <p>Your subscription will start now.</p> */}
            {/*</div>*/}
            {/* <p className="text-gray-700 text-base">
            <h4>
              → Total due now{" "}
              <span>{productSelected.metadata.monthlyPrice}</span>
            </h4>
          </p>
          <p className="text-gray-700 text-base mb-4">
            <h4>
              → Subscribing to{" "}
              <span className="font-bold">{productSelected.name}</span>
            </h4>
          </p> */}

            <div className="w-full">
              <div className="flex flex-wrap -mx-3 mb-2">
                <div className="w-full  md:mb-0">
                  {/**uppercase tracking-wide text-gray-700 text-xs font-bold mb-2 */}
                  <label className="block payment-form-total-text">
                    Full name
                  </label>
                  <div className="container-login-flow-input container-login-flow-input--forms container-login-flow-input--payemt-from">
                    <div className="input-border-div">
                      {" "}
                      <input
                        //className="appearance-none block w-full bg-gray-200 rounded-md py-3 px-2 mb-3 leading-tight focus:outline-none focus:bg-white"
                        id="name"
                        type="text"
                        placeholder="First and last name"
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>
              <form id="payment-form" onSubmit={handleSubmit}>
                <div className="flex flex-wrap -mx-3 mb-3">
                  <div className="w-full mb-0 pt-25">
                    {/** block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2 */}
                    <label className="payment-form-total-text">
                      Card Details
                    </label>
                    <div
                      className="block w-full payment-form-card"
                      id="card-element"
                    >
                      {/* appearance-none block w-full bg-gray-200 text-gray-700 border rounded-md py-3 px-2 leading-tight focus:outline-none focus:bg-white */}
                      <CardElement
                        options={{
                          style: {
                            base: {
                              //fontSize: "16px",
                              //color: "#32325d",
                              color: "#A8A8A8",
                              fontSize: "0.87em",
                              fontFamily:
                                //"-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif",
                                "Nunito-SemiBold, sans-serif, Helvetica",
                              "::placeholder": {
                                //color: "#a0aec0",
                                color: "#A8A8A8",
                                fontSize: "0.87em",
                              },
                            },
                            invalid: {
                              color: "#9e2146",
                            },
                          },
                        }}
                      />
                    </div>
                    <div
                      className="is-invalid text-gray-700 text-base mt-2"
                      role="alert"
                    >
                      {errorToDisplay ? errorToDisplay : null}
                    </div>
                  </div>
                </div>
                <div className="text-center mt-50">
                  <button
                    id="submit-premium"
                    //className="subscribe-button w-full bg-pasha hover:bg-white hover:shadow-outline hover:text-pasha hover:border hover:border-black focus:shadow-outline text-white focus:bg-white focus:text-pasha font-light py-2 px-4 rounded-md"
                    className="login-next-green-btn"
                    type="submit"
                  >
                    <div>{subscribing ? "Adding..." : "Add card"}</div>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </Modal>
      {/*<button onClick={openHandlder} className="add-payment-card-btn">
        {/*&#43;
        {/* <img src={add} alt="add profile card" /> 
       
      </button>*/}
      <GreenButtonSmallFont
        text={"Add Card"}
        onClick={openHandlder}
        extraClassName="add-payment-card-btn"
      />
    </>
  );
};

const AddPaymentCards = (props) => (
  <Elements stripe={stripePromise}>
    <AddCards {...props} />
  </Elements>
);

export default AddPaymentCards;
