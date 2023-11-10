import React from "react";
import GreenLinkSmallFont from "../common/GreenLinkSmallFont";

export default function ReportsFeaturesIllustration() {
  return (
    <div className="reports-features-illustration-div">
      <div className="text-center ">
        <h5 className="font-18-semiBold color-white-48 row mx-0 align-items-center justify-content-center flex-nowrap">
          <img
            src={"/img/icons/lock-icon.svg"}
            alt={"lock"}
            className="features-illustration-lock-icon"
          />
          This is a locked feature available in the plan{" "}
          <span className="features-illustration-span-text"> Ark</span>
          and{" "}
          <span className="features-illustration-span-text"> Metaverse</span>
        </h5>
        <h2 className="illustration-gradient-text illustration-gradient-text--vault">
          Get Useful insights for managing <br /> projects &amp; more
        </h2>
        <h5 className="font-18-semiBold pt-20">
          Quick information at your fingertips about everything in your
          workspace, team , projects. revenue etc.
        </h5>
        <GreenLinkSmallFont
          path={"/profile"}
          text="Upgrade plan to Ark or Metaverse"
          extraClassName="featutes-illustration-btn mt-50"
        />
      </div>
      <div>
        <img
          src={"/img/desktop/features-illustration/reports.png"}
          alt={"reports"}
          className="reports-features-illustration-img"
        />
      </div>
    </div>
  );
}
