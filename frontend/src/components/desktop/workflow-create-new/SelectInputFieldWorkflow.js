// import React, { Component } from "react";
// import AddInputDateFieldWorkflow from "./AddInputDateFieldWorkflow";
// import AddInputNumberFieldWorkflow from "./AddInputNumberFieldWorkflow";
// import AddInputTextFieldWorkflow from "./AddInputTextFieldWorkflow";

// import isEmpty from "../../../store/validations/is-empty";
// import { connect } from "react-redux";
// import {
//   stepsContentIconButtonOptions,
//   setAddContentBlockAction,
// } from "./../../../store/actions/workflowsLocalAction";

// const inputFieldOption = ["text", "date", "number"];

// export class SelectInputFieldWorkflow extends Component {
//   /*==================================================================
//             handlers
//   ==================================================================*/

//   handleOnClickSelectAddQuestionChoice = (val) => (e) => {
//     this.props.setAddContentBlockAction({
//       addInputFieldSelectButtonClicked: val,
//       isDisplayAddContentBlock: true,
//       displayAddContentIconButtonClicked: stepsContentIconButtonOptions[0],
//     });
//   };

//   /*==================================================================
//             main
//   ==================================================================*/
//   render() {
//     const { addInputFieldSelectButtonClicked } = this.props.addContent;
//     return (
//       <>
//         {isEmpty(addInputFieldSelectButtonClicked) && (
//           <div className="workflow-add-input-field-block mb-30">
//             <h4 className="font-21-semiBold workflow-add-block-title">
//               Select Input Field Type
//             </h4>
//             <div className="workflow-add-questions-content-block mt-35">
//               <button
//                 className="add-question-choice-btn"
//                 onClick={this.handleOnClickSelectAddQuestionChoice(
//                   inputFieldOption[0]
//                 )}
//               >
//                 Text Input
//                 <i className="fa fa-plus"></i>
//               </button>
//               <button
//                 className="add-question-choice-btn"
//                 onClick={this.handleOnClickSelectAddQuestionChoice(
//                   inputFieldOption[1]
//                 )}
//               >
//                 Date Field
//                 <i className="fa fa-plus"></i>
//               </button>
//               <button
//                 className="add-question-choice-btn"
//                 onClick={this.handleOnClickSelectAddQuestionChoice(
//                   inputFieldOption[2]
//                 )}
//               >
//                 Numerical
//                 <i className="fa fa-plus"></i>
//               </button>
//             </div>
//           </div>
//         )}
//         {addInputFieldSelectButtonClicked === inputFieldOption[0] && (
//           <AddInputTextFieldWorkflow
//             activeStepIndex={this.props.activeStepIndex}
//           />
//         )}
//         {addInputFieldSelectButtonClicked === inputFieldOption[1] && (
//           <AddInputDateFieldWorkflow
//             activeStepIndex={this.props.activeStepIndex}
//           />
//         )}
//         {addInputFieldSelectButtonClicked === inputFieldOption[2] && (
//           <AddInputNumberFieldWorkflow
//             activeStepIndex={this.props.activeStepIndex}
//           />
//         )}
//       </>
//     );
//   }
// }

// const mapStateToProps = (state) => ({
//   addContent: state.workflowsLocal.addContent,
// });

// export default connect(mapStateToProps, { setAddContentBlockAction })(
//   SelectInputFieldWorkflow
// );
