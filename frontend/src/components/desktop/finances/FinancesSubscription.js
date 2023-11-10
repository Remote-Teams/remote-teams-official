import React, { Component } from "react";
import CountCardCommon from "../common/CountCardCommon";
import SearchInput from "../common/SearchInput";
import GreenLinkSmallFont from "../common/GreenLinkSmallFont";
import DatepickerFromTo from "../common/DatepickerFromTo";
import FinanceEditSubscription from "./FinanceEditSubscription";
import { connect } from "react-redux";
import isEmpty from "../../../store/validations/is-empty";
import {
  deleteSubsciption,
  filterSubscription,
  getAllSubsciption,
} from "./../../../store/actions/financeAction";
import dateFns from "date-fns";

import { startOfMonth, endOfMonth } from "date-fns";
import { startOfDay, endOfDay } from "date-fns";

const dummyData = [1, 2, 3, 4, 5];

class FinancesSubscription extends Component {
  constructor() {
    super();
    this.state = {
      isAddNew: false,
      startDate: startOfMonth(new Date()),
      endDate: endOfMonth(new Date()),
      searchInput: "",
      allSubscriptions: [],
      totalSubscriptionCount: {},
      // product
      isStatusActive: true,
    };
  }

  /*================================================
                Lifecycle Methods
  =================================================*/
  static getDerivedStateFromProps(nextProps, nextState) {
    // if (
    //   !isEmpty(nextProps.totalSubscriptionCount) &&
    //   nextProps.totalSubscriptionCount !== nextState.totalSubscriptionCount
    // ) {
    //   return {
    //     totalSubscriptionCount: nextProps.totalSubscriptionCount,
    //   };
    // }
    if (
      nextProps.subscriptionOverview ||
      nextProps.allSubscriptions ||
      nextProps.totalSubscriptionCount
    ) {
      return {
        subscriptionOverview: nextProps.subscriptionOverview,
        allSubscriptions: nextProps.allSubscriptions,
        totalSubscriptionCount: nextProps.totalSubscriptionCount,
      };
    }
    // if () {
    //   return {

    //   };
    // }

    return null;
  }

  componentDidUpdate() {
    if (this.props.allSubscriptions !== this.state.allSubscriptions) {
      this.setState({
        allSubscriptions: this.props.allSubscriptions,
      });
    }
  }

  /*============================================================
    handlers
============================================================*/

