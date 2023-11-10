import React, { Component, Fragment } from "react";
import Modal from "react-responsive-modal";
import "react-accessible-accordion/dist/fancy-example.css";
import InputFieldEmailTextPassword from "../common/InputFieldEmailTextPassword";
import UploadMultipleFilesVault from "../common/UploadMultipleFilesVault";

import isEmpty from "../../../store/validations/is-empty";
import GrayButtonSmallFont from "../common/GrayButtonSmallFont";
import { connect } from "react-redux";
import DropdownIcon from "rc-dropdown";
import "rc-dropdown/assets/index.css";
import Menu, { Item as MenuItem, Divider } from "rc-menu";
import {
  createFolder,
  getAllFolder,
  uploadFileInsideFolder,
  getFilesByFolderId,
  deleteFileById,
  deleteFolderById,
} from "./../../../store/actions/vaultAction";
import GreenButtonSmallFont from "../common/GreenButtonSmallFont";
import { AddFolderValidation } from "./../../../store/validations/projectValidation/AddFolderValidation";

const dummyData = [1, 2, 3];

const addDoc = (
  <>
    <span className="directories-add-new-file-btn-text">
      <i className="fa fa-plus"></i>
      <br />
      add new file
    </span>
  </>
);

class AllProjectDirectories extends Component {
  constructor() {
    super();
    this.state = {
      addFolderSection: true,
      newFolderName: "",
      displayAddNew: false,
      selectedFolderData: [],
      fileArray: [],
      // vaultDemo
      vaultDemo: [],
      indexValue: -1,
      errors: {},
    };
  }

  componentDidMount() {
    let projectData = JSON.parse(localStorage.getItem("projectData"));
    const formData = {
      query: {
        folderType: "PROJECT",
        project: projectData._id,
      },
    };
    this.props.getAllFolder(formData);
  }

  static getDerivedStateFromProps(nextProps, nextState) {
    if (
      !isEmpty(nextProps.allFolders) &&
      nextProps.allFolders !== nextState.vaultDemo
    ) {
      return {
        vaultDemo: nextProps.allFolders,
      };
    }
    if (
      !isEmpty(nextProps.allFilesOfFolder) &&
      nextProps.allFilesOfFolder !== nextState.allFilesOfFolder
    ) {
      console.log(nextProps.allFilesOfFolder);
      return {
        allFilesOfFolder: nextProps.allFilesOfFolder,
        fileArray: nextProps.allFilesOfFolder,
      };
    }
    return null;
  }

  componentDidUpdate() {
    if (this.props.allFolders !== this.state.vaultDemo) {
      this.setState({
        vaultDemo: this.props.allFolders,
      });
    }
    if (this.props.allFilesOfFolder !== this.state.allFilesOfFolder) {
      this.setState({
        allFilesOfFolder: this.props.allFilesOfFolder,
        fileArray: this.props.allFilesOfFolder,
      });
    }
  }

  /*===================================================================
      handlers
  =====================================================================*/

  handleOnChangeNewFolderName = (e) => {
    this.setState({ newFolderName: e.target.value });
  };

  handleOnClickSaveIcon = () => {
    let projectData = JSON.parse(localStorage.getItem("projectData"));
    // let tempArr = this.state.vaultDemo;

    // let tempObj = {
    //   folderName: this.state.newFolderName,
    //   fileName: [],
    // };
    // tempArr.push(tempObj);

    // this.setState({
    //   vaultDemo: tempArr,
    // });

    const { errors, isValid } = AddFolderValidation(this.state);
    if (!isValid) {
      this.setState({
        errors: errors,
      });
    } else {
      const formData = {
        name: this.state.newFolderName,
        folderType: "PROJECT",
        project: projectData._id,
      };
      this.props.createFolder(formData, "project");

      this.setState({
        displayAddNew: false,
        newFolderName: "",
      });
    }
  };

