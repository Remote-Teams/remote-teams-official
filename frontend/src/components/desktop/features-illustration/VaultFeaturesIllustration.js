import React from "react";
import GreenLinkSmallFont from "../common/GreenLinkSmallFont";

export default function VaultFeaturesIllustration() {
  return (
    <div className="vault-features-illustration-div">
      <div className="text-center ">
        <h5 className="font-18-semiBold color-white-48 row mx-0 align-items-center justify-content-center flex-nowrap">
          <img
            src={"/img/icons/lock-icon.svg"}
            alt={"lock"}
            className="features-illustration-lock-icon"
          />
          This is a locked feature available in the plan
          <span className="features-illustration-span-text"> Ark</span> and{" "}
          <span className="features-illustration-span-text"> Metaverse</span>
        </h5>
        <h2 className="illustration-gradient-text illustration-gradient-text--vault">
          Add and store your important <br />
          documents and files
        </h2>
        <h5 className="font-18-semiBold pt-20">
          Improve your business by developing workflows which can help you make
          quicker, smarter decisions
        </h5>
        <GreenLinkSmallFont
          path={"/profile"}
          text="Upgrade your plan to Ark or Metaverse"
          extraClassName="featutes-illustration-btn mt-30"
        />
      </div>
      <div>
        <img
          src={"/img/desktop/features-illustration/vault.png"}
          alt={"vault"}
          className="vault-features-illustration-img"
        />
      </div>
    </div>
  );
}
