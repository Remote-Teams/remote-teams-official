import React, { Component, Fragment } from "react";
import LeftNavbar from "../header/LeftNavbar";
import TopNavbar from "../header/TopNavbar";
import GreenButtonSmallFont from "../common/GreenButtonSmallFont";
import PageTitle from "../common/PageTitle";
import "react-accessible-accordion/dist/fancy-example.css";
import InputFieldEmailTextPassword from "../common/InputFieldEmailTextPassword";
import UploadMultipleFilesVault from "../common/UploadMultipleFilesVault";
import CountCardCommon from "../common/CountCardCommon";
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
  getVaultOverview,
} from "./../../../store/actions/vaultAction";
import Progress from "react-progressbar";
import Loader from "react-loader-spinner";
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";

const dummyData = [1, 2, 3];
const addDoc = (
  <>
    <img
      src={require("../../../assets/img/icons/add-vault-doc-icon.svg")}
      alt="add doc"
      className="vault-add-doc-img"
    />
  </>
);

const vaultDemo2 = [
  {
    _id: "2576d790-fa82-11eb-a38e-d321d39eec95",
    name: "demo",
    folderType: "REGULAR",
    createdBy: "akshaynagargoje0716@gmail.com",
    lastModifiedBy: "akshaynagargoje0716@gmail.com",
    createdAt: "2021-08-11T08:57:24.625Z",
    updatedAt: "2021-08-11T08:57:24.625Z",
    __v: 0,
  },
  {
    _id: "2576d790-fa82-11eb-a38e-d321d39eec95",
    name: "demo",
    folderType: "REGULAR",
    createdBy: "akshaynagargoje0716@gmail.com",
    lastModifiedBy: "akshaynagargoje0716@gmail.com",
    createdAt: "2021-08-11T08:57:24.625Z",
    updatedAt: "2021-08-11T08:57:24.625Z",
    __v: 0,
  },
];

