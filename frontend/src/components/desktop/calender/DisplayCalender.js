import React, { Component, Fragment } from "react";
import Slider from "react-slick";
import dateFns from "date-fns";
import { connect } from "react-redux";
import store from "../../../store/store";
import {
  SET_SELECTED_DATE,
  SET_SELECTED_DATE_DATA,
} from "./../../../store/types";
import { getAllDataOfTheDay } from "./../../../store/actions/calenderAction";
import isEmpty from "../../../store/validations/is-empty";

const calenderData = {
  "1": [],
  "2": [],
  "3": [],
  "4": [],
  "5": [],
  "6": [],
  "7": [],
  "8": [],
  "9": [
    {
      _id: "588ccdb0-f8d4-11eb-a8ca-51981cd0f819",
      subject: "Meeting",
      meetingDate: "2021-08-09T00:00:00.000Z",
      meetingTime: "2021-08-09T05:40:40.130Z",
      meetingEndTime: "2021-08-09T05:40:40.130Z",
      location: "pune",
      status: "NEW",
      assigned: {
        tags: [],
        _id: "502ddbf0-f8d4-11eb-a8ca-51981cd0f819",
        name: "john",
        email: "john@gmail.com",
        phone: "+17798338782",
        phoneCode: "+1",
        status: "NEW_LEAD",
        assigned: "f0cee190-f8d3-11eb-9882-61645e3c9c3f",
        profileImage: "https://xyz.com",
        about: "",
        degree: "COLD",
        account_id: {
          secondaryContactPerson: [],
          tags: ["Meeting"],
          documents: [{}],
          _id: "4ccb5000-f8d4-11eb-9882-61645e3c9c3f",
          accountname: "demo",
          description: "asd",
          onBoardingDate: "2021-08-09T05:40:26.867Z",
          coverImg:
            "https://res.cloudinary.com/myrltech/image/upload/v1610605921/profile.svg",
          defaultEmail: "",
          location: "asd",
          website: "",
          addresses: {
            billing_line_one: "asd",
            billing_line_two: "",
            billing_line_three: "",
            shipping_line_one: "asd",
            shipping_line_two: "",
            shipping_line_three: "",
          },
          accountstatus: "ACTIVE",
          credibility: "Verified",
          createdBy: "akshaynagargoje0716@gmail.com",
          lastModifiedBy: "akshaynagargoje0716@gmail.com",
          createdAt: "2021-08-09T05:40:27.011Z",
          updatedAt: "2021-08-09T05:40:27.011Z",
          __v: 0,
        },
        media: {
          facebook: "",
          linkedIn: "",
          instagram: "",
          skype: "",
          other: "",
        },
        worth: 30000,
        source: "",
        isKanban: false,
        isHidden: false,
        createdBy: "akshaynagargoje0716@gmail.com",
        lastModifiedBy: "akshaynagargoje0716@gmail.com",
        createdAt: "2021-08-09T05:40:32.697Z",
        updatedAt: "2021-08-09T05:40:32.697Z",
        __v: 0,
      },
      createdBy: "akshaynagargoje0716@gmail.com",
      lastModifiedBy: "akshaynagargoje0716@gmail.com",
      organizer: {
        _id: "f0cee190-f8d3-11eb-9882-61645e3c9c3f",
        email: "akshaynagargoje0716@gmail.com",
        firstName: "akshay",
        lastName: "nagargoje",
        demo: false,
        verified: false,
        role: "f0a1b710-f8d3-11eb-9882-61645e3c9c3f",
        profileImage:
          "/public/download?filename=file-2019-11-18T17:38:30.307Z.jpeg",
        name: "akshay nagargoje",
        status: "ACTIVE",
        dateOfJoining: "2021-08-09T05:37:52.677Z",
        createdBy: "akshaynagargoje0716@gmail.com",
        lastModifiedBy: "akshaynagargoje0716@gmail.com",
        createdAt: "2021-08-09T05:37:52.687Z",
        updatedAt: "2021-08-09T05:39:46.968Z",
        __v: 0,
      },
      createdAt: "2021-08-09T05:40:46.733Z",
      updatedAt: "2021-08-09T05:40:46.733Z",
      __v: 0,
    },
  ],
  "10": [],
  "11": [],
  "12": [],
  "13": [],
  "14": [],
  "15": [],
  "16": [],
  "17": [],
  "18": [],
  "19": [],
  "20": [],
  "21": [],
  "22": [],
  "23": [],
  "24": [],
  "25": [],
  "26": [],
  "27": [],
  "28": [],
  "29": [],
  "30": [],
  "31": [],
};

