import React from "react";
import GreenLinkSmallFont from "../common/GreenLinkSmallFont";

export default function PresentationsFeaturesIllustration() {
  return (
    <div className="presentations-features-illustration-div">
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
          Create Charming and detailed
          <br /> presentations
        </h2>
        <h5 className="font-18-semiBold pt-20">
          Woo your cliental with attractive presentations. You can create
          comprehensive presentations using our tool
        </h5>
        <GreenLinkSmallFont
          path={"/profile"}
          text="Upgrade plan to Ark or Metaverse "
          extraClassName="featutes-illustration-btn mt-50"
        />
      </div>
      <div className="presentations-features-illustration-img-div">
        <img
          src={"/img/desktop/features-illustration/presentations.png"}
          alt={"presentations"}
          className="presentations-features-illustration-img"
        />
      </div>
    </div>
  );
}
