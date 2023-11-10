import React, { Component } from "react";
import isEmpty from "../../../store/validations/is-empty";
import DatepickerFromTo from "../common/DatepickerFromTo";
import ReportsTabPanelTitle from "./ReportsTabPanelTitle";
import SupportSummaryReportBarGraphMonth from "./SupportSummaryReportBarGraphMonth";
import SupportSummaryReportBarGraphTillDate from "./SupportSummaryReportBarGraphTillDate";
import SupportSummaryReportPieChart from "./SupportSummaryReportPieChart";
import { connect } from "react-redux";
import {
  ticketSummaryTillDate,
  ticketSummaryThisMonth,
  getTicketSummaryTableReport,
  ticketRaisedChart,
  getNumberOfTicketsRaisedByReasonChart,
} from "./../../../store/actions/reportAction";
import { startOfMonth, endOfMonth } from "date-fns";

import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-alpine.css";
import dateFns from "date-fns";
const dummyData = [1, 2, 3, 4, 5, 6];

export class SupportSummaryReport extends Component {
  constructor(props) {
    super(props);
    this.state = {
      startDate: startOfMonth(new Date()),
      endDate: endOfMonth(new Date()),
      hasSetTableData: false,
      // ag-grid table
      columnDefs: [
        {
          headerName: "PROJECT NAME",
          field: "PROJECT_NAME",
        },
        {
          headerName: "PRIORITY",
          field: "PRIORITY",
        },
        {
          headerName: "TYPE",
          field: "TYPE",
        },
        {
          headerName: "ASSIGNED TO",
          field: "ASSIGNED_TO",
        },
        {
          headerName: "RAISED BY",
          field: "RAISED_BY",
        },
        {
          headerName: "OPENED ON",
          field: "OPENED_ON",
        },
        {
          headerName: "STATUS",
          field: "STATUS",
        },
      ],
      rowData: [],
    };
  }

  /*=================================================================
      lifecycle methods
  ==================================================================*/
  static getDerivedStateFromProps(nextProps, nextState) {
    if (
      !isEmpty(nextProps.ticketSummaryTableData) &&
      nextProps.ticketSummaryTableData !== nextState.ticketSummaryTableData
    ) {
      let finalArray = [];
      let filterData = nextProps.ticketSummaryTableData.forEach((element) => {
        let object = {
          PROJECT_NAME: element.projectdata[0].name,
          PRIORITY: element.priority,
          TYPE: element.type,
          ASSIGNED_TO: element.assigndata[0].name,
          RAISED_BY: element.raisedata[0].name,
          OPENED_ON: dateFns.format(element.createdAt, "do MMM"),
          STATUS: element.status,
        };

        finalArray.push(object);
      });
      // console.log(finalArray);
      return {
        ticketSummaryTableData: nextProps.ticketSummaryTableData,
        rowData: finalArray,
      };
    }
    return null;
  }

