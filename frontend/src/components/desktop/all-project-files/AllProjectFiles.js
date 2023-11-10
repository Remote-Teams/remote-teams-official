import React, { Component } from "react";
import {
  Accordion,
  AccordionItem,
  AccordionItemHeading,
  AccordionItemButton,
  AccordionItemPanel,
} from "react-accessible-accordion";
import "react-accessible-accordion/dist/fancy-example.css";
import UploadMultipleFiles from "../common/UploadMultipleFiles";
import { connect } from "react-redux";
import {
  createFile,
  getAllFiles,
  deleteFileWithId,
} from "./../../../store/actions/projectAction";
import { fileUpload } from "./../../../store/actions/resourcesAction";
import isEmpty from "../../../store/validations/is-empty";

class AllProjectFiles extends Component {
  constructor() {
    super();
    this.state = {
      fileName: "",
      fileNameContracts: [],
      fileNameAttachments: [],
      fileNameReports: [],
      fileNameInvoices: [],
    };
  }

  componentDidMount() {
    this.props.getAllFiles();
  }

  static getDerivedStateFromProps(nextProps, nextState) {
    if (
      !isEmpty(nextProps.allFiles) &&
      nextProps.allFiles !== nextState.allFiles
    ) {
      let fileContracts = nextProps.allFiles.filter(
        (file) => file.type === "CONTRACT"
      );
      let fileAttachments = nextProps.allFiles.filter(
        (file) => file.type === "MISCELLANEOUS"
      );
      let fileReports = nextProps.allFiles.filter(
        (file) => file.type === "REPORTS"
      );
      let fileInvoices = nextProps.allFiles.filter(
        (file) => file.type === "INVOICE"
      );
      return {
        fileNameContracts: fileContracts,
        fileNameAttachments: fileAttachments,
        fileNameReports: fileReports,
        fileNameInvoices: fileInvoices,
      };
      // console.log(nextProps.allFiles);
    }
    return null;
  }

  /*============================================================
      renderContracts
  ============================================================*/

  callBackFileUploadContracts = (data) => {
    console.log(data);
    let projectData = JSON.parse(localStorage.getItem("projectData"));
    const formData = {
      name: this.state.fileName,
      file: data,
      project: projectData._id,
      category: "PROJECT",
      type: "CONTRACT",
    };
    // console.log(formData);
    this.props.createFile(formData);
  };

  handleOnChangeContract = (e) => {
    e.preventDefault();
    // let files = this.state.fileNameContracts;
    // files.push(e.target.files[0].name);
    this.setState({
      // fileNameContracts: files,
      fileName: e.target.files[0].name,
    });

    const data = new FormData();
    data.append("file", e.target.files[0]);

    this.props.fileUpload(data, this.callBackFileUploadContracts);
  };

  handleOnClickRemoveContract = (val) => (e) => {
    e.preventDefault();

    console.log(val);
    this.props.deleteFileWithId(val._id);

    // const { fileNameContracts } = this.state;
    // const filteredItems = fileNameContracts.filter((item) => item !== val);
    // this.setState({
    //   fileNameContracts: filteredItems,
    // });
  };

  renderContracts = () => {
    // console.log(this.state.fileNameContracts);
    return (
      <div className="row mx-0">
        <div className="col-6 p-0">
          <UploadMultipleFiles
            containerClassName="upload-img__mainBlock upload-img__mainBlock--project-file mb-0"
            //buttonName="+ New Doc"
            buttonName="+"
            fileNameValue={this.state.fileNameContracts}
            // acceptType="image/jpeg, image/png"
            onChange={this.handleOnChangeContract}
            handleOnClickRemoveDocument={this.handleOnClickRemoveContract}
          />
        </div>
      </div>
    );
  };

  /*============================================================
      renderAttachments
  ============================================================*/
  callBackFileUploadAttachments = (data) => {
    console.log(data);
    let projectData = JSON.parse(localStorage.getItem("projectData"));
    const formData = {
      name: this.state.fileName,
      file: data,
      project: projectData._id,
      type: "MISCELLANEOUS",
    };
    // console.log(formData);
    this.props.createFile(formData);
  };

  handleOnChangeAttachment = (e) => {
    e.preventDefault();
    // let files = this.state.fileNameAttachments;
    // files.push(e.target.files[0].name);
    this.setState({
      // fileNameContracts: files,
      fileName: e.target.files[0].name,
    });

    const data = new FormData();
    data.append("file", e.target.files[0]);

    this.props.fileUpload(data, this.callBackFileUploadAttachments);
  };

  handleOnClickRemoveAttachment = (val) => (e) => {
    e.preventDefault();
    // console.log(val);
    this.props.deleteFileWithId(val._id);
  };

