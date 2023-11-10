// import React, { Component } from "react";
// import InputFieldEmailTextPassword from "../common/InputFieldEmailTextPassword";

// import isEmpty from "../../../store/validations/is-empty";
// import { connect } from "react-redux";
// import {
//   goBackQuestionFieldPayload,
//   closeAddContentBlockPayload,
//   setAddContentBlockAction,
//   setAddContentMultipleQuestionAction,
// } from "./../../../store/actions/workflowsLocalAction";

// export class AddMultipleQuestionWorkflow extends Component {
//   constructor() {
//     super();
//     this.state = {
//       contentMCQsLabel: "",
//       multipleMCQsOptions: [
//         {
//           contentMCQsOptionName: "",
//         },
//         {
//           contentMCQsOptionName: "",
//         },
//       ],
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
//             handlers
//   ==================================================================*/

//   handleChange = (e) => {
//     this.setState({
//       [e.target.name]: e.target.value,
//     });
//   };

//   handleChangeMultiElementOption = (index) => (e) => {
//     let multipleMCQsOptions = this.state.multipleMCQsOptions;
//     multipleMCQsOptions[index].contentMCQsOptionName = e.target.value;
//     this.setState({ multipleMCQsOptions });
//   };

//   handleOnClickAddMoreElement = () => {
//     let obj = {
//       contentMCQsOptionName: "",
//     };
//     let multipleMCQsOptions = this.state.multipleMCQsOptions;
//     multipleMCQsOptions.push(obj);
//     this.setState({ multipleMCQsOptions });
//   };

//   handleOnClickRemoveElement = (index) => (e) => {
//     let multipleMCQsOptions = this.state.multipleMCQsOptions;
//     multipleMCQsOptions.splice(index, 1);
//     this.setState({ multipleMCQsOptions });
//   };

//   handleOnClickSaveMCQs = (val) => (e) => {
//     // save options as value and label pair
//     let contentMultipleQuestionOptions = [];
//     this.state.multipleMCQsOptions.map((data, index) => {
//       contentMultipleQuestionOptions.push({
//         value: false,
//         label: data.contentMCQsOptionName,
//       });
//     });

//     let setData = {
//       contentMultipleQuestionLabel: this.state.contentMCQsLabel,
//       contentMultipleQuestionOptions,
//     };

//     let localActionObj = this.state.addContentMultipleQuestion;
//     localActionObj.push(setData);

//     this.props.setAddContentMultipleQuestionAction(localActionObj);

//     // go back or exit action
//     if (val === "back") {
//       this.props.setAddContentBlockAction(goBackQuestionFieldPayload);
//     } else if (val === "exit") {
//       this.props.setAddContentBlockAction(closeAddContentBlockPayload);
//     }
//   };

//   /*==================================================================
//             main
//   ==================================================================*/
//   render() {
//     const { contentMCQsLabel } = this.state;
//     return (
//       <>
//         <div className="workflow-add-input-field-block">
//           <h4 className="font-21-semiBold workflow-add-block-title">
//             Add Questions
//           </h4>
//           <p className="workflow-add-input-field-note">
//             To add more flexibility to process
//           </p>

//           <div className="workflow-add-questions-content-block">
//             <InputFieldEmailTextPassword
//               containerClassName="container-login-flow-input container-login-flow-input--forms"
//               name="contentMCQsLabel"
//               value={contentMCQsLabel}
//               onChange={this.handleChange}
//               type="text"
//               placeholder="Label/Question"
//             />

//             {!isEmpty(this.state.multipleMCQsOptions) &&
//               this.state.multipleMCQsOptions.map((data, index) => (
//                 <div key={index} className="row mx-0 flex-nowrap">
//                   <div>
//                     <InputFieldEmailTextPassword
//                       id={`contentMCQsOptionName${index}`}
//                       containerClassName="container-login-flow-input container-login-flow-input--forms"
//                       name="contentMCQsOptionName"
//                       value={data.contentMCQsOptionName}
//                       onChange={this.handleChangeMultiElementOption(index)}
//                       type="text"
//                       placeholder="Enter option"
//                     />
//                   </div>
//                   {index !== 0 && (
//                     <button
//                       className="workflow-fa-times-delete-button ml-2 mb-30"
//                       onClick={this.handleOnClickRemoveElement(index)}
//                     >
//                       <i className="fa fa-times"></i>
//                     </button>
//                   )}
//                 </div>
//               ))}

//             <div className="text-center">
//               <button
//                 className="workflow-add-new-grey-button"
//                 onClick={this.handleOnClickAddMoreElement}
//               >
//                 <i className="fa fa-plus"></i>
//               </button>
//             </div>
//           </div>
//         </div>
//         {/* go back or exit with save data */}
//         <div className="workflow-add-input-field-block-save-btn">
//           <button
//             className="workflow-add-input-field-save-and-go-back-btn"
//             onClick={this.handleOnClickSaveMCQs("back")}
//           >
//             Save &amp; Go Back
//           </button>
//           <button
//             className="workflow-add-input-field-save-and-exit-btn"
//             onClick={this.handleOnClickSaveMCQs("exit")}
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
//   setAddContentMultipleQuestionAction,
// })(AddMultipleQuestionWorkflow);
