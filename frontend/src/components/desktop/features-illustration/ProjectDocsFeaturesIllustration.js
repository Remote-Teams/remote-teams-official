import React from "react";
import GreenLinkSmallFont from "../common/GreenLinkSmallFont";

export default function ProjectDocsFeaturesIllustration() {
  return (
    <div className="project-docs-features-illustration-div">
      <div>
        <h5 className="font-18-semiBold color-white-48 row mx-0 align-items-center flex-nowrap">
          <img
            src={"/img/icons/lock-icon.svg"}
            alt={"lock"}
            className="features-illustration-lock-icon"
          />
          This is a locked feature available in the plan{" "}
          <span className="features-illustration-span-text"> Metaverse</span>{" "}
        </h5>
        <h2 className="mt-20 illustration-gradient-text">
          Create docs related to <br />
          projects and save for
          <br />
          you and your team to use!
        </h2>
        <h5 className="font-18-semiBold pt-20">
          A comprehensive Inbuilt Doc editor to help you create documents with
          ease
        </h5>
        <GreenLinkSmallFont
          path={"/profile"}
          text="Upgrade plan to Metaverse"
          extraClassName="featutes-illustration-btn mt-30"
        />
      </div>
      <div className="project-docs-features-illustration-img-div">
        <img
          src={"/img/desktop/features-illustration/project-docs.png"}
          alt={"project docs"}
          className="project-docs-features-illustration-img"
        />
      </div>
    </div>
  );
}
