import React, { Component } from "react";
import ReactDOM from "react-dom";
import PDFLoader from "./ReusableComponents/PdfGeneratingBanner";
import HeadingComponent from "./ReusableComponents/HeadingComponents";
import SidePanelComponent from "./ReusableComponents/SidePanelComponent";
import TemplateViewComponent from "./ReusableComponents/TemplateViewComponent";
import PreviewPanel from "./ReusableComponents/PreviewComponent";
import TemplateEditorComponent from "./ReusableComponents/TemplateEditoComponent";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import Modal from "react-bootstrap/Modal";
import { url } from "../../../../store/actions/config";

// ERROR MODALS
import { NoTemplateSelected } from "./ReusableComponents/ErrorModals";

import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
// import { getAllActiveLeads } from "../../../../store/actions/leadAction";
import { normalImageUpload } from "../../../../store/actions/authAction";

// FRONTPAGE
import FP_TemplateOne from "./Templates/FrontPage/FP_TemplateOne";
import FP_TemplateTwo from "./Templates/FrontPage/FP_TemplateTwo";
import FP_TemplateThree from "./Templates/FrontPage/FP_TemplateThree";
//import FP_TemplateFour from "./Templates/FrontPage/FP_TemplateFour";
//import FP_TemplateFive from "./Templates/FrontPage/FP_TemplateFive";

// INTRODUCTION
import I_TemplateOne from "./Templates/Introduction/I_TemplateOne";
import I_TemplateTwo from "./Templates/Introduction/I_TemplateTwo";
//import I_TemplateThree from "./Templates/Introduction/_I_TemplateThree";
//import I_TemplateFour from "./Templates/Introduction/_I_TemplateFour";

// ABOUT US
import AU_TemplateOne from "./Templates/AboutUs/AU_TemplateOne";
import AU_TemplateTwo from "./Templates/AboutUs/AU_TemplateTwo";
//import AU_TemplateThree from "./Templates/AboutUs/AU_TemplateThree";
//import AU_Template_four from "./Templates/AboutUs/AU_TemplateFour";
//import AU_TemplateFive from "./Templates/AboutUs/AU_TemplateFive";

//OUR MISSION
import OM_TemplateOne from "./Templates/OurMission/OM_TemplateOne";
import OM_TemplateTwo from "./Templates/OurMission/OM_TemplateTwo";

//OUR PORTFOLIO
import OurPortfolio_TemplateTwo from "./Templates/OurPortfolio/OurPortfolio_TemplateTwo";
import OurPortfolio_TemplateOne from "./Templates/OurPortfolio/OurPortfolio_TemplateOne";

//OUR CLIENTS
import OurClient_TemplateOne from "./Templates/OurClients/OurClient_TemplateOne";
import OurClients_TemplateTwo from "./Templates/OurClients/OurClients_TemplateTwo";

// WHAT WE DO
import WWD_TemplateOne from "./Templates/WhatWeDo/WWD_TemplateOne";
import WWD_TemplateTwo from "./Templates/WhatWeDo/WWD_TemplateTwo";
//import WWD_TemplateThree from "./Templates/WhatWeDo/WWD_TemplateThree";
//import WWD_TemplateFour from "./Templates/WhatWeDo/WWD_TemplateFour";
//import WWD_TemplateFive from "./Templates/WhatWeDo/WWD_TemplateFive";

//OUR TEAM
import OurTeam_TemplateOne from "./Templates/OurTeam/OurTeam_TemplateOne";
import OurTeam_TemplateTwo from "./Templates/OurTeam/OurTeam_TemplateTwo";

//OUR PROCESS
import OurProcess_TemplateOne from "./Templates/OurProcess/OurProcess_TemplateOne";
import OurProcess_TemplateTwo from "./Templates/OurProcess/OurProcess_TemplateTwo";

//PROJECT DETAILS
import ProjectDetails_TemplateOne from "./Templates/ProjectDetails/ProjectDetails_TemplateOne";
import ProjectDetails_TemplateTwo from "./Templates/ProjectDetails/ProjectDetails_TemplateTwo";

//OUR CAPABILITIES
import OurCapabilities_TemplateOne from "./Templates/OurCapabilities/OurCapabilities_TemplateOne";
import OurCapabilities_TemplateTwo from "./Templates/OurCapabilities/OurCapabilities_TemplateTwo";

