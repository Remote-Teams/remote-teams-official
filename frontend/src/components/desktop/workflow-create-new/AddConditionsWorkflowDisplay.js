// import React, { Component, Fragment } from "react";

// import isEmpty from "../../../store/validations/is-empty";
// import { connect } from "react-redux";
// import { setAddContentConditionsAction } from "./../../../store/actions/workflowsLocalAction";

// export class AddConditionsWorkflowDisplay extends Component {
//   constructor() {
//     super();
//     this.state = { multipleConditions: [] };
//   }

//   /*==================================================================
//             lifecycle methods
//   ==================================================================*/

//   componentDidMount() {
//     this.setState({
//       multipleConditions: this.props.allStepsData[this.props.activeStepIndex]
//         .addContentConditions,
//     });
//   }

//   /*==================================================================
//                 handlers
//   ==================================================================*/

//   handleOnClickRemoveContentConditions = (index) => (e) => {
//     let multipleConditions = this.state.multipleConditions;
//     multipleConditions.splice(index, 1);
//     this.setState({ multipleConditions });

//     this.props.setAddContentConditionsAction(this.state.multipleConditions);
//   };

//   /*==================================================================
//                 main
//   ==================================================================*/
//   render() {
//     const { multipleConditions } = this.state;
//     return (
//       <>
//         {!isEmpty(multipleConditions) && (
//           <div className="pb-10">
//             {multipleConditions.map((data, index) => (
//               <Fragment key={index}>
//                 <div className="row mx-0 flex-nowrap align-items-center justify-content-between condition-exists-inner-div mb-30">
//                   <h5 className="font-16-bold mr-30">
//                     if &ldquo;{data.question}&rdquo; is &ldquo;{data.answer}
//                     &rdquo; then next step would be &ldquo;{data.stepName}
//                     &rdquo;
//                   </h5>
//                   <button
//                     className="workflow-fa-times-delete-button"
//                     onClick={this.handleOnClickRemoveContentConditions(index)}
//                   >
//                     <i className="fa fa-times"></i>
//                   </button>
//                 </div>
//               </Fragment>
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
//   setAddContentConditionsAction,
// })(AddConditionsWorkflowDisplay);
