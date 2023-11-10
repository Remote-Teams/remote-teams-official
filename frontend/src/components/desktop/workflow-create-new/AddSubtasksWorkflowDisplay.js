// import React, { Component } from "react";
// import Checkbox from "rc-checkbox";
// import "rc-checkbox/assets/index.css";

// import isEmpty from "../../../store/validations/is-empty";
// import { connect } from "react-redux";
// import { setAddContentSubtasksAction } from "./../../../store/actions/workflowsLocalAction";

// export class AddSubtasksWorkflowDisplay extends Component {
//   constructor() {
//     super();
//     this.state = {
//       addContentSubtasks: [],
//     };
//   }

//   /*==================================================================
//             lifecycle methods
//   ==================================================================*/

//   componentDidMount() {
//     this.setState({
//       addContentSubtasks: this.props.allStepsData[this.props.activeStepIndex]
//         .addContentSubtasks,
//     });
//   }

//   /*==================================================================
//                 handlers
//   ==================================================================*/

//   handleOnClickRemoveElement = (e) => {
//     let addContentSubtasks = this.state.addContentSubtasks;
//     addContentSubtasks.splice(0, this.state.addContentSubtasks.length);

//     this.setState({ addContentSubtasks });

//     this.props.setAddContentSubtasksAction(this.state.addContentSubtasks);
//   };

//   handleOnClickRemoveSingleElement = (index) => (e) => {
//     let addContentSubtasks = this.state.addContentSubtasks;
//     addContentSubtasks.splice(index, 1);

//     this.setState({ addContentSubtasks });

//     this.props.setAddContentSubtasksAction(this.state.addContentSubtasks);
//   };

//   handleOnChangeSubtasks = (index) => (e) => {
//     let addContentSubtasks = this.state.addContentSubtasks;
//     addContentSubtasks[index].value = e.target.checked;

//     this.setState({ addContentSubtasks });

//     this.props.setAddContentSubtasksAction(this.state.addContentSubtasks);
//   };

//   /*==================================================================
//                 main
//   ==================================================================*/
//   render() {
//     const { addContentSubtasks } = this.state;
//     return (
//       <>
//         {!isEmpty(addContentSubtasks) && (
//           <div className="row mx-0 flex-nowrap">
//             <h3 className="font-18-bold-space-light-uppercase">Subtasks</h3>
//             <button
//               className="flex-shrink-0 workflow-content-block-delete-element-btn"
//               onClick={this.handleOnClickRemoveElement}
//             >
//               <i className="fa fa-minus"></i>
//             </button>
//           </div>
//         )}

//         {!isEmpty(addContentSubtasks) &&
//           addContentSubtasks.map((data, index) => (
//             <div key={index} className="mb-30">
//               <div className="row mx-0 flex-nowrap customCheckbox mt-26">
//                 <Checkbox
//                   disabled={true}
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
//                 <button
//                   className="workflow-fa-times-delete-button ml-30"
//                   onClick={this.handleOnClickRemoveSingleElement(index)}
//                 >
//                   <i className="fa fa-times"></i>
//                 </button>
//               </div>
//             </div>
//           ))}
//       </>
//     );
//   }
// }

// const mapStateToProps = (state) => ({
//   addContent: state.workflowsLocal.addContent,
//   allStepsData: state.workflowsLocal.allStepsData,
// });

// export default connect(mapStateToProps, {
//   setAddContentSubtasksAction,
// })(AddSubtasksWorkflowDisplay);
