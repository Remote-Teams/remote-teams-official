import React from "react";
import Modal from "react-responsive-modal";
import { useState } from "react";
import ReactFlagsSelect from "react-flags-select";
import GreenButtonSmallFont from "../common/GreenButtonSmallFont";
import InputFieldEmailTextPassword from "../common/InputFieldEmailTextPassword";

const AddPaymentAddress = ({
  addPaymentAddresspopup,
  onCloseModal,
  saveAddressHandler,
}) => {
  const [values, setValues] = useState({
    companyAddress: "",
    state: "",
    city: "",
    pincode: "",
  });

  const [selectedCountry, setSelected] = useState("US");

  const [showDetailForm, setshowDetailForm] = useState(false);

  const onchangeHandler = (e) => {
    e.preventDefault();
    setValues({
      ...values,
      [e.target.name]: e.target.value,
    });
  };

  const addDetailsHanlder = () => {
    setshowDetailForm(true);
  };

  const renderAddressForm = () => {
    return (
      <div className="add_address_form-div">
        {/*<div className="justify-content-space-between">*/}
        <div className="add_address_form">
          <h3>Add Address Details</h3>
          <div className="add_address_form_input">
            <form noValidate>
              <div className="row justify-content-center mx-0">
                {/* company address */}
                <div className="col-12 p-0 form-group">
                  {/*<label htmlFor="companyAddress">Company Address</label>
                  <input
                    type="text"
                    name="companyAddress"
                    onChange={onchangeHandler}
                    value={values.companyAddress}
    />*/}
                  <InputFieldEmailTextPassword
                    containerClassName="container-login-flow-input container-login-flow-input--forms add_address_form_input-company-address"
                    type={"text"}
                    name={"companyAddress"}
                    onChange={onchangeHandler}
                    value={values.companyAddress}
                    placeholder={"Company Address"}
                  />
                </div>
              </div>

              <div className="row mx-0 justify-content-center">
                {/* state */}
                <div className="col-6 col-md-6 form-group p-0">
                  {/*<label htmlFor="state">State</label>
                  <input
                    type="text"
                    name="state"
                    onChange={onchangeHandler}
                    value={values.state}
  />*/}
                  <InputFieldEmailTextPassword
                    containerClassName="container-login-flow-input container-login-flow-input--forms add_address_form_input-state"
                    type="text"
                    name="state"
                    onChange={onchangeHandler}
                    value={values.state}
                    placeholder={"State"}
                  />
                </div>

                {/* city */}
                <div className="col-6 col-md-6 p-0 form-group">
                  {/*<label htmlFor="city">City</label>
                  <input
                    type="text"
                    name="city"
                    onChange={onchangeHandler}
                    value={values.city}
/>*/}
                  <InputFieldEmailTextPassword
                    containerClassName="container-login-flow-input container-login-flow-input--forms add_address_form_input-state"
                    type="text"
                    name="city"
                    onChange={onchangeHandler}
                    value={values.city}
                    placeholder={"City"}
                  />
                </div>
              </div>

              <div className="row mx-0">
                {/* pincode */}
                <div className="col-6 col-md-6 p-0 form-group container-login-flow-input container-login-flow-input--forms add_address_form_input-state">
                  {/*<label htmlFor="pincode">Pincode</label>*/}
                  <div className="input-border-div">
                    <input
                      type="text"
                      pattern="[0-9]*"
                      name="pincode"
                      onChange={onchangeHandler}
                      value={values.pincode}
                      maxLength={6}
                      placeholder={"Pincode"}
                    />
                  </div>
                </div>

                {/* country */}
                <div className="col-6 col-md-6 p-0 form-group container-workspace-name container-workspace-name--add-payment-address mt-0">
                  {/*<label htmlFor="country">Country</label>*/}
                  <ReactFlagsSelect
                    selected={selectedCountry}
                    onSelect={(code) => setSelected(code)}
                    placeholder="Country"
                  />
                  {/* <label htmlFor="country">Country</label>
                <input
                  type="text"
                  name="country"
                  onChange={onchangeHandler}
                  value={values.country}
                /> */}
                </div>
              </div>
              <div className="row mx-0 justify-content-center pt-60">
                <button
                  className="login-next-green-btn-save_address login-next-green-btn"
                  onClick={saveAddressHandler(values, selectedCountry)}
                  type="submit"
                >
                  Save &amp; Pay now
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  };

  const renderWarningMessage = () => {
    return (
      <div className="warning_before_plan_expired_container warning_before_plan_expired_container--add-payment-address text-center">
        <div>
          {/* <img
            className="payment-illustration-images"
            src={require("./../../../assets/img/payment/add-address.svg")}
            alt=""
          /> */}
          <img
            className="add-payment-address-illustration-images"
            src={require("./../../../assets/img/illustrations/profile-add-address.svg")}
            alt=""
          />
          <h3 className="font-24-extraBold add-payment-address-details-title">
            hello!
          </h3>
          <p className="font-18-semiBold">
            Before proceeding with payment kindly fill your <br /> address
            details!!
          </p>

          <div className={"text-center"}>
            {/*<button onClick={addDetailsHanlder} className="add_address_button">
              Add Details
        </button>*/}
            <GreenButtonSmallFont
              text={"Add Details"}
              onClick={addDetailsHanlder}
              extraClassName="mt-50"
            />
          </div>
        </div>
      </div>
    );
  };

  return (
    <div>
      <Modal
        open={addPaymentAddresspopup}
        onClose={onCloseModal}
        closeOnEsc={true}
        closeOnOverlayClick={false}
        center
        classNames={{
          overlay: "customOverlay customOverlay--warning_before_five_days",
          modal: "customModal customModal--add-payment-address",
          /** customeModel_warning_befor_subscription_cancel customeModel_warning_befor_subscription_cancel--add-payment warning_before_subscription_cancel */
          closeButton: "customCloseButton",
        }}
      >
        <span className="closeIconInModal" onClick={onCloseModal} />

        {/* logo */}
        {showDetailForm === false
          ? renderWarningMessage()
          : renderAddressForm()}
      </Modal>
    </div>
  );
};

export default AddPaymentAddress;
