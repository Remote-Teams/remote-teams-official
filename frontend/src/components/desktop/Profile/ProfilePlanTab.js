import React, { Component, Fragment } from "react";
import { withRouter } from "react-router-dom";
import Checkbox from "rc-checkbox";
import "rc-checkbox/assets/index.css";
import GreenButtonSmallFont from "./../common/GreenButtonSmallFont";
import GrayButtonSmallFont from "./../common/GrayButtonSmallFont";
import PlansContent from "../common/PlansContent";
import { connect } from "react-redux";
import {
  getPlansAction,
  logoutUser,
} from "./../../../store/actions/authAction";
import { getAllResourceAction } from "./../../../store/actions/resourcesAction";
import {
  beforePaymentAction,
  afterPaymentSuccessAction,
  upgradePlansOfPaidUsers,
  cancelNextSubscription,
  cancelUserSubscriptin,
  resumeSubscription,
} from "./../../../store/actions/paymentAction";
import isEmpty from "../../../store/validations/is-empty";
import Modal from "react-responsive-modal";
import FreeTrialUserFirstTimePlanTab from "./FreeTrialUserFirstTimePlanTab";

import astronautImg from "../../../assets/img/plans/plans-astronaut.svg";
import roverImg from "../../../assets/img/plans/plans-rover.svg";
import spaceshipImg from "../../../assets/img/plans/plans-spaceship.svg";
import spacecolonyImg from "../../../assets/img/plans/plans-space-colony.svg";
import store from "../../../store/store";
import { SET_LOADER, CLEAR_LOADER } from "./../../../store/types";
import PlansContentPaymentModal from "../common/PlansContentPaymentModal";
import dateFns from "date-fns";

export class ProfilePlanTab extends Component {
  constructor() {
    super();
    this.state = {
      activePlan: "",
      allPlans: {},
      empDeleteWarningPopup: false,
      downgradeWarningPopup: false,
      currentPlanAllData: {},
      selectedPlanData: {},
      prePaymentPopup: false,
      empDeletePopup: false,
      allUsers: {},
      billingHistory: {},
      deleteEmployeeList: [],
      subscriptionId: "",
      firstTimeUserAppearance: true,
      subscriptionUpdatedSuccess: false,
      cancelApprove: false,
      subscriptionCancel: false,
      continueExisting: false,
    };
  }

  /*=========================================================================
                                 Lifecycle Methods
  ===========================================================================*/
  componentDidMount() {
    let userData = JSON.parse(localStorage.getItem("UserData"));
    let organizationData = JSON.parse(localStorage.getItem("OrganizationData"));
    if (!isEmpty(userData)) {
      this.setState({
        activePlan: userData.billingType,
      });
    }
    setTimeout(() => {
      this.props.getPlansAction({ currency: organizationData.currency });
    }, 10);

    this.props.getAllResourceAction();
  }

  static getDerivedStateFromProps(nextProps, nextState) {
    if (
      !isEmpty(nextProps.billingHistory) &&
      nextProps.billingHistory !== nextState.billingHistory
    ) {
      return {
        billingHistory: nextProps.billingHistory,
      };
    }
    if (
      !isEmpty(nextProps.allPlans) &&
      nextProps.allPlans !== nextState.allPlans &&
      !nextState.hasSet
    ) {
      let userData = JSON.parse(localStorage.getItem("UserData"));
      let currentPlan = nextProps.allPlans.filter(
        (plan) => plan.label === userData.billingType
      );
      return {
        allPlans: nextProps.allPlans,
        currentPlanAllData: currentPlan,
        selectedPlanData: currentPlan[0],
        hasSet: true,
      };
    }
    if (
      !isEmpty(nextProps.allUsers) &&
      nextProps.allUsers !== nextState.allUsers
    ) {
      return {
        allUsers: nextProps.allUsers,
      };
    }

    return null;
  }

  firstTimeHandler = () => {
    this.setState({
      firstTimeUserAppearance: false,
    });
  };

  /*==========================================================================
                         Render Employee Delete Popup
  ============================================================================*/

  /*============================
        Checkbox events handler
  =============================*/

