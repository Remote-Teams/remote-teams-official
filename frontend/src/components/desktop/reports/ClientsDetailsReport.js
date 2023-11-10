import React, { Component } from "react";
import ReportsTabPanelTitle from "./ReportsTabPanelTitle";
import ClientsDetailsReportDoughnutChart from "./ClientsDetailsReportDoughnutChart";
import ClientsDetailsReportPieCharRevenue from "./ClientsDetailsReportPieCharRevenue";
import ClientsDetailsReportPieChartProjectSummary from "./ClientsDetailsReportPieChartProjectSummary";
import isEmpty from "../../../store/validations/is-empty";

import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-alpine.css";
import ClientsDetailsRevenueGeneratedBarGraph from "./ClientsDetailsRevenueGeneratedBarGraph";
import ClientsDetailsProjectSummaryBarGraph from "./ClientsDetailsProjectSummaryBarGraph";
import { connect } from "react-redux";
import {
  getCompositionOfClients,
  getTotalClientCount,
  getRevenueGeneratedTillDate,
  getTotalNumberOfTasksTillDate,
  getClientDetailReportTableData,
} from "./../../../store/actions/reportAction";
import dateFns from "date-fns";

const dummyData = [1, 2, 3, 4, 5, 6];

export class ClientsDetailsReport extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // ag-grid table
      hasSetTableData: false,
      columnDefs: [
        {
          headerName: "CLIENT NAME",
          field: "CLIENT_NAME",
          width: 110,
        },
        {
          headerName: "PROJECT COUNT",
          field: "PROJECT_COUNT",
          width: 100,
        },
        {
          headerName: "GOT ON BOARD",
          field: "GOT_ON_BOARD",
          width: 90,
        },
        {
          headerName: "STATUS",
          field: "STATUS",
          width: 100,
        },
        {
          headerName: "REVENUE FROM CLIENT ($)",
          field: "REVENUE_FROM_CLIENT",
          width: 200,
        },
        {
          headerName: "NO OF TICKETS RAISED",
          field: "NO_OF_TICKETS_RAISED",
          width: 150,
        },
        {
          headerName: "OPEN TICKETS",
          field: "OPEN_TICKETS",
          width: 120,
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
      !isEmpty(nextProps.compositionOfClients) &&
      nextProps.compositionOfClients !== nextState.compositionOfClients
    ) {
      return {
        compositionOfClients: nextProps.compositionOfClients,
      };
    }
    if (
      !isEmpty(nextProps.totalClientsCount) &&
      nextProps.totalClientsCount !== nextState.totalClientsCount
    ) {
      return {
        totalClientsCount: nextProps.totalClientsCount,
      };
    }
    if (
      !isEmpty(nextProps.clientDetailReportTableData) &&
      nextProps.clientDetailReportTableData !==
        nextState.clientDetailReportTableData
    ) {
      let finalArray = [];
      let filterData = nextProps.clientDetailReportTableData.forEach(
        (element) => {
          let object = {
            CLIENT_NAME: element.clientName,
            PROJECT_COUNT: element.projects,
            GOT_ON_BOARD: dateFns.format(element.onboard, "Do MMM"),
            STATUS: element.status,
            REVENUE_FROM_CLIENT: element.revenue,
            NO_OF_TICKETS_RAISED: element.ticketsRaised,
            OPEN_TICKETS: element.openTickets,
          };

          finalArray.push(object);
        }
      );
      // console.log(finalArray);

      return {
        leavesReportTableData: nextProps.clientDetailReportTableData,
        rowData: finalArray,
      };
    }

    return null;
  }

  componentDidMount() {
    this.props.getCompositionOfClients();
    this.props.getTotalClientCount();
    this.props.getRevenueGeneratedTillDate();
    this.props.getTotalNumberOfTasksTillDate();
    this.props.getClientDetailReportTableData();
    window.scrollTo(0, 0);
  }

  /*============================================================
      handlers
  ============================================================*/

  handleOnClickDownload = () => {
    console.log("clicked on download");
  };

  /*============================================================
      renderCompositionCard
  ============================================================*/
  renderCompositionCard = () => {
    const { compositionOfClients, totalClientsCount } = this.state;
    return (
      <div className="reports-card reports-card--timesheet-row2 reports-card--timesheet-row2--clients">
        <ClientsDetailsReportDoughnutChart
          chartData={
            !isEmpty(compositionOfClients) && compositionOfClients.chartData
          }
        />
        <div className="row mx-0 flex-nowrap reports-card-timesheet-row2__textBlock1Row pt-10">
          <div>
            <h4 className="reports-card-timesheet-row2__count" title="20">
              {!isEmpty(compositionOfClients) &&
                compositionOfClients.activeClientCount}
            </h4>
            <p className="font-18-bold-space-light-uppercase">ACTIVE</p>
          </div>
          <div className="reports-card-timesheet-row2__border-right"></div>
          <div>
            <h4 className="reports-card-timesheet-row2__count" title="12">
              {!isEmpty(compositionOfClients) &&
                compositionOfClients.inactiveClientCount}
            </h4>
            <p className="font-18-bold-space-light-uppercase">INACTIVE</p>
          </div>
        </div>
        <div className="reports-card-timesheet-row2__textBlock2Row">
          <h4 className="reports-card-timesheet-row2__count" title="32">
            {!isEmpty(totalClientsCount) && totalClientsCount.count}
          </h4>
          <p className="font-18-bold-space-light-uppercase">TOTAL CLIENTS</p>
        </div>
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
  //         <table className="finances-table finances-table--reportClients">
  //           <thead>
  //             <tr>
  //               <th>
  //                 <span>Client name</span>
  //               </th>
  //               <th>
  //                 <span>project name</span>
  //               </th>
  //               <th>
  //                 <span>got on board</span>
  //               </th>
  //               <th>
  //                 <span>STATUS</span>
  //               </th>
  //               <th>
  //                 <span>revenue from client ($)</span>
  //               </th>
  //               <th>
  //                 <span>No of tickets raised</span>
  //               </th>
  //               <th>
  //                 <span>Open tickets</span>
  //               </th>
  //             </tr>
  //           </thead>
  //         </table>
  //       </div>
  //       <div className="finances-table-tbody finances-table-tbody--invoice">
  //         <table className="finances-table finances-table--reportClients">
  //           <tbody>
  //             {!isEmpty(dummyData) ? (
  //               dummyData.map((invoice, index) => (
  //                 <tr key={index}>
  //                   <td>
  //                     <span>Jane Doe</span>
  //                   </td>
  //                   <td>
  //                     <span>Project-1</span>
  //                   </td>
  //                   <td>
  //                     <span>meteor</span>
  //                   </td>
  //                   <td>
  //                     <span>Phase-1</span>
  //                   </td>
  //                   <td>
  //                     <span>120</span>
  //                   </td>
  //                   <td>
  //                     <span>230</span>
  //                   </td>
  //                   <td>
  //                     <span>120</span>
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
    // console.log(this.state.clientDetailReportTableData);
    return (
      <>
        <ReportsTabPanelTitle
          title="Clients Details Report"
          onClick={this.handleOnClickDownload}
        />
        <div className="row mx-0 flex-nowrap mb-50">
          <div>
            <h3 className="font-18-bold font-18-bold--client-details-reports-text1 row reports-circle-icon-text mx-0 mb-20">
              <img
                //src={require("../../../assets/img/reports/circle-icons/light-blue-circle-icon.svg")}
                src={require("../../../assets/img/reports/circle-icons/light-orange-gradient-circle.svg")}
                alt=""
                className="reports-circle-icon"
              />
              <span>Composition of All Clients</span>
            </h3>
            {this.renderCompositionCard()}
          </div>
          <div>
            <h3 className="font-18-bold font-18-bold--client-details-reports-text2 row reports-circle-icon-text mx-0 mb-20">
              <img
                //src={require("../../../assets/img/reports/circle-icons/orange-circle-icon.svg")}
                src={require("../../../assets/img/reports/circle-icons/purple-gradient-circle-icon.svg")}
                alt=""
                className="reports-circle-icon"
              />
              Revenue generated
            </h3>
            <div className="reports-card reports-card--timesheet-row2 reports-card--timesheet-row2--bar-graph-div">
              {/* <ClientsDetailsReportPieCharRevenue /> */}
              <ClientsDetailsRevenueGeneratedBarGraph />
            </div>
          </div>
          <div>
            <h3 className="font-18-bold font-18-bold--client-details-reports-text3 row reports-circle-icon-text mx-0 mb-20">
              <img
                //src={require("../../../assets/img/reports/circle-icons/blue-circle-icon.svg")}
                src={require("../../../assets/img/reports/circle-icons/light-green-gradient-circle-icon.svg")}
                alt=""
                className="reports-circle-icon"
              />
              Projects summary
            </h3>
            <div className="reports-card reports-card--timesheet-row2 reports-card--timesheet-row2--bar-graph-div">
              {/* <ClientsDetailsReportPieChartProjectSummary /> */}
              <ClientsDetailsProjectSummaryBarGraph />
            </div>
          </div>
        </div>

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
  compositionOfClients: state.reports.compositionOfClients,
  totalClientsCount: state.reports.totalClientsCount,
  clientDetailReportTableData: state.reports.clientDetailReportTableData,
});

export default connect(mapStateToProps, {
  getCompositionOfClients,
  getTotalClientCount,
  getRevenueGeneratedTillDate,
  getTotalNumberOfTasksTillDate,
  getClientDetailReportTableData,
})(ClientsDetailsReport);
