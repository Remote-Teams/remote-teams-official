import React, { Component } from "react";
import Modal from "react-responsive-modal";
import GreenButtonSmallFont from "../common/GreenButtonSmallFont";
import TextareaField from "../common/TextareaField";
import InputFieldEmailTextPassword from "../common/InputFieldEmailTextPassword";
// import UploadFile from "../common/UploadFile";
// api
import isEmpty from "../../../store/validations/is-empty";
import { fileUpload } from "./../../../store/actions/resourcesAction";
import { uploadFile } from "./../../../store/actions/allProjectDiscussionAction";
import { connect } from "react-redux";
import {
  addNewAllProjectDiscussion,
  updateAllProjectDiscussion,
} from "./../../../store/actions/allProjectDiscussionAction";
import UploadMultipleFiles from "../common/UploadMultipleFiles";
import { AddDiscussionValidation } from "./../../../store/validations/projectValidation/AddDiscussionValidation";

class AllProjectDiscussionAddNew extends Component {
  constructor() {
    super();
    this.state = {
      open1: false,
      subject: "",
      fileName: [],
      description: "",
      // api
      fileData: [],
      errors: {},
    };
  }

  componentDidMount() {
    if (!this.props.isFormTypeAdd) {
      const { discussionData } = this.props;
      this.setState({
        subject: discussionData.subject,
        description: discussionData.description,
        fileName: isEmpty(discussionData.attachments)
          ? []
          : discussionData.attachments.map((doc) => doc.originalname),
        fileData: isEmpty(discussionData.attachments)
          ? []
          : discussionData.attachments,
      });
    }
  }

  /*=================================================================
          handlers
  =================================================================*/

  onCloseModal = () => {
    this.setState({
      open1: false,
    });
  };

  onOpenModal = () => {
    this.setState({
      open1: true,
    });
  };

  handelChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
      errors: {},
    });
  };

  callBackIsSuccess = (data) => {
    if (data) {
      this.onCloseModal();
    }
  };

  handleOnClickSave = () => {
    // console.log(this.state);
    const { isFormTypeAdd } = this.props;
    if (isFormTypeAdd) {
      const { errors, isValid } = AddDiscussionValidation(this.state);
      // add discussion

      if (!isValid) {
        this.setState({
          errors: errors,
        });
      } else {
        let formData = {
          subject: this.state.subject,
          description: this.state.description,
          attachments: this.state.fileData,
          project: this.props.projectId,
          status: "ONGOING",
        };

        this.props.addNewAllProjectDiscussion(formData, this.callBackIsSuccess);
      }
    } else if (!isFormTypeAdd) {
      // edit discussion
      const { discussionData } = this.props;
      let formData = {
        subject: this.state.subject,
        description: this.state.description,
        attachments: this.state.fileData,
        project: this.props.projectId,
        status: discussionData.status,
      };
      this.props.updateAllProjectDiscussion(
        discussionData._id,
        formData,
        this.callBackIsSuccess
      );
    }
  };

  /*===========================================================================
        renderUploadMultipleFiles
  ============================================================================*/

  callBackFileUpload = (data) => {
    this.setState({
      fileData: [...this.state.fileData, data],
    });
  };

  handleOnChangeUploadDocuments = (e) => {
    e.preventDefault();
    // upload exact file to server
    const data = new FormData();
    data.append("file", e.target.files[0]);

    //display multiple file name in front end
    let files = this.state.fileName;
    files.push(e.target.files[0].name);
    this.setState({
      fileName: files,
    });

    this.props.uploadFile(data, this.callBackFileUpload);
  };

  handleOnClickRemoveDocument = (val) => (e) => {
    e.preventDefault();
    const { fileName, fileData } = this.state;
    const filteredItems = fileName.filter((item) => item !== val);
    const filteredFileData = fileData.filter(
      (item) => item.originalname !== val
    );
    this.setState({
      fileName: filteredItems,
      fileData: filteredFileData,
    });
  };

  renderUploadMultipleFiles = () => {
    return (
      <UploadMultipleFiles
        containerClassName="upload-img__mainBlock upload-img__mainBlock--disussion mb-0"
        //buttonName="+ New Doc"
        buttonName="Attach Files"
        fileNameValue={this.state.fileName}
        // acceptType="image/jpeg, image/png"
        onChange={this.handleOnChangeUploadDocuments}
        handleOnClickRemoveDocument={this.handleOnClickRemoveDocument}
      />
    );
  };

  /*================================================================================
          renderNewEntry
==============================================================================*/
  renderNew = () => {
    const { open1, errors } = this.state;
    const { isFormTypeAdd } = this.props;
    return (
      <>
        <Modal
          open={open1}
          onClose={this.onCloseModal}
          closeOnEsc={true}
          closeOnOverlayClick={false}
          center
          classNames={{
            overlay: "customOverlay",
            modal: "customModal customModal--discussion",
            closeButton: "customCloseButton",
          }}
        >
          <span className="closeIconInModal" onClick={this.onCloseModal} />
          <div className="edit-client-modal-content edit-client-modal-content--discussion">
            {/*<h2 className="font-32-extraBold-letterspace mt-30 mb-40 text-center">
              {isFormTypeAdd ? "add discussion" : "manage discussion"}
        </h2>*/}
            <h2 className="add-meeting-title add-meeting-title--disucssion">
              {isFormTypeAdd ? "add discussion" : "edit discussion"}
            </h2>
            {/*className="overflow-block-discussion-add" */}
            <div>
              <InputFieldEmailTextPassword
                containerClassName="container-login-flow-input container-login-flow-input--forms"
                //label="subject"
                name="subject"
                value={this.state.subject}
                onChange={this.handelChange}
                autoFocus={true}
                placeholder="Subject"
                error={!isEmpty(errors) && errors.subject}
              />
              <TextareaField
                containerClassName="container-login-flow-textarea"
                //label="description"
                name="description"
                value={this.state.description}
                onChange={this.handelChange}
                placeholder="Description"
                error={!isEmpty(errors) && errors.description}
              />
              <div className="row justify-content-between align-items-center discussion-files-div">
                <div className="col-11">
                  {/*<h3 className="font-18-bold-space-light-uppercase mb-20">
                    attach files{" "}
                    <span className="text-lowercase">(if any)</span>
      </h3>*/}
                  {this.renderUploadMultipleFiles()}
                </div>
              </div>
            </div>
            <div className="col-11 text-right discussion-modal-post-btn-block">
              <GreenButtonSmallFont
                text={"Post"}
                onClick={this.handleOnClickSave}
              />
            </div>
          </div>
        </Modal>
      </>
    );
  };

  /*===========================================================================
        main
  ============================================================================*/
  render() {
    const { isFormTypeAdd } = this.props;
    console.log(this.state.fileData);
    return (
      <>
        {this.renderNew()}
        {isFormTypeAdd ? (
          <GreenButtonSmallFont
            text={"Create new Discussion"}
            onClick={this.onOpenModal}
            extraClassName="add-discussion-btn add-discussion-btn--new"
          />
        ) : (
          <button
            onClick={this.onOpenModal}
            className={`discussion-new-edit-btn ${this.props.extraClassNameEditBtn}`}
          >
            <i className="fa fa-pencil finances-table__fa-icon-edit"></i>
            {this.props.editBtnText}
          </button>
        )}
      </>
    );
  }
}

AllProjectDiscussionAddNew.defaultProps = {
  extraClassNameEditBtn: "",
};

export default connect(null, {
  fileUpload,
  uploadFile,
  addNewAllProjectDiscussion,
  updateAllProjectDiscussion,
})(AllProjectDiscussionAddNew);
