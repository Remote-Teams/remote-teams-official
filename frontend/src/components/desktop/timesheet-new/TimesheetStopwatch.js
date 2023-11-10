import React, { useState } from "react";
import { useStopwatch } from "react-timer-hook";
import GrayButtonSmallFont from "../common/GrayButtonSmallFont";
import GreenButtonSmallFont from "../common/GreenButtonSmallFont";

export default function TimesheetStopwatch({ isDayActive }) {
  const {
    seconds,
    minutes,
    hours,
    // days,
    // isRunning,
    start,
    pause,
    reset,
  } = useStopwatch({ autoStart: true });

  const [values, setValues] = useState({
    isTimerStarted: false,
  });

  const handleOnClickStartTimer = (e) => {
    setValues({
      ...values,
      isTimerStarted: true,
    });
  };

  const handleOnClickStopTimer = (e) => {
    setValues({
      ...values,
      isTimerStarted: true,
    });
  };

  const handleOnClickStartNewTimer = (e) => {
    setValues({
      ...values,
      isTimerStarted: false,
    });
  };

  return (
    <>
      <div className="row mx-0 align-items-center">
        {isDayActive && !values.isTimerStarted && (
          <div onClick={handleOnClickStartTimer}>
            <GreenButtonSmallFont
              extraClassName="timesheet-start-timer-btn"
              onClick={start}
              text={
                <>
                  <img
                    src="/img/icons/white-stopwatch-icon.svg"
                    alt="stopwatch"
                  />
                  start timer
                </>
              }
            />
          </div>
        )}

        {isDayActive && values.isTimerStarted && (
          <>
            <div onClick={handleOnClickStopTimer}>
              <GrayButtonSmallFont
                extraClassName="timesheet-stop-timer-btn"
                onClick={pause}
                text={
                  <>
                    <i className="fa fa-stop"></i> stop timer
                  </>
                }
              />
            </div>
            {/* <div onClick={handleOnClickStartNewTimer}> */}
            <GrayButtonSmallFont
              extraClassName="timesheet-start-new-timer-btn"
              onClick={reset}
              text={
                <>
                  <img
                    src="/img/icons/green-stopwatch-icon.svg"
                    alt="stopwatch"
                  />{" "}
                  start new
                </>
              }
            />
            {/* </div> */}
            <span className="timesheet-month-view-per-day-row1__text-td timesheet-month-view-per-day-row1__text-td--dayView">
              {/* 00:32:23 */}
              {hours}:{minutes}:{seconds}
            </span>
          </>
        )}
      </div>
    </>
  );
}
