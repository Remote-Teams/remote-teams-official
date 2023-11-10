import React from "react";

function PlansContent({ img, containerClassName, price, plan, users }) {
  return (
    <>
      <div
        className={`row mx-0 flex-nowrap profile-plans-row ${containerClassName}`}
      >
        <div className="profile-plans-row__img-div">
          <img src={img} alt={`plan ${plan}`} className="img-wh-100" />
        </div>
        <div>
          <h3 className="font-33-semiBold">{price}/Mo</h3>
          <h4 className="font-18-bold-space-light-uppercase">{plan}</h4>
          <h5 className="font-18-italic">
            {plan === "ASTRONAUT"
              ? `${users} User`
              : plan === "ROVER"
              ? `2-${users} Users`
              : plan === "SPACESHIP"
              ? `6-${users} Users`
              : plan === "SPACESTATION"
              ? `11-${users} Users`
              : ""}
          </h5>
        </div>
      </div>
    </>
  );
}

export default PlansContent;
