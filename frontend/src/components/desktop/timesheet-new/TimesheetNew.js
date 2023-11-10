import React, { Component } from "react";
import Select from "react-select";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import addDays from "date-fns/add_days";
import subDays from "date-fns/sub_days";
import { eachDay, startOfWeek, endOfWeek } from "date-fns";
import ToggleTimesheet from "../common/ToggleTimesheet";
import GrayButtonSmallFont from "../common/GrayButtonSmallFont";
import TimesheetDayTableNew from "./TimesheetDayTableNew";
import TimesheetWeekTableNew from "./TimesheetWeekTableNew";
import { connect } from "react-redux";
import {
  getDayViewTimeSheet,
  getMonthViewTimeSheet,
} from "./../../../store/actions/timesheetAction";
import { getAllResourceAction } from "./../../../store/actions/resourcesAction";
import getDayOfYear from "date-fns/get_day_of_year";
import isEmpty from "../../../store/validations/is-empty";
import dateFns from "date-fns";
import store from "../../../store/store";
import { SET_SELETCED_FILTERNAME_MEMBER_ID } from "./../../../store/types";
import TimesheetStopwatch from "./TimesheetStopwatch";
import TimesheetCreateNewEntry from "./TimesheetCreateNewEntry";
import { startOfDay, endOfDay } from "date-fns";
import TimesheetExportAsCsv from "./TimesheetExportAsCsv";

// const options = [
//   { value: "Member Name", label: "Member Name" },
//   { value: "John", label: "John" },
//   { value: "Anna", label: "Anna" },
//   { value: "Paul", label: "Paul" },
// ];

class TimesheetNew extends Component {
  constructor() {
    super();
    this.state = {
      isDayActive: true,
      selectedOption: "",
      isDisplayMySheet: true,
      timesheetDate: new Date(),
      startDate: startOfWeek(new Date()),
      endDate: endOfWeek(new Date()),
      options: [],
      // addDays(new Date(), 6),
    };
  }

  componentDidMount() {
    var userData = JSON.parse(localStorage.getItem("UserData"));

    let startDay = startOfDay(new Date()).toISOString();
    let endDay = endOfDay(new Date()).toISOString();
    const formData = {
      query: {
        $and: [
          { date: { $gt: startDay } },
          { date: { $lt: endDay } },
          { user: userData.id },
        ],
      },
    };
    this.props.getDayViewTimeSheet(formData);

    const monthViewData = {
      startDate: this.state.startDate.toISOString(),
      endDate: this.state.endDate.toISOString(),
      member: userData.id,
    };
    this.props.getMonthViewTimeSheet(monthViewData);
    // this.props.getAllResourceAction();
    // store.dispatch({
    //   type: SET_SELETCED_FILTERNAME_MEMBER_ID,
    //   payload: userData.id,
    // });
  }

  static getDerivedStateFromProps(nextProps, nextState) {
    if (
      !isEmpty(nextProps.allResources) &&
      nextProps.allResources !== nextState.allResources
    ) {
      let newArray =
        !isEmpty(nextProps.allResources) &&
        nextProps.allResources.map((user) => ({
          value: user._id,
          label: user.name,
        }));
      return {
        options: newArray,
      };
    }
    if (
      !isEmpty(nextProps.selectedFilterMemberId) &&
      nextProps.selectedFilterMemberId !== nextState.selectedFilterMemberId
    ) {
      return {
        selectedFilterMemberId: nextProps.selectedFilterMemberId,
      };
    }
    return null;
  }

  /*===========================================================================
      handlers
  ===========================================================================*/

  handleOnChangeToggle = (e) => {
    this.setState({
      [e.target.name]: e.target.checked,
    });
  };

  handleChangeDropdown = (selectedOption) => {
    var userData = JSON.parse(localStorage.getItem("UserData"));
    this.setState({ selectedOption });
    console.log(`Option selected:`, selectedOption);
    this.props.getDayViewTimeSheet(
      selectedOption.value,
      getDayOfYear(new Date())
    );
    const monthViewData = {
      startDate: this.state.startDate.toISOString(),
      endDate: this.state.endDate.toISOString(),
      member: userData.id,
    };
    this.props.getMonthViewTimeSheet(monthViewData);
    store.dispatch({
      type: SET_SELETCED_FILTERNAME_MEMBER_ID,
      payload: selectedOption.value,
    });
  };

