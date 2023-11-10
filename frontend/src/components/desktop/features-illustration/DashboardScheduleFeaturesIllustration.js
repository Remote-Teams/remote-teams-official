import React from "react";
import GreenLinkSmallFont from "../common/GreenLinkSmallFont";

export default function DashboardScheduleFeaturesIllustration() {
  return (
    <div className=" dashboard-schedule-row__colm1  dashboard-schedule-features-illustration-div text-center">
      <h5 className="font-18-semiBold color-white-48 row justify-content-center mx-0 align-items-center">
        <img
          src={"/img/icons/lock-icon.svg"}
          alt={"lock"}
          className="features-illustration-lock-icon"
        />
        This is a locked feature available in the plan
        <span className="features-illustration-span-text">Ark </span> and
        <span className="features-illustration-span-text">Metaverse</span>
      </h5>
      <div className="dashboard-schedule-features-illustration-gradient-img-div">
        <img
          src={"/img/desktop/features-illustration/dashboard-gradient.png"}
          alt={"dashboard gradient"}
          className="dashboard-schedule-illustration-gradient-img"
        />
      </div>
      <div className="dashboard-schedule-illustration-img-div mt-40">
        <h2 className="illustration-gradient-text">
          Track your tasks here on weekly schedule with ease
        </h2>
        <img
          src={"/img/desktop/features-illustration/dashboard-schedule.png"}
          alt={"dashboard schedule "}
          className="dashboard-schedule-illustration-img"
        />
      </div>
      <GreenLinkSmallFont
        path={"/profile"}
        text="Upgrade your plan to Ark or Metaverse"
        extraClassName="featutes-illustration-btn mt-30"
      />
    </div>
  );
}
