// import React, { Component, Fragment } from "react";
// import InputFieldNumber from "../common/InputFieldNumber";

// import isEmpty from "../../../store/validations/is-empty";
// import { connect } from "react-redux";
// import { setAddContentNumberInputFieldAction } from "./../../../store/actions/workflowsLocalAction";

// export class AddInputNumberFieldWorkflowDisplay extends Component {
//   constructor() {
//     super();
//     this.state = { multipleNumberInput: [] };
//   }

//   /*==================================================================
//             lifecycle methods
//   ==================================================================*/

//   componentDidMount() {
//     // console.log("DISPLAY COMPONENT MOUNT DONE", this.props.activeStepIndex);
//     this.setState({
//       multipleNumberInput: this.props.allStepsData[this.props.activeStepIndex]
//         .addContentNumberInputField,
//     });
//   }

//   /*==================================================================
//                 handlers
//   ==================================================================*/

//   handleChangeMultiNumberElement = (index) => (e) => {
//     let multipleNumberInput = this.state.multipleNumberInput;
//     multipleNumberInput[index].contentNumberInputFieldValue = e.target.validity
//       .valid
//       ? e.target.value
//       : "";
//     this.setState({ multipleNumberInput });

//     this.props.setAddContentNumberInputFieldAction(
//       this.state.multipleNumberInput
//     );
//   };

//   handleOnClickRemoveNumberElement = (index) => (e) => {
//     let multipleNumberInput = this.state.multipleNumberInput;
//     multipleNumberInput.splice(index, 1);
//     this.setState({ multipleNumberInput });

//     this.props.setAddContentNumberInputFieldAction(
//       this.state.multipleNumberInput
//     );
//   };

//   /*==================================================================
//                 main
//   ==================================================================*/
//   render() {
//     const { multipleNumberInput } = this.state;
//     return (
//       <>
//         {!isEmpty(multipleNumberInput) &&
//           multipleNumberInput.map((data, index) => (
//             <Fragment key={index}>
//               <div className="row mx-0 flex-nowrap">
//                 <label
//                   htmlFor={`contentNumberInputField${index}`}
//                   className="font-18-bold-space-light-uppercase"
//                 >
//                   {data.contentNumberInputFieldLabel}
//                 </label>
//                 <button
//                   className="flex-shrink-0 workflow-content-block-delete-element-btn"
//                   onClick={this.handleOnClickRemoveNumberElement(index)}
//                 >
//                   <i className="fa fa-minus"></i>
//                 </button>
//               </div>
//               <div>
//                 <InputFieldNumber
//                   id={`contentNumberInputField${index}`}
//                   containerClassName="container-login-flow-input container-login-flow-input--forms"
//                   name="contentNumberInputFieldValue"
//                   value={data.contentNumberInputFieldValue}
//                   onChange={this.handleChangeMultiNumberElement(index)}
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
//   setAddContentNumberInputFieldAction,
// })(AddInputNumberFieldWorkflowDisplay);
