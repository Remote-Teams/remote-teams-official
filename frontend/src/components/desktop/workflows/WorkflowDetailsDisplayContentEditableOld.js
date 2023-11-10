// import React, { Component, Fragment } from "react";
// import Select from "react-select";
// import Checkbox from "rc-checkbox";
// import "rc-checkbox/assets/index.css";
// import DatePicker from "react-datepicker";
// import "react-datepicker/dist/react-datepicker.css";
// import InputFieldEmailTextPassword from "../common/InputFieldEmailTextPassword";
// import InputFieldNumber from "../common/InputFieldNumber";

// import isEmpty from "../../../store/validations/is-empty";

// // import icon1 from "../../../assets/img/workflow/green-border-icon1.svg";
// // import icon2 from "../../../assets/img/workflow/green-border-icon2.svg";
// // import icon3 from "../../../assets/img/workflow/green-border-icon3.svg";
// // import icon4 from "../../../assets/img/workflow/green-border-icon4.svg";
// // import icon5 from "../../../assets/img/workflow/green-border-icon5.svg";

// // const icons = [
// //   { imgPath: icon1 },
// //   { imgPath: icon2 },
// //   { imgPath: icon3 },
// //   { imgPath: icon4 },
// //   { imgPath: icon5 },
// // ];

// class WorkflowDetailsDisplayContentEditableOld extends Component {
//   constructor() {
//     super();

//     this.state = {
//       // text
//       multipleTextInput: [
//         {
//           contentTextInputFieldLabel: "name of candidate",
//           contentTextInputFieldValue: "",
//         },
//       ],
//       // date
//       multipleDateInput: [
//         {
//           contentDateInputFieldLabel: "date of birth of candidate",
//           contentDateInputFieldValue: "",
//         },
//       ],
//       // number
//       multipleNumberInput: [
//         {
//           contentNumberInputFieldLabel: "Number",
//           contentNumberInputFieldValue: "",
//         },
//       ],
//       // sqs
//       addContentSingleQuestion: [
//         {
//           contentSingleQuestionLabel: "years of experience",
//           contentSingleQuestionOptions: [
//             { value: "3 Years", label: "3 Years" },
//             { value: "5 Years", label: "5 Years" },
//           ],
//           contentSingleQuestionOptionSelected: {
//             value: "3 Years",
//             label: "3 Years",
//           },
//         },
//       ],
//       // mcqs
//       addContentMultipleQuestion: [
//         {
//           contentMultipleQuestionLabel: "mcq",
//           contentMultipleQuestionOptions: [
//             { value: false, label: "lorem" },
//             { value: false, label: "ipsum" },
//           ],
//         },
//       ],
//       // conditions
//       multipleConditions: [
//         { stepName: "Lorem1", question: "Lorem1", answer: "Lorem1" },
//       ],
//       // subtasks
//       addContentSubtasks: [
//         { value: false, label: "lorem" },
//         { value: false, label: "ipsum" },
//       ],
//       // files
//       addContentAttachments: [
//         {
//           contentAttachmentsFileName: "document 1",
//         },
//         {
//           contentAttachmentsFileName: "document 2",
//         },
//       ],
//     };
//   }

//   /*==================================================================
//                 text
//   ==================================================================*/
//   // handlers
//   handleChangeMultiTextElement = (index) => (e) => {
//     let multipleTextInput = this.state.multipleTextInput;
//     multipleTextInput[index].contentTextInputFieldValue = e.target.value;
//     this.setState({ multipleTextInput });
//   };

//   // renderTextField
//   renderTextField = () => {
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
//                 />
//               </div>
//             </Fragment>
//           ))}
//       </>
//     );
//   };

//   /*==================================================================
//                 date
//   ==================================================================*/
//   // handlers
//   handleChangeMultiDateElement = (index) => (date) => {
//     let multipleDateInput = this.state.multipleDateInput;

//     if (date === null) {
//       multipleDateInput[index].contentDateInputFieldValue = new Date();
//     } else {
//       multipleDateInput[index].contentDateInputFieldValue = date;
//     }

//     this.setState({ multipleDateInput });
//   };

//   // renderDateField
//   renderDateField = () => {
//     const { multipleDateInput } = this.state;
//     return (
//       <>
//         {!isEmpty(multipleDateInput) &&
//           multipleDateInput.map((data, index) => (
//             <div key={index} className="pb-10">
//               <div className="row mx-0 flex-nowrap">
//                 <label
//                   htmlFor={`contentDateInputField${index}`}
//                   className="font-18-bold-space-light-uppercase"
//                 >
//                   {data.contentDateInputFieldLabel}
//                 </label>
//               </div>
//               <div className="date-picker-common datepicker-nav-arrow-login-dash mt-26">
//                 <DatePicker
//                   id={`contentDateInputField${index}`}
//                   autoComplete="off"
//                   minDate={new Date()}
//                   selected={data.contentDateInputFieldValue}
//                   onChange={this.handleChangeMultiDateElement(index)}
//                 />
//               </div>
//             </div>
//           ))}
//       </>
//     );
//   };

