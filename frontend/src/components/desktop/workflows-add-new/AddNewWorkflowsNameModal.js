// import React, { useState } from "react";
// import GreenLinkSmallFont from "../common/GreenLinkSmallFont";
// import Modal from "react-responsive-modal";
// import InputFieldEmailTextPassword from "../common/InputFieldEmailTextPassword";

// export default function AddNewWorkflowsNameModal() {
//   const [values, setValues] = useState({ open: false, workflowName: "" });

//   /*=========================================
//               open modal
//   =========================================*/
//   const openModal = () => {
//     setValues({
//       ...values,
//       open: true,
//     });
//   };

//   const onCloseModal = () => {
//     setValues({
//       ...values,
//       open: false,
//     });
//   };

//   /*=========================================
//               handlers
//   =========================================*/

//   const handleChange = (e) => {
//     setValues({
//       ...values,
//       [e.target.name]: e.target.value,
//     });
//   };

//   /*=========================================
//                 render Modal
//   =========================================*/
//   const renderModal = () => {
//     return (
//       <div>
//         <Modal
//           open={values.open}
//           onClose={onCloseModal}
//           closeOnEsc={true}
//           closeOnOverlayClick={false}
//           center
//           classNames={{
//             overlay: "customOverlay",
//             modal: "customModal customModal--workflow",
//             closeButton: "customCloseButton",
//           }}
//         >
//           <span className="closeIconInModal" onClick={onCloseModal} />
//           <div className="workflow-new-instant-div text-center">
//             <h1 className="workflow-new-instant-tittle text-center">
//               Create New Workflow
//             </h1>
//             <div className="pt-60 pb-30 add-new-workflow-name-input-div">
//               <InputFieldEmailTextPassword
//                 containerClassName="container-login-flow-input container-login-flow-input--workflow-new-instant"
//                 label="Workflow Name"
//                 name="workflowName"
//                 value={values.workflowName}
//                 onChange={handleChange}
//                 type="text"
//               />
//             </div>
//             <GreenLinkSmallFont
//               text="Next"
//               extraClassName="workflow-new-instant-green-button"
//               path={{
//                 pathname: "/workflow-add-new",
//                 state: {
//                   workflowName: values.workflowName,
//                 },
//               }}
//             />
//           </div>
//         </Modal>
//       </div>
//     );
//   };

//   /*=========================================
//               main
//   =========================================*/
//   return (
//     <>
//       {renderModal()}
//       <button className="workflow-library-first-card" onClick={openModal}>
//         {/*<img
//           src={require("../../../assets/img/workflow/plus.svg")}
//           alt="plus"
//           className="workflows-plus-img"
//         />
//         <h5 className="workflow-24-semibold">
//           Create New <br /> Workflow
//         </h5>*/}
//         <h5 className="workflow-library-first-card-add">+</h5>
//       </button>
//     </>
//   );
// }
