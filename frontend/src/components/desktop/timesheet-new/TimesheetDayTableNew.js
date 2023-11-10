import React, { useState, useEffect } from "react";
import Select from "react-select";
import Progress from "react-progressbar";
import InputFieldNumber from "../common/InputFieldNumber";
import dateFns from "date-fns";

import isEmpty from "../../../store/validations/is-empty";
import { connect } from "react-redux";
import {
  updateWorklogByid,
  createWorkLog,
} from "./../../../store/actions/timesheetAction";
import { startOfWeek, endOfWeek } from "date-fns";
import getDayOfYear from "date-fns/get_day_of_year";
import addDays from "date-fns/add_days";
import TimesheetDayTableTotalHoursLoggedInTodayNew from "./TimesheetDayTableTotalHoursLoggedInTodayNew";
import { useDispatch, useSelector } from "react-redux";

function TimesheetDayTableNew() {
  const dispatch = useDispatch();
  const [values, setValues] = useState({
    dayViewTimesheetData: [],
    actualHours: "",
    isEditActualHours: false,
    editId: "",
  });

  const dayViewTimesheetData = useSelector(
    (state) => state.timesheet.dayViewTimesheetData
  );

  const activeWalkthroughPage = useSelector(
    (state) => state.auth.activeWalkthroughPage
  );

  useEffect(() => {
    if (!isEmpty(dayViewTimesheetData)) {
      setValues({
        ...values,
        dayViewTimesheetData: dayViewTimesheetData,
      });
    }
  }, [dayViewTimesheetData]);

  const handleChangeNumberTable = (e) => {
    setValues({
      ...values,
      actualHours: e.target.validity.valid ? e.target.value : "1",
    });
  };

  const handleOnClickEditActualHours = (data) => (e) => {
    // console.log(data);
    setValues({
      ...values,
      isEditActualHours: true,
      actualHours: data.hours,
      editId: data._id,
    });
  };

  const handleOnClickSaveActualhandle = (data) => (e) => {
    var userData = JSON.parse(localStorage.getItem("UserData"));
    // console.log(data);

    const formData = {
      // name: "th233",
      schedule: data.scheduleId,
      // task: "9f12f230-e1e9-11ea-a47e-a59c158e0673",
      // user: "9f12f230-e1e9-11ea-a47e-a59c158e0673",
      hours: values.actualHours,
    };

    dispatch(
      updateWorklogByid(
        data._id,
        formData,
        startOfWeek(new Date()).toISOString(),
        endOfWeek(new Date()).toISOString(),
        userData.id
      )
    );

    setValues({
      ...values,
      isEditActualHours: false,
    });
  };

  return (
    <div className="timesheet-day-view-div">
      <div className="finances-table-thead finances-table-thead--timesheetDayView">
        <table className="finances-table finances-table--timesheetDayView">
          <thead>
            <tr>
              <th>
                <span>Entry Type</span>
              </th>
              <th>
                <span>Timings</span>
              </th>
              <th>
                <span>hours logged today</span>
              </th>
              <th>
                <span className="opacity-0"> 0</span>
              </th>
            </tr>
          </thead>
        </table>
      </div>
      <div className="finances-table-tbody finances-table-tbody--timesheetDayView">
        <table className="finances-table finances-table--timesheetDayView">
          <tbody>
            {!isEmpty(dayViewTimesheetData) ? (
              dayViewTimesheetData.map((data, index) => (
                <tr
                  key={index}
                  className={
                    activeWalkthroughPage === "timesheet-2" && index === 0
                      ? "new-walkthrough-active-all-project-card"
                      : ""
                  }
                >
                  <td>
                    {/**font-18-semiBold font-18-bold  */}
                    <p className="font-18-bold font-18-bold--timesheet-day-table-task-name">
                      {!isEmpty(data) && data.name}
                      {/* task name */}
                    </p>
                    <p className="font-18-bold-space-light-uppercase">
                      {!isEmpty(data) && !isEmpty(data.task)
                        ? data.task.project.name
                        : "NA"}
                      {/* projects name */}
                    </p>

                    <p className="timesheet-day-view-entry-type-text">
                      <i>
                        {/* General */}
                        {/* Project Task */}
                        {data.category}
                      </i>
                    </p>

                    {/* <p className="pb-10 timesheetDayView-text1">
                            {!isEmpty(data) &&
                              dateFns.format(data.startDate, "DD/MM/YYYY")}
                            <span className="timesheetDayView-text2"> to </span>
                            {!isEmpty(data) &&
                              dateFns.format(data.endDate, "DD/MM/YYYY")}
                          </p> */}
                  </td>
                  <td>
                    <p className="timesheet-font-14-regular pb-10">
                      {!isEmpty(data) &&
                        dateFns.format(data.fromTime, "hh:mmA")}
                      -{!isEmpty(data) && dateFns.format(data.toTime, "hh:mmA")}
                      {/* 11:33AM-01:00PM */}
                    </p>
                    {/* <div className="row mx-0 align-items-center">
                            <div>
                              <span className="timesheetDayView-text3">
                                deadline :
                              </span>
                              <span>
                                {!isEmpty(data) && data.taskdeadline.toFixed()}
                              </span>
                            </div>
                          </div>
                          <div className="progressbar-timesheetDayView">
                            <Progress completed={this.renderProgress(data)} />
                          </div>
                          <div className="row mx-0 align-items-center">
                            <div className="timesheet-day-view-progress-row2-colm1">
                              <span className="timesheetDayView-text3">
                                total Assigned hours:
                              </span>
                              <span>{!isEmpty(data) && data.assignedhours}</span>
                            </div>
                            <div>
                              <span className="timesheetDayView-text3">
                                total recorded hours:
                              </span>
                              <span>{!isEmpty(data) && data.actualhours}</span>
                            </div>
                          </div>
                         */}
                  </td>
                  {/* <td>
                          <span>
                            {!isEmpty(data) && data.plannedHours.toFixed()}
                          </span>
                        </td> */}
                  <td>
                    {!values.isEditActualHours || values.editId !== data._id ? (
                      <div className="timesheet-day-view-actual-hours-block timesheet-day-view-actual-hours-block--noBorder">
                        <InputFieldNumber
                          containerClassName="container-login-flow-input container-login-flow-input--addExpenseSmall "
                          name="actualHours"
                          value={!isEmpty(data) && data.hours}
                          onChange={handleChangeNumberTable}
                          isDisabled={true}
                        />
                      </div>
                    ) : values.isEditActualHours &&
                      values.editId === data._id ? (
                      <div className="timesheet-day-view-actual-hours-block">
                        <InputFieldNumber
                          containerClassName="container-login-flow-input container-login-flow-input--addExpenseSmall"
                          name="actualHours"
                          value={values.actualHours}
                          onChange={handleChangeNumberTable}
                        />
                      </div>
                    ) : (
                      ""
                    )}
                  </td>
                  <td>
                    {!values.isEditActualHours || values.editId !== data._id ? (
                      <i
                        className="fa fa-pencil overview-block__pencil-edit"
                        onClick={handleOnClickEditActualHours(data)}
                      ></i>
                    ) : (
                      <i
                        className="fa fa-save overview-block__pencil-edit"
                        onClick={handleOnClickSaveActualhandle(data)}
                      ></i>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr
                className={
                  activeWalkthroughPage === "timesheet-2"
                    ? "new-walkthrough-active-all-project-card"
                    : ""
                }
              >
                <td colSpan={0} className="text-center">
                  <span className="font-14-semibold table-data-empty-message">
                    No data found
                  </span>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <TimesheetDayTableTotalHoursLoggedInTodayNew
        dayViewTimesheetData={dayViewTimesheetData}
      />
    </div>
  );
}

export default TimesheetDayTableNew;

// import React, { Component } from "react";
// import Select from "react-select";
// import Progress from "react-progressbar";
// import InputFieldNumber from "../common/InputFieldNumber";
// import dateFns from "date-fns";

// import isEmpty from "../../../store/validations/is-empty";
// import { connect } from "react-redux";
// import {
//   updateWorklogByid,
//   createWorkLog,
// } from "./../../../store/actions/timesheetAction";
// import { startOfWeek, endOfWeek } from "date-fns";
// import getDayOfYear from "date-fns/get_day_of_year";
// import addDays from "date-fns/add_days";
// import TimesheetDayTableTotalHoursLoggedInTodayNew from "./TimesheetDayTableTotalHoursLoggedInTodayNew";

// const dummyData = [1, 2, 3, 4, 5];

// // table
// let dataStatus = { value: "INPROGRESS", label: "In Progress" };
// const optionsStatusTable = [
//   { value: "Not Started", label: "Not Started" },
//   { value: "In Progress", label: "In Progress" },
//   { value: "Completed", label: "Completed" },
// ];

// const data = [
//   {
//     scheduleId: "ef3fb2e0-e2d6-11eb-85e1-19934486d62a",
//     groupId: "GROUP1626069832",
//     bookingName: "demoBooking",
//     fromTime: "2021-07-20T06:03:21.279Z",
//     toTime: "2021-07-20T07:30:00.279Z",
//     taskName: "task one",
//     projectName: "demo",
//     plannedHours: 1.4441666666666666,
//     taskdeadline: -6.976061469907408,
//     endDate: "2021-07-20T06:03:21.279Z",
//     startDate: "2021-07-20T06:03:21.279Z",
//     assignedhours: 0,
//     worklogstatus: "INPROGRESS",
//     actualhours: 20,
//     worklogId: "466e6ca0-e2d7-11eb-85e1-19934486d62a",
//     recordedhours: 20,
//   },
// ];

// export class TimesheetDayTableNew extends Component {
//   constructor() {
//     super();
//     this.state = {
//       actualHours: "",
//       isEditActualHours: false,
//       editId: "",
//     };
//   }

//   static getDerivedStateFromProps(nextProps, nextState) {
//     if (
//       !isEmpty(nextProps.dayViewTimesheetData) &&
//       nextProps.dayViewTimesheetData !== nextState.dayViewTimesheetData
//     ) {
//       return {
//         dayViewTimesheetData: nextProps.dayViewTimesheetData,
//       };
//     }
//     if (
//       !isEmpty(nextProps.selectedFilterMemberId) &&
//       nextProps.selectedFilterMemberId !== nextState.selectedFilterMemberId
//     ) {
//       return {
//         selectedFilterMemberId: nextProps.selectedFilterMemberId,
//       };
//     }
//     return null;
//   }

//   componentDidUpdate() {
//     if (this.props.dayViewTimesheetData !== this.state.dayViewTimesheetData) {
//       this.setState({
//         dayViewTimesheetData: this.props.dayViewTimesheetData,
//       });
//     }
//   }

//   /*============================================================
//       handleChangeStatusDropdownTable
//   ============================================================*/
//   // handleChangeStatusDropdownTable = (data) => (selectedOption) => {
//   //   console.log(data, selectedOption);
//   //   console.log(`Option selected:`, data);
//   //   const { selectedFilterMemberId } = this.state;

//   //   if (data.worklogId === "0") {
//   //     const formData = {
//   //       name: "th233",
//   //       schedule: data._id,
//   //       task: "9f12f230-e1e9-11ea-a47e-a59c158e0673",
//   //       user: "9f12f230-e1e9-11ea-a47e-a59c158e0673",
//   //       hours: this.state.actualHours,
//   //       // createdBy: data.id,
//   //       // lastModifiedBy: data.id,
//   //       status:
//   //         selectedOption.value === "Not Started"
//   //           ? "NOTSTARTED"
//   //           : selectedOption.value === "Completed"
//   //           ? "COMPLETED"
//   //           : "INPROGRESS",
//   //     };

//   //     this.props.createWorkLog(
//   //       formData,
//   //       startOfWeek(new Date()).toISOString(),
//   //       endOfWeek(new Date()).toISOString(),
//   //       selectedFilterMemberId,
//   //       getDayOfYear(new Date())
//   //     );
//   //   } else {
//   //     // console.log("call update api");

//   //     const formData = {
//   //       name: "th233",
//   //       schedule: data._id,
//   //       task: "9f12f230-e1e9-11ea-a47e-a59c158e0673",
//   //       user: "9f12f230-e1e9-11ea-a47e-a59c158e0673",
//   //       hours: data.hours,
//   //       // createdBy: data.id,
//   //       // lastModifiedBy: data.id,
//   //       status:
//   //         selectedOption.value === "Not Started"
//   //           ? "NOTSTARTED"
//   //           : selectedOption.value === "Completed"
//   //           ? "COMPLETED"
//   //           : "INPROGRESS",
//   //     };
//   //     console.log(formData);

//   //     this.props.updateWorklogByid(
//   //       data.worklogId,
//   //       formData,
//   //       startOfWeek(new Date()).toISOString(),
//   //       endOfWeek(new Date()).toISOString(),
//   //       selectedFilterMemberId,
//   //       getDayOfYear(new Date())
//   //     );
//   //   }
//   // };

//   handleChangeNumberTable = (e) => {
//     this.setState({
//       actualHours: e.target.validity.valid ? e.target.value : "1",
//     });
//   };

//   handleOnClickEditActualHours = (data) => (e) => {
//     // console.log(data);
//     this.setState({
//       isEditActualHours: true,
//       actualHours: data.hours,
//       editId: data._id,
//     });
//   };

//   handleOnClickSaveActualhandle = (data) => (e) => {
//     const { selectedFilterMemberId } = this.state;
//     // console.log(data);
//     if (data.worklogId === "0") {
//       const formData = {
//         name: "th233",
//         schedule: data.scheduleId,
//         task: "9f12f230-e1e9-11ea-a47e-a59c158e0673",
//         user: "9f12f230-e1e9-11ea-a47e-a59c158e0673",
//         hours: this.state.actualHours,
//         // createdBy: data.id,
//         // lastModifiedBy: data.id,
//         status: "INPROGRESS",
//       };
//       this.props.createWorkLog(
//         formData,
//         startOfWeek(new Date()).toISOString(),
//         endOfWeek(new Date()).toISOString(),
//         selectedFilterMemberId,
//         getDayOfYear(new Date())
//       );
//     } else {
//       const formData = {
//         // name: "th233",
//         schedule: data.scheduleId,
//         // task: "9f12f230-e1e9-11ea-a47e-a59c158e0673",
//         // user: "9f12f230-e1e9-11ea-a47e-a59c158e0673",
//         hours: this.state.actualHours,
//       };

//       this.props.updateWorklogByid(
//         data._id,
//         formData,
//         startOfWeek(new Date()).toISOString(),
//         endOfWeek(new Date()).toISOString(),
//         selectedFilterMemberId,
//         getDayOfYear(new Date())
//       );
//     }

//     this.setState({
//       isEditActualHours: false,
//     });
//   };

//   // renderProgress = (data) => {
//   //   let progress = 0;
//   //   if (!isEmpty(data)) {
//   //     progress = (parseInt(data.hours) / data.assignedhours) * 100;
//   //     if (progress === Infinity || progress === NaN) {
//   //       progress = 0;
//   //     }
//   //   }
//   //   return progress;
//   // };

//   /*============================================================
//       main
//   ============================================================*/
//   render() {
//     const { isEditActualHours, dayViewTimesheetData } = this.state;

//     return (
//       <div className="timesheet-day-view-div">
//         <div className="finances-table-thead finances-table-thead--timesheetDayView">
//           <table className="finances-table finances-table--timesheetDayView">
//             <thead>
//               <tr>
//                 <th>
//                   <span>Task Name</span>
//                 </th>
//                 <th>
//                   <span>Timings</span>
//                 </th>
//                 <th>
//                   <span>hours logged today</span>
//                 </th>
//                 <th>
//                   <span className="opacity-0"> 0</span>
//                 </th>
//               </tr>
//             </thead>
//           </table>
//         </div>
//         <div className="finances-table-tbody finances-table-tbody--timesheetDayView">
//           <table className="finances-table finances-table--timesheetDayView">
//             <tbody>
//               {!isEmpty(dayViewTimesheetData) ? (
//                 dayViewTimesheetData.map((data, index) => (
//                   <tr
//                     key={index}
//                     className={
//                       this.props.activeWalkthroughPage === "timesheet-2" &&
//                       index === 0
//                         ? "new-walkthrough-active-all-project-card"
//                         : ""
//                     }
//                   >
//                     <td>
//                       {/**font-18-semiBold font-18-bold  */}
//                       <p className="font-18-bold font-18-bold--timesheet-day-table-task-name">
//                         {/* {!isEmpty(data) && data.taskName} */}
//                         task name
//                       </p>
//                       <p className="font-18-bold-space-light-uppercase">
//                         {/* {!isEmpty(data) && data.projectName} */}
//                         projects name
//                       </p>

//                       {/* <p className="pb-10 timesheetDayView-text1">
//                         {!isEmpty(data) &&
//                           dateFns.format(data.startDate, "DD/MM/YYYY")}
//                         <span className="timesheetDayView-text2"> to </span>
//                         {!isEmpty(data) &&
//                           dateFns.format(data.endDate, "DD/MM/YYYY")}
//                       </p> */}
//                     </td>
//                     <td>
//                       <p className="timesheet-font-14-regular pb-10">
//                         {/* {!isEmpty(data) &&
//                           dateFns.format(data.fromTime, "hh:mmA")}
//                         -
//                         {!isEmpty(data) &&
//                           dateFns.format(data.toTime, "hh:mmA")} */}
//                         11:33AM-01:00PM
//                       </p>
//                       {/* <div className="row mx-0 align-items-center">
//                         <div>
//                           <span className="timesheetDayView-text3">
//                             deadline :
//                           </span>
//                           <span>
//                             {!isEmpty(data) && data.taskdeadline.toFixed()}
//                           </span>
//                         </div>
//                       </div>
//                       <div className="progressbar-timesheetDayView">
//                         <Progress completed={this.renderProgress(data)} />
//                       </div>
//                       <div className="row mx-0 align-items-center">
//                         <div className="timesheet-day-view-progress-row2-colm1">
//                           <span className="timesheetDayView-text3">
//                             total Assigned hours:
//                           </span>
//                           <span>{!isEmpty(data) && data.assignedhours}</span>
//                         </div>
//                         <div>
//                           <span className="timesheetDayView-text3">
//                             total recorded hours:
//                           </span>
//                           <span>{!isEmpty(data) && data.actualhours}</span>
//                         </div>
//                       </div>
//                      */}
//                     </td>
//                     {/* <td>
//                       <span>
//                         {!isEmpty(data) && data.plannedHours.toFixed()}
//                       </span>
//                     </td> */}
//                     <td>
//                       {!isEditActualHours || this.state.editId !== data._id ? (
//                         <div className="timesheet-day-view-actual-hours-block timesheet-day-view-actual-hours-block--noBorder">
//                           <InputFieldNumber
//                             containerClassName="container-login-flow-input container-login-flow-input--addExpenseSmall "
//                             name="actualHours"
//                             value={!isEmpty(data) && data.hours}
//                             onChange={this.handleChangeNumberTable}
//                             isDisabled={true}
//                           />
//                         </div>
//                       ) : isEditActualHours &&
//                         this.state.editId === data._id ? (
//                         <div className="timesheet-day-view-actual-hours-block">
//                           <InputFieldNumber
//                             containerClassName="container-login-flow-input container-login-flow-input--addExpenseSmall"
//                             name="actualHours"
//                             value={this.state.actualHours}
//                             onChange={this.handleChangeNumberTable}
//                           />
//                         </div>
//                       ) : (
//                         ""
//                       )}
//                     </td>
//                     <td>
//                       {!isEditActualHours || this.state.editId !== data._id ? (
//                         <i
//                           className="fa fa-pencil overview-block__pencil-edit"
//                           onClick={this.handleOnClickEditActualHours(data)}
//                         ></i>
//                       ) : (
//                         <i
//                           className="fa fa-save overview-block__pencil-edit"
//                           onClick={this.handleOnClickSaveActualhandle(data)}
//                         ></i>
//                       )}
//                     </td>
//                   </tr>
//                 ))
//               ) : (
//                 <tr
//                   className={
//                     this.props.activeWalkthroughPage === "timesheet-2"
//                       ? "new-walkthrough-active-all-project-card"
//                       : ""
//                   }
//                 >
//                   <td colSpan={0} className="text-center">
//                     <span className="font-14-semibold table-data-empty-message">
//                       No data found
//                     </span>
//                   </td>
//                 </tr>
//               )}
//             </tbody>
//           </table>
//         </div>

//         <TimesheetDayTableTotalHoursLoggedInTodayNew />
//       </div>
//     );
//   }
// }

// const mapStateToProps = (state) => ({
//   dayViewTimesheetData: state.timesheet.dayViewTimesheetData,
//   selectedFilterMemberId: state.timesheet.selectedFilterMemberId,
//   activeWalkthroughPage: state.auth.activeWalkthroughPage,
// });

// export default connect(mapStateToProps, { createWorkLog, updateWorklogByid })(
//   TimesheetDayTableNew
// );
