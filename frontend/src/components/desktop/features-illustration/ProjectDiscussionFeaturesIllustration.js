import React from "react";
import GreenLinkSmallFont from "../common/GreenLinkSmallFont";

export default function ProjectDiscussionFeaturesIllustration() {
  return (
    <div className="project-discussion-features-illustration-div">
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
        <h2 className="mt-50 illustration-gradient-text">
          Create Topics and <br />
          discuss ideas and more <br />
          with your team
        </h2>
        <h5 className="font-18-semiBold pt-25">
          Get an accurate summary of various parameters of projects <br /> and
          tasks
        </h5>
        <GreenLinkSmallFont
          path={"/profile"}
          text="Upgrade plan to Metaverse"
          extraClassName="featutes-illustration-btn mt-30"
        />
      </div>
      <div className="project-discussion-features-illustration-img-div">
        <img
          src={"/img/desktop/features-illustration/project-discussion.png"}
          alt={"project discussion"}
          className="project-discussion-features-illustration-img"
        />
      </div>
    </div>
  );
}
