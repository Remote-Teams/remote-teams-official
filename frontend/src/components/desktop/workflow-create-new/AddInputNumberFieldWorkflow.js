// import React, { Component } from "react";
// import InputFieldEmailTextPassword from "../common/InputFieldEmailTextPassword";

// import isEmpty from "../../../store/validations/is-empty";
// import { connect } from "react-redux";
// import {
//   goBackAddInputFieldPayload,
//   closeAddContentBlockPayload,
//   setAddContentBlockAction,
//   setAddContentNumberInputFieldAction,
// } from "./../../../store/actions/workflowsLocalAction";

// export class AddInputNumberFieldWorkflow extends Component {
//   constructor() {
//     super();
//     this.state = {
//       multipleNumberInput: [
//         {
//           contentNumberInputFieldLabel: "",
//           contentNumberInputFieldValue: "",
//         },
//       ],
//       addContentNumberInputField: [],
//     };
//   }

//   /*==================================================================
//             lifecycle methods
//   ==================================================================*/

//   componentDidMount() {
//     this.setState({
//       addContentNumberInputField: this.props.allStepsData[
//         this.props.activeStepIndex
//       ].addContentNumberInputField,
//     });
//   }

//   /*==================================================================
//             handlers
//   ==================================================================*/

//   handleChangeMultiTextElementLabel = (index) => (e) => {
//     let multipleNumberInput = this.state.multipleNumberInput;
//     multipleNumberInput[index].contentNumberInputFieldLabel = e.target.value;
//     this.setState({ multipleNumberInput });
//   };

//   handleOnClickAddMoreTextElement = () => {
//     let obj = {
//       contentNumberInputFieldLabel: "",
//       contentNumberInputFieldValue: "",
//     };
//     let multipleNumberInput = this.state.multipleNumberInput;
//     multipleNumberInput.push(obj);
//     this.setState({ multipleNumberInput });
//   };

//   handleOnClickRemoveTextElement = (index) => (e) => {
//     let multipleNumberInput = this.state.multipleNumberInput;
//     multipleNumberInput.splice(index, 1);
//     this.setState({ multipleNumberInput });
//   };

//   handleOnClickSaveAddInputField = (val) => (e) => {
//     let localActionObj = this.state.addContentNumberInputField;
//     // set data in localActionObj
//     this.state.multipleNumberInput.map((data, index) => {
//       localActionObj.push({
//         contentNumberInputFieldLabel: data.contentNumberInputFieldLabel,
//         contentNumberInputFieldValue: "",
//       });
//     });
//     // add content input field data action
//     this.props.setAddContentNumberInputFieldAction(localActionObj);

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
//             Add Numerical Field
//           </h4>

//           {!isEmpty(this.state.multipleNumberInput) &&
//             this.state.multipleNumberInput.map((data, index) => (
//               <div key={index} className="row mx-0 flex-nowrap">
//                 <div>
//                   <InputFieldEmailTextPassword
//                     id={`contentNumberInputFieldLabel${index}`}
//                     containerClassName="container-login-flow-input container-login-flow-input--forms"
//                     label="What would the label be?"
//                     name="contentNumberInputFieldLabel"
//                     value={data.contentNumberInputFieldLabel}
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
//   setAddContentNumberInputFieldAction,
// })(AddInputNumberFieldWorkflow);