class Vault extends Component {
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
    };
  }

  componentDidMount() {
    const formData = {
      query: {
        folderType: "REGULAR",
      },
    };
    this.props.getAllFolder(formData);
    this.props.getVaultOverview();
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
    if (
      !isEmpty(nextProps.vaultOverview) &&
      nextProps.vaultOverview !== nextState.vaultOverview
    ) {
      return {
        vaultOverview: nextProps.vaultOverview,
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
    // let tempArr = this.state.vaultDemo;

    // let tempObj = {
    //   folderName: this.state.newFolderName,
    //   fileName: [],
    // };
    // tempArr.push(tempObj);

    // this.setState({
    //   vaultDemo: tempArr,
    // });

    const formData = {
      name: this.state.newFolderName,
      folderType: "REGULAR",
    };

    this.props.createFolder(formData, "regular");

    this.setState({
      displayAddNew: false,
      newFolderName: "",
    });
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
    //alert("floder deleted");
    this.props.deleteFolderById(data._id, "regular");

    // let tempArr = this.state.vaultDemo;
    // tempArr.splice(index, 1);

    // this.setState({
    //   vaultDemo: tempArr,
    // });
  };

  handleOnCLickBackToVault = () => {
    const formData = {
      query: {
        folderType: "REGULAR",
      },
    };
    this.props.getAllFolder(formData);
    this.props.getVaultOverview();

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
        this.props.uploadFileInsideFolder(
          data,
          selectedFolderData._id,
          // e.target.files[0].size
          1
        );
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

  /*onVisibleChange = () => {
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
  };*/
  /*===================================================================
      renderNewFolderForm
  =====================================================================*/
  renderNewFolderForm = () => {
    const { displayAddNew } = this.state;
    return (
      <div className="vault-add-new-folder-block pt-0">
        {displayAddNew && (
          // <form onSubmit={this.handleOnClickSaveIcon}>
          <div className="row mx-0 align-items-center">
            <img
              //src={require("../../../assets/img/icons/green-folder-icon.svg")}
              src={require("../../../assets/img/icons/gradient-folder-icon.svg")}
              alt=""
              className="vault-green-folder-icon"
            />
            <InputFieldEmailTextPassword
              containerClassName="container-login-flow-input container-login-flow-input--memberDayOffsInputTitle mt-30"
              label=""
              name={"newFolderName"}
              value={this.state.newFolderName}
              onChange={this.handleOnChangeNewFolderName}
              type="text"
              autoFocus={true}
              maxLength={30}
            />
            <i className="fa fa-save" onClick={this.handleOnClickSaveIcon}></i>
            <i
              className="fa fa-times"
              onClick={this.handleOnClickDiscardIcon}
            ></i>
          </div>
          // </form>
        )}
      </div>
    );
  };

  /*===================================================================
      renderFolderNames
  =====================================================================*/
  renderVaultDropdown = (data) => {
    const menu = (
      <Menu>
        <MenuItem onClick={this.handleOnClickDeleteFolder(data)}>
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

  renderFolderNames = () => {
    const { vaultDemo } = this.state;
    return (
      <>
        {this.renderCountCard()}
        {!isEmpty(vaultDemo) ? (
          <>
            <h2 className="list-of-folder-text">List of Folders</h2>
            <div className="vault-folder-overflow-div row mx-0 align-items-start">
              {!isEmpty(vaultDemo) &&
                vaultDemo.map((data, index) => (
                  <Fragment key={index}>
                    <div className="vault-card mb-50">
                      {/* row mx-0 justify-content-between */}
                      <div
                        className="vault-card-img-div cursor-pointer"
                        onClick={this.handleOnClicAccordionDiv(data, index)}
                      >
                        <img
                          //src={require("../../../assets/img/icons/green-folder-icon.svg")}
                          src={require("../../../assets/img/icons/gradient-folder-icon.svg")}
                          alt=""
                          className="vault-green-folder-icon"
                        />
                      </div>
                      <div className="row mx-0 align-items-start justify-content-between flex-nowrap pt-20 w-100">
                        <div className="vault-card-text-div">
                          <h3 className="vault-card-text">{data.name}</h3>
                          <h5 className="font-18-bold font-18-bold--vault-files">
                            {data.filesCount} Files
                          </h5>
                        </div>
                        {/*<p
                        className="font-18-regular opacity-41 cursor-pointer pt-10"
                        onClick={this.handleOnClickDeleteFolder(data)}
                      >
                        <i className="fa fa-trash"></i>
                      </p>*/}
                        {this.renderVaultDropdown(data)}
                      </div>
                    </div>
                  </Fragment>
                ))}
            </div>
          </>
        ) : (
          <div className="text-center">
            <img
              src={require("../../../assets/img/illustrations/vault.svg")}
              alt="vault not found"
              className="vault-not-found-img"
            />
            <h5 className="all-project-not-found-text">Vault is empty</h5>
            <GreenButtonSmallFont
              text="+ New Folder"
              onClick={this.handleOnClickAddNew}
              extraClassName="vault-add-new-folder"
            />
          </div>
        )}
      </>
    );
  };

  /*===================================================================
      renderUploadFile
  =====================================================================*/

  renderUploadFile = (index) => {
    const { vaultDemo, fileArray } = this.state;
    return (
      <div className="row mx-0">
        <div className="vault-add-file-div">
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
          <h3 className="font-18-extraBold-space-light-uppercase vault-add-new-doc-text">
            upload new
          </h3>
        </div>
        {!isEmpty(fileArray) &&
          fileArray.map((file, index) => {
            const fileType = file.file.originalname.split(".").pop();
            return (
              <div key={index} className="vault-file-upload-main">
                <div
                  onClick={this.handleOnClickOpenDocument(file)}
                  className="vault-file-upload"
                >
                  {console.log(fileType)}
                  {fileType === "pdf" ? (
                    <>
                      <img
                        src={require("../../../assets/img/icons/new-pdf-icon.svg")}
                        className="vault-pdf-icon-img"
                        alt="pdf icon"
                      />
                    </>
                  ) : fileType === "png" ? (
                    <>
                      <img
                        src={require("../../../assets/img/icons/png-icon.svg")}
                        className="vault-pdf-icon-img"
                        alt="png icon"
                      />
                    </>
                  ) : fileType === "jpg" ? (
                    <>
                      <img
                        src={require("../../../assets/img/icons/jpg-icon.svg")}
                        className="vault-pdf-icon-img"
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

                {/*<div className="row mx-0 justify-content-between align-items-center flex-nowrap">
                    <GreenButtonSmallFont
                      onClick={this.handleOnClickOpenDocument(file)}
                      text="Open"
                      extraClassName="vault-file-open-btn"
                    />
                    this.renderFileDropdown(file)
                  </div>*/}
              </div>
            );
          })}
      </div>
    );
  };

  renderCountCard = () => {
    const { vaultOverview } = this.state;

    return (
      <div className="row mx-0 page-count-row flex-nowrap">
        <CountCardCommon
          title="Total Folder"
          count={!isEmpty(vaultOverview) && vaultOverview.totalFolders}
        />
        <CountCardCommon
          title="total files uploaded"
          count={!isEmpty(vaultOverview) && vaultOverview.totalFiles}
        />
        <div className="count-card-block count-card-block--vault">
          <h2 className="count-card-block__title">Stograge used</h2>
          <div className="row mx-0 align-items-center pt-10">
            <h5 className="vault-used-storage-count font-2-bold">
              {!isEmpty(vaultOverview) && vaultOverview.fileGB} MB
            </h5>
            <div className="vault-progress-bar">
              <Progress completed={0.002} />
            </div>
            <h5 className="vault-used-storage-count font-2-bold">10 GB</h5>
          </div>
        </div>
      </div>
    );
  };

  /*===================================================================
      main
  =====================================================================*/
  render() {
    const { vaultDemo, indexValue, addFolderSection } = this.state;
    const { loader } = this.props;
    return (
      <>
        {loader === true && (
          <Loader type="Triangle" color="#57cba1" className="remote-loader" />
        )}

        {addFolderSection === false ? (
          <>
            {/* left navbar */}
            <LeftNavbar activeMenu="vault" />

            <div className="main-page-padding">
              {/* pagetitle and topnavbar */}
              <div className="pageTitle-topNavbar-div">
                <PageTitle
                  title={this.state.newFolderName}
                  // isBtnDisplay={true}
                  // btnOnClick={this.handleOnClickAddNew}
                  // btnText="+ New Folder"
                />
                <TopNavbar />
              </div>

              <div className="mb-50">
                <GrayButtonSmallFont
                  onClick={this.handleOnCLickBackToVault}
                  //text="Back To All Folders"
                  text="Go back"
                />
              </div>
              {this.renderUploadFile(indexValue)}
            </div>
          </>
        ) : (
          <>
            {/* left navbar */}
            <LeftNavbar activeMenu="vault" />

            <div className="main-page-padding">
              {/* pagetitle and topnavbar */}
              <div className="pageTitle-topNavbar-div">
                <PageTitle
                  title="Vault"
                  isBtnDisplay={true}
                  btnOnClick={this.handleOnClickAddNew}
                  btnText="+ New Folder"
                />
                <TopNavbar />
              </div>
              {/* pagetitle and topnavbar end */}
              {/* <GreenButtonSmallFont
                text="+ New Folder"
                onClick={this.handleOnClickAddNew}
                extraClassName="vault-add-new-folder"
              /> */}
              {this.renderNewFolderForm()}
              {this.renderFolderNames()}
            </div>
          </>
        )}
      </>
    );
  }
}

const mapStateToProps = (state) => ({
  allFolders: state.vault.allFolders,
  allFilesOfFolder: state.vault.allFilesOfFolder,
  vaultOverview: state.vault.vaultOverview,
  loader: state.auth.loader,
});

export default connect(mapStateToProps, {
  createFolder,
  getAllFolder,
  uploadFileInsideFolder,
  getFilesByFolderId,
  deleteFileById,
  deleteFolderById,
  getVaultOverview,
})(Vault);
