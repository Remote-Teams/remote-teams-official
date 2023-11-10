import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useLocation } from "react-router";
import { findFeature } from "./../../../store/actions/authAction";
import LeftNavbar from "../header/LeftNavbar";
import PageTitle from "../common/PageTitle";
import TopNavbar from "../header/TopNavbar";
import isEmpty from "../../../store/validations/is-empty";
import WorkflowFeaturesIllustration from "../features-illustration/WorkflowFeaturesIllustration";
import VaultFeaturesIllustration from "../features-illustration/VaultFeaturesIllustration";
import ReportsFeaturesIllustration from "../features-illustration/ReportsFeaturesIllustration";
import PresentationsFeaturesIllustration from "../features-illustration/PresentationsFeaturesIllustration";
import SupportFeaturesIllustration from "../features-illustration/SupportFeaturesIllustration";

export default function PreviewFeaturesMain() {
  const dispatch = useDispatch();
  const location = useLocation();
  const [pageTitle, setPageTitle] = useState("");

  useEffect(() => {
    if (!isEmpty(location)) {
      dispatch(
        findFeature({
          feature: `${location.state.feature}`,
        })
      );
      setPageTitle(location.state.feature);
    }
  }, [location]);
  return (
    <div>
      {/* left navbar */}
      <LeftNavbar
        activeMenu={
          pageTitle === "Workflow"
            ? "workflows"
            : pageTitle === "Presentation"
            ? "proposals"
            : pageTitle === "Vault"
            ? "vault"
            : pageTitle === "Report"
            ? "reports"
            : pageTitle === "Support"
            ? "support"
            : ""
        }
      />

      <div className="main-page-padding">
        {/* pagetitle and topnavbar */}
        <div className="pageTitle-topNavbar-div">
          <PageTitle title={`${pageTitle}`} />
          <TopNavbar activeMenu={"Preview"} />
        </div>
        {pageTitle === "Workflow" ? (
          <WorkflowFeaturesIllustration />
        ) : pageTitle === "Vault" ? (
          <VaultFeaturesIllustration />
        ) : pageTitle === "Report" ? (
          <ReportsFeaturesIllustration />
        ) : pageTitle === "Presentation" ? (
          <PresentationsFeaturesIllustration />
        ) : pageTitle === "Support" ? (
          <SupportFeaturesIllustration />
        ) : (
          ""
        )}
      </div>
    </div>
  );
}
