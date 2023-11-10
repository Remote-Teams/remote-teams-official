import React, { Component } from "react";
import Select from "react-select";
import Checkbox from "rc-checkbox";
import "rc-checkbox/assets/index.css";
import CountCardCommon from "../common/CountCardCommon";
import SearchInput from "../common/SearchInput";
import GreenButtonSmallFont from "../common/GreenButtonSmallFont";
import GrayButtonSmallFont from "../common/GrayButtonSmallFont";
import DatepickerFromTo from "../common/DatepickerFromTo";
import { connect } from "react-redux";
import isEmpty from "../../../store/validations/is-empty";
import dateFns from "date-fns";
import {
  getAllExpanses,
  approveBulkExpense,
  filterExpense,
} from "./../../../store/actions/financeAction";
import { startOfMonth, endOfMonth } from "date-fns";
import { startOfDay, endOfDay } from "date-fns";

const options = [
  { value: "Total", label: "Total" },
  { value: "Pending", label: "Pending" },
  { value: "Approved", label: "Approved" },
];

const dummyData = [1, 2, 3, 4, 5];

class FinancesApprovals extends Component {
  constructor() {
    super();
    this.state = {
      isAddNew: false,
      selectedOption: options[0],
      startDate: startOfMonth(new Date()),
      endDate: endOfMonth(new Date()),
      searchInput: "",
      financeApprovalRowCheckbox: false,
      allExpanses: [],
      expenseOverview: [],
      approveExpanseList: [],
      filterActive: "",
    };
  }

  /*============================================================
              Lifecycle Method
  =============================================================*/
  static getDerivedStateFromProps(nextProps, nextState) {
    if (nextProps.approvalExpense || nextProps.expenseOverview) {
      return {
        approvalExpense: nextProps.approvalExpense,
        expenseOverview: nextProps.expenseOverview,
      };
    }
    // if (
    //   !isEmpty(nextProps.allExpanses) &&
    //   nextProps.allExpanses !== nextState.allExpanses
    // ) {
    //   let sentExpense = nextProps.allExpanses.filter(
    //     (expanse) => expanse.status === "SENT"
    //   );
    //   return {
    //     allExpanses: sentExpense,
    //   };
    // }
    // if (
    //   !isEmpty(nextProps.expenseOverview) &&
    //   nextProps.expenseOverview !== nextState.expenseOverview
    // ) {
    //   return {
    //     expenseOverview: nextProps.expenseOverview,
    //   };
    // }
    return null;
  }