//   /*==================================================================
//                 number
//   ==================================================================*/
//   // handlers
//   handleChangeMultiNumberElement = (index) => (e) => {
//     let multipleNumberInput = this.state.multipleNumberInput;
//     multipleNumberInput[index].contentNumberInputFieldValue = e.target.validity
//       .valid
//       ? e.target.value
//       : "";
//     this.setState({ multipleNumberInput });
//   };

//   // renderNumberField
//   renderNumberField = () => {
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
//               </div>
//               <div>
//                 <InputFieldNumber
//                   id={`contentNumberInputField${index}`}
//                   containerClassName="container-login-flow-input container-login-flow-input--forms"
//                   name="contentNumberInputFieldValue"
//                   value={data.contentNumberInputFieldValue}
//                   onChange={this.handleChangeMultiNumberElement(index)}
//                   placeholder=""
//                 />
//               </div>
//             </Fragment>
//           ))}
//       </>
//     );
//   };

//   /*==================================================================
//                 single questions
//   ==================================================================*/
//   // handlers
//   handleOnChangeSingleQuestion = (index) => (e) => {
//     let addContentSingleQuestion = this.state.addContentSingleQuestion;
//     addContentSingleQuestion[index].contentSingleQuestionOptionSelected = e;

//     this.setState({ addContentSingleQuestion });
//   };

//   //  renderSQs
//   renderSQs = () => {
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
//               </div>
//               <Select
//                 className="react-select-container react-select-container--workflow-details mt-26"
//                 classNamePrefix="react-select-elements"
//                 value={data.contentSingleQuestionOptionSelected}
//                 onChange={this.handleOnChangeSingleQuestion(index)}
//                 options={data.contentSingleQuestionOptions}
//                 placeholder="Select"
//                 isSearchable={false}
//               />
//             </div>
//           ))}
//       </>
//     );
//   };

//   /*==================================================================
//                 multiple questions
//   ==================================================================*/
//   // handlers
//   handleOnChangeMultipleQuestion = (index, optionIndex) => (e) => {
//     let addContentMultipleQuestion = this.state.addContentMultipleQuestion;
//     addContentMultipleQuestion[index].contentMultipleQuestionOptions[
//       optionIndex
//     ].value = e.target.checked;

//     this.setState({ addContentMultipleQuestion });
//   };

//   //  renderMCQs
//   renderMCQs = () => {
//     const { addContentMultipleQuestion } = this.state;
//     return (
//       <>
//         {!isEmpty(addContentMultipleQuestion) &&
//           addContentMultipleQuestion.map((data, index) => (
//             <div key={index} className="mb-30">
//               <div className="row mx-0 flex-nowrap">
//                 <h3 className="font-18-bold-space-light-uppercase">
//                   {data.contentMultipleQuestionLabel}
//                 </h3>
//               </div>

//               {!isEmpty(data.contentMultipleQuestionOptions) &&
//                 data.contentMultipleQuestionOptions.map(
//                   (optionData, optionIndex) => (
//                     <div
//                       key={optionIndex}
//                       className="row mx-0 flex-nowrap customCheckbox mt-26"
//                     >
//                       <Checkbox
//                         id={`${data.contentMultipleQuestionLabel}Checkbox${optionIndex}`}
//                         onChange={this.handleOnChangeMultipleQuestion(
//                           index,
//                           optionIndex
//                         )}
//                         value={optionData.value}
//                         checked={optionData.value}
//                         defaultChecked={optionData.value}
//                       />
//                       <label
//                         htmlFor={`${data.contentMultipleQuestionLabel}Checkbox${optionIndex}`}
//                         className="font-24-bold workflow-details-right-card-title pl-20"
//                       >
//                         {optionData.label}
//                       </label>
//                     </div>
//                   )
//                 )}
//             </div>
//           ))}
//       </>
//     );
//   };

