import React, { useEffect, useState } from "react";
import LeftNavbar from "../header/LeftNavbar";
import PageTitle from "../common/PageTitle";
import TopNavbar from "../header/TopNavbar";
import BreadcrumbMenu from "../common/BreadcrumbMenu";
import SettingsNewFaqs from "./SettingsNewFaqs";
import SettingsNewSubmitQuery from "./SettingsNewSubmitQuery";
import { SettingsNewCompanyDayOffsDisplay } from "./SettingsNewCompanyDayOffsDisplay";
import SettingsNewAddCompanyDayOffsModal from "./SettingsNewAddCompanyDayOffsModal";
import SettingsCompanyWorkingHours from "./SettingsCompanyWorkingHours";
import SettingsMemberDayOffs from "./SettingsMemberDayOffs";
import { useDispatch, useSelector } from "react-redux";
import {
  getCompanyDaysOff,
  getCompanyWorkingHours,
} from "./../../../store/actions/authAction";
import isEmpty from "../../../store/validations/is-empty";

export default function SettingsNew() {
  const dispatch = useDispatch();

  const [companyDaysOffData, setCompanyDaysOff] = useState([]);

  useEffect(() => {
    dispatch(getCompanyDaysOff());
    dispatch(getCompanyWorkingHours());
  }, []);

  const companyDaysOff = useSelector((state) => state.auth.companyDaysOff);

  useEffect(() => {
    if (!isEmpty(companyDaysOff)) {
      setCompanyDaysOff(companyDaysOff);
    } else {
      setCompanyDaysOff([]);
    }
  }, [companyDaysOff]);

  return (
    <>
      {/* left navbar */}
      <LeftNavbar activeMenu="settings" />

      <div className="main-page-padding">
        {/* pagetitle and topnavbar */}
        <div className="pageTitle-topNavbar-div">
          <PageTitle
            extraClassNamePageTitle="rt-settings-new-pageTitle-row"
            title="settings"
            isLinkDisplay={true}
            linkPath="/settings"
            linkText="Watch Tutorial Again"
          />
          <TopNavbar />
        </div>

        {/* pagetitle and topnavbar end */}
        <BreadcrumbMenu
          menuObj={[
            {
              title: "Settings",
            },
          ]}
        />

        <div className="settings-content-new row mx-0 flex-nowrap align-items-start">
          {/* column1 */}
          <div className="settings-content-new__colm1">
            {/* column1 fold1 */}
            <div className="settings-content-new__card">
              <SettingsCompanyWorkingHours />
            </div>
            {/* column1 fold2 */}
            <div className="settings-content-new__card">
              <div className="row mx-0 flex-nowrap align-items-start justify-content-between mb-30">
                <h2 className="add-new-member-title mr-20">Company Day offs</h2>
                <SettingsNewAddCompanyDayOffsModal />
              </div>
              <SettingsNewCompanyDayOffsDisplay
                companyDaysOff={companyDaysOffData}
              />
            </div>
          </div>
          {/* column2 */}
          <div className="settings-content-new__colm2 settings-content-new__card">
            <SettingsMemberDayOffs />
          </div>
          {/* column3 */}
          <div className="settings-content-new__colm3">
            {/* column1 fold1 */}
            <SettingsNewFaqs />
            {/* column1 fold2 */}
            <SettingsNewSubmitQuery />
          </div>
        </div>
      </div>
    </>
  );
}
