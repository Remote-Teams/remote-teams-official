// import React, { Component, Fragment } from "react";
// // api
// import isEmpty from "../../../store/validations/is-empty";
// import { connect } from "react-redux";
// import {
//   closeAddContentBlockPayload,
//   stepsContentIconButtonOptions,
//   setAddContentBlockAction,
//   resetAllAddContentDataAction,
//   setAllStepsDataAction,
// } from "./../../../store/actions/workflowsLocalAction";
// // reusable components
// import GreenButtonSmallFont from "../common/GreenButtonSmallFont";
// import GreenLinkSmallFont from "../common/GreenLinkSmallFont";
// import GrayLinkSmallFont from "../common/GrayLinkSmallFont";
// import PageTitle from "../common/PageTitle";
// import InputFieldEmailTextPassword from "../common/InputFieldEmailTextPassword";
// import TextareaField from "../common/TextareaField";
// // icon images
// import greenIcon1 from "../../../assets/img/workflow/green-border-icon1.svg";
// import greenIcon2 from "../../../assets/img/workflow/green-border-icon2.svg";
// import greenIcon3 from "../../../assets/img/workflow/green-border-icon3.svg";
// import greenIcon4 from "../../../assets/img/workflow/green-border-icon4.svg";
// import greenIcon5 from "../../../assets/img/workflow/green-border-icon5.svg";
// // icon images
// import greyIcon1 from "../../../assets/img/workflow/grey-border-icon1.svg";
// import greyIcon2 from "../../../assets/img/workflow/grey-border-icon2.svg";
// import greyIcon3 from "../../../assets/img/workflow/grey-border-icon3.svg";
// import greyIcon4 from "../../../assets/img/workflow/grey-border-icon4.svg";
// import greyIcon5 from "../../../assets/img/workflow/grey-border-icon5.svg";
// // components
// import SelectQuestionWorkflow from "../workflow-create-new/SelectQuestionWorkflow";
// import StepsTitleAndDateBlock from "../workflow-create-new/StepsTitleAndDateBlock";
// import AddConditionsWorkflow from "../workflow-create-new/AddConditionsWorkflow";
// import AddSubtasksWorkflow from "../workflow-create-new/AddSubtasksWorkflow";
// import AddAttachmentsWorkflow from "../workflow-create-new/AddAttachmentsWorkflow";
// import SelectInputFieldWorkflow from "../workflow-create-new/SelectInputFieldWorkflow";
// import AddInputTextFieldWorkflowDisplay from "../workflow-create-new/AddInputTextFieldWorkflowDisplay";
// import AddSingleQuestionWorkflowDisplay from "../workflow-create-new/AddSingleQuestionWorkflowDisplay";
// import AddMultipleQuestionWorkflowDisplay from "../workflow-create-new/AddMultipleQuestionWorkflowDisplay";
// import AddSubtasksWorkflowDisplay from "../workflow-create-new/AddSubtasksWorkflowDisplay";
// import AddInputNumberFieldWorkflowDisplay from "../workflow-create-new/AddInputNumberFieldWorkflowDisplay";
// import AddInputDateFieldWorkflowDisplay from "../workflow-create-new/AddInputDateFieldWorkflowDisplay";
// import AddAttachmentsWorkflowDisplay from "../workflow-create-new/AddAttachmentsWorkflowDisplay";
// import AddConditionsWorkflowDisplay from "../workflow-create-new/AddConditionsWorkflowDisplay";

// const greenIcons = [greenIcon1, greenIcon2, greenIcon3, greenIcon4, greenIcon5];
// const greyIcons = [greyIcon1, greyIcon2, greyIcon3, greyIcon4, greyIcon5];

// // setpDueInDropdownOptions same as in CreateNewWorkflow.js
// const setpDueInDropdownOptions = [
//   { value: "HRS", label: "HRS" },
//   { value: "MINS", label: "MINS" },
// ];

// // same object as in CreateNewWorkflow.js
// const initialAllStepsStates = {
//   isSaved: false,
//   stepName: "step name",
//   dueInCount: 2,
//   selectedOption: setpDueInDropdownOptions[0],
//   description: "",
//   addContentTextInputField: [],
//   addContentNumberInputField: [],
//   addContentDateInputField: [],
//   addContentSingleQuestion: [],
//   addContentMultipleQuestion: [],
//   addContentSubtasks: [],
//   addContentAttachments: [],
//   addContentConditions: [],
// };

// export class EditWorkflow extends Component {
//   constructor() {
//     super();
//     this.state = {
//       multiStepData: [],
//       // workflow
//       workflowName: "",
//       // steps title and date block
//       activeStepIndex: 0,
//     };
//   }

