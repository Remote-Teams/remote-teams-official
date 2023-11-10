import React, { Component } from "react";
import Select from "react-select";
import "rc-dropdown/assets/index.css";

import DropdownIcon from "rc-dropdown";
import "rc-dropdown/assets/index.css";
import Menu, { Item as MenuItem, Divider } from "rc-menu";

import { format } from "date-fns";
import dateFns from "date-fns";
import { connect } from "react-redux";
import getYear from "date-fns/get_year";
import getMonth from "date-fns/get_month";
import getDate from "date-fns/get_date";
import { startOfWeek, endOfWeek } from "date-fns";
import {
  updateWorklogByid,
  createWorkLog,
  deleteWorklogById,
} from "./../../../store/actions/timesheetAction";
// import addDays from "date-fns/add_days";

import isEmpty from "../../../store/validations/is-empty";
import TimesheetEditEntry from "./TimesheetEditEntry";

const dummyData = [
  {
    _id: "b",
    data: [
      {
        date: "2020-08-17T18:30:00.000Z",
        plannedHours: 2,
        scheduleId: "be446940-ddf2-11ea-a331-31643354cfca",
        groupId: "b",
        actualHours: 2,
      },
      {
        date: "2020-08-18T18:30:00.000Z",
        plannedHours: 4,
        scheduleId: "bf281280-ddf2-11ea-a331-31643354cfca",
        groupId: "b",
        actualHours: 4,
      },
      {
        date: "2020-08-19T18:30:00.000Z",
        plannedHours: 6,
        scheduleId: "bf82b5a0-ddf2-11ea-a331-31643354cfca",
        groupId: "b",
        actualHours: 6,
      },
      {
        date: "2020-08-20T18:30:00.000Z",
        plannedHours: 8,
        scheduleId: "365a5b10-de07-11ea-ba08-afe5fcd0580c",
        groupId: "b",
        actualHours: 8,
      },
    ],
  },
  {
    _id: "a",
    data: [
      {
        date: "2020-08-17T18:30:00.000Z",
        plannedHours: 3,
        scheduleId: "82212470-db78-11ea-ac8e-db88954cd329",
        groupId: "a",
        actualHours: 3,
      },
      {
        date: "2020-08-18T18:30:00.000Z",
        plannedHours: 5,
        scheduleId: "246ec140-db7b-11ea-ac8e-db88954cd329",
        groupId: "a",
        actualHours: 5,
      },
      {
        date: "2020-08-19T18:30:00.000Z",
        plannedHours: 7,
        scheduleId: "31bd9f40-db87-11ea-ac8e-db88954cd329",
        groupId: "a",
        actualHours: 7,
      },
    ],
  },
];

const dummyNewData = {
  data: [
    {
      name: "task one",
      user: "12726160-ea19-11eb-93d5-a7c91b237689",
      fromTime: "2021-07-21T04:30:00.769Z",
      toTime: "2021-07-21T07:30:00.769Z",
      hours: 3,
      scheduledata: [],
      taskdata: {},
      projectdata: [],
    },
    {
      name: "task one",
      user: "12726160-ea19-11eb-93d5-a7c91b237689",
      fromTime: "2021-07-21T04:30:00.769Z",
      toTime: "2021-07-21T07:30:00.769Z",
      hours: 1,
      scheduledata: [],
      taskdata: {},
      projectdata: [],
    },
    {
      name: "task one",
      user: "12726160-ea19-11eb-93d5-a7c91b237689",
      fromTime: "2021-07-22T06:30:00.869Z",
      toTime: "2021-07-22T07:30:00.869Z",
      hours: 1,
      scheduledata: [],
      taskdata: {},
      projectdata: [],
    },
  ],
};

const options = [
  { value: "Edit Entry", label: "Edit Entry" },
  { value: "Delete Entry", label: "Delete Entry" },
];

export class TimesheetWeekTableNew extends Component {
  constructor() {
    super();
    this.state = {
      actualHours: "",
      isEditActualHours: false,
      editFieldDate: "",
      editRowId: "",
    };
  }

