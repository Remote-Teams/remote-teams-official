import React from "react";
import GreenLinkSmallFont from "../common/GreenLinkSmallFont";

export default function DashboardTaskPipelineFeaturesIllustration() {
  return (
    <div className="dashboard-task-pipeline-featutes-illustration-div text-center ">
      <h2 className="illustration-gradient-text">
        Keep your upcoming tasks in pipeline <br />
        for quick scheduling
      </h2>
      <img
        src={"/img/desktop/features-illustration/dashboard-task-pipeline.png"}
        alt={"dashboard task pipeline"}
        className="dashboard-task-pipeline-features-illustration-img"
      />
      <h5 className="font-18-semiBold color-white-48 row justify-content-center mx-0 align-items-center">
        <img
          src={"/img/icons/lock-icon.svg"}
          alt={"lock"}
          className="features-illustration-lock-icon"
        />
        This is a locked feature available in plan <br />
        <span className="features-illustration-span-text"> Metaverse</span>{" "}
      </h5>
      <GreenLinkSmallFont
        path={"/profile"}
        text="Upgrade plan to Metaverse"
        extraClassName="featutes-illustration-btn mt-30"
      />
    </div>
  );
}
