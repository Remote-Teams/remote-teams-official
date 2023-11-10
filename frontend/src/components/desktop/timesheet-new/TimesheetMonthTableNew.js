// import React, { Component, Fragment } from "react";
// import Select from "react-select";
// import { format } from "date-fns";
// import InputFieldNumber from "../common/InputFieldNumber";
// import TimesheetMonthTableTotalHoursPerDayNew from "./TimesheetMonthTableTotalHoursPerDayNew";
// import dateFns from "date-fns";
// import { connect } from "react-redux";
// import getYear from "date-fns/get_year";
// import getMonth from "date-fns/get_month";
// import getDate from "date-fns/get_date";
// import { startOfWeek, endOfWeek } from "date-fns";
// import {
//   updateWorklogByid,
//   createWorkLog,
// } from "./../../../store/actions/timesheetAction";
// import addDays from "date-fns/add_days";

// import isEmpty from "../../../store/validations/is-empty";

// const dummyData = [
//   {
//     _id: "b",
//     data: [
//       {
//         date: "2020-08-17T18:30:00.000Z",
//         plannedHours: 2,
//         scheduleId: "be446940-ddf2-11ea-a331-31643354cfca",
//         groupId: "b",
//         actualHours: 2,
//       },
//       {
//         date: "2020-08-18T18:30:00.000Z",
//         plannedHours: 4,
//         scheduleId: "bf281280-ddf2-11ea-a331-31643354cfca",
//         groupId: "b",
//         actualHours: 4,
//       },
//       {
//         date: "2020-08-19T18:30:00.000Z",
//         plannedHours: 6,
//         scheduleId: "bf82b5a0-ddf2-11ea-a331-31643354cfca",
//         groupId: "b",
//         actualHours: 6,
//       },
//       {
//         date: "2020-08-20T18:30:00.000Z",
//         plannedHours: 8,
//         scheduleId: "365a5b10-de07-11ea-ba08-afe5fcd0580c",
//         groupId: "b",
//         actualHours: 8,
//       },
//     ],
//   },
//   {
//     _id: "a",
//     data: [
//       {
//         date: "2020-08-17T18:30:00.000Z",
//         plannedHours: 3,
//         scheduleId: "82212470-db78-11ea-ac8e-db88954cd329",
//         groupId: "a",
//         actualHours: 3,
//       },
//       {
//         date: "2020-08-18T18:30:00.000Z",
//         plannedHours: 5,
//         scheduleId: "246ec140-db7b-11ea-ac8e-db88954cd329",
//         groupId: "a",
//         actualHours: 5,
//       },
//       {
//         date: "2020-08-19T18:30:00.000Z",
//         plannedHours: 7,
//         scheduleId: "31bd9f40-db87-11ea-ac8e-db88954cd329",
//         groupId: "a",
//         actualHours: 7,
//       },
//     ],
//   },
// ];

// // table
// let dataStatus = { value: "INPROGRESS", label: "In Progress" };
// const optionsStatusTable = [
//   { value: "INPROGRESS", label: "In Progress" },
//   { value: "ANSWERED", label: "Closed" },
//   { value: "ONHOLD", label: "On Hold" },
// ];

// export class TimesheetMonthTableNew extends Component {
//   constructor() {
//     super();
//     this.state = {
//       actualHours: "",
//       isEditActualHours: false,
//       editFieldDate: "",
//       editRowId: "",
//     };
//   }

//   static getDerivedStateFromProps(nextProps, nextState) {
//     if (
//       !isEmpty(nextProps.monthViewTimesheetData) &&
//       nextProps.monthViewTimesheetData !== nextState.monthViewTimesheetData
//     ) {
//       return {
//         monthViewTimesheetData: nextProps.monthViewTimesheetData,
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
//     if (
//       this.props.monthViewTimesheetData !== this.state.monthViewTimesheetData
//     ) {
//       this.setState({
//         monthViewTimesheetData: this.props.monthViewTimesheetData,
//       });
//     }
//   }

//   /*============================================================
//       handleChangeStatusDropdownTable
//   ============================================================*/
//   handleChangeStatusDropdownTable = (data) => (selectedOption) => {
//     console.log(data, selectedOption);
//   };

//   handleChangeNumberTable = (date) => (e) => {
//     console.log(date);

//     this.setState({
//       actualHours: e.target.validity.valid ? e.target.value : "1",
//     });
//   };

//   handleOnClickEditActualHours = () => {
//     this.setState({
//       isEditActualHours: true,
//     });
//   };

//   handleOnClickSaveActualhandle = () => {
//     this.setState({
//       isEditActualHours: false,
//     });
//   };

