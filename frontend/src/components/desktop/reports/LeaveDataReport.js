import React, { Component } from "react";
import isEmpty from "../../../store/validations/is-empty";
import DatepickerFromTo from "../common/DatepickerFromTo";
import ReportsTabPanelTitle from "./ReportsTabPanelTitle";
import LeaveDataReportDoughnutChart from "./LeaveDataReportDoughnutChart";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-alpine.css";
import {
  getLeaveDataTable,
  getCompositionOfLeavesTakenThisMonthChart,
  getCompanyDaysOffCount,
  getResourcesWhoAvailedLeavesLastMonth,
} from "./../../../store/actions/reportAction";
import {
  getOnLeaveToday,
  getUpcomingLeaves,
} from "./../../../store/actions/calenderAction";
import { connect } from "react-redux";
import dateFns from "date-fns";
import differenceInCalendarDays from "date-fns/difference_in_calendar_days";
import { startOfMonth, endOfMonth } from "date-fns";

const dummyData = [1, 2, 3, 4, 5, 6];

export class LeaveDataReport extends Component {
  constructor(props) {
    super(props);
    this.state = {
      startDate: startOfMonth(new Date()),
      endDate: endOfMonth(new Date()),
      hasSetTableData: false,
      // ag-grid table
      columnDefs: [
        {
          headerName: "RESOURCE NAME",
          field: "RESOURCE_NAME",
          width: 200,
        },
        {
          headerName: "LEAVE DATES FROM",
          field: "LEAVE_DATES_FROM",
          width: 200,
        },
        {
          headerName: "LEAVES DATE TO",
          field: "LEAVES_DATE_TO",
          width: 200,
        },
        {
          headerName: "STATUS",
          field: "STATUS",
          width: 150,
        },
        {
          headerName: "TYPE",
          field: "TYPE",
          width: 100,
        },
      ],
      rowData: [],
      lastMonthLeavesTakenByUsers: [],
    };
  }

