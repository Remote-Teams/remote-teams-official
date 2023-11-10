import React, { Component } from "react";
import Select from "react-select";
import isEmpty from "../../../store/validations/is-empty";
import DatepickerFromTo from "../common/DatepickerFromTo";
import ReportsTabPanelTitle from "./ReportsTabPanelTitle";
import ExpenseAndIncomeReportBarGraph from "./ExpenseAndIncomeReportBarGraph";
import { connect } from "react-redux";
import {
  getTotalExpenseThisMonth,
  getTotalPaidInvoiceThisMonth,
  getTotalSubscriptionCostThisMonth,
  getTotalBilledAndUnbilledExpanseThisMonth,
  getExpenseData,
  paidInvoicesIssuedByMonth,
  getExpanseVsIncomeTableData,
} from "./../../../store/actions/reportAction";
import { getAllProjectAction } from "./../../../store/actions/projectAction";

import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-alpine.css";
import dateFns from "date-fns";
import { startOfMonth, endOfMonth } from "date-fns";

// const projectOptions = [
//   { value: "Project 1", label: "Project 1" },
//   { value: "Project 2", label: "Project 2" },
//   { value: "Project 3", label: "Project 3" },
//   { value: "Project 4", label: "Project 4" },
// ];

const dummyData = [1, 2, 3, 4, 5, 6];

