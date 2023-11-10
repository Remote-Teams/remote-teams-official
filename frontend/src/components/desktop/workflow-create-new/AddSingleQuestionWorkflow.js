// import React, { Component } from "react";
// import InputFieldEmailTextPassword from "../common/InputFieldEmailTextPassword";

// import isEmpty from "../../../store/validations/is-empty";
// import { connect } from "react-redux";
// import {
//   goBackQuestionFieldPayload,
//   closeAddContentBlockPayload,
//   setAddContentBlockAction,
//   setAddContentSingleQuestionAction,
// } from "./../../../store/actions/workflowsLocalAction";

// export class AddSingleQuestionWorkflow extends Component {
//   constructor() {
//     super();
//     this.state = {
//       contentSQsLabel: "",
//       multipleSQsOptions: [
//         {
//           contentSQsOptionName: "",
//         },
//         {
//           contentSQsOptionName: "",
//         },
//       ],
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
//             handlers
//   ==================================================================*/

//   handleChange = (e) => {
//     this.setState({
//       [e.target.name]: e.target.value,
//     });
//   };

//   handleChangeMultiElementOption = (index) => (e) => {
//     let multipleSQsOptions = this.state.multipleSQsOptions;
//     multipleSQsOptions[index].contentSQsOptionName = e.target.value;
//     this.setState({ multipleSQsOptions });
//   };

//   handleOnClickAddMoreElement = () => {
//     let obj = {
//       contentSQsOptionName: "",
//     };
//     let multipleSQsOptions = this.state.multipleSQsOptions;
//     multipleSQsOptions.push(obj);
//     this.setState({ multipleSQsOptions });
//   };

//   handleOnClickRemoveElement = (index) => (e) => {
//     let multipleSQsOptions = this.state.multipleSQsOptions;
//     multipleSQsOptions.splice(index, 1);
//     this.setState({ multipleSQsOptions });
//   };

//   handleOnClickSaveSQs = (val) => (e) => {
//     // save options as value and label pair
//     let contentSingleQuestionOptions = [];
//     this.state.multipleSQsOptions.map((data, index) => {
//       contentSingleQuestionOptions.push({
//         value: data.contentSQsOptionName,
//         label: data.contentSQsOptionName,
//       });
//     });

//     let setData = {
//       contentSingleQuestionLabel: this.state.contentSQsLabel,
//       contentSingleQuestionOptions,
//       contentSingleQuestionOptionSelected: contentSingleQuestionOptions[0],
//     };

//     let localActionObj = this.state.addContentSingleQuestion;
//     localActionObj.push(setData);

//     this.props.setAddContentSingleQuestionAction(localActionObj);

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
//     const { contentSQsLabel } = this.state;
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
//               name="contentSQsLabel"
//               value={contentSQsLabel}
//               onChange={this.handleChange}
//               type="text"
//               placeholder="Label/Question"
//             />

//             {!isEmpty(this.state.multipleSQsOptions) &&
//               this.state.multipleSQsOptions.map((data, index) => (
//                 <div key={index} className="row mx-0 flex-nowrap">
//                   <div>
//                     <InputFieldEmailTextPassword
//                       id={`contentSQsOptionName${index}`}
//                       containerClassName="container-login-flow-input container-login-flow-input--forms"
//                       name="contentSQsOptionName"
//                       value={data.contentSQsOptionName}
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
//             onClick={this.handleOnClickSaveSQs("back")}
//           >
//             Save &amp; Go Back
//           </button>
//           <button
//             className="workflow-add-input-field-save-and-exit-btn"
//             onClick={this.handleOnClickSaveSQs("exit")}
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
//   setAddContentSingleQuestionAction,
// })(AddSingleQuestionWorkflow);
