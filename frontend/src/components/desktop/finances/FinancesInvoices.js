import React, { Component } from "react";
import { Link } from "react-router-dom";
import Select from "react-select";
import SearchInput from "../common/SearchInput";
import GreenLinkSmallFont from "../common/GreenLinkSmallFont";
import DatepickerFromTo from "../common/DatepickerFromTo";
import FinanceSummaryCard from "../common/FinanceSummaryCard";
import { connect } from "react-redux";
import isEmpty from "../../../store/validations/is-empty";
import { deleteInvoices } from "./../../../store/actions/financeAction";
import dateFns from "date-fns";
import GreenButtonSmallFont from "../common/GreenButtonSmallFont";
import {
  updateInvoice,
  filterInvoices,
  invoiceOverviewTableByDate,
  getAllInvoices,
} from "./../../../store/actions/financeAction";
import { startOfDay, endOfDay } from "date-fns";
import { startOfMonth, endOfMonth } from "date-fns";

const options = [
  { value: "All Invoices", label: "All Invoices" },
  { value: "My Invoices", label: "My Invoices" },
];

const optionsStatus = [
  { value: "Paid", label: "Paid" },
  { value: "Unpaid", label: "Unpaid" },
];

const dummyData = [1, 2, 3, 4, 5];

class FinancesInvoices extends Component {
  constructor() {
    super();
    this.state = {
      isAddNew: false,
      startSummaryDate: startOfMonth(new Date()),
      endSummaryDate: endOfMonth(new Date()),
      selectedOption: options[0],
      searchInput: "",
      startDate: startOfMonth(new Date()),
      endDate: endOfMonth(new Date()),
      selectedOptionStatus: optionsStatus[0],
      allInvoices: {},
    };
  }

  componentDidMount() {
    const formData = {
      from: startOfMonth(new Date()).toISOString(),
      to: endOfMonth(new Date()).toISOString(),
    };

    this.props.invoiceOverviewTableByDate(formData);
  }

  static getDerivedStateFromProps(nextProps, nextState) {
    if (
      !isEmpty(nextProps.allInvoices) &&
      nextProps.allInvoices !== nextState.allInvoices
    ) {
      return {
        allInvoices: nextProps.allInvoices,
      };
    }
    if (
      !isEmpty(nextProps.invoiceTableOverviewCount) &&
      nextProps.invoiceTableOverviewCount !==
        nextState.invoiceTableOverviewCount
    ) {
      return {
        invoiceTableOverviewCount: nextProps.invoiceTableOverviewCount,
      };
    }
    // if (
    //   !isEmpty(nextProps.allClients) &&
    //   nextProps.allClients !== nextState.allClients
    // ) {
    //   return {
    //     allClients: nextProps.allClients,
    //   };
    // }
    return null;
  }

  componentDidUpdate() {
    if (this.props.allInvoices !== this.state.allInvoices) {
      this.setState({
        allInvoices: this.props.allInvoices,
      });
    }
    if (
      this.props.invoiceTableOverviewCount !==
      this.state.invoiceTableOverviewCount
    ) {
      this.setState({
        invoiceTableOverviewCount: this.props.invoiceTableOverviewCount,
      });
    }
    // if (this.props.allClients !== this.state.allClients) {
    //   this.setState({
    //     allClients: this.props.allClients,
    //   });
    // }
  }

  /*============================================================
      handlers
  ============================================================*/

  //    FinanceSummaryCard handlers
  handleChangeSummaryStart = (date) => {
    if (date === null) {
      this.setState({
        startSummaryDate: new Date(),
      });
    } else {
      this.setState({
        startSummaryDate: date,
      });
    }
  };

  handleChangeSummaryEnd = (date) => {
    if (date === null) {
      this.setState({
        endSummaryDate: new Date(),
      });
    } else {
      this.setState({
        endSummaryDate: date,
      });
    }
  };

  handleOnClickSummaryDateArrowIcon = () => {
    console.log("clicked on arrow icon");
    const { startSummaryDate, endSummaryDate } = this.state;

    if (startSummaryDate === endSummaryDate) {
      const formData = {
        from: startOfDay(startSummaryDate).toISOString(),
        to: endOfDay(endSummaryDate).toISOString(),
      };

      this.props.invoiceOverviewTableByDate(formData);
    } else {
      const formData = {
        from: startSummaryDate.toISOString(),
        to: endSummaryDate.toISOString(),
      };

      this.props.invoiceOverviewTableByDate(formData);
    }
  };
  //    FinanceSummaryCard handlers end

