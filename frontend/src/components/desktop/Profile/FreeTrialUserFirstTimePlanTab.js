import React, { useEffect, useState } from "react";
import GreenButtonSmallFont from "./../common/GreenButtonSmallFont";
import dateFns from "date-fns";
import isEmpty from "../../../store/validations/is-empty";
import { useSelector } from "react-redux";

export default function FreeTrialUserFirstTimePlanTab({ onClick }) {
  const [membersCount, setMembersCount] = useState(0);

  var OrganizationData = JSON.parse(localStorage.getItem("OrganizationData"));

  const allUsers = useSelector((state) => state.resources.allResources);

  useEffect(() => {
    if (!isEmpty(allUsers)) {
      setMembersCount(allUsers.length);
    }
  }, [allUsers]);

  return (
    <div className="row mx-0 flex-nowrap profile-plan-end-notify">
      <div className="profile-plan-end-notify__img-block">
        <img
          src={require("../../../assets/img/illustrations/plan-end-notify.svg")}
          alt=""
        />
      </div>
      <div className="profile-plan-end-notify__text-block">
        <h3 className="plan-end-text1">Hi there,</h3>
        <h4 className="plan-end-text2">
          {/*Want to invite your team ?*/}You are currently in free plan.
        </h4>
        <h4 className="plan-end-text3">
          {/*You can by upgrading your plan!!*/}Do you want to use remote teams
          without any
          <br />
          limitations{" "}
        </h4>
        {/* <h5 className="plan-end-text3">
          {dateFns.format(
            !isEmpty(organizationData) && organizationData.expirationDate,
            "Do MMMM	YYYY"
          )} 
        </h5> */}
        <p className="plan-end-text4">
          {/*Pay now to collaborate and track sales of your sales team on Dominate*/}
          You can pay now!
        </p>
        <GreenButtonSmallFont text={"Pay Now"} onClick={onClick} />
        <h4 className="font-18-bold-space-light-uppercase font-18-bold-space-light-uppercase--plans-member-text">
          Current team size
        </h4>
        <div className="row mx-0 align-items-center plans-end-member-div-block">
          <div className="plans-end-member-img-block">
            <img
              src={require("../../../assets/img/dummy/new-profile-circular-img.png")}
              alt="member"
            />
          </div>
          <h5 className="plans-end-member-count">{membersCount} Members</h5>
        </div>
      </div>
    </div>
  );
}
