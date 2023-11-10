import React from "react";
import GreenLinkSmallFont from "../common/GreenLinkSmallFont";

export default function SupportFeaturesIllustration() {
  return (
    <div className="text-center supports-features-illustration-div">
      <h5 className="font-18-semiBold color-white-48 row mx-0 align-items-center justify-content-center flex-nowrap">
        <img
          src={"/img/icons/lock-icon.svg"}
          alt={"lock"}
          className="features-illustration-lock-icon"
        />
        This is a locked feature available in the plan{" "}
        <span className="features-illustration-span-text"> Ark </span> and
        <span className="features-illustration-span-text"> Metaverse</span>
      </h5>
      <h2 className="mt-30 illustration-gradient-text illustration-gradient-text--vault">
        Raise tickets for issues or bugs
        <br />
        and track
      </h2>
      <h5 className="font-18-semiBold pt-20">
        Manage support requests with this feature and track the issues or bugs
        to their completion
      </h5>
      <GreenLinkSmallFont
        path={"/profile"}
        text="Upgrade your plan to Ark or Metaverse"
        extraClassName="featutes-illustration-btn mt-30"
      />
      <div className="supports-features-illustration-img-div">
        <img
          src={"/img/desktop/features-illustration/supports.png"}
          alt={"supports"}
          className="supports-features-illustration-img"
        />
      </div>
    </div>
  );
}
