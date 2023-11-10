// import React, { Component } from "react";
// import GreenLinkSmallFont from "../common/GreenLinkSmallFont";
// import Modal from "react-responsive-modal";
// import InputFieldEmailTextPassword from "../common/InputFieldEmailTextPassword";

// export class CreateNewWorkflowNameModal extends Component {
//   constructor() {
//     super();
//     this.state = {
//       open: false,
//       workflowName: "",
//     };
//   }

//   /*=========================================
//               open modal
//   =========================================*/
//   openModal = () => {
//     this.setState({
//       open: true,
//     });
//   };

//   onCloseModal = () => {
//     this.setState({
//       open: false,
//     });
//   };

//   /*=========================================
//               handlers
//   =========================================*/

//   handleChange = (e) => {
//     this.setState({
//       [e.target.name]: e.target.value,
//     });
//   };

//   /*=========================================
//                 render Modal
//   =========================================*/
//   renderModal = () => {
//     const { open } = this.state;
//     return (
//       <div>
//         <Modal
//           open={open}
//           onClose={this.onCloseModal}
//           closeOnEsc={true}
//           closeOnOverlayClick={false}
//           center
//           classNames={{
//             overlay: "customOverlay",
//             modal: "customModal customModal--workflow",
//             closeButton: "customCloseButton",
//           }}
//         >
//           <span className="closeIconInModal" onClick={this.onCloseModal} />
//           <div className="workflow-new-instant-div">
//             <h1 className="font-32-extraBold-letterspace mt-30 mb-50 text-center">
//               Create New Workflow
//             </h1>
//             <div className="pt-60 pb-30">
//               <InputFieldEmailTextPassword
//                 containerClassName="container-login-flow-input container-login-flow-input--workflow-new-instant"
//                 label="Workflow Name"
//                 name="workflowName"
//                 value={this.state.workflowName}
//                 onChange={this.handleChange}
//                 type="text"
//               />
//             </div>
//             <GreenLinkSmallFont
//               text="Next"
//               extraClassName="workflow-new-instant-green-button"
//               path={{
//                 pathname: "/create-new-workflow",
//                 state: {
//                   workflowName: this.state.workflowName,
//                 },
//               }}
//             />
//           </div>
//         </Modal>
//       </div>
//     );
//   };

//   render() {
//     return (
//       <div>
//         {this.renderModal()}
//         <button
//           className="workflow-library-first-card"
//           onClick={this.openModal}
//         >
//           <img
//             src={require("../../../assets/img/workflow/plus.svg")}
//             alt="plus"
//             className="workflows-plus-img"
//           />
//           <h5 className="workflow-24-semibold">
//             Create New <br /> Workflow
//           </h5>
//         </button>
//       </div>
//     );
//   }
// }

// export default CreateNewWorkflowNameModal;