  renderAttachments = () => {
    return (
      <div className="row mx-0">
        <div className="col-6 p-0">
          <UploadMultipleFiles
            containerClassName="upload-img__mainBlock upload-img__mainBlock--project-file mb-0"
            buttonName="+"
            fileNameValue={this.state.fileNameAttachments}
            // acceptType="image/jpeg, image/png"
            onChange={this.handleOnChangeAttachment}
            handleOnClickRemoveDocument={this.handleOnClickRemoveAttachment}
          />
        </div>
      </div>
    );
  };

  /*============================================================
      renderReports
  ============================================================*/
  callBackFileUploadReports = (data) => {
    console.log(data);
    let projectData = JSON.parse(localStorage.getItem("projectData"));
    const formData = {
      name: this.state.fileName,
      file: data,
      project: projectData._id,
      type: "REPORTS",
    };
    // console.log(formData);
    this.props.createFile(formData);
  };

  handleOnChangeReport = (e) => {
    e.preventDefault();
    // let files = this.state.fileNameReports;
    // files.push(e.target.files[0].name);
    this.setState({
      // fileNameContracts: files,
      fileName: e.target.files[0].name,
    });

    const data = new FormData();
    data.append("file", e.target.files[0]);

    this.props.fileUpload(data, this.callBackFileUploadReports);
  };

  handleOnClickRemoveReport = (val) => (e) => {
    e.preventDefault();
    // console.log(val);
    this.props.deleteFileWithId(val._id);
  };

  renderReports = () => {
    return (
      <div className="row mx-0">
        <div className="col-6 p-0">
          <UploadMultipleFiles
            containerClassName="upload-img__mainBlock upload-img__mainBlock--project-file mb-0"
            buttonName="+"
            fileNameValue={this.state.fileNameReports}
            // acceptType="image/jpeg, image/png"
            onChange={this.handleOnChangeReport}
            handleOnClickRemoveDocument={this.handleOnClickRemoveReport}
          />
        </div>
      </div>
    );
  };

  /*============================================================
      renderInvoices
  ============================================================*/
  callBackFileUploadInvoice = (data) => {
    console.log(data);
    let projectData = JSON.parse(localStorage.getItem("projectData"));
    const formData = {
      name: this.state.fileName,
      file: data,
      project: projectData._id,
      type: "INVOICE",
    };
    // console.log(formData);
    this.props.createFile(formData);
  };

  handleOnChangeInvoice = (e) => {
    e.preventDefault();
    // let files = this.state.fileNameInvoices;
    // files.push(e.target.files[0].name);
    this.setState({
      // fileNameContracts: files,
      fileName: e.target.files[0].name,
    });

    const data = new FormData();
    data.append("file", e.target.files[0]);

    this.props.fileUpload(data, this.callBackFileUploadInvoice);
  };

  handleOnClickRemoveInvoice = (val) => (e) => {
    e.preventDefault();
    // console.log(val);
    this.props.deleteFileWithId(val._id);
  };

  renderInvoices = () => {
    return (
      <div className="row mx-0">
        <div className="col-6 p-0">
          <UploadMultipleFiles
            containerClassName="upload-img__mainBlock upload-img__mainBlock--project-file mb-0"
            buttonName="+"
            fileNameValue={this.state.fileNameInvoices}
            // acceptType="image/jpeg, image/png"
            onChange={this.handleOnChangeInvoice}
            handleOnClickRemoveDocument={this.handleOnClickRemoveInvoice}
          />
        </div>
      </div>
    );
  };
  /*============================================================
      main
  ============================================================*/
  render() {
    return (
      <>
        <div className="file-accordion-div">
          <Accordion allowZeroExpanded={true}>
            <AccordionItem>
              <AccordionItemHeading>
                <AccordionItemButton>contracts</AccordionItemButton>
              </AccordionItemHeading>
              <AccordionItemPanel>{this.renderContracts()}</AccordionItemPanel>
            </AccordionItem>
            <AccordionItem>
              <AccordionItemHeading>
                <AccordionItemButton>attachments</AccordionItemButton>
              </AccordionItemHeading>
              <AccordionItemPanel>
                {this.renderAttachments()}
              </AccordionItemPanel>
            </AccordionItem>
            <AccordionItem>
              <AccordionItemHeading>
                <AccordionItemButton>reports</AccordionItemButton>
              </AccordionItemHeading>
              <AccordionItemPanel>{this.renderReports()}</AccordionItemPanel>
            </AccordionItem>
            <AccordionItem>
              <AccordionItemHeading>
                <AccordionItemButton>invoices</AccordionItemButton>
              </AccordionItemHeading>
              <AccordionItemPanel>{this.renderInvoices()}</AccordionItemPanel>
            </AccordionItem>
          </Accordion>
        </div>
      </>
    );
  }
}

const mapStateToProps = (state) => ({
  allFiles: state.projects.allFiles,
});

export default connect(mapStateToProps, {
  createFile,
  fileUpload,
  getAllFiles,
  deleteFileWithId,
})(AllProjectFiles);