  doEmailExist = (email) => {
    let obj = this.state.deleteEmployeeList.find((emp) => emp === email);
    // console.log(obj);
    return obj ? this.state.deleteEmployeeList.indexOf(obj) : false;
  };

  onChangeCheckbox = (email) => (e) => {
    // console.log("Checkbox checked:", email);
    let deleteEmployeeList = this.state.deleteEmployeeList;

    let returnValue = this.doEmailExist(email);
    if (returnValue || returnValue === 0) {
      deleteEmployeeList.splice(returnValue, 1);
    } else {
      deleteEmployeeList.push(email);
    }
    this.setState({
      deleteEmployeeList: deleteEmployeeList,
    });
  };

  toggle = () => {
    this.setState((state) => ({
      disabled: !state.disabled,
    }));
  };

  employeeCancelPopup = () => {
    this.setState({
      empDeletePopup: false,
    });
  };

  renderEmployeeDeletePopup = () => {
    const { empDeletePopup, allUsers, selectedPlanData } = this.state;

    // Get employee count admin added
    let runningPlanEmployeeCreated = allUsers.length;
    return (
      <Modal
        open={empDeletePopup}
        onClose={this.employeeCancelPopup}
        closeOnEsc={true}
        closeOnOverlayClick={false}
        center
        classNames={{
          overlay: "customOverlay",
          modal: "customModal customModal--paymentModal",
          closeButton: "customCloseButton",
        }}
      >
        {/* content */}
        <div className="font-28-bold-letterspace-border-div">
          <h2 className="font-28-bold-letterspace-border">
            Downgrade your plan
          </h2>
        </div>
        <div className="paymentDeleteModalContent paymentDeleteModalContent--team">
          <div className="paymentDeleteModalContent__textBlock">
            <p className="paymentDeleteModalContent__textBlock-text mb-30">
              You are exceeding the number of employees in your selected
              <br />
              <span>
                downgrade plan. We need you to achieve "
                {runningPlanEmployeeCreated - selectedPlanData.maxUsers}" of
                your employees
              </span>
            </p>
            <h3 className="profile-font-20-bold-space-light mb-25">
              Your Team
            </h3>
          </div>
          <ul className="profile-team-overflow-div">
            {!isEmpty(allUsers) &&
              allUsers.map((employee, index) => {
                return (
                  <li key={index}>
                    <div className="row mx-0 flex-nowrap profile-team-overflow-div__row">
                      <div className="customCheckbox mt-20">
                        <Checkbox
                          // id="workingDaysCheckboxMonFri"
                          // value={this.state.workingDaysCheckboxMonFri}
                          // defaultChecked={true}
                          onChange={this.onChangeCheckbox(employee.email)}
                          checked={
                            this.doEmailExist(employee.email) ||
                            this.doEmailExist(employee.email) === 0
                              ? true
                              : false
                          }
                        />
                      </div>
                      <div className="profile-team-overflow-div-img-block">
                        {/*<img
                          src={require("../../../assets/img/dummy/access-role-resource.svg")}
                          alt="person"
                        />*/}
                      </div>
                      <div>
                        <h5 className="profile-team-overflow-div-text1 mb-15">
                          {employee.name}
                        </h5>
                        <h6 className="profile-team-overflow-div-text2">
                          Designation
                        </h6>
                      </div>
                    </div>
                  </li>
                );
              })}
          </ul>
          <div className="text-center">
            <GrayButtonSmallFont
              text="Cancel"
              onClick={this.employeeCancelPopup}
              extraClassName="profile-plan-tab-cancel-btn"
            />
            <GreenButtonSmallFont
              text="Continue"
              onClick={this.continueDowngradeHandler}
            />
          </div>
        </div>
      </Modal>
    );
  };

  /*============================================================================
                              Render PrePayment Popup
  =============================================================================*/
  callBackSubscriptionUpdate = (response) => {
    console.log(response);
    if (response.success === true) {
      this.setState({
        prePaymentPopup: false,
        subscriptionUpdatedSuccess: true,
      });
    }
  };

  upgradePlanOfPaidUser = (userData) => (e) => {
    const PlanInfo = {
      plan: this.state.activePlan,
      workspaceId: userData.workspaceId,
    };
    // console.log(PlanInfo);
    this.props.upgradePlansOfPaidUsers(
      userData.organizationId,
      PlanInfo,
      this.callBackSubscriptionUpdate
    );
    console.log("plan update");
  };

