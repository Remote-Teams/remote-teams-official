import React from "react";
import GreenLinkSmallFont from "../common/GreenLinkSmallFont";

export default function ProjectScrumFeaturesIllustration() {
  return (
    <div className="project-scrum-features-illustration-div">
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
          Organise scrums to help team to
          <br />
          come together learn and improve
        </h2>
        <h5 className="font-18-semiBold pt-20">
          crum encourages teams to learn through experiences, self-organize
          while
          <br /> working on a problem, and reflect on their wins and losses to
          continuously
          <br /> improve{" "}
        </h5>
        <GreenLinkSmallFont
          path={"/profile"}
          text="Upgrade plan to Metaverse"
          extraClassName="featutes-illustration-btn mt-30"
        />
      </div>
      <div className="project-scrum-features-illustration-img-div">
        <img
          src={"/img/desktop/features-illustration/project-scrum.png"}
          alt={"project scrum"}
          className="project-scrum-features-illustration-img"
        />
      </div>
    </div>
  );
}
