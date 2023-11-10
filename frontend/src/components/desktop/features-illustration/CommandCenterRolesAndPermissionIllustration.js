import React from "react";
import GreenLinkSmallFont from "../common/GreenLinkSmallFont";

export default function CommandCenterRolesAndPermissionIllustration() {
  return (
    <div className=" cmd-roles-and-permission-illustration-div">
      <div>
        <h5 className="font-18-semiBold color-white-48 row mx-0 align-items-center flex-nowrap">
          <img
            src={"/img/icons/lock-icon.svg"}
            alt={"lock"}
            className="features-illustration-lock-icon"
          />
          This is a locked feature available in the plan{" "}
          <span className="features-illustration-span-text">Ark</span> and{" "}
          <span className="features-illustration-span-text">Metaverse</span>
        </h5>
        <h2 className="mt-50 illustration-gradient-text">
          Manage your team’s Access <br /> and Visibility levels
        </h2>
        <h5 className="font-18-semiBold pt-25">
          You can assign roles to your team members and manage
          <br /> or restrict their permissions
        </h5>
        <GreenLinkSmallFont
          path={"/profile"}
          text="Upgrade your plan to Ark or Metaverse"
          extraClassName="featutes-illustration-btn mt-40"
        />
      </div>
      <div className="cmd-roles-and-permission-illustration-img-div">
        <img
          src={
            "/img/desktop/features-illustration/cmd-roles-and-permission.png"
          }
          alt={"command center roles and permission"}
          className="cmd-roles-and-permission-illustration-img"
        />
      </div>
    </div>
  );
}
