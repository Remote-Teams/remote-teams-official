import React, { Component } from "react";
import Checkbox from "rc-checkbox";
import "rc-checkbox/assets/index.css";
import TimezonePicker from "react-timezone";
import GreenButtonSmallFont from "../common/GreenButtonSmallFont";
import { connect } from "react-redux";
import {
  addCompanyWorkingHours,
  updateCompanyWorkingHours,
} from "./../../../store/actions/authAction";
import isEmpty from "../../../store/validations/is-empty";
import DatePickerFromToTime from "../common/DatePickerFromToTime";

export class SettingsCompanyWorkingHours extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isEditButtonClicked: false,
      fromTime: new Date(),
      toTime: new Date(),
      workingDaysCheckboxMonFri: true,
      workingDaysCheckboxSat: false,
      workingDaysCheckboxSun: false,
      timezone: "",
      companyWorkingHours: this.props.companyWorkingHours,
      setNewData: false,
    };
  }

  /*===================================
          Lifecycle Methods
  =====================================*/
  componentDidMount() {
    window.scrollTo(0, 0);
    const { companyWorkingHours } = this.props;
    if (!isEmpty(companyWorkingHours)) {
      let workingDays = companyWorkingHours[0].workingDays;
      let mondayToFriday = ["Mon", "Tue", "Wed", "Thrus", "Fri"];
      let mondayToSat = ["Mon", "Tue", "Wed", "Thrus", "Fri", "Sat"];
      let allDay = ["Sun", "Mon", "Tue", "Wed", "Thrus", "Fri", "Sat"];
      let mondaToSun = ["Mon", "Tue", "Wed", "Thrus", "Fri", "Sun"];
      let satAndSun = ["Sat", "Sun"];
      let sat = ["Sat"];
      let sun = ["Sun"];

      if (JSON.stringify(workingDays) === JSON.stringify(mondayToFriday)) {
        this.setState({
          workingDaysCheckboxMonFri: true,
        });
      } else if (JSON.stringify(workingDays) === JSON.stringify(mondayToSat)) {
        this.setState({
          workingDaysCheckboxMonFri: true,
          workingDaysCheckboxSat: true,
          workingDaysCheckboxSun: false,
        });
      } else if (JSON.stringify(workingDays) === JSON.stringify(allDay)) {
        this.setState({
          workingDaysCheckboxMonFri: true,
          workingDaysCheckboxSat: true,
          workingDaysCheckboxSun: true,
        });
      } else if (JSON.stringify(workingDays) === JSON.stringify(mondaToSun)) {
        this.setState({
          workingDaysCheckboxMonFri: true,
          workingDaysCheckboxSat: false,
          workingDaysCheckboxSun: true,
        });
      } else if (JSON.stringify(workingDays) === JSON.stringify(satAndSun)) {
        this.setState({
          workingDaysCheckboxMonFri: false,
          workingDaysCheckboxSat: true,
          workingDaysCheckboxSun: true,
        });
      } else if (JSON.stringify(workingDays) === JSON.stringify(sat)) {
        this.setState({
          workingDaysCheckboxMonFri: false,
          workingDaysCheckboxSat: true,
          workingDaysCheckboxSun: false,
        });
      } else if (JSON.stringify(workingDays) === JSON.stringify(sun)) {
        this.setState({
          workingDaysCheckboxMonFri: false,
          workingDaysCheckboxSat: false,
          workingDaysCheckboxSun: true,
        });
      }

      console.log(workingDays);

      this.setState({
        fromTime: new Date(companyWorkingHours[0].fromTime),
        toTime: new Date(companyWorkingHours[0].toTime),
      });
    }
  }

  componentDidUpdate() {
    const { companyWorkingHours } = this.props;
    if (
      companyWorkingHours !== this.state.companyWorkingHours &&
      !this.state.setNewData
    ) {
      this.setState({
        companyDaysOff: companyWorkingHours,
        setNewData: true,
        fromTime: new Date(companyWorkingHours[0].fromTime),
        toTime: new Date(companyWorkingHours[0].toTime),
      });
    }
  }

  /*==================================================================
      handlers
  ==================================================================*/

  handleCheckboxChange = (e) => {
    this.setState({
      [e.target.id]: e.target.checked,
    });
  };

  handleOnClickSave = () => {
    console.log(this.state);
    this.setState({ isEditButtonClicked: false });
    const { companyWorkingHours } = this.state;
    const {
      workingDaysCheckboxMonFri,
      workingDaysCheckboxSat,
      workingDaysCheckboxSun,
      fromTime,
      toTime,
    } = this.state;
    let workingDays = [];
    if (
      workingDaysCheckboxMonFri &&
      !workingDaysCheckboxSat &&
      !workingDaysCheckboxSun
    ) {
      workingDays = ["Mon", "Tue", "Wed", "Thrus", "Fri"];
    } else if (
      workingDaysCheckboxMonFri &&
      workingDaysCheckboxSat &&
      !workingDaysCheckboxSun
    ) {
      workingDays = ["Mon", "Tue", "Wed", "Thrus", "Fri", "Sat"];
    } else if (
      workingDaysCheckboxMonFri &&
      !workingDaysCheckboxSat &&
      workingDaysCheckboxSun
    ) {
      workingDays = ["Mon", "Tue", "Wed", "Thrus", "Fri", "Sun"];
    } else if (
      workingDaysCheckboxMonFri &&
      workingDaysCheckboxSun &&
      workingDaysCheckboxSat
    ) {
      workingDays = ["Sun", "Mon", "Tue", "Wed", "Thrus", "Fri", "Sat"];
    } else if (
      !workingDaysCheckboxMonFri &&
      workingDaysCheckboxSun &&
      workingDaysCheckboxSat
    ) {
      workingDays = ["Sat", "Sun"];
    } else if (
      !workingDaysCheckboxMonFri &&
      !workingDaysCheckboxSun &&
      workingDaysCheckboxSat
    ) {
      workingDays = ["Sat"];
    } else if (
      !workingDaysCheckboxMonFri &&
      workingDaysCheckboxSun &&
      !workingDaysCheckboxSat
    ) {
      workingDays = ["Sun"];
    }

    if (!isEmpty(companyWorkingHours)) {
      console.log(companyWorkingHours);
      let workingHoursData = companyWorkingHours[0];
      workingHoursData.fromTime = fromTime.toISOString();
      workingHoursData.toTime = toTime.toISOString();
      workingHoursData.timezone = "Kathmandu (GMT+5:45)";
      workingHoursData.workingDays = workingDays;
      this.props.updateCompanyWorkingHours(
        workingHoursData._id,
        workingHoursData
      );
    } else {
      const formData = {
        profile: "Profile One",
        fromTime: fromTime.toISOString(),
        toTime: toTime.toISOString(),
        workingDays: workingDays,
        location: "Pune",
        timezone: "Kathmandu (GMT+5:45)",
        status: "ACTIVE",
      };
      this.props.addCompanyWorkingHours(formData, "Company working hours set");
    }
  };

  /*==================================================================
      renderTimeRow
  ==================================================================*/
  // handlers

  handleChangeFromTime = (time) => {
    console.log(time);
    if (time === null) {
      this.setState({
        fromTime: new Date(),
      });
    } else {
      this.setState({
        fromTime: time,
      });
    }
  };
  handleChangeToTime = (time) => {
    if (time === null) {
      this.setState({
        toTime: new Date(),
      });
    } else {
      this.setState({
        toTime: time,
      });
    }
  };

  // renderTimeRow
  renderTimeRow = () => {
    return (
      <div className="set-hours-time-row mb-0">
        <h5 className="rt-settings-new-member-day-offs-cilm-title-text1">
          Select Time Range
        </h5>
        <DatePickerFromToTime
          fromTimeValue={this.state.fromTime}
          toTimeValue={this.state.toTime}
          handleChangeFromTime={this.handleChangeFromTime}
          handleChangeToTime={this.handleChangeToTime}
        />
      </div>
    );
  };

  /*==================================================================
      renderWorkingDays
  ==================================================================*/
  renderWorkingDays = () => {
    return (
      <div className="mb-30">
        <h3 className="rt-settings-new-member-day-offs-cilm-title-text1">
          Working Days
        </h3>

        {/* 1 */}
        <div className="customCheckbox customCheckbox--cmd-checkbox mb-10">
          <Checkbox
            id="workingDaysCheckboxMonFri"
            onChange={this.handleCheckboxChange}
            value={this.state.workingDaysCheckboxMonFri}
            checked={this.state.workingDaysCheckboxMonFri}
            defaultChecked={true}
          />
          <label htmlFor="workingDaysCheckboxMonFri">
            {/*<span className="font-24-semiBold ml-30">Mon-Fri</span>*/}
            <span className="font-14-semibold ml-30">Monday - Friday</span>
          </label>
        </div>
        {/* 2 */}
        <div className="customCheckbox customCheckbox--cmd-checkbox mb-10">
          <Checkbox
            id="workingDaysCheckboxSat"
            onChange={this.handleCheckboxChange}
            value={this.state.workingDaysCheckboxSat}
            checked={this.state.workingDaysCheckboxSat}
            defaultChecked={false}
          />
          <label htmlFor="workingDaysCheckboxSat">
            {/*<span className="font-24-semiBold ml-30">Sat</span>*/}
            <span className="font-14-semibold ml-30">Saturday</span>
          </label>
        </div>
        {/* 3 */}
        <div className="customCheckbox customCheckbox--cmd-checkbox mb-10">
          <Checkbox
            id="workingDaysCheckboxSun"
            onChange={this.handleCheckboxChange}
            value={this.state.workingDaysCheckboxSun}
            checked={this.state.workingDaysCheckboxSun}
            defaultChecked={false}
          />
          <label htmlFor="workingDaysCheckboxSun">
            {/*<span className="font-24-semiBold ml-30">Sun</span>*/}
            <span className="font-14-semibold ml-30">Sunday</span>
          </label>
        </div>
      </div>
    );
  };

  /*==================================================================
      renderTimezone
  ==================================================================*/
  handleChangeTimeZone = (timezone) => {
    console.log(timezone);
    this.setState({ timezone });
  };
  renderTimezone = () => {
    return (
      <div className="mb-50">
        {/*<h3 className="font-18-bold-space-light-uppercase mb-20">timezone</h3>*/}
        <h3 className="rt-settings-new-member-day-offs-cilm-title-text1">
          Add Timezone
        </h3>
        <div className="timezone-custom">
          <TimezonePicker
            value="Asia/Yerevan"
            onChange={(timezone) =>
              console.log("New Timezone Selected:", timezone)
            }
            inputProps={{
              placeholder: "Select Timezone...",
              name: "timezone",
            }}
          />
        </div>
      </div>
    );
  };

  /*==================================================================
      main
  ==================================================================*/
  render() {
    console.log(this.state.companyWorkingHours);
    return (
      <>
        <div className="row mx-0 flex-nowrap align-items-start justify-content-between mb-30">
          <h2 className="add-new-member-title mr-20">Company Working Hours</h2>
          {!this.state.isEditButtonClicked ? (
            <button
              className="rt-workflows-add-new-task-edit-task-btn rt-workflows-add-new-task-edit-task-btn--subtask mr-0"
              onClick={() => this.setState({ isEditButtonClicked: true })}
            >
              <img
                src="/img/desktop/workflows-new/add-new-task-pencil-icon.svg"
                alt=""
              />
              edit
            </button>
          ) : (
            <button
              className="rt-workflows-add-new-task-edit-task-btn rt-workflows-add-new-task-edit-task-btn--subtask mr-0"
              onClick={() => this.setState({ isEditButtonClicked: false })}
            >
              <i className="fa fa-times"></i>
              cancel
            </button>
          )}
        </div>

        {this.state.isEditButtonClicked ? (
          <div className="rt-settings-new-company-working-hours">
            <form noValidate autoComplete="off">
              {/* content */}
              <div className="login-member-day-offs__content login-member-day-offs__content--set-working-hour pb-0">
                {/* time row */}
                {this.renderTimeRow()}
                {/* working days */}
                {this.renderWorkingDays()}
                {/* timezone */}
                {this.renderTimezone()}

                <div className="text-right">
                  <GreenButtonSmallFont
                    text="Save"
                    onClick={this.handleOnClickSave}
                  />
                </div>
              </div>
            </form>
          </div>
        ) : (
          <div>
            <h3 className="rt-settings-new-company-working-hours-text-1">
              timings
            </h3>
            <p className="mb-20">
              <span className="rt-settings-new-company-working-hours-text-2 mr-30">
                09:00 AM
              </span>
              <span className="rt-settings-new-company-working-hours-text-3 mr-30">
                to
              </span>
              <span className="rt-settings-new-company-working-hours-text-2">
                18:00 PM
              </span>
            </p>
            <h3 className="rt-settings-new-company-working-hours-text-1">
              Working days
            </h3>
            <p className="font-18-semiBold mb-20">Mon-Fri</p>
            <h3 className="rt-settings-new-company-working-hours-text-1">
              timezone &amp; Location
            </h3>
            <p className="font-18-semiBold mb-20">India, GMT +5:30</p>
          </div>
        )}
      </>
    );
  }
}

export default connect(null, {
  addCompanyWorkingHours,
  updateCompanyWorkingHours,
})(SettingsCompanyWorkingHours);
