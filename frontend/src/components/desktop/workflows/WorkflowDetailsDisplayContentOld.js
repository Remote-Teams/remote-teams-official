// import React, { Fragment } from "react";
// import Checkbox from "rc-checkbox";
// import "rc-checkbox/assets/index.css";

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

// const mcqsDummyData = [
//   { value: "lorem", label: "lorem" },
//   { value: "ipsum", label: "ipsum" },
// ];
// const dummyData3 = [1, 2];

// export default function WorkflowDetailsDisplayContentOld() {
//   /*=============================================================================
//           renderTitleDesc
//   =============================================================================*/
//   const renderTitleDesc = (title, desc) => {
//     return (
//       <>
//         <h4 className="font-18-bold-space-light-uppercase">{title}</h4>
//         <div className="workflow-details-right-block-output-div mt-26">
//           <p className="font-18-regular">{desc}</p>
//         </div>
//       </>
//     );
//   };

//   /*=============================================================================
//           renderCondition
//   =============================================================================*/
//   const renderCondition = (question, answer, stepName) => {
//     return (
//       <>
//         <div className="condition-exists-inner-div mt-10">
//           <h5 className="font-16-bold">
//             if &ldquo;{question}&rdquo; is &ldquo;{answer}&rdquo; then next step
//             would be &ldquo;{stepName}&rdquo;
//           </h5>
//         </div>
//       </>
//     );
//   };

//   /*=============================================================================
//           renderCheckboxes
//   =============================================================================*/
//   const renderCheckboxes = (label) => {
//     return (
//       <div className="row mx-0 align-items-center mt-35">
//         <div className="customCheckbox">
//           <Checkbox disabled={true} checked={false} />
//           <span className="font-24-bold workflow-details-right-card-title pl-20">
//             {label}
//           </span>
//         </div>
//       </div>
//     );
//   };

//   /*=============================================================================
//           main
//   =============================================================================*/
//   return (
//     <>
//       <div className="workflow-details-right-card">
//         <div className="row mx-0 justify-content-between align-items-center workflow-details-right-card-title-div">
//           <h2 className="font-24-bold workflow-details-right-card-title">
//             step name
//           </h2>
//           {/* <div className="row mx-0">
//             {icons.map((data, key) => (
//               <div key={key}>
//                 <div className="workflow-details-icon-div">
//                   <img src={data.imgPath} alt="workflow details" />
//                 </div>
//               </div>
//             ))}
//           </div> */}
//         </div>

//         <div className="workflow-details-right-block-inner-div">
//           <h4 className="font-18-bold-space-light-uppercase">Description</h4>
//           <p className="workflow-light-italic-18-font pt-24">
//             Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
//             eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
//             ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
//             aliquip ex ea commodo consequat.
//           </p>

//           {/* text field */}
//           <div className="mt-58">
//             {renderTitleDesc("name of candidate", "")}
//           </div>

//           {/* date */}
//           <div className="mt-26">
//             {renderTitleDesc("date of birth of candidate", "")}
//           </div>

//           {/* number */}
//           <div className="mt-26">{renderTitleDesc("number", "")}</div>

//           {/* single question */}
//           <div className="mt-35">
//             {renderTitleDesc("years of experience", "")}
//           </div>

//           {/* mcqs */}
//           <div className="mt-30">
//             <h4 className="font-18-bold-space-light-uppercase">mcq</h4>
//             {mcqsDummyData.map((data, index) => (
//               <Fragment key={index}>{renderCheckboxes(data.label)}</Fragment>
//             ))}
//           </div>

//           {/* condition */}
//           <div className="mt-30">
//             <h4 className="font-18-bold-space-light-uppercase mb-30">
//               condition exists
//             </h4>
//             {renderCondition("question", "this answer", "step name")}
//           </div>

//           {/* subtasks */}
//           <div className="mt-30">
//             <h4 className="font-18-bold-space-light-uppercase">subtasks</h4>
//             {mcqsDummyData.map((data, index) => (
//               <Fragment key={index}>{renderCheckboxes(data.label)}</Fragment>
//             ))}
//           </div>

//           {/* files */}
//           <div className="mt-30">
//             <h4 className="font-18-bold-space-light-uppercase">files</h4>
//             <div className="row mx-0 mt-30">
//               {dummyData3.map((key, data) => (
//                 <div key={key}>
//                   <div className="workflow-details-file-div">
//                     <div className="workflow-details-file-top-section"></div>
//                     <p className="font-18-semiBold workflow-details-file-upload-text">
//                       {" "}
//                       Document Name.doc
//                     </p>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// }