  handleOnClickDisplayAllOrSingleData = (label) => (e) => {
    if (label === "My Sheet") {
      // console.log("my sheet");
      var userData = JSON.parse(localStorage.getItem("UserData"));
      this.props.getDayViewTimeSheet(userData.id, getDayOfYear(new Date()));
      const monthViewData = {
        startDate: this.state.startDate.toISOString(),
        endDate: this.state.endDate.toISOString(),
        member: userData.id,
      };
      this.props.getMonthViewTimeSheet(monthViewData);
      store.dispatch({
        type: SET_SELETCED_FILTERNAME_MEMBER_ID,
        payload: userData.id,
      });
    } else {
      console.log("all members");
    }
    this.setState({
      isDisplayMySheet: !this.state.isDisplayMySheet,
    });
  };

  handleOnClickMonthTableArrowLeft = () => {
    const { selectedFilterMemberId } = this.state;
    var userData = JSON.parse(localStorage.getItem("UserData"));
    const monthViewData = {
      startDate: subDays(this.state.startDate, 7).toISOString(),
      endDate: subDays(this.state.startDate, 1).toISOString(),
      member: userData.id,
    };
    this.props.getMonthViewTimeSheet(monthViewData);
    this.setState({
      startDate: subDays(this.state.startDate, 7),
      endDate: subDays(this.state.startDate, 1),
    });
  };

  handleOnClickMonthTableArrowRight = () => {
    const { selectedFilterMemberId } = this.state;
    var userData = JSON.parse(localStorage.getItem("UserData"));
    const monthViewData = {
      startDate: addDays(this.state.endDate, 1).toISOString(),
      endDate: addDays(this.state.endDate, 7).toISOString(),
      member: userData.id,
    };
    this.props.getMonthViewTimeSheet(monthViewData);
    this.setState({
      startDate: addDays(this.state.endDate, 1),
      endDate: addDays(this.state.endDate, 7),
    });
  };

  /*===========================================================================
      renderDropdownRow
  ===========================================================================*/
  renderDropdownRow = () => {
    const { isDisplayMySheet } = this.state;
    return (
      <div className="mb-50">
        {!isDisplayMySheet ? (
          // display dropdown
          <Select
            isSearchable={false}
            className="react-select-container react-select-container--addMember"
            classNamePrefix="react-select-elements"
            value={this.state.selectedOption}
            onChange={this.handleChangeDropdown}
            options={this.state.options}
            placeholder="Member Name"
          />
        ) : (
          // hidden dropdown
          <div className="opacity-0">
            <Select
              isSearchable={false}
              className="react-select-container"
              classNamePrefix="react-select-elements"
              value={this.state.selectedOption}
              onChange={this.handleChangeDropdown}
              options={this.state.options}
              placeholder="Select"
            />
          </div>
        )}
      </div>
    );
  };

  /*===========================================================================
      renderDatepickerAndButtonRow
  ===========================================================================*/

  handleOnClickExportAsCsv = () => {
    console.log("export as csv");
  };

  renderDatepickerAndButtonRow = () => {
    const { isDayActive, startDate } = this.state;

    return (
      <div className="timesheet-content-div__btns-block-padding">
        <div className="row mx-0 align-items-center justify-content-between mb-40">
          <div>
            {isDayActive
              ? this.renderDayDatepicker()
              : this.renderMonthDatepicker()}

            {isDayActive ? (
              // display
              <h3 className="timesheet-content-div__dayNameText pb-0">
                {dateFns.format(new Date(), "dddd")}
              </h3>
            ) : (
              <h3 className="timesheet-content-div__dayNameText pb-0">
                {dateFns.format(startDate, "dddd")}
              </h3>
            )}
          </div>

          <TimesheetStopwatch isDayActive={isDayActive} />
        </div>
        <div className="row mx-0 align-items-center justify-content-between mb-40">
          <div className="toggle-timesheet">
            <ToggleTimesheet
              textClassName="timesheet-toggle-text"
              name="isDayActive"
              text1={"DAY"}
              text2={"WEEK"}
              onChange={this.handleOnChangeToggle}
              defaultChecked={isDayActive}
            />
          </div>
          <div className="row mx-0 align-items-center">
            <TimesheetCreateNewEntry />
            {/*            <GrayButtonSmallFont
              extraClassName="timesheet-export-as-csv-btn"
              onClick={this.handleOnClickExportAsCsv}
              text={
                <>
                  <img src="/img/icons/white-export-icon.svg" alt="export" />
                  Export as csv
                </>
              }
            />
            */}
            <TimesheetExportAsCsv />
          </div>
        </div>
      </div>
    );
  };

  /*===========================================================================
      renderDayDatepicker
  ===========================================================================*/
  // handlers
  handleChangeDate = (date) => {
    const { selectedFilterMemberId } = this.state;

    if (date === null) {
      this.setState({
        timesheetDate: new Date(),
      });
    } else {
      this.setState({
        timesheetDate: date,
      });
      let startDay = startOfDay(date).toISOString();
      let endDay = endOfDay(date).toISOString();
      var userData = JSON.parse(localStorage.getItem("UserData"));
      const formData = {
        query: {
          $and: [
            { date: { $gt: startDay } },
            { date: { $lt: endDay } },
            { user: userData.id },
          ],
        },
      };
      this.props.getDayViewTimeSheet(formData);
    }
  };