  /*=================================================================
      lifecycle methods
  ==================================================================*/
  static getDerivedStateFromProps(nextProps, nextState) {
    if (
      !isEmpty(nextProps.leavesReportTableData) &&
      nextProps.leavesReportTableData !== nextState.leavesReportTableData
    ) {
      let finalArray = [];
      let filterData = nextProps.leavesReportTableData.forEach((element) => {
        let object = {
          RESOURCE_NAME: "Jane Doe",
          LEAVE_DATES_FROM: dateFns.format(element.fromDate, "DD/MM/YYYY"),
          LEAVES_DATE_TO: dateFns.format(element.toDate, "DD/MM/YYYY"),
          STATUS: element.leaveStatus,
          TYPE: element.leaveType,
        };

        finalArray.push(object);
      });
      // console.log(finalArray);

      return {
        leavesReportTableData: nextProps.leavesReportTableData,
        rowData: finalArray,
      };
    }
    if (
      !isEmpty(nextProps.onLeaveToday) &&
      nextProps.onLeaveToday !== nextState.onLeaveToday
    ) {
      return {
        onLeaveToday: nextProps.onLeaveToday,
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
      !isEmpty(nextProps.totalComapnyDayOffs) &&
      nextProps.totalComapnyDayOffs !== nextState.totalComapnyDayOffs
    ) {
      return {
        totalComapnyDayOffs: nextProps.totalComapnyDayOffs,
      };
    }
    if (
      !isEmpty(nextProps.lastMonthLeavesTakenByUsers) &&
      nextProps.lastMonthLeavesTakenByUsers !==
        nextState.lastMonthLeavesTakenByUsers
    ) {
      return {
        lastMonthLeavesTakenByUsers: nextProps.lastMonthLeavesTakenByUsers,
      };
    }

    return null;
  }

  componentDidUpdate() {
    if (
      this.props.leavesReportTableData !== this.state.leavesReportTableData &&
      !this.state.hasSetTableData
    ) {
      // console.log(this.props.leavesReportTableData);
      if (!isEmpty(this.props.leavesReportTableData)) {
        let finalArray = [];
        let filterData = this.props.leavesReportTableData.forEach((element) => {
          let object = {
            RESOURCE_NAME: "Jane Doe",
            LEAVE_DATES_FROM: dateFns.format(element.fromDate, "DD/MM/YYYY"),
            LEAVES_DATE_TO: dateFns.format(element.toDate, "DD/MM/YYYY"),
            STATUS: element.leaveStatus,
            TYPE: element.leaveType,
          };

          finalArray.push(object);
        });
        this.setState({
          rowData: finalArray,
          hasSetTableData: true,
        });
      } else {
        this.setState({
          rowData: [],
          hasSetTableData: true,
        });
      }
    }
  }

  componentDidMount() {
    this.props.getLeaveDataTable(
      startOfMonth(new Date()).toISOString(),
      endOfMonth(new Date()).toISOString()
    );
    this.props.getOnLeaveToday();
    this.props.getUpcomingLeaves();
    this.props.getCompositionOfLeavesTakenThisMonthChart();
    this.props.getCompanyDaysOffCount();
    this.props.getResourcesWhoAvailedLeavesLastMonth();
    window.scrollTo(0, 0);
  }

  /*============================================================
      handlers
  ============================================================*/

  handleOnClickDownload = () => {
    console.log("clicked on download");
  };

  /*============================================================
      renderRow1
  ============================================================*/
  renderRow1 = () => {
    const { onLeaveToday, totalComapnyDayOffs } = this.state;
    return (
      <div className="row mx-0 flex-nowrap reports-card-leaveDataRow1">
        <div>
          <h3 className="font-18-bold font-18-bold--leave-data-text1 row reports-circle-icon-text mx-0">
            <img
              //src={require("../../../assets/img/reports/circle-icons/pink-circle-icon.svg")}
              src={require("../../../assets/img/reports/circle-icons/light-blue-gradient-circle-icon.svg")}
              alt=""
              className="reports-circle-icon"
            />
            Resources on leave today
          </h3>
          <div className="reports-card reports-card--leaveDataRow1Card1">
            <div className="reports-card--leaveDataRow1Card1__overflow row mx-0">
              {!isEmpty(onLeaveToday) &&
                onLeaveToday.map((data, index) => (
                  <div key={index} className="leaveDataRow1Card1-img-text-div">
                    <div className="leaveDataRow1Card1-img-div">
                      <img
                        src={require("../../../assets/img/dummy/new-profile-without-border.png")}
                        //src={require("../../../assets/img/dummy/resource-without-border.svg")}
                        alt="person"
                        className="leaveDataRow1Card1-img"
                      />
                    </div>
                    <p className="leaveDataRow1Card1-text">{data.user.name}</p>
                  </div>
                ))}
            </div>
          </div>
        </div>
        <div>
          <h3 className="font-18-bold font-18-bold--leave-data-text2 row reports-circle-icon-text mx-0">
            <img
              //src={require("../../../assets/img/reports/circle-icons/light-orange-circle-icon.svg")}
              src={require("../../../assets/img/reports/circle-icons/gradient-green-circle-icon.svg")}
              alt=""
              className="reports-circle-icon"
            />
            Total company dayoffs
          </h3>
          <div className="reports-card reports-card--leaveDataRow1Card2">
            <div className="report-leave-data-purple-circle">
              <span className="report-leave-data-purple-circle__text">
                {!isEmpty(totalComapnyDayOffs) && totalComapnyDayOffs.count}
              </span>
            </div>
          </div>
        </div>
        <div>
          <h3 className="font-18-bold font-18-bold--leave-data-text3 row flex-nowrap reports-circle-icon-text mx-0">
            <img
              //src={require("../../../assets/img/reports/circle-icons/light-green-circle-icon.svg")}
              src={require("../../../assets/img/reports/circle-icons/gradient-blue-circle-icon.svg")}
              alt=""
              className="reports-circle-icon"
            />
            {/* leaves taken this month distribution */}
            {/*Composition of leaves taken this month*/}
            Leaves taken this month
          </h3>
          <div className="reports-card reports-card--leaveDataRow1Card3">
            <LeaveDataReportDoughnutChart />
          </div>
        </div>
      </div>
    );
  };

  /*============================================================
      renderRow2
  ============================================================*/
  renderResourceCard = (dummyData) => {
    const { lastMonthLeavesTakenByUsers } = this.state;
    return (
      <div className="reports-card reports-card--leaveDataRow2Card1">
        <div className="reports-card--leaveDataRow2Card1__overflow">
          {!isEmpty(lastMonthLeavesTakenByUsers) &&
            lastMonthLeavesTakenByUsers.map((data, index) => (
              <div
                key={index}
                className="row mx-0 flex-nowrap align-items-center leaveDataRow2Card1__row"
              >
                <div className="leaveDataRow1Card1-img-div">
                  {/*<img
                  src={require("../../../assets/img/dummy/resource-without-border.svg")}
                  alt="person"
                  className="leaveDataRow2Card1-img"
                />*/}
                </div>
                <div className="leaveDataRow2Card1__textColm1 flex-shrink-0">
                  <h4 className="font-18-bold-space-light-uppercase">
                    {data.user.name}
                  </h4>
                  <p className="leaveDataRow2Card1__text">{data.leaveType}</p>
                </div>
                <div className="leaveDataRow2Card1__textColm2">
                  <h4 className="leaveDataRow2Card1__textColm2-text1 pb-10">
                    23-01 to 25-01
                  </h4>
                  <p className="font-24-bold leaveDataRow2Card1__textColm2-text2">
                    2 Days
                  </p>
                </div>
              </div>
            ))}
        </div>
      </div>
    );
  };

  /*============================================================
      renderRow2
  ============================================================*/
  renderResourceCardUpcomingLeaves = (dummyData) => {
    const { upcomingLeaves } = this.state;

    let resourcesWithUpcomingLeaves =
      !isEmpty(upcomingLeaves) &&
      upcomingLeaves.filter((leave) => leave.leaveType !== "HOLIDAY");

    // console.log(resourcesWithUpcomingLeaves);
    return (
      <div className="reports-card reports-card--leaveDataRow2Card1">
        <div className="reports-card--leaveDataRow2Card1__overflow">
          {!isEmpty(resourcesWithUpcomingLeaves) &&
            resourcesWithUpcomingLeaves !== false &&
            resourcesWithUpcomingLeaves.map((data, index) => (
              <div
                key={index}
                className="row mx-0 flex-nowrap align-items-center leaveDataRow2Card1__row"
              >
                <div className="leaveDataRow1Card1-img-div">
                  {/*<img
                    src={require("../../../assets/img/dummy/resource-without-border.svg")}
                    alt="person"
                    className="leaveDataRow2Card1-img"
                  />*/}
                </div>
                <div className="leaveDataRow2Card1__textColm1 flex-shrink-0">
                  <h4 className="font-18-bold-space-light-uppercase">
                    {data.user.name}
                  </h4>
                  <p className="leaveDataRow2Card1__text">Annual leave</p>
                </div>
                <div className="leaveDataRow2Card1__textColm2">
                  <h4 className="leaveDataRow2Card1__textColm2-text1 pb-10">
                    {dateFns.format(data.fromDate, "DD-MM")} to{" "}
                    {dateFns.format(data.toDate, "DD-MM")}
                  </h4>
                  <p className="font-24-bold leaveDataRow2Card1__textColm2-text2">
                    {differenceInCalendarDays(
                      new Date(data.toDate),
                      new Date(data.fromDate)
                    )}
                  </p>
                </div>
              </div>
            ))}
        </div>
      </div>
    );
  };
  renderRow2 = () => {
    return (
      <div className="row mx-0 flex-nowrap reports-card-leaveDataRow1">
        <div>
          <h3 className="font-18-bold font-18-bold--leave-data-text4 row reports-circle-icon-text mx-0">
            <img
              //src={require("../../../assets/img/reports/circle-icons/light-yellow-circle-icon.svg")}
              src={require("../../../assets/img/reports/circle-icons/light-orange-gradient-circle.svg")}
              alt=""
              className="reports-circle-icon"
            />
            Resources who availed leaves last month
          </h3>
          {this.renderResourceCard(dummyData)}
        </div>
        <div>
          <h3 className="font-18-bold font-18-bold--leave-data-text5 row reports-circle-icon-text mx-0">
            <img
              //src={require("../../../assets/img/reports/circle-icons/light-orange-circle-icon.svg")}
              src={require("../../../assets/img/reports/circle-icons/purple-gradient-circle-icon.svg")}
              alt=""
              className="reports-circle-icon"
            />
            Resources with upcoming leaves
          </h3>
          {this.renderResourceCardUpcomingLeaves(dummyData)}
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
    console.log("clicked on arrow icon");
    this.setState({
      hasSetTableData: false,
    });
    this.props.getLeaveDataTable(
      this.state.startDate.toISOString(),
      this.state.endDate.toISOString()
    );
  };

  renderDateFromTo = () => {
    return (
      <div className="datepicker-no-border  datepicker-no-border--expenses">
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
  // renderTable = () => {
  //   return (
  //     <>
  //       <div className="finances-table-thead">
  //         <table className="finances-table finances-table--reportLeaveData">
  //           <thead>
  //             <tr>
  //               <th>
  //                 <span>
  //                   resource <br /> name
  //                 </span>
  //               </th>
  //               <th>
  //                 <span>
  //                   leave dates <br />
  //                   from
  //                 </span>
  //               </th>
  //               <th>
  //                 <span>
  //                   leaves date <br />
  //                   to
  //                 </span>
  //               </th>
  //               <th>
  //                 <span>status</span>
  //               </th>
  //               <th>
  //                 <span>type</span>
  //               </th>
  //             </tr>
  //           </thead>
  //         </table>
  //       </div>
  //       <div className="finances-table-tbody finances-table-tbody--invoice">
  //         <table className="finances-table finances-table--reportLeaveData">
  //           <tbody>
  //             {!isEmpty(dummyData) ? (
  //               dummyData.map((invoice, index) => (
  //                 <tr key={index}>
  //                   <td>
  //                     <span>Jane Doe</span>
  //                   </td>
  //                   <td>
  //                     <span>12/12/12</span>
  //                   </td>
  //                   <td>
  //                     <span>12/12/12</span>
  //                   </td>
  //                   <td>
  //                     <span>pending approval</span>
  //                   </td>
  //                   <td>
  //                     <span>medical</span>
  //                   </td>
  //                 </tr>
  //               ))
  //             ) : (
  //               <tr>
  //                 <td colSpan={0} className="text-center">
  //                   <span className="font-14-semibold table-data-empty-message">
  //                     No data found
  //                   </span>
  //                 </td>
  //               </tr>
  //             )}
  //           </tbody>
  //         </table>
  //       </div>
  //     </>
  //   );
  // };

  /*============================================================
      main
  ============================================================*/
  render() {
    // console.log(this.state.upcomingLeaves);

    return (
      <>
        <ReportsTabPanelTitle
          title="Leave Data Report"
          onClick={this.handleOnClickDownload}
        />
        {this.renderRow1()}
        {this.renderRow2()}
        {this.renderDateFromTo()}
        {/* {this.renderTable()} */}
        <div
          className="ag-theme-alpine-dark ag-grid-custom-table ag-grid-custom-table--reports"
          style={{
            height: "200px",
            width: "100%",
          }}
        >
          <AgGridReact
            columnDefs={this.state.columnDefs}
            rowData={this.state.rowData}
          ></AgGridReact>
        </div>
      </>
    );
  }
}

const mapStateToProps = (state) => ({
  leavesReportTableData: state.reports.leavesReportTableData,
  onLeaveToday: state.calender.onLeaveToday,
  upcomingLeaves: state.calender.upcomingLeaves,
  totalComapnyDayOffs: state.reports.totalComapnyDayOffs,
  lastMonthLeavesTakenByUsers: state.reports.lastMonthLeavesTakenByUsers,
});

export default connect(mapStateToProps, {
  getLeaveDataTable,
  getOnLeaveToday,
  getUpcomingLeaves,
  getCompositionOfLeavesTakenThisMonthChart,
  getCompanyDaysOffCount,
  getResourcesWhoAvailedLeavesLastMonth,
})(LeaveDataReport);
