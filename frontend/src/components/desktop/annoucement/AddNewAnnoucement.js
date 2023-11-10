import React, { Component } from "react";
import InputFieldEmailTextPassword from "../common/InputFieldEmailTextPassword";
import TextareaField from "../common/TextareaField";
import GreenButtonSmallFont from "../common/GreenButtonSmallFont";
import GrayLinkSmallFont from "../common/GrayLinkSmallFont";
import { connect } from "react-redux";
import { createAnnouncement } from "./../../../store/actions/notificationAction";
import { withRouter } from "react-router-dom";
import PageTitle from "../common/PageTitle";

class AddNewAnnoucement extends Component {
  constructor() {
    super();
    this.state = {
      title: "",
      description: "",
    };
  }

  handleOnChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  };

  callBackCreateAnnouncement = (status) => {
    if (status === 200) {
      this.props.history.push("/announcement");
    }
  };

  handelSave = () => {
    console.log(this.state);

    const formData = {
      notification: {
        title: this.state.title,
        message: this.state.description,
      },
    };
    this.props.createAnnouncement(formData, this.callBackCreateAnnouncement);
  };
  render() {
    return (
      <>
        <div className="add-annoucement-div">
          <div className="add-annoucement-title-div">
            {/*<h2 className="add-annouement-title">add annoucement</h2>*/}
            <div className="pageTitle-topNavbar-div">
              <PageTitle title="add announcement" />
            </div>
            <GrayLinkSmallFont path="/announcement" text="Go Back" />
          </div>
          <div className="annoucement-content">
            <InputFieldEmailTextPassword
              containerClassName="container-login-flow-input container-login-flow-input--forms"
              //label="title"
              name="title"
              value={this.state.title}
              onChange={this.handleOnChange}
              placeholder="Announcement Title"
            />
            <TextareaField
              containerClassName="container-login-flow-textarea container-login-flow-textarea--annoucement"
              //label="description"
              name="description"
              value={this.state.description}
              onChange={this.handleOnChange}
              placeholder="Description"
            />
          </div>
          <div className="green-button-div">
            <GreenButtonSmallFont
              //text="Add"
              text="Save &amp; Add"
              onClick={this.handelSave}
            />
          </div>
        </div>
      </>
    );
  }
}

export default connect(null, { createAnnouncement })(
  withRouter(AddNewAnnoucement)
);
