// import React, { Component } from "react";
// import Checkbox from "rc-checkbox";
// import "rc-checkbox/assets/index.css";

// import isEmpty from "../../../store/validations/is-empty";
// import { connect } from "react-redux";
// import { setAddContentMultipleQuestionAction } from "./../../../store/actions/workflowsLocalAction";

// export class AddMultipleQuestionWorkflowDisplay extends Component {
//   constructor() {
//     super();
//     this.state = {
//       addContentMultipleQuestion: [],
//     };
//   }

//   /*==================================================================
//             lifecycle methods
//   ==================================================================*/

//   componentDidMount() {
//     this.setState({
//       addContentMultipleQuestion: this.props.allStepsData[
//         this.props.activeStepIndex
//       ].addContentMultipleQuestion,
//     });
//   }

//   /*==================================================================
//                 handlers
//   ==================================================================*/

//   handleOnClickRemoveElement = (index) => (e) => {
//     let addContentMultipleQuestion = this.state.addContentMultipleQuestion;
//     addContentMultipleQuestion.splice(index, 1);

//     this.setState({ addContentMultipleQuestion });

//     this.props.setAddContentMultipleQuestionAction(
//       this.state.addContentMultipleQuestion
//     );
//   };

//   handleOnChangeMultipleQuestion = (index, optionIndex) => (e) => {
//     let addContentMultipleQuestion = this.state.addContentMultipleQuestion;
//     addContentMultipleQuestion[index].contentMultipleQuestionOptions[
//       optionIndex
//     ].value = e.target.checked;

//     this.setState({ addContentMultipleQuestion });

//     this.props.setAddContentMultipleQuestionAction(
//       this.state.addContentMultipleQuestion
//     );
//   };

//   /*==================================================================
//                 main
//   ==================================================================*/
//   render() {
//     const { addContentMultipleQuestion } = this.state;
//     return (
//       <>
//         {!isEmpty(addContentMultipleQuestion) &&
//           addContentMultipleQuestion.map((data, index) => (
//             <div key={index} className="mb-30">
//               <div className="row mx-0 flex-nowrap">
//                 <h3 className="font-18-bold-space-light-uppercase">
//                   {data.contentMultipleQuestionLabel}
//                 </h3>
//                 <button
//                   className="flex-shrink-0 workflow-content-block-delete-element-btn"
//                   onClick={this.handleOnClickRemoveElement(index)}
//                 >
//                   <i className="fa fa-minus"></i>
//                 </button>
//               </div>

//               {!isEmpty(data.contentMultipleQuestionOptions) &&
//                 data.contentMultipleQuestionOptions.map(
//                   (optionData, optionIndex) => (
//                     <div
//                       key={optionIndex}
//                       className="row mx-0 flex-nowrap customCheckbox mt-26"
//                     >
//                       <Checkbox
//                         disabled={true}
//                         id={`${data.contentMultipleQuestionLabel}Checkbox${optionIndex}`}
//                         onChange={this.handleOnChangeMultipleQuestion(
//                           index,
//                           optionIndex
//                         )}
//                         value={optionData.value}
//                         checked={optionData.value}
//                         defaultChecked={optionData.value}
//                       />
//                       <label
//                         htmlFor={`${data.contentMultipleQuestionLabel}Checkbox${optionIndex}`}
//                         className="font-24-bold workflow-details-right-card-title pl-20"
//                       >
//                         {optionData.label}
//                       </label>
//                     </div>
//                   )
//                 )}
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
//   setAddContentMultipleQuestionAction,
// })(AddMultipleQuestionWorkflowDisplay);