//   /*============================================================
//       renderTaskNameColumn
//   ============================================================*/
//   renderTaskNameColumn = (data) => {
//     return (
//       <td rowSpan="2">
//         <p className="font-18-bold font-18-bold--timesheet-day-table-task-name">
//           {data.taskName}
//         </p>
//         <p className="font-18-bold-space-light-uppercase">{data.projectName}</p>
//         <p className="timesheet-font-14-regular pb-10">
//           {dateFns.format(data.fromtime, "hh:mmA")}-
//           {dateFns.format(data.totime, "hh:mmA")}
//         </p>
//         {/* <p className=" timesheetDayView-text1">
//           {dateFns.format(data.fromDate, "DD/MM/YYYY")}
//           <span className="timesheetDayView-text2"> to </span>
//           {dateFns.format(data.toDate, "DD/MM/YYYY")}
//         </p> */}
//         {/* <div className="row mx-0 flex-nowrap align-items-center timesheet-day-view-progress-row1-colm1">
//           {data.bookingName}
//         </div> */}
//       </td>
//     );
//   };

//   /*============================================================
//       renderPlannedHoursRow
//   ============================================================*/
//   // renderPlannedHoursRow = (data) => {
//   //   const { dateArray } = this.props;
//   //   return (
//   //     <tr className="timesheet-month-view-tr-row2">
//   //       <td>
//   //         <span className="font-16-bold-space-light-uppercase white-space-nowrap">
//   //           PH:
//   //         </span>
//   //       </td>
//   //       <td>
//   //         <span className="opacity-0">0</span>
//   //       </td>
//   //       {/* hours array */}
//   //       {dateArray.map((date, index) => {
//   //         return (
//   //           <td key={index}>
//   //             <span className="font-18-semiBold timesheet-month-view-tr-row2__textCount">
//   //               {/* 1 */}
//   //               {this.showPlannedHoursOfDate(date, data)}
//   //             </span>
//   //           </td>
//   //         );
//   //       })}
//   //       {/* hours array end */}
//   //       <td>
//   //         <span className="opacity-0">0</span>
//   //       </td>
//   //       <td>
//   //         <span className="font-18-semiBold timesheet-month-view-tr-row2__textCount">
//   //           {/* 34 HRS */}
//   //           {this.renderTotalPlannedHours(data)}
//   //         </span>
//   //       </td>
//   //     </tr>
//   //   );
//   // };

//   /*============================================================
//       main
//   ============================================================*/
//   onClickEditActualHour = (fieldDate, singleScheduleData) => (e) => {
//     // console.log(fieldDate.toISOString());

//     let editFieldAllData = [];
//     if (!isEmpty(singleScheduleData.data)) {
//       singleScheduleData.data.forEach((element) => {
//         // console.log(element);
//         if (getDate(element.date) === getDate(fieldDate.toISOString())) {
//           editFieldAllData = element;
//         }
//       });
//     }

//     this.setState({
//       editFieldDate: fieldDate,
//       editRowId: singleScheduleData._id,
//       actualHours: editFieldAllData.actualHours,
//     });
//   };

//   onClickSaveActualHour = (fieldDate, singleScheduleData) => (e) => {
//     const { selectedFilterMemberId } = this.state;
//     console.log(singleScheduleData, fieldDate, this.state.actualHours);

//     let editFieldAllData = [];
//     if (!isEmpty(singleScheduleData.data)) {
//       singleScheduleData.data.forEach((element) => {
//         // console.log(element);
//         if (getDate(element.date) === getDate(fieldDate.toISOString())) {
//           editFieldAllData = element;
//         }
//       });
//     }
//     // console.log(startOfWeek(editFieldAllData.date));

//     if (editFieldAllData.worklogId === "0") {
//       const formData = {
//         name: "th233",
//         schedule: editFieldAllData.scheduleId,
//         task: "9f12f230-e1e9-11ea-a47e-a59c158e0673",
//         user: "9f12f230-e1e9-11ea-a47e-a59c158e0673",
//         hours: this.state.actualHours,
//         // createdBy: data.id,
//         // lastModifiedBy: data.id,
//         status: "INPROGRESS",
//       };
//       this.props.createWorkLog(
//         formData,
//         startOfWeek(editFieldAllData.date).toISOString(),
//         endOfWeek(editFieldAllData.date).toISOString(),
//         selectedFilterMemberId
//       );
//     } else {
//       const formData = {
//         // name: "th233",
//         schedule: editFieldAllData.scheduleId,
//         // task: "9f12f230-e1e9-11ea-a47e-a59c158e0673",
//         // user: "9f12f230-e1e9-11ea-a47e-a59c158e0673",
//         hours: this.state.actualHours,
//       };

//       this.props.updateWorklogByid(
//         editFieldAllData.worklogId,
//         formData,
//         addDays(startOfWeek(editFieldAllData.date), 1).toISOString(),
//         endOfWeek(editFieldAllData.date).toISOString(),
//         selectedFilterMemberId
//       );
//     }

