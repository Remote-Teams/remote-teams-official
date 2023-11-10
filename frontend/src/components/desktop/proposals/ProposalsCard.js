import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import Loader from "react-loader-spinner";
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
// api
import isEmpty from "../../../store/validations/is-empty";
import { connect } from "react-redux";
import { delete_proposal_data } from "../../../components/desktop/ProposalEditor/store/actions/proposalActions";

export class ProposalsCard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoadingImage: true,
      src: this.props.proposalData.data.allselectedTemplates[0].thumbnail,
    };
  }

  /*============================================================
      handlers
  ============================================================*/
  handleOnClickEditteIcon = (dataEdit) => (e) => {
    let proposalTitle = dataEdit.name;
    let selectedLeadData = dataEdit.data.leadinformation;
    localStorage.setItem(
      "proposalData",
      JSON.stringify({ proposalTitle, selectedLeadData })
    );
    this.setState({
      redirect: true,
      redirectLink: `/proposal-editor/${dataEdit._id}`,
    });
  };

  handleOnClickDeleteIcon = (id) => (e) => {
    this.props.delete_proposal_data(id);
  };

  handleOnCardImageLoad = (e) => {
    this.setState({
      isLoadingImage: false,
    });
  };

  handleOnErrorCardImage = (e) => {
    this.setState({
      src: require("../../../assets/img/proposals/dummy-proposal-card-thumbnail.png"),
    });
  };

  /*============================================================
      main
  ============================================================*/
  render() {
    let { isLoadingImage, src, redirect, redirectLink } = this.state;
    const { proposalData } = this.props;
    return (
      <>
        {redirect && <Redirect to={redirectLink} />}
        <div className="proposals-card-main-container">
          <div className="proposals-card-main-container__row1 row mx-0 align-items-center justify-content-center">
            {isLoadingImage && (
              <div className="proposal-card-image-loade-div">
                <Loader
                  type="ThreeDots"
                  color="rgba(255,255,255,.18)"
                  height={50}
                  width={50}
                />
              </div>
            )}
            <img
              src={src}
              alt="proposal"
              className={
                isLoadingImage
                  ? "proposal-card-img-transition"
                  : "proposal-card-img-transition-active"
              }
              onLoad={this.handleOnCardImageLoad}
              onError={this.handleOnErrorCardImage}
            />
          </div>
          <div className="proposals-card-main-container__row2__overflow">
            <div className="proposals-card-main-container__row2">
              <h3 className="proposals-card-main-container__row2__text1">
                {proposalData.name}
              </h3>
              <p className="proposals-card-main-container__row2__text2">
                {!isEmpty(proposalData.data.leadinformation) &&
                  proposalData.data.leadinformation.primaryContactPerson.email}
              </p>
              <p className="proposals-card-main-container__row2__text2 proposals-card-main-container__row2__text2--status">
                {proposalData.status}
              </p>
              <div className="row mx-0 align-items-start proposals-card-main-container__icons-row">
                {proposalData.status !== "SENT" && (
                  <i
                    className="fa fa-pencil proposals-card-icons-row_delete-icon"
                    onClick={this.handleOnClickEditteIcon(proposalData)}
                  ></i>
                )}
                {!isEmpty(proposalData.attachment) && (
                  <a
                    href={
                      proposalData.attachment +
                      `&token=${
                        JSON.parse(localStorage.getItem("UserData")).token
                      }`
                    }
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    <img
                      src={require("../../../assets/img/icons/export-icon.svg")}
                      alt="export"
                      className="proposals-card-icons-row_export-icon"
                    />
                  </a>
                )}
                <i
                  className="fa fa-trash proposals-card-icons-row_delete-icon ml-30 "
                  onClick={this.handleOnClickDeleteIcon(proposalData._id)}
                ></i>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }
}

export default connect(null, {
  delete_proposal_data,
})(ProposalsCard);
