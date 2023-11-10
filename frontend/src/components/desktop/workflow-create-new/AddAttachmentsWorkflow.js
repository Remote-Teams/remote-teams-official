// import React, { Component } from "react";

// import isEmpty from "../../../store/validations/is-empty";
// import { connect } from "react-redux";
// import {
//   closeAddContentBlockPayload,
//   setAddContentBlockAction,
//   setAddContentAttachmentsAction,
// } from "./../../../store/actions/workflowsLocalAction";

// export class AddAttachmentsWorkflow extends Component {
//   constructor() {
//     super();
//     this.state = {
//       fileArray: [],
//       addContentAttachments: [],
//     };
//   }

//   /*==================================================================
//             lifecycle methods
//   ==================================================================*/

//   componentDidMount() {
//     this.setState({
//       addContentAttachments: this.props.allStepsData[this.props.activeStepIndex]
//         .addContentAttachments,
//     });
//   }

//   /*==================================================================
//             handlers
//   ==================================================================*/

//   handleOnChangeUploadFile = (e) => {
//     e.preventDefault();

//     if (e.target.files.length > 0) {
//       let fileArray = this.state.fileArray;

//       // let contentAttachmentsFileData = e.target.files[0];

//       fileArray.push({
//         contentAttachmentsFileName: e.target.files[0].name,
//         // contentAttachmentsFileData,
//       });

//       this.setState({ fileArray });
//     }
//   };

//   handleOnClickRemoveAttachment = (index) => (e) => {
//     let fileArray = this.state;

//     fileArray = this.state.fileArray;
//     fileArray.splice(index, 1);

//     this.setState({ fileArray });
//   };

//   handleOnClickSaveAttachments = () => {
//     let localActionObj = this.state.addContentAttachments;

//     this.state.fileArray.map((data, index) => {
//       localActionObj.push({
//         contentAttachmentsFileName: data.contentAttachmentsFileName,
//         // contentAttachmentsFileData: data.contentAttachmentsFileData,
//       });
//     });

//     this.props.setAddContentBlockAction(closeAddContentBlockPayload);
//     this.props.setAddContentAttachmentsAction(localActionObj);
//   };

//   /*==================================================================
//             main
//   ==================================================================*/
//   render() {
//     const { fileArray } = this.state;
//     return (
//       <>
//         <div className="workflow-add-input-field-block">
//           <h4 className="font-21-semiBold workflow-add-block-title">
//             Add Attachments
//           </h4>
//           <p className="workflow-add-input-field-note">
//             Add docs, images, etc. for reference
//           </p>

//           <div className="workflow-add-questions-content-block">
//             <label
//               htmlFor="fileName"
//               className="workflow-attachment-upload-file-block"
//             >
//               <span>Upload File</span>
//               <input
//                 id="fileName"
//                 name="fileName"
//                 type="file"
//                 // accept=""
//                 title=""
//                 onChange={this.handleOnChangeUploadFile}
//               />
//             </label>

//             {!isEmpty(fileArray) && (
//               <h4 className="font-16-bold-space-light-uppercase mb-15">
//                 Selected
//               </h4>
//             )}

//             {!isEmpty(fileArray) &&
//               fileArray.map((data, index) => (
//                 <div
//                   key={index}
//                   className="row mx-0 flex-nowrap align-items-start mb-15"
//                 >
//                   <h5 className="font-18-semiBold workflow-details-file-upload-text mb-0">
//                     {data.contentAttachmentsFileName}
//                   </h5>
//                   <button
//                     className="workflow-fa-times-delete-button ml-30"
//                     onClick={this.handleOnClickRemoveAttachment(index)}
//                   >
//                     <i className="fa fa-times"></i>
//                   </button>
//                 </div>
//               ))}
//           </div>
//         </div>
//         <button
//           className="workflow-add-input-field-block-save-btn"
//           onClick={this.handleOnClickSaveAttachments}
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
//   setAddContentAttachmentsAction,
// })(AddAttachmentsWorkflow);
