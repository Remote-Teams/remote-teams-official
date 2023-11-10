import React from "react";
import GreenLinkSmallFont from "../common/GreenLinkSmallFont";

export default function ProjectPlanningPriorityMatrixFeaturesIllustration() {
  return (
    <div className="project-planning-priority-matrix-features-illustration-div">
      <div>
        <h5 className="font-18-semiBold color-white-48 row mx-0 align-items-center flex-nowrap">
          <img
            src={"/img/icons/lock-icon.svg"}
            alt={"lock"}
            className="features-illustration-lock-icon"
          />
          This is a locked feature available in the plan
          <span className="features-illustration-span-text"> Metaverse </span>
        </h5>
        <h2 className="mt-20 illustration-gradient-text">
          Improve your productivity &amp; <br /> Execution
        </h2>
        <h5 className="font-18-semiBold pt-20">
          Determining which tasks and projects to complete first can
          <br /> help your productivity and execution can go from efficient
          <br /> to extraordinary
        </h5>
        <GreenLinkSmallFont
          path={"/profile"}
          text="Upgrade plan to Metaverse"
          extraClassName="featutes-illustration-btn mt-40"
        />
      </div>
      <div className="project-planning-priority-matrix-illustration-div">
        <img
          src={
            "/img/desktop/features-illustration/project-planing-priority-matix.png"
          }
          alt={"project planning priority matrix"}
          className="project-planning-priority-matrix-illustration-img"
        />
      </div>
    </div>
  );
}
