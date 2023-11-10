import React, { useEffect, useState, useRef } from "react";
import Checkbox from "rc-checkbox";
import "rc-checkbox/assets/index.css";
import TimezonePicker from "react-timezone";
import DatePickerFromToTime from "../common/DatePickerFromToTime";
import InputFieldEmailTextPassword from "../common/InputFieldEmailTextPassword";
import GreenButtonSmallFont from "../common/GreenButtonSmallFont";
import { workspaceId } from "./../../../store/actions/config";
import {
  addCompanyWorkingHours,
  getCompanyWorkingHours,
} from "./../../../store/actions/authAction";
import { useDispatch, useSelector } from "react-redux";
import { setHours, setMinutes } from "date-fns";
import isEmpty from "../../../store/validations/is-empty";
import { startOfMonth, endOfMonth } from "date-fns";
import { useHistory } from "react-router";
import { createNewProjectFromWelcomeScreen } from "./../../../store/actions/authAction";

const totalFolds = [0, 1, 2];

export default function LoginFlowWelcomeUser() {
  const history = useHistory();
  const dispatch = useDispatch();
  const [values, setValues] = useState({
    fromTime: setHours(setMinutes(new Date(), 0), 10),
    toTime: setHours(setMinutes(new Date(), 0), 19),
    workingDaysCheckboxMonFri: true,
    workingDaysCheckboxSat: false,
    workingDaysCheckboxSun: false,
    timezoneVal: "Asia/Kolkata",
    projectName: "",
  });

  const [companyHors, setcompanyHors] = useState([]);

  const [screenNum, setScreenNum] = useState(0);

  const companyWorkingHours = useSelector(
    (state) => state.auth.companyWorkingHours
  );

  useEffect(() => {
    var userData = JSON.parse(localStorage.getItem("UserData"));
    dispatch(getCompanyWorkingHours());
    // if (userData.demo === false) {
    //   history.push("/dashboard");
    // }
  }, []);

  useEffect(() => {
    if (!isEmpty(companyWorkingHours)) {
      setcompanyHors(companyWorkingHours);
    } else {
      setcompanyHors([]);
    }
  }, [companyWorkingHours]);

  /*==================================================================
      handlers
  ==================================================================*/

  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const handleCheckboxChange = (e) => {
    setValues({ ...values, [e.target.id]: e.target.checked });
  };

  const handleChangeTimeZone = (timezone) => {
    console.log(timezone);
    setValues({ ...values, timezoneVal: timezone });
  };

  const handleOnClickProceed = () => {
    const {
      workingDaysCheckboxMonFri,
      workingDaysCheckboxSat,
      workingDaysCheckboxSun,
      fromTime,
      toTime,
    } = values;

    let workingDays = [];
    if (
      workingDaysCheckboxMonFri &&
      !workingDaysCheckboxSat &&
      !workingDaysCheckboxSun
    ) {
      workingDays = ["Mon", "Tue", "Wed", "Thrus", "Fri"];
    } else if (
      workingDaysCheckboxMonFri &&
      workingDaysCheckboxSat &&
      !workingDaysCheckboxSun
    ) {
      workingDays = ["Mon", "Tue", "Wed", "Thrus", "Fri", "Sat"];
    } else if (
      workingDaysCheckboxMonFri &&
      !workingDaysCheckboxSat &&
      workingDaysCheckboxSun
    ) {
      workingDays = ["Mon", "Tue", "Wed", "Thrus", "Fri", "Sun"];
    } else if (
      workingDaysCheckboxMonFri &&
      workingDaysCheckboxSun &&
      workingDaysCheckboxSat
    ) {
      workingDays = ["Sun", "Mon", "Tue", "Wed", "Thrus", "Fri", "Sat"];
    } else if (
      !workingDaysCheckboxMonFri &&
      workingDaysCheckboxSun &&
      workingDaysCheckboxSat
    ) {
      workingDays = ["Sat", "Sun"];
    } else if (
      !workingDaysCheckboxMonFri &&
      !workingDaysCheckboxSun &&
      workingDaysCheckboxSat
    ) {
      workingDays = ["Sat"];
    } else if (
      !workingDaysCheckboxMonFri &&
      workingDaysCheckboxSun &&
      !workingDaysCheckboxSat
    ) {
      workingDays = ["Sun"];
    }

    const formData = {
      profile: "Profile one",
      fromTime: fromTime.toISOString(),
      toTime: toTime.toISOString(),
      workingDays: workingDays,
      location: "Pune",
      timezone: values.timezoneVal,
      status: "ACTIVE",
    };

    if (isEmpty(companyHors)) {
      dispatch(addCompanyWorkingHours(formData, "", callblackAdd));
    } else {
      setScreenNum(1);
    }
  };

  const handleOnClickCoolLetsGo = () => {
    setScreenNum(2);
  };

  const callblackAdd = (status) => {
    if (status === 200) {
      setScreenNum(1);
    }
  };

  const callblackAddGoToDashboard = (status) => {
    if (status === 200) {
      if (process.env.NODE_ENV === "development") {
        window.location.href = `http://localhost:3000/dashboard`;
      } else {
        window.location.href = `https://${workspaceId}.remote-teams.io/dashboard`;
      }
    }
  };

  const handleOnClickGoTodashboard = () => {
    // console.log(values);
    const {
      workingDaysCheckboxMonFri,
      workingDaysCheckboxSat,
      workingDaysCheckboxSun,
      fromTime,
      toTime,
    } = values;

    let workingDays = [];
    if (
      workingDaysCheckboxMonFri &&
      !workingDaysCheckboxSat &&
      !workingDaysCheckboxSun
    ) {
      workingDays = ["Mon", "Tue", "Wed", "Thrus", "Fri"];
    } else if (
      workingDaysCheckboxMonFri &&
      workingDaysCheckboxSat &&
      !workingDaysCheckboxSun
    ) {
      workingDays = ["Mon", "Tue", "Wed", "Thrus", "Fri", "Sat"];
    } else if (
      workingDaysCheckboxMonFri &&
      !workingDaysCheckboxSat &&
      workingDaysCheckboxSun
    ) {
      workingDays = ["Mon", "Tue", "Wed", "Thrus", "Fri", "Sun"];
    } else if (
      workingDaysCheckboxMonFri &&
      workingDaysCheckboxSun &&
      workingDaysCheckboxSat
    ) {
      workingDays = ["Sun", "Mon", "Tue", "Wed", "Thrus", "Fri", "Sat"];
    } else if (
      !workingDaysCheckboxMonFri &&
      workingDaysCheckboxSun &&
      workingDaysCheckboxSat
    ) {
      workingDays = ["Sat", "Sun"];
    } else if (
      !workingDaysCheckboxMonFri &&
      !workingDaysCheckboxSun &&
      workingDaysCheckboxSat
    ) {
      workingDays = ["Sat"];
    } else if (
      !workingDaysCheckboxMonFri &&
      workingDaysCheckboxSun &&
      !workingDaysCheckboxSat
    ) {
      workingDays = ["Sun"];
    }

    const formData = {
      profile: "Profile one",
      fromTime: fromTime.toISOString(),
      toTime: toTime.toISOString(),
      workingDays: workingDays,
      location: "Pune",
      timezone: values.timezoneVal,
      status: "ACTIVE",
    };
    if (isEmpty(companyHors)) {
      dispatch(addCompanyWorkingHours(formData, "", callblackAddGoToDashboard));
    } else {
      if (process.env.NODE_ENV === "development") {
        window.location.href = `http://localhost:3000/dashboard`;
      } else {
        window.location.href = `https://${workspaceId}.remote-teams.io/dashboard`;
      }
    }
  };

  const handleOnClickSaveProjectData = () => {
    // console.log(values);

    const {
      workingDaysCheckboxMonFri,
      workingDaysCheckboxSat,
      workingDaysCheckboxSun,
      fromTime,
      toTime,
    } = values;

    let workingDays = [];
    if (
      workingDaysCheckboxMonFri &&
      !workingDaysCheckboxSat &&
      !workingDaysCheckboxSun
    ) {
      workingDays = ["Mon", "Tue", "Wed", "Thrus", "Fri"];
    } else if (
      workingDaysCheckboxMonFri &&
      workingDaysCheckboxSat &&
      !workingDaysCheckboxSun
    ) {
      workingDays = ["Mon", "Tue", "Wed", "Thrus", "Fri", "Sat"];
    } else if (
      workingDaysCheckboxMonFri &&
      !workingDaysCheckboxSat &&
      workingDaysCheckboxSun
    ) {
      workingDays = ["Mon", "Tue", "Wed", "Thrus", "Fri", "Sun"];
    } else if (
      workingDaysCheckboxMonFri &&
      workingDaysCheckboxSun &&
      workingDaysCheckboxSat
    ) {
      workingDays = ["Sun", "Mon", "Tue", "Wed", "Thrus", "Fri", "Sat"];
    } else if (
      !workingDaysCheckboxMonFri &&
      workingDaysCheckboxSun &&
      workingDaysCheckboxSat
    ) {
      workingDays = ["Sat", "Sun"];
    } else if (
      !workingDaysCheckboxMonFri &&
      !workingDaysCheckboxSun &&
      workingDaysCheckboxSat
    ) {
      workingDays = ["Sat"];
    } else if (
      !workingDaysCheckboxMonFri &&
      workingDaysCheckboxSun &&
      !workingDaysCheckboxSat
    ) {
      workingDays = ["Sun"];
    }

    const formData = {
      profile: "Profile one",
      fromTime: fromTime.toISOString(),
      toTime: toTime.toISOString(),
      workingDays: workingDays,
      location: "Pune",
      timezone: values.timezoneVal,
      status: "ACTIVE",
    };

    if (isEmpty(companyHors)) {
      dispatch(addCompanyWorkingHours(formData, "", callblackAddProjectAlso));
    } else {
      const formData = {
        name: values.projectName,
        client: "",
        logo: "",
        startDate: startOfMonth(new Date()).toISOString(),
        endDate: endOfMonth(new Date()).toISOString(),
        estimatedCTC: "",
        estimatedHours: "",
        description: "",
        resources: [],
        status: "UPCOMING",
        tags: [],
      };

      dispatch(createNewProjectFromWelcomeScreen(formData, history));
    }

    // if (process.env.NODE_ENV === "development") {
    //   window.location.href = `http://localhost:3000/all-projects`;
    // } else {
    //   window.location.href = `https://${workspaceId}.remote-teams.io/all-projects`;
    // }
  };

  const callblackAddProjectAlso = (status) => {
    if (status === 200) {
      const formData = {
        name: values.projectName,
        client: "",
        logo: "",
        startDate: startOfMonth(new Date()).toISOString(),
        endDate: endOfMonth(new Date()).toISOString(),
        estimatedCTC: "",
        estimatedHours: "",
        description: "",
        resources: [],
        status: "UPCOMING",
        tags: [],
      };

      dispatch(createNewProjectFromWelcomeScreen(formData, history));
    }
  };

  /*==================================================================
      renderTimeRow
  ==================================================================*/
  // handlers

  const handleChangeFromTime = (time) => {
    console.log(time);
    if (time === null) {
      setValues({ ...values, fromTime: new Date() });
    } else {
      setValues({ ...values, fromTime: time });
    }
  };

  const handleChangeToTime = (time) => {
    if (time === null) {
      setValues({ ...values, toTime: new Date() });
    } else {
      setValues({ ...values, toTime: time });
    }
  };

  // renderTimeRow
  const renderTimeRow = () => {
    return (
      <div className="rt-login-welcome-user-datepicker-time">
        <DatePickerFromToTime
          extraClassName="align-items-center"
          title={false}
          isTo={true}
          fromTimeValue={values.fromTime}
          toTimeValue={values.toTime}
          handleChangeFromTime={handleChangeFromTime}
          handleChangeToTime={handleChangeToTime}
        />
      </div>
    );
  };

  /*==================================================================
      renderWorkingDays
  ==================================================================*/
  const renderWorkingDays = () => {
    return (
      <div className="mb-25">
        <h3 className="font-18-semiBold mb-35">Working Days</h3>
        <div className="row mx-0 align-items-center">
          {/* 1 */}
          <div className="customCheckbox">
            <Checkbox
              id="workingDaysCheckboxMonFri"
              onChange={handleCheckboxChange}
              value={values.workingDaysCheckboxMonFri}
              checked={values.workingDaysCheckboxMonFri}
              defaultChecked={true}
            />
            <label htmlFor="workingDaysCheckboxMonFri">
              {/*<span className="font-24-semiBold ml-30">Mon-Fri</span>*/}
              <span className="font-14-semibold ml-30">Monday - Friday</span>
            </label>
          </div>
          {/* 2 */}
          <div className="customCheckbox">
            <Checkbox
              id="workingDaysCheckboxSat"
              onChange={handleCheckboxChange}
              value={values.workingDaysCheckboxSat}
              checked={values.workingDaysCheckboxSat}
              defaultChecked={false}
            />
            <label htmlFor="workingDaysCheckboxSat">
              {/*<span className="font-24-semiBold ml-30">Sat</span>*/}
              <span className="font-14-semibold ml-30">Saturday</span>
            </label>
          </div>
          {/* 3 */}
          <div className="customCheckbox">
            <Checkbox
              id="workingDaysCheckboxSun"
              onChange={handleCheckboxChange}
              value={values.workingDaysCheckboxSun}
              checked={values.workingDaysCheckboxSun}
              defaultChecked={false}
            />
            <label htmlFor="workingDaysCheckboxSun">
              {/*<span className="font-24-semiBold ml-30">Sun</span>*/}
              <span className="font-14-semibold ml-30">Sunday</span>
            </label>
          </div>
        </div>
      </div>
    );
  };

  /*==================================================================
      renderTimezone
  ==================================================================*/
  const renderTimezone = () => {
    return (
      <div className="set-hours-time-zone">
        {/*<h3 className="font-18-bold-space-light-uppercase mb-20">timezone</h3>*/}
        <h3 className="font-18-semiBold mb-35">And Timezone</h3>
        <div className="timezone-custom">
          <TimezonePicker
            value={values.timezoneVal}
            onChange={handleChangeTimeZone}
            inputProps={{
              placeholder: "Select Timezone...",
              name: "timezone",
            }}
          />
        </div>
      </div>
    );
  };

  /*==================================================================
      renderProjectName
  ==================================================================*/
  const renderProjectName = () => {
    return (
      <div className="rt-login-welcome-user-project-name">
        <label htmlFor="projectName" className="font-18-semiBold">
          What would you like to name your first project?
        </label>
        <InputFieldEmailTextPassword
          containerClassName="container-login-flow-input container-login-flow-input--forms"
          //label=""
          placeholder="Project Name"
          name="projectName"
          value={values.projectName}
          onChange={handleChange}
          type="text"
          // error={values.error.projectName}
        />
      </div>
    );
  };

  /*==================================================================
      renderPageTitleBlock
  ==================================================================*/
  const renderPageTitleBlock = () => {
    return (
      <>
        <h2 className="rt-welcome-user-title-text-1">Alright!</h2>
        <h2 className="font-24-semiBold color-white-79 rt-welcome-user-text-1">
          Let&rsquo;s just complete these 3 things <br /> and we are good to go!
        </h2>
      </>
    );
  };

  /*==================================================================
      main
  ==================================================================*/
  const orgDataLocalStorage = JSON.parse(
    localStorage.getItem("OrganizationData")
  );

  return (
    <div className="row mx-0 align-items-start justify-content-center rt-login-welcome-user-main-page">
      <figure className="rt-login-welcome-user-main-page__illustration-1">
        <img src="/img/welcome-user/welcome-user-illustration.png" alt="" />
      </figure>
      <div className="rt-login-welcome-user-main-page__content">
        <div className="rt-login-welcome-user-main-block">
          {/* buttons indicatiors */}
          <div className="rt-welcome-user-circle-btns-block">
            {/* <h3 className="font-14-semibold mb-15">Scroll</h3>
             <div className="rt-welcome-user-circle-btns-block__line"></div> */}
            {totalFolds.map((data, index) => (
              <div key={index} className="mb-10">
                <div
                  className={
                    screenNum === data
                      ? "rt-welcome-user-circle-btns-block__btn rt-welcome-user-circle-btns-block__btn--active"
                      : "rt-welcome-user-circle-btns-block__btn"
                  }
                >
                  <span>{screenNum === data && screenNum + 1}</span>
                  <i className="fa fa-circle"></i>
                </div>
              </div>
            ))}
          </div>

          {/* screen 0 */}
          {screenNum === 0 && (
            <div
              id="rt-login-welcome-user-company-working-hrs-fold-id"
              className="rt-login-welcome-user-fold rt-login-welcome-user-fold--screen0"
            >
              {renderPageTitleBlock()}
              <div className="rt-login-welcome-user-content-block">
                <h2 className="rt-welcome-user-title-text-2">
                  Your company working hours are?
                </h2>
                <div className="rt-login-welcome-user-content-block__content">
                  {/* time row */}
                  {renderTimeRow()}
                  {/* working days */}
                  {renderWorkingDays()}
                  {/* timezone */}
                  {renderTimezone()}
                </div>
                <div className="rt-wc-user-screen-0-proceed-btn-div">
                  <GreenButtonSmallFont
                    text={
                      <span>
                        Proceed
                        <img
                          src="/img/welcome-user/welcome-user-button-arrow-right-white.svg"
                          alt="next"
                        />
                      </span>
                    }
                    onClick={handleOnClickProceed}
                    extraClassName="rt-login-welcome-user-details-save-btn"
                  />
                </div>
              </div>
              <div className="row mx-0 align-items-center justify-content-center rt-login-welcome-user-screen-0-img-div">
                <img
                  src="/img/welcome-user/welcome-user-screen-0-dummy.svg"
                  alt=""
                  className="rt-login-welcome-user-screen-0-img"
                />
              </div>
            </div>
          )}
          {/* screen 1 */}
          {screenNum === 1 && (
            <div className="rt-login-welcome-user-fold text-center">
              {renderPageTitleBlock()}
              <div className="rt-login-welcome-user-content-block">
                <div className="rt-login-welcome-user-content-block__illustration-1">
                  <img
                    src="/img/welcome-user/welcome-user-illustration-1.png"
                    alt=""
                  />
                </div>
                <h2 className="rt-welcome-user-title-text-2 text-ceneter rt-wc-user-text-mb">
                  Great, your workspace is now all set up!
                </h2>
                <p className="font-18-semiBold color-white-79 rt-wc-user-text-mb">
                  The timings added will help you and your team <br /> in
                  tracking time better!!
                </p>
                <p className="font-18-extraBold color-white-79 rt-wc-user-text-mb">
                  Why dont we setup a project next!!
                </p>
                <div className="rt-wc-user-text-mb">
                  <GreenButtonSmallFont
                    text="Cool, Lets go !"
                    onClick={handleOnClickCoolLetsGo}
                    extraClassName="rt-login-welcome-user-details-save-btn"
                  />
                </div>
                <button
                  className="rt-login-welcome-user-content-block__goToDashboardBtn"
                  onClick={handleOnClickGoTodashboard}
                >
                  No, take me to Dashboard
                </button>
              </div>
            </div>
          )}
          {/* screen 2 */}
          {screenNum === 2 && (
            <>
              <div className="rt-login-welcome-user-fold">
                {renderPageTitleBlock()}
                <div className="rt-login-welcome-user-content-block">
                  <h2 className="rt-welcome-user-title-text-2 text-ceneter">
                    Let&rsquo;s set up your project
                  </h2>
                  <div className="rt-login-welcome-user-content-block__content pl-0 text-center">
                    {/* project name */}
                    {renderProjectName()}
                    <GreenButtonSmallFont
                      text="Take me to the Project"
                      onClick={handleOnClickSaveProjectData}
                      extraClassName="rt-login-welcome-user-details-save-btn"
                    />
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
