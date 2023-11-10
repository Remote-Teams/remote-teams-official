import React from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

function FinanceSummaryCard({
  summaryTitle,
  startSummaryDate,
  endSummaryDate,
  handleChangeSummaryStart,
  handleChangeSummaryEnd,
  handleOnClickSummaryDateArrowIcon,
  dataRow1Colm1,
  dataRow1Colm2,
  dataRow1Colm3,
  dataRow1Colm4,
  dataRow2Colm1,
  dataRow2Colm2,
  dataRow2Colm3,
  dataRow2Colm4,
}) {
  return (
    <>
      <div className="count-card-block count-card-block--financeSummary">
        <div className="row mx-0 justify-content-between align-items-center mb-30">
          <h3 className="font-18-bold-space-light-uppercase">{summaryTitle}</h3>
          <div className="row mx-0 align-items-center">
            <div className="date-picker-common date-picker-common--noBorderFinanceSummary">
              <DatePicker
                selected={startSummaryDate}
                selectsStart
                startSummaryDate={startSummaryDate}
                endSummaryDate={endSummaryDate}
                onChange={handleChangeSummaryStart}
              />
            </div>
            <div className="date-picker-common date-picker-common--noBorderFinanceSummary">
              <DatePicker
                selected={endSummaryDate}
                selectsEnd
                startSummaryDate={startSummaryDate}
                endSummaryDate={endSummaryDate}
                onChange={handleChangeSummaryEnd}
                minDate={startSummaryDate}
              />
            </div>
            <div className="count-card-block--financeSummary-arrow">
              <i
                className="fa fa-arrow-right cursor-pointer"
                onClick={handleOnClickSummaryDateArrowIcon}
              ></i>
            </div>
          </div>
        </div>
        {/* font-18-semiBold change to  font-18-Bold*/}
        <table className="finance-summary-table">
          <tbody>
            <tr>
              <td>
                <span className="font-18-bold finance-amount-data-text-white">
                  {dataRow1Colm1}
                </span>
              </td>
              <td className="finance-summary-table--border-right">
                <span className="font-18-bold finance-amount-data-text">
                  {dataRow1Colm2}
                </span>
              </td>
              <td>
                <span className="font-18-bold finance-amount-data-text-white">
                  {dataRow1Colm3}
                </span>
              </td>
              <td>
                <span className="font-18-bold finance-amount-data-text">
                  {dataRow1Colm4}{" "}
                </span>
              </td>
            </tr>
            <tr>
              <td>
                <span className="font-18-bold finance-amount-data-text-white">
                  {dataRow2Colm1}
                </span>
              </td>
              <td className="finance-summary-table--border-right">
                <span className="font-18-bold finance-amount-data-text">
                  {dataRow2Colm2}
                </span>
              </td>
              <td>
                <span className="font-18-bold finance-amount-data-text-white">
                  {dataRow2Colm3}
                </span>
              </td>
              <td>
                <span className="font-18-bold finance-amount-data-text">
                  {dataRow2Colm4}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </>
  );
}

export default FinanceSummaryCard;