  canclePrePaymentPopup = () => {
    this.setState({
      prePaymentPopup: false,
    });
  };

  renderPrePaymentPopup = () => {
    const { prePaymentPopup, activePlan, selectedPlanData } = this.state;
    let userData = JSON.parse(localStorage.getItem("UserData"));
    console.log(selectedPlanData.monthlyPrice);
    return (
      <Modal
        open={prePaymentPopup}
        onClose={() => console.log("unable to close")}
        closeOnEsc={true}
        closeOnOverlayClick={false}
        center
        classNames={{
          overlay: "customOverlay",
          modal: "customModal customModal--paymentModal",
          closeButton: "customCloseButton",
        }}
      >
        <span
          className="closeIconInModal"
          onClick={this.canclePrePaymentPopup}
        />
        <div>
          {userData.subscriptionType === "FREE" ? (
            <h3 className="font-28-bold-letterspace-border">
              Proceed To Payment
            </h3>
          ) : (
            <h3 className="font-28-bold-letterspace-border">
              Proceed To Upgrade
            </h3>
          )}
        </div>

        <div className="profile-payment-content-block">
          <PlansContentPaymentModal
            title="Your Selected Plan"
            imgPath={
              activePlan === "ROVER"
                ? roverImg
                : activePlan === "ASTRONAUT"
                ? astronautImg
                : activePlan === "SPACESHIP"
                ? spaceshipImg
                : activePlan === "SPACESTATION"
                ? spacecolonyImg
                : ""
            }
            planType={activePlan}
            planUserCount={selectedPlanData.maxUsers}
            planPrice={selectedPlanData.monthlyPrice}
          />
          <div className="pt-10">
            <GrayButtonSmallFont
              text="Cancel"
              onClick={this.canclePrePaymentPopup}
              extraClassName="profile-plan-tab-cancle-btn"
            />
            <GreenButtonSmallFont
              text="Continue"
              onClick={
                userData.subscriptionType === "FREE"
                  ? this.openCheckout(this.afterPyment)
                  : this.upgradePlanOfPaidUser(userData)
              }
            />
          </div>
        </div>
      </Modal>
    );
  };

  /*=====================================================================
                          Render Downgrade plan Warning popup
  =======================================================================*/

  cancelDowngradeWrning = () => {
    this.setState({
      downgradeWarningPopup: false,
    });
  };

  payApiCallback = (data, status) => {
    if (status === 200) {
      store.dispatch({
        type: CLEAR_LOADER,
      });
      this.setState({
        prePaymentPopup: true,
        subscriptionId: data.id,
      });
    }
  };

  continueDowngradeHandler = () => {
    let userData = JSON.parse(localStorage.getItem("UserData"));

    const {
      allUsers,
      // prevPlanMaxUsers,
      selectedPlanData,
    } = this.state;
    const newCount = allUsers.length;

    if (newCount <= selectedPlanData.maxUsers) {
      if (userData.subscriptionType === "FREE") {
        store.dispatch({
          type: SET_LOADER,
        });
      }
      const proceedPayment = {
        plan: this.state.activePlan,
        workspaceId: userData.workspaceId,
      };
      userData.subscriptionType === "FREE" &&
        this.props.beforePaymentAction(proceedPayment, this.payApiCallback);
      userData.subscriptionType === "PAID" &&
        this.setState({
          prePaymentPopup: true,
        });
      this.setState({
        // prePaymentPopup: true,
        downgradeWarningPopup: false,
      });
      // console.log("ready to update");
    } else {
      // this.props.statusEmpty();
      console.log("employe delte popup open");
      this.setState({
        sucess: false,
        empDeletePopup: newCount <= selectedPlanData.maxUsers ? false : true,
        downgradeWarningPopup: false,
      });
    }
  };

