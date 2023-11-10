import React, { useEffect, useState } from "react";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";
import LeftNavbar from "../header/LeftNavbar";
import PageTitle from "../common/PageTitle";
import TopNavbar from "../header/TopNavbar";
import CommandCentreRolesAndPermissions from "./CommandCentreRolesAndPermissions";
import CommandCenterCustomFields from "./CommandCenterCustomFields";
import CommandCentreOverview from "./CommandCentreOverview";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllCustomFields,
  getAllRoles,
} from "./../../../store/actions/commandCenterAction";
import { getAllResourceAction } from "./../../../store/actions/resourcesAction";
import Loader from "react-loader-spinner";
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import isEmpty from "../../../store/validations/is-empty";
import TeamSettings from "./TeamSettings";
import { getUsersInviteLinks } from "./../../../store/actions/authAction";
import CommandCenterRolesAndPermissionIllustration from "../features-illustration/CommandCenterRolesAndPermissionIllustration";
import CommandCenterCustomFieldsFeaturesIllustration from "../features-illustration/CommandCenterCustomFieldsFeaturesIllustration";

const tabTitleData = [
  {
    path: require("../../../assets/img/command-centre/admin-overview-icon.svg"),
    activePath: require("../../../assets/img/command-centre/admin-overview-icon-active.svg"),
    title: "Admin Overview",
    featureName: "Admin_Overview",
    isDisabled: false,
  },
  {
    path: require("../../../assets/img/command-centre/roles-and-permission-icon.svg"),
    activePath: require("../../../assets/img/command-centre/roles-and-permission-icon-active.svg"),
    title: "Roles & Permissions",
    featureName: "Roles_Permissions",
    isDisabled: false,
  },
  {
    path: require("../../../assets/img/command-centre/custom-fields-icon.svg"),
    activePath: require("../../../assets/img/command-centre/custom-fields-icon-active.svg"),
    title: "Custom Fields",
    featureName: "Custom_Fields",
    isDisabled: false,
  },
  {
    path: require("../../../assets/img/command-centre/team-settings-icon.svg"),
    activePath: require("../../../assets/img/command-centre/team-settings-icon-active.svg"),
    title: "Team Settings",
  },
];

export default function CommandCentreMain() {
  let featureArray = JSON.parse(localStorage.getItem("UserFeatures"));
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getAllCustomFields());
    dispatch(getAllRoles());
    dispatch(getAllResourceAction());
    dispatch(getUsersInviteLinks());
  }, []);

  const loader = useSelector((state) => state.auth.loader);

  // const [activeTabIndexVal, setActiveTabIndexVal] = useState(
  //   localStorage.getItem("activeCmdCentreTabIndex")
  // );

  const handleOnSelectTab = (val) => {
    localStorage.setItem("activeCmdCentreTabIndex", val);
    // setActiveTabIndexVal(val);
  };

  useEffect(() => {
    return () => {
      localStorage.removeItem("activeCmdCentreTabIndex");
    };
  }, []);

  useEffect(() => {
    if (!isEmpty(featureArray)) {
      tabTitleData.forEach((feature) => {
        let filteredFeature = featureArray.filter(
          (ele) => ele === feature.featureName
        );
        if (feature.featureName !== "Admin_Overview")
          if (!isEmpty(filteredFeature)) {
            feature.isDisabled = false;
          } else {
            feature.isDisabled = true;
          }
      });
    }
  }, [featureArray]);

  var userData = JSON.parse(localStorage.getItem("UserData"));

  return (
    <>
      {loader === true && (
        <Loader type="Triangle" color="#57cba1" className="remote-loader" />
      )}
      {/* left navbar */}
      <LeftNavbar activeMenu="command centre" />
      <div className="main-page-padding">
        {/* pagetitle and topnavbar */}
        <div className="mb-30 pageTitle-topNavbar-div">
          <PageTitle title="Command Centre" />
          <TopNavbar />
        </div>
        <div className="command-centre-tab-div">
          <Tabs
            defaultIndex={parseInt(
              localStorage.getItem("activeCmdCentreTabIndex")
            )}
            onSelect={handleOnSelectTab}
          >
            <TabList>
              {tabTitleData.map(
                (data, index) =>
                  // data.isDisabled === false && (
                  data.title === "Team Settings" &&
                  userData.role.name !== "Administrator" ? (
                    ""
                  ) : (
                    <Tab key={index}>
                      <div className="command-centre-tab-img-title-div">
                        <img
                          src={data.path}
                          alt={data.title}
                          className="command-centre-tab__inactive-img"
                        />
                        <img
                          src={data.activePath}
                          alt={data.title}
                          className="command-centre-tab__active-img"
                        />
                        <span>{data.title}</span>
                      </div>
                    </Tab>
                  )
                // )
              )}
            </TabList>
            <div className="command-centre-tab-list-div"></div>
            {/* {tabTitleData.map(
              (data, index) =>
                data.isDisabled === false && (
                  <TabPanel>
                    {data.title === "Admin Overview" ? (
                      <CommandCentreOverview />
                    ) : data.title === "Roles & Permissions" ? (
                      <CommandCentreRolesAndPermissions />
                    ) : (
                      <CommandCenterCustomFields />
                    )}
                  </TabPanel>
                )
            )} */}
            <TabPanel>
              <CommandCentreOverview />
            </TabPanel>

            <TabPanel>
              {tabTitleData[1].isDisabled === false ? (
                <CommandCentreRolesAndPermissions />
              ) : (
                <>
                  {/* "Show illustartion component" */}
                  <CommandCenterRolesAndPermissionIllustration />
                </>
              )}
            </TabPanel>

            <TabPanel>
              {tabTitleData[2].isDisabled === false ? (
                <CommandCenterCustomFields />
              ) : (
                <>
                  {/* "Show illustartion component" */}
                  <CommandCenterCustomFieldsFeaturesIllustration />
                </>
              )}
            </TabPanel>
            {userData.role.name === "Administrator" && (
              <TabPanel>
                <TeamSettings />
              </TabPanel>
            )}
          </Tabs>
        </div>
      </div>
    </>
  );
}
