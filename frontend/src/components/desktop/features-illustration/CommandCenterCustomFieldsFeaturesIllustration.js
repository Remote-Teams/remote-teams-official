import React from "react";
import GreenLinkSmallFont from "../common/GreenLinkSmallFont";

export default function CommandCenterCustomFieldsFeaturesIllustration() {
  return (
    <div className="cmd-custom-fields-features-illustration-div">
      <div>
        <h5 className="font-18-semiBold color-white-48 row mx-0 align-items-end flex-nowrap">
          <img
            src={"/img/icons/lock-icon.svg"}
            alt={"lock"}
            className="features-illustration-lock-icon"
          />
          This is a locked feature available in the plan
          <span className="features-illustration-span-text">Metaverse</span>
          {/* higher plans{" "} */}
        </h5>
        <h2 className="mt-40 illustration-gradient-text">
          Customise the information
          <br />
          you are gathering as per your
          <br /> needs{" "}
        </h2>
        <h5 className="font-18-semiBold pt-25">
          You can create custom fields and include them while adding
          <br /> new client, resource etc.{" "}
        </h5>
        <GreenLinkSmallFont
          path={"/profile"}
          text="Upgrade your plan to Metaverse"
          extraClassName="featutes-illustration-btn mt-40"
        />
      </div>
      <div className="cmd-custom-fields-features-illustration-img-div">
        <img
          src={"/img/desktop/features-illustration/cmd-custom-fields.png"}
          alt={"command center custom fields"}
          className="cmd-custom-fields-illustration-img"
        />
      </div>
    </div>
  );
}