  handleOnClickDiscardIcon = () => {
    this.setState({
      displayAddNew: false,
      newFolderName: "",
    });
  };

  handleOnClickAddNew = () => {
    this.setState({
      displayAddNew: true,
      newFolderName: "",
    });
  };

  handleOnClicAccordionDiv = (data, index) => (e) => {
    const formData = {
      // "pageNo":1,
      // "pageSize":10,
      query: {
        folderId: data._id,
      },
    };
    this.props.getFilesByFolderId(formData);

    this.setState({
      newFolderName: data.name,
      indexValue: index,
      displayAddNew: false,
      addFolderSection: false,
      selectedFolderData: data,
    });
  };

  handleOnClickDeleteFolder = (data) => (e) => {
    this.props.deleteFolderById(data._id, "project");

    // let tempArr = this.state.vaultDemo;
    // tempArr.splice(index, 1);

    // this.setState({
    //   vaultDemo: tempArr,
    // });
  };

  handleOnCLickBackToVault = () => {
    this.setState({
      // indexValue: -1,
      addFolderSection: true,
      newFolderName: "",
      displayAddNew: false,
    });
  };

  /*=================================================================================
      multipleFilesUpload handlers
  =================================================================================*/
  handleOnChangeUploadDocuments = (index) => (e) => {
    e.preventDefault();
    var userData = JSON.parse(localStorage.getItem("UserData"));
    const { selectedFolderData } = this.state;
    let folderFiles = this.state.fileArray;

    const data = new FormData();
    data.append("file", e.target.files[0]);

    const fileName = e.target.files[0].name;
    var ext = fileName.match(/\.([^\.]+)$/)[1];
    console.log(e.target.files);
    if (ext === "pdf" || ext === "jpg" || ext === "png" || ext === "csv") {
      if (e.target.files[0].size < 5000000) {
        const data = new FormData();
        // data.append("image", e.target.files[0].name);
        data.append("file", e.target.files[0]);
        //console.log(e.target.files[0]);
        console.log("file upload", data);
        this.props.uploadFileInsideFolder(data, selectedFolderData._id, 1);
      } else {
        alert("Only files of size below 5mb are allowed");
      }
    } else {
      alert("Only files with format pdf, jpg, png, csv are allowed");
    }
  };

  handleOnClickRemoveDocument = (fileData) => (e) => {
    e.preventDefault();
    const { selectedFolderData } = this.state;
    console.log(fileData);

    this.props.deleteFileById(fileData._id, selectedFolderData._id);
  };

  handleOnClickOpenDocument = (fileInfo, folderInfo) => (e) => {
    var userData = JSON.parse(localStorage.getItem("UserData"));
    e.preventDefault();

    window.open(`${fileInfo.file.fileUrl}&token=${userData.token}`, "_blank");
    // window.location.href = `${fileInfo.url}&token=${userData.token}`;
  };

  deleteFileHandler = (fileData) => (e) => {
    const { selectedFolderData } = this.state;
    this.props.deleteFileById(fileData._id, selectedFolderData._id);
  };

  onVisibleChange = () => {
    console.log("handle visible");
  };

