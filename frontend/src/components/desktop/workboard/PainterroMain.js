import React, { Component } from "react";
import Painterro from "painterro";
import { connect } from "react-redux";
import { fileUpload } from "./../../../store/actions/workboardAction";
import { createWorkboardAction } from "./../../../store/actions/workboardAction";
import Modal from "react-responsive-modal";
import GreenButtonSmallFont from "../common/GreenButtonSmallFont";
import InputFieldEmailTextPassword from "../common/InputFieldEmailTextPassword";
import { AddWorkboardValidation } from "./../../../store/validations/projectValidation/AddWorkboardValidation";
import isEmpty from "../../../store/validations/is-empty";

export class PainterroMain extends Component {
  constructor() {
    super();
    this.state = {
      display: false,
      open: false,
      workboardName: "",
    };
  }

  callBackFileUpload = async (data, done) => {
    var userData = JSON.parse(localStorage.getItem("UserData"));
    let projectData = JSON.parse(localStorage.getItem("projectData"));
    if (data) {
      console.log(data);
      let formData = {
        name: this.state.workboardName,
        description: "Workboard",
        project: projectData._id,
        data: data,
      };
      await this.props.createWorkboardAction(formData);

      done(true);
      // window.open(
      //   `${data.fileUrl}&token=${userData.token}`,
      //   "_blank" // <- This is what makes it open in a new window.
      // );
    }
  };

  saveImageHnadler = (image, done) => {
    var formData = new FormData();
    formData.append("file", image.asBlob());
    console.log(formData);

    this.props.fileUpload(formData, done, this.callBackFileUpload);
  };

  onChangeHandler = (sd) => {
    console.log(sd);
  };

  displayPainterro = () => {
    const { errors, isValid } = AddWorkboardValidation(this.state);
    if (!isValid) {
      this.setState({
        errors: errors,
      });
    } else {
      this.setState({
        display: true,
        open: false,
      });
    }
  };

  openModelHandler = () => {
    this.setState({
      open: true,
      display: false,
    });
  };

  onCloseModal = () => {
    this.setState({
      open: false,
      display: false,
    });
  };

  handleChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
      errors: {},
    });
  };

  render() {
    const { errors } = this.state;
    var ptro = Painterro({
      backgroundFillColor: "#4d5258", // drawing background color of playfraound
      activeColor: "#57cba1",
      colorScheme: {
        activeColor: "#57cba1",
        main: "rgba(105, 105, 108, 0.16)", // make panels light-yellow
        control: "rgba(105, 105, 108, 0.16)", // change controls color
        controlShadow: "0px 0px 3px 1px #bbb",
        controlContent: "#57cba1",
        activeControl: "#57cba1",
        activeControlContent: "#ffffff",
      },
      saveHandler: this.saveImageHnadler,
      onChange: this.onChangeHandler,

      function(image, done) {
        var formData = new FormData();
        formData.append("image", image.asBlob());
        // you can also pass suggested filename
        // formData.append('image', image.asBlob(), image.suggestedFileName());
        // var xhr = new XMLHttpRequest();
        // xhr.open("POST", "http://127.0.0.1:5000/save-as-binary/", true);
        // xhr.onload = xhr.onerror = function () {
        //   done(true);
        // };
        // xhr.send(formData);
      },
    });

    if (this.state.display === true) {
      ptro.show();
      ptro.close();
    }

    return (
      <div>
        {/*<GreenButtonSmallFont
          onClick={this.openModelHandler}
          text="+ Add New Workboard"
          extraClassName="add-new-workboard-btn"
        />*/}
        <button
          className="all-project-workboard-add-btn"
          onClick={this.openModelHandler}
        >
          <span>
            <i className="fa fa-plus" />
          </span>
        </button>

        {/*<button onClick={this.openModelHandler}>+ Add New Workboard</button>*/}
        <Modal
          open={this.state.open}
          onClose={this.onCloseModal}
          closeOnEsc={true}
          closeOnOverlayClick={false}
          center
          classNames={{
            overlay: "customOverlay",
            modal: "customModal customModal--workboard",
            closeButton: "customCloseButton",
          }}
        >
          <span className="closeIconInModal" onClick={this.onCloseModal} />

          <h1 className="add-meeting-title add-meeting-title--create-module">
            {/*Add Workboard*/}Add New Workboard
          </h1>
          <InputFieldEmailTextPassword
            containerClassName="container-login-flow-input container-login-flow-input--workboard"
            //label="Name"
            name="workboardName"
            placeholder="Title"
            value={this.state.workboardName}
            onChange={this.handleChange}
            type="text"
            autoFocus={true}
            error={!isEmpty(errors) && errors.workboardName}
          />
          <div className="text-center">
            <GreenButtonSmallFont onClick={this.displayPainterro} text="Next" />
            {/*<button onClick={this.displayPainterro}>Next</button>*/}
          </div>
        </Modal>
      </div>
    );
  }
}

export default connect(null, { fileUpload, createWorkboardAction })(
  PainterroMain
);
