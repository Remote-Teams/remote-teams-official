import React from "react";
import GreenLinkSmallFont from "../common/GreenLinkSmallFont";

export default function ProjectProgressFeaturesIllustration() {
  return (
    <div className="project-progress-features-illustration-div">
      <div>
        <h5 className="font-18-semiBold color-white-48 row mx-0 align-items-center flex-nowrap">
          <img
            src={"/img/icons/lock-icon.svg"}
            alt={"lock"}
            className="features-illustration-lock-icon"
          />
          This is a locked feature available in the plan{" "}
          <span className="features-illustration-span-text"> Ark</span>and{" "}
          <span className="features-illustration-span-text"> Metaverse</span>{" "}
        </h5>
        <h2 className="mt-50 illustration-gradient-text">
          Track your project
          <br /> progress in multiple
          <br />
          ways
        </h2>
        <h5 className="font-18-semiBold pt-20">
          Get an accurate summary of various parameters of projects <br />
          and tasks{" "}
        </h5>
        <GreenLinkSmallFont
          path={"/profile"}
          text="Upgrade plan to Ark or Metaverse"
          extraClassName="featutes-illustration-btn mt-30"
        />
      </div>
      <div className="project-progress-features-illustration-img-div">
        <img
          src={"/img/desktop/features-illustration/project-progress.png"}
          alt={"project progress"}
          className="project-progress-features-illustration-img"
        />
      </div>
    </div>
  );
}
