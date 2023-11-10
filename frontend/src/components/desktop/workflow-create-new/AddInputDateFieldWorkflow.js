// import React, { Component } from "react";
// import InputFieldEmailTextPassword from "../common/InputFieldEmailTextPassword";

// import isEmpty from "../../../store/validations/is-empty";
// import { connect } from "react-redux";
// import {
//   goBackAddInputFieldPayload,
//   closeAddContentBlockPayload,
//   setAddContentBlockAction,
//   setAddContentDateInputFieldAction,
// } from "./../../../store/actions/workflowsLocalAction";

// export class AddInputDateFieldWorkflow extends Component {
//   constructor() {
//     super();
//     this.state = {
//       multipleDateInput: [
//         {
//           contentDateInputFieldLabel: "",
//           contentDateInputFieldValue: "",
//         },
//       ],
//       addContentDateInputField: [],
//     };
//   }

//   /*==================================================================
//             lifecycle methods
//   ==================================================================*/

//   componentDidMount() {
//     this.setState({
//       addContentDateInputField: this.props.allStepsData[
//         this.props.activeStepIndex
//       ].addContentDateInputField,
//     });
//   }

//   /*==================================================================
//             handlers
//   ==================================================================*/

//   handleChangeMultiTextElementLabel = (index) => (e) => {
//     let multipleDateInput = this.state.multipleDateInput;
//     multipleDateInput[index].contentDateInputFieldLabel = e.target.value;
//     this.setState({ multipleDateInput });
//   };

//   handleOnClickAddMoreTextElement = () => {
//     let obj = {
//       contentDateInputFieldLabel: "",
//       contentDateInputFieldValue: "",
//     };
//     let multipleDateInput = this.state.multipleDateInput;
//     multipleDateInput.push(obj);
//     this.setState({ multipleDateInput });
//   };

//   handleOnClickRemoveTextElement = (index) => (e) => {
//     let multipleDateInput = this.state.multipleDateInput;
//     multipleDateInput.splice(index, 1);
//     this.setState({ multipleDateInput });
//   };

//   handleOnClickSaveAddInputField = (val) => (e) => {
//     let localActionObj = this.state.addContentDateInputField;
//     // set data in localActionObj
//     this.state.multipleDateInput.map((data, index) => {
//       localActionObj.push({
//         contentDateInputFieldLabel: data.contentDateInputFieldLabel,
//         contentDateInputFieldValue: new Date(),
//       });
//     });
//     // add content input field data action
//     console.log(localActionObj);
//     this.props.setAddContentDateInputFieldAction(localActionObj);

//     // go back or exit action
//     if (val === "back") {
//       this.props.setAddContentBlockAction(goBackAddInputFieldPayload);
//     } else if (val === "exit") {
//       this.props.setAddContentBlockAction(closeAddContentBlockPayload);
//     }
//   };

//   /*==================================================================
//             main
//   ==================================================================*/
//   render() {
//     return (
//       <>
//         <div className="workflow-add-input-field-block">
//           <h4 className="font-21-semiBold workflow-add-block-title workflow-add-block-title--mb">
//             Add Date Field
//           </h4>

//           {!isEmpty(this.state.multipleDateInput) &&
//             this.state.multipleDateInput.map((data, index) => (
//               <div key={index} className="row mx-0 flex-nowrap">
//                 <div>
//                   <InputFieldEmailTextPassword
//                     id={`contentDateInputFieldLabel${index}`}
//                     containerClassName="container-login-flow-input container-login-flow-input--forms"
//                     label="What would the label be?"
//                     name="contentDateInputFieldLabel"
//                     value={data.contentDateInputFieldLabel}
//                     onChange={this.handleChangeMultiTextElementLabel(index)}
//                     type="text"
//                     placeholder="Enter label"
//                   />
//                 </div>
//                 {index !== 0 && (
//                   <button
//                     className="workflow-fa-times-delete-button ml-3"
//                     onClick={this.handleOnClickRemoveTextElement(index)}
//                   >
//                     <i className="fa fa-times"></i>
//                   </button>
//                 )}
//               </div>
//             ))}

//           <div className="text-center">
//             <button
//               className="workflow-add-new-grey-button"
//               onClick={this.handleOnClickAddMoreTextElement}
//             >
//               <i className="fa fa-plus"></i>
//             </button>
//           </div>
//         </div>
//         {/* go back or exit with save data */}
//         <div className="workflow-add-input-field-block-save-btn">
//           <button
//             className="workflow-add-input-field-save-and-go-back-btn"
//             onClick={this.handleOnClickSaveAddInputField("back")}
//           >
//             Save &amp; Go Back
//           </button>
//           <button
//             className="workflow-add-input-field-save-and-exit-btn"
//             onClick={this.handleOnClickSaveAddInputField("exit")}
//           >
//             Save &amp; Exit
//           </button>
//         </div>
//       </>
//     );
//   }
// }

// const mapStateToProps = (state) => ({
//   allStepsData: state.workflowsLocal.allStepsData,
// });

// export default connect(mapStateToProps, {
//   setAddContentBlockAction,
//   setAddContentDateInputFieldAction,
// })(AddInputDateFieldWorkflow);
