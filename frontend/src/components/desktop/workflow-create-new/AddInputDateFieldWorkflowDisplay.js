// import React, { Component, Fragment } from "react";
// import DatePicker from "react-datepicker";
// import "react-datepicker/dist/react-datepicker.css";

// import isEmpty from "../../../store/validations/is-empty";
// import { connect } from "react-redux";
// import { setAddContentDateInputFieldAction } from "./../../../store/actions/workflowsLocalAction";

// export class AddInputDateFieldWorkflowDisplay extends Component {
//   constructor() {
//     super();
//     this.state = { multipleDateInput: [] };
//   }

//   /*==================================================================
//             lifecycle methods
//   ==================================================================*/

//   componentDidMount() {
//     this.setState({
//       multipleDateInput: this.props.allStepsData[this.props.activeStepIndex]
//         .addContentDateInputField,
//     });
//   }

//   /*==================================================================
//                 handlers
//   ==================================================================*/

//   handleChangeMultiDateElement = (index) => (date) => {
//     let multipleDateInput = this.state.multipleDateInput;

//     if (date === null) {
//       multipleDateInput[index].contentDateInputFieldValue = new Date();
//     } else {
//       multipleDateInput[index].contentDateInputFieldValue = date;
//     }

//     this.setState({ multipleDateInput });
//     this.props.setAddContentDateInputFieldAction(this.state.multipleDateInput);
//   };

//   handleOnClickRemoveDateElement = (index) => (e) => {
//     let multipleDateInput = this.state.multipleDateInput;
//     multipleDateInput.splice(index, 1);
//     this.setState({ multipleDateInput });

//     this.props.setAddContentDateInputFieldAction(this.state.multipleDateInput);
//   };

//   /*==================================================================
//                 main
//   ==================================================================*/
//   render() {
//     const { multipleDateInput } = this.state;
//     return (
//       <>
//         {!isEmpty(multipleDateInput) &&
//           multipleDateInput.map((data, index) => (
//             <div key={index} className="pb-10">
//               <div className="row mx-0 flex-nowrap">
//                 <label
//                   htmlFor={`contentDateInputField${index}`}
//                   className="font-18-bold-space-light-uppercase"
//                 >
//                   {data.contentDateInputFieldLabel}
//                 </label>
//                 <button
//                   className="flex-shrink-0 workflow-content-block-delete-element-btn"
//                   onClick={this.handleOnClickRemoveDateElement(index)}
//                 >
//                   <i className="fa fa-minus"></i>
//                 </button>
//               </div>
//               <div className="date-picker-common datepicker-nav-arrow-login-dash mt-26">
//                 <DatePicker
//                   id={`contentDateInputField${index}`}
//                   autoComplete="off"
//                   minDate={new Date()}
//                   selected={data.contentDateInputFieldValue}
//                   onChange={this.handleChangeMultiDateElement(index)}
//                   disabled={true}
//                 />
//               </div>
//             </div>
//           ))}
//       </>
//     );
//   }
// }

// const mapStateToProps = (state) => ({
//   addContent: state.workflowsLocal.addContent,
//   allStepsData: state.workflowsLocal.allStepsData,
// });

// export default connect(mapStateToProps, {
//   setAddContentDateInputFieldAction,
// })(AddInputDateFieldWorkflowDisplay);