  // renderDayDatepicker
  renderDayDatepicker = () => {
    return (
      <div className="row mx-0 align-items-center">
        <div className="date-picker-common date-picker-common--timesheet">
          <DatePicker
            minDate={new Date()}
            selected={this.state.timesheetDate}
            onChange={this.handleChangeDate}
            dateFormat="do MMMM, yyyy"
          />
        </div>
        <i className="fa fa-calendar timesheet-caledar-icon"></i>
      </div>
    );
  };

  /*===========================================================================
      renderMonthDatepicker
  ===========================================================================*/
  // handlers
  handleChangeStart = (date) => {
    const { selectedFilterMemberId } = this.state;
    if (date === null) {
      this.setState({
        startDate: new Date(),
      });
    } else {
      var userData = JSON.parse(localStorage.getItem("UserData"));
      const monthViewData = {
        startDate: startOfWeek(date).toISOString(),
        endDate: endOfWeek(date).toISOString(),
        member: userData.id,
      };
      this.props.getMonthViewTimeSheet(monthViewData);
      this.setState({
        startDate: startOfWeek(date),
        endDate: endOfWeek(date),
      });
    }
  };

  handleChangeEnd = (date) => {
    if (date === null) {
      this.setState({
        endDate: new Date(),
      });
    } else {
      this.setState({
        endDate: date,
      });
    }
  };

  // renderMonthDatepicker
  renderMonthDatepicker = () => {
    return (
      <div className="row mx-0 flex-nowrap align-items-center date-picker-common-timesheet-week-view-row">
        <div className="date-picker-common date-picker-common--timesheet">
          <DatePicker
            selected={this.state.startDate}
            selectsStart
            startDate={this.state.startDate}
            endDate={this.state.endDate}
            onChange={this.handleChangeStart}
            dateFormat="do MMMM, yyyy"
          />
        </div>
        <h3 className="font-18-bold-space-light-uppercase mr-60">to</h3>
        <div className="date-picker-common date-picker-common--timesheet cursor-default-datepicker">
          <DatePicker
            selected={this.state.endDate}
            selectsEnd
            startDate={this.state.startDate}
            endDate={this.state.endDate}
            onChange={this.handleChangeEnd}
            minDate={this.state.startDate}
            maxDate={addDays(this.state.startDate, 6)}
            dateFormat="do MMMM, yyyy"
            disabled
          />
        </div>
        {/*<i className="fa fa-calendar timesheet-caledar-icon"></i>*/}
      </div>
    );
  };
  /*===========================================================================
      main
  ===========================================================================*/
  render() {
    const { isDayActive } = this.state;
    return (
      <>
        {/* content */}
        <div className="timesheet-content-div">
          {/* <div className="row mx-0 align-items-center justify-content-between timesheet-content-div__btns-block-padding">
            {this.renderDropdownRow()}

            <div className="mb-50">
              {!this.state.isDisplayMySheet ? (
                <GrayButtonSmallFont
                  text="My Sheet"
                  onClick={this.handleOnClickDisplayAllOrSingleData("My Sheet")}
                  extraClassName="leave-history-all-member-btn"
                />
              ) : (
                <GrayButtonSmallFont
                  text="All Members"
                  onClick={this.handleOnClickDisplayAllOrSingleData(
                    "All Members"
                  )}
                  extraClassName="leave-history-all-member-btn"
                />
              )}
            </div>
          </div> */}

          {/* datepicker and button */}
          {this.renderDatepickerAndButtonRow()}

          {/* display table */}
          {isDayActive ? (
            <TimesheetDayTableNew />
          ) : (
            <TimesheetWeekTableNew
              dateArray={eachDay(this.state.startDate, this.state.endDate)}
              handleOnClickMonthTableArrowLeft={
                this.handleOnClickMonthTableArrowLeft
              }
              handleOnClickMonthTableArrowRight={
                this.handleOnClickMonthTableArrowRight
              }
            />
          )}
        </div>
      </>
    );
  }
}

const mapStateToProps = (state) => ({
  allResources: state.resources.allResources,
  selectedFilterMemberId: state.timesheet.selectedFilterMemberId,
  activeWalkthroughPage: state.auth.activeWalkthroughPage,
});

export default connect(mapStateToProps, {
  getDayViewTimeSheet,
  getMonthViewTimeSheet,
  getAllResourceAction,
})(TimesheetNew);