//   /*==================================================================
//                 condition
//   ==================================================================*/
//   //  renderConditions
//   renderConditions = () => {
//     const { multipleConditions } = this.state;
//     return (
//       <>
//         {!isEmpty(multipleConditions) && (
//           <div className="pb-10">
//             {multipleConditions.map((data, index) => (
//               <Fragment key={index}>
//                 <div className="row mx-0 flex-nowrap align-items-center justify-content-between condition-exists-inner-div mb-30">
//                   <h5 className="font-16-bold mr-30">
//                     if &ldquo;{data.question}&rdquo; is &ldquo;{data.answer}
//                     &rdquo; then next step would be &ldquo;{data.stepName}
//                     &rdquo;
//                   </h5>
//                 </div>
//               </Fragment>
//             ))}
//           </div>
//         )}
//       </>
//     );
//   };

//   /*==================================================================
//                 subtasks
//   ==================================================================*/
//   // handlers
//   handleOnChangeSubtasks = (index) => (e) => {
//     let addContentSubtasks = this.state.addContentSubtasks;
//     addContentSubtasks[index].value = e.target.checked;

//     this.setState({ addContentSubtasks });
//   };

//   //  renderSubtasks
//   renderSubtasks = () => {
//     const { addContentSubtasks } = this.state;
//     return (
//       <>
//         {!isEmpty(addContentSubtasks) && (
//           <div className="row mx-0 flex-nowrap">
//             <h3 className="font-18-bold-space-light-uppercase">Subtasks</h3>
//           </div>
//         )}

//         {!isEmpty(addContentSubtasks) &&
//           addContentSubtasks.map((data, index) => (
//             <div key={index} className="mb-30">
//               <div className="row mx-0 flex-nowrap customCheckbox mt-26">
//                 <Checkbox
//                   id={`${data.label}Checkbox${index}`}
//                   onChange={this.handleOnChangeSubtasks(index)}
//                   value={data.value}
//                   checked={data.value}
//                   defaultChecked={data.value}
//                 />
//                 <label
//                   htmlFor={`${data.label}Checkbox${index}`}
//                   className="font-24-bold workflow-details-right-card-title mb-0 pl-20"
//                 >
//                   {data.label}
//                 </label>
//               </div>
//             </div>
//           ))}
//       </>
//     );
//   };

//   /*==================================================================
//                 files
//   ==================================================================*/
//   //  renderFiles
//   renderFiles = () => {
//     const { addContentAttachments } = this.state;
//     return (
//       <>
//         {!isEmpty(addContentAttachments) && (
//           <div className="row mx-0 flex-nowrap">
//             <h3 className="font-18-bold-space-light-uppercase">Files</h3>
//           </div>
//         )}

//         {!isEmpty(addContentAttachments) && (
//           <div className="row mx-0 mt-30 mb-30">
//             {addContentAttachments.map((data, index) => (
//               <div key={index}>
//                 <div className="workflow-details-file-div">
//                   <div className="workflow-details-file-top-section"></div>
//                   <div className="row mx-0 flex-nowrap align-items-start">
//                     <h5 className="font-18-semiBold workflow-details-file-upload-text">
//                       {data.contentAttachmentsFileName}
//                     </h5>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}
//       </>
//     );
//   };

//   /*==================================================================
//                 main
//   ==================================================================*/
//   render() {
//     return (
//       <div className="workflow-details-right-card">
//         <div className="row mx-0 justify-content-between align-items-center workflow-details-right-card-title-div">
//           <h2 className="font-24-bold workflow-details-right-card-title">
//             step name
//           </h2>
//           {/* <div className="row mx-0">
//           {icons.map((data, key) => (
//             <div key={key}>
//               <div className="workflow-details-icon-div">
//                 <img src={data.imgPath} alt="workflow details" />
//               </div>
//             </div>
//           ))}
//         </div> */}
//         </div>
//         <div className="workflow-details-right-block-inner-div">
//           <h5 className="font-18-bold-space-light-uppercase">Description</h5>
//           <h5 className="workflow-light-italic-18-font pt-24">
//             Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
//             eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
//             ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
//             aliquip ex ea commodo consequat.
//           </h5>

//           {/* text */}
//           <div className="mt-58">{this.renderTextField()}</div>

//           {/* date */}
//           {this.renderDateField()}

//           {/* number */}
//           {this.renderNumberField()}

//           {/* single questions */}
//           {this.renderSQs()}

//           {/* mcqs */}
//           {this.renderMCQs()}

//           {/* condition exists */}
//           <div>
//             <h5 className="font-18-bold-space-light-uppercase">
//               condition exists
//             </h5>
//             <div className="mt-30">{this.renderConditions()}</div>
//           </div>

//           {/* subtasks */}
//           {this.renderSubtasks()}

//           {/* files */}
//           {this.renderFiles()}
//         </div>
//       </div>
//     );
//   }
// }

// export default WorkflowDetailsDisplayContentEditableOld;
