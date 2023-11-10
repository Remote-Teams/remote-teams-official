// import React, { Component } from "react";
// import AddMultipleQuestionWorkflow from "./AddMultipleQuestionWorkflow";
// import AddSingleQuestionWorkflow from "./AddSingleQuestionWorkflow";

// import isEmpty from "../../../store/validations/is-empty";
// import { connect } from "react-redux";
// import {
//   stepsContentIconButtonOptions,
//   setAddContentBlockAction,
// } from "./../../../store/actions/workflowsLocalAction";

// const questionChoiceOption = ["single", "mcq"];

// export class SelectQuestionWorkflow extends Component {
//   /*==================================================================
//             handlers
//   ==================================================================*/

//   handleOnClickSelectAddQuestionChoice = (val) => (e) => {
//     this.props.setAddContentBlockAction({
//       addQuestionSelectButtonClicked: val,
//       isDisplayAddContentBlock: true,
//       displayAddContentIconButtonClicked: stepsContentIconButtonOptions[1],
//     });
//   };

//   /*==================================================================
//             main
//   ==================================================================*/
//   render() {
//     const { addQuestionSelectButtonClicked } = this.props.addContent;
//     return (
//       <>
//         {isEmpty(addQuestionSelectButtonClicked) && (
//           <div className="workflow-add-input-field-block mb-30">
//             <h4 className="font-21-semiBold workflow-add-block-title">
//               Add Question Field
//             </h4>
//             <div className="mt-35">
//               <button
//                 className="add-question-choice-btn add-question-choice-btn--qstn"
//                 onClick={this.handleOnClickSelectAddQuestionChoice(
//                   questionChoiceOption[0]
//                 )}
//               >
//                 With Single Answer
//                 <i className="fa fa-plus"></i>
//               </button>
//               <button
//                 className="add-question-choice-btn add-question-choice-btn--qstn"
//                 onClick={this.handleOnClickSelectAddQuestionChoice(
//                   questionChoiceOption[1]
//                 )}
//               >
//                 With Multiple Answers
//                 <i className="fa fa-plus"></i>
//               </button>
//             </div>
//           </div>
//         )}
//         {addQuestionSelectButtonClicked === questionChoiceOption[0] && (
//           <AddSingleQuestionWorkflow
//             activeStepIndex={this.props.activeStepIndex}
//           />
//         )}
//         {addQuestionSelectButtonClicked === questionChoiceOption[1] && (
//           <AddMultipleQuestionWorkflow
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
//   SelectQuestionWorkflow
// );
