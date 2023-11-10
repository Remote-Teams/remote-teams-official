// import React, { Component } from "react";
// import InputFieldEmailTextPassword from "../common/InputFieldEmailTextPassword";

// import isEmpty from "../../../store/validations/is-empty";
// import { connect } from "react-redux";
// import {
//   goBackAddInputFieldPayload,
//   closeAddContentBlockPayload,
//   setAddContentBlockAction,
//   setAddContentTextInputFieldAction,
// } from "./../../../store/actions/workflowsLocalAction";

// export class AddInputTextFieldWorkflow extends Component {
//   constructor() {
//     super();
//     this.state = {
//       multipleTextInput: [
//         {
//           contentTextInputFieldLabel: "",
//           contentTextInputFieldValue: "",
//         },
//       ],
//       addContentTextInputField: [],
//     };
//   }

//   /*==================================================================
//             lifecycle methods
//   ==================================================================*/

//   componentDidMount() {
//     this.setState({
//       addContentTextInputField: this.props.allStepsData[
//         this.props.activeStepIndex
//       ].addContentTextInputField,
//     });
//   }

//   /*==================================================================
//             handlers
//   ==================================================================*/

//   handleChangeMultiTextElementLabel = (index) => (e) => {
//     let multipleTextInput = this.state.multipleTextInput;
//     multipleTextInput[index].contentTextInputFieldLabel = e.target.value;
//     this.setState({ multipleTextInput });
//   };

//   handleOnClickAddMoreTextElement = () => {
//     let obj = {
//       contentTextInputFieldLabel: "",
//       contentTextInputFieldValue: "",
//     };
//     let multipleTextInput = this.state.multipleTextInput;
//     multipleTextInput.push(obj);
//     this.setState({ multipleTextInput });
//   };

//   handleOnClickRemoveTextElement = (index) => (e) => {
//     let multipleTextInput = this.state.multipleTextInput;
//     multipleTextInput.splice(index, 1);
//     this.setState({ multipleTextInput });
//   };

//   handleOnClickSaveAddInputField = (val) => (e) => {
//     let localActionObj = this.state.addContentTextInputField;
//     // set data in localActionObj
//     this.state.multipleTextInput.map((data, index) => {
//       localActionObj.push({
//         contentTextInputFieldLabel: data.contentTextInputFieldLabel,
//         contentTextInputFieldValue: "",
//       });
//     });
//     // add content input field data action
//     this.props.setAddContentTextInputFieldAction(localActionObj);

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
//             Add Text Input Field
//           </h4>

//           {!isEmpty(this.state.multipleTextInput) &&
//             this.state.multipleTextInput.map((data, index) => (
//               <div key={index} className="row mx-0 flex-nowrap">
//                 <div>
//                   <InputFieldEmailTextPassword
//                     id={`contentTextInputFieldLabel${index}`}
//                     containerClassName="container-login-flow-input container-login-flow-input--forms"
//                     label="What would the label be?"
//                     name="contentTextInputFieldLabel"
//                     value={data.contentTextInputFieldLabel}
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
//   setAddContentTextInputFieldAction,
// })(AddInputTextFieldWorkflow);