  renderdowngradeWarningPopup = () => {
    // get running plan employees
    let userData = JSON.parse(localStorage.getItem("UserData"));
    const {
      downgradeWarningPopup,
      // planMaxUsers,
      currentPlanAllData,
      activePlan,
    } = this.state;

    return (
      <Modal
        open={downgradeWarningPopup}
        onClose={this.cancelDowngradeWrning}
        closeOnEsc={true}
        closeOnOverlayClick={false}
        center
        classNames={{
          overlay: "customOverlay",
          modal: "customModal customModal--paymentModal",
          closeButton: "customCloseButton",
        }}
      >
        {/* content */}
        <div className="font-28-bold-letterspace-border-div">
          <h2 className="font-28-bold-letterspace-border">
            Downgrade your plan
          </h2>
        </div>
        <div className="profile-payment-content-block">
          {console.log(!isEmpty(currentPlanAllData))}
          <PlansContentPaymentModal
            title="Current Plan"
            imgPath={
              userData.billingType === "ROVER"
                ? roverImg
                : userData.billingType === "ASTRONAUT"
                ? astronautImg
                : userData.billingType === "SPACESHIP"
                ? spaceshipImg
                : userData.billingType === "SPACESTATION"
                ? spacecolonyImg
                : ""
            }
            planType={userData.billingType}
            planUserCount={
              !isEmpty(currentPlanAllData) && currentPlanAllData[0].maxUsers
            }
            planPrice={
              !isEmpty(currentPlanAllData) && currentPlanAllData[0].monthlyPrice
            }
          />
          <PlansContentPaymentModal
            title="Downgrading to the plan"
            imgPath={
              activePlan === "ROVER"
                ? roverImg
                : activePlan === "ASTRONAUT"
                ? astronautImg
                : activePlan === "SPACESHIP"
                ? spaceshipImg
                : activePlan === "SPACESTATION"
                ? spacecolonyImg
                : ""
            }
            planType={this.state.activePlan}
            planUserCount={this.state.selectedPlanData.maxUsers}
            planPrice={this.state.selectedPlanData.monthlyPrice}
          />
          <div className="btn-section">
            <GrayButtonSmallFont
              text="Cancel"
              onClick={this.cancelDowngradeWrning}
            />
            <GreenButtonSmallFont
              text="Continue"
              onClick={this.continueDowngradeHandler}
            />
          </div>
        </div>
      </Modal>
    );
  };

  /*=============================================================================
                              Render Plans Section
  ===============================================================================*/

  /*============================
      Update Plan Handler
  =============================*/

  planUpdateHandler = () => (e) => {
    let userData = JSON.parse(localStorage.getItem("UserData"));

    // if (data.subscriptionType === "FREE") {
    //   store.dispatch({
    //     type: SET_LOADER,
    //   });
    // }
    // console.log(this.state.planPrice.substring(1));
    // console.log("success");
    // Get employee count admin added
    const {
      allUsers,
      //  prevPlanMaxUsers,
      selectedPlanData,
    } = this.state;
    const newCount = allUsers.length;
    // console.log(newCount);
    // console.log(planMaxUsers);

    if (newCount <= selectedPlanData.maxUsers) {
      if (userData.subscriptionType === "FREE") {
        store.dispatch({
          type: SET_LOADER,
        });
      }
      const proceedPayment = {
        plan: this.state.activePlan,
        workspaceId: userData.workspaceId,
      };
      userData.subscriptionType === "FREE" &&
        this.props.beforePaymentAction(proceedPayment, this.payApiCallback);
      userData.subscriptionType === "PAID" &&
        this.setState({
          prePaymentPopup: true,
        });
      // this.setState({
      //   prePaymentPopup: true
      // });
      // console.log("ready to update");
    } else {
      console.log("herre");
      // this.props.statusEmpty();
      this.setState({
        sucess: false,
        downgradeWarningPopup: true,
      });
    }
  };

  onClickPlansHandler = (planData) => (e) => {
    var organizationData = JSON.parse(localStorage.getItem("OrganizationData"));
    this.setState({
      activePlan: planData.name,
      selectedPlanData: planData,
    });
    if (this.state.currentPlanAllData[0].maxUsers <= planData.maxUsers) {
      //Do Nothing
    } else if (
      organizationData.nextSubscription !== undefined &&
      organizationData.nextSubscription.nextPlan === planData.label
    ) {
      //Do Nothing
    } else {
      this.setState({
        downgradeWarningPopup: true,
      });
    }
  };

