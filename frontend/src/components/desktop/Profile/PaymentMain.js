import React, { Fragment, useState, useEffect } from "react";
import Prices from "./Prices";
import Account from "./Account";
import isEmpty from "../../../store/validations/is-empty";
import dateFns from "date-fns";
import AlreadyCanceledSubscription from "./../popups/AlreadyCanceledSubscription";
import { useDispatch, useSelector } from "react-redux";
// import { getAllLeadsCount } from "./../../../store/actions/leadAction";
// import { getAllEmployees } from "./../../../store/actions/employeeAction";

import FreeTrialUserFirstTimePlanTab from "./FreeTrialUserFirstTimePlanTab";

const PaymentMain = () => {
  const dispatch = useDispatch();
  const [freeTrialScreen, setFreeTrial] = useState("");

  const [alreadySubscribedUser, setPaidUser] = useState("");

  const [canceledSubscriptionPopup, setCanceledSubscriptionPopup] = useState(
    false
  );

  const [leadsCount, setLeadsCount] = useState("");

  const [memebreCount, setMemebreCount] = useState("");

  //   //selectors from state
  //   const allLeadsCount = useSelector((state) => state.leads.allLeadCount);

  //   const allMembers = useSelector((state) => state.employee.allEmployees);

  //   useEffect(() => {
  //     if (!isEmpty(allLeadsCount)) {
  //       setLeadsCount(allLeadsCount);
  //     }
  //   }, [allLeadsCount]);

  //   useEffect(() => {
  //     if (!isEmpty(allMembers)) {
  //       console.log(allMembers);
  //       setMemebreCount(allMembers.length);
  //     }
  //   }, [allMembers]);

  useEffect(() => {
    let OrganizationData = JSON.parse(localStorage.getItem("OrganizationData"));
    if (OrganizationData.planStatus === "CANCELLED") {
      setCanceledSubscriptionPopup(true);
    }
    // console.log(OrganizationData);
    if (!isEmpty(OrganizationData) && OrganizationData.planStatus === "TRIAL") {
      setFreeTrial(true);
    } else if (
      !isEmpty(OrganizationData) &&
      OrganizationData.planStatus === "PAID"
    ) {
      setPaidUser(true);
    } else {
      // setPaidUser(true);
    }
    // dispatch(getAllLeadsCount());
    // dispatch(getAllEmployees());
  }, []);

  const firstApperanceClick = (e) => {
    setFreeTrial(false);
  };

  const onCloseHandler = () => {
    setCanceledSubscriptionPopup(false);
  };

  if (freeTrialScreen === true) {
    let OrganizationData = JSON.parse(localStorage.getItem("OrganizationData"));
    return (
      <Fragment>
        <FreeTrialUserFirstTimePlanTab onClick={firstApperanceClick} />
      </Fragment>
    );
  } else {
    if (alreadySubscribedUser) {
      return <Account />;
    } else {
      return (
        <>
          <AlreadyCanceledSubscription
            canceledSubscriptionPopup={canceledSubscriptionPopup}
            onCloseHandler={onCloseHandler}
          />
          <Prices />
        </>
      );
    }
  }
};

export default PaymentMain;
