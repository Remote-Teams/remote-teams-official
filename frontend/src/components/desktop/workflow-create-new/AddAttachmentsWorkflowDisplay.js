// import React, { Component } from "react";

// import isEmpty from "../../../store/validations/is-empty";
// import { connect } from "react-redux";
// import { setAddContentAttachmentsAction } from "./../../../store/actions/workflowsLocalAction";

// export class AddAttachmentsWorkflowDisplay extends Component {
//   constructor() {
//     super();
//     this.state = {
//       addContentAttachments: [],
//     };
//   }

//   /*==================================================================
//                 lifecycle methods
//   ==================================================================*/

//   componentDidMount() {
//     this.setState({
//       addContentAttachments: this.props.allStepsData[this.props.activeStepIndex]
//         .addContentAttachments,
//     });
//   }

//   /*==================================================================
//                 handlers
//   ==================================================================*/

//   handleOnClickRemoveContentAttachments = (e) => {
//     let addContentAttachments = this.state.addContentAttachments;
//     addContentAttachments.splice(0, this.state.addContentAttachments.length);

//     this.setState({ addContentAttachments });

//     this.props.setAddContentAttachmentsAction(this.state.addContentAttachments);
//   };

//   handleOnClickRemoveSingleElement = (index) => (e) => {
//     let addContentAttachments = this.state.addContentAttachments;
//     addContentAttachments.splice(index, 1);

//     this.setState({ addContentAttachments });

//     this.props.setAddContentAttachmentsAction(this.state.addContentAttachments);
//   };

//   /*==================================================================
//                 main
//   ==================================================================*/
//   render() {
//     const { addContentAttachments } = this.state;

//     return (
//       <>
//         {!isEmpty(addContentAttachments) && (
//           <div className="row mx-0 flex-nowrap">
//             <h3 className="font-18-bold-space-light-uppercase">Files</h3>
//             <button
//               className="flex-shrink-0 workflow-content-block-delete-element-btn"
//               onClick={this.handleOnClickRemoveContentAttachments}
//             >
//               <i className="fa fa-minus"></i>
//             </button>
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
//                     <button
//                       className="workflow-fa-times-delete-button ml-30 flex-shrink-0"
//                       onClick={this.handleOnClickRemoveSingleElement(index)}
//                     >
//                       <i className="fa fa-times"></i>
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}
//       </>
//     );
//   }
// }

// const mapStateToProps = (state) => ({
//   addContent: state.workflowsLocal.addContent,
//   allStepsData: state.workflowsLocal.allStepsData,
// });

// export default connect(mapStateToProps, {
//   setAddContentAttachmentsAction,
// })(AddAttachmentsWorkflowDisplay);