  /*============================================================
    handlers
  ============================================================*/
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
        expenseType: "PROJECT",
        $and: [
          { createdAt: { $lte: new Date(endStartDate) } },
          { createdAt: { $gte: new Date(newStartDate) } },
        ],
      },
    };
    this.props.getAllExpanses(formData);
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
          <div className="mr-50">
            {/* <Select
              isSearchable={false}
              className="react-select-container"
              classNamePrefix="react-select-elements"
              value={selectedOption}
              onChange={this.handleChangeDropdown}
              options={options}
              placeholder="Select"
            /> */}
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
      renderApprovalTable
  ============================================================*/
  // handlers
  handleChangeDropdown = (selectedOption) => {
    this.setState({ selectedOption });
    console.log(`Option selected:`, selectedOption);
  };

  handleSortTableColumnData = (name) => (e) => {
    console.log("sort data of column: ", name);
  };

  handleCheckboxChange = (e) => {
    this.setState({
      [e.target.id]: e.target.checked,
    });
  };

  handleOnClickReject = () => {
    const { approveExpanseList } = this.state;
    // console.log(approveExpanseList);

    let updatedFinishes = approveExpanseList.map(function(obj) {
      if (obj.status === "APPROVED") {
        obj.status = "REJECTED";
      }
      return obj;
    });

    let updatedArray = [];
    updatedFinishes.forEach(function(obj) {
      // console.log(obj);
      updatedArray.push(obj);
    });

    const formData = {
      expenses: updatedArray,
    };
    // console.log(formData);
    this.props.approveBulkExpense(formData, "Expense Rejected");
  };

  handleOnClickApprove = () => {
    // console.log("clicked on approve");

    const { approveExpanseList } = this.state;

    const formData = {
      expenses: approveExpanseList,
    };
    // console.log(formData);
    this.props.approveBulkExpense(formData, "Expense Approved");
  };

  doEmailExist = (data) => {
    // console.log(data);
    let obj = this.state.approveExpanseList.find((emp) => emp === data);
    // console.log(obj);
    return obj ? this.state.approveExpanseList.indexOf(obj) : false;
  };

  onChangeCheckbox = (data) => (e) => {
    // console.log("Checkbox checked:", data);

    let approveExpenseList = this.state.approveExpanseList;

    let returnValue = this.doEmailExist(data);
    if (returnValue || returnValue === 0) {
      approveExpenseList.splice(returnValue, 1);
    } else {
      let newApprovedStatusData = data;
      newApprovedStatusData.status = "APPROVED";
      approveExpenseList.push(newApprovedStatusData);
    }
    this.setState({
      approveExpanseList: approveExpenseList,
    });
    console.log(approveExpenseList);
  };

  // renderApprovalTable
  renderApprovalTable = () => {
    const { approvalExpense } = this.state;
    let filtereddata = [];
    if (!isEmpty(this.state.searchInput)) {
      let search = new RegExp(this.state.searchInput, "i");
      filtereddata = approvalExpense.filter((getall) => {
        if (search.test(getall.expenseTitle)) {
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
      filtereddata = approvalExpense;
    }
    return (
      <>
        {/* heading row */}
        <div className="finances-table-thead">
          <table className="finances-table finances-table--approval">
            <thead>
              <tr>
                <th>
                  <span className="opacity-0">0</span>
                </th>
                <th>
                  <span>requested by</span>
                </th>
                <th>
                  <span>reason</span>
                </th>
                <th>
                  <span>Type</span>
                </th>
                <th>
                  <span
                    className="cursor-pointer"
                    onClick={this.handleSortTableColumnData("date")}
                  >
                    date <i className="fa fa-sort"></i>
                  </span>
                </th>
                <th>
                  <span
                    className="cursor-pointer"
                    onClick={this.handleSortTableColumnData("subtotal")}
                  >
                    subtotal <i className="fa fa-sort"></i>
                  </span>
                </th>
                <th>
                  <span
                    className="cursor-pointer"
                    onClick={this.handleSortTableColumnData("tax")}
                  >
                    tax (%) <i className="fa fa-sort"></i>
                  </span>
                </th>
                <th>
                  <span
                    className="cursor-pointer"
                    onClick={this.handleSortTableColumnData("total")}
                  >
                    total <i className="fa fa-sort"></i>
                  </span>
                </th>
              </tr>
            </thead>
          </table>
        </div>
        {/* content row */}
        <div className="finances-table-tbody">
          <table className="finances-table finances-table--approval">
            <tbody>
              {!isEmpty(filtereddata) ? (
                filtereddata.map((data, index) => (
                  <tr key={index}>
                    {this.state.filterActive !== "APPROVED" ? (
                      <td>
                        <span className="customCheckbox">
                          <Checkbox
                            // id="workingDaysCheckboxMonFri"
                            // value={this.state.workingDaysCheckboxMonFri}
                            // defaultChecked={true}
                            onChange={this.onChangeCheckbox(data)}
                            checked={
                              this.doEmailExist(data) ||
                              this.doEmailExist(data) === 0
                                ? true
                                : false
                            }
                          />
                        </span>
                      </td>
                    ) : (
                      <td></td>
                    )}

                    <td>
                      <span>{data.payee_name}</span>
                    </td>
                    <td>
                      <span>{data.expenseTitle}</span>
                    </td>
                    <td>
                      <span>{data.BillingType}</span>
                    </td>
                    <td>
                      <span>
                        {dateFns.format(data.createdAt, "D-MMM-YYYY")}
                      </span>
                    </td>
                    <td>
                      <span>{data.subTotal}</span>
                    </td>
                    <td>
                      <span>
                        {!isEmpty(data.totalTax) ? data.totalTax : " Na"}
                      </span>
                    </td>
                    <td>
                      <span>{data.total}</span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
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

  onClickCardsHandler = (status) => (e) => {
    // console.log(status);
    this.setState({
      filterActive: status,
      approveExpanseList: [],
    });

    const formData = {
      pageNo: 1,
      pageSize: 10,
      query: {
        status: status,
      },
    };
    this.props.filterExpense(formData);
  };

  /*============================================================
      main
  ============================================================*/
  render() {
    // console.log(this.state.allExpanses);
    // console.log(this.state.expenseOverview);
    const { expenseOverview, approveExpanseList } = this.state;

    let totalRequestCount =
      !isEmpty(expenseOverview) &&
      expenseOverview.filter((expanse) => expanse._id === "SENT");

    let approvedCount =
      !isEmpty(expenseOverview) &&
      expenseOverview.filter((expanse) => expanse._id === "APPROVED");

    let rejectedCount =
      !isEmpty(expenseOverview) &&
      expenseOverview.filter((expanse) => expanse._id === "SENT");

    // console.log(rejectedCount);

    return (
      <>
        <div className="row mx-0 page-count-row finances-subscription-count-card-div">
          {/* <CountCardCommon
            title="TOTAL Requests"
            count={!isEmpty(totalRequestCount) ? totalRequestCount[0].count : 0}
          /> */}
          <CountCardCommon
            title="Total Requests"
            //title="Pending"
            count={
              !isEmpty(totalRequestCount[0]) ? totalRequestCount[0].count : 0
            }
            onClick={this.onClickCardsHandler("SENT")}
          />

          <CountCardCommon
            //title="Rejected"
            title="Pending requests"
            count={!isEmpty(rejectedCount[0]) ? rejectedCount[0].count : 0}
            onClick={this.onClickCardsHandler("SENT")}
          />
          <CountCardCommon
            //title="Approved"
            title="approved requests "
            count={!isEmpty(approvedCount[0]) ? approvedCount[0].count : 0}
            onClick={this.onClickCardsHandler("APPROVED")}
          />
        </div>
        {this.renderButtonAndSearchInput()}
        {this.renderApprovalTable()}
        {!isEmpty(approveExpanseList) && (
          <div className="finance-approval-btn-div">
            <GrayButtonSmallFont
              text="Reject"
              onClick={this.handleOnClickReject}
            />
            <GreenButtonSmallFont
              text="Approve"
              onClick={this.handleOnClickApprove}
            />
          </div>
        )}
      </>
    );
  }
}

const mapStateToProps = (state) => ({
  approvalExpense: state.finance.approvalExpense,
  expenseOverview: state.finance.expenseOverview,
});

export default connect(mapStateToProps, {
  approveBulkExpense,
  filterExpense,
  getAllExpanses,
})(FinancesApprovals);
