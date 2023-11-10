import React from "react";
import GreenLinkSmallFont from "../common/GreenLinkSmallFont";

export default function FinancesInvoiceFeaturesIllustration() {
  return (
    <div className="finances-invoice-features-illustration-div">
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
          Track your sales and manage
          <br />
          your finances
        </h2>
        <h5 className="font-18-semiBold pt-20">
          Create invoices for your clients and share them{" "}
        </h5>
        <GreenLinkSmallFont
          path={"/profile"}
          text="Upgrade plan to Ark or Metaverse"
          extraClassName="featutes-illustration-btn mt-40"
        />
      </div>
      <div className="finances-invoice-illustration-div">
        <img
          src={"/img/desktop/features-illustration/finances-invoice.png"}
          alt={"finances invoice"}
          className="finances-invoice-illustration-img"
        />
      </div>
    </div>
  );
}
