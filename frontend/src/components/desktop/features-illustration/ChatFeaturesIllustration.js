import React from "react";
import GreenLinkSmallFont from "../common/GreenLinkSmallFont";

export default function ChatFeaturesIllustration() {
  return (
    <div className="chat-features-illustration-div text-center">
      <h5 className="font-18-semiBold color-white-48 row justify-content-center mx-0 align-items-center">
        <img
          src={"/img/icons/lock-icon.svg"}
          alt={"lock"}
          className="features-illustration-lock-icon"
        />
        This is a locked feature available in the plan{" "}
        <span className="features-illustration-span-text"> Metaverse</span>{" "}
      </h5>
      <h2 className="illustration-gradient-text">
        Connect &amp; stay in touch with
        <br />
        your team with our chat feature{" "}
      </h2>
      <GreenLinkSmallFont
        path={"/profile"}
        text="Upgrade your plan to Metaverse"
        extraClassName="featutes-illustration-btn mt-50"
      />
      <img
        src={"/img/desktop/features-illustration/chat.png"}
        alt={"chat"}
        className="chat-features-illustration-img"
      />
    </div>
  );
}