//   /*==================================================================
//             lifecycle methods
//   ==================================================================*/

//   componentDidMount() {
//     let setData = {
//       isDisplayAddContentBlock: false,
//       displayAddContentIconButtonClicked: "",
//     };
//     this.props.setAddContentBlockAction(setData);

//     console.log(typeof this.props.allStepsData, this.props.allStepsData.length);

//     let newData = this.state.multiStepData;
//     let len = this.props.allStepsData.length;
//     let i = 0;
//     while (i < len) {
//       newData.push(this.props.allStepsData[i]);
//       i++;
//     }

//     this.setState({
//       multiStepData: newData,
//     });
//   }

//   /*==================================================================
//             handler add content block
//   ==================================================================*/
//   handleOnClickOpenAddContent = (val) => (e) => {
//     this.props.setAddContentBlockAction({
//       isDisplayAddContentBlock: true,
//       displayAddContentIconButtonClicked: val,
//     });
//   };

//   onCloseAddContentBlock = () => {
//     this.props.setAddContentBlockAction(closeAddContentBlockPayload);
//   };

//   /*==================================================================
//             handlers
//   ==================================================================*/

//   handleChange = (e) => {
//     this.setState({
//       [e.target.name]: e.target.value,
//     });
//   };

//   handleChangeStepName = (e) => {
//     let multiStepData = this.state.multiStepData;
//     multiStepData[this.state.activeStepIndex].stepName = e.target.value;
//     this.setState({
//       multiStepData,
//     });
//   };

//   handleChangeDescription = (e) => {
//     let multiStepData = this.state.multiStepData;
//     multiStepData[this.state.activeStepIndex].description = e.target.value;
//     this.setState({
//       multiStepData,
//     });
//   };

//   handleChangeNumber = (e) => {
//     let multiStepData = this.state.multiStepData;
//     multiStepData[this.state.activeStepIndex].dueInCount = e.target.validity
//       .valid
//       ? e.target.value
//       : "";
//     this.setState({
//       multiStepData,
//     });
//   };

//   handleChangeDropdown = (selectedOption) => {
//     let multiStepData = this.state.multiStepData;
//     multiStepData[this.state.activeStepIndex].selectedOption = selectedOption;
//     this.setState({
//       multiStepData,
//     });
//   };

//   handleOnclickGreenSaveWorkflowButton = () => {
//     console.log("clicked on save button");
//   };

//   /*==================================================================
//             renderStepTitleAndDateBlock
//   ==================================================================*/

//   // handlers
//   handleOnClickAddNewStep = () => {
//     let multiStepData = this.state.multiStepData;
//     multiStepData.push(initialAllStepsStates);
//     this.setState({ multiStepData, activeStepIndex: multiStepData.length - 1 });

//     this.props.setAllStepsDataAction(multiStepData);
//   };

//   handleOnClickSaveStep = (index) => (e) => {
//     let multiStepData = this.state.multiStepData;

//     this.setState({
//       multiStepData,
//       activeStepIndex: "",
//     });
//     console.log(
//       `Saved step ${index + 1} data:`,
//       this.state.multiStepData[index],
//       `\n \n Total saved steps: `,
//       this.state.multiStepData.length
//     );

//     this.onCloseAddContentBlock();
//   };

//   handleOnClickEditStep = (index) => (e) => {
//     this.setState({
//       activeStepIndex: index,
//     });
//   };

//   handleOnClickDeleteStep = (index) => (e) => {
//     let multiStepData = this.state.multiStepData;
//     let newActiveIndex = this.state.activeStepIndex;

//     multiStepData.splice(index, 1);

//     if (index < newActiveIndex) {
//       newActiveIndex = newActiveIndex - 1;
//       this.setState({ multiStepData, activeStepIndex: newActiveIndex });
//     } else {
//       this.setState({ multiStepData });
//     }

//     console.log(`\n Total steps: `, this.state.multiStepData.length);
//   };

