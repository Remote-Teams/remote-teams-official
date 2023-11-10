import React from "react";
import GreenLinkSmallFont from "../common/GreenLinkSmallFont";

export default function FinancesSubscriptionFeaturesIllustration() {
  return (
    <div className="finances-subscription-features-illustration-div">
      <div>
        <h5 className="font-18-semiBold color-white-48 row mx-0 align-items-center flex-nowrap">
          <img
            src={"/img/icons/lock-icon.svg"}
            alt={"lock"}
            className="features-illustration-lock-icon"
          />
          This is a locked feature available in the plan{" "}
          <span className="features-illustration-span-text"> Ark </span>and
          <span className="features-illustration-span-text"> Metaverse </span>
        </h5>
        <h2 className="mt-10 illustration-gradient-text">
          Manage your third party <br />
          subscriptions here
        </h2>
        <h5 className="font-18-semiBold pt-20">
          List out your subscriptions and you can track their details in a
          glance
        </h5>
        <GreenLinkSmallFont
          path={"/profile"}
          text="Upgrade plan to Ark or Metaverse"
          extraClassName="featutes-illustration-btn mt-40"
        />
      </div>
      <div className="finances-subscription-illustration-div">
        <img
          src={"/img/desktop/features-illustration/finances-subscriptions.png"}
          alt={"finances subscription"}
          className="finances-subscription-illustration-img"
        />
      </div>
    </div>
  );
}