export class ExpenseAndIncomeReport extends Component {
  constructor() {
    super();
    this.state = {
      projectSelected: "",
      projectOptions: [],
      startDate: startOfMonth(new Date()),
      endDate: endOfMonth(new Date()),
      hasSetTableData: false,
      // ag-grid table
      columnDefs: [
        {
          headerName: "NAME",
          field: "NAME",
          //width: 100,
          width: 150,
        },
        {
          headerName: "TITLE",
          field: "TITLE",
          //width: 100,
          width: 140,
        },
        {
          headerName: "TYPE",
          field: "TYPE",
          //width: 80,
          width: 100,
        },
        {
          headerName: "DATE",
          field: "DATE",
          //width: 80,
          width: 100,
        },
        {
          headerName: "SUBTOTAL($)",
          field: "SUBTOTAL",
          //width: 100,
          width: 150,
        },
        {
          headerName: "TAX($)",
          field: "TAX",
          //width: 80,
          width: 100,
        },
        {
          headerName: "TOTAL($)",
          field: "TOTAL",
          //width: 100,
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
      !isEmpty(nextProps.totalExpenseThisMonth) &&
      nextProps.totalExpenseThisMonth !== nextState.totalExpenseThisMonth
    ) {
      return {
        totalExpenseThisMonth: nextProps.totalExpenseThisMonth,
      };
    }
    if (
      !isEmpty(nextProps.totalBilledAndUnbilledExpenseThisMonth) &&
      nextProps.totalBilledAndUnbilledExpenseThisMonth !==
        nextState.totalBilledAndUnbilledExpenseThisMonth
    ) {
      return {
        totalBilledAndUnbilledExpenseThisMonth:
          nextProps.totalBilledAndUnbilledExpenseThisMonth,
      };
    }
    if (
      !isEmpty(nextProps.totalIncomeThisMonth) &&
      nextProps.totalIncomeThisMonth !== nextState.totalIncomeThisMonth
    ) {
      return {
        totalIncomeThisMonth: nextProps.totalIncomeThisMonth,
      };
    }
    if (
      !isEmpty(nextProps.totalSubscriptionCostThisMonth) &&
      nextProps.totalSubscriptionCostThisMonth !==
        nextState.totalSubscriptionCostThisMonth
    ) {
      return {
        totalSubscriptionCostThisMonth:
          nextProps.totalSubscriptionCostThisMonth,
      };
    }
    if (
      !isEmpty(nextProps.expenseVsIncomeTableData) &&
      nextProps.expenseVsIncomeTableData !== nextState.expenseVsIncomeTableData
    ) {
      let finalArray = [];
      let filterData = nextProps.expenseVsIncomeTableData.forEach((element) => {
        let object = {
          NAME: element.payee_name,
          TITLE: element.expenseTitle,
          TYPE: element.BillingType,
          DATE: dateFns.format(element.createdAt, "DD/MM/YYYY"),
          SUBTOTAL: element.subTotal,
          TAX: element.totalTax,
          TOTAL: element.total,
        };

        finalArray.push(object);
      });
      return {
        expenseVsIncomeTableData: nextProps.expenseVsIncomeTableData,
        rowData: finalArray,
      };
    }

    if (
      !isEmpty(nextProps.allProjects) &&
      nextProps.allProjects !== nextState.allProjects &&
      !nextState.hasProjectSet
    ) {
      // console.log(nextProps.allProjects);
      nextProps.getExpanseVsIncomeTableData(
        "",
        startOfMonth(new Date()).toISOString(),
        endOfMonth(new Date()).toISOString()
      );
      let newArray =
        !isEmpty(nextProps.allProjects) &&
        nextProps.allProjects.map((project) => ({
          value: project._id,
          label: project.name,
        }));

      newArray.push({ value: "All Projects", label: "All Projects" });
      return {
        projectOptions: newArray,
        projectSelected: { value: "All Projects", label: "All Projects" },
        hasProjectSet: true,
      };
    }

    return null;
  }

  componentDidUpdate() {
    if (this.props.totalIncomeThisMonth !== this.state.totalIncomeThisMonth) {
      this.setState({
        totalIncomeThisMonth: this.props.totalIncomeThisMonth,
      });
    }
    if (
      this.props.totalSubscriptionCostThisMonth !==
      this.state.totalSubscriptionCostThisMonth
    ) {
      this.setState({
        totalSubscriptionCostThisMonth: this.props
          .totalSubscriptionCostThisMonth,
      });
    }
    if (
      this.props.expenseVsIncomeTableData !==
        this.state.expenseVsIncomeTableData &&
      !this.state.hasSetTableData
    ) {
      // console.log(this.props.leavesReportTableData);
      if (!isEmpty(this.props.expenseVsIncomeTableData)) {
        let finalArray = [];
        let filterData = this.props.expenseVsIncomeTableData.forEach(
          (element) => {
            let object = {
              NAME: element.payee_name,
              DESC: "Project",
              TYPE: element.BillingType,
              DATE: dateFns.format(element.createdAt, "DD/MM/YYYY"),
              SUBTOTAL: element.subTotal,
              TAX: element.totalTax,
              TOTAL: element.total,
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
    this.props.getTotalExpenseThisMonth();
    this.props.getTotalPaidInvoiceThisMonth();
    this.props.getTotalSubscriptionCostThisMonth();
    this.props.getTotalBilledAndUnbilledExpanseThisMonth();
    this.props.getExpenseData();

    this.props.getAllProjectAction();
  }

  /*============================================================
      handlers
  ============================================================*/

  handleOnClickDownload = () => {
    console.log("clicked on download");
  };

  handleChangeSelectProject = (selectedOption) => {
    this.setState({ projectSelected: selectedOption });
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
    const { projectSelected } = this.state;
    this.setState({
      hasSetTableData: false,
    });

    if (projectSelected.value === "All Projects") {
      this.props.getExpanseVsIncomeTableData(
        "",
        this.state.startDate.toISOString(),
        this.state.endDate.toISOString()
      );
    } else {
      this.props.getExpanseVsIncomeTableData(
        this.state.projectSelected.value,
        this.state.startDate.toISOString(),
        this.state.endDate.toISOString()
      );
    }

    console.log(this.state.projectSelected.value);
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
  //         <table className="finances-table finances-table--reportExpense">
  //           <thead>
  //             <tr>
  //               <th>
  //                 <span>name</span>
  //               </th>
  //               <th>
  //                 <span>desc</span>
  //               </th>
  //               <th>
  //                 <span>type</span>
  //               </th>
  //               <th>
  //                 <span>date</span>
  //               </th>
  //               <th>
  //                 <span>subtotal($)</span>
  //               </th>
  //               <th>
  //                 <span>TAX($)</span>
  //               </th>
  //               <th>
  //                 <span>total($)</span>
  //               </th>
  //             </tr>
  //           </thead>
  //         </table>
  //       </div>
  //       <div className="finances-table-tbody finances-table-tbody--invoice">
  //         <table className="finances-table finances-table--reportExpense">
  //           <tbody>
  //             {!isEmpty(dummyData) ? (
  //               dummyData.map((invoice, index) => (
  //                 <tr key={index}>
  //                   <td>
  //                     <span>Jane Doe</span>
  //                   </td>
  //                   <td>
  //                     <span>project</span>
  //                   </td>
  //                   <td>
  //                     <span>Billed</span>
  //                   </td>
  //                   <td>
  //                     <span>12/12/12</span>
  //                   </td>
  //                   <td>
  //                     <span>100.00</span>
  //                   </td>
  //                   <td>
  //                     <span>10.00</span>
  //                   </td>
  //                   <td>
  //                     <span>10.00</span>
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
      renderRow1
  ============================================================*/
  renderRow1 = () => {
    const { totalExpenseThisMonth, totalIncomeThisMonth } = this.state;

    return (
      <div className="row mx-0 mb-30">
        <div className="col-6">
          <div className="row mx-0 flex-nowrap align-items-start">
            {/* font-18-bold-space-light-uppercase color-white */}
            <h3 className="font-18-bold font-18-bold--reports-total-expense-text1 mr-30 pt-20 flex-shrink-0">
              Total Expense <br /> this month($)
            </h3>
            <p className="report-expense-font-36-extrabold word-break-word pt-10">
              {!isEmpty(totalExpenseThisMonth)
                ? totalExpenseThisMonth[0].totalamount
                : 0}
            </p>
          </div>
        </div>
        <div className="col-6">
          <div className="row mx-0 flex-nowrap align-items-start">
            <h3 className="font-18-bold font-18-bold--reports-total-expense-text2 mr-30 pt-20 flex-shrink-0">
              Total Income <br /> this month($)
            </h3>
            <p className="report-expense-font-36-extrabold word-break-word pt-10">
              {!isEmpty(totalIncomeThisMonth)
                ? totalIncomeThisMonth[0].totalamount
                : 0}
            </p>
          </div>
        </div>
      </div>
    );
  };

  /*============================================================
      renderRow3
  ============================================================*/
  renderRow3 = () => {
    const {
      totalBilledAndUnbilledExpenseThisMonth,
      totalIncomeThisMonth,
      totalSubscriptionCostThisMonth,
    } = this.state;

    let billedExpense =
      !isEmpty(totalBilledAndUnbilledExpenseThisMonth) &&
      totalBilledAndUnbilledExpenseThisMonth.filter(
        (expense) => expense._id === "BILLABLE"
      );
    let unbilledExpense =
      !isEmpty(totalBilledAndUnbilledExpenseThisMonth) &&
      totalBilledAndUnbilledExpenseThisMonth.filter(
        (expense) => expense._id === "UNBILLABLE"
      );

    // console.log(billedExpense);
    return (
      <>
        <div className="row mx-0 mb-30 pt-20 mt-30">
          <div className="col-6">
            <div className="row mx-0 flex-nowrap align-items-start">
              <h3 className="row mx-0 reports-circle-icon-text font-18-bold font-18-bold--reports-invoice-text1 pr-30 flex-shrink-0">
                {/*<img
                  src={require("../../../assets/img/reports/circle-icons/orange-circle-icon.svg")}
                  alt=""
                  className="reports-circle-icon"
                />*/}
                Total Subscription <br />
                cost this month($)
              </h3>
              <p className="report-expense-font-36-extrabold word-break-word ml-auto pr-10">
                {!isEmpty(totalSubscriptionCostThisMonth)
                  ? totalSubscriptionCostThisMonth
                  : 0}
              </p>
            </div>
          </div>
          <div className="col-6">
            <div className="row mx-0 flex-nowrap align-items-start">
              <h3 className="row mx-0 reports-circle-icon-text font-18-bold font-18-bold--reports-invoice-text2 pr-30 flex-shrink-0">
                {/*<img
                  src={require("../../../assets/img/reports/circle-icons/green-circle-icon.svg")}
                  alt=""
                  className="reports-circle-icon"
                />*/}
                Total Unbilled Expense <br /> this month ($)
              </h3>
              <p className="report-expense-font-36-extrabold word-break-word ml-auto pr-10">
                {!isEmpty(unbilledExpense) && unbilledExpense !== false
                  ? unbilledExpense[0].total
                  : 0}
              </p>
            </div>
          </div>
        </div>
        <div className="row mx-0 mb-50 pb-10">
          <div className="col-6">
            <div className="row mx-0 flex-nowrap align-items-start">
              <h3 className="row mx-0 reports-circle-icon-text font-18-bold font-18-bold--reports-invoice-text3 pr-30 flex-shrink-0">
                {/*<img
                  src={require("../../../assets/img/reports/circle-icons/pink-circle-icon.svg")}
                  alt=""
                  className="reports-circle-icon"
                />*/}
                Total Billed Expense <br /> this month($)
              </h3>
              <p className="report-expense-font-36-extrabold word-break-word ml-auto pr-10">
                {!isEmpty(billedExpense) && billedExpense !== false
                  ? billedExpense[0].total
                  : 0}
              </p>
            </div>
          </div>
          <div className="col-6">
            <div className="row mx-0 flex-nowrap align-items-start">
              <h3 className="row mx-0 reports-circle-icon-text font-18-bold font-18-bold--reports-invoice-text4 pr-30 flex-shrink-0">
                {/*<img
                  src={require("../../../assets/img/reports/circle-icons/blue-circle-icon.svg")}
                  alt=""
                  className="reports-circle-icon"
                />*/}
                Total Paid Invoices <br /> this month ($)
              </h3>
              <p className="report-expense-font-36-extrabold word-break-word ml-auto pr-10">
                {!isEmpty(totalIncomeThisMonth)
                  ? totalIncomeThisMonth[0].totalamount
                  : 0}
              </p>
            </div>
          </div>
        </div>
      </>
    );
  };

  /*============================================================
      main
  ============================================================*/
  render() {
    // console.log(this.state.expenseVsIncomeTableData);
    return (
      <>
        <ReportsTabPanelTitle
          title="Expense &amp; Income Report"
          onClick={this.handleOnClickDownload}
        />
        {this.renderRow1()}
        <div className="reports-card reports-card--expenseAndIncomeGraph">
          <ExpenseAndIncomeReportBarGraph />
        </div>
        {this.renderRow3()}
        <div className="row mx-0 pt-20">
          <Select
            className="react-select-container react-select-container--report-expense-and-income mr-30"
            classNamePrefix="react-select-elements"
            value={this.state.projectSelected}
            onChange={this.handleChangeSelectProject}
            options={this.state.projectOptions}
            placeholder="Project Name"
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
  totalExpenseThisMonth: state.reports.totalExpenseThisMonth,
  totalBilledAndUnbilledExpenseThisMonth:
    state.reports.totalBilledAndUnbilledExpenseThisMonth,
  totalIncomeThisMonth: state.reports.totalIncomeThisMonth,
  totalSubscriptionCostThisMonth: state.reports.totalSubscriptionCostThisMonth,
  expenseVsIncomeTableData: state.reports.expenseVsIncomeTableData,
  allProjects: state.projects.allProjects,
});

export default connect(mapStateToProps, {
  getTotalExpenseThisMonth,
  getTotalPaidInvoiceThisMonth,
  getTotalSubscriptionCostThisMonth,
  getTotalBilledAndUnbilledExpanseThisMonth,
  getExpenseData,
  getExpanseVsIncomeTableData,
  getAllProjectAction,
})(ExpenseAndIncomeReport);
