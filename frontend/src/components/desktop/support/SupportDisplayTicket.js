import React, { Component } from "react";
import PageTitle from "../common/PageTitle";
import GrayLinkSmallFont from "../common/GrayLinkSmallFont";
import * as moment from "moment";
import { url } from "../../../store/actions/config";
import UploadMultipleFilesListDisplay from "../common/UploadMultipleFilesListDisplay";

class SupportDisplayTicket extends Component {
  /*=================================================================
        renderListOfDocumentsAttached
  =================================================================*/
  handleOnClickDocumentName = (data) => (e) => {
    let dataToken = JSON.parse(localStorage.getItem("UserData"));
    return window.open(
      `${url}${data.fileUrlPath}&token=${dataToken.token}`,
      "_blank"
    );
  };

  renderListOfDocumentsAttached = (ticketData) => {
    return (
      <>
        <UploadMultipleFilesListDisplay
          dataDocuments={ticketData.attachments}
          handleOnClickDocumentName={this.handleOnClickDocumentName}
        />
      </>
    );
  };

  /*=================================================================
        main
  =================================================================*/
  render() {
    const { ticketData, optionsAssignToDropdown } = this.props.location.state;
    let clientNameObj = optionsAssignToDropdown.filter(
      (a) => a.label === ticketData.assignedTo.name
    );
    const ticketNum = moment().unix();
    const pagetitleText = "Ticket " + ticketNum;
    return (
      <div className="new-ticket-btn">
        <div className="pageTitle-topNavbar-div">
          <PageTitle title={pagetitleText} shadow="ticket" />
          <GrayLinkSmallFont path="/support" text="Go Back" />
        </div>
        <div className="row mx-0 newTicket-row1">
          <div className="col-4 px-0">
            <h3 className="font-18-bold-space-light-uppercase mb-20">
              Subject
            </h3>
            <p className="font-18-semiBold text-capitalize">
              {ticketData.subject}
            </p>
          </div>
          <div className="col-4 px-0">
            <h3 className="font-18-bold-space-light-uppercase mb-20">
              assign to
            </h3>
            <p className="font-18-semiBold text-capitalize">
              {clientNameObj[0].label}
            </p>
          </div>
          <div className="col-4 px-0">
            <h3 className="font-18-bold-space-light-uppercase mb-20">
              project name
            </h3>
            <p className="font-18-semiBold">Project 1</p>
          </div>
        </div>
        {/* row 2 */}
        <div className="row mx-0 newTicket-row2">
          <div className="col-4 px-0">
            <h3 className="font-18-bold-space-light-uppercase mb-20">
              Raised By
            </h3>
            <p className="font-18-semiBold text-capitalize">
              {ticketData.raisedBy.name}
            </p>
          </div>
          <div className="col-4 px-0">
            <h3 className="font-18-bold-space-light-uppercase mb-20">
              Priority
            </h3>
            <p className="font-18-semiBold">{ticketData.priority}</p>
          </div>
          <div className="col-4 px-0">
            <h3 className="font-18-bold-space-light-uppercase mb-20">type</h3>
            <p className="font-18-semiBold">{ticketData.type}</p>
          </div>
        </div>

        {/* row 3 */}
        <div className="row mx-0 newTicket-row3">
          <div className="col-7 px-0">
            <h3 className="font-18-bold-space-light-uppercase mb-20">
              Description/Solution/Remarks
            </h3>
            <p className="font-18-semiBold">{ticketData.description}</p>
          </div>
          <div className="col-4 px-0">
            <h3 className="font-18-bold-space-light-uppercase mb-20">
              attached document
            </h3>
            {this.renderListOfDocumentsAttached(ticketData)}
          </div>
        </div>

        {/* <div className="add-ticket-btn">
          <GreenButtonSmallFont
            text="Mark as Closed"
            onClick={this.handleOnClickMarkButton}
          />
        </div> */}
      </div>
    );
  }
}

export default SupportDisplayTicket;