//OUR VISION
import OurVision_TemplateOne from "./Templates/OurVision/OurVision_TemplateOne";
import OurVision_TemplateTwo from "./Templates/OurVision/OurVision_TemplateTwo";

//OUR BUSINESS MODEL
import OBM_TemplateOne from "./Templates/OurBusinessModel/OBM_TemplateOne";
import OBM_TemplateTwo from "./Templates/OurBusinessModel/OBM_TemplateTwo";

//FA
import FA_TemplateOne from "./Templates/FinancialAnalysis/FA_TemplateOne";
import FA_TemplateTwo from "./Templates/FinancialAnalysis/FA_TemplateTwo";

//CONTACT US
import ContactUs_TemplateOne from "./Templates/ContactUs/ContactUs_TemplateOne";
import ContactUs_TemplateTwo from "./Templates/ContactUs/ContactUs_TemplateTwo";

// THANKS YOU
import TY_TemplateOne from "./Templates/ThankYou/TY_TemplateOne";
import TY_TemplateTwo from "./Templates/ThankYou/TY_TemplateTwo";

// ACTIONS
import {
  create_new_propsal,
  get_selected_proposal_data,
  update_proposal,
  save_new_propsal,
} from "../store/actions/proposalActions";
import store from "../../../../store/store";
import { SET_PROPOSAL_INITIAL_DATA, READ_PROPOSAL } from "../store/types";
import isEmpty from "../../../../store/validations/is-empty";
import SWOT_TemplateOne from "./Templates/SWOT/SWOT_TemplateOne";
import SWOT_TemplateTwo from "./Templates/SWOT/SWOT_TemplateTwo";
import Comparison_TemplateOne from "./Templates/Comparison/Comparison_TemplateOne";
import Comparison_TemplateTwo from "./Templates/Comparison/Comparison_TemplateTwo";

const template_config = [
  { name: "front_page_template_one", value: FP_TemplateOne },
  { name: "front_page_template_two", value: FP_TemplateTwo },
  { name: "front_page_template_three", value: FP_TemplateThree },
  /*{ name: "front_page_template_four", value: FP_TemplateFour },
  { name: "front_page_template_five", value: FP_TemplateFive },*/

  { name: "introduction_template_one", value: I_TemplateOne },
  { name: "introduction_template_two", value: I_TemplateTwo },
  /*{ name: "introduction_template_three", value: I_TemplateThree },
  { name: "introduction_template_four", value: I_TemplateFour },*/

  { name: "about_us_template_one", value: AU_TemplateOne },
  { name: "about_us_template_two", value: AU_TemplateTwo },
  /*{ name: "about_us_template_three", value: AU_TemplateThree },
  { name: "about_us_template_four", value: AU_Template_four },
  { name: "about_us_template_five", value: AU_TemplateFive },*/

  { name: "om_template_one", value: OM_TemplateOne },
  { name: "om_template_two", value: OM_TemplateTwo },

  { name: "our_protfolio_template_one", value: OurPortfolio_TemplateOne },
  { name: "our_protfolio_template_two", value: OurPortfolio_TemplateTwo },

  { name: "our_clients_template_one", value: OurClient_TemplateOne },
  { name: "our_clients_template_two", value: OurClients_TemplateTwo },

  { name: "what_we_do_template_one", value: WWD_TemplateOne },
  { name: "what_we_do_template_two", value: WWD_TemplateTwo },
  /*{ name: "what_we_do_template_three", value: WWD_TemplateThree },
  { name: "what_we_do_template_four", value: WWD_TemplateFour },
  { name: "what_we_do_template_five", value: WWD_TemplateFive },*/

  { name: "our_team_template_one", value: OurTeam_TemplateOne },
  { name: "our_team_template_two", value: OurTeam_TemplateTwo },

  { name: "our_process_template_one", value: OurProcess_TemplateOne },
  { name: "our_process_template_two", value: OurProcess_TemplateTwo },

  { name: "project_details_one", value: ProjectDetails_TemplateOne },
  { name: "project_details_two", value: ProjectDetails_TemplateTwo },

  { name: "our_capabilities_template_one", value: OurCapabilities_TemplateOne },
  { name: "our_capabilities_template_two", value: OurCapabilities_TemplateTwo },

  { name: "our_vision_template_one", value: OurVision_TemplateOne },
  { name: "our_vision_template_two", value: OurVision_TemplateTwo },

  { name: "obm_template_one", value: OBM_TemplateOne },
  { name: "obm_template_two", value: OBM_TemplateTwo },

  { name: "fa_template_one", value: FA_TemplateOne },
  { name: "fa_template_two", value: FA_TemplateTwo },

  { name: "contact_us_template_one", value: ContactUs_TemplateOne },
  { name: "contact_us_template_two", value: ContactUs_TemplateTwo },

  { name: "swot_template_one", value: SWOT_TemplateOne },
  { name: "swot_template_two", value: SWOT_TemplateTwo },

  { name: "comparison_template_one", value: Comparison_TemplateOne },
  { name: "comparison_template_two", value: Comparison_TemplateTwo },

  { name: "thank_you_one", value: TY_TemplateOne },
  { name: "thank_you_two", value: TY_TemplateTwo },
];