  static getDerivedStateFromProps(nextProps, nextState) {
    if (
      !isEmpty(nextProps.monthViewTimesheetData) &&
      nextProps.monthViewTimesheetData !== nextState.monthViewTimesheetData
    ) {
      return {
        monthViewTimesheetData: nextProps.monthViewTimesheetData,
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

  componentDidUpdate() {
    if (
      this.props.monthViewTimesheetData !== this.state.monthViewTimesheetData
    ) {
      this.setState({
        monthViewTimesheetData: this.props.monthViewTimesheetData,
      });
    }
  }

  /*====================================================================================
      renderCardEditDropdown
  ====================================================================================*/

  onSelect = (action, cardData) => {
    var userData = JSON.parse(localStorage.getItem("UserData"));
    if (action === "edit") {
      // console.log("edit", cardData);
    } else {
      console.log("delete", cardData);
      this.props.deleteWorklogById(
        cardData._id,
        startOfWeek(new Date()).toISOString(),
        endOfWeek(new Date()).toISOString(),
        userData.id
      );
    }
  };

  renderCardEditDropdown = (cardData) => {
    const menu = (
      <Menu className="timesheet-table-week-view__card-icon-dropdown-menu">
        <MenuItem
          className="timesheet-table-week-view__card-icon-dropdown-menu-btn"
          onClick={() => this.onSelect("edit", cardData)}
        >
          <TimesheetEditEntry
            buttonText="Edit Entry"
            buttonClassName="timesheet-table-week-view__card-edit-btn"
            cardData={cardData}
          />
        </MenuItem>
        <Divider />
        <MenuItem onClick={() => this.onSelect("delete", cardData)}>
          Delete Entry
        </MenuItem>
      </Menu>
    );

    return (
      <DropdownIcon
        className="timesheet-table-week-view__card-icon-dropdown"
        trigger={["click"]}
        overlay={menu}
        animation="none"
        onVisibleChange={() => {}}
      >
        <i className="fa fa-ellipsis-h timesheet-table-week-view__card-title" />
      </DropdownIcon>
    );
  };

  /*============================================================
      renderProjectTaskCard
  ============================================================*/

  //   handleChangeDropdownProjectTask = (selectedOption) => {
  //     if (selectedOption.value === options[1].value) {
  //       console.log("delete entry");
  //     }
  //   };

  renderProjectTaskCard = (data) => {
    return (
      <>
        {/* project task */}
        {!isEmpty(data) &&
          data.map((data, index) =>
            data.category === "PROJECT" ? (
              <div key={index} className="timesheet-table-week-view__card">
                <div className="timesheet-table-week-view__card-title-row row mx-0 align-items-center justify-content-between">
                  <h3 className="timesheet-table-week-view__card-title">
                    {/* project task */}
                    {data.name}
                  </h3>

                  {this.renderCardEditDropdown(data)}

                  {/* <Select
                  isSearchable={false}
                  className="react-select-container react-select-container--icon"
                  classNamePrefix="react-select-elements"
                  value={{ label: iconLabel, value: "" }}
                  onChange={this.handleChangeDropdownProjectTask}
                  options={options}
                /> */}
                </div>
                <div className="timesheet-table-week-view__card-content">
                  <p className="timesheet-table-week-view__text1">Hours </p>
                  <p className="font-24-extraBold common-peach-color-text-timesheet">
                    {/* 05:00:00 */}
                    {data.hours}
                  </p>
                  <p className="timesheet-table-week-view__text1">
                    Project Name
                  </p>
                  <p className="font-18-semiBold timesheet-table-week-view__text2">
                    {!isEmpty(data.projectdata)
                      ? data.projectdata[0].name
                      : "NA"}
                  </p>
                  <p className="timesheet-table-week-view__text1">Task Name</p>
                  <p className="font-18-semiBold timesheet-table-week-view__text2">
                    {data.taskdata !== undefined
                      ? data.taskdata.name
                      : data.name}
                  </p>
                  <p className="timesheet-table-week-view__text1">Timings </p>
                  <p className="font-18-semiBold timesheet-table-week-view__text2">
                    {format(data.fromTime, "hh:mm a")} -{" "}
                    {format(data.toTime, "hh:mm a")}
                  </p>
                </div>
              </div>
            ) : (
              <div
                key={index}
                className="timesheet-table-week-view__card timesheet-table-week-view__card--general"
              >
                <div className="timesheet-table-week-view__card-title-row row mx-0 align-items-center justify-content-between">
                  <h3 className="timesheet-table-week-view__card-title">
                    {data.name}
                  </h3>

                  {this.renderCardEditDropdown(data)}

                  {/* <Select
              isSearchable={false}
              className="react-select-container react-select-container--icon"
              classNamePrefix="react-select-elements"
              value={{ label: iconLabel, value: "" }}
              onChange={this.handleChangeDropdownGeneralTask}
              options={options}
            /> */}
                </div>
                <div className="timesheet-table-week-view__card-content">
                  <p className="timesheet-table-week-view__text1">Hours </p>
                  <p className="font-24-extraBold common-peach-color-text-timesheet">
                    {data.hours}
                  </p>
                  <p className="timesheet-table-week-view__text1">
                    Booking Name
                  </p>
                  <p className="font-18-semiBold timesheet-table-week-view__text2">
                    {data.name}
                  </p>
                  <p className="timesheet-table-week-view__text1">Timings </p>
                  <p className="font-18-semiBold timesheet-table-week-view__text2">
                    {format(data.fromTime, "hh:mm a")} -{" "}
                    {format(data.toTime, "hh:mm a")}
                  </p>
                </div>
              </div>
            )
          )}
      </>
    );
  };

  /*============================================================
      renderGeneralTaskCard
  ============================================================*/
  //   handleChangeDropdownGeneralTask = (selectedOption) => {
  //     if (selectedOption.value === options[1].value) {
  //       console.log("delete entry");
  //     }
  //   };

  renderGeneralTaskCard = (data) => {
    // const iconLabel = <i className="fa fa-ellipsis-h"></i>;

    return (
      <>
        {/* general task */}
        <div className="timesheet-table-week-view__card timesheet-table-week-view__card--general">
          <div className="timesheet-table-week-view__card-title-row row mx-0 align-items-center justify-content-between">
            <h3 className="timesheet-table-week-view__card-title">
              {data.name}
            </h3>

            {this.renderCardEditDropdown(data)}

            {/* <Select
              isSearchable={false}
              className="react-select-container react-select-container--icon"
              classNamePrefix="react-select-elements"
              value={{ label: iconLabel, value: "" }}
              onChange={this.handleChangeDropdownGeneralTask}
              options={options}
            /> */}
          </div>
          <div className="timesheet-table-week-view__card-content">
            <p className="timesheet-table-week-view__text1">Hours </p>
            <p className="font-24-extraBold common-peach-color-text-timesheet">
              {data.hours}
            </p>
            <p className="timesheet-table-week-view__text1">Booking Name</p>
            <p className="font-18-semiBold timesheet-table-week-view__text2">
              {data.bookingName}
            </p>
            <p className="timesheet-table-week-view__text1">Timings </p>
            <p className="font-18-semiBold timesheet-table-week-view__text2">
              {dateFns.format(data.fromtime, "hh:mmA")} -{" "}
              {dateFns.format(data.totime, "hh:mmA")}
            </p>
          </div>
        </div>
      </>
    );
  };

  /*============================================================
      main
  ============================================================*/
  render() {
    const {
      dateArray,
      handleOnClickMonthTableArrowLeft,
      handleOnClickMonthTableArrowRight,
    } = this.props;
    const { monthViewTimesheetData } = this.state;
    return (
      <div className="timesheet-week-view-div">
        <div className="timesheet-table-week-view timesheet-table-week-view--thead">
          {/* arrow left */}
          <button
            className="timesheet-table-week-view__arrow timesheet-table-week-view__arrow--left"
            onClick={handleOnClickMonthTableArrowLeft}
          >
            <i className="fa fa-arrow-left cursor-pointer"></i>
          </button>
          {/* arrow right */}
          <button
            className="timesheet-table-week-view__arrow timesheet-table-week-view__arrow--right"
            onClick={handleOnClickMonthTableArrowRight}
          >
            <i className="fa fa-arrow-right cursor-pointer"></i>
          </button>
          {/* table thead */}
          <table>
            <thead>
              <tr>
                {/* <th></th> for 7 days */}
                {dateArray.map(
                  (data, index) =>
                    index !== 0 &&
                    index !== 6 && (
                      <th key={index}>
                        <div className="timesheet-table-week-view__th-block">
                          <span className="timesheet-table-week-view__th-date">
                            {format(data, "D")}
                          </span>
                          <span className="timesheet-table-week-view__th-day">
                            {format(data, "ddd")}
                          </span>
                        </div>
                      </th>
                    )
                )}
                {/* <th></th> for 7 days end */}
              </tr>
            </thead>
          </table>
        </div>
        <div className="timesheet-table-week-view timesheet-table-week-view--tbody">
          <table>
            <tbody>
              {/* monthViewTimesheetData */}
              {!isEmpty(monthViewTimesheetData) ? (
                <tr className="timesheet-month-view-tr-row1">
                  {/* hours array */}
                  {dateArray.map((date, index) => {
                    return (
                      index !== 0 &&
                      index !== 6 && (
                        <td key={index}>
                          {/* {console.log(
                            dummyNewData.data.filter(
                              (a) =>
                                getDate(a.fromTime) ===
                                  getDate(date.toISOString()) &&
                                getMonth(a.fromTime) ===
                                  getMonth(date.toISOString()) &&
                                getYear(a.fromTime) ===
                                  getYear(date.toISOString())
                            )
                          )} */}
                          {this.renderProjectTaskCard(
                            monthViewTimesheetData.data.filter(
                              (a) =>
                                getDate(a.date) ===
                                  getDate(date.toISOString()) &&
                                getMonth(a.date) ===
                                  getMonth(date.toISOString()) &&
                                getYear(a.date) === getYear(date.toISOString())
                            )
                          )}
                          {/* {this.renderGeneralTaskCard(data)} */}
                        </td>
                      )
                    );
                  })}
                  {/* hours array end */}
                </tr>
              ) : (
                <tr>
                  <td colSpan={0} className="text-center pt-40">
                    <span className="font-14-semibold table-data-empty-message">
                      No data found
                    </span>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  monthViewTimesheetData: state.timesheet.monthViewTimesheetData,
  selectedFilterMemberId: state.timesheet.selectedFilterMemberId,
});

export default connect(mapStateToProps, {
  updateWorklogByid,
  createWorkLog,
  deleteWorklogById,
})(TimesheetWeekTableNew);
