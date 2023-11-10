import React, { Component, Fragment } from "react";
import {
  getPlansAction,
  logoutUser,
} from "./../../../store/actions/authAction";
import { getAllResourceAction } from "./../../../store/actions/resourcesAction";
import {
  beforePaymentAction,
  afterPaymentSuccessAction,
} from "./../../../store/actions/paymentAction";
import PlansContent from "./../common/PlansContent";
import { connect } from "react-redux";
import isEmpty from "../../../store/validations/is-empty";
import Modal from "react-responsive-modal";
import astronautImg from "../../../assets/img/plans/plans-astronaut.svg";
import roverImg from "../../../assets/img/plans/plans-rover.svg";
import spaceshipImg from "../../../assets/img/plans/plans-spaceship.svg";
import spacecolonyImg from "../../../assets/img/plans/plans-space-colony.svg";
import GreenButtonSmallFont from "./../common/GreenButtonSmallFont";
import GrayButtonSmallFont from "./../common/GrayButtonSmallFont";
import Checkbox from "rc-checkbox";
import "rc-checkbox/assets/index.css";
import store from "../../../store/store";
import { SET_LOADER, CLEAR_LOADER } from "./../../../store/types";
import Loader from "react-loader-spinner";
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import PlansContentPaymentModal from "../common/PlansContentPaymentModal";

export class Payment extends Component {
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
      deleteEmployeeList: [],
      subscriptionId: "",
    };
  }

  /*========================================================
                      Lifecycle Methods
  =========================================================*/
  componentDidMount() {
    let userData = JSON.parse(localStorage.getItem("UserData"));
    let organizationData = JSON.parse(localStorage.getItem("OrganizationData"));
    if (!isEmpty(userData)) {
      this.setState({
        activePlan: userData.billingType,
      });
    }
    this.props.getPlansAction({ currency: organizationData.currency });
    this.props.getAllResourceAction();
  }

  static getDerivedStateFromProps(nextProps, nextstate) {
    if (
      !isEmpty(nextProps.allPlans) &&
      nextProps.allPlans !== nextstate.allPlans &&
      !nextstate.hasSet
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
      nextProps.allUsers !== nextstate.allUsers
    ) {
      return {
        allUsers: nextProps.allUsers,
      };
    }
    return null;
  }

  onLogoutHandler = () => {
    this.props.logoutUser();
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
        <h2 className="font-28-bold-letterspace-border">Downgrade your plan</h2>
        <div className="paymentDeleteModalContent">
          <div className="paymentDeleteModalContent__textBlock">
            <p className="font-18-bold mb-30">
              You are exceeding the number of employees in your selected
              downgrade plan. We need you to achieve "
              {runningPlanEmployeeCreated - selectedPlanData.maxUsers}" of your
              employees
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
                      <img
                        src={require("../../../assets/img/dummy/access-role-resource.svg")}
                        alt="person"
                      />
                      <div>
                        <h5 className="font-18-bold-space-light-uppercase color-white mb-15">
                          {employee.name}
                        </h5>
                        <h6 className="font-18-regular">Designation</h6>
                      </div>
                    </div>
                  </li>
                );
              })}
          </ul>
          <div>
            <GrayButtonSmallFont
              text="Cancel"
              onClick={this.employeeCancelPopup}
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
        <div className="employee-warning-popup-container">
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
            />
            <GreenButtonSmallFont
              text="Continue"
              onClick={
                userData.subscriptionType === "FREE"
                  ? this.openCheckout(this.afterPyment)
                  : this.openCheckout(this.afterPyment)
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
      // if (userData.subscriptionType === "FREE") {
      store.dispatch({
        type: SET_LOADER,
      });
      // }
      const proceedPayment = {
        plan: this.state.activePlan,
        workspaceId: userData.workspaceId,
      };
      // userData.subscriptionType === "FREE" &&
      this.props.beforePaymentAction(proceedPayment, this.payApiCallback);
      // userData.subscriptionType === "PAID" &&
      // this.setState({
      //   prePaymentPopup: true,
      // });
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
        <div>
          <h2 className="font-28-bold-letterspace-border">
            Downgrade your plan
          </h2>
        </div>
        <div className="profile-payment-content-block">
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
      // if (userData.subscriptionType === "FREE") {
      store.dispatch({
        type: SET_LOADER,
      });
      // }
      const proceedPayment = {
        plan: this.state.activePlan,
        workspaceId: userData.workspaceId,
      };
      // userData.subscriptionType === "FREE" &&
      this.props.beforePaymentAction(proceedPayment, this.payApiCallback);
      // userData.subscriptionType === "PAID" &&
      //   this.setState({
      //     prePaymentPopup: true,
      //   });
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
                users={`${planData.maxUsers} user`}
              />
            )}
            {planData.label === "ROVER" && (
              <PlansContent
                img={require("../../../assets/img/plans/plans-rover.svg")}
                containerClassName={"profile-plans-row--rover"}
                price={planData.monthlyPrice}
                plan={planData.label}
                users={`${planData.maxUsers} users`}
              />
            )}
            {planData.label === "SPACESHIP" && (
              <PlansContent
                img={require("../../../assets/img/plans/plans-spaceship.svg")}
                containerClassName={"profile-plans-row--ship"}
                price={planData.monthlyPrice}
                plan={planData.label}
                users={`${planData.maxUsers} users`}
              />
            )}

            {planData.label === "SPACESTATION" && (
              <PlansContent
                img={require("../../../assets/img/plans/plans-space-colony.svg")}
                containerClassName={"profile-plans-row--colony"}
                price={planData.monthlyPrice}
                plan={planData.label}
                users={`${planData.maxUsers} users`}
              />
            )}
          </div>
        );
      });
    }
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

  render() {
    // let userData = JSON.parse(localStorage.getItem("UserData"));
    return (
      <Fragment>
        {this.props.auth.loader && (
          <Loader type="Triangle" color="#5ccc40" className="throttle-loader" />
        )}
        <div className="payment-success-main-container">
          <div className="profile_plans_main_container payment-success-box payment-success-box--payment-profile">
            <div className="mb-50">
              <h2 className="font-28-bold-letterspace-border">
                Select your plan
              </h2>
            </div>
            <div className="plans_container">
              <div className="row mx-auto justify-content-center plans_container__row">
                {this.renderPlansSection()}
                {this.renderdowngradeWarningPopup()}
                {this.renderPrePaymentPopup()}
                {this.renderEmployeeDeletePopup()}
              </div>
              <div className="button-section-payment-plans">
                <GrayButtonSmallFont
                  onClick={this.onLogoutHandler}
                  text={"Logout"}
                />

                <GreenButtonSmallFont
                  onClick={this.planUpdateHandler()}
                  text={"Pay now"}
                />
              </div>
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
  auth: state.auth,
});

export default connect(mapStateToProps, {
  getPlansAction,
  getAllResourceAction,
  beforePaymentAction,
  afterPaymentSuccessAction,
  logoutUser,
})(Payment);