class DisplayCalender extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentMonth: new Date(),
      selectedDate: new Date(),
      calenderView: true,
    };
  }

  static getDerivedStateFromProps(nextProps, nextState) {
    if (nextProps.currentMonth !== nextState.currentMonth) {
      return {
        currentMonth: nextProps.currentMonth,
      };
    }
    if (
      !isEmpty(nextProps.displayCalenderData) &&
      nextProps.displayCalenderData !== nextState.displayCalenderData
    ) {
      return {
        displayCalenderData: nextProps.displayCalenderData,
      };
    }
    return null;
  }

  /*========================================
             Lifecycle methods
  =========================================*/
  componentDidMount() {
    // console.log("hello");
    // let data = JSON.parse(localStorage.getItem("Data"));
    // var currentDate = new Date();
    // var currentTime = currentDate.getTime();
    // console.log(currentTime);
    // if (currentTime > data.tokenExpiresOn - 600000) {
    //   this.props.replaceRefreshToken({
    //     refresh_token: data.refresh_token
    //   });
    //   console.log("expired");
    // }
    // this.props.getOrganizationDetaisAction(data.workspaceId);
  }

  /****************************
   *  handler event
   ***************************/
  dayViewHandler = () => {
    this.setState({
      calenderView: !this.state.calenderView,
    });
  };

  /*===============================
      Leaves duration events
  ================================*/
  handleChangeFromDate = (date) => {
    this.setState(
      {
        fromDate: date,
      },
      () => console.log(this.state.startDate)
    );
  };

  handleChangeToDate = (date) => {
    this.setState(
      {
        toDate: date,
      },
      () => console.log(this.state.toDate)
    );
  };

  /*================================
      Render Current Date and Time
  ==================================*/

  renderCurrentDate = () => {
    const myDate = dateFns.format(this.state.currentMonth, "MMMM YYYY");
    return myDate;
  };

  renderCurrentTime = () => {
    const myDate = dateFns.format(this.state.currentMonth, "HH:mm aa");
    return myDate;
  };

  /*================================
        form events
  =================================*/

  handleSubmit = (e) => {
    e.preventDefault();
    console.log(this.state);
    // alert(this.state.leadsWorkInCompanyName);
  };

  handleChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  };

  /*********************************
   * @DESC - RENDER NEXT, PREVIOUS
   * @DESC - AND CURRENT MONTH
   ********************************/
  renderHeaderCells = () => {
    const { calenderView } = this.state;
    return (
      <Fragment>
        {/* <table className="calender-month-slider mb-0" style={{ width: "100%" }}>
          <tbody>
            <tr>
              <td>
                <button
                  onClick={() =>
                    this.setState({
                      currentMonth: dateFns.subMonths(
                        this.state.currentMonth,
                        1
                      ),
                    })
                  }
                >
                  <i className="fa fa-arrow-left" />
                </button>
                {dateFns.format(this.state.currentMonth, "MMMM YYYY")}
                <button
                  onClick={() =>
                    this.setState({
                      currentMonth: dateFns.addMonths(
                        this.state.currentMonth,
                        1
                      ),
                    })
                  }
                >
                  <i className="fa fa-arrow-right" />
                </button>
              </td>
            </tr>
          </tbody>
        </table> */}

        <div className="calender-month-slider w-100 mt-0">
          <div className="day-and-date-view">
            <div className="current-date-time">
              <h3>{this.renderCurrentDate()}</h3>
              {/* <p>{this.renderCurrentTime()}</p> */}
            </div>
            <div className="current-date-time">
              {/* <CalenderAddLeave /> */}
            </div>
          </div>
        </div>
      </Fragment>
    );
  };

  renderDotsInDays = (formattedDateFollowUpData) => {
    console.log(formattedDateFollowUpData);
    let leave = false;
    let meeting = false;
    let holiday = false;
    formattedDateFollowUpData.forEach((ele) => {
      // console.log(ele);
      if (
        ele.leaveType === "PAID_LEAVE" ||
        ele.leaveType === "UNPAID_LEAVE" ||
        ele.leaveType === "SICK_LEAVE"
      ) {
        leave = true;
      }
      if (ele.leaveType === "HOLIDAY") {
        holiday = true;
      }
      if (ele.subject !== undefined) {
        meeting = true;
      }
    });
    return (
      <div className="calender-dot-section">
        {" "}
        <span
          className={
            leave === true ? "event-name followup_dot_color" : "hidden_dot"
          }
        >
          .
          {/* <img
            src={require("./../../../assets/img/calendar-new/followup_dot.png")}
            alt={""}
          /> */}
        </span>{" "}
        <span
          className={
            holiday === true ? "event-name holiday_dot_color" : "hidden_dot"
          }
        >
          .
          {/* <img
            src={require("./../../../assets/img/calendar-new/holidays_dot.png")}
            alt={""}
          /> */}
        </span>{" "}
        <span
          className={
            meeting === true ? "event-name meeting_dot_color" : "hidden_dot"
          }
        >
          .
          {/* <img
            src={require("./../../../assets/img/calendar-new/meetings_dot.png")}
            alt={""}
          /> */}
        </span>{" "}
      </div>
    );
  };

  /*********************************
   * @DESC - RENDER DATE CELLS
   *********************************/
  renderCells = () => {
    let allFollowups = this.state.displayCalenderData;
    // console.log(allFollowups);

    //console.log(absentDays,attendanceDays);
    const { currentMonth } = this.state;
    const monthStart = dateFns.startOfMonth(currentMonth);
    const monthEnd = dateFns.endOfMonth(monthStart);
    const startDate = dateFns.startOfWeek(monthStart);
    const endDate = dateFns.endOfWeek(monthEnd);

    const dateFormat = "D";
    const rows = [];

    let days = [];
    let day = startDate;
    let formattedDate = "";

    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        let iterationDayYear = dateFns.getYear(day);
        let activeYear = dateFns.getYear(Date.now());

        let iterationDayMonth = dateFns.getMonth(day);
        let activeMonth = dateFns.getMonth(Date.now());
        let calenderActiveMonth = dateFns.getMonth(currentMonth);
        formattedDate = dateFns.format(day, dateFormat);
        let formattedDateFollowUpData = [];

        !isEmpty(allFollowups) &&
          Object.keys(allFollowups).forEach((key) => {
            if (
              key === formattedDate &&
              iterationDayMonth === activeMonth &&
              activeYear === iterationDayYear
            ) {
              formattedDateFollowUpData = allFollowups[key];
              return null;
            }
          });
        // console.log("formated data", formattedDateFollowUpData);
        days.push(
          <td
            onClick={this.openClickOnDay(
              formattedDateFollowUpData,
              day,
              formattedDate
            )}
            key={day}
            className={
              this.getTodaysDateTrueFalse(formattedDate) &&
              iterationDayMonth === activeMonth &&
              activeYear === iterationDayYear
                ? "current-date-border"
                : // : formattedDateFollowUpData.length !== 0
                // ? "follo-up-border"
                iterationDayMonth !== calenderActiveMonth
                ? "dates dayDisabled"
                : "dates"
            }
          >
            {formattedDate}
            <div className="calender-dot-outer-section">
              {formattedDateFollowUpData.length !== 0 ? (
                <>{this.renderDotsInDays(formattedDateFollowUpData)}</>
              ) : null}
            </div>
            {/* {formattedDateFollowUpData.length !== 0 ? ( */}
            {/* <div className="event-name"> */}
            {/* . */}
            {/* <p
                  onClick={this.goToDayViewHandler(
                    formattedDateFollowUpData,
                    day,
                    formattedDate
                  )}
                >
                  .
                </p> */}
            {/* </div> */}
            {/* ) : null} */}
          </td>
        );
        day = dateFns.addDays(day, 1);
      }
      rows.push(<tr key={day}>{days}</tr>);
      days = [];
    }
    const dateFormats = "ddd";
    const daysname = [];

    let startDay = dateFns.startOfWeek(this.state.currentMonth);
    for (let i = 0; i < 7; i++) {
      daysname.push(
        <td key={i} className="text-center days_name">
          {dateFns.format(dateFns.addDays(startDay, i), dateFormats)}
        </td>
      );
    }
    return (
      <div className="table_responsive calender-date-section">
        <table className="table table-bordered my_calender_background">
          <tbody>
            <tr>{daysname}</tr>
            {rows}
          </tbody>
        </table>
      </div>
    );
  };

  /*=================================
          Render Day View
  ==================================*/

  renderDayView = () => {
    var settings = {
      dots: false,
      infinite: true,
      speed: 500,
      slidesToShow: 7,
      slidesToScroll: 7,
    };

    const { currentMonth } = this.state;
    const monthStart = dateFns.startOfMonth(currentMonth);
    const monthEnd = dateFns.endOfMonth(monthStart);
    const startDate = dateFns.startOfWeek(monthStart);
    const endDate = dateFns.endOfWeek(monthEnd);

    const dateFormat = "D";
    const rows = [];

    let days = [];
    let day = startDate;
    let formattedDate = "";

    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        formattedDate = dateFns.format(day, dateFormat);
        days.push(<div className="dates">{formattedDate}</div>);
        day = dateFns.addDays(day, 1);
      }
      rows.push(<div key={day}>{days}</div>);
      // days = [];
    }
    return (
      <div className="container day-view-container">
        <Slider {...settings}>
          {days.map((day, index) => {
            return day;
          })}
        </Slider>
      </div>
    );
  };

  /*===================================
      Get Date is todays date or not
  ====================================*/

  getTodaysDateTrueFalse = (day) => {
    const { currentMonth } = this.state;
    let todayDate = dateFns.format(currentMonth, "D");
    if (day == todayDate) {
      return true;
    }
    return false;
  };

  openClickOnDay = (data, day, formattedDate) => (e) => {
    this.props.getAllDataOfTheDay(
      formattedDate,
      dateFns.format(this.state.currentMonth, "M"),
      dateFns.format(new Date(), "YYYY")
    );
    store.dispatch({
      type: SET_SELECTED_DATE,
      payload: day.toISOString(),
    });
  };

  render() {
    let currentYear = dateFns.format(new Date(), "YYYY");
    let currentDate = dateFns.format(new Date(), "D");
    let newdate = new Date(currentYear, 11, currentDate);
    // console.log(newdate);

    const { calenderView } = this.state;
    // console.log(this.state.displayCalenderData);
    return (
      <Fragment>
        <div>
          {this.renderHeaderCells()}
          {calenderView ? this.renderCells() : this.renderDayView()}
        </div>
      </Fragment>
    );
  }
}

const mapStateToProps = (state) => ({
  displayCalenderData: state.calender.displayCalenderData,
});

export default connect(mapStateToProps, { getAllDataOfTheDay })(
  DisplayCalender
);
