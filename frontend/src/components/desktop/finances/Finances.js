import React, { useEffect } from "react";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";
import LeftNavbar from "../header/LeftNavbar";
import PageTitle from "../common/PageTitle";
import TopNavbar from "../header/TopNavbar";
import FinancesExpenses from "./FinancesExpenses";
import FinancesInvoices from "./FinancesInvoices";
import FinancesSubscription from "./FinancesSubscription";
import FinancesApprovals from "./FinancesApprovals";
import {
  getAllInvoices,
  getAllSubsciption,
  getTotalSubscriptionCount,
  getSubscriptionOverview,
  getAllExpanses,
  getExpenseTotalCount,
  getExpenseOverview,
  getMiscellaneousExpense,
} from "./../../../store/actions/financeAction";
import { connect } from "react-redux";
import { getAllClients } from "./../../../store/actions/clientAction";
import { getAllProjectAction } from "./../../../store/actions/projectAction";
import isEmpty from "../../../store/validations/is-empty";
import WalkthroughFinances1 from "../walkthrough/WalkthroughFinances1";
import WalkthroughFinances2 from "../walkthrough/WalkthroughFinances2";
import WalkthroughFinances3 from "../walkthrough/WalkthroughFinances3";
import WalkthroughFinances4 from "../walkthrough/WalkthroughFinances4";

import { startOfDay, endOfDay } from "date-fns";
import { startOfMonth, endOfMonth } from "date-fns";
import Loader from "react-loader-spinner";
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import { useSelector, useDispatch } from "react-redux";
import FinancesInvoiceFeaturesIllustration from "../features-illustration/FinancesInvoiceFeaturesIllustration";
import FinancesSubscriptionFeaturesIllustration from "../features-illustration/FinancesSubscriptionFeaturesIllustration";
import FinancesApprovalsFeaturesIllustration from "../features-illustration/FinancesApprovalsFeaturesIllustration";

let featureOne = { name: "Invoice", isDisabled: false };

let featureTwo = { name: "Subscription", isDisabled: false };
let featureThree = { name: "Approval", isDisabled: false };

