import React from "react";
import GreenLinkSmallFont from "../common/GreenLinkSmallFont";

export default function DashboardTimesheetFeaturesIllustration() {
  return (
    <div className="text-center pt-65">
      <h5 className="font-18-semiBold color-white-48 row mx-0 align-items-center justify-content-center flex-nowrap">
        <img
          src={"/img/icons/lock-icon.svg"}
          alt={"lock"}
          className="features-illustration-lock-icon"
        />
        This is a locked feature available in the plan{" "}
        <span className="features-illustration-span-text"> Ark</span> and
        <span className="features-illustration-span-text"> Metaverse</span>
      </h5>
      <h2 className="mt-40 illustration-gradient-text illustration-gradient-text--dashboard-timesheet">
        Time yourself and track your efficiency and productivity
        <br /> using our timesheet feature
      </h2>
      <GreenLinkSmallFont
        path={"/profile"}
        text="Upgrade your plan to Ark or Metaverse"
        extraClassName="featutes-illustration-btn mt-20"
      />
      <div>
        <img
          src={"/img/desktop/features-illustration/dashboard-timesheet.png"}
          alt={"dashboard timesheet"}
          className="dashboard-timesheet-illustration-img"
        />
      </div>
    </div>
  );
}
