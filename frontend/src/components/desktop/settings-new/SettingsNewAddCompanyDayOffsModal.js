import React, { Component } from "react";
import Modal from "react-responsive-modal";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import InputFieldEmailTextPassword from "../common/InputFieldEmailTextPassword";
import GreenButtonSmallFont from "../common/GreenButtonSmallFont";
import { connect } from "react-redux";
import { addCompanyDaysOff } from "./../../../store/actions/authAction";
import { format } from "date-fns";
import GrayButtonSmallFont from "../common/GrayButtonSmallFont";

export class SettingsNewAddCompanyDayOffsModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
      // login form
      companyDaysOff: this.props.companyDaysOff,
      companyDayOffName: "Maharashtra day",
      companyDayOffDate: new Date(),
    };
  }

  /*=================================================================
      lifecycle methods
  =================================================================*/
  componentDidMount() {
    window.scrollTo(0, 0);
  }

  componentDidUpdate() {
    if (this.props.companyDaysOff !== this.state.companyDaysOff) {
      this.setState({
        companyDaysOff: this.props.companyDaysOff,
      });
    }
  }

  /*=========================================================================
        handlers
  ===========================================================================*/
  onOpenModal = () => {
    this.setState({ open: true });
  };

  onCloseModal = () => {
    this.setState({ open: false });
  };

  handleChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  };

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

  callBackAdd = (status) => {
    if (status === 200) {
      this.setState({
        open: false,
      });
    }
  };

  handleAddOnClick = (e) => {
    e.preventDefault();
    const { companyDayOffDate, companyDayOffName } = this.state;
    console.log(this.state.companyDayOffDate.toISOString());
    //get userdata from localstorage
    const userData = JSON.parse(localStorage.getItem("UserData"));

    const formData = {
      leaves: [
        {
          leaveType: "HOLIDAY",
          fromDate: `${format(companyDayOffDate, "YYYY-MM-DD")}T00:00:00.000Z`,
          toDate: `${format(companyDayOffDate, "YYYY-MM-DD")}T00:00:00.000Z`,
          location: "",
          reason: companyDayOffName,
          user: userData.id,
        },
      ],
    };

    this.props.addCompanyDaysOff(formData, this.callBackAdd);
  };

  /*=========================================================================
        renderForm
  ===========================================================================*/
  renderForm = () => {
    return (
      <form noValidate autoComplete="off">
        <h3 className="font-18-bold common-peach-color-text mb-30">
          Enter Details
        </h3>
        <InputFieldEmailTextPassword
          containerClassName="container-login-flow-input container-login-flow-input--forms"
          //label="Day off name"
          name="companyDayOffName"
          value={this.state.companyDayOffName}
          onChange={this.handleChange}
          type="text"
          placeholder="Day-off name"
        />
        <div className="date-picker-common datepicker-nav-arrow-login-dash">
          {/*<h3 className="font-18-bold-space-light-uppercase mb-20">
              Day off date
    </h3>*/}
          <DatePicker
            minDate={new Date()}
            selected={this.state.companyDayOffDate}
            onChange={this.handleChangeDate}
            placeholderText="Day-off date"
          />
          <div className="datepeacker-date-icon-div">
            <img
              src={require("../../../assets/img/icons/new-date-icon.svg")}
              alt="date"
            />
          </div>
        </div>
        <div className="text-center">
          <GreenButtonSmallFont text="Save" onClick={this.handleAddOnClick} />
        </div>
      </form>
    );
  };

  /*=========================================================================
        main
  ===========================================================================*/
  render() {
    console.log(this.state.companyDaysOff);
    const { open } = this.state;
    return (
      <>
        <GrayButtonSmallFont
          onClick={this.onOpenModal}
          text="+"
          extraClassName="all-project-overview-add-member-btn-new"
        />
        <Modal
          open={open}
          onClose={this.onCloseModal}
          closeOnEsc={false}
          closeOnOverlayClick={false}
          center
          classNames={{
            overlay: "customOverlay",
            modal: "customModal customModal--settingsAddCompanyDayOffs",
            closeButton: "customCloseButton",
          }}
        >
          {/* close modal */}
          <span className="closeIconInModal" onClick={this.onCloseModal} />
          <div className="settings-new-add-company-day-offs-modal-content">
            <div className="add-meeting-title-div mb-50 pt-0">
              <h2 className="add-meeting-title  text-center">
                Add Company Day offs
              </h2>
            </div>
            {this.renderForm()}
          </div>
        </Modal>
      </>
    );
  }
}

export default connect(null, { addCompanyDaysOff })(
  SettingsNewAddCompanyDayOffsModal
);
