import React, { Component } from "react";
import { Link } from "react-router-dom";
import Select from "react-select";
import DatepickerFromTo from "../common/DatepickerFromTo";
import GrayButtonSmallFont from "../common/GrayButtonSmallFont";
import { connect } from "react-redux";
import { getLeaveHistory } from "./../../../store/actions/calenderAction";
import isEmpty from "../../../store/validations/is-empty";
import dateFns from "date-fns";
import differenceInCalendarDays from "date-fns/difference_in_calendar_days";
import { getAllResourceAction } from "./../../../store/actions/resourcesAction";
import { startOfDay, endOfDay } from "date-fns";

const dummyData = [1, 2, 3, 4, 5];

const options = [
  { value: "Member Name", label: "Member Name" },
  { value: "John", label: "John" },
  { value: "Anna", label: "Anna" },
  { value: "Paul", label: "Paul" },
];

class CalendarLeaveHistory extends Component {
  constructor() {
    super();
    this.state = {
      isDisplayMySheet: false,
      startDate: startOfDay(new Date()),
      endDate: endOfDay(new Date()),
      resourceOption: [],
      activeUser: "",
    };
  }

  componentDidMount() {
    // console.log("leave history");
    var userdata = JSON.parse(localStorage.getItem("UserData"));
    this.setState({
      activeUser: userdata.id,
    });
    const formData = {
      pageNo: 1,
      pageSize: 10,
      query: {
        id: userdata.id,
        fromDate: startOfDay(new Date()),
        toDate: endOfDay(new Date()),
        // fromDate:"2020-05-01T11:36:04.739Z",
        // toDate:"2020-05-29T11:36:04.739Z",
        // leaveType:{ "$ne":"HOLIDAY" }
      },
    };
    this.props.getLeaveHistory(formData);
    this.props.getAllResourceAction();
  }

  static getDerivedStateFromProps(nextProps, nextState) {
    if (
      !isEmpty(nextProps.leavesHistory) &&
      nextProps.leavesHistory !== nextState.leavesHistory
    ) {
      return {
        leavesHistory: nextProps.leavesHistory,
      };
    }
    if (
      !isEmpty(nextProps.allResources) &&
      nextProps.allResources !== nextState.allResources
    ) {
      let newArray =
        !isEmpty(nextProps.allResources) &&
        nextProps.allResources.map((resource) => ({
          value: resource._id,
          label: resource.name,
          data: resource,
        }));

      return {
        resourceOption: newArray,
      };
    }
    return null;
  }

  componentDidUpdate() {
    if (this.props.leavesHistory !== this.state.leavesHistory) {
      this.setState({
        leavesHistory: this.props.leavesHistory,
      });
    }
  }

  /*===========================================================================
      renderDropdownRow
  ===========================================================================*/

  handleChangeDropdown = (selectedOption) => {
    // this.setState({ selectedOption });
    console.log(`Option selected:`, selectedOption.data);
    this.setState({
      activeUser: selectedOption.data._id,
    });

    const formData = {
      pageNo: 1,
      pageSize: 10,
      query: {
        id: selectedOption.data._id,
        fromDate: this.state.startDate,
        toDate: this.state.endDate,
        // fromDate:"2020-05-01T11:36:04.739Z",
        // toDate:"2020-05-29T11:36:04.739Z",
        // leaveType:{ "$ne":"HOLIDAY" }
      },
    };

    this.props.getLeaveHistory(formData);
  };

  handleOnClickDisplayAllOrSingleData = () => {
    var userdata = JSON.parse(localStorage.getItem("UserData"));
    const { isDisplayMySheet } = this.state;

    if (isDisplayMySheet === true) {
      const formData = {
        pageNo: 1,
        pageSize: 10,
        query: {
          id: userdata.id,
          fromDate: this.state.startDate,
          toDate: this.stateendDate,
          // fromDate:"2020-05-01T11:36:04.739Z",
          // toDate:"2020-05-29T11:36:04.739Z",
          // leaveType:{ "$ne":"HOLIDAY" }
        },
      };
      this.props.getLeaveHistory(formData);
    }

    this.setState({
      isDisplayMySheet: !this.state.isDisplayMySheet,
    });
  };

