import React, { Fragment, useEffect, useState } from "react";
import PageTitle from "../common/PageTitle";
import PaymentMain from "./PaymentMain";
import PaymentHistoryTab from "./PaymentHistoryTab";
import SettingTab from "./SettingTab";
import WorkspaceDetailTab from "./WorkspaceDetailTab";
import SavedCards from "./SavedCards";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";
import TopNavbar from "../header/TopNavbar";
import LeftNavbar from "../header/LeftNavbar";
import Loader from "react-loader-spinner";
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import {
  getCustomerSavedCards,
  getPaymentHistoryByCustomerId,
  getStripeCustomerObject,
} from "./../../../store/actions/paymentAction";
import { getAllResourceAction } from "./../../../store/actions/resourcesAction";
import { getPlansAction } from "./../../../store/actions/authAction";
import { useDispatch, useSelector } from "react-redux";
import isEmpty from "../../../store/validations/is-empty";
import PaymentFailed from "./../popups/PaymentFailed";
import { useHistory } from "react-router-dom";

function UserProfile() {
  const history = useHistory();
  const dispatch = useDispatch();
  const [authData, setAuthData] = useState({});
  const [paymentFailedPopup, setpaymentFailedPopup] = useState(false);

  const auth = useSelector((state) => state.auth);

  useEffect(() => {
    if (!isEmpty(setAuthData)) {
      setAuthData(authData);
    }
  }, [auth]);

  useEffect(() => {
    let OrganizationData = JSON.parse(localStorage.getItem("OrganizationData"));
    let userData = JSON.parse(localStorage.getItem("UserData"));
    if (OrganizationData.planStatus === "PAYMENT_FAILED") {
      setpaymentFailedPopup(true);
    }
    dispatch(getCustomerSavedCards(userData.organizationId));
    dispatch(getPaymentHistoryByCustomerId());
    dispatch(getStripeCustomerObject(OrganizationData.customerId));
    setTimeout(() => {
      dispatch(getPlansAction({ currency: OrganizationData.currency }));
    }, 10);

    dispatch(getAllResourceAction());
    return () => {
      // activeProfileTabIndex
      localStorage.removeItem("activeProfileTabIndex");
    };
  }, []);

  /*=================================================================
      handlers
  ==================================================================*/

  const handleOnSelect = (val) => {
    // activeProfileTabIndex
    localStorage.setItem("activeProfileTabIndex", val);
  };

  const onCloseHandler = () => {
    setpaymentFailedPopup(false);
  };

  let userData = JSON.parse(localStorage.getItem("UserData"));
  let OrganizationData = JSON.parse(localStorage.getItem("OrganizationData"));

  return (
    <div>
      <Fragment>
        <PaymentFailed
          paymentFailedPopup={paymentFailedPopup}
          onCloseHandler={onCloseHandler}
        />
        {authData.loader && (
          <Loader type="Triangle" color="#5ccc40" className="throttle-loader" />
        )}
        {/* left navbar */}
        <LeftNavbar />

        <div className="main-page-padding">
          {/* pagetitle and topnavbar */}
          <div className="pageTitle-topNavbar-div">
            <PageTitle title="Profile" />
            <TopNavbar />
          </div>
          {/* pagetitle and topnavbar end */}
          <div className="profile_tabs_section profile_tabs_section--profile profile_tabs_section--shadow-simple-tabs">
            <Tabs
              defaulttab={
                history.location.state === "savedCards"
                  ? "savedCards"
                  : userData.role.name === "Administrator" &&
                    history.location.state !== "savedCards" &&
                    OrganizationData.planStatus !== "PAYMENT_FAILED"
                  ? "plans"
                  : "savedCards"
              }
              defaultIndex={parseInt(
                localStorage.getItem("activeProfileTabIndex")
              )}
              onSelect={handleOnSelect}
            >
              <TabList>
                {userData.role.name === "Administrator" &&
                  OrganizationData.planStatus !== "PAYMENT_FAILED" && (
                    <Tab tabfor="plans"> Plans</Tab>
                  )}
                {userData.role.name === "Administrator" &&
                  OrganizationData.planStatus !== "CANCELLED" && (
                    <Tab tabfor="savedCards">Cards</Tab>
                  )}
                {userData.role.name === "Administrator" &&
                  OrganizationData.planStatus !== "CANCELLED" &&
                  OrganizationData.planStatus !== "PAYMENT_FAILED" && (
                    <Tab tabfor="paymentHistory">Payment History</Tab>
                  )}
                {userData.role.name === "Administrator" &&
                  OrganizationData.planStatus !== "CANCELLED" &&
                  OrganizationData.planStatus !== "PAYMENT_FAILED" && (
                    <Tab tabfor="workspace-info">
                      {/*Workspace info*/}Workspace Details
                    </Tab>
                  )}
                {OrganizationData.planStatus !== "CANCELLED" &&
                  OrganizationData.planStatus !== "PAYMENT_FAILED" && (
                    <Tab tabfor="settings">{/*Settings*/}Details</Tab>
                  )}
              </TabList>

              {userData.role.name === "Administrator" &&
                OrganizationData.planStatus !== "PAYMENT_FAILED" && (
                  <TabPanel tabId="plans">
                    <PaymentMain />
                  </TabPanel>
                )}
              {userData.role.name === "Administrator" &&
                OrganizationData.planStatus !== "CANCELLED" && (
                  <TabPanel tabId="savedCards">
                    <SavedCards />
                  </TabPanel>
                )}
              {userData.role.name === "Administrator" &&
                OrganizationData.planStatus !== "CANCELLED" &&
                OrganizationData.planStatus !== "PAYMENT_FAILED" && (
                  <TabPanel tabId="paymentHistory">
                    <PaymentHistoryTab />
                  </TabPanel>
                )}
              {userData.role.name === "Administrator" &&
                OrganizationData.planStatus !== "CANCELLED" &&
                OrganizationData.planStatus !== "PAYMENT_FAILED" && (
                  <TabPanel tabId="workspace-info">
                    <WorkspaceDetailTab />
                  </TabPanel>
                )}
              {OrganizationData.planStatus !== "CANCELLED" &&
                OrganizationData.planStatus !== "PAYMENT_FAILED" && (
                  <TabPanel tabId="settings">
                    <SettingTab />
                  </TabPanel>
                )}
            </Tabs>
          </div>
        </div>
      </Fragment>
    </div>
  );
}

export default UserProfile;
