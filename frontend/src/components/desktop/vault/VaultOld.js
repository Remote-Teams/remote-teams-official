// import React, { Component } from "react";
// import LeftNavbar from "../header/LeftNavbar";
// import TopNavbar from "../header/TopNavbar";
// import GreenButtonSmallFont from "../common/GreenButtonSmallFont";
// import PageTitle from "../common/PageTitle";
// import {
//   Accordion,
//   AccordionItem,
//   AccordionItemHeading,
//   AccordionItemButton,
//   AccordionItemPanel,
// } from "react-accessible-accordion";
// import "react-accessible-accordion/dist/fancy-example.css";
// import InputFieldEmailTextPassword from "../common/InputFieldEmailTextPassword";
// import UploadMultipleFiles from "../common/UploadMultipleFiles";

// import isEmpty from "../../../store/validations/is-empty";

// class VaultOld extends Component {
//   constructor() {
//     super();
//     this.state = {
//       newFolderName: "",
//       displayAddNew: false,
//       // vaultDemo
//       vaultDemo: [
//         {
//           folderName: "Folder 1",
//           fileName: [],
//         },
//         {
//           folderName: "Folder 2",
//           fileName: [],
//         },
//         {
//           folderName: "Folder 3",
//           fileName: [],
//         },
//       ],
//     };
//   }

//   /*==============================================
//       handlers
//   ================================================*/

//   handleOnChangeNewFolderName = (e) => {
//     this.setState({ newFolderName: e.target.value });
//   };

//   handleOnClickSaveIcon = () => {
//     let tempArr = this.state.vaultDemo;

//     let tempObj = {
//       folderName: this.state.newFolderName,
//       fileName: [],
//     };
//     tempArr.push(tempObj);

//     this.setState({
//       vaultDemo: tempArr,
//     });

//     this.handleOnClickDiscardIcon();
//   };

//   handleOnClickDiscardIcon = () => {
//     this.setState({
//       displayAddNew: false,
//       newFolderName: "",
//     });
//   };

//   handleOnClickAddNew = () => {
//     this.setState({
//       displayAddNew: true,
//       newFolderName: "",
//     });
//   };

//   handleOnClicAccordionDiv = () => {
//     this.setState({
//       displayAddNew: false,
//       newFolderName: "",
//     });
//   };

//   handleOnClickDeleteFolder = (index) => (e) => {
//     let tempArr = this.state.vaultDemo;
//     tempArr.splice(index, 1);

//     this.setState({
//       vaultDemo: tempArr,
//     });
//   };

//   /*============================================================
//       multipleFilesUpload handlers
//   ============================================================*/
//   handleOnChangeUploadDocuments = (index) => (e) => {
//     e.preventDefault();
//     let vault = this.state.vaultDemo;
//     vault[index].fileName.push(e.target.files[0].name);
//     this.setState({
//       vaultDemo: vault,
//     });
//   };

//   handleOnClickRemoveDocument = (element, index) => (e) => {
//     e.preventDefault();

//     // make new copy of array
//     const vault = [...this.state.vaultDemo];
//     // update specific array object
//     vault[index] = {
//       ...vault[index],
//       fileName: vault[index].fileName.filter((item) => item !== element),
//     };

//     // update state
//     this.setState({
//       vaultDemo: vault,
//     });
//   };

//   /*==============================================
//       main
//   ================================================*/
//   render() {
//     const { vaultDemo, displayAddNew } = this.state;
//     return (
//       <>
//         {/* left navbar */}
//         <LeftNavbar activeMenu="vault" />

//         <div className="main-page-padding">
//           {/* pagetitle and topnavbar */}
//           <div className="pageTitle-topNavbar-div">
//             <PageTitle title="Vault" />
//             <TopNavbar />
//           </div>
//           {/* pagetitle and topnavbar end */}
//           <GreenButtonSmallFont
//             text="+ New Folder"
//             onClick={this.handleOnClickAddNew}
//           />

//           <div className="vault-add-new-folder-block">
//             {displayAddNew && (
//               <form onSubmit={this.handleOnClickSaveIcon}>
//                 <div className="row mx-0 align-items-center">
//                   <InputFieldEmailTextPassword
//                     containerClassName="container-login-flow-input container-login-flow-input--memberDayOffsInputTitle"
//                     label=""
//                     name={"newFolderName"}
//                     value={this.state.newFolderName}
//                     onChange={this.handleOnChangeNewFolderName}
//                     type="text"
//                     autoFocus={true}
//                   />

//                   <i
//                     className="fa fa-save"
//                     onClick={this.handleOnClickSaveIcon}
//                   ></i>
//                   <i
//                     className="fa fa-times"
//                     onClick={this.handleOnClickDiscardIcon}
//                   ></i>
//                 </div>
//               </form>
//             )}
//           </div>

//           <div
//             className="vault-accordion-div"
//             onClick={this.handleOnClicAccordionDiv}
//           >
//             <Accordion allowZeroExpanded={true}>
//               {!isEmpty(vaultDemo) &&
//                 vaultDemo.map((data, index) => (
//                   <AccordionItem key={index}>
//                     <div className="row mx-0 align-items-center justify-content-end vault-delete-icon-block">
//                       <p
//                         className="font-18-regular opacity-41 vault-delete-icon-block__delete-text"
//                         onClick={this.handleOnClickDeleteFolder(index)}
//                       >
//                         <i className="fa fa-trash"></i>
//                       </p>
//                     </div>
//                     <AccordionItemHeading>
//                       <AccordionItemButton>
//                         {data.folderName}
//                       </AccordionItemButton>
//                     </AccordionItemHeading>
//                     <AccordionItemPanel>
//                       <div className="row mx-0">
//                         <div className="col-6">
//                           <UploadMultipleFiles
//                             containerClassName="upload-img__mainBlock mb-0"
//                             buttonName="+ New Doc"
//                             fileNameValue={data.fileName}
//                             // acceptType="image/jpeg, image/png"
//                             onChange={this.handleOnChangeUploadDocuments(index)}
//                             handleOnClickRemoveDocument={(element) =>
//                               this.handleOnClickRemoveDocument(element, index)
//                             }
//                           />
//                         </div>
//                       </div>
//                     </AccordionItemPanel>
//                   </AccordionItem>
//                 ))}
//             </Accordion>
//           </div>
//         </div>
//       </>
//     );
//   }
// }

// export default VaultOld;