//   // renderStepTitleAndDateBlock
//   renderStepTitleAndDateBlock = () => {
//     const { multiStepData, activeStepIndex } = this.state;
//     return (
//       <div>
//         {multiStepData.map((data, index) => (
//           <Fragment key={index}>
//             {activeStepIndex === index ? (
//               <StepsTitleAndDateBlock
//                 stepName={data.stepName}
//                 handleChange={this.handleChangeStepName}
//                 dueInCount={data.dueInCount}
//                 handleChangeNumber={this.handleChangeNumber}
//                 options={setpDueInDropdownOptions}
//                 selectedOption={data.selectedOption}
//                 handleChangeDropdown={this.handleChangeDropdown}
//                 handleOnClickSaveStep={this.handleOnClickSaveStep(index)}
//               />
//             ) : (
//               <div
//                 key={index}
//                 className="row mb-30 align-items-center workflow-step-saved-name-row-edit-delete"
//               >
//                 <div className="workflow-card-details-green-circle">
//                   <h3 className="font-18-bold font-18-bold-workflow">
//                     {index + 1}
//                   </h3>
//                 </div>
//                 <div className="workflow-card-details-gray-block">
//                   <h3 className="font-18-bold workflow-step-saved-name-row-edit-delete__stepName">
//                     {data.stepName}
//                   </h3>
//                   {activeStepIndex === "" ? (
//                     <>
//                       {/* active buttons */}
//                       <button
//                         className="workflow-fa-times-delete-button ml-30"
//                         onClick={this.handleOnClickEditStep(index)}
//                       >
//                         <i className="fa fa-pencil"></i>
//                       </button>
//                       <button
//                         className="workflow-fa-times-delete-button ml-30"
//                         onClick={this.handleOnClickDeleteStep(index)}
//                       >
//                         <i className="fa fa-trash"></i>
//                       </button>
//                     </>
//                   ) : (
//                     <>
//                       {/* disabled buttons */}
//                       <button
//                         className="workflow-fa-times-delete-button workflow-fa-times-delete-button--disabled ml-30"
//                         disabled
//                       >
//                         <i className="fa fa-pencil"></i>
//                       </button>
//                       <button
//                         className="workflow-fa-times-delete-button workflow-fa-times-delete-button--disabled ml-30"
//                         disabled
//                       >
//                         <i className="fa fa-trash"></i>
//                       </button>
//                     </>
//                   )}
//                 </div>
//               </div>
//             )}
//           </Fragment>
//         ))}

//         {activeStepIndex === "" ? (
//           <div className="workflow-add-new-step-button-div">
//             <GreenButtonSmallFont
//               text="Add New Step"
//               onClick={this.handleOnClickAddNewStep}
//             />
//           </div>
//         ) : (
//           <div className="workflow-add-new-step-button-div">
//             <GreenButtonSmallFont
//               text="Add New Step"
//               disabled={"disabled"}
//               onClick={this.handleOnClickAddNewStep}
//             />
//           </div>
//         )}
//       </div>
//     );
//   };

//   /*==================================================================
//           renderStepsDetailsTitleAndIconsBlock
//   ==================================================================*/
//   renderStepsDetailsTitleAndIconsBlock = () => {
//     const { displayAddContentIconButtonClicked } = this.props.addContent;
//     const { multiStepData, activeStepIndex } = this.state;

//     return (
//       <div className="row mx-0 flex-nowrap create-new-workflow-div__workflow-step-details-block__row-1">
//         <h3 className="create-new-workflow-div__workflow-step-details-block__title">
//           {multiStepData[activeStepIndex].stepName}
//         </h3>
//         <div className="flex-shrink-0">
//           {stepsContentIconButtonOptions.map((data, index) => (
//             <button
//               key={index}
//               onClick={this.handleOnClickOpenAddContent(
//                 stepsContentIconButtonOptions[index]
//               )}
//             >
//               {displayAddContentIconButtonClicked ===
//               stepsContentIconButtonOptions[index] ? (
//                 <img
//                   src={greenIcons[index]}
//                   alt={`${stepsContentIconButtonOptions[index]}`}
//                 />
//               ) : (
//                 <img
//                   src={greyIcons[index]}
//                   alt={`${stepsContentIconButtonOptions[index]}`}
//                 />
//               )}
//             </button>
//           ))}
//         </div>
//       </div>
//     );
//   };

//   /*==================================================================
//             main
//   ==================================================================*/
//   render() {
//     const {
//       isDisplayAddContentBlock,
//       displayAddContentIconButtonClicked,
//     } = this.props.addContent;

//     const { multiStepData, activeStepIndex } = this.state;
//     let saveAndGoToWorkflowsText = <span>Save &amp; Go to Workflows</span>;

//     return (
//       <>
//         <div className="main-page-padding">
//           <div className="row mx-0 justify-content-between align-items-center">
//             <div className="mb-30">
//               <PageTitle title="Workflow Name" />
//             </div>

//             <div className="row mx-0">
//               <div className="mr-30">
//                 <GreenLinkSmallFont
//                   extraClassName="saveAndGoToWorkflowsButton"
//                   path="/workflows"
//                   text={saveAndGoToWorkflowsText}
//                 />
//               </div>
//               <GrayLinkSmallFont path="/workflows" text="Discard" />
//             </div>
//           </div>
//         </div>

