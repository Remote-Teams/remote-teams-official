import React, { Component } from "react";
import Select from "react-select";
import ReportsTabPanelTitle from "./ReportsTabPanelTitle";
import DatepickerFromTo from "../common/DatepickerFromTo";
import InvoicesReportDoughnutChart from "./InvoicesReportDoughnutChart";
import isEmpty from "../../../store/validations/is-empty";
import { connect } from "react-redux";
import {
  getTotalInvoicedAmountTillDate,
  totalInvoicesCount,
  getDueInvoiceAmount,
  getDistributionChartData,
  getInvoiceTableData,
} from "./../../../store/actions/reportAction";

import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-alpine.css";
import dateFns from "date-fns";
import { startOfMonth, endOfMonth } from "date-fns";

const options = [
  { value: "All Invoices", label: "All Invoices" },
  { value: "My Invoices", label: "My Invoices" },
];

const dummyData = [1, 2, 3, 4, 5, 6];

export class InvoicesReport extends Component {
  constructor(props) {
    super(props);
    this.state = {
      startDate: startOfMonth(new Date()),
      endDate: endOfMonth(new Date()),
      optionSelected: options[0],
      hasSetTableData: false,
      // ag-grid table
      columnDefs: [
        {
          headerName: "ID",
          field: "ID",
          width: 80,
          //width: 70,
        },
        {
          headerName: "INVOICED TO",
          field: "INVOICED_TO",
          width: 150,
          //width: 100,
        },
        {
          headerName: "PROJECT NAME",
          field: "PROJECT_NAME",
          //width: 150,
          width: 100,
        },
        {
          headerName: "TITLE",
          field: "TITLE",
          width: 100,
          //width: 80,
        },
        {
          headerName: "DATE",
          field: "DATE",
          width: 100,
          //width: 90,
        },
        {
          headerName: "AMOUNT INVOICED ($)",
          field: "AMOUNT_INVOICED",
          width: 150,
          //width: 130,
        },
        {
          headerName: "AMOUNT RECEIVED ON",
          field: "AMOUNT_RECEIVED_ON",
          width: 150,
          //width: 130,
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
      !isEmpty(nextProps.totalPaidAndTotalInvoicedAmount) &&
      nextProps.totalPaidAndTotalInvoicedAmount !==
        nextState.totalPaidAndTotalInvoicedAmount
    ) {
      return {
        totalPaidAndTotalInvoicedAmount:
          nextProps.totalPaidAndTotalInvoicedAmount,
      };
    }
    if (
      !isEmpty(nextProps.totalNumberOfInvoices) &&
      nextProps.totalNumberOfInvoices !== nextState.totalNumberOfInvoices
    ) {
      return {
        totalNumberOfInvoices: nextProps.totalNumberOfInvoices,
      };
    }
    if (
      !isEmpty(nextProps.dueInvoiceAmount) &&
      nextProps.dueInvoiceAmount !== nextState.dueInvoiceAmount
    ) {
      return {
        dueInvoiceAmount: nextProps.dueInvoiceAmount,
      };
    }
    if (
      !isEmpty(nextProps.invoiceReportTableData) &&
      nextProps.invoiceReportTableData !== nextState.invoiceReportTableData
    ) {
      let finalArray = [];
      let filterData = nextProps.invoiceReportTableData.forEach((element) => {
        let object = {
          ID: element.invoice_number,
          INVOICED_TO: element.clientdata[0].name,
          PROJECT_NAME: "Meteor",
          TITLE: "Phase-1",
          DATE: dateFns.format(element.createdAt, "DD/MM/YYYY"),
          AMOUNT_INVOICED: element.total,
          AMOUNT_RECEIVED_ON: dateFns.format(element.dateRaised, "DD/MM/YYYY"),
        };

        finalArray.push(object);
      });
      return {
        invoiceReportTableData: nextProps.invoiceReportTableData,
        rowData: finalArray,
      };
    }
    return null;
  }

  componentDidUpdate() {
    if (
      this.props.invoiceReportTableData !== this.state.invoiceReportTableData &&
      !this.state.hasSetTableData
    ) {
      // console.log(this.props.leavesReportTableData);
      if (!isEmpty(this.props.invoiceReportTableData)) {
        let finalArray = [];
        let filterData = this.props.invoiceReportTableData.forEach(
          (element) => {
            let object = {
              ID: element.invoice_number,
              INVOICED_TO: element.clientdata[0].name,
              PROJECT_NAME: "Meteor",
              TITLE: "Phase-1",
              DATE: dateFns.format(element.createdAt, "DD/MM/YYYY"),
              AMOUNT_INVOICED: element.total,
              AMOUNT_RECEIVED_ON: dateFns.format(
                element.dateRaised,
                "DD/MM/YYYY"
              ),
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
    this.props.getTotalInvoicedAmountTillDate();
    this.props.totalInvoicesCount();
    this.props.getDueInvoiceAmount();
    this.props.getDistributionChartData();
    this.props.getInvoiceTableData(
      startOfMonth(new Date()).toISOString(),
      endOfMonth(new Date()).toISOString()
    );
  }

  /*============================================================
      handlers
  ============================================================*/

  handleOnClickDownload = () => {
    console.log("clicked on download");
  };

  handleChangeSelectProject = (selectedOption) => {
    this.setState({ optionSelected: selectedOption });
  };

  /*============================================================
      renderRow1
  ============================================================*/
  renderRow1 = () => {
    const {
      totalPaidAndTotalInvoicedAmount,
      totalNumberOfInvoices,
    } = this.state;
    return (
      <div className="row mx-0">
        <div className="col-12 pl-0 mb-10">
          <div className="row mx-0 flex-nowrap align-items-center">
            <h3 className="font-18-bold font-18-bold--reports-invoice-text1 row reports-circle-icon-text flex-shrink-0 mx-0 pt-10 pr-30">
              {/*<img
                src={require("../../../assets/img/reports/circle-icons/blue-circle-icon.svg")}
                alt=""
                className="reports-circle-icon"
              />*/}
              {/*report-expense-font-36-extrabold font-46-semiBold*/}
              Total number of invoices
            </h3>
            <p className="report-expense-font-36-extrabold word-break-word">
              {!isEmpty(totalNumberOfInvoices)
                ? totalNumberOfInvoices.count
                : 0}
            </p>
          </div>
        </div>
        <div className="col-12 pl-0 mb-10">
          <div className="row mx-0 flex-nowrap align-items-center">
            <h3 className="font-18-bold font-18-bold--reports-invoice-text2 color-white row align-items-start reports-circle-icon-text flex-shrink-0 mx-0 pt-10 pr-30">
              {/*<img
                src={require("../../../assets/img/reports/circle-icons/green-circle-icon.svg")}
                alt=""
                className="reports-circle-icon mt-1"
              />*/}
              Total invoiced amount till date($)
            </h3>
            <p className="report-expense-font-36-extrabold word-break-word">
              {!isEmpty(totalPaidAndTotalInvoicedAmount)
                ? totalPaidAndTotalInvoicedAmount[0].totalInvAmt
                : 0}
            </p>
          </div>
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

    this.props.getInvoiceTableData(
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
      renderColm1Row1
  ============================================================*/
  renderColm1Row1 = () => {
    const { totalPaidAndTotalInvoicedAmount, dueInvoiceAmount } = this.state;
    return (
      <div className="row mx-0">
        <div className="col-12 pl-0 mb-10">
          <div className="row mx-0 flex-nowrap align-items-center">
            <h3 className="font-18-bold font-18-bold--reports-invoice-text3 row reports-circle-icon-text flex-shrink-0 mx-0 pt-10 pr-30">
              {/*<img
                src={require("../../../assets/img/reports/circle-icons/orange-circle-icon.svg")}
                alt=""
                className="reports-circle-icon"
              />*/}
              paid invoiced amount($)
            </h3>
            <p className="report-expense-font-36-extrabold word-break-word">
              {!isEmpty(totalPaidAndTotalInvoicedAmount)
                ? totalPaidAndTotalInvoicedAmount[0].totalPaidAmt
                : 0}
            </p>
          </div>
        </div>
        <div className="col-12 pl-0 mb-10">
          <div className="row mx-0 flex-nowrap align-items-center">
            <h3 className="font-18-bold font-18-bold--reports-invoice-text4 color-white row reports-circle-icon-text flex-shrink-0 mx-0 pt-10 pr-30">
              {/*<img
                src={require("../../../assets/img/reports/circle-icons/pink-circle-icon.svg")}
                alt=""
                className="reports-circle-icon"
              />*/}
              due invoice amount($)
            </h3>
            <p className="report-expense-font-36-extrabold word-break-word">
              {!isEmpty(dueInvoiceAmount) ? dueInvoiceAmount[0].totalamount : 0}
            </p>
          </div>
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
  //         <table className="finances-table finances-table--reportInvoices">
  //           <thead>
  //             <tr>
  //               <th>
  //                 <span>id</span>
  //               </th>
  //               <th>
  //                 <span>
  //                   invoiced
  //                   <br /> to
  //                 </span>
  //               </th>
  //               <th>
  //                 <span>
  //                   project <br />
  //                   name
  //                 </span>
  //               </th>
  //               <th>
  //                 <span>title</span>
  //               </th>
  //               <th>
  //                 <span>date</span>
  //               </th>
  //               <th>
  //                 <span>
  //                   amount <br /> invoiced ($)
  //                 </span>
  //               </th>
  //               <th>
  //                 <span>
  //                   amount <br /> received on
  //                 </span>
  //               </th>
  //             </tr>
  //           </thead>
  //         </table>
  //       </div>
  //       <div className="finances-table-tbody finances-table-tbody--invoice">
  //         <table className="finances-table finances-table--reportInvoices">
  //           <tbody>
  //             {!isEmpty(dummyData) ? (
  //               dummyData.map((invoice, index) => (
  //                 <tr key={index}>
  //                   <td>
  //                     <span>0121</span>
  //                   </td>
  //                   <td>
  //                     <span>Jane Doe</span>
  //                   </td>
  //                   <td>
  //                     <span>meteor</span>
  //                   </td>
  //                   <td>
  //                     <span>Phase-1</span>
  //                   </td>
  //                   <td>
  //                     <span>12/12/12</span>
  //                   </td>
  //                   <td>
  //                     <span>230</span>
  //                   </td>
  //                   <td>
  //                     <span>12/12/12</span>
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
    // console.log(this.state.invoiceReportTableData);
    return (
      <>
        <ReportsTabPanelTitle
          title="Invoices Report"
          onClick={this.handleOnClickDownload}
        />
        <div className="row mx-0  mb-30">
          <div className="col-7 pl-0">
            {this.renderRow1()}
            {this.renderColm1Row1()}
          </div>
          <div className="col-5 px-0">
            <h3 className="font-18-bold font-18-bold--reports-invoice-text5 color-white row reports-circle-icon-text mx-0 mt-20 mb-20">
              <img
                //src={require("../../../assets/img/reports/circle-icons/light-blue-circle-icon.svg")}
                src={require("../../../assets/img/reports/circle-icons/invoice-report-circle-icon.svg")}
                alt=""
                className="reports-circle-icon"
              />
              Distribution of Number
            </h3>
            <div className="reports-card reports-card--tasks-status-graph">
              <InvoicesReportDoughnutChart />
            </div>
          </div>
        </div>
        {/* row 3 */}
        <div className="row mx-0 align-items-baseline">
          <Select
            className="react-select-container react-select-container--report-expense-and-income mr-30"
            classNamePrefix="react-select-elements"
            value={this.state.optionSelected}
            onChange={this.handleChangeSelectProject}
            options={options}
            placeholder="Select"
            isSearchable={false}
          />
          {this.renderDateFromTo()}
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
  totalPaidAndTotalInvoicedAmount:
    state.reports.totalPaidAndTotalInvoicedAmount,
  totalNumberOfInvoices: state.reports.totalNumberOfInvoices,
  dueInvoiceAmount: state.reports.dueInvoiceAmount,
  invoiceReportTableData: state.reports.invoiceReportTableData,
});

export default connect(mapStateToProps, {
  getTotalInvoicedAmountTillDate,
  totalInvoicesCount,
  getDueInvoiceAmount,
  getDistributionChartData,
  getInvoiceTableData,
})(InvoicesReport);
