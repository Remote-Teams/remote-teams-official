// import React, { Component, Fragment } from "react";
// import InputFieldEmailTextPassword from "../common/InputFieldEmailTextPassword";

// import isEmpty from "../../../store/validations/is-empty";
// import { connect } from "react-redux";
// import { setAddContentTextInputFieldAction } from "./../../../store/actions/workflowsLocalAction";

// export class AddInputTextFieldWorkflowDisplay extends Component {
//   constructor() {
//     super();
//     this.state = { multipleTextInput: [] };
//   }

//   /*==================================================================
//             lifecycle methods
//   ==================================================================*/

//   componentDidMount() {
//     // console.log("DISPLAY COMPONENT MOUNT DONE", this.props.activeStepIndex);
//     this.setState({
//       multipleTextInput: this.props.allStepsData[this.props.activeStepIndex]
//         .addContentTextInputField,
//     });
//   }

//   /*==================================================================
//                 handlers
//   ==================================================================*/

//   handleChangeMultiTextElement = (index) => (e) => {
//     let multipleTextInput = this.state.multipleTextInput;
//     multipleTextInput[index].contentTextInputFieldValue = e.target.value;
//     this.setState({ multipleTextInput });

//     this.props.setAddContentTextInputFieldAction(this.state.multipleTextInput);
//   };

//   handleOnClickRemoveTextElement = (index) => (e) => {
//     let multipleTextInput = this.state.multipleTextInput;
//     multipleTextInput.splice(index, 1);
//     this.setState({ multipleTextInput });

//     this.props.setAddContentTextInputFieldAction(this.state.multipleTextInput);
//   };

//   /*==================================================================
//                 main
//   ==================================================================*/
//   render() {
//     const { multipleTextInput } = this.state;
//     return (
//       <>
//         {!isEmpty(multipleTextInput) &&
//           multipleTextInput.map((data, index) => (
//             <Fragment key={index}>
//               <div className="row mx-0 flex-nowrap">
//                 <label
//                   htmlFor={`contentTextInputField${index}`}
//                   className="font-18-bold-space-light-uppercase"
//                 >
//                   {data.contentTextInputFieldLabel}
//                 </label>
//                 <button
//                   className="flex-shrink-0 workflow-content-block-delete-element-btn"
//                   onClick={this.handleOnClickRemoveTextElement(index)}
//                 >
//                   <i className="fa fa-minus"></i>
//                 </button>
//               </div>
//               <div>
//                 <InputFieldEmailTextPassword
//                   id={`contentTextInputField${index}`}
//                   containerClassName="container-login-flow-input container-login-flow-input--forms"
//                   name="contentTextInputFieldValue"
//                   value={data.contentTextInputFieldValue}
//                   onChange={this.handleChangeMultiTextElement(index)}
//                   type="text"
//                   placeholder=""
//                   isDisabled={true}
//                 />
//               </div>
//             </Fragment>
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
//   setAddContentTextInputFieldAction,
// })(AddInputTextFieldWorkflowDisplay);
