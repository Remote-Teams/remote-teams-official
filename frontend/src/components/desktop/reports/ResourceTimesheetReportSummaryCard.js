import React from "react";

function ResourceTimesheetReportSummaryCard({
  imgPath,
  title,
  resources,
  hoursSpent,
  monthlyCost,
}) {
  return (
    <div className="reports-card reports-card--timesheet-row2">
      <div className="reports-card-timesheet-row2__img-div">
        <img src={imgPath} alt="person" />
      </div>
      <h3 className="font-18-bold-space-light-uppercase">{title}</h3>
      <div className="row mx-0 flex-nowrap reports-card-timesheet-row2__textBlock1Row">
        <div>
          <h4 className="reports-card-timesheet-row2__count" title={resources}>
            {resources}
          </h4>
          <p className="font-18-bold-space-light-uppercase">Resources</p>
        </div>
        <div className="reports-card-timesheet-row2__border-right"></div>
        <div>
          <h4 className="reports-card-timesheet-row2__count" title={hoursSpent}>
            {hoursSpent}
          </h4>
          <p className="font-18-bold-space-light-uppercase">Hours Spent</p>
        </div>
      </div>
      <div className="reports-card-timesheet-row2__textBlock2Row">
        <h4 className="reports-card-timesheet-row2__count" title={monthlyCost}>
          {monthlyCost}
        </h4>
        <p className="font-18-bold-space-light-uppercase">monthly cost</p>
      </div>
    </div>
  );
}

export default ResourceTimesheetReportSummaryCard;