//     this.setState({
//       editFieldDate: "",
//       // actualHours: this.state.actualHours,
//     });
//   };

//   showActualHoursOfDate = (fieldDate, singleScheduleData) => {
//     // console.log(fieldDate.toISOString(), singleScheduleData);
//     let actualHours = "";
//     singleScheduleData.data.forEach((element) => {
//       // console.log(getMonth(fieldDate.toISOString()));
//       if (getDate(element.date) === getDate(fieldDate.toISOString())) {
//         actualHours = element.actualHours;
//       }
//     });
//     return isEmpty(actualHours) ? "-" : actualHours;
//   };

//   showPlannedHoursOfDate = (fieldDate, singleScheduleData) => {
//     let plannedHours = "";
//     singleScheduleData.data.forEach((element) => {
//       // console.log(element);
//       if (getDate(element.date) === getDate(fieldDate.toISOString())) {
//         plannedHours = element.plannedHours;
//       }
//     });
//     return isEmpty(plannedHours) ? "-" : plannedHours.toFixed();
//   };

//   renderTotalActualHours = (singleScheduleData) => {
//     let totalActualHours = 0;
//     singleScheduleData.data.forEach((element) => {
//       // console.log(element);
//       totalActualHours = totalActualHours + element.actualHours;
//     });
//     return isEmpty(totalActualHours) ? 0 : totalActualHours;
//   };

//   renderTotalPlannedHours = (singleScheduleData) => {
//     let totalPlannedHours = 0;
//     singleScheduleData.data.forEach((element) => {
//       // console.log(element);
//       totalPlannedHours = totalPlannedHours + element.plannedHours;
//     });
//     return isEmpty(totalPlannedHours) ? 0 : totalPlannedHours.toFixed();
//   };

//   renderEditAndSaveButton = (date, data) => {
//     const { editFieldDate, editRowId } = this.state;

//     if (!isEmpty(data.data)) {
//       let filterWorklog = data.data.filter(
//         (worklog) => getDate(worklog.date) === getDate(date.toISOString())
//       );
//       // console.log(filterUsers);
//       if (!isEmpty(filterWorklog)) {
//         if (date === editFieldDate && editRowId === data._id) {
//           return (
//             <i
//               className="fa fa-save overview-block__pencil-edit"
//               onClick={this.onClickSaveActualHour(date, data)}
//             ></i>
//           );
//         } else {
//           return (
//             <i
//               className="fa fa-pencil overview-block__pencil-edit"
//               onClick={this.onClickEditActualHour(date, data)}
//             ></i>
//           );
//         }
//       }
//     }
//   };

//   calculateTotalActualHourPerDay = (date) => {
//     const { monthViewTimesheetData } = this.state;
//     let totalActualHorsPerDay = 0;
//     console.log(monthViewTimesheetData);
//     if (!isEmpty(monthViewTimesheetData)) {
//       monthViewTimesheetData.forEach((element) => {
//         // console.log(element);
//         element.data.forEach((element) => {
//           if (getDate(element.date) === getDate(date.toISOString())) {
//             // console.log(element);
//             totalActualHorsPerDay = totalActualHorsPerDay + element.actualHours;
//           }
//         });
//       });
//     }

//     return !isEmpty(totalActualHorsPerDay) ? totalActualHorsPerDay : 0;
//   };

//   calculateTotalPlannedHourPerDay = (date) => {
//     const { monthViewTimesheetData } = this.state;
//     let totalPlannedHorsPerDay = 0;
//     console.log(monthViewTimesheetData);
//     if (!isEmpty(monthViewTimesheetData)) {
//       monthViewTimesheetData.forEach((element) => {
//         // console.log(element);
//         element.data.forEach((element) => {
//           if (getDate(element.date) === getDate(date.toISOString())) {
//             // console.log(element);
//             totalPlannedHorsPerDay =
//               totalPlannedHorsPerDay + element.plannedHours.toFixed();
//           }
//         });
//       });
//     }

//     return !isEmpty(totalPlannedHorsPerDay) ? totalPlannedHorsPerDay : 0;
//   };

