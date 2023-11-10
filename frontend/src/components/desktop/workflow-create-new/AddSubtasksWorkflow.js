// import React, { Component } from "react";
// import InputFieldEmailTextPassword from "../common/InputFieldEmailTextPassword";

// import isEmpty from "../../../store/validations/is-empty";
// import { connect } from "react-redux";
// import {
//   closeAddContentBlockPayload,
//   setAddContentBlockAction,
//   setAddContentSubtasksAction,
// } from "./../../../store/actions/workflowsLocalAction";

// export class AddSubtasksWorkflow extends Component {
//   constructor() {
//     super();
//     this.state = {
//       multipleSubtasksOptions: [
//         {
//           contentSubtasksOptionName: "",
//         },
//         {
//           contentSubtasksOptionName: "",
//         },
//       ],
//       addContentSubtasks: [],
//     };
//   }

//   /*==================================================================
//             lifecycle methods
//   ==================================================================*/

//   componentDidMount() {
//     this.setState({
//       addContentSubtasks: this.props.allStepsData[this.props.activeStepIndex]
//         .addContentSubtasks,
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
//     let multipleSubtasksOptions = this.state.multipleSubtasksOptions;
//     multipleSubtasksOptions[index].contentSubtasksOptionName = e.target.value;
//     this.setState({ multipleSubtasksOptions });
//   };

//   handleOnClickAddMoreElement = () => {
//     let obj = {
//       contentSubtasksOptionName: "",
//     };
//     let multipleSubtasksOptions = this.state.multipleSubtasksOptions;
//     multipleSubtasksOptions.push(obj);
//     this.setState({ multipleSubtasksOptions });
//   };

//   handleOnClickRemoveElement = (index) => (e) => {
//     let multipleSubtasksOptions = this.state.multipleSubtasksOptions;
//     multipleSubtasksOptions.splice(index, 1);
//     this.setState({ multipleSubtasksOptions });
//   };

//   handleOnClickSaveSubtasks = () => {
//     let localActionObj = this.state.addContentSubtasks;

//     this.state.multipleSubtasksOptions.map((data, index) => {
//       localActionObj.push({
//         value: false,
//         label: data.contentSubtasksOptionName,
//       });
//     });

//     this.props.setAddContentBlockAction(closeAddContentBlockPayload);
//     this.props.setAddContentSubtasksAction(localActionObj);
//   };

//   /*==================================================================
//             main
//   ==================================================================*/
//   render() {
//     const { contentSubtasksLabel } = this.state;
//     return (
//       <>
//         <div className="workflow-add-input-field-block">
//           <h4 className="font-21-semiBold workflow-add-block-title">
//             Add Subtasks
//           </h4>
//           <p className="workflow-add-input-field-note">Mini tasks to be done</p>

//           <div className="workflow-add-questions-content-block">
//             {!isEmpty(this.state.multipleSubtasksOptions) &&
//               this.state.multipleSubtasksOptions.map((data, index) => (
//                 <div key={index} className="row mx-0 flex-nowrap">
//                   <div>
//                     <InputFieldEmailTextPassword
//                       id={`contentSubtasksOptionName${index}`}
//                       containerClassName="container-login-flow-input container-login-flow-input--forms"
//                       name="contentSubtasksOptionName"
//                       value={data.contentSubtasksOptionName}
//                       onChange={this.handleChangeMultiElementOption(index)}
//                       type="text"
//                       placeholder="Enter Step Title"
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
//         <button
//           className="workflow-add-input-field-block-save-btn"
//           onClick={this.handleOnClickSaveSubtasks}
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
//   setAddContentSubtasksAction,
// })(AddSubtasksWorkflow);