  onSelect = (action, fileData) => {
    const { selectedFolderData } = this.state;
    if (action === "move") {
      console.log("Click");
    } else {
      this.props.deleteFileById(fileData._id, selectedFolderData._id);
    }
  };
  renderFileDropdown = (fileData) => {
    const menu = (
      <Menu>
        <MenuItem onClick={() => this.onSelect("move")}>
          Move to another folder
        </MenuItem>
        <MenuItem onClick={() => this.onSelect("delete", fileData)}>
          Delete
        </MenuItem>
      </Menu>
    );

    return (
      <DropdownIcon
        trigger={["click"]}
        overlay={menu}
        animation="none"
        onVisibleChange={this.onVisibleChange}
      >
        <i className="fa fa-ellipsis-v" />
      </DropdownIcon>
    );
  };
  /*===================================================================
      renderNewFolderForm
  =====================================================================*/
  renderNewFolderForm = () => {
    const { displayAddNew, errors } = this.state;
    return (
      <>
        {displayAddNew && (
          <>
            <Modal
              open={displayAddNew}
              onClick={this.handleOnClickDiscardIcon}
              closeOnEsc={true}
              closeOnOverlayClick={false}
              center
              classNames={{
                overlay: "customOverlay",
                modal: "customModal customModal--directoriesAddFolderName",
                closeButton: "customCloseButton",
              }}
            >
              <span
                className="closeIconInModal"
                onClick={this.handleOnClickDiscardIcon}
              />
              <div className="project-directories-add-folder-modal-content">
                <h2 className="add-meeting-title">Add Folder</h2>
                <InputFieldEmailTextPassword
                  containerClassName="container-login-flow-input container-login-flow-input--forms"
                  label=""
                  name={"newFolderName"}
                  value={this.state.newFolderName}
                  onChange={this.handleOnChangeNewFolderName}
                  type="text"
                  placeholder="Folder name"
                  autoFocus={true}
                  maxLength={30}
                  error={!isEmpty(errors) && errors.newFolderName}
                />

                <GreenButtonSmallFont
                  text={"Save"}
                  onClick={this.handleOnClickSaveIcon}
                />
              </div>
            </Modal>
          </>
        )}
      </>
    );
  };

  /*===================================================================
      renderFolderNames
  =====================================================================*/
  renderFolderNames = () => {
    const { vaultDemo } = this.state;
    return (
      <>
        <div className="row mx-0 align-items-start project-directories-overflow-div">
          <button
            className="project-directory-add-new-folder-btn"
            onClick={this.handleOnClickAddNew}
          >
            <p className="font-18-bold all-project-directories-card__text2 project-directory-add-new-folder-btn__content">
              <img
                src="/img/icons/new-folder-green-plus-icon.svg"
                alt=""
                className="project-directory-add-new-folder-btn__contentImg"
              />
              <br />
              Add new <br /> <span className="pt-10">Folder</span>
            </p>
          </button>

          {!isEmpty(vaultDemo) && (
            <>
              {vaultDemo.map((data, index) => (
                <Fragment key={index}>
                  <div className="all-project-directories-card mb-50">
                    <div
                      className="all-project-directories-card__folderImgBlock"
                      onClick={this.handleOnClicAccordionDiv(data, index)}
                    >
                      <img
                        src={require("../../../assets/img/icons/gradient-folder-icon.svg")}
                        alt=""
                      />
                    </div>
                    <div className="row mx-0 align-items-start flex-nowrap justify-content-between">
                      <div className="mr-15">
                        <h3 className="font-18-semiBold all-project-directories-card__text1">
                          {data.name}
                        </h3>
                        <p className="font-18-bold all-project-directories-card__text2">
                          {data.filesCount} Files
                        </p>
                      </div>
                      <p
                        className="font-18-regular opacity-41 cursor-pointer"
                        onClick={this.handleOnClickDeleteFolder(data)}
                      >
                        <i className="fa fa-trash"></i>
                      </p>
                    </div>
                  </div>
                </Fragment>
              ))}
            </>
          )}
        </div>
        {/* )} */}
        {/* ) : (
           <div className="text-center">
             <div>
               <img
                 src={require("../../../assets/img/illustrations/vault.svg")}
                 alt="vault not found"
                 className="vault-not-found-img"
               />
             </div>
             <h5 className="all-project-not-found-text">Empty Directories</h5>
             <GreenButtonSmallFont
               text="New Folder"
               onClick={this.handleOnClickAddNew}
               extraClassName="vault-add-new-folder"
             />
           </div>
         )} */}
      </>
    );
  };

  /*===================================================================
      renderUploadFile
  =====================================================================*/

