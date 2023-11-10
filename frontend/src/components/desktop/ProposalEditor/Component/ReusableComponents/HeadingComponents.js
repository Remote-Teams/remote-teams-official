import React, { useState } from "react";
import Modal from "react-bootstrap/Modal";
// import AddProposal from '../../../proposals/AddProposals';
const leadDummy = "";

const HeadingComponents = (props) => {
  return (
    <>
      <div className="heading_components_main_container">
        <div className="heading_components_main_container_proposal_name_container">
          <ProposalName {...props} />
        </div>
        <div className="d-flex">
          <div className="heading_components_main_container_go_back_container">
            <GoBackButton {...props} />
          </div>
          <div className="heading_components_main_container_save_and_download_button_container">
            <SaveAndDownloadButtons {...props} />
          </div>
        </div>
      </div>
    </>
  );
};

export default HeadingComponents;

export const GoBackButton = (props) => {
  const [gobackModal, gobackModalToggler] = useState(false);
  const gobackHandler = props.state.data.isPreviewOpen
    ? props.onPreviewPanelToggler(false)
    : () => gobackModalToggler(true);
  return (
    <>
      <button className="go_bacK_buttons" onClick={gobackHandler}>
        Go Back
      </button>
      <Modal
        className="proposals-modal-go-back"
        show={gobackModal}
        size="md"
        onHide={() => gobackModalToggler(false)}
        centered
      >
        <Modal.Body>
          <div className="go_back_modal_whole_container">
            <div className="go_back_modal__close_icon_container">
              <div
                className="go_back_modal__close_icon"
                onClick={() => gobackModalToggler(false)}
              >
                {props.closeicon}
              </div>
            </div>
            <div className="go_back_modal__message_container">
              <div className="go_back_modal__message_container_headline">
                Are you sure to go back ?
              </div>
              <div className="go_back_modal__message_container_text">
                Your all progress will be lost. Please save your progress.
              </div>
            </div>
            <div className="go_back_modal__button_container">
              <button onClick={() => props.history.push("/proposals")}>
                Yes
              </button>{" "}
              &emsp;
              <button onClick={() => gobackModalToggler(false)}>No</button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
};

export const ProposalName = (props) => {
  const [showProposalEditor, showProposalEditorHandler] = useState(false);
  let error = "";
  return (
    <>
      <div className="proposal_name_main_container">
        <div className="proposal_name_entry">
          {props.state.name ? props.state.name : "Untitled Proposal"}
        </div>
        &emsp;
        <div
          className="edit_icon_proposal_entry"
          onClick={() => showProposalEditorHandler(true)}
        >
          {props.editicon}
        </div>
      </div>
      <Modal
        show={showProposalEditor}
        size="md"
        onHide={() => showProposalEditorHandler(false)}
        centered
      >
        <Modal.Body>
          <div className="modal_main_container">
            <div className="modal__close_icon_container">
              <div
                className="modal__close_icon"
                onClick={() => showProposalEditorHandler(false)}
              >
                {props.closeicon}
              </div>
            </div>
            <div className="proposal_modal_container">
              <div className="proposal_modal_headline">proposal name</div>
              <div className="proposal_editor">
                <input
                  type="text"
                  name="name"
                  onChange={props.onChangeHandlerNormal}
                  value={props.state.name}
                  placeholder=""
                />
              </div>
              {error ? (
                <p className="error-message">{error}</p>
              ) : (
                <p className="error-message opacity-0">error</p>
              )}
              <div className="modal__button_container">
                <button onClick={() => showProposalEditorHandler(false)}>
                  Save
                </button>
              </div>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
};

export const SaveAndDownloadButtons = (props) => {
  const [openLeadList, leadListToggler] = useState(false);
  const [search, searchChangeHandler] = useState("");
  let allLeads = [];
  if (props.allLeads) {
    allLeads = props.allLeads;
  }
  const onSendClickHandler = !props.state.data.isPreviewOpen
    ? props.onPreviewPanelToggler(true)
    : props.onSendClickHandler;
  const onDownloadClickHandler = !props.state.data.isPreviewOpen
    ? props.onPreviewPanelToggler(true)
    : props.onDownloadClickHandler;
  return (
    <>
      <div className="save_and_download_button_container">
        {/* <AddProposal proposalInside={ true } onSendClickHandler={ props.onSendClickHandler }  /> &emsp; */}
        <button
          className="save_and_download_button_container__download"
          onClick={onDownloadClickHandler}
        >
          Download
        </button>
        {/* <button onClick={ () => leadListToggler(true) }>Save</button> */}
        <button onClick={onSendClickHandler}>Send</button>
      </div>
      <Modal
        show={openLeadList}
        size="xl"
        onHide={() => leadListToggler(false)}
        centered
      >
        <Modal.Body>
          <div className="modal_main_container">
            <div className="modal__close_icon_container">
              <div
                className="modal__close_icon"
                onClick={() => leadListToggler(false)}
              >
                {props.closeicon}
              </div>
            </div>
            <div className="lead_selection_modal_container">
              <div className="modal_headline">
                Select lead you want to send proposal to{" "}
              </div>
              <div className="search_lead_container">
                <input
                  type="text"
                  value={search}
                  onChange={(e) => searchChangeHandler(e.target.value)}
                  placeholder="Search lead by name, email and company initials. . ."
                />
              </div>
            </div>
            <div className="lead_list_area_main_container">
              <table>
                <tbody>
                  <tr>
                    <td className="table_indexing_container">#</td>
                    <td className="table_profile_pic_container">Profile</td>
                    <td className="table_name_container">Name</td>
                    <td className="table_email_container">Email</td>
                    <td className="table_company_container">Company</td>
                  </tr>
                  {allLeads.map((lead, index) => (
                    <tr key={index}>
                      <td className="table_indexing_container">{++index}</td>
                      <td className="table_profile_pic_container">
                        <div className="table_profile_pic">
                          <img src={leadDummy} alt="Pr" />
                        </div>
                      </td>
                      <td className="table_name_container">{lead.name}</td>
                      <td className="table_email_container">{lead.email}</td>
                      <td className="table_company_container">
                        {lead.company}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="modal__button_container">
              <button onClick={() => leadListToggler(false)}>Send</button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
};