  renderPlansSection = () => {
    const { allPlans, activePlan } = this.state;
    if (!isEmpty(allPlans)) {
      return allPlans.map((planData, index) => {
        return (
          <div
            key={index}
            onClick={this.onClickPlansHandler(planData)}
            className={
              activePlan === planData.name ? "plan_box active_plan" : "plan_box"
            }
          >
            {planData.label === "ASTRONAUT" && (
              <PlansContent
                img={require("../../../assets/img/plans/plans-astronaut.svg")}
                containerClassName={"profile-plans-row--astro"}
                price={planData.monthlyPrice}
                plan={planData.label}
                users={planData.maxUsers}
              />
            )}
            {planData.label === "ROVER" && (
              <PlansContent
                img={require("../../../assets/img/plans/plans-rover.svg")}
                containerClassName={"profile-plans-row--rover"}
                price={planData.monthlyPrice}
                plan={planData.label}
                users={planData.maxUsers}
              />
            )}
            {planData.label === "SPACESHIP" && (
              <PlansContent
                img={require("../../../assets/img/plans/plans-spaceship.svg")}
                containerClassName={"profile-plans-row--ship"}
                price={planData.monthlyPrice}
                plan={planData.label}
                users={planData.maxUsers}
              />
            )}

            {planData.label === "SPACESTATION" && (
              <PlansContent
                img={require("../../../assets/img/plans/plans-space-colony.svg")}
                containerClassName={"profile-plans-row--colony"}
                price={planData.monthlyPrice}
                plan={planData.label}
                users={planData.maxUsers}
              />
            )}
          </div>
        );
      });
    }
  };

  /*==============================================================================
                      Render Subscription Cancel model
  ===============================================================================*/

  logoutHandler = () => {
    this.props.logoutUser();
  };

  callBackSubscriptionCancel = (status) => {
    console.log(status);
    if (status === 200) {
      this.setState({
        cancelApprove: true,
      });
    } else {
      alert("not able to cancel");
    }
  };

  cancelSubscriptionHandler = () => {
    let UserData = JSON.parse(localStorage.getItem("UserData"));
    const formData = {
      plan: UserData.billingType,
      workspaceId: UserData.workspaceId,
    };

    this.props.cancelUserSubscriptin(
      UserData.organizationId,
      formData,
      this.callBackSubscriptionCancel
    );
  };

  renderSubscriptionCancelModel = () => {
    const { subscriptionCancel, billingHistory } = this.state;

    var organizationData = JSON.parse(localStorage.getItem("OrganizationData"));
    var dateFirst = new Date(dateFns.format(new Date(), "MM/DD/YYYY"));
    var dateSecond =
      !isEmpty(organizationData) &&
      new Date(
        dateFns.format(organizationData.subscriptionStarted, "MM/DD/YYYY")
      );
    var timeDiff = dateSecond.getTime() - dateFirst.getTime();

    var diffDays = Math.ceil(Math.abs(timeDiff) / (1000 * 3600 * 24));
    console.log(diffDays);

    const cancelSubscriptionBeforeFiveDays = () => {
      return (
        <div>
          <img
            className="payment-illustration-images"
            src={require("./../../../assets/img/payment/refund_request_initiated.svg")}
            alt=""
          />
          <h3>We are sad to see you go</h3>
          {diffDays <= 5 && billingHistory.length <= 1 ? (
            <p>
              A refund request* has been raised for you which will complete in
              1-2 days.<br></br> You will not be charged monthly fee from next
              billing date.
            </p>
          ) : (
            <p>
              Your subscription has now been cancelled and you will not be
              billed from next month.
            </p>
          )}

          <div
            className={
              diffDays <= 5 && billingHistory.length <= 1
                ? "text-center button_section"
                : "text-center"
            }
          >
            {diffDays <= 5 && billingHistory.length <= 1 && (
              <p>* since you cancelled your subscription within 5 days</p>
            )}
            <GreenButtonSmallFont
              onClick={
                diffDays <= 5 && billingHistory.length <= 1
                  ? this.logoutHandler
                  : this.onCloseModal
              }
              text={
                diffDays <= 5 && billingHistory.length <= 1 ? "Exit" : "Okay"
              }
            />
          </div>
        </div>
      );
    };

    return (
      <Modal
        open={subscriptionCancel}
        onClose={this.onCloseModal}
        closeOnEsc={true}
        closeOnOverlayClick={false}
        center
        classNames={{
          overlay: "",
          modal: "cancel_suscription_warning_profile",
          closeButton: "customCloseButton",
        }}
      >
        <span className="closeIconInModal" onClick={this.onCloseModal} />

        {/* logo */}
        <div>
          {this.state.cancelApprove ? (
            cancelSubscriptionBeforeFiveDays()
          ) : (
            <div>
              <img
                className="payment-illustration-images"
                src={require("./../../../assets/img/payment/cancel_subscription_profile.svg")}
                alt=""
              />
              <h3>Are you sure </h3>
              <p>
                you want to cancel your subscription? <br></br>We have more
                exciting stuff coming on the way!
              </p>
              <div className="button_section">
                <GrayButtonSmallFont onClick={this.onCloseModal} text={"No"} />
                <GreenButtonSmallFont
                  onClick={this.cancelSubscriptionHandler}
                  text={"Yes"}
                />
              </div>
            </div>
          )}
        </div>
      </Modal>
    );
  };

