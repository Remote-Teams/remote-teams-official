// import React, { Component } from "react";
// import isEmpty from "../../../store/validations/is-empty";
// import PageTitle from "../common/PageTitle";
// import GreenButtonSmallFont from "../common/GreenButtonSmallFont";
// import GrayLinkSmallFont from "../common/GrayLinkSmallFont";

// class EditMemberDayOffs extends Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//       memberDaysOff: this.props.memberDaysOff,
//       FREELANCER: [
//         {
//           name: "Annual paid leaves",
//           type: "FREELANCER",
//           days: "0",
//         },
//         {
//           name: "Medical leave",
//           type: "FREELANCER",
//           days: "0",
//         },
//         {
//           name: "Work from home per month",
//           type: "FREELANCER",
//           days: "0",
//         },
//       ],
//       FULLTIME: [
//         {
//           name: "Annual paid leaves",
//           type: "FULLTIME",
//           days: "0",
//         },
//         {
//           name: "Medical leave",
//           type: "FULLTIME",
//           days: "0",
//         },
//         {
//           name: "Work from home per month",
//           type: "FULLTIME",
//           days: "0",
//         },
//       ],
//       CONTRACTUAL: [
//         {
//           name: "Annual paid leaves",
//           type: "CONTRACTUAL",
//           days: "0",
//         },
//         {
//           name: "Medical leave",
//           type: "CONTRACTUAL",
//           days: "0",
//         },
//         {
//           name: "Work from home per month",
//           type: "CONTRACTUAL",
//           days: "0",
//         },
//       ],
//     };
//   }

//   /*=======================================================
//       handlers
//   =======================================================*/

//   handleSetState = (obj, id) => {
//     if (obj[id].type === "FREELANCER") {
//       this.setState({ FREELANCER: obj });
//     } else if (obj[id].type === "FULLTIME") {
//       this.setState({ FULLTIME: obj });
//     } else if (obj[id].type === "CONTRACTUAL") {
//       this.setState({ CONTRACTUAL: obj });
//     }
//   };

//   handleCounterChange = (stateObj, idCounter) => (e) => {
//     if (isEmpty(e.target.value)) {
//       stateObj[idCounter].days = 0;
//     } else {
//       stateObj[idCounter].days = e.target.validity.valid ? e.target.value : 0;
//     }
//     this.handleSetState(stateObj, idCounter);
//   };

//   handleCounterMinus = (stateObj, idCounter) => (e) => {
//     let value = stateObj[idCounter].days;
//     value = value - 1;
//     if (value < 0) {
//       value = 0;
//     }

//     stateObj[idCounter].days = value;
//     this.handleSetState(stateObj, idCounter);
//   };

//   handleCounterPlus = (stateObj, idCounter) => (e) => {
//     let value = stateObj[idCounter].days;
//     value = parseInt(value) + 1;
//     value = value.toString();

//     stateObj[idCounter].days = value;
//     this.handleSetState(stateObj, idCounter);
//   };

//   handleOnClickSave = () => {
//     console.log(this.state);
//   };

//   /*=======================================================
//       renderColumn
//   =======================================================*/
//   renderColumn = (title, stateObj) => {
//     return (
//       <div className="login-member-day-offs__content-colm">
//         {/* column title row */}
//         <div className="login-member-day-offs__content-colm-title-row row mx-0">
//           {/* column title -- text*/}
//           <div className="login-member-day-offs__content-colm-title-div">
//             <h2 className="font-18-bold-space-light-uppercase">{title}</h2>
//           </div>
//           {/* column title -- text end*/}
//         </div>
//         {/* column title row end */}

//         {/* counter */}
//         {stateObj.map((element, index) => (
//           <div
//             key={index}
//             className="row mx-0 flex-nowrap login-member-day-offs__content-colm-dataRow"
//           >
//             <>
//               <label
//                 htmlFor={`${stateObj[index].type}${index}`}
//                 className="font-24-semiBold"
//               >
//                 {element.name}
//               </label>

//               {/*  edit main count */}
//               <div className="row mx-0 flex-nowrap login-member-day-offs__content-colm-counterRow">
//                 <i
//                   className="fa fa-minus"
//                   onClick={this.handleCounterMinus(stateObj, index)}
//                 ></i>
//                 <input
//                   id={`${stateObj[index].type}${index}`}
//                   name={element.type}
//                   type="text"
//                   pattern="[0-9]*"
//                   maxLength="2"
//                   value={element.days}
//                   onChange={this.handleCounterChange(stateObj, index)}
//                 />
//                 <i
//                   className="fa fa-plus"
//                   onClick={this.handleCounterPlus(stateObj, index)}
//                 ></i>
//               </div>
//             </>
//           </div>
//         ))}
//       </div>
//     );
//   };

//   /*=======================================================
//       main
//   =======================================================*/
//   render() {
//     return (
//       <>
//         <div className="login-member-day-offs__content">
//           <div className="row mx-0 justify-content-between">
//             <PageTitle
//               title="manage member day offs"
//               shadow="member day offs"
//             />
//             <div className="mt-30">
//               <GrayLinkSmallFont path="/settings-organisation" text="Go Back" />
//             </div>
//           </div>

//           {/* content */}
//           <div className="row mx-0 mb-30">
//             {/* fulltime member */}
//             {this.renderColumn("Fulltime member day offs", this.state.FULLTIME)}
//             {/* freelancers */}
//             {this.renderColumn("Freelancers day offs", this.state.FREELANCER)}
//             {/* contractual */}
//             {this.renderColumn("Contract member", this.state.CONTRACTUAL)}
//           </div>

//           <GreenButtonSmallFont
//             text="Save All"
//             onClick={this.handleOnClickSave}
//           />
//         </div>
//       </>
//     );
//   }
// }

// export default EditMemberDayOffs;
