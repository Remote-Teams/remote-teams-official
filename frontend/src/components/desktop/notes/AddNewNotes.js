import React, { Component } from "react";
import GreenButtonSmallFont from "../common/GreenButtonSmallFont";
import InputFieldEmailTextPassword from "../common/InputFieldEmailTextPassword";
import GrayLinkSmallFont from "../common/GrayLinkSmallFont";
import TextareaField from "../common/TextareaField";
import PageTitle from "../common/PageTitle";
// api
import isEmpty from "../../../store/validations/is-empty";
import { connect } from "react-redux";
import {
  getNoteName,
  addNewNote,
  updateNote,
} from "./../../../store/actions/notesAction";
import { maxLengths } from "../../../store/validations/maxLengths/MaxLengths";
import Validator from "validator";
import { validateAddNote } from "./../../../store/validations/notesValidation/addNotesValidation";

class AddNewNotes extends Component {
  constructor() {
    super();
    this.state = {
      description: "",
      title: "",
      errors: {},
      errorsNew: { title: "", description: "" },
    };
  }

  /*==========================================================================
        lifecycle methods
  ============================================================================*/
  componentDidMount() {
    if (!this.props.location.state.isFormTypeAdd) {
      this.setState({
        title: this.props.location.state.noteData.name,
        description: this.props.location.state.noteData.description,
      });
    }
  }

  /*==========================================================================
        handlers
  ============================================================================*/

  callback = (data) => {
    // console.log(data);
    let error = {};
    if (data.isExist === true) {
      error.noteTitle = "Name already exist";
      this.setState({
        errors: error,
      });
    }
  };

  handelOnChange = (e) => {
    this.setState({
      errorsNew: { title: "", description: "" },
    });
    if (e.target.name === "title") {
      this.props.getNoteName(e.target.value, this.callback);
      this.setState({
        [e.target.name]: e.target.value,
        errors: {},
      });
    } else {
      this.setState({
        [e.target.name]: e.target.value,
      });
    }
  };

  handleOnClickSave = () => {
    const { errors } = this.state;

    const { errorsNew, isValid } = validateAddNote(this.state);

    if (!isValid) {
      console.log(errorsNew);
      this.setState({
        errorsNew: errorsNew,
      });
    } else {
      if (this.props.location.state.isFormTypeAdd) {
        // add note
        if (isEmpty(errors)) {
          let formData = {
            name: this.state.title,
            description: this.state.description,
          };
          this.props.addNewNote(formData, this.props.history);
        }
      } else if (!this.props.location.state.isFormTypeAdd) {
        // edit note
        if (isEmpty(errors)) {
          let formData = {
            name: this.state.title,
            description: this.state.description,
          };
          this.props.updateNote(
            this.props.location.state.noteData._id,
            formData,
            this.props.history
          );
        }
      }
    }
  };

  /*====================================================
          main
  ======================================================*/
  render() {
    const { errors, errorsNew } = this.state;
    return (
      <>
        {/* login-flow-dashboard-buttons-block */}
        <div className="row mx-0 new-add-notes-div">
          <PageTitle
            title={
              this.props.location.state.isFormTypeAdd ? "Add Note" : "Edit Note"
            }
          />
          <div className="login-flow-dashboard-buttons-block login-flow-dashboard-buttons-block--add-note">
            <GrayLinkSmallFont path="/notes" text="Back" />
          </div>
        </div>
        <InputFieldEmailTextPassword
          containerClassName="notes-name-div container-login-flow-input"
          name="title"
          value={this.state.title}
          type="text"
          onChange={this.handelOnChange}
          placeholder="notes title"
          autoFocus={true}
          error={
            errors.noteTitle ||
            (Validator.isLength(this.state.title, {
              min: 50,
              max: 50,
            }) &&
              "Notes should be in beetween 50 characters") ||
            (errorsNew.title && errorsNew.title)
          }
          maxLength={maxLengths.char50}
        />

        <div className="notes-description-div">
          <TextareaField
            //label="description"
            containerClassName="container-login-flow-textarea container-login-flow-textarea--notes"
            placeholder="Enter your text"
            name="description"
            value={this.state.description}
            type="text"
            onChange={this.handelOnChange}
            error={errorsNew.description && errorsNew.description}
          />
        </div>
        <div className="row justify-content-end align-items-end notes-btn-div">
          <GrayLinkSmallFont path="/notes" text="Cancel" />
          {isEmpty(errors) ? (
            <GreenButtonSmallFont
              text="Save"
              onClick={this.handleOnClickSave}
            />
          ) : (
            <GreenButtonSmallFont
              text="Save"
              onClick={this.handleOnClickSave}
              disabled="disabled"
            />
          )}
        </div>
      </>
    );
  }
}

export default connect(null, {
  getNoteName,
  addNewNote,
  updateNote,
})(AddNewNotes);