//   render() {
//     const {
//       dateArray,
//       handleOnClickMonthTableArrowLeft,
//       handleOnClickMonthTableArrowRight,
//     } = this.props;
//     const { editFieldDate, editRowId, monthViewTimesheetData } = this.state;
//     return (
//       <div className="timesheet-day-view-div">
//         <div className="finances-table-thead finances-table-thead--timesheetMonthView">
//           <table className="finances-table finances-table--timesheetMonth">
//             <thead>
//               <tr>
//                 <th>
//                   <span>Task</span>
//                 </th>
//                 <th>
//                   <span className="font-16-bold-space-light-uppercase  white-space-nowrap opacity-0">
//                     HOURS <br /> LOGGED
//                   </span>
//                 </th>
//                 <th>
//                   <span>
//                     <i
//                       className="fa fa-chevron-left cursor-pointer"
//                       onClick={handleOnClickMonthTableArrowLeft}
//                     ></i>
//                   </span>
//                 </th>
//                 {/* <th></th> for 7 days */}
//                 {dateArray.map((data, index) => (
//                   <th key={index}>
//                     <span>
//                       {format(data, "D")}
//                       <br />
//                       {format(data, "ddd")}
//                     </span>
//                   </th>
//                 ))}
//                 {/* <th></th> for 7 days end */}
//                 <th>
//                   <span>
//                     <i
//                       className="fa fa-chevron-right cursor-pointer"
//                       onClick={handleOnClickMonthTableArrowRight}
//                     ></i>
//                   </span>
//                 </th>
//                 <th>
//                   <span>total hours LOGGED IN</span>
//                 </th>
//               </tr>
//             </thead>
//           </table>
//         </div>
//         <div className="finances-table-tbody finances-table-tbody--timesheetMonthView">
//           <table className="finances-table finances-table--timesheetMonth">
//             {/* {console.log(dateArray)} */}
//             <tbody>
//               {!isEmpty(monthViewTimesheetData) ? (
//                 monthViewTimesheetData.map((data, index) => (
//                   <div
//                     key={index}
//                     className="finances-table--timesheetMonth-div"
//                   >
//                     {/* Task Name and Actual Hours Row */}
//                     <tr className="timesheet-month-view-tr-row1">
//                       {/* Task Name */}
//                       {this.renderTaskNameColumn(data)}
//                       <td>
//                         <span className="font-16-bold-space-light-uppercase  white-space-nowrap">
//                           HOURS <br /> LOGGED
//                         </span>
//                       </td>
//                       <td>
//                         <span className="opacity-0">0</span>
//                       </td>
//                       {/* hours array */}
//                       {dateArray.map((date, index) => {
//                         return (
//                           <td key={index}>
//                             {this.renderEditAndSaveButton(date, data)}
//                             {editFieldDate === date &&
//                             editRowId === data._id ? (
//                               <div className="timesheet-day-view-actual-hours-block">
//                                 <InputFieldNumber
//                                   containerClassName="container-login-flow-input container-login-flow-input--addExpenseSmall"
//                                   name="actualHours"
//                                   value={this.state.actualHours}
//                                   onChange={this.handleChangeNumberTable(date)}
//                                 />
//                               </div>
//                             ) : (
//                               <div className="timesheet-day-view-actual-hours-block timesheet-day-view-actual-hours-block--noBorder">
//                                 {this.showActualHoursOfDate(date, data)}
//                                 {/* <InputFieldNumber
//                                   containerClassName="container-login-flow-input container-login-flow-input--addExpenseSmall"
//                                   name="actualHours"
//                                   value={this.showActualHoursOfDate(date, data)}
//                                   onChange={this.handleChangeNumberTable}
//                                   isDisabled={true}
//                                 /> */}
//                               </div>
//                             )}
//                           </td>
//                         );
//                       })}
//                       {/* hours array end */}
//                       <td>
//                         {/* {editFieldDate ? (
//                           <i
//                             className="fa fa-pencil overview-block__pencil-edit"
//                             onClick={this.handleOnClickEditActualHours}
//                           ></i>
//                         ) : (
//                           <i
//                             className="fa fa-save overview-block__pencil-edit"
//                             onClick={this.handleOnClickSaveActualhandle}
//                           ></i>
//                         )} */}
//                         <span className="opacity-0">0</span>
//                       </td>
//                       <td>
//                         <span className="font-24-bold font-18-bold--timesheet-day-table-task-name">
//                           {this.renderTotalActualHours(data)}{" "}
//                           {this.renderTotalActualHours(data) === 1
//                             ? "Hr"
//                             : "Hrs"}
//                         </span>
//                       </td>
//                     </tr>

//                     {/* Planned Hours Row */}
//                     {/* {this.renderPlannedHoursRow(data)} */}
//                   </div>
//                 ))
//               ) : (
//                 <tr>
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

//         {!isEmpty(monthViewTimesheetData) && (
//           <TimesheetMonthTableTotalHoursPerDayNew
//             dateArray={dateArray}
//             calculateTotalActualHourPerDay={this.calculateTotalActualHourPerDay}
//             calculateTotalPlannedHourPerDay={
//               this.calculateTotalPlannedHourPerDay
//             }
//           />
//         )}
//       </div>
//     );
//   }
// }

// const mapStateToProps = (state) => ({
//   monthViewTimesheetData: state.timesheet.monthViewTimesheetData,
//   selectedFilterMemberId: state.timesheet.selectedFilterMemberId,
// });

// export default connect(mapStateToProps, { updateWorklogByid, createWorkLog })(
//   TimesheetMonthTableNew
// );
