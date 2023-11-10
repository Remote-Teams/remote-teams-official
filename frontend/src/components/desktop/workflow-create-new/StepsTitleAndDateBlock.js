// import React from "react";
// import Select from "react-select";
// import InputFieldNumber from "../common/InputFieldNumber";
// import InputFieldEmailTextPassword from "../common/InputFieldEmailTextPassword";

// export default function StepsTitleAndDateBlock({
//   stepName,
//   handleChange,
//   dueInCount,
//   handleChangeNumber,
//   options,
//   selectedOption,
//   handleChangeDropdown,
//   handleOnClickSaveStep,
// }) {
//   return (
//     <div className="row mx-0 flex-nowrap mb-50">
//       <p className="create-new-workflow-div__workflow-step-note">
//         Please note that due date will be counted from the date of the last
//         step's completion
//       </p>

//       <div className="create-new-workflow-div__workflow-step-title-date-block">
//         <InputFieldEmailTextPassword
//           containerClassName="container-login-flow-input container-login-flow-input--forms"
//           label=""
//           name="stepName"
//           value={stepName}
//           onChange={handleChange}
//           type="text"
//         />

//         <div className="row mx-0 flex-nowrap create-new-workflow-div__workflow-step-title-date-block__due-in-row">
//           <span className="font-18-bold">COMPLETE IN</span>
//           <InputFieldNumber
//             containerClassName="container-login-flow-input container-login-flow-input--forms"
//             label=""
//             name="dueInCount"
//             value={dueInCount}
//             onChange={handleChangeNumber}
//             type="text"
//           />

//           <Select
//             isSearchable={false}
//             className="react-select-container"
//             classNamePrefix="react-select-elements"
//             value={selectedOption}
//             onChange={handleChangeDropdown}
//             options={options}
//             placeholder="Select"
//           />
//         </div>

//         {/* add new step */}
//         <button
//           className="create-new-workflow-div__save-step-btn"
//           onClick={handleOnClickSaveStep}
//         >
//           <i className="fa fa-save"></i>
//         </button>
//       </div>
//     </div>
//   );
// }
