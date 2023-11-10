import React from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

function DatePickerSingle({
  label,
  minDate,
  selected,
  onChange,
  placeholderText,
  readOnly,
  isDisplayLabel,
  dateFormat,
}) {
  return (
    <div className="row mx-0 flex-nowrap">
      <div className="datepicker-mr">
        {isDisplayLabel && (
          <h3 className="font-18-bold-space-light-uppercase mb-20">{label}</h3>
        )}
        <div className="date-picker-common">
          {readOnly ? (
            <DatePicker
              selected={selected}
              placeholderText={placeholderText}
              readOnly={readOnly}
              dateFormat={dateFormat}
            />
          ) : (
            <DatePicker
              minDate={minDate}
              selected={selected}
              onChange={onChange}
              placeholderText={placeholderText}
              readOnly={readOnly}
              dateFormat={dateFormat}
            />
          )}
          <div className="datepeacker-date-icon-div">
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

DatePickerSingle.defaultProps = {
  minDate: "",
  isDisplayLabel: false,
  readOnly: false,
};

export default DatePickerSingle;