  /*======================================================================

  =======================================================================*/
  renderSubscriptionContinueExistingModel = () => {
    const { continueExisting } = this.state;
    let userData = JSON.parse(localStorage.getItem("UserData"));
    return (
      <Modal
        open={continueExisting}
        onClose={this.onCloseModal}
        closeOnEsc={true}
        closeOnOverlayClick={false}
        center
        classNames={{
          overlay: "",
          modal: "plan_update_sucess",
          closeButton: "customCloseButton",
        }}
      >
        <span className="closeIconInModal" onClick={this.onCloseModal} />
        <div className="warning_before_plan_expired_container">
          <div>
            <img
              className="payment-illustration-images"
              src={require("./../../../assets/img/payment/cancel_subscription_profile.svg")}
              alt=""
            />
            <p>
              Please note that you will continued to be charged for{" "}
              {userData.billingType === "SPACESHIP"
                ? "Spaceship"
                : userData.billingType === "ASTRONAUT"
                ? "Astronaut"
                : userData.billingType === "ROVER"
                ? "Rover"
                : userData.billingType === "SPACESTATION"
                ? "Spacestation"
                : ""}{" "}
              every month
            </p>
            <div className="button_section">
              <GreenButtonSmallFont onClick={this.onCloseModal} text={"Okay"} />
            </div>
          </div>
        </div>
      </Modal>
    );
  };

  /*======================================================================
                    Render After Subscription Updated 
  ========================================================================*/

  onCloseModal = () => {
    this.setState({
      subscriptionUpdatedSuccess: false,
      subscriptionCancel: false,
      continueExisting: false,
    });
  };

  renderSubscriptionUpdatedModel = () => {
    const { subscriptionUpdatedSuccess } = this.state;
    return (
      <Modal
        open={subscriptionUpdatedSuccess}
        onClose={this.onCloseModal}
        closeOnEsc={true}
        closeOnOverlayClick={false}
        center
        classNames={{
          overlay: "",
          modal: "plan_update_sucess",
          closeButton: "customCloseButton",
        }}
      >
        <span className="closeIconInModal" onClick={this.onCloseModal} />
        <div className="warning_before_plan_expired_container">
          <div>
            <img
              className="payment-illustration-images"
              src={require("./../../../assets/img/payment/cancel_subscription_profile.svg")}
              alt=""
            />
            <p>
              You have updated your plan and will be charged for new plan
              starting next <br></br> month as your current plan is in progress.
            </p>
            <div className="button_section">
              <GreenButtonSmallFont onClick={this.onCloseModal} text={"Okay"} />
            </div>
          </div>
        </div>
      </Modal>
    );
  };

  /*=======================================================================
                    Razorpay Payment Hanler
=========================================================================*/

