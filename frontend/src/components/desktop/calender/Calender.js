import React, { Component, Fragment } from "react";
import PageTitle from "../common/PageTitle";
import DisplayCalender from "./DisplayCalender";
import CountCardCommon from "../common/CountCardCommon";
import MonthCard from "./MonthCard";
import GrayButtonSmallFont from "./../common/GrayButtonSmallFont";
import GreenButtonSmallFont from "./../common/GreenButtonSmallFont";
import LeftNavbar from "../header/LeftNavbar";
import TopNavbar from "../header/TopNavbar";
import Checkbox from "rc-checkbox";
import dateFns, { format } from "date-fns";
import "rc-checkbox/assets/index.css";
import { connect } from "react-redux";
import { getAllResourceAction } from "./../../../store/actions/resourcesAction";
import isEmpty from "../../../store/validations/is-empty";
import CalenderAddLeaves from "./CalenderAddLeaves";
import CalenderAddMeetings from "./CalenderAddMeetings";
import GrayLinkSmallFont from "../common/GrayLinkSmallFont";
import CalendarLeaveHistory from "./CalendarLeaveHistory";
import {
  getApprovalPendingLeaves,
  getUpcomingLeaves,
  updateLeave,
  approveLeave,
  getAvailableLeavesCount,
  getUpcomingMeetingCount,
  getAllCalenderData,
  getAllDataOfTheDay,
} from "./../../../store/actions/calenderAction";
import differenceInCalendarDays from "date-fns/difference_in_calendar_days";

export class Calender extends Component {
  constructor() {
    super();
    this.state = {
      activeMonth: new Date().getMonth(),
      currentMonth: new Date(),
      deleteEmployeeList: [],
      selectedDate: {},
      selectedDateData: {},
      leaveHistoryPage: false,
      hasSet: false,
    };
  }

  /*=============================================
                 Lifecycle Method
  ===============================================*/
  componentDidMount() {
    var userdata = JSON.parse(localStorage.getItem("UserData"));
    this.props.getAllResourceAction();
    this.props.getApprovalPendingLeaves();
    this.props.getUpcomingLeaves();
    this.props.getAvailableLeavesCount(userdata.id, userdata.memberType);
    this.props.getUpcomingMeetingCount(userdata.id);

    this.props.getAllCalenderData(
      dateFns.format(new Date(), "M"),
      dateFns.format(new Date(), "YYYY")
    );
    this.props.getAllDataOfTheDay(
      format(new Date(), "D"),
      format(new Date(), "M"),
      format(new Date(), "YYYY")
    );
  }

  static getDerivedStateFromProps(nextProps, nextState) {
    if (
      !isEmpty(nextProps.allPendingLeaves) &&
      nextProps.allPendingLeaves !== nextState.allPendingLeaves
    ) {
      return {
        allPendingLeaves: nextProps.allPendingLeaves,
      };
    }
    if (
      !isEmpty(nextProps.selectedDateData) &&
      nextProps.selectedDateData !== nextState.selectedDateData
    ) {
      return {
        selectedDateData: nextProps.selectedDateData,
      };
    }
    if (
      !isEmpty(nextProps.selectedDate) &&
      nextProps.selectedDate !== nextState.selectedDate
    ) {
      return {
        selectedDate: nextProps.selectedDate,
      };
    }
    if (
      !isEmpty(nextProps.allResources) &&
      nextProps.allResources !== nextState.allResources
    ) {
      return {
        allResources: nextProps.allResources,
      };
    }
    if (
      !isEmpty(nextProps.upcomingLeaves) &&
      nextProps.upcomingLeaves !== nextState.upcomingLeaves
    ) {
      return {
        upcomingLeaves: nextProps.upcomingLeaves,
      };
    }
    if (
      !isEmpty(nextProps.upcomingMeetingCount) &&
      nextProps.upcomingMeetingCount !== nextState.upcomingMeetingCount
    ) {
      return {
        upcomingMeetingCount: nextProps.upcomingMeetingCount,
      };
    }
    if (
      !isEmpty(nextProps.availableLeaves) &&
      nextProps.availableLeaves !== nextState.availableLeaves
    ) {
      return {
        availableLeaves: nextProps.availableLeaves,
      };
    }
    if (
      !isEmpty(nextProps.allDataOfDay) &&
      nextProps.allDataOfDay !== nextState.allDataOfDay
    ) {
      return {
        allDataOfDay: nextProps.allDataOfDay,
      };
    }

    return null;
  }

  componentDidUpdate() {
    if (this.props.allPendingLeaves !== this.state.allPendingLeaves) {
      this.setState({
        allPendingLeaves: this.props.allPendingLeaves,
      });
    }
    if (this.props.selectedDateData !== this.state.selectedDateData) {
      // console.log(this.props.selectedDateData);
      this.setState({
        selectedDateData: this.props.selectedDateData,
      });
    }
  }

  /*============================
        Checkbox events handler
  =============================*/

