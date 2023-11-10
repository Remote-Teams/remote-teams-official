// import React, { Component } from "react";
// import Select from "react-select";

// const option = [
//   { value: "lorem", label: "Lorem" },
//   { value: "lorem1", label: "Lorem1" },
//   { value: "lorem2", label: "Lorem2" },
// ];
// const statusOption = [
//   { value: "lorem", label: "Lorem" },
//   { value: "lorem1", label: "Lorem1" },
//   { value: "lorem2", label: "Lorem2" },
// ];
// const quetionOption = [
//   { value: "lorem", label: "Lorem" },
//   { value: "lorem1", label: "Lorem1" },
//   { value: "lorem2", label: "Lorem2" },
// ];
// const oneOfOption = [
//   { value: "lorem", label: "Lorem" },
//   { value: "lorem1", label: "Lorem1" },
//   { value: "lorem2", label: "Lorem2" },
// ];
// const stepOption = [
//   { value: "lorem", label: "Lorem" },
//   { value: "lorem1", label: "Lorem1" },
//   { value: "lorem2", label: "Lorem2" },
// ];

// const conditionsOption = ["dependency", "direction"];

// export class AddConditionsWorkflowOLD extends Component {
//   constructor() {
//     super();
//     this.state = {
//       dependencyStep: null,
//       dependencyStatus: null,
//       directionQuetion: null,
//       directionOneOfQuetion: null,
//       directionStep: null,
//     };
//   }
//   /*==================================================================
//             handlers
//   ==================================================================*/
//   handleChange = (dependencyStep) => {
//     this.setState({ dependencyStep });
//     console.log(`Option selected:`, dependencyStep);
//   };
//   handleChangeStatus = (dependencyStatus) => {
//     this.setState({ dependencyStatus });
//     console.log(`Option selected:`, dependencyStatus);
//   };
//   handleChangeQuetion = (directionQuetion) => {
//     this.setState({ directionQuetion });
//     console.log(`Option selected:`, directionQuetion);
//   };
//   handleChangeOneOfQuetion = (directionOneOfQuetion) => {
//     this.setState({ directionOneOfQuetion });
//     console.log(`Option selected:`, directionOneOfQuetion);
//   };
//   handleChangeDirectionStep = (directionStep) => {
//     this.setState({ directionStep });
//     console.log(`Option selected:`, directionStep);
//   };
//   /*==================================================================
//             main
//   ==================================================================*/
//   render() {
//     return (
//       <>
//         {this.props.conditionsChoiceClicked === "" && (
//           <div className="workflow-add-input-field-block">
//             <h4 className="font-21-semiBold workflow-add-block-title">
//               Add Conditions
//             </h4>
//             <div className="workflow-add-questions-content-block mt-35">
//               <button
//                 className="add-question-choice-btn"
//                 onClick={this.props.handleOnClickSelectAddConditionsChoice(
//                   conditionsOption[0]
//                 )}
//               >
//                 For Dependency
//                 <i className="fa fa-plus"></i>
//               </button>
//               <button
//                 className="add-question-choice-btn"
//                 onClick={this.props.handleOnClickSelectAddConditionsChoice(
//                   conditionsOption[1]
//                 )}
//               >
//                 For Flow Direction
//                 <i className="fa fa-plus"></i>
//               </button>
//             </div>
//           </div>
//         )}
//         {this.props.conditionsChoiceClicked === conditionsOption[0] && (
//           <>
//             <div className="workflow-add-input-field-block">
//               <h4 className="font-21-semiBold workflow-add-block-title">
//                 Dependency Condition
//               </h4>
//               <p className="workflow-add-input-field-note">
//                 Task can be mark completed only if these conditions are met
//               </p>
//             </div>
//             {/* dropdowns */}
//             <div className="row mx-0 align-items-center justify-content-center">
//               <h1 className="font-18-bold font-18-bold-if">IF</h1>
//               <div className="dropdown">
//                 <Select
//                   className="react-select-container react-select-container--for-dependency"
//                   classNamePrefix="react-select-elements"
//                   value={this.state.dependencyStep}
//                   onChange={this.handleChange}
//                   options={option}
//                   placeholder="Select Step"
//                   isSearchable={false}
//                 />
//               </div>
//             </div>
//             <div className="row mx-0 justify-content-center mt-30 mb-84">
//               <Select
//                 className="react-select-container react-select-container--for-dependency react-select-container--status"
//                 classNamePrefix="react-select-elements"
//                 value={this.state.dependencyStatus}
//                 onChange={this.handleChangeStatus}
//                 options={statusOption}
//                 placeholder="Status"
//                 isSearchable={false}
//               />
//             </div>
//             <button
//               className="workflow-add-input-field-block-save-btn"
//               onClick={this.props.handleOnClickSaveConditions}
//             >
//               Save
//             </button>
//           </>
//         )}

//         {this.props.conditionsChoiceClicked === conditionsOption[1] && (
//           <>
//             <div className="workflow-add-input-field-block">
//               <h4 className="font-21-semiBold workflow-add-block-title">
//                 Add Conditions
//               </h4>
//               <p className="workflow-add-input-field-note">
//                 Next Step would be decided based on answer selected
//               </p>
//             </div>
//             {/* dropdowns */}
//             <div className="row mx-0 align-items-center justify-content-center">
//               <h1 className="font-18-bold font-18-bold-if pl-10">IF</h1>
//               <Select
//                 className="react-select-container react-select-container--for-dependency react-select-container--direction"
//                 classNamePrefix="react-select-elements"
//                 value={this.state.directionQuetion}
//                 onChange={this.handleChangeQuetion}
//                 options={quetionOption}
//                 placeholder="Question in the step"
//                 isSearchable={false}
//               />
//             </div>
//             <div className="row mx-0 align-items-center justify-content-center mt-40">
//               <h1 className="font-18-bold font-18-bold-if pl-10">IS</h1>
//               <Select
//                 className="react-select-container react-select-container--for-dependency react-select-container--direction"
//                 classNamePrefix="react-select-elements"
//                 value={this.state.directionOneOfQuetion}
//                 onChange={this.handleChangeOneOfQuetion}
//                 options={oneOfOption}
//                 placeholder="One of the options"
//                 isSearchable={false}
//               />
//             </div>
//             <h1 className="font-18-bold font-18-bold-if mt-40 text-center">
//               Then go to step
//             </h1>
//             <div className="row mx-0 justify-content-center mt-20 mb-20">
//               <Select
//                 className="react-select-container react-select-container--for-dependency react-select-container--direction-step"
//                 classNamePrefix="react-select-elements"
//                 value={this.state.directionStep}
//                 onChange={this.handleChangeDirectionStep}
//                 options={stepOption}
//                 placeholder="Select Step"
//                 isSearchable={false}
//               />
//             </div>
//             <button
//               className="workflow-add-input-field-block-save-btn"
//               onClick={this.props.handleOnClickSaveConditions}
//             >
//               Save
//             </button>
//           </>
//         )}
//       </>
//     );
//   }
// }

// export default AddConditionsWorkflowOLD;
