import React, { Component } from "react";
import Select from "react-select";
import Progress from "react-progressbar";
import InputFieldNumber from "../common/InputFieldNumber";
import dateFns from "date-fns";

import isEmpty from "../../../store/validations/is-empty";
import { connect } from "react-redux";
import {
  updateWorklogByid,
  createWorkLog,
} from "./../../../store/actions/timesheetAction";
import { startOfWeek, endOfWeek } from "date-fns";
import getDayOfYear from "date-fns/get_day_of_year";
import addDays from "date-fns/add_days";

const dummyData = [1, 2, 3, 4, 5];

// table
let dataStatus = { value: "INPROGRESS", label: "In Progress" };
const optionsStatusTable = [
  { value: "Not Started", label: "Not Started" },
  { value: "In Progress", label: "In Progress" },
  { value: "Completed", label: "Completed" },
];

export class TimesheetDayTable extends Component {
  constructor() {
    super();
    this.state = {
      actualHours: "",
      isEditActualHours: false,
    };
  }

  static getDerivedStateFromProps(nextProps, nextState) {
    if (
      !isEmpty(nextProps.dayViewTimesheetData) &&
      nextProps.dayViewTimesheetData !== nextState.dayViewTimesheetData
    ) {
      return {
        dayViewTimesheetData: nextProps.dayViewTimesheetData,
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
    if (this.props.dayViewTimesheetData !== this.state.dayViewTimesheetData) {
      this.setState({
        dayViewTimesheetData: this.props.dayViewTimesheetData,
      });
    }
  }

  /*============================================================
      handleChangeStatusDropdownTable
  ============================================================*/
  handleChangeStatusDropdownTable = (data) => (selectedOption) => {
    console.log(data, selectedOption);
    console.log(`Option selected:`, data);
    const { selectedFilterMemberId } = this.state;

    if (data.worklogId === "0") {
      const formData = {
        name: "th233",
        schedule: data._id,
        task: "9f12f230-e1e9-11ea-a47e-a59c158e0673",
        user: "9f12f230-e1e9-11ea-a47e-a59c158e0673",
        hours: this.state.actualHours,
        // createdBy: data.id,
        // lastModifiedBy: data.id,
        status:
          selectedOption.value === "Not Started"
            ? "NOTSTARTED"
            : selectedOption.value === "Completed"
            ? "COMPLETED"
            : "INPROGRESS",
      };

      this.props.createWorkLog(
        formData,
        startOfWeek(new Date()).toISOString(),
        endOfWeek(new Date()).toISOString(),
        selectedFilterMemberId,
        getDayOfYear(new Date())
      );
    } else {
      // console.log("call update api");

      const formData = {
        name: "th233",
        schedule: data._id,
        task: "9f12f230-e1e9-11ea-a47e-a59c158e0673",
        user: "9f12f230-e1e9-11ea-a47e-a59c158e0673",
        hours: data.actualHours,
        // createdBy: data.id,
        // lastModifiedBy: data.id,
        status:
          selectedOption.value === "Not Started"
            ? "NOTSTARTED"
            : selectedOption.value === "Completed"
            ? "COMPLETED"
            : "INPROGRESS",
      };
      console.log(formData);

      this.props.updateWorklogByid(
        data.worklogId,
        formData,
        startOfWeek(new Date()).toISOString(),
        endOfWeek(new Date()).toISOString(),
        selectedFilterMemberId,
        getDayOfYear(new Date())
      );
    }
  };

  handleChangeNumberTable = (e) => {
    this.setState({
      actualHours: e.target.validity.valid ? e.target.value : "1",
    });
  };

  handleOnClickEditActualHours = (data) => (e) => {
    console.log(data);
    this.setState({
      isEditActualHours: true,
      actualHours: data.actualhours,
    });
  };

  handleOnClickSaveActualhandle = (data) => (e) => {
    const { selectedFilterMemberId } = this.state;
    console.log(data);
    if (data.worklogId === "0") {
      const formData = {
        name: "th233",
        schedule: data.scheduleId,
        task: "9f12f230-e1e9-11ea-a47e-a59c158e0673",
        user: "9f12f230-e1e9-11ea-a47e-a59c158e0673",
        hours: this.state.actualHours,
        // createdBy: data.id,
        // lastModifiedBy: data.id,
        status: "INPROGRESS",
      };
      this.props.createWorkLog(
        formData,
        startOfWeek(new Date()).toISOString(),
        endOfWeek(new Date()).toISOString(),
        selectedFilterMemberId,
        getDayOfYear(new Date())
      );
    } else {
      const formData = {
        // name: "th233",
        schedule: data.scheduleId,
        // task: "9f12f230-e1e9-11ea-a47e-a59c158e0673",
        // user: "9f12f230-e1e9-11ea-a47e-a59c158e0673",
        hours: this.state.actualHours,
      };

      this.props.updateWorklogByid(
        data.worklogId,
        formData,
        startOfWeek(new Date()).toISOString(),
        endOfWeek(new Date()).toISOString(),
        selectedFilterMemberId,
        getDayOfYear(new Date())
      );
    }

    this.setState({
      isEditActualHours: false,
    });
  };

  renderProgress = (data) => {
    let progress = 0;
    if (!isEmpty(data)) {
      progress = (parseInt(data.actualhours) / data.assignedhours) * 100;
      if (progress === Infinity || progress === NaN) {
        progress = 0;
      }
    }
    return progress;
  };

  /*============================================================
      main
  ============================================================*/
  render() {
    const { isEditActualHours, dayViewTimesheetData } = this.state;
    let array = [];
    if (!isEmpty(dayViewTimesheetData)) {
      array.push(dayViewTimesheetData);
      console.log(array);
    }

    return (
      <div className="timesheet-day-view-div">
        <div className="finances-table-thead finances-table-thead--timesheetDayView">
          <table className="finances-table finances-table--timesheetDayView">
            <thead>
              <tr>
                <th>
                  <span>Task Details</span>
                </th>
                <th>
                  <span>Progress</span>
                </th>
                <th>
                  <span>planned hours</span>
                </th>
                <th>
                  <span>actual hours</span>
                </th>
                <th>
                  <span className="opacity-0"> 0</span>
                </th>
              </tr>
            </thead>
          </table>
        </div>
        <div className="finances-table-tbody finances-table-tbody--timesheetDayView">
          <table className="finances-table finances-table--timesheetDayView">
            <tbody>
              {!isEmpty(array) ? (
                array.map((data, index) => (
                  <tr
                    key={index}
                    className={
                      this.props.activeWalkthroughPage === "timesheet-2" &&
                      index === 0
                        ? "new-walkthrough-active-all-project-card"
                        : ""
                    }
                  >
                    <td>
                      {/**font-18-semiBold font-18-bold  */}
                      <p className="font-18-bold font-18-bold--timesheet-day-table-task-name">
                        {!isEmpty(data) && data.taskName}
                      </p>
                      <p className="font-18-bold-space-light-uppercase">
                        {!isEmpty(data) && data.projectName}
                      </p>
                      <p className="timesheet-font-14-regular pb-10">
                        {!isEmpty(data) &&
                          dateFns.format(data.fromTime, "hh:mmA")}
                        -
                        {!isEmpty(data) &&
                          dateFns.format(data.toTime, "hh:mmA")}
                      </p>
                      {/** font-16-bold-space-light-uppercase */}
                      <p className="pb-10 timesheetDayView-text1">
                        {!isEmpty(data) &&
                          dateFns.format(data.startDate, "DD/MM/YYYY")}
                        <span className="timesheetDayView-text2"> to </span>
                        {!isEmpty(data) &&
                          dateFns.format(data.endDate, "DD/MM/YYYY")}
                      </p>
                    </td>
                    <td>
                      <div className="row mx-0 align-items-center">
                        {/* <div className="row mx-0 align-items-center timesheet-day-view-progress-row1-colm1"> */}
                        {/* <span className="timesheetDayView-text3">status</span> */}
                        {/* {console.log(dataStatus)}
                          {data.status !== undefined &&
                          data.status === "COMPLETED" ? (
                            // disabled
                            <Select
                              className="react-select-container react-select-container--addInvoice"
                              classNamePrefix="react-select-elements"
                              value={{ value: "Completed", label: "Completed" }}
                              isDisabled={true}
                              placeholder="Closed"
                            />
                          ) : (
                            // active
                            <Select
                              isSearchable={false}
                              className="react-select-container react-select-container--addMember react-select-container--addInvoice"
                              classNamePrefix="react-select-elements"
                              value={
                                data.status === undefined ||
                                data.status === "NOTSTARTED" ||
                                data.status === 0
                                  ? {
                                      value: "Not Started",
                                      label: "Not Started",
                                    }
                                  : {
                                      value: "In Progress",
                                      label: "In Progress",
                                    }
                              }
                              onChange={this.handleChangeStatusDropdownTable(
                                data
                              )}
                              options={optionsStatusTable}
                              placeholder="On Hold"
                            />
                          )} */}
                        {/* </div> */}
                        <div>
                          <span className="timesheetDayView-text3">
                            deadline :
                          </span>
                          <span>
                            {!isEmpty(data) && data.taskdeadline.toFixed()}
                          </span>
                        </div>
                      </div>
                      <div className="progressbar-timesheetDayView">
                        <Progress completed={this.renderProgress(data)} />
                      </div>
                      <div className="row mx-0 align-items-center">
                        <div className="timesheet-day-view-progress-row2-colm1">
                          <span className="timesheetDayView-text3">
                            total Assigned hours:
                          </span>
                          <span>{!isEmpty(data) && data.assignedhours}</span>
                        </div>
                        <div>
                          <span className="timesheetDayView-text3">
                            total recorded hours:
                          </span>
                          <span>{!isEmpty(data) && data.actualhours}</span>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span>
                        {!isEmpty(data) && data.plannedHours.toFixed()}
                      </span>
                    </td>
                    <td>
                      {!isEditActualHours ? (
                        <div className="timesheet-day-view-actual-hours-block timesheet-day-view-actual-hours-block--noBorder">
                          <InputFieldNumber
                            containerClassName="container-login-flow-input container-login-flow-input--addExpenseSmall "
                            name="actualHours"
                            value={!isEmpty(data) && data.actualhours}
                            onChange={this.handleChangeNumberTable}
                            isDisabled={true}
                          />
                        </div>
                      ) : (
                        <div className="timesheet-day-view-actual-hours-block">
                          <InputFieldNumber
                            containerClassName="container-login-flow-input container-login-flow-input--addExpenseSmall"
                            name="actualHours"
                            value={this.state.actualHours}
                            onChange={this.handleChangeNumberTable}
                          />
                        </div>
                      )}
                    </td>
                    <td>
                      {!isEditActualHours ? (
                        <i
                          className="fa fa-pencil overview-block__pencil-edit"
                          onClick={this.handleOnClickEditActualHours(data)}
                        ></i>
                      ) : (
                        <i
                          className="fa fa-save overview-block__pencil-edit"
                          onClick={this.handleOnClickSaveActualhandle(data)}
                        ></i>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr
                  className={
                    this.props.activeWalkthroughPage === "timesheet-2"
                      ? "new-walkthrough-active-all-project-card"
                      : ""
                  }
                >
                  <td colSpan={0} className="text-center">
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
  dayViewTimesheetData: state.timesheet.dayViewTimesheetData,
  selectedFilterMemberId: state.timesheet.selectedFilterMemberId,
  activeWalkthroughPage: state.auth.activeWalkthroughPage,
});

export default connect(mapStateToProps, { createWorkLog, updateWorklogByid })(
  TimesheetDayTable
);