  renderUploadFile = (index) => {
    const { vaultDemo, fileArray } = this.state;
    return (
      <div className="row mx-0 align-items-start">
        <div className="project-directories-add-new-file-button-outer-block">
          <UploadMultipleFilesVault
            containerClassName="upload-img__mainBlock upload-img__mainBlock--vault mb-0"
            //buttonName="+ New Doc"
            buttonName={addDoc}
            fileNameValue={this.state.fileArray}
            acceptType="image/jpeg, image/png, application/pdf"
            onChange={this.handleOnChangeUploadDocuments(index)}
            handleOnClickRemoveDocument={(fileData) =>
              this.handleOnClickRemoveDocument(fileData)
            }
            handleOnClickOpenDocument={(element) =>
              this.handleOnClickOpenDocument(element, vaultDemo[index])
            }
          />
        </div>
        {!isEmpty(fileArray) &&
          fileArray.map((file, index) => {
            const fileType = file.file.originalname.split(".").pop();
            return (
              <div key={index} className="vault-file-upload-main--directories">
                <div
                  onClick={this.handleOnClickOpenDocument(file)}
                  className="vault-file-upload"
                >
                  {console.log(fileType)}
                  {fileType === "pdf" ? (
                    <>
                      <img
                        src={require("../../../assets/img/icons/new-pdf-icon.svg")}
                        className="directories-pdf-icon-img"
                        alt="pdf icon"
                      />
                    </>
                  ) : fileType === "png" ? (
                    <>
                      <img
                        src={require("../../../assets/img/icons/png-icon.svg")}
                        className="directories-pdf-icon-img"
                        alt="png icon"
                      />
                    </>
                  ) : fileType === "jpg" ? (
                    <>
                      <img
                        src={require("../../../assets/img/icons/jpg-icon.svg")}
                        className="directories-pdf-icon-img"
                        alt="jpg icon"
                      />
                    </>
                  ) : (
                    ""
                  )}
                </div>
                <div className="row mx-0 align-items-start justify-content-between flex-nowrap">
                  <h3 className="font-18-extraBold-space-light-uppercase">
                    {file.file.originalname}
                  </h3>
                  <button
                    onClick={this.deleteFileHandler(file)}
                    className="file-trash-icon"
                  >
                    <i className="fa fa-trash"></i>
                  </button>
                </div>

                {/* <div className="row mx-0 justify-content-between align-items-center flex-nowrap">
                  <GreenButtonSmallFont
                    onClick={this.handleOnClickOpenDocument(file)}
                    text="Open"
                    extraClassName="vault-file-open-btn"
                  />
                  {this.renderFileDropdown(file)}
                </div> */}
              </div>
            );
          })}
      </div>
    );
  };

  /*===================================================================
      main
  =====================================================================*/
  render() {
    const { vaultDemo, indexValue, addFolderSection } = this.state;
    // console.log(this.props.allFolders);
    return (
      <>
        {addFolderSection === false ? (
          <>
            <div className="mb-50 project-directories-content-mt">
              <GrayButtonSmallFont
                onClick={this.handleOnCLickBackToVault}
                //text="Back To All Folders"
                text="Go back"
              />
            </div>
            {this.renderUploadFile(indexValue)}
          </>
        ) : (
          <>
            {/* pagetitle and topnavbar end */}
            {/* <GreenButtonSmallFont
              text="+ New Folder"
              onClick={this.handleOnClickAddNew}
              extraClassName="vault-add-new-folder"
            /> */}
            {this.renderNewFolderForm()}
            {this.renderFolderNames()}
          </>
        )}
      </>
    );
  }
}

const mapStateToProps = (state) => ({
  allFolders: state.vault.allFolders,
  allFilesOfFolder: state.vault.allFilesOfFolder,
});

export default connect(mapStateToProps, {
  createFolder,
  getAllFolder,
  uploadFileInsideFolder,
  getFilesByFolderId,
  deleteFileById,
  deleteFolderById,
})(AllProjectDirectories);
