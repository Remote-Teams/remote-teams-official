import React, { Component } from "react";
// import Select from "react-select";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import PageTitle from "../common/PageTitle";
import InputFieldNumber from "../common/InputFieldNumber";
import InputFieldEmailTextPassword from "../common/InputFieldEmailTextPassword";
import GrayLinkSmallFont from "../common/GrayLinkSmallFont";
import GreenButtonSmallFont from "../common/GreenButtonSmallFont";
import { connect } from "react-redux";
import { createSubscription } from "./../../../store/actions/financeAction";
import { withRouter } from "react-router-dom";
import { validateAddSubscription } from "./../../../store/validations/financeValidation/addSubscriptionValidation";
import isEmpty from "../../../store/validations/is-empty";

// const options = [
//   { value: "Monthly", label: "Monthly" },
//   { value: "Yearly", label: "Yearly" },
// ];

class FinanceAddSubscription extends Component {
  constructor() {
    super();
    this.state = {
      name: "",
      cost: "",
      purpose: "",
      // billingType: options[0],
      billingTypeFixed: "Monthly",
      subscribedDate: new Date(),
      errors: {},
    };
  }

  /*=================================================================
      handlers
  =================================================================*/
  handleChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
      errors: {},
    });
  };

  handleChangeNumber = (e) => {
    this.setState({
      [e.target.name]: e.target.validity.valid ? e.target.value : "",
      errors: {},
    });
  };

  // handleChangeSelectClient = (selectedOption) => {
  //   this.setState({ billingType: selectedOption });
  //   console.log(`Option selected:`, selectedOption);
  // };

  handleChangeDate = (date) => {
    if (date === null) {
      this.setState({
        subscribedDate: new Date(),
      });
    } else {
      this.setState({
        subscribedDate: date,
      });
    }
  };

  handleOnClickAddSubcription = () => {
    console.log(this.state);
    const { billingTypeFixed } = this.state;

    const { errors, isValid } = validateAddSubscription(this.state);

    if (!isValid) {
      this.setState({
        errors: errors,
      });
    } else {
      const formData = {
        name: this.state.name,
        price: parseInt(this.state.cost),
        purpose: this.state.purpose,
        billingType:
          billingTypeFixed.value === "Monthly" ? "MONTHLY" : "YEARLY",
        status: "ACTIVE",
        startingDate: this.state.subscribedDate.toISOString(),
      };

      // console.log(formData);
      this.props.createSubscription(formData, this.props.history);
    }
  };

  /*=================================================================
      main
  =================================================================*/
  render() {
    const { errors } = this.state;
    return (
      <>
        <div className="login-member-day-offs">
          <div className="row mx-0 justify-content-between">
            {/* page title */}
            <PageTitle title="Add subscription" />
            <div className="mt-30">
              <GrayLinkSmallFont path="/finances" text="Back" />
            </div>
          </div>
          <div className="login-member-day-offs__content mt-50">
            <div className="row mx-0">
              <div className="col-4">
                <InputFieldEmailTextPassword
                  containerClassName="container-login-flow-input container-login-flow-input--forms"
                  //label="Name"
                  name="name"
                  value={this.state.name}
                  onChange={this.handleChange}
                  type="text"
                  placeholder="Name of Subscription"
                  error={!isEmpty(errors.name) && errors.name}
                />
              </div>
              <div className="col-4">
                <InputFieldNumber
                  containerClassName="container-login-flow-input container-login-flow-input--forms"
                  //label="price"
                  name="cost"
                  value={this.state.cost}
                  onChange={this.handleChangeNumber}
                  placeholder="Price"
                  error={!isEmpty(errors.cost) && errors.cost}
                />
              </div>
              <div className="col-4"></div>
              <div className="col-4">
                <InputFieldEmailTextPassword
                  containerClassName="container-login-flow-input container-login-flow-input--forms"
                  //label="Purpose"
                  name="purpose"
                  value={this.state.purpose}
                  onChange={this.handleChange}
                  placeholder="Purpose"
                  type="text"
                  error={!isEmpty(errors.purpose) && errors.purpose}
                />
              </div>
              <div className="col-4">
                {/* <h3 className="font-18-bold-space-light-uppercase mb-20">
                  Billing Type
                </h3>
                <Select
                  className="react-select-container react-select-container--addMember mb-40"
                  classNamePrefix="react-select-elements"
                  value={this.state.billingType}
                  onChange={this.handleChangeSelectClient}
                  options={options}
                  placeholder="Select"
                  isSearchable={false}
                /> */}
                <div className="disabled-input-field">
                  <InputFieldEmailTextPassword
                    containerClassName="container-login-flow-input container-login-flow-input--forms"
                    //label="billing Type"
                    name="billingTypeFixed"
                    value={this.state.billingTypeFixed}
                    onChange={this.handleChange}
                    type="text"
                    placeholder="Purpose"
                  />
                </div>
              </div>
              <div className="col-4"></div>
              <div className="col-4">
                {/*<div className="container-login-flow-input container-login-flow-input--forms mb-0 pt-10">
                  <label>starting date</label>
              </div>*/}
                <div className="date-picker-common">
                  <DatePicker
                    minDate={new Date()}
                    selected={this.state.subscribedDate}
                    onChange={this.handleChangeDate}
                    placeholderText="starting date"
                  />
                  <div className="datepeacker-date-icon-div">
                    <img
                      src={require("../../../assets/img/icons/new-date-icon.svg")}
                      alt="date"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="row mx-0">
            <div className="col-4">
              <GreenButtonSmallFont
                //text="Add"
                text="Save &amp; Add"
                onClick={this.handleOnClickAddSubcription}
              />
            </div>
          </div>
        </div>
      </>
    );
  }
}

export default connect(null, { createSubscription })(
  withRouter(FinanceAddSubscription)
);