  handleChangeSearchInput = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  };

  handleOnChangeToggle = (e) => {
    this.setState({
      [e.target.name]: e.target.checked,
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
    const formDataGetSubscription = {
      query: {
        $and: [
          { createdAt: { $lte: new Date(endStartDate) } },
          { createdAt: { $gte: new Date(newStartDate) } },
        ],
      },
    };
    this.props.getAllSubsciption(formDataGetSubscription);
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
      renderButtonAndSearchInput
  ============================================================*/
  renderButtonAndSearchInput = () => {
    return (
      <div className="row mx-0 justify-content-between subscription-btn-search-div">
        <div className="row mx-0">
          <div className="mr-50">
            <GreenLinkSmallFont
              //text="+ Subcription"
              extraClassName="add-subscription-btn"
              text="New Subscription"
              path="/add-subscription"
            />
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
      renderSubscriptionTable
  ============================================================*/
  // handlers
  handleSortTableColumnData = (name) => (e) => {
    console.log("sort data of column: ", name);
  };

  handleOnClickDeleteIcon = (subscription) => (e) => {
    console.log(subscription);
    console.log("clicked on delete icon");
    this.props.deleteSubsciption(subscription._id);
  };

  // renderSubscriptionTable
  renderSubscriptionTable = () => {
    const { allSubscriptions, searchInput } = this.state;

    let filtereddata = [];
    if (!isEmpty(searchInput)) {
      let search = new RegExp(searchInput, "i");
      filtereddata = allSubscriptions.filter((getall) => {
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
      filtereddata = allSubscriptions;
    }

    return (
      <>
        <div className="finances-table-thead">
          <table className="finances-table finances-table--subscription">
            <thead>
              <tr>
                <th>
                  <span>title</span>
                </th>
                <th>
                  <span>status</span>
                </th>
                <th>
                  <span>Type</span>
                </th>
                <th>
                  <span
                    className="cursor-pointer"
                    onClick={this.handleSortTableColumnData("startDate")}
                  >
                    start date <i className="fa fa-sort"></i>
                  </span>
                </th>
                <th>
                  <span
                    className="cursor-pointer"
                    onClick={this.handleSortTableColumnData("nextBillingDate")}
                  >
                    next billing date <i className="fa fa-sort"></i>
                  </span>
                </th>
                <th>
                  <span
                    className="cursor-pointer"
                    onClick={this.handleSortTableColumnData("amount")}
                  >
                    amount ($) <i className="fa fa-sort"></i>
                  </span>
                </th>

                <th>
                  <span className="opacity-0">0</span>
                </th>
              </tr>
            </thead>
          </table>
        </div>
        <div className="finances-table-tbody">
          <table className="finances-table finances-table--subscription">
            <tbody>
              {!isEmpty(filtereddata) ? (
                filtereddata.map((subscription, index) => (
                  <tr key={index}>
                    <td>
                      <span>{subscription.name}</span>
                    </td>
                    <td>
                      <span>
                        {subscription.status === "ACTIVE"
                          ? "Active"
                          : "Expired"}
                      </span>
                    </td>
                    <td>
                      <span>
                        {subscription.billingType === "MONTHLY"
                          ? "Monthly"
                          : "Yearly"}
                      </span>
                    </td>
                    <td>
                      <span>
                        {dateFns.format(
                          subscription.startingDate,
                          "D-MMM-YYYY"
                        )}{" "}
                      </span>
                    </td>
                    <td>
                      <span>23-Jan-2020</span>
                    </td>
                    <td>
                      <span>{subscription.price}</span>
                    </td>

                    <td>
                      <span className="row mx-0 flex-nowrap align-items-start">
                        <FinanceEditSubscription
                          subscriptionData={subscription}
                        />
                        <i
                          className="fa fa-trash finances-table__fa-icon-delete"
                          onClick={this.handleOnClickDeleteIcon(subscription)}
                        ></i>
                      </span>
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
    console.log(status);

    if (status === "") {
      const formData = {
        pageNo: 1,
        pageSize: 10,
        query: {},
      };
      this.props.filterSubscription(formData);
    } else {
      const formData = {
        pageNo: 1,
        pageSize: 10,
        query: {
          status: status,
        },
      };
      this.props.filterSubscription(formData);
    }
  };

  /*============================================================
      main
  ============================================================*/
  render() {
    const {
      subscriptionOverview,
      allSubscriptions,
      totalSubscriptionCount,
    } = this.state;

    let activeSubscription =
      !isEmpty(subscriptionOverview) &&
      subscriptionOverview.filter(
        (subscription) => subscription._id === "ACTIVE"
      );

    let inactiveSubscription =
      !isEmpty(subscriptionOverview) &&
      subscriptionOverview.filter(
        (subscription) => subscription._id === "DEACTIVATED"
      );
    console.log(activeSubscription);
    console.log(inactiveSubscription);

    // console.log(this.state.allSubscriptions);
    // const { totalSubscriptionCount } = this.props;
    // console.log(this.state.subscriptionOverview);

    return (
      <>
        <div className="row mx-0 page-count-row finances-subscription-count-card-div">
          <CountCardCommon
            title="Total cost every month($)"
            //title="Total"
            count={!isEmpty(totalSubscriptionCount) && totalSubscriptionCount}
            onClick={this.onClickCardsHandler("")}
          />
          <CountCardCommon
            title="no of Active subscriptions"
            //title="Active"
            count={
              !isEmpty(activeSubscription[0]) ? activeSubscription[0].count : 0
            }
            onClick={this.onClickCardsHandler("ACTIVE")}
          />
          <CountCardCommon
            title="Expired subscriptions"
            //title="Expired"
            count={
              !isEmpty(inactiveSubscription[0])
                ? inactiveSubscription[0].count
                : 0
            }
            onClick={this.onClickCardsHandler("DEACTIVATED")}
          />
        </div>
        {this.renderButtonAndSearchInput()}
        {this.renderSubscriptionTable()}
      </>
    );
  }
}

const mapStateToProps = (state) => ({
  allSubscriptions: state.finance.allSubscriptions,
  totalSubscriptionCount: state.finance.totalSubscriptionCount.count,
  subscriptionOverview: state.finance.subscriptionOverview,
});

export default connect(mapStateToProps, {
  deleteSubsciption,
  filterSubscription,
  getAllSubsciption,
})(FinancesSubscription);
