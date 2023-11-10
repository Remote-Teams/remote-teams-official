import React from "react";
import GreenLinkSmallFont from "../common/GreenLinkSmallFont";

export default function ProjectDirectoriesFeaturesIllustration() {
  return (
    <div className="project-directories-features-illustration-div">
      <div>
        <h5 className="font-18-semiBold color-white-48 row mx-0 align-items-center flex-nowrap">
          <img
            src={"/img/icons/lock-icon.svg"}
            alt={"lock"}
            className="features-illustration-lock-icon"
          />
          This is a locked feature available in the plan
          <span className="features-illustration-span-text">
            {" "}
            Metaverse{" "}
          </span>{" "}
        </h5>
        <h2 className="mt-30 illustration-gradient-text">
          Organise your project docs in
          <br />
          directories so that ,<br /> everything you need
          <br />
          is at one place
        </h2>
        <h5 className="font-18-semiBold pt-30">
          Manage your project docs in categories or create your own <br />
          categories to upload files.{" "}
        </h5>
        <GreenLinkSmallFont
          path={"/profile"}
          text="Upgrade plan to Metaverse"
          extraClassName="featutes-illustration-btn mt-50"
        />
      </div>
      <div className="project-directories-features-illustration-img-div">
        <img
          src={"/img/desktop/features-illustration/project-directories.png"}
          alt={"project directories"}
          className="project-directories-features-illustration-img"
        />
      </div>
    </div>
  );
}