//         {/* form structure  */}
//         <div className="create-new-workflow-div">
//           {/* steps */}
//           <div className="create-new-workflow-div__workflow-step-text-row">
//             <h2 className="font-29-bold">Steps</h2>
//           </div>

//           <div className="row mx-0 flex-nowrap">
//             {/* steps title and date block */}
//             {this.renderStepTitleAndDateBlock()}

//             {/* steps details */}
//             {!isEmpty(multiStepData) && activeStepIndex !== "" && (
//               <div className="create-new-workflow-div__workflow-step-details-block pb-0">
//                 {/* steps details title block */}
//                 {this.renderStepsDetailsTitleAndIconsBlock()}

//                 {/* steps details content */}
//                 <div className="create-new-workflow-div__workflow-step-details-block-content">
//                   {/* description */}
//                   <TextareaField
//                     containerClassName="container-login-flow-textarea"
//                     label="description"
//                     name="description"
//                     placeholder="Description"
//                     value={multiStepData[activeStepIndex].description}
//                     onChange={this.handleChangeDescription}
//                   />

//                   {/* input field */}
//                   <AddInputTextFieldWorkflowDisplay
//                     activeStepIndex={
//                       activeStepIndex === "" ? 0 : activeStepIndex
//                     }
//                   />
//                   <AddInputDateFieldWorkflowDisplay
//                     activeStepIndex={
//                       activeStepIndex === "" ? 0 : activeStepIndex
//                     }
//                   />
//                   <AddInputNumberFieldWorkflowDisplay
//                     activeStepIndex={
//                       activeStepIndex === "" ? 0 : activeStepIndex
//                     }
//                   />

//                   {/* questions */}
//                   <AddSingleQuestionWorkflowDisplay
//                     activeStepIndex={
//                       activeStepIndex === "" ? 0 : activeStepIndex
//                     }
//                   />
//                   <AddMultipleQuestionWorkflowDisplay
//                     activeStepIndex={
//                       activeStepIndex === "" ? 0 : activeStepIndex
//                     }
//                   />

//                   {/* condition */}
//                   <AddConditionsWorkflowDisplay
//                     activeStepIndex={
//                       activeStepIndex === "" ? 0 : activeStepIndex
//                     }
//                   />

//                   {/* subtasks */}
//                   <AddSubtasksWorkflowDisplay
//                     activeStepIndex={
//                       activeStepIndex === "" ? 0 : activeStepIndex
//                     }
//                   />

//                   {/* attatchments */}
//                   <AddAttachmentsWorkflowDisplay
//                     activeStepIndex={
//                       activeStepIndex === "" ? 0 : activeStepIndex
//                     }
//                   />
//                 </div>
//               </div>
//             )}
//             {/* steps buttons add content blocks */}
//             {isDisplayAddContentBlock && (
//               <div className="flex-shrink-0 create-new-workflow-div__workflow-step-add-content-block">
//                 <span
//                   className="closeIconInModal"
//                   onClick={this.onCloseAddContentBlock}
//                 />

//                 {displayAddContentIconButtonClicked ===
//                   stepsContentIconButtonOptions[0] && (
//                   <SelectInputFieldWorkflow activeStepIndex={activeStepIndex} />
//                 )}

//                 {displayAddContentIconButtonClicked ===
//                   stepsContentIconButtonOptions[1] && (
//                   <SelectQuestionWorkflow activeStepIndex={activeStepIndex} />
//                 )}

//                 {displayAddContentIconButtonClicked ===
//                   stepsContentIconButtonOptions[2] && (
//                   <AddConditionsWorkflow activeStepIndex={activeStepIndex} />
//                 )}

//                 {displayAddContentIconButtonClicked ===
//                   stepsContentIconButtonOptions[3] && (
//                   <AddSubtasksWorkflow activeStepIndex={activeStepIndex} />
//                 )}

//                 {displayAddContentIconButtonClicked ===
//                   stepsContentIconButtonOptions[4] && (
//                   <AddAttachmentsWorkflow activeStepIndex={activeStepIndex} />
//                 )}
//               </div>
//             )}
//           </div>
//         </div>
//         {/* form structure end */}
//       </>
//     );
//   }
// }

// const mapStateToProps = (state) => ({
//   addContent: state.workflowsLocal.addContent,
//   allStepsData: state.workflowsLocal.allStepsData,
// });

// export default connect(mapStateToProps, {
//   setAddContentBlockAction,
//   resetAllAddContentDataAction,
//   setAllStepsDataAction,
// })(EditWorkflow);