  doEmailExist = (email) => {
    let obj = this.state.deleteEmployeeList.find((emp) => emp === email);
    console.log(obj);
    return obj ? this.state.deleteEmployeeList.indexOf(obj) : false;
  };

  onChangeCheckbox = (email) => (e) => {
    // console.log("Checkbox checked:", email);
    let deleteEmployeeList = this.state.deleteEmployeeList;

    let returnValue = this.doEmailExist(email);
    if (returnValue || returnValue === 0) {
      deleteEmployeeList.splice(returnValue, 1);
    } else {
      deleteEmployeeList.push(email);
    }
    this.setState({
      deleteEmployeeList: deleteEmployeeList,
    });
  };

  toggle = () => {
    this.setState((state) => ({
      disabled: !state.disabled,
    }));
  };

  onClickMonthHandler = (month) => (e) => {
    console.log(month);
    var d = new Date();
    d.setMonth(month.monthCount);
    console.log(d);
    this.setState({
      activeMonth: month.monthCount,
      currentMonth: d,
    });

    this.props.getAllCalenderData(
      dateFns.format(d, "M"),
      dateFns.format(d, "YYYY")
    );
  };

  /*===========================================================
                        Render Calender
  ============================================================*/

  onClickLeaveHistory = () => {
    this.setState({
      leaveHistoryPage: true,
    });
  };

  handleGoBackLeaveHistory = () => {
    this.setState({ leaveHistoryPage: false });
  };

  onClickPendingLeavesHandler = (applyStatus, leaveData) => (e) => {
    // console.log(applyStatus);
    // console.log(leaveData);

    if (applyStatus === "APPROVED") {
      let formData = leaveData;
      formData.leaveStatus = applyStatus;
      this.props.approveLeave(formData._id, formData);
    } else {
      let formData = leaveData;
      formData.leaveStatus = applyStatus;
      this.props.updateLeave(formData._id, formData);
    }
  };

