// import React, { Component } from "react";
// import Select from "react-select";

// import isEmpty from "../../../store/validations/is-empty";
// import { connect } from "react-redux";
// import { setAddContentSingleQuestionAction } from "./../../../store/actions/workflowsLocalAction";

// export class AddSingleQuestionWorkflowDisplay extends Component {
//   constructor() {
//     super();
//     this.state = {
//       addContentSingleQuestion: [],
//     };
//   }

//   /*==================================================================
//             lifecycle methods
//   ==================================================================*/

//   componentDidMount() {
//     this.setState({
//       addContentSingleQuestion: this.props.allStepsData[
//         this.props.activeStepIndex
//       ].addContentSingleQuestion,
//     });
//   }

//   /*==================================================================
//                 handlers
//   ==================================================================*/

//   handleOnClickRemoveElement = (index) => (e) => {
//     let addContentSingleQuestion = this.state.addContentSingleQuestion;
//     addContentSingleQuestion.splice(index, 1);

//     this.setState({ addContentSingleQuestion });

//     this.props.setAddContentSingleQuestionAction(
//       this.state.addContentSingleQuestion
//     );
//   };

//   handleOnChangeSingleQuestion = (index) => (e) => {
//     let addContentSingleQuestion = this.state.addContentSingleQuestion;
//     addContentSingleQuestion[index].contentSingleQuestionOptionSelected = e;

//     this.setState({ addContentSingleQuestion });

//     this.props.setAddContentSingleQuestionAction(
//       this.state.addContentSingleQuestion
//     );
//   };

//   /*==================================================================
//                 main
//   ==================================================================*/
//   render() {
//     const { addContentSingleQuestion } = this.state;
//     return (
//       <>
//         {!isEmpty(addContentSingleQuestion) &&
//           addContentSingleQuestion.map((data, index) => (
//             <div key={index} className="mb-50">
//               <div className="row mx-0 flex-nowrap">
//                 <h3 className="font-18-bold-space-light-uppercase">
//                   {data.contentSingleQuestionLabel}
//                 </h3>
//                 <button
//                   className="flex-shrink-0 workflow-content-block-delete-element-btn"
//                   onClick={this.handleOnClickRemoveElement(index)}
//                 >
//                   <i className="fa fa-minus"></i>
//                 </button>
//               </div>
//               <Select
//                 className="react-select-container react-select-container--workflow-details mt-26"
//                 classNamePrefix="react-select-elements"
//                 value={data.contentSingleQuestionOptionSelected}
//                 onChange={this.handleOnChangeSingleQuestion(index)}
//                 options={data.contentSingleQuestionOptions}
//                 placeholder="Select"
//                 isSearchable={false}
//                 isDisabled={true}
//               />
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
//   setAddContentSingleQuestionAction,
// })(AddSingleQuestionWorkflowDisplay);