export class ProposalMainEditorPanel extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "Untitiled Proposal",
      description: "Proposal Descrition",
      status: "DRAFT",
      entityType: "LEAD", // LEAD or CUSTOMER
      entityId: "", //LEAD ID,
      attachment: "", // GENERATED PDF LINK,
      // ALL PROPOSAL DATA
      data: {
        allselectedTemplates: [],
        selectedTemplateCurrentIndex: 0,
        isEditOpen: false,
        isPreviewOpen: false,
        isDownloading: false,
      },
      generatingPDF: false, //
    };
  }

  /************************************************
   * @DESC - LIFE CYCLE METHODDS
   ************************************************/
  componentDidMount() {
    // this.props.getAllActiveLeads({query: {}});
    if (this.props.match.params.id) {
      this.props.get_selected_proposal_data(this.props.match.params.id);
    }
    if (localStorage.proposalData) {
      let data = JSON.parse(localStorage.getItem("proposalData"));
      store.dispatch({
        type: SET_PROPOSAL_INITIAL_DATA,
        payload: {
          proposalTitle: data.proposalTitle,
          selectedLeadData: data.selectedLeadData,
        },
      });
      this.setState({
        name: data.proposalTitle,
      });
    }
  }

  static getDerivedStateFromProps(nextProps, nextState) {
    if (
      !isEmpty(nextProps.proposals) &&
      nextProps.proposals.proposalData.selected_proposal_data._id &&
      nextProps.match.params.id &&
      !nextState.hasNotSetData
    ) {
      console.log("Setting old Data reload");
      if (
        nextProps.proposals.proposalData.selected_proposal_data._id !==
        nextState._id
      ) {
        return {
          ...nextProps.proposals.proposalData.selected_proposal_data,
          hasNotSetData: true,
        };
      }
    }
    return null;
  }

  componentWillUnmount() {
    store.dispatch({
      type: READ_PROPOSAL,
      payload: {},
    });
    localStorage.removeItem("proposalData");
  }

  /************************************************
   * @DESC - ONCHANGEHANDLER - NORMAL ONE
   ************************************************/
  onChangeHandlerNormal = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  };
  /************************************
   * @DESC - ON SAVE CLICK HANDLER
   ***********************************/
  onSendClickHandler = async (e) => {
    const data = this.state.data;
    if (data.isPreviewOpen === false) {
      alert("Please go to preview panel first");
    } else if (data.allselectedTemplates.length === 0) {
      ReactDOM.render(
        <NoTemplateSelected />,
        document.getElementById("error_message")
      );
    } else {
      this.setState({ generatingPDF: true });
      let pdffile = await this.onPdfGenerator();
      if (pdffile !== null) {
        var pdf = pdffile.output("blob");
        let formData = new FormData();
        formData.append("file", pdf, "Proposal.pdf");
        let { success, imageResponse } = await normalImageUpload(formData);
        if (success) {
          let jsonData = this.state;
          jsonData.status = "SENT";
          jsonData.name = this.props.proposals.createProposal.proposalTitle;
          jsonData.data.leadinformation = this.props.proposals.createProposal.leadInformation;
          jsonData.attachment = `${url}${imageResponse.fileUrlPath}`;
          jsonData.entityId = this.props.proposals.createProposal.leadInformation._id;

          // console.log(jsonData);
          this.props.create_new_propsal(jsonData);
        }
      }
      this.setState({ generatingPDF: false });
    }
  };
  onSaveDraftHandler = (e) => {
    const data = this.state.data;
    if (data.allselectedTemplates.length === 0) {
      ReactDOM.render(
        <NoTemplateSelected />,
        document.getElementById("error_message")
      );
    } else {
      if (this.state._id === "" || this.state._id === undefined) {
        this.setState({ generatingPDF: true });
        let jsonData = this.state;
        jsonData.status = "DRAFT";
        jsonData.name = this.props.proposals.createProposal.proposalTitle;
        jsonData.data.leadinformation = this.props.proposals.createProposal.leadInformation;
        jsonData.entityId = this.props.proposals.createProposal.leadInformation._id;
        this.props.save_new_propsal(jsonData);
        this.setState({ generatingPDF: false });
      } else {
        this.setState({ generatingPDF: true });
        let jsonData = this.state;
        jsonData.status = "DRAFT";
        jsonData.name = this.props.proposals.createProposal.proposalTitle;
        jsonData.data.leadinformation = this.props.proposals.createProposal.leadInformation;
        jsonData.entityId = this.props.proposals.createProposal.leadInformation._id;
        this.props.update_proposal(jsonData, this.state._id);
        this.setState({ generatingPDF: false });
      }
    }
  };

  onDownloadClickHandler = async (e) => {
    const data = this.state.data;
    if (data.isPreviewOpen === false) {
      alert("Preview your proposal, then click on download");
    } else if (data.allselectedTemplates.length === 0) {
      ReactDOM.render(
        <NoTemplateSelected />,
        document.getElementById("error_message")
      );
    } else {
      this.setState({ generatingPDF: true });
      let docData = await this.onPdfGenerator();
      if (docData !== null) {
        docData.save("Proposal.pdf");
      }
      this.setState({ generatingPDF: false });
    }
  };

  /******************************************************
   * @DESC - TEMPLATE SELECT HANDLER
   * @DESC - ALL HANDLERS
   ******************************************************/
  onClickSelectTemplateHandler = (template) => (e) => {
    const data = this.state.data;
    data.allselectedTemplates.push(JSON.parse(JSON.stringify(template)));
    this.setState({ data: data });
  };
  onClickselectedTemplateCurrentIndex = (index) => (e) => {
    const data = this.state.data;
    data.selectedTemplateCurrentIndex = index;
    this.setState({ data: data });
  };
  onDeleteSelectedTemplateCurrentIndex = (index) => (e) => {
    const data = this.state.data;
    data.allselectedTemplates.splice(index, 1);
    this.setState({ data: data });
  };
  onTemplateItemChange = (name, index, value) => (e) => {
    const data = this.state.data;
    data.allselectedTemplates[index][name] = value;
    this.setState({ data: data });
  };
  onTemplateItemChangeWithoutEvent = (name, index, value) => {
    const data = this.state.data;
    data.allselectedTemplates[index][name] = value;
    this.setState({ data: data });
  };
  onTemplateEditorChangeHandler = (name, index) => (e) => {
    const data = this.state.data;
    data.allselectedTemplates[index][name] = e.editor.getData();
    this.setState({ data: data });
  };
  /******************************************************
   * @DESC - PANE CHANGERS
   * @DESC - TWO HANDLERS
   ******************************************************/
  onEditPanelToggler = (value) => (e) => {
    const data = this.state.data;
    data.isEditOpen = value;
    this.setState({ data: data });
  };
  onPreviewPanelToggler = (value) => (e) => {
    const data = this.state.data;
    data.isPreviewOpen = value;
    this.setState({ data: data });
  };

  /*********************************************************
   * @DESC - PDF DOWNLOADER HANDLERS
   *********************************************************/
  onPdfGenerator = async (e) => {
    let all_templates = this.state.data.allselectedTemplates;
    if (all_templates.length !== 0) {
      const input = document.getElementById(all_templates[0].id);
      let canvas = await html2canvas(input, { scale: 2 });
      // const imageData = canvas.toDataURL('image/png', 0);
      const imageData = canvas.toDataURL({
        format: "jpeg",
        quality: 0.1,
      });
      const docOne = new jsPDF("l", "px", [540, 300], { compress: true });
      const widthOne = docOne.internal.pageSize.getWidth();
      const heightOne = docOne.internal.pageSize.getHeight();
      docOne.addImage(
        imageData,
        "JPEG",
        0,
        0,
        widthOne,
        heightOne,
        undefined,
        "SLOW"
      );

      // IF MORE THAN ONE TEMPLATE
      if (all_templates.length > 1) {
        let i = 1;
        while (i < all_templates.length) {
          const input_var = document.getElementById(all_templates[i].id);
          let canvas_var = await html2canvas(input_var, { scale: 2 });
          // const imgDataOne_var = canvas_var.toDataURL('image/png',0);
          const imgDataOne_var = canvas_var.toDataURL({
            format: "jpeg",
            quality: 0.1,
          });
          const doc_var = new jsPDF("l", "px", [540, 300], { compress: true });
          const width_Var = doc_var.internal.pageSize.getWidth();
          const height_Var = doc_var.internal.pageSize.getHeight();
          docOne.addPage();
          docOne.addImage(
            imgDataOne_var,
            "JPEG",
            0,
            0,
            width_Var,
            height_Var,
            undefined,
            "SLOW"
          );
          i++;
        }
      }
      return docOne;
    } else {
      return null;
    }
  };

  /***********************************************
   * @DESC - ALL CONFIG DATA USED IN THIS PROPOSAL
   ***********************************************/
  config = {
    ...this.props,
    template_config: template_config,
    onChangeHandlerNormal: this.onChangeHandlerNormal,
    closeicon: <i className="fa fa-times fa-lg" aria-hidden="true"></i>,
    lefticon: <i className="fa fa-arrow-left fa-lg" aria-hidden="true"></i>,
    deleteicon: <i className="fa fa-trash fa-lg" aria-hidden="true"></i>,
    maximizeicon: (
      <i className="fa fa-window-maximize fa-lg" aria-hidden="true"></i>
    ),
    editicon: <i className="fa fa-pencil fa-lg" aria-hidden="true"></i>,
    saveicon: <i className="fa fa-floppy-o fa-lg" aria-hidden="true"></i>,
    previewicon: <i className="fa fa-eye fa-lg" aria-hidden="true"></i>,
    sendicon: <i className="fa fa-paper-plane fa-lg" aria-hidden="true"></i>,
    optionicon: <i className="fa fa-cogs fa-lg" aria-hidden="true"></i>,
    onEditPanelToggler: this.onEditPanelToggler,
    onPreviewPanelToggler: this.onPreviewPanelToggler,
    onClickSelectTemplateHandler: this.onClickSelectTemplateHandler,
    onClickselectedTemplateCurrentIndex: this
      .onClickselectedTemplateCurrentIndex,
    onDeleteSelectedTemplateCurrentIndex: this
      .onDeleteSelectedTemplateCurrentIndex,
    onTemplateItemChange: this.onTemplateItemChange,
    onTemplateItemChangeWithoutEvent: this.onTemplateItemChangeWithoutEvent,
    onTemplateEditorChangeHandler: this.onTemplateEditorChangeHandler,
    onSendClickHandler: this.onSendClickHandler,
    onSaveDraftHandler: this.onSaveDraftHandler,
    onDownloadClickHandler: this.onDownloadClickHandler,
  };
  render() {
    // console.log( this.state );
    // console.log( this.props.proposals.createProposal.leadInformation._id );
    this.config.state = this.state;
    return (
      <>
        {this.state.generatingPDF ? <PDFLoader /> : null}
        <div id={"error_message"} className="error_message"></div>
        <div className="proposal_main_editor_panel_main_container_view">
          <HeadingComponent {...this.config} {...this.props} />
          <div className="proposal_main_editor_panel_bottom_view">
            {!this.state.data.isPreviewOpen ? (
              <>
                <SidePanelComponent {...this.config} {...this.props} />
                <WorkingArea {...this.config} {...this.props} />
              </>
            ) : (
              <PreviewPanel {...this.config} {...this.props} />
            )}
          </div>
        </div>
      </>
    );
  }
}

const mapStateToProps = (state) => ({
  proposals: state.proposals,
  // allLeads: state.leads.activeLeads,
});

export default connect(mapStateToProps, {
  // getAllActiveLeads,
  create_new_propsal,
  get_selected_proposal_data,
  update_proposal,
  save_new_propsal,
})(withRouter(ProposalMainEditorPanel));

export const WorkingArea = (props) => {
  return (
    <div className="working_area_main_container">
      {!props.state.data.isEditOpen ? (
        <TemplateViewComponent {...props} />
      ) : (
        <TemplateEditorComponent {...props} />
      )}
    </div>
  );
};
