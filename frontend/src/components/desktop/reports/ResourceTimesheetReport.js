import React, { Component } from "react";
import ReportsTabPanelTitle from "./ReportsTabPanelTitle";
import isEmpty from "../../../store/validations/is-empty";
import DatepickerFromTo from "../common/DatepickerFromTo";
import ResourceTimesheetReportBarGraph from "./ResourceTimesheetReportBarGraph";
import ResourceTimesheetReportDoughnutChart from "./ResourceTimesheetReportDoughnutChart";
import ResourceTimesheetReportSummaryCard from "./ResourceTimesheetReportSummaryCard";
import { connect } from "react-redux";
import {
  getResourceTypeDistributionChartCount,
  getResourceTypeDistributionChartPercent,
  getResourceSummary,
  getAvUtilizationRate,
  getResourceTimesheetTableData,
} from "./../../../store/actions/reportAction";

import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-alpine.css";
const imgPath = "/img/add-new-role-icon-options";

const dummyData = [1, 2, 3, 4, 5, 6];

export class ResourceTimesheetReport extends Component {
  constructor(props) {
    super(props);
    this.state = {
      startDate: new Date(),
      endDate: new Date(),
      // ag-grid table
      columnDefs: [
        {
          headerName: "MEMBER NAME",
          field: "MEMBER_NAME",
          width: 100,
        },
        {
          headerName: "MEMBER TYPE",
          field: "MEMBER_TYPE",
          //width: 150,
          width: 100,
        },
        {
          headerName: "COST PER HOUR($)",
          field: "COST_PER_HOUR",
          width: 150,
        },
        {
          headerName: "HOURS AVAILABLE",
          field: "HOURS_AVAILABLE",
          //width: 150,
          width: 130,
        },
        {
          headerName: "HOURS SCHEDULED",
          field: "HOURS_SCHEDULED",
          //width: 150,
          width: 130,
        },
        {
          headerName: "UTILIZATION RATE(%)",
          field: "UTILIZATION_RATE",
          //width: 150,
          width: 150,
        },
        {
          headerName: "TASK EFFICIENCY (%)",
          field: "TASK_EFFICIENCY",
          //width: 170,
          width: 150,
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
      !isEmpty(nextProps.resourceSummary) &&
      nextProps.resourceSummary !== nextState.resourceSummary
    ) {
      return {
        resourceSummary: nextProps.resourceSummary,
      };
    }
    if (
      !isEmpty(nextProps.avgUtilizationRate) &&
      nextProps.avgUtilizationRate !== nextState.avgUtilizationRate
    ) {
      return {
        avgUtilizationRate: nextProps.avgUtilizationRate,
      };
    }
    if (
      !isEmpty(nextProps.resourceTimesheetReportTableData) &&
      nextProps.resourceTimesheetReportTableData !==
        nextState.resourceTimesheetReportTableData
    ) {
      let finalArray = [];
      let filterData = nextProps.resourceTimesheetReportTableData.forEach(
        (element) => {
          let object = {
            MEMBER_NAME: element.membername,
            MEMBER_TYPE: element.membertype,
            COST_PER_HOUR:
              element.costperhour === null ? "N/A" : element.costperhour,
            HOURS_AVAILABLE:
              element.hrsavailable === null ? "N/A" : element.hrsavailable,
            HOURS_SCHEDULED:
              element.hoursscheduled === null ? "N/A" : element.hoursscheduled,
            UTILIZATION_RATE:
              element.utilizedpercent === (null || undefined)
                ? "N/A"
                : element.utilizedpercent,
            TASK_EFFICIENCY:
              element.efficiencypercent === null
                ? "N/A"
                : element.efficiencypercent,
          };

          finalArray.push(object);
        }
      );
      // console.log(finalArray);

      return {
        resourceTimesheetReportTableData:
          nextProps.resourceTimesheetReportTableData,
        rowData: finalArray,
      };
    }
    return null;
  }

  componentDidMount() {
    window.scrollTo(0, 0);
    // this.props.getResourceTypeDistributionChartCount();
    this.props.getResourceTypeDistributionChartPercent();
    this.props.getResourceSummary();
    this.props.getAvUtilizationRate();
    this.props.getResourceTimesheetTableData();
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
  //         <table className="finances-table finances-table--reportResource">
  //           <thead>
  //             <tr>
  //               <th>
  //                 <span>member name</span>
  //               </th>
  //               <th>
  //                 <span>member type</span>
  //               </th>
  //               <th>
  //                 <span>Cost per hour($)</span>
  //               </th>
  //               <th>
  //                 <span>hours available</span>
  //               </th>
  //               <th>
  //                 <span>Hours scheduled</span>
  //               </th>
  //               <th>
  //                 <span>utilization rate(%)</span>
  //               </th>
  //               <th>
  //                 <span>Task efficiency (%)</span>
  //               </th>
  //             </tr>
  //           </thead>
  //         </table>
  //       </div>
  //       <div className="finances-table-tbody finances-table-tbody--invoice">
  //         <table className="finances-table finances-table--reportResource">
  //           <tbody>
  //             {!isEmpty(dummyData) ? (
  //               dummyData.map((invoice, index) => (
  //                 <tr key={index}>
  //                   <td>
  //                     <span>Jane Doe</span>
  //                   </td>
  //                   <td>
  //                     <span>Full time</span>
  //                   </td>
  //                   <td>
  //                     <span>10</span>
  //                   </td>
  //                   <td>
  //                     <span>45</span>
  //                   </td>
  //                   <td>
  //                     <span>46</span>
  //                   </td>
  //                   <td>
  //                     <span>80</span>
  //                   </td>
  //                   <td>
  //                     <span>80</span>
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
    const { resourceSummary, avgUtilizationRate } = this.state;

    let fullTimeResourceSummary =
      !isEmpty(resourceSummary) &&
      resourceSummary.filter((summary) => summary._id === "FULLTIME");
    let freelancerResourceSummary =
      !isEmpty(resourceSummary) &&
      resourceSummary.filter((summary) => summary._id === "FREELANCER");
    let onContractResourceSummary =
      !isEmpty(resourceSummary) &&
      resourceSummary.filter((summary) => summary._id === "CONTRACTUAL");

    let fullTimeAvgUtilization =
      !isEmpty(avgUtilizationRate) &&
      avgUtilizationRate.filter(
        (utilization) => utilization.type === "FULLTIME"
      );
    let freelancerAvgUtilization =
      !isEmpty(avgUtilizationRate) &&
      avgUtilizationRate.filter(
        (utilization) => utilization.type === "FREELANCER"
      );
    let onContractAvgUtilization =
      !isEmpty(avgUtilizationRate) &&
      avgUtilizationRate.filter(
        (utilization) => utilization.type === "CONTRACTUAL"
      );

    let totalAvailbaleHours = 0;
    let totalUtilizedHours = 0;

    let oveall =
      !isEmpty(avgUtilizationRate) &&
      avgUtilizationRate.forEach((element) => {
        if (element.availableHours) {
          totalAvailbaleHours =
            totalAvailbaleHours + parseInt(element.availableHours);
        }
        if (element.utilizedHours) {
          totalUtilizedHours =
            totalUtilizedHours + parseInt(element.utilizedHours);
        }
      });

    console.log(totalAvailbaleHours);

    console.log(totalUtilizedHours);

    let overAllUtilizedPercent = 0;
    if (totalAvailbaleHours !== 0 && totalAvailbaleHours !== 0) {
      overAllUtilizedPercent = (totalUtilizedHours / totalAvailbaleHours) * 100;
    } else {
      overAllUtilizedPercent = 0;
    }

    // console.log(overAllUtilizedPercent);

    return (
      <>
        <ReportsTabPanelTitle
          title="Resource Timesheet Report"
          onClick={this.handleOnClickDownload}
        />

        {/* row 1 */}
        <div className="mb-30">
          <h4 className="font-18-bold font-18-bold--reports-resource-text1 row mx-0 reports-circle-icon-text mb-20">
            <img
              src={require("../../../assets/img/reports/circle-icons/light-blue-gradient-circle-icon.svg")}
              alt=""
              className="reports-circle-icon"
            />
            Resource Type Distribution Charts
          </h4>
          <div className="row mx-0 flex-nowrap">
            <div className="reports-card reports-card--timesheet-row1-colm1">
              <ResourceTimesheetReportBarGraph />
            </div>
            <div className="reports-card reports-card--timesheet-row1-colm2">
              <ResourceTimesheetReportDoughnutChart />
            </div>
          </div>
        </div>

        {/* row 2 */}
        <div>
          <h4 className="font-18-bold font-18-bold--reports-resource-text2 row mx-0 reports-circle-icon-text mb-20">
            <img
              src={require("../../../assets/img/reports/circle-icons/light-blue-gradient-circle-2.svg")}
              alt=""
              className="reports-circle-icon"
            />
            Resource Summary
          </h4>
          <div className="row mx-0 flex-nowrap">
            <ResourceTimesheetReportSummaryCard
              imgPath={`${imgPath}/nr-1.png`}
              title="fulltime"
              resources={
                !isEmpty(fullTimeResourceSummary) &&
                fullTimeResourceSummary !== false
                  ? fullTimeResourceSummary[0].count
                  : 0
              }
              hoursSpent={
                !isEmpty(fullTimeResourceSummary) &&
                fullTimeResourceSummary !== false
                  ? fullTimeResourceSummary[0].hoursWorked
                  : 0
              }
              monthlyCost={
                !isEmpty(fullTimeResourceSummary) &&
                fullTimeResourceSummary !== false
                  ? fullTimeResourceSummary[0].cost
                  : 0
              }
            />
            <div className="resource-timesheet-summary-card-freelancer-contract-div">
              <ResourceTimesheetReportSummaryCard
                //imgPath={require("../../../assets/img/dummy/client-without-border.svg")}
                imgPath={`${imgPath}/nr-3.png`}
                title="freelancer"
                resources={
                  !isEmpty(freelancerResourceSummary) &&
                  freelancerResourceSummary !== false
                    ? freelancerResourceSummary[0].count
                    : 0
                }
                hoursSpent={
                  !isEmpty(freelancerResourceSummary) &&
                  freelancerResourceSummary !== false
                    ? freelancerResourceSummary[0].hoursWorked
                    : 0
                }
                monthlyCost={
                  !isEmpty(freelancerResourceSummary) &&
                  freelancerResourceSummary !== false
                    ? freelancerResourceSummary[0].cost
                    : 0
                }
              />
            </div>
            <div className="resource-timesheet-summary-card-freelancer-contract-div">
              <ResourceTimesheetReportSummaryCard
                //imgPath={require("../../../assets/img/dummy/on-contract-without-border.svg")}
                imgPath={`${imgPath}/nr-5.png`}
                title="on contract"
                resources={
                  !isEmpty(onContractResourceSummary) &&
                  onContractResourceSummary !== false
                    ? onContractResourceSummary[0].count
                    : 0
                }
                hoursSpent={
                  !isEmpty(onContractResourceSummary) &&
                  onContractResourceSummary !== false
                    ? onContractResourceSummary[0].hoursWorked
                    : 0
                }
                monthlyCost={
                  !isEmpty(onContractResourceSummary) &&
                  onContractResourceSummary !== false
                    ? onContractResourceSummary[0].cost
                    : 0
                }
              />
            </div>
          </div>
        </div>

        {/* row 3 */}
        <div>
          <h4 className="font-18-bold font-18-bold--reports-resource-text3 row reports-circle-icon-text mx-0 ">
            <img
              src={require("../../../assets/img/reports/circle-icons/light-orange-gradient-circle.svg")}
              alt=""
              className="reports-circle-icon"
            />
            Average Utilization rate of Resources
          </h4>
          <div className="row mx-0 flex-nowrap reports-timesheet-row3">
            <div className="reports-card reports-card--timesheet-row3">
              <h3 className="font-18-bold-space-light-uppercase">Overall</h3>
              <p className="overview-percent-gradient-text">
                {!isEmpty(overAllUtilizedPercent) &&
                overAllUtilizedPercent !== NaN
                  ? overAllUtilizedPercent
                  : 0}{" "}
                %
              </p>
            </div>
            <div className="reports-card reports-card--timesheet-row3">
              <h3 className="font-18-bold-space-light-uppercase">Full Time</h3>
              <p className="overview-percent-gradient-text">
                {!isEmpty(fullTimeAvgUtilization) &&
                fullTimeAvgUtilization !== false
                  ? fullTimeAvgUtilization[0].utilizationPercent
                  : 0}
                %
              </p>
            </div>
            <div className="reports-card reports-card--timesheet-row3">
              <h3 className="font-18-bold-space-light-uppercase">
                Freelancers
              </h3>
              {/** overview-percent-gradient-text-opacity-1 */}
              <p className="overview-percent-gradient-text">
                {!isEmpty(freelancerAvgUtilization) &&
                freelancerAvgUtilization !== false
                  ? freelancerAvgUtilization[0].utilizationPercent
                  : 0}
                %
              </p>
            </div>
            <div className="reports-card reports-card--timesheet-row3">
              <h3 className="font-18-bold-space-light-uppercase">
                On Contract
              </h3>
              <p className="overview-percent-gradient-text">
                {!isEmpty(onContractAvgUtilization) &&
                onContractAvgUtilization !== false
                  ? onContractAvgUtilization[0].utilizationPercent
                  : 0}
                %
              </p>
            </div>
          </div>
        </div>

        {/* row 4 */}
        <div className="reports-timesheet-date-and-table-block">
          {/* {this.renderDateFromTo()} */}
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
        </div>
      </>
    );
  }
}

const mapStateToProps = (state) => ({
  resourceSummary: state.reports.resourceSummary,
  avgUtilizationRate: state.reports.avgUtilizationRate,
  resourceTimesheetReportTableData:
    state.reports.resourceTimesheetReportTableData,
});

export default connect(mapStateToProps, {
  getResourceTypeDistributionChartCount,
  getResourceTypeDistributionChartPercent,
  getResourceSummary,
  getAvUtilizationRate,
  getResourceTimesheetTableData,
})(ResourceTimesheetReport);
