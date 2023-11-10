import React, { Component } from "react";
import Modal from "react-responsive-modal";
// import Select from "react-select";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import InputFieldNumber from "../common/InputFieldNumber";
import InputFieldEmailTextPassword from "../common/InputFieldEmailTextPassword";
import GreenButtonSmallFont from "../common/GreenButtonSmallFont";
import isEmpty from "../../../store/validations/is-empty";
import { editSubscription } from "./../../../store/actions/financeAction";
import { connect } from "react-redux";

const options = [
  { value: "Monthly", label: "Monthly" },
  { value: "Yearly", label: "Yearly" },
];

class FinanceEditSubscription extends Component {
  constructor(props) {
    super(props);
    this.state = {
      subscriptionId: "",
      isEditModalOpen: false,
      name: "",
      cost: "",
      purpose: "",
      // billingType: options[0],
      billingTypeFixed: "Monthly",
      subscribedDate: new Date(),
    };
  }

  /*======================================================
                    Lifecycle Method
  ========================================================*/
  componentDidMount() {
    console.log(this.props.subscriptionData);
    const { subscriptionData } = this.props;
    if (!isEmpty(subscriptionData)) {
      this.setState({
        name: subscriptionData.name,
        cost: subscriptionData.price,
        purpose: subscriptionData.purpose,
        subscribedDate: new Date(subscriptionData.startingDate),
        billingType:
          subscriptionData.billingType === "MONTHLY" ? options[0] : options[1],
        subscriptionData: subscriptionData,
      });
    }
  }

  /*=================================================================
          handlers
=================================================================*/

  //   modal handlers
  onOpenModal = () => {
    this.setState({
      isEditModalOpen: true,
    });
  };

  onCloseModal = () => {
    this.setState({
      isEditModalOpen: false,
    });
  };
  //   modal handlers end

  handleChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  };

  handleChangeNumber = (e) => {
    this.setState({
      [e.target.name]: e.target.validity.valid ? e.target.value : "",
    });
  };

  // handleChangeSelectClient = (selectedOption) => {
  //   this.setState({ billingType: selectedOption });
  //   console.log(`Option selected:`, selectedOption);
  // };

  handleChangeDate = (date) => {
    if (date === null) {
      this.setState({
        companyDayOffDate: new Date(),
      });
    } else {
      this.setState({
        companyDayOffDate: date,
      });
    }
  };

  callBackEdit = (status) => {
    // console.log(status);
    if (status === 200) {
      this.setState({
        isEditModalOpen: false,
      });
    }
  };

  handleOnClickAddSubcription = () => {
    // console.log(this.state);
    const { subscriptionData } = this.state;

    let editedData = subscriptionData;
    editedData.name = this.state.name;
    editedData.price = this.state.cost;
    editedData.purpose = this.state.purpose;
    editedData.startingDate = this.state.subscribedDate.toISOString();
    editedData.billingType =
      this.state.billingTypeFixed.value === "Monthly" ? "MONTHLY" : "YEARLY";
    // console.log(editedData);
    this.props.editSubscription(
      subscriptionData._id,
      editedData,
      this.callBackEdit
    );
  };

  /*===========================================================================
      main
  ===========================================================================*/
  render() {
    return (
      <>
        <i
          className="fa fa-pencil finances-table__fa-icon-edit"
          onClick={this.onOpenModal}
        ></i>
        <Modal
          open={this.state.isEditModalOpen}
          onClose={this.onCloseModal}
          closeOnEsc={false}
          closeOnOverlayClick={false}
          center
          classNames={{
            overlay: "customOverlay",
            modal: "customModal customModal--clientEditModal overflow-visible",
            closeButton: "customCloseButton",
          }}
        >
          {/* close modal */}
          <span className="closeIconInModal" onClick={this.onCloseModal} />
          {/* content */}
          {/** font-32-extraBold-letterspace change to font-32-extraBold-letterspace*/}
          <div className="edit-client-modal-content">
            <h2 className=" font-24-extraBold-montserrat-letter-spacing edit-subscription-title mt-30 mb-50 pb-10 text-center">
              manage subscription
            </h2>
            <div className="row mx-0 pl-30">
              <div className="col-6">
                <InputFieldEmailTextPassword
                  containerClassName="container-login-flow-input container-login-flow-input--forms"
                  //label="Name"
                  placeholder="Name of Subscription"
                  name="name"
                  value={this.state.name}
                  onChange={this.handleChange}
                  type="text"
                />
              </div>
              <div className="col-6">
                <InputFieldNumber
                  containerClassName="container-login-flow-input container-login-flow-input--forms"
                  //label="price"
                  placeholder="Price"
                  name="cost"
                  value={this.state.cost}
                  onChange={this.handleChangeNumber}
                />
              </div>
              <div className="col-6">
                <InputFieldEmailTextPassword
                  containerClassName="container-login-flow-input container-login-flow-input--forms"
                  //label="Purpose"
                  placeholder="Purpose"
                  name="purpose"
                  value={this.state.purpose}
                  onChange={this.handleChange}
                  type="text"
                />
              </div>
              <div className="col-6">
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
                    placeholder="Billing Type"
                    //label="billing Type"
                    name="billingTypeFixed"
                    value={this.state.billingTypeFixed}
                    onChange={this.handleChange}
                    type="text"
                  />
                </div>
              </div>
              <div className="col-6">
                <div className="container-login-flow-input container-login-flow-input--forms mb-0 pt-20">
                  {/*<label>starting date</label>*/}
                </div>
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

            <div className="text-center">
              <GreenButtonSmallFont
                text="Save"
                onClick={this.handleOnClickAddSubcription}
              />
            </div>
          </div>
        </Modal>
      </>
    );
  }
}

export default connect(null, { editSubscription })(FinanceEditSubscription);
