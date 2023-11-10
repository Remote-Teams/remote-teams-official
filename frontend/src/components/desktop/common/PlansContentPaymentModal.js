import React from "react";

function PlansContentPaymentModal({
  title,
  imgPath,
  planType,
  planUserCount,
  planPrice,
}) {
  return (
    <>
      {console.log(planUserCount)}
      <h3 className="profile-font-20-bold-space-light">{title}</h3>
      <div className="row mx-0 align-items-start current-plan-section">
        <div className="current-plan-section__img-block">
          <img src={imgPath} alt={`plan ${planType}`} />
        </div>
        <div>
          <div className="current-plan-section__text-block">
            {/** font-18-bold-space-light-uppercase color-white */}
            <h4 className="current-plan-section__text">{planType}</h4>
          </div>
          <p className="font-14-semibold-italic-montserrat opacity-5">
            lorem
            {planType === "ASTRONAUT"
              ? `${planUserCount} User`
              : planType === "ROVER"
              ? `2-${planUserCount} Users`
              : planType === "SPACESHIP"
              ? `6-${planUserCount} Users`
              : planType === "SPACESTATION"
              ? `11-${planUserCount} Users`
              : ""}
          </p>
          <p className="current-plan-section__text-2">{planPrice}/Mo</p>
        </div>
      </div>
    </>
  );
}

export default PlansContentPaymentModal;