function Finances() {
  let featureArray = JSON.parse(localStorage.getItem("UserFeatures"));
  const dispatch = useDispatch();

  const activeWalkthroughPage = useSelector(
    (state) => state.auth.activeWalkthroughPage
  );
  const loader = useSelector((state) => state.auth.loader);

  useEffect(() => {
    dispatch(getAllClients());
    dispatch(getAllProjectAction());
    dispatch(getTotalSubscriptionCount());
    dispatch(getSubscriptionOverview());
    let newStartDate = startOfMonth(new Date());
    let endStartDate = endOfMonth(new Date());

    const formData = {
      query: {
        expenseType: "PROJECT",
        $and: [
          { createdAt: { $lte: new Date(endStartDate) } },
          { createdAt: { $gte: new Date(newStartDate) } },
        ],
      },
    };
    const formDataAllInvoice = {
      query: {
        $and: [
          { createdAt: { $lte: new Date(endStartDate) } },
          { createdAt: { $gte: new Date(newStartDate) } },
        ],
      },
    };
    const formDataMiscellaneaous = {
      query: {
        expenseType: "MISCELLANEOUS",
        $and: [
          { createdAt: { $lte: new Date(endStartDate) } },
          { createdAt: { $gte: new Date(newStartDate) } },
        ],
      },
    };

    const formDataGetSubscription = {
      query: {
        $and: [
          { createdAt: { $lte: new Date(endStartDate) } },
          { createdAt: { $gte: new Date(newStartDate) } },
        ],
      },
    };

    dispatch(getAllExpanses(formData));
    dispatch(getMiscellaneousExpense(formDataMiscellaneaous));
    dispatch(getAllInvoices(formDataAllInvoice));
    dispatch(getExpenseTotalCount());
    dispatch(getExpenseOverview());

    dispatch(getAllSubsciption(formDataGetSubscription));
  }, []);

  useEffect(() => {
    if (!isEmpty(featureArray)) {
      let filterFeatureOne = featureArray.filter(
        (ele) => ele === featureOne.name
      );
      let filterFeatureTwo = featureArray.filter(
        (ele) => ele === featureTwo.name
      );
      let filterFeatureThree = featureArray.filter(
        (ele) => ele === featureThree.name
      );
      if (!isEmpty(filterFeatureOne)) {
        featureOne.isDisabled = false;
      } else {
        featureOne.isDisabled = true;
      }
      if (!isEmpty(filterFeatureTwo)) {
        featureTwo.isDisabled = false;
      } else {
        featureTwo.isDisabled = true;
      }
      if (!isEmpty(filterFeatureThree)) {
        featureThree.isDisabled = false;
      } else {
        featureThree.isDisabled = true;
      }
    }
  }, [featureArray]);

  /*=================================================================
      handlers
  ==================================================================*/

  const handleOnSelect = (val) => {
    // activeFinanceTabIndex
    localStorage.setItem("activeFinanceTabIndex", val);
    // // raise invoice and add expense after submit will required this indexvalue
    // // so we will not removing item from localstorage
  };

  return (
    <>
      {loader === true && (
        <Loader type="Triangle" color="#57cba1" className="remote-loader" />
      )}
      {activeWalkthroughPage === "finances-1" && <WalkthroughFinances1 />}

      {activeWalkthroughPage === "finances-2" && <WalkthroughFinances2 />}

      {activeWalkthroughPage === "finances-3" && <WalkthroughFinances3 />}

      {activeWalkthroughPage === "finances-4" && <WalkthroughFinances4 />}

      {/* {activeWalkthroughPage === "finances-5" && (
              <WalkthroughFinances4 />
            )} */}

      {/* left navbar */}
      <LeftNavbar activeMenu="finances" />

      <div className="main-page-padding">
        {/* pagetitle and topnavbar */}
        <div className="pageTitle-topNavbar-div">
          <PageTitle title="finances" />
          <TopNavbar />
        </div>

        {/* pagetitle and topnavbar end */}
        <div className="profile_tabs_section profile_tabs_section--shadow-simple-tabs profile_tabs_section--finances">
          <Tabs
            defaultIndex={parseInt(
              localStorage.getItem("activeFinanceTabIndex")
            )}
            onSelect={handleOnSelect}
          >
            <div
              className={
                activeWalkthroughPage === "finances-2"
                  ? "new-walkthrough-active-topnavbar"
                  : ""
              }
            >
              <TabList>
                {/*<Tab>INVOICES</Tab>
                      <Tab>EXPENSES</Tab>
                      <Tab>SUBSCRIPTION</Tab>
                      <Tab>APPROVALS</Tab>*/}
                <Tab>Invoice</Tab>

                <Tab>Expenses</Tab>
                <Tab>Subscription</Tab>
                <Tab>Approvals</Tab>
              </TabList>
            </div>

            <TabPanel>
              {featureOne.isDisabled === false ? (
                <FinancesInvoices />
              ) : (
                <>
                  {/* "Show illustartion component" */}
                  <FinancesInvoiceFeaturesIllustration />
                </>
              )}
            </TabPanel>

            <TabPanel>
              <FinancesExpenses />
            </TabPanel>

            <TabPanel>
              {featureTwo.isDisabled === false ? (
                <FinancesSubscription />
              ) : (
                <>
                  {/* "Show illustartion component" */}
                  <FinancesSubscriptionFeaturesIllustration />
                </>
              )}
            </TabPanel>

            <TabPanel>
              {featureThree.isDisabled === false ? (
                <FinancesApprovals />
              ) : (
                <>
                  {/* "Show illustartion component" */}
                  <FinancesApprovalsFeaturesIllustration />
                </>
              )}
            </TabPanel>
          </Tabs>
        </div>
      </div>
    </>
  );
}

export default Finances;