  /*==================================
      After Payment Sucess Handler
====================================*/
  afterPyment = (paymentResponse) => {
    let userData = JSON.parse(localStorage.getItem("UserData"));
    console.log(paymentResponse);
    if (paymentResponse) {
      const afterPayment = {
        workspaceId: userData.workspaceId,
        organizationId: userData.organizationId,
        plan: this.state.activePlan,
        success: true,
        subscriptionId: this.state.subscriptionId,
        paymentId: paymentResponse.razorpay_payment_id,
      };
      this.props.afterPaymentSuccessAction(afterPayment, this.props.history);
    } else {
      console.log("failed");
    }
  };

  openCheckout = (after) => (e) => {
    console.log(this.state.activePlan);
    // const { activePlan } = this.state;
    this.setState({
      prePaymentPopup: false,
    });
    let options = {
      key_id: "rzp_test_ZDy1AcYxHc2peM",
      key_secret: "ZYbRjKyIOr8GrHHLHRhwM6i1",
      subscription_id: this.state.subscriptionId,
      amount: 100, // 2000 paise = INR 20, amount in paisa
      // currency: "INR",
      // order_id: this.state.orderIdData.id,
      name: "Dominate",
      description: "Billing",
      image:
        "https://res.cloudinary.com/myrltech/image/upload/v1578390114/Group_1546.svg",
      handler: function(response) {
        // window.location.href = "/payment-success";
        after(response);
        // alert(response.razorpay_payment_id);
        // alert(response.razorpay_order_id);
        // alert(response.razorpay_signature);
      },
      prefill: {
        name: "Harshil Mathur",
        email: "harshil@razorpay.com",
      },
      notes: {
        address: "Hello World",
      },
      theme: {
        color: "#502effab",
      },
    };

    let rzp = new window.Razorpay(options);
    rzp.open();
  };

  onClickSubscriptionResume = () => {
    console.log("resume subscription");
    let userData = JSON.parse(localStorage.getItem("UserData"));
    this.props.resumeSubscription(userData.organizationId);
  };

  onClickSubscriptionCancel = () => {
    this.setState({
      subscriptionCancel: true,
    });
  };

  callBackCancelSubscription = (status) => {
    let userData = JSON.parse(localStorage.getItem("UserData"));

    if (status) {
      this.setState({
        continueExisting: true,
        activePlan: userData.billingType,
      });
    }
  };

  cancelNextSubscription = () => {
    let userData = JSON.parse(localStorage.getItem("UserData"));
    const formData = {
      plan: userData.billingType,
      workspaceId: userData.workspaceId,
    };
    this.props.cancelNextSubscription(
      userData.organizationId,
      formData,
      this.callBackCancelSubscription
    );
  };

  renderBottomWarningText = () => {
    const { activePlan } = this.state;
    let userData = JSON.parse(localStorage.getItem("UserData"));
    let organizationData = JSON.parse(localStorage.getItem("OrganizationData"));

    return (
      <Fragment>
        <p className="bottom_payment_text_warning">
          {userData.subscriptionType === "PAID" &&
            activePlan === userData.billingType &&
            // organizationData.billingInfo.cancellation_request ===
            //   false &&
            `You already subscribed to ${
              userData.billingType === "ROVER"
                ? "Rover"
                : userData.billingType === "ASTRONAUT"
                ? "Astronaut"
                : userData.billingType === "SPACESHIP"
                ? "Spaceship"
                : userData.billingType === "SPACESTATION"
                ? "Spacestation"
                : ""
            }`}
        </p>
        <p className="bottom_payment_text_warning">
          {organizationData.nextSubscription !== undefined &&
            organizationData.nextSubscription.nextPlan === activePlan &&
            `${
              organizationData.nextSubscription.nextPlan === "ROVER"
                ? "Rover"
                : organizationData.nextSubscription.nextPlan === "ASTRONAUT"
                ? "Astronaut"
                : organizationData.nextSubscription.nextPlan === "SPACESHIP"
                ? "Spaceship"
                : organizationData.nextSubscription.nextPlan === "SPACESTATION"
                ? "Spacestation"
                : ""
            } is already your next subscription`}
        </p>
      </Fragment>
    );
  };

