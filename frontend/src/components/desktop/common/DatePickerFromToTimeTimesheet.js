import React from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

function DatePickerFromToTimeTimesheet({
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
      <div className="row mx-0">
        <div>
          <h3 className="font-14-bold common-peach-color-text mb-20">
            Booked from
          </h3>
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
                src="/img/icons/blue-gradient-arrow-down-icon.svg"
                alt="time"
              />
            </div>
          </div>
        </div>

        <div>
          <h3 className="font-14-bold common-peach-color-text mb-20">till</h3>
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
                src="/img/icons/blue-gradient-arrow-down-icon.svg"
                alt="time"
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

DatePickerFromToTimeTimesheet.defaultProps = {
  defaultFromTime: "",
  defaultToTime: "",
};

export default DatePickerFromToTimeTimesheet;