  handleChangeDropdown = (selectedOption) => {
    this.setState({ selectedOption });
    console.log(`Option selected:`, selectedOption);
    if (selectedOption.value === "My Invoices") {
      // console.log(selectedOptionStatus);
      const formData = {
        pageNo: 1,
        pageSize: 10,
        query: {
          createdBy: this.props.userData,
        },
      };

      this.props.filterInvoices(formData);
    } else {
      const formData = {
        pageNo: 1,
        pageSize: 10,
        query: {},
      };

      this.props.filterInvoices(formData);
    }
  };

  handleChangeSearchInput = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    });
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
    let newStartDate = startOfDay(this.state.startDate);
    let endStartDate = endOfDay(this.state.endDate);

    const formData = {
      query: {
        $and: [
          { createdAt: { $lte: new Date(endStartDate) } },
          { createdAt: { $gte: new Date(newStartDate) } },
        ],
      },
    };
    this.props.getAllInvoices(formData);
  };

  renderDateFromTo = () => {
    return (
      <div className="datepicker-no-border">
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
      renderButtonAndSearchInput
  ============================================================*/
  renderButtonAndSearchInput = () => {
    const { selectedOption } = this.state;
    return (
      <div className="row mx-0 justify-content-between subscription-btn-search-div">
        <div className="row mx-0">
          {/*<div className="mr-50">
            <Select
              isSearchable={false}
              className="react-select-container react-select-container--finances"
              classNamePrefix="react-select-elements"
              value={selectedOption}
              onChange={this.handleChangeDropdown}
              options={options}
              placeholder="Select"
            />
    </div>*/}
          <div className="pr-50">
            <div
              className={
                this.props.activeWalkthroughPage === "finances-3"
                  ? "new-walkthrough-active-buttton-add-new"
                  : ""
              }
            >
              <GreenLinkSmallFont
                text="Raise Invoice"
                path={{
                  pathname: "/add-invoice",
                  state: {
                    allClients: this.props.allClients,
                  },
                }}
                extraClassName="finances-green-btn"
              />
            </div>
          </div>
        </div>
        <div className="row mx-0">
          {this.renderDateFromTo()}
          <SearchInput
            name="searchInput"
            placeholder="Search"
            onChange={this.handleChangeSearchInput}
            value={this.state.SearchInput}
          />
        </div>
      </div>
    );
  };

  /*============================================================
      renderInvoiceTable
  ============================================================*/
  // handlers
  handleChangeStatusDropdown = (selectedOptionStatus) => {
    this.setState({ selectedOptionStatus });
    console.log(`Option selected:`, selectedOptionStatus);
  };

  handleOnClickDeleteIcon = (invoice) => (e) => {
    console.log(invoice);
    this.props.deleteInvoices(invoice._id);

    // console.log("clicked on delete icon");
  };

  generateClientName = (invoice) => {
    // console.log(invoice);
    const { allClients } = this.props;
    let clientData = !isEmpty(allClients)
      ? allClients.filter((client) => client._id === invoice.client)
      : [];
    // console.log(clientData);
    return !isEmpty(clientData) ? clientData[0].name : "";
  };

  handleOnClickMarkRead = (invoice) => (e) => {
    console.log("clicked mark as read");
    console.log(invoice);
    let formData = invoice;
    formData.status = "PAID";
    formData.datePaid = new Date().toISOString();
    // console.log(formData);
    this.props.updateInvoice(invoice._id, formData);
  };

  // renderInvoiceTable
  renderInvoiceTable = () => {
    const { allInvoices } = this.state;

    let filtereddata = [];
    if (!isEmpty(this.state.searchInput)) {
      let search = new RegExp(this.state.searchInput, "i");
      filtereddata = allInvoices.filter((getall) => {
        if (search.test(getall.name)) {
          console.log(getall);
          return getall;
        }
        // if (search.test(getall.company)) {
        //   return getall;
        // }
        // if (search.test(getall.email)) {
        //   return getall;
        // }
      });
      // console.log(filtereddata);
    } else {
      filtereddata = this.state.allInvoices;
    }
    return (
      <>
        <div className="finances-table-thead">
          <table className="finances-table finances-table--invoice">
            <thead>
              <tr>
                <th>
                  <span>invoice number</span>
                </th>
                {/* <th>
                  <span>title</span>
                </th> */}
                <th>
                  <span>Due date</span>
                </th>
                <th>
                  <span>client</span>
                </th>
                <th>
                  <span>total ($)</span>
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
        <div className="finances-table-tbody finances-table-tbody--invoice">
          <table className="finances-table finances-table--invoice">
            <tbody>
              {!isEmpty(filtereddata) ? (
                filtereddata.map((invoice, index) => (
                  <tr
                    key={index}
                    className={
                      this.props.activeWalkthroughPage === "finances-3" &&
                      index === 0
                        ? "new-walkthrough-active-all-project-card"
                        : ""
                    }
                  >
                    <td>
                      <span>{invoice.invoice_number}</span>
                    </td>
                    {/* <td>
                      <span>DS2</span>
                    </td> */}
                    <td>
                      <span>
                        {dateFns.format(invoice.due_date, "D-MM-YYYY")}{" "}
                      </span>
                    </td>
                    <td>
                      <span>{this.generateClientName(invoice)}</span>
                    </td>
                    <td>
                      <span>{invoice.total}</span>
                    </td>
                    <td>
                      <span className="row mx-0 flex-nowrap align-items-center justify-content-between">
                        <span className="mr-25">{invoice.status}</span>
                        {/* <Select
                        isSearchable={false}
                        className="react-select-container react-select-container--addInvoice"
                        classNamePrefix="react-select-elements"
                        value={this.state.selectedOptionStatus}
                        onChange={this.handleChangeStatusDropdown}
                        options={optionsStatus}
                        placeholder="Select"
                      /> */}
                        {invoice.status === "SENT" && (
                          <GreenButtonSmallFont
                            text="Mark as Paid"
                            onClick={this.handleOnClickMarkRead(invoice)}
                          />
                        )}
                      </span>
                    </td>
                    <td>
                      <span className="row mx-0 flex-nowrap align-items-start">
                        {invoice.status === "DRAFT" && (
                          <>
                            <Link
                              to={{
                                pathname: "/edit-invoice",
                                state: {
                                  allClients: this.props.allClients,
                                  invoiceData: invoice,
                                },
                              }}
                            >
                              <i className="fa fa-pencil finances-table__fa-icon-edit"></i>
                            </Link>
                            <i
                              className="fa fa-trash finances-table__fa-icon-delete"
                              onClick={this.handleOnClickDeleteIcon(invoice)}
                            ></i>
                          </>
                        )}

                        <Link
                          to={{
                            pathname: "/display-invoice",
                            state: {
                              invoiceData: invoice,
                            },
                          }}
                        >
                          <img
                            src={require("../../../assets/img/icons/export-icon.svg")}
                            alt="export"
                            className="finances-table__export-icon-img"
                          />
                        </Link>
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr
                  className={
                    this.props.activeWalkthroughPage === "finances-3"
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
      </>
    );
  };

  /*============================================================
      main
  ============================================================*/
  render() {
    const { invoiceTableOverviewCount, allInvoices } = this.state;

    return (
      <>
        <div className="row mx-0 page-count-row">
          <FinanceSummaryCard
            summaryTitle="invoice summary"
            startSummaryDate={this.state.startSummaryDate}
            endSummaryDate={this.state.endSummaryDate}
            handleChangeSummaryStart={this.handleChangeSummaryStart}
            handleChangeSummaryEnd={this.handleChangeSummaryEnd}
            handleOnClickSummaryDateArrowIcon={
              this.handleOnClickSummaryDateArrowIcon
            }
            dataRow1Colm1="Total Amount"
            dataRow1Colm2={
              !isEmpty(invoiceTableOverviewCount)
                ? invoiceTableOverviewCount.amount
                : 0
            }
            dataRow1Colm3="Amount Paid"
            dataRow1Colm4={
              !isEmpty(invoiceTableOverviewCount)
                ? invoiceTableOverviewCount.paid
                : 0
            }
            dataRow2Colm1="Amount Due"
            dataRow2Colm2={
              !isEmpty(invoiceTableOverviewCount)
                ? invoiceTableOverviewCount.due
                : 0
            }
            dataRow2Colm3="Total Invoices Created"
            dataRow2Colm4={
              !isEmpty(invoiceTableOverviewCount)
                ? invoiceTableOverviewCount.count
                : 0
            }
          />
        </div>
        {this.renderButtonAndSearchInput()}
        {this.renderInvoiceTable()}
      </>
    );
  }
}

const mapStateToProps = (state) => ({
  allInvoices: state.finance.allInvoices,
  allClients: state.client.allClients,
  userData: state.auth.user.email,
  activeWalkthroughPage: state.auth.activeWalkthroughPage,
  invoiceTableOverviewCount: state.finance.invoiceTableOverviewCount,
});

export default connect(mapStateToProps, {
  deleteInvoices,
  updateInvoice,
  filterInvoices,
  invoiceOverviewTableByDate,
  getAllInvoices,
})(FinancesInvoices);
