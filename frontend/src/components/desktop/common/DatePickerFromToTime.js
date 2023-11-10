import React from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

function DatepickerFromToTime({
  extraClassName,
  title,
  fromTimeValue,
  toTimeValue,
  handleChangeFromTime,
  handleChangeToTime,
  defaultFromTime,
  defaultToTime,
  fromPlaceholder,
  toPlaceholder,
  readOnly,
  isTo,
}) {
  return (
    <>
      <div className={`row mx-0 ${extraClassName}`}>
        {title !== false && (
          <div className="col-12 px-0">
            <h3 className="font-18-bold-space-light-uppercase mb-20">
              {title}
            </h3>
          </div>
        )}
        <div
          className={
            title === false ? "datepicker-mr" : "set-hours-time-row__colm1"
          }
        >
          {title === false && (
            <h3 className="font-18-bold-space-light-uppercase mb-20 opacity-0">
              from time
            </h3>
          )}
          <div className="date-picker-common">
            <DatePicker
              selected={fromTimeValue}
              onChange={handleChangeFromTime}
              showTimeSelect
              showTimeSelectOnly
              timeIntervals={15}
              dateFormat="h:mm aa"
              timeCaption="Time"
              default={defaultFromTime}
              placeholderText={fromPlaceholder}
              readOnly={readOnly}
            />
            <div className="datepeacker-date-icon-div">
              <img
                src={require("../../../assets/img/icons/time-icon.svg")}
                alt="time"
              />
            </div>
          </div>
        </div>
        {title && (
          <h3 className="font-18-bold-space-light-uppercase mt-20 mr-50 opacity-0 rt-datepicker-text-to">
            to
          </h3>
        )}
        {isTo ? (
          <h3 className="font-18-bold-space-light-uppercase datepicker-to-text mt-20 mr-30 rt-datepicker-text-to">
            to
          </h3>
        ) : (
          ""
        )}
        <div>
          {title === false && (
            <h3 className="font-18-bold-space-light-uppercase mb-20 opacity-0">
              to time
            </h3>
          )}
          <div className="date-picker-common">
            <DatePicker
              selected={toTimeValue}
              onChange={handleChangeToTime}
              showTimeSelect
              showTimeSelectOnly
              timeIntervals={15}
              dateFormat="h:mm aa"
              timeCaption="Time"
              default={defaultToTime}
              placeholderText={toPlaceholder}
              readOnly={readOnly}
            />
            <div className="datepeacker-date-icon-div">
              <img
                src={require("../../../assets/img/icons/time-icon.svg")}
                alt="time"
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

DatepickerFromToTime.defaultProps = {
  title: false,
  defaultFromTime: "",
  defaultToTime: "",
};

export default DatepickerFromToTime;
