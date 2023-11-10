// import React, { Component } from "react";
// import Select from "react-select";

// import { connect } from "react-redux";
// import {
//   closeAddContentBlockPayload,
//   setAddContentBlockAction,
//   setAddContentConditionsAction,
// } from "./../../../store/actions/workflowsLocalAction";
// import isEmpty from "../../../store/validations/is-empty";

// const stepOptions = [
//   { value: "lorem", label: "Lorem" },
//   { value: "lorem1", label: "Lorem1" },
//   { value: "lorem2", label: "Lorem2" },
// ];
// const questionOptions = [
//   { value: "lorem", label: "Lorem" },
//   { value: "lorem1", label: "Lorem1" },
//   { value: "lorem2", label: "Lorem2" },
// ];
// const answerOptions = [
//   { value: "lorem", label: "Lorem" },
//   { value: "lorem1", label: "Lorem1" },
//   { value: "lorem2", label: "Lorem2" },
// ];

// export class AddConditionsWorkflow extends Component {
//   constructor() {
//     super();
//     this.state = {
//       stepName: null,
//       question: null,
//       answer: null,
//       addContentConditions: [],
//     };
//   }

//   /*==================================================================
//             lifecycle methods
//   ==================================================================*/

//   componentDidMount() {
//     this.setState({
//       addContentConditions: this.props.allStepsData[this.props.activeStepIndex]
//         .addContentConditions,
//     });
//   }

//   /*==================================================================
//             handlers
//   ==================================================================*/

//   handleChangeStepName = (stepName) => {
//     this.setState({ stepName });
//   };

//   handleChangeQuestion = (question) => {
//     this.setState({ question });
//   };

//   handleChangeAnswer = (answer) => {
//     this.setState({ answer });
//   };

//   handleOnClickSaveConditions = () => {
//     let localActionObj = this.state.addContentConditions;
//     if (
//       !isEmpty(this.state.stepName) &&
//       !isEmpty(this.state.question) &&
//       !isEmpty(this.state.answer)
//     ) {
//       localActionObj.push({
//         stepName: this.state.stepName.label,
//         question: this.state.question.label,
//         answer: this.state.answer.label,
//       });

//       this.props.setAddContentConditionsAction(localActionObj);

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
//           <h4 className="font-21-semiBold workflow-add-block-title">
//             Add Conditions
//           </h4>
//           <p className="workflow-add-input-field-note">
//             Next Step would be decided based on answer selected
//           </p>
//         </div>
//         {/* dropdowns */}
//         <div className="row mx-0 align-items-center justify-content-center">
//           <h4 className="font-18-bold font-18-bold-if pl-10">IF</h4>
//           <Select
//             className="react-select-container react-select-container--for-dependency react-select-container--direction"
//             classNamePrefix="react-select-elements"
//             value={this.state.stepName}
//             onChange={this.handleChangeStepName}
//             options={stepOptions}
//             placeholder="Question in the step"
//             isSearchable={false}
//           />
//         </div>
//         <div className="row mx-0 align-items-center justify-content-center mt-40">
//           <h4 className="font-18-bold font-18-bold-if pl-10">IS</h4>
//           <Select
//             className="react-select-container react-select-container--for-dependency react-select-container--direction"
//             classNamePrefix="react-select-elements"
//             value={this.state.question}
//             onChange={this.handleChangeQuestion}
//             options={questionOptions}
//             placeholder="One of the options"
//             isSearchable={false}
//           />
//         </div>
//         <h4 className="font-18-bold font-18-bold-if mt-40 text-center">
//           Then go to step
//         </h4>
//         <div className="row mx-0 justify-content-center mt-20 mb-20">
//           <Select
//             className="react-select-container react-select-container--for-dependency react-select-container--direction-step"
//             classNamePrefix="react-select-elements"
//             value={this.state.answer}
//             onChange={this.handleChangeAnswer}
//             options={answerOptions}
//             placeholder="Select Step"
//             isSearchable={false}
//           />
//         </div>
//         <button
//           className="workflow-add-input-field-block-save-btn"
//           onClick={this.handleOnClickSaveConditions}
//         >
//           Save
//         </button>
//       </>
//     );
//   }
// }

// const mapStateToProps = (state) => ({
//   allStepsData: state.workflowsLocal.allStepsData,
// });

// export default connect(mapStateToProps, {
//   setAddContentBlockAction,
//   setAddContentConditionsAction,
// })(AddConditionsWorkflow);