  renderDropdownRow = () => {
    const { isDisplayMySheet } = this.state;
    return (
      <div className="timesheet-content-div__btns-block-padding mb-50">
        {isDisplayMySheet ? (
          // display dropdown
          <Select
            isSearchable={false}
            className="react-select-container react-select-container--addMember react-select-container--timesheet"
            classNamePrefix="react-select-elements"
            value={this.state.selectedOption}
            onChange={this.handleChangeDropdown}
            options={this.state.resourceOption}
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
              options={this.state.resourceOption}
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
  renderDatepickerAndButtonRow = () => {
    const { isDisplayMySheet } = this.state;
    return (
      <div className="row mx-0 pr-0 align-items-center justify-content-between timesheet-content-div__btns-block-padding">
        <div className="mb-30">{this.renderDateFromTo()}</div>
        <div className="mb-30">
          {isDisplayMySheet ? (
            <GrayButtonSmallFont
              //text="My History"
              onClick={this.handleOnClickDisplayAllOrSingleData}
              extraClassName="leave-history-all-member-btn"
              text="Check My History"
            />
          ) : (
            <GrayButtonSmallFont
              //text="All Members"
              onClick={this.handleOnClickDisplayAllOrSingleData}
              text="Check Team’s History"
              extraClassName="leave-history-all-member-btn"
            />
          )}
        </div>
      </div>
    );
  };

  /*============================================================
      renderDateFromTo
  ============================================================*/
  handleChangeStart = (date) => {
    if (date === null) {
      this.setState({
        startDate: new Date(),
      });
    } else {
      this.setState({
        startDate: date,
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

  handleOnClickDateArrowIcon = () => {
    // console.log("clicked on arrow icon");
    const { startDate, endDate, activeUser } = this.state;

    // console.log(startDate, endDate);
    // console.log(activeUser);
    const formData = {
      pageNo: 1,
      pageSize: 10,
      query: {
        id: activeUser,
        fromDate: startOfDay(startDate),
        toDate: endOfDay(endDate),
        // fromDate:"2020-05-01T11:36:04.739Z",
        // toDate:"2020-05-29T11:36:04.739Z",
        // leaveType:{ "$ne":"HOLIDAY" }
      },
    };
    this.props.getLeaveHistory(formData);
  };

  renderDateFromTo = () => {
    return (
      <div className="datepicker-no-border datepicker-no-border--support">
        <DatepickerFromTo
          startDateValue={this.state.startDate}
          endDateValue={this.state.endDate}
          handleChangeStart={this.handleChangeStart}
          handleChangeEnd={this.handleChangeEnd}
          handleOnClickDateArrowIcon={this.handleOnClickDateArrowIcon}
        />
      </div>
    );
  };

  /*============================================================
      renderTable
  ============================================================*/

  handleOnClickDeleteIcon = () => {
    console.log("clicked on delete icon");
  };

  renderTable = () => {
    const { leavesHistory } = this.state;
    // console.log(leavesHistory);
    return (
      <>
        <div className="finances-table-thead">
          <table className="finances-table finances-table--leaveHistory">
            <thead>
              <tr>
                <th>
                  <span>Employee Name</span>
                </th>
                <th>
                  <span>from</span>
                </th>
                <th>
                  <span>to</span>
                </th>
                <th>
                  <span>leave type</span>
                </th>
                <th>
                  <span>days of leave</span>
                </th>
                <th>
                  <span>status</span>
                </th>
                <th>
                  <span className="opacity-0">0</span>
                </th>
              </tr>
            </thead>
          </table>
        </div>
        <div className="finances-table-tbody finances-table-tbody--invoice finances-table-tbody--invoice--leaveHistory">
          <table className="finances-table finances-table--leaveHistory">
            <tbody>
              {!isEmpty(leavesHistory) &&
                leavesHistory.map((data, index) => (
                  <tr key={index}>
                    <td>
                      <span>{data.user.name}</span>
                    </td>
                    <td>
                      <span>{dateFns.format(data.fromDate, "DD-MM-YYYY")}</span>
                    </td>
                    <td>
                      <span>{dateFns.format(data.toDate, "DD-MM-YYYY")}</span>
                    </td>
                    <td>
                      <span>{data.leaveType}</span>
                    </td>
                    <td>
                      <span>
                        {differenceInCalendarDays(
                          new Date(data.toDate),
                          new Date(data.fromDate)
                        )}
                      </span>
                    </td>
                    <td>
                      <span>{data.leaveStatus}</span>
                    </td>
                    <td>
                      <span className="row mx-0 flex-nowrap align-items-start">
                        <Link to="/calendar">
                          <i className="fa fa-pencil finances-table__fa-icon-edit"></i>
                        </Link>
                        <i
                          className="fa fa-trash finances-table__fa-icon-delete"
                          onClick={this.handleOnClickDeleteIcon}
                        ></i>
                      </span>
                    </td>
                  </tr>
                ))}
              {/* for empty data array */}
              {/* <tr>
                <td colSpan={0} className="text-center">
                  <span className="font-14-semibold table-data-empty-message">No data found</span>
                </td>
              </tr> */}
            </tbody>
          </table>
        </div>
      </>
    );
  };

  /*============================================================
      main
  ============================================================*/
  render() {
    return (
      <>
        <div className="timesheet-content-div">
          {/* dropdown row */}
          {this.renderDropdownRow()}

          {this.renderDatepickerAndButtonRow()}
          {this.renderTable()}
        </div>
      </>
    );
  }
}

const mapStateToProps = (state) => ({
  leavesHistory: state.calender.leavesHistory,
  allResources: state.resources.allResources,
});

export default connect(mapStateToProps, {
  getLeaveHistory,
  getAllResourceAction,
})(CalendarLeaveHistory);