  componentDidUpdate() {
    if (
      this.props.ticketSummaryTableData !== this.state.ticketSummaryTableData &&
      !this.state.hasSetTableData
    ) {
      if (!isEmpty(this.props.ticketSummaryTableData)) {
        let finalArray = [];
        let filterData = this.props.ticketSummaryTableData.forEach(
          (element) => {
            let object = {
              PROJECT_NAME: element.projectdata[0].name,
              PRIORITY: element.priority,
              TYPE: element.type,
              ASSIGNED_TO: element.assigndata[0].name,
              RAISED_BY: element.raisedata[0].name,
              OPENED_ON: dateFns.format(element.toDate, "do MMM"),
              STATUS: element.status,
            };

            finalArray.push(object);
          }
        );
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
    window.scrollTo(0, 0);
    // this.props.ticketSummaryTillDate();
    this.props.ticketSummaryThisMonth();
    //   2020-07-01T03:09:42.971Z
    // 2020-07-28T03:09:42.971Z

    this.props.getTicketSummaryTableReport(
      startOfMonth(new Date()).toISOString(),
      endOfMonth(new Date()).toISOString()
    );
    this.props.ticketRaisedChart();
    this.props.getNumberOfTicketsRaisedByReasonChart();
  }

  /*============================================================
      handlers
  ============================================================*/

  handleOnClickDownload = () => {
    console.log("clicked on download");
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

    this.props.getTicketSummaryTableReport(
      this.state.startDate.toISOString(),
      this.state.endDate.toISOString()
    );
  };

  renderDateFromTo = () => {
    return (
      <div className="datepicker-no-border datepicker-no-border--expenses">
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
  //         <table className="finances-table finances-table--reportSupport">
  //           <thead>
  //             <tr>
  //               <th>
  //                 <span>resource name</span>
  //               </th>
  //               <th>
  //                 <span>current assigned tasks</span>
  //               </th>
  //               <th>
  //                 <span>assigned to projects</span>
  //               </th>
  //               <th>
  //                 <span>next available on</span>
  //               </th>
  //               <th>
  //                 <span>next available from</span>
  //               </th>
  //             </tr>
  //           </thead>
  //         </table>
  //       </div>
  //       <div className="finances-table-tbody finances-table-tbody--invoice">
  //         <table className="finances-table finances-table--reportSupport">
  //           <tbody>
  //             {!isEmpty(dummyData) ? (
  //               dummyData.map((invoice, index) => (
  //                 <tr key={index}>
  //                   <td>
  //                     <span>Jane Doe</span>
  //                   </td>
  //                   <td>
  //                     <span>3</span>
  //                   </td>
  //                   <td>
  //                     <span>3</span>
  //                   </td>
  //                   <td>
  //                     <span>30th May</span>
  //                   </td>
  //                   <td>
  //                     <span>16:00 PM</span>
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
    // console.log(this.state.ticketSummaryTableData);

    return (
      <>
        <ReportsTabPanelTitle
          title="Support Summary Report"
          onClick={this.handleOnClickDownload}
        />
        <div className="row mx-0 flex-nowrap mb-20">
          <div>
            <div className="mb-30">
              <h3 className="font-18-bold font-18-bold--support-summary-reports-text1 row reports-circle-icon-text flex-shrink-0 mx-0 pt-10 pr-30">
                <img
                  //src={require("../../../assets/img/reports/circle-icons/pink-circle-icon.svg")}
                  src={require("../../../assets/img/reports/circle-icons/light-green-gradient-circle-icon.svg")}
                  alt=""
                  className="reports-circle-icon"
                />
                Ticket summary this month
              </h3>
              <div className="reports-card reports-card--support-summary-report-card">
                <SupportSummaryReportBarGraphMonth />
              </div>
            </div>
            <div className="mb-30">
              <h3 className="font-18-bold font-18-bold--support-summary-reports-text2 row reports-circle-icon-text flex-shrink-0 mx-0 pt-10 pr-30">
                <img
                  //src={require("../../../assets/img/reports/circle-icons/light-blue-circle-icon.svg")}
                  src={require("../../../assets/img/reports/circle-icons/pink-gradient-circle-icon.svg")}
                  alt=""
                  className="reports-circle-icon"
                />
                Ticket summary till date
              </h3>
              <div className="reports-card reports-card--support-summary-report-card">
                <SupportSummaryReportBarGraphTillDate />
              </div>
            </div>
          </div>
          <div className="mb-30">
            <h3 className="font-18-bold font-18-bold--support-summary-reports-text3 row reports-circle-icon-text flex-shrink-0 mx-0 pt-10 pr-30">
              <img
                //src={require("../../../assets/img/reports/circle-icons/blue-circle-icon.svg")}
                src={require("../../../assets/img/reports/circle-icons/light-green-gradient-circle-icon.svg")}
                alt=""
                className="reports-circle-icon"
              />
              No of Tickets Raised by Reason
            </h3>
            <div className="reports-card reports-card--support-summary-report-card2">
              <SupportSummaryReportPieChart />
            </div>
          </div>
        </div>
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
  ticketSummaryTableData: state.reports.ticketSummaryTableData,
});

export default connect(mapStateToProps, {
  ticketSummaryTillDate,
  ticketSummaryThisMonth,
  getTicketSummaryTableReport,
  ticketRaisedChart,
  getNumberOfTicketsRaisedByReasonChart,
})(SupportSummaryReport);
