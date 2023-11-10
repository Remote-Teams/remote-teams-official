import React from "react";
import GreenLinkSmallFont from "../common/GreenLinkSmallFont";

export default function ProjectWorkboardsFeaturesIllustration() {
  return (
    <div className="project-workboards-illustration-div">
      <div>
        <h5 className="font-18-semiBold color-white-48 row mx-0 align-items-center flex-nowrap">
          <img
            src={"/img/icons/lock-icon.svg"}
            alt={"lock"}
            className="features-illustration-lock-icon"
          />
          This is a locked feature available in the plan{" "}
          <span className="features-illustration-span-text"> Metaverse </span>
        </h5>
        <h2 className="illustration-gradient-text">
          Collaborate and ideate in real
          <br />
          time using workboard
        </h2>
        <h5 className="font-18-semiBold pt-20">
          Draw out your ideas and flows on the workboard using this
          <br /> feature.
        </h5>
        <GreenLinkSmallFont
          path={"/profile"}
          text="Upgrade plan to Metaverse"
          extraClassName="featutes-illustration-btn mt-30"
        />
      </div>
      <div className="project-workboards-img-illustration-div">
        <img
          src={"/img/desktop/features-illustration/project-workboards.png"}
          alt={"project planning priority matrix"}
          className="project-workboards-illustration-img"
        />
      </div>
    </div>
  );
}
