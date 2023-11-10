import React from "react";
import GreenLinkSmallFont from "../common/GreenLinkSmallFont";

export default function WorkflowFeaturesIllustration() {
  return (
    <div className="text-center workflows-features-illustration-div">
      <h5 className="font-18-semiBold color-white-48 row mx-0 align-items-center justify-content-center flex-nowrap">
        <img
          src={"/img/icons/lock-icon.svg"}
          alt={"lock"}
          className="features-illustration-lock-icon"
        />
        This is a locked feature available in the plan
        <span className="features-illustration-span-text"> Metaverse</span>
      </h5>
      <h2 className="mt-30 illustration-gradient-text">
        Streamline and automate repeatable <br /> business tasks{" "}
      </h2>
      <h5 className="font-18-semiBold pt-20">
        Improve your business by developing workflows which can help you make
        quicker, smarter decisions{" "}
      </h5>
      <GreenLinkSmallFont
        path={"/profile"}
        text="Upgrade your plan to Metaverse"
        extraClassName="featutes-illustration-btn mt-30"
      />
      <div>
        <img
          src={"/img/desktop/features-illustration/workflows.png"}
          alt={"workflows"}
          className="workflows-features-illustration-img"
        />
      </div>
    </div>
  );
}