  render() {
    // console.log(this.state.billingHistory);
    // console.log(this.state.currentPlanAllData);
    // console.log(this.state.allUsers);
    // console.log(this.state.deleteEmployeeList);
    const { firstTimeUserAppearance, activePlan } = this.state;
    console.log(this.state.subscriptionId);
    let userData = JSON.parse(localStorage.getItem("UserData"));
    let organizationData = JSON.parse(localStorage.getItem("OrganizationData"));
    let nextSubscriptionPlan =
      !isEmpty(organizationData.nextSubscription) &&
      organizationData.nextSubscription.nextPlan;
    let nextSubsriptionDate =
      !isEmpty(organizationData.nextSubscription) &&
      new Date(organizationData.nextSubscription.nextPlanDate).toISOString();
    nextSubsriptionDate = dateFns.format(nextSubsriptionDate, "Do MMM YYYY");
    if (
      userData.subscriptionType === "FREE" &&
      firstTimeUserAppearance === true
    ) {
      return (
        <FreeTrialUserFirstTimePlanTab
          text={"Pay Now"}
          onClick={this.firstTimeHandler}
        />
      );
    }
    return (
      <Fragment>
        <div className="profile_plans_main_container">
          <div className="plans_container">
            {!isEmpty(organizationData.nextSubscription) &&
              organizationData.nextSubscription !== undefined && (
                <div className="next_plan_label_button_container">
                  <p className="next_subscription_info">
                    Your next subscription plan is{" "}
                    {nextSubscriptionPlan === "ROVER"
                      ? "Rover"
                      : nextSubscriptionPlan === "ASTRONAUT"
                      ? "Astronaut"
                      : nextSubscriptionPlan === "SPACESHIP"
                      ? "Spaceship"
                      : nextSubscriptionPlan === "SPACESTATION"
                      ? "Spacestation"
                      : ""}{" "}
                    which will start on {nextSubsriptionDate}
                  </p>

                  <GrayButtonSmallFont
                    onClick={this.cancelNextSubscription}
                    text="Continue existing"
                  />
                </div>
              )}
            <div className="row mx-auto justify-content-center">
              {this.renderPlansSection()}
              {this.renderdowngradeWarningPopup()}
              {this.renderPrePaymentPopup()}
              {this.renderEmployeeDeletePopup()}
              {this.renderSubscriptionUpdatedModel()}
              {this.renderSubscriptionCancelModel()}
              {this.renderSubscriptionContinueExistingModel()}
            </div>
            <div className="button_section text-right mb-30">
              {userData.subscriptionType === "PAID" &&
                !isEmpty(organizationData.billingInfo) &&
                organizationData.billingInfo.cancellation_request === false && (
                  <GrayButtonSmallFont
                    onClick={this.onClickSubscriptionCancel}
                    text={"Cancel Subscription"}
                  />
                )}
              {userData.subscriptionType === "PAID" &&
                !isEmpty(organizationData.billingInfo) &&
                organizationData.billingInfo.cancellation_request === true && (
                  <GrayButtonSmallFont
                    extraClassName={"resume_subscription"}
                    onClick={this.onClickSubscriptionResume}
                    text={"Resume Subscription"}
                  />
                )}
              {userData.subscriptionType === "PAID" ? (
                <GreenButtonSmallFont
                  onClick={this.planUpdateHandler()}
                  text={"Update plan"}
                  disabled={
                    userData.subscriptionType === "PAID" &&
                    (activePlan === userData.billingType ||
                      (organizationData.nextSubscription !== undefined &&
                        organizationData.nextSubscription.nextPlan ===
                          activePlan))
                      ? "disabled"
                      : ""
                  }
                />
              ) : (
                <GreenButtonSmallFont
                  onClick={this.planUpdateHandler()}
                  text={"Pay Now"}
                />
              )}

              {this.renderBottomWarningText()}
            </div>
          </div>
        </div>
      </Fragment>
    );
  }
}

const mapStateToProps = (state) => ({
  allPlans: state.auth.plans.plans,
  allUsers: state.resources.allResources,
  billingHistory: state.payment.billingHistory,
});

export default connect(mapStateToProps, {
  getPlansAction,
  getAllResourceAction,
  beforePaymentAction,
  afterPaymentSuccessAction,
  upgradePlansOfPaidUsers,
  cancelNextSubscription,
  cancelUserSubscriptin,
  logoutUser,
  resumeSubscription,
})(withRouter(ProfilePlanTab));
