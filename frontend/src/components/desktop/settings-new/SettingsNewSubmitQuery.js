import React, { Component } from "react";
import TextareaField from "../common/TextareaField";
import GreenButtonSmallFont from "../common/GreenButtonSmallFont";
import { submitQuery } from "./../../../store/actions/supportAction";
import { connect } from "react-redux";

class SettingsNewSubmitQuery extends Component {
  constructor() {
    super();
    this.state = {
      description: "",
    };
  }

  handleChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  };

  callBackAdd = (status) => {
    if (status === 200) {
      this.setState({
        description: "",
      });
    }
  };
  handleSubmit = () => {
    console.log(this.state);

    const formData = {
      description: this.state.description,
      attachments: [{}],
      additionalObject: {},
    };

    this.props.submitQuery(formData, this.callBackAdd);
  };

  render() {
    return (
      <>
        <h2 className="font-18-extraBold settings-content-title3 mb-25">
          Submit Your Query
        </h2>
        <div className="settings-content-new__card settings-content-new__card--submitQueryBlock">
          <TextareaField
            containerClassName="container-login-flow-textarea container-login-flow-textarea--settingQuery"
            name="description"
            value={this.state.description}
            onChange={this.handleChange}
            placeholder="Enter your query here! Our team will get back to you soon."
          />
          <div className="text-right">
            <GreenButtonSmallFont
              text="Post"
              onClick={this.handleSubmit}
              extraClassName="setting-submit-query-btn"
            />
          </div>
        </div>
      </>
    );
  }
}

export default connect(null, { submitQuery })(SettingsNewSubmitQuery);
