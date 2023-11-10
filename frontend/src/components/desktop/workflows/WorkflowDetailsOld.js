// import React, { useState, Fragment } from "react";
// import LeftNavbar from "../header/LeftNavbar";
// import TopNavbar from "../header/TopNavbar";
// import PageTitle from "../common/PageTitle";
// import GreenButtonSmallFont from "../common/GreenButtonSmallFont";
// import GrayLinkSmallFont from "../common/GrayLinkSmallFont";
// //import check from "../../../assets/img/workflow/check.svg";
// import check from "../../../assets/img/workflow/new-check.svg";
// import WorkflowDetailsDisplayContentEditable from "./WorkflowDetailsDisplayContentEditable";
// import BreadcrumbMenu from "../common/BreadcrumbMenu";
// import { Link } from "react-router-dom";

// export default function WorkflowDetailsOld() {
//   const [values, setValues] = useState({
//     dummyData: [
//       { isChecked: false },
//       { isChecked: false },
//       { isChecked: false },
//       { isChecked: false },
//     ],
//     activeStepIndex: 0,
//   });
//   const totalSteps = values.dummyData.length - 1;

//   /*=============================================================================
//           handlers
//   =============================================================================*/
//   const handleOnClickMarkComplete = () => {
//     let dummyDataObj = values.dummyData;
//     dummyDataObj.map((data, index) => (dummyDataObj[index].isChecked = true));
//     setValues({
//       ...values,
//       dummyData: dummyDataObj,
//     });
//   };

//   /*=============================================================================
//           renderLeftBlock
//   =============================================================================*/
//   // handlers
//   const handleOnClickStepChecked = (index) => (e) => {
//     let dummyData = values.dummyData;
//     dummyData[index].isChecked = true;

//     setValues({
//       ...values,
//       dummyData,
//       activeStepIndex: index + 1,
//     });
//   };

//   // renderLeftBlock
//   const renderLeftBlock = () => {
//     return (
//       <>
//         <div className="workflow-details-column-div">
//           {values.dummyData.map((data, index) => (
//             <Fragment key={index}>
//               {data.isChecked ? (
//                 <>
//                   {/* for checked step will be gray block checked icon */}
//                   <div className="row mx-0 flex-nowrap align-items-center workflow-left-side-gray-div">
//                     <div className="workflow-left-side-gray-block row mx-0 flex-nowrap align-items-center justify-content-between">
//                       <h3 className="font-18-bold">stage {index + 1} </h3>
//                       <span className="workflow-left-side-gray-block-text2">
//                         2/11
//                       </span>
//                     </div>
//                     <div className="workflow-left-side-green-circle-div workflow-left-side-green-circle-div--green">
//                       <img src={check} alt="check" />
//                     </div>
//                   </div>
//                 </>
//               ) : values.activeStepIndex === index ? (
//                 <>
//                   {/* for active index which is not check will be green block and hollow cirlce */}
//                   <div className="row mx-0 flex-nowrap align-items-center workflow-left-side-gray-div ">
//                     <div className="workflow-left-side-green-block row mx-0 flex-nowrap align-items-center justify-content-between">
//                       <h3 className="font-18-bold">stage {index + 1}</h3>
//                       <span className="workflow-left-side-gray-block-text2">
//                         2/11
//                       </span>
//                     </div>
//                     <button
//                       className="workflow-left-side-green-circle-div workflow-left-side-green-circle-div--active"
//                       onClick={handleOnClickStepChecked(index)}
//                     ></button>
//                   </div>
//                 </>
//               ) : (
//                 <>
//                   {/* other unchecked steps will be gray block and hollow circle */}
//                   <div className="row mx-0 align-items-center workflow-left-side-gray-div">
//                     <div className="workflow-left-side-gray-block row mx-0 flex-nowrap align-items-center justify-content-between">
//                       <h3 className="font-18-bold">stage {index + 1} </h3>
//                       <span className="workflow-left-side-gray-block-text2">
//                         2/11
//                       </span>
//                     </div>
//                     <div className="workflow-left-side-green-circle-div"></div>
//                   </div>
//                 </>
//               )}
//             </Fragment>
//           ))}
//           <h5 className="font-18-bold start-of-workflow-text text-uppercase pt-30">
//             End of Workflow
//           </h5>
//         </div>
//       </>
//     );
//   };

//   /*=============================================================================
//           renderArrow
//   =============================================================================*/
//   const handleNext = (e) => {
//     setValues({
//       ...values,
//       activeStepIndex: values.activeStepIndex + 1,
//     });
//   };

//   const renderArrow = () => {
//     return (
//       <div className="workflow-details-arrow-div">
//         {values.activeStepIndex >= 0 && values.activeStepIndex < totalSteps && (
//           <button
//             className="workflow-details-next-arrow-btn workflow-details-next-arrow-btn--edit-details"
//             onClick={handleNext}
//           >
//             <div className="workflow-details-next-back-arrow"></div>
//           </button>
//         )}
//       </div>
//     );
//   };
//   /*=============================================================================
//           main
//   =============================================================================*/
//   return (
//     <>
//       {/* left navbar */}
//       <LeftNavbar />
//       <div className="main-page-padding">
//         {/* pagetitle and topnavbar */}
//         <div className="pageTitle-topNavbar-div">
//           <PageTitle title="workflow name" />
//           <TopNavbar />
//         </div>
//         <div>
//           <BreadcrumbMenu
//             menuObj={[
//               {
//                 title: "Workflows",
//                 link: "/workflows",
//               },
//               {
//                 title: "Workflow Name",
//                 link: "/workflows",
//               },
//               {
//                 title: "Instance Name",
//               },
//             ]}
//           />
//         </div>

//         {/* <h5 className="workflow-light-italic-18-font">Created by User Name</h5> */}
//         {/* <h3 className="font-29-nunito-medium">Instance name</h3>
//          */}
//         <div className="mt-40 mb-50 pl-10 row mx-0 flex-nowrap align-items-center justify-content-between">
//           <div className="mr-20">
//             <h2 className="workflow-details-right-card-title">Instance Name</h2>
//             <h3 className="font-18-semiBold workflow-details-workflow-text-1">
//               Workflow name
//             </h3>
//             <div className="row mx-0 align-items-center">
//               <h3 className="workflow-created-by-text">created by</h3>
//               <span className="workflow-created-by-span-name">AJ</span>
//               <h4 className="workflow-created-by-name">Akhil Jain</h4>
//             </div>
//           </div>
//           <div className="row mx-0 flex-nowrap">
//             <Link to="/workflows">
//               <span className="login-dashboard-btn workflow-ongoing-gray-button mr-25">
//                 <i className="fa fa-pause pause-font pr-10" />
//                 Pause Instance
//               </span>
//             </Link>
//             <GreenButtonSmallFont
//               text="Mark Instance Complete"
//               extraClassName="workflow-ongoing-processes-green-btn"
//               onClick={handleOnClickMarkComplete}
//             />
//           </div>
//         </div>
//         <h3 className="font-18-bold start-of-workflow-text text-uppercase">
//           Start of Workflow
//         </h3>

//         <div className="row mx-0 flex-nowrap pt-30 workflow-details-right-card-outer-div">
//           {renderLeftBlock()}
//           <WorkflowDetailsDisplayContentEditable />
//           {renderArrow()}
//         </div>
//       </div>
//     </>
//   );
// }