  renderCalender = () => {
    const { selectedDateData } = this.props;
    const {
      selectedDate,
      allPendingLeaves,
      upcomingLeaves,
      upcomingMeetingCount,
    } = this.state;
    const { allResources } = this.state;
    const { activeMonth, availableLeaves, allDataOfDay } = this.state;

    let availableLeavesCount =
      !isEmpty(availableLeaves) &&
      availableLeaves.annual_leave + availableLeaves.sick_leave;
    return (
      <Fragment>
        <div className="calender_main_container">
          <MonthCard
            activeMonth={activeMonth}
            onClick={this.onClickMonthHandler}
          />
          <div>
            <div>
              <div style={{ display: "flex" }}>
                <CountCardCommon
                  title="AVAILABLE LEAVES"
                  count={
                    !isEmpty(availableLeavesCount) ? availableLeavesCount : 0
                  }
                />
                <CountCardCommon
                  title="UPCOMING MEETING"
                  count={
                    !isEmpty(upcomingMeetingCount) && upcomingMeetingCount.count
                  }
                />
                <CountCardCommon
                  title="PENDING LEAVE REQUEST"
                  count={
                    !isEmpty(allPendingLeaves) ? allPendingLeaves.length : 0
                  }
                />
                {/* <div className="button_section">
                  <div className="d-flex">
                    <CalenderAddMeetings
                      allResources={
                        !isEmpty(this.props.allResources) &&
                        this.props.allResources
                      }
                    />
                    <GrayButtonSmallFont
                      onClick={this.onClickLeaveHistory}
                      text={"Leave History"}
                      extraClassName="calender-leave-history-btn"
                    />
                  </div>
                  <div className="add_leave_button">
                    <CalenderAddLeaves />
                  </div>
                </div> */}
              </div>
            </div>
            <DisplayCalender currentMonth={this.state.currentMonth} />
            <div style={{ float: "right" }} className="d-flex">
              <div className="d-flex mr-60">
                <div className="company_days_off_colored_cicle-meeting"></div>
                <p className="color_icon_text text-uppercase">meeting</p>
              </div>
              <div className="d-flex">
                <div className="leave_colored_cicle"></div>
                <p className="color_icon_text">LEAVE</p>
              </div>
              <div className="d-flex">
                <div className="company_days_off_colored_cicle"></div>
                <p className="color_icon_text">COMPANY DAY OFF</p>
              </div>
            </div>
          </div>
          <div>
            <div className="upcoming_leaves_card">
              <h1>UPCOMING LEAVES</h1>
              <ul>
                {!isEmpty(upcomingLeaves) &&
                  upcomingLeaves.map((leave, index) => {
                    return (
                      <li key={index}>
                        <div className="dot"></div>
                        <div>
                          <h2>{dateFns.format(leave.toDate, "Do MMMM")}</h2>
                          <p>{leave.reason}</p>
                        </div>
                      </li>
                    );
                  })}
              </ul>
            </div>
            <div className="day_view_card">
              <h1 className="font-18-bold-space-light-uppercase">
                today’s schedule
              </h1>
              <div className="heading">
                <h2> {dateFns.format(selectedDate, "DD-MM-YYYY")}</h2>
                <p>{dateFns.format(selectedDate, "dddd")}</p>
              </div>
              <hr></hr>
              <div className="meet_of_slected_day-overflow-div">
                {!isEmpty(allDataOfDay) &&
                  allDataOfDay.meetingData.map((meet, index) => {
                    return (
                      <div key={index} className="meet_of_slected_day">
                        <h2>
                          {`${dateFns.format(
                            meet.meetingTimeFrom,
                            "HH:MM A"
                          )} to ${dateFns.format(
                            meet.meetingTimeTo,
                            "HH:MM A"
                          )}`}
                          {}
                        </h2>
                        <p>{meet.subject}</p>
                      </div>
                    );
                  })}
                {!isEmpty(allDataOfDay) &&
                  allDataOfDay.holidays.map((leave, index) => {
                    return (
                      <div key={index} className="meet_of_slected_day">
                        <h2>
                          {`${dateFns.format(
                            leave.fromDate,
                            "do MMM"
                          )} to ${dateFns.format(leave.toDate, "do MMM")}`}
                        </h2>
                        <p>Reason : {leave.reason}</p>
                        <p>Leave Type : {leave.leaveType}</p>
                      </div>
                    );
                  })}
              </div>
            </div>
          </div>
        </div>
        <div className="approval_pending_card">
          <div className="heading">
            <div className="dot"></div> <h1>Pending requests</h1>
          </div>
          <div className="table-div">
            <table className="table">
              <thead></thead>
              <tbody>
                {!isEmpty(allPendingLeaves) &&
                  allPendingLeaves.map((leave, index) => {
                    return (
                      <tr key={index}>
                        <td className="name_td">
                          <img
                            src={require("../../../assets/img/dummy/new-profile-img.svg")}
                            //src={require("../../../assets/img/icons/calender-pendeing-request-profile-icon.svg")}
                            alt="pending request profile"
                            className="pending-request-profile-img"
                          />
                          {leave.user.name}
                        </td>
                        <td className="leave_type_td">
                          {leave.leaveType === "PAID_LEAVE"
                            ? "Paid Leave"
                            : "Unpaid leave"}{" "}
                        </td>
                        <td className="date_td">
                          {dateFns.format(leave.fromDate, "DD-MM")} to{" "}
                          {dateFns.format(leave.toDate, "DD-MM")}
                        </td>
                        <td className="day_td">
                          {differenceInCalendarDays(
                            new Date(leave.toDate),
                            new Date(leave.fromDate)
                          )}
                        </td>
                        <td className="button_td text-center">
                          <GrayButtonSmallFont
                            onClick={this.onClickPendingLeavesHandler(
                              "REJECTED",
                              leave
                            )}
                            text={"Deny"}
                          />
                          <GreenButtonSmallFont
                            onClick={this.onClickPendingLeavesHandler(
                              "APPROVED",
                              leave
                            )}
                            text={"Approve"}
                          />
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        </div>
      </Fragment>
    );
  };

  render() {
    // console.log(this.state.upcomingMeetingCount);
    // console.log(this.state.allResources);
    // console.log(this.props.allResources);
    // const { selectedDateData } = this.state;
    // console.log(this.props.selectedDateData);
    if (this.state.leaveHistoryPage) {
      return (
        <>
          <div className="login-flow-dashboard-buttons-block">
            <GrayButtonSmallFont
              onClick={this.handleGoBackLeaveHistory}
              text="Go Back"
            />
          </div>
          <LeftNavbar activeMenu="leave-history" />

          <div className="main-page-padding">
            <div className="pageTitle-topNavbar-div">
              <PageTitle title="Leave History" />
              {/* <TopNavbar /> */}
            </div>
            <CalendarLeaveHistory />
          </div>
        </>
      );
    }

    return (
      <>
        <LeftNavbar activeMenu="calendar" />
        <div className="main-page-padding">
          <div className="pageTitle-topNavbar-div">
            <PageTitle title="Calender" />
            <TopNavbar activeMenu={"calendar"} />
          </div>
          {this.renderCalender()}
        </div>
      </>
    );
  }
}

const mapStateToProps = (state) => ({
  allResources: state.resources.allResources,
  selectedDate: state.calender.selectedDate,
  selectedDateData: state.calender.selectedDateData,
  allPendingLeaves: state.calender.pendingLeaves,
  upcomingLeaves: state.calender.upcomingLeaves,
  upcomingMeetingCount: state.calender.upcomingMeetingCount,
  availableLeaves: state.calender.availableLeaves,
  allDataOfDay: state.calender.allDataOfDay,
});

export default connect(mapStateToProps, {
  getAllResourceAction,
  getApprovalPendingLeaves,
  getUpcomingLeaves,
  updateLeave,
  approveLeave,
  getAvailableLeavesCount,
  getUpcomingMeetingCount,
  getAllCalenderData,
  getAllDataOfTheDay,
})(Calender);
