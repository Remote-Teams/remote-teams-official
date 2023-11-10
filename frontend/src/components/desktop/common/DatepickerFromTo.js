import React from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

function DatepickerFromTo({
  startDateValue,
  endDateValue,
  handleChangeStart,
  handleChangeEnd,
  handleOnClickDateArrowIcon,
}) {
  return (
    <>
      <div className="row mx-0 align-items-center">
        <div className="date-picker-common date-picker-common--noBorder">
          <DatePicker
            selected={startDateValue}
            selectsStart
            startDate={startDateValue}
            endDate={endDateValue}
            onChange={handleChangeStart}
          />
        </div>
        <div className="date-picker-common date-picker-common--noBorder">
          <DatePicker
            selected={endDateValue}
            selectsEnd
            startDate={startDateValue}
            endDate={endDateValue}
            onChange={handleChangeEnd}
            minDate={startDateValue}
          />
        </div>
        <img
          //src={require("../../../assets/img/icons/date-arrow-icon.svg")}
          src={require("../../../assets/img/icons/new-date-picker-arrow.svg")}
          alt="go"
          className="date-block-arrow-go"
          onClick={handleOnClickDateArrowIcon}
        />
      </div>
    </>
  );
}

export default DatepickerFromTo;
