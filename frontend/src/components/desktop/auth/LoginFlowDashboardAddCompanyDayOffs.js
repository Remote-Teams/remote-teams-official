import React, { Component } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import InputFieldEmailTextPassword from "../common/InputFieldEmailTextPassword";
import PageTitle from "../common/PageTitle";
import GreenButtonSmallFont from "../common/GreenButtonSmallFont";
import { connect } from "react-redux";
import { addCompanyDaysOff } from "./../../../store/actions/authAction";
import isEmpty from "../../../store/validations/is-empty";
import dateFns from "date-fns";
import { format } from "date-fns";

export class LoginFlowDashboardAddCompanyDayOffs extends Component {
  constructor(props) {
    super(props);
    this.state = {
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

    this.props.addCompanyDaysOff(formData);
  };

  /*=========================================================================
        renderForm
  ===========================================================================*/
  renderForm = () => {
    return (
      <div className="login-company-day-off__display-form">
        <form noValidate autoComplete="off">
          <h5 className="font-18-semiBold">Enter Day Off Details</h5>
          <InputFieldEmailTextPassword
            containerClassName="container-login-flow-input container-login-flow-input--forms"
            //label="Day off name"
            name="companyDayOffName"
            placeholder="Day Off Name"
            value={this.state.companyDayOffName}
            onChange={this.handleChange}
            type="text"
            placeholder=""
          />
          <div className="date-picker-common datepicker-nav-arrow-login-dash">
            {/*<h3 className="font-18-bold-space-light-uppercase mb-20">
              Day off date
    </h3>*/}
            <DatePicker
              minDate={new Date()}
              selected={this.state.companyDayOffDate}
              onChange={this.handleChangeDate}
              placeholderText="Day Off Date"
            />
            <div className="datepeacker-date-icon-div">
              <img
                src={require("../../../assets/img/icons/new-date-icon.svg")}
                alt="date"
              />
            </div>
          </div>
          <GreenButtonSmallFont text="Add" onClick={this.handleAddOnClick} />
        </form>
      </div>
    );
  };

  /*=========================================================================
        renderData
  ===========================================================================*/
  renderData = () => {
    const { companyDaysOff } = this.state;
    return (
      <div className="login-company-day-off__display-data">
        {/* font-29-bold */}
        <h2 className="day-off-added-text">Day offs added</h2>

        <div className="login-company-day-off__table">
          <div className="login-company-day-off__thead">
            {/*<h2 className="font-18-bold">Day off name</h2>
            <h2 className="font-18-bold">day off date</h2>*/}
            <h2 className="font-18-bold">name</h2>
            <h2 className="font-18-bold">date</h2>
          </div>
          <div className="login-company-day-off__tbody">
            {!isEmpty(companyDaysOff) &&
              companyDaysOff.map((day, index) => (
                <div className="login-company-day-off__tr" key={index}>
                  <p className="font-24-semiBold">{day.reason}</p>
                  <p className="font-24-semiBold">
                    {dateFns.format(day.toDate, "D-MMM-YYYY")}
                  </p>
                </div>
              ))}
          </div>
        </div>
      </div>
    );
  };

  /*=========================================================================
        main
  ===========================================================================*/
  render() {
    console.log(this.state.companyDaysOff);
    return (
      <>
        <div className="login-company-day-off__titile-div">
          <PageTitle title="company day offs" />
        </div>
        <div className="login-company-day-off__content-div">
          {this.renderForm()}
          {this.renderData()}
        </div>
      </>
    );
  }
}

export default connect(null, { addCompanyDaysOff })(
  LoginFlowDashboardAddCompanyDayOffs
);
