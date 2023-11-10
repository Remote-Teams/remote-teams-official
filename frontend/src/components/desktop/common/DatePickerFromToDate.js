import React from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import isEmpty from "../../../store/validations/is-empty";

function DatePickerFromToDate({
  labelStart,
  startDateValue,
  labelEnd,
  endDateValue,
  handleChangeStart,
  handleChangeEnd,
  placeholderStart,
  placeholderEnd,
  readOnly,
  isDisplayLabel,
  isDisabledStartDate,
  isDisabledEndDate,
  error,
  isTo,
}) {
  // console.log(error);
  return (
    <div className="row mx-0 flex-nowrap">
      <div className="datepicker-mr">
        {isDisplayLabel && (
          <h3 className="font-18-bold-space-light-uppercase mb-20">
            {labelStart}
          </h3>
        )}
        <div className="date-picker-common">
          <DatePicker
            selected={startDateValue}
            selectsStart
            startDate={startDateValue}
            endDate={endDateValue}
            onChange={handleChangeStart}
            placeholderText={placeholderStart}
            readOnly={readOnly}
            disabled={isDisabledStartDate}
          />
          {!isEmpty(error) && !isEmpty(error.startDate) ? (
            <p className="error-message">{error.startDate}</p>
          ) : (
            <p className="error-message opacity-0">error</p>
          )}
          <div
            className={
              !isDisabledStartDate
                ? "datepeacker-date-icon-div"
                : "datepeacker-date-icon-div datepeacker-date-icon-div--disabled"
            }
          >
            <img
              src={require("../../../assets/img/icons/new-date-icon.svg")}
              alt="date"
            />
          </div>
        </div>
      </div>
      {isTo ? (
        <h3 className="font-18-bold-space-light-uppercase datepicker-to-text mt-20 mr-30">
          to
        </h3>
      ) : (
        ""
      )}
      <div>
        {isDisplayLabel && (
          <h3 className="font-18-bold-space-light-uppercase mb-20">
            {labelEnd}
          </h3>
        )}
        <div className="date-picker-common">
          <DatePicker
            selected={endDateValue}
            selectsEnd
            startDate={startDateValue}
            endDate={endDateValue}
            onChange={handleChangeEnd}
            minDate={startDateValue}
            placeholderText={placeholderEnd}
            readOnly={readOnly}
            disabled={isDisabledEndDate}
          />
          {!isEmpty(error) && !isEmpty(error.endDate) ? (
            <p className="error-message">{error.endDate}</p>
          ) : (
            <p className="error-message opacity-0">error</p>
          )}
          <div
            className={
              !isDisabledEndDate
                ? "datepeacker-date-icon-div"
                : "datepeacker-date-icon-div datepeacker-date-icon-div--disabled"
            }
          >
            <img
              src={require("../../../assets/img/icons/new-date-icon.svg")}
              alt="date"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

DatePickerFromToDate.defaultProps = {
  isDisabledStartDate: false,
  isDisabledEndDate: false,
};

export default DatePickerFromToDate;
