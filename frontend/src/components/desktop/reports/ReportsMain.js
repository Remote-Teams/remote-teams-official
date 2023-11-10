import React, { Component } from "react";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";
import LeftNavbar from "../header/LeftNavbar";
import PageTitle from "../common/PageTitle";
import TopNavbar from "../header/TopNavbar";
import ProjectStatusReport from "./ProjectStatusReport";
import ResourceTimesheetReport from "./ResourceTimesheetReport";
import ExpenseAndIncomeReport from "./ExpenseAndIncomeReport";
import TasksStatusReport from "./TasksStatusReport";
import InvoicesReport from "./InvoicesReport";
import ClientsDetailsReport from "./ClientsDetailsReport";
import LeaveDataReport from "./LeaveDataReport";
import SupportSummaryReport from "./SupportSummaryReport";

const tabTitleData = [
  {
    //path: require("../../../assets/img/reports/reports-project-status-icon.svg"),
    path: require("../../../assets/img/reports/tab-icon/new-report-project-status.svg"),
    activePath: require("../../../assets/img/reports/tab-icon/new-report-project-status-active.svg"),
    title: "Project Status Report",
  },
  {
    //path: require("../../../assets/img/reports/reports-timesheet-icon.svg"),
    path: require("../../../assets/img/reports/tab-icon/new-report-resource-timesheet.svg"),
    activePath: require("../../../assets/img/reports/tab-icon/new-report-resource-timesheet-active.svg"),
    title: "Resource Timesheet Report",
  },
  {
    //path: require("../../../assets/img/reports/reports-expense-vs-income-icon.svg"),
    path: require("../../../assets/img/reports/tab-icon/new-report-expense-vs-income.svg"),
    activePath: require("../../../assets/img/reports/tab-icon/new-report-expense-vs-income-active.svg"),
    title: "Expense & Income Report",
  },
  {
    //path: require("../../../assets/img/reports/reports-task-status-icon.svg"),
    path: require("../../../assets/img/reports/tab-icon/new-report-task.svg"),
    activePath: require("../../../assets/img/reports/tab-icon/new-report-task-active.svg"),
    title: "Tasks Status Report",
  },
  {
    //path: require("../../../assets/img/reports/reports-invoices-icon.svg"),
    path: require("../../../assets/img/reports/tab-icon/new-report-invoice.svg"),
    activePath: require("../../../assets/img/reports/tab-icon/new-report-invoice-active.svg"),
    title: "Invoices Report",
  },
  {
    //path: require("../../../assets/img/reports/reports-client-detail-icon.svg"),
    path: require("../../../assets/img/reports/tab-icon/new-report-client-details.svg"),
    activePath: require("../../../assets/img/reports/tab-icon/new-report-client-details-active.svg"),
    title: "Clients Details Report",
  },
  {
    //path: require("../../../assets/img/reports/reports-leave-data-icon.svg"),
    path: require("../../../assets/img/reports/tab-icon/new-report-leave-data.svg"),
    activePath: require("../../../assets/img/reports/tab-icon/new-report-leave-data-active.svg"),
    title: "Leave Data Report",
  },
  {
    //path: require("../../../assets/img/reports/reports-support-summary-icon.svg"),
    path: require("../../../assets/img/reports/tab-icon/new-report-support-summary.svg"),
    activePath: require("../../../assets/img/reports/tab-icon/new-report-support-summary-active.svg"),
    title: "Support Summary Report",
  },
];

class ReportsMain extends Component {
  constructor() {
    super();
    this.state = {};
  }

  componentWillUnmount() {
    // activeReportsTabIndex
    localStorage.removeItem("activeReportsTabIndex");
  }

  /*=================================================================
      handlers
  ==================================================================*/

  handleOnSelect = (val) => {
    // activeReportsTabIndex
    localStorage.setItem("activeReportsTabIndex", val);
  };

  /*=================================================================
      main
  ==================================================================*/
  render() {
    return (
      <>
        {/* left navbar */}
        <LeftNavbar activeMenu="reports" />

        <div className="main-page-padding main-page-padding--reports">
          {/* pagetitle and topnavbar */}
          <div className="mb-30 pl-30 pageTitle-topNavbar-div">
            <PageTitle title="reports" />
            <TopNavbar />
          </div>

          {/* pagetitle and topnavbar end */}
          <div className="reports-custom-tab">
            <Tabs
              defaultIndex={parseInt(
                localStorage.getItem("activeReportsTabIndex")
              )}
              onSelect={this.handleOnSelect}
            >
              <TabList>
                {tabTitleData.map((data, index) => (
                  <Tab key={index}>
                    <div className="reports-custom-tab__div">
                      <img
                        src={data.path}
                        alt={data.title}
                        className="reports-custom-tab__inactive-img"
                      />
                      <img
                        src={data.activePath}
                        alt={data.title}
                        className="reports-custom-tab__active-img"
                      />
                      <span>{data.title}</span>
                    </div>
                  </Tab>
                ))}
              </TabList>

              <TabPanel>
                <ProjectStatusReport />
              </TabPanel>
              <TabPanel>
                <ResourceTimesheetReport />
              </TabPanel>
              <TabPanel>
                <ExpenseAndIncomeReport />
              </TabPanel>
              <TabPanel>
                <TasksStatusReport />
              </TabPanel>
              <TabPanel>
                <InvoicesReport />
              </TabPanel>
              <TabPanel>
                <ClientsDetailsReport />
              </TabPanel>
              <TabPanel>
                <LeaveDataReport />
              </TabPanel>
              <TabPanel>
                <SupportSummaryReport />
              </TabPanel>
            </Tabs>
          </div>
        </div>
      </>
    );
  }
}

export default ReportsMain;
