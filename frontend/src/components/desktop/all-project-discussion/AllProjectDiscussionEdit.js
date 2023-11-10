// import React, { Component } from "react";
// import Modal from "react-responsive-modal";
// import GreenButtonSmallFont from "../common/GreenButtonSmallFont";
// import TextareaField from "../common/TextareaField";
// import InputFieldEmailTextPassword from "../common/InputFieldEmailTextPassword";
// import UploadFile from "../common/UploadFile";

// class AllProjectDiscussionEdit extends Component {
//   constructor() {
//     super();
//     this.state = {
//       open1: false,
//       subject: "",
//       document: "",
//       description: "",
//     };
//   }
//   /*=================================================================
//           handlers
//   =================================================================*/

//   onCloseModal = () => {
//     this.setState({
//       open1: false,
//     });
//   };

//   onOpenModal = () => {
//     this.setState({
//       open1: true,
//     });
//   };

//   handelChange = (e) => {
//     this.setState({
//       [e.target.name]: e.target.value,
//     });
//   };

//   handleOnChangeAttachDoc = (e) => {
//     e.preventDefault();
//     this.setState({
//       document:
//         e.target.files.length > 0 ? e.target.files[0].name : e.target.value,
//     });
//   };

//   handleOnClickSave = () => {
//     console.log(this.state);
//   };
//   /*================================================================================
//           renderNewEntry
// ==============================================================================*/
//   renderNew = () => {
//     const { open1 } = this.state;
//     return (
//       <>
//         <Modal
//           open={open1}
//           onClose={this.onCloseModal}
//           closeOnEsc={true}
//           closeOnOverlayClick={false}
//           center
//           classNames={{
//             overlay: "customOverlay",
//             modal: "customModal customModal--clientEditModal",
//             closeButton: "customCloseButton",
//           }}
//         >
//           <span className="closeIconInModal" onClick={this.onCloseModal} />
//           <div className="edit-client-modal-content">
//             <h2 className="font-32-extraBold-letterspace mt-30 mb-50 text-center">
//               Manage discussion
//             </h2>
//             <InputFieldEmailTextPassword
//               containerClassName="container-login-flow-input container-login-flow-input--forms container-login-flow-input--discussion"
//               label="subject"
//               name="subject"
//               value={this.state.subject}
//               onChange={this.handelChange}
//             />
//             <TextareaField
//               containerClassName="container-login-flow-textarea container-login-flow-textarea--discussion"
//               label="description"
//               name="description"
//               value={this.state.description}
//               onChange={this.handelChange}
//             />
//             <div className="row justify-content-between align-items-center discussion-files-div">
//               <div className="col-6">
//                 <h3 className="font-18-bold-space-light-uppercase mb-20">
//                   attach files <span className="text-lowercase">(if any)</span>
//                 </h3>
//                 <UploadFile
//                   containerClassName="upload-img__mainBlock"
//                   buttonName="+ Add Resource"
//                   fileNameValue={this.state.document}
//                   acceptType="application/pdf, application/msword"
//                   onChange={this.handleOnChangeAttachDoc}
//                 />
//               </div>
//               <div>
//                 <GreenButtonSmallFont
//                   text={"Post"}
//                   onClick={this.handleOnClickSave}
//                 />
//               </div>
//             </div>
//           </div>
//         </Modal>
//       </>
//     );
//   };

//   render() {
//     return (
//       <>
//         {this.renderNew()}
//         <i
//           className="fa fa-pencil finances-table__fa-icon-edit"
//           onClick={this.onOpenModal}
//         ></i>
//       </>
//     );
//   }
// }

// export default AllProjectDiscussionEdit;
