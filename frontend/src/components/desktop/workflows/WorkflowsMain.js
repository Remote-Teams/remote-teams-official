import React, { useEffect, useState } from "react";
import LeftNavbar from "../header/LeftNavbar";
import TopNavbar from "../header/TopNavbar";
import PageTitle from "../common/PageTitle";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import WorkflowLibrary from "./WorkflowLibrary";
import WorkflowOngoingProcesses from "./WorkflowOngoingProcesses";
import WorkflowHistroy from "./WorkflowHistroy";
import BreadcrumbMenu from "../common/BreadcrumbMenu";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllWorkFlowAction,
  getAllWorkFlowInstanceAction,
} from "./../../../store/actions/workflowApiAction";
import isEmpty from "../../../store/validations/is-empty";

export default function WorkflowsMain() {
  const [activeTabIndex, setActiveTabIndex] = useState(
    isNaN(parseInt(localStorage.getItem("activeWorkflowTabIndex")))
      ? 0
      : parseInt(localStorage.getItem("activeWorkflowTabIndex"))
  );

  const dispatch = useDispatch();

  const [onGoingInstances, setOnGoingInstances] = useState([]);
  const [completedInstances, setCompletedInstances] = useState([]);

  //REDUCERS
  const userAllInstances = useSelector(
    (state) => state.workflowApi.userAllInstances
  );

  //USEFFECTS
  useEffect(() => {
    var userData = JSON.parse(localStorage.getItem("UserData"));
    dispatch(getAllWorkFlowAction());
    const formData = {
      query: {
        user: userData.id,
      },
    };
    dispatch(getAllWorkFlowInstanceAction(formData));
  }, []);

  useEffect(() => {
    if (!isEmpty(userAllInstances)) {
      let onGoingInst = userAllInstances.filter(
        (ele) => ele.completed === false
      );
      let completedInst = userAllInstances.filter(
        (ele) => ele.completed === true
      );
      setOnGoingInstances(onGoingInst);
      setCompletedInstances(completedInst);
    } else {
      setOnGoingInstances([]);
      setCompletedInstances([]);
    }
  }, [userAllInstances]);

  /*=================================================================
      handlers
  ==================================================================*/

  const handleOnSelect = (val) => {
    // activeWorkflowTabIndex
    localStorage.setItem("activeWorkflowTabIndex", val);
    setActiveTabIndex(val);
  };

  /*=================================================================
      main
  ==================================================================*/

  return (
    <>
      {/* left navbar */}
      <LeftNavbar activeMenu="workflows" />

      <div className="main-page-padding">
        {/* pagetitle and topnavbar */}
        <div className="pageTitle-topNavbar-div">
          <PageTitle
            title="workflows"
            isLinkDisplay={true}
            linkPath="/workflow-add-new/1"
            linkText="+ New Workflow"
          />
          <TopNavbar />
        </div>

        <BreadcrumbMenu
          menuObj={[
            {
              title: "Workflows",
            },
          ]}
        />

        {/* pagetitle and topnavbar end */}
        <div className="profile_tabs_section profile_tabs_section--workflow profile_tabs_section--member-details-new">
          <Tabs
            // defaultIndex={parseInt(
            //   localStorage.getItem("activeWorkflowTabIndex")
            // )}
            onSelect={handleOnSelect}
            selectedIndex={activeTabIndex}
          >
            <TabList>
              <Tab>Workflow Library</Tab>
              <Tab>Ongoing Processes</Tab>
              <Tab>My Histroy</Tab>
            </TabList>

            <TabPanel>
              <WorkflowLibrary />
            </TabPanel>
            <TabPanel>
              <WorkflowOngoingProcesses
                onGoingInstances={onGoingInstances}
                handleOnSelect={handleOnSelect}
              />
            </TabPanel>
            <TabPanel>
              <WorkflowHistroy
                completedInstances={completedInstances}
                handleOnSelect={handleOnSelect}
              />
            </TabPanel>
          </Tabs>
        </div>
      </div>
    </>
  );
}
