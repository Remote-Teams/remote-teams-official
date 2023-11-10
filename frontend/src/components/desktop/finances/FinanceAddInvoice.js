import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import Select from "react-select";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import PageTitle from "../common/PageTitle";
import GrayLinkSmallFont from "../common/GrayLinkSmallFont";
import InputFieldEmailTextPassword from "../common/InputFieldEmailTextPassword";
import GrayButtonSmallFont from "../common/GrayButtonSmallFont";
import TextareaField from "../common/TextareaField";
import GreenButtonSmallFont from "../common/GreenButtonSmallFont";
import UploadMultipleFiles from "../common/UploadMultipleFiles";
import InputFieldNumber from "../common/InputFieldNumber";
import isEmpty from "../../../store/validations/is-empty";
import { fileUpload } from "./../../../store/actions/resourcesAction";
import { connect } from "react-redux";
import { createInvoice } from "./../../../store/actions/financeAction";
import * as moment from "moment";
import { getAllProjectAction } from "./../../../store/actions/projectAction";
import { validateAddInvoice } from "./../../../store/validations/financeValidation/addInvoiceValidation";

// const optionsClient = [
//   { value: "Annaa", label: "Annaa" },
//   { value: "John", label: "John" },
//   { value: "Paul", label: "Paul" },
// ];

// const optionsProject = [
//   { value: "Project 1", label: "Project 1" },
//   { value: "Project 2", label: "Project 2" },
//   { value: "Project 3", label: "Project 3" },
// ];

class FinanceAddInvoice extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // renderRow1
      selectOption: "",
      clientName: "",
      clientId: "",
      clientEmail: "",
      dueDate: new Date(),
      billingAddress: "",
      // renderTable
      billItems: [
        {
          title: "SSD",
          projectName: "",
          qty: "1",
          rate: "0",
          tax: "0",
          amount: "0",
        },
      ],
      // renderAdditionalNotesRow
      additionalNotes: "",
      // renderMultipleFilesRow
      fileName: [],
      fileData: [],
      invoiceNum: "",
      optionsClient: [],
      optionsProject: [],
      errors: {},
    };
  }

  /*=================================================================
      lifecycle methods
  =================================================================*/
  componentDidMount() {
    console.log(this.props.location.state);
    const { allClients } = this.props.location.state;
    this.props.getAllProjectAction();
    this.setInvoiceNumber();
    if (!isEmpty(allClients)) {
      this.setDropdownOption();
    }
  }

  static getDerivedStateFromProps(nextProps, nextState) {
    if (
      !isEmpty(nextProps.allProjects) &&
      nextProps.allProjects !== nextState.allProjects
    ) {
      let newArray =
        !isEmpty(nextProps.allProjects) &&
        nextProps.allProjects.map((project) => ({
          value: project._id,
          label: project.name,
        }));
      return {
        optionsProject: newArray,
      };
    }
    return null;
  }

  setInvoiceNumber = () => {
    var inv_no = `INV` + moment().unix();
    console.log(inv_no);
    this.setState({
      invoiceNum: inv_no,
    });
  };

  setDropdownOption = () => {
    const { allClients } = this.props.location.state;
    let allClientsData = allClients;
    let newArray =
      !isEmpty(allClients) &&
      allClients.map((client) => ({
        value: client._id,
        label: client.name,
      }));
    this.setState({
      allClients: allClients,
      optionsClient: newArray,
    });
  };

  /*=================================================================
      handlers
  =================================================================*/
  handleChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
      errors: {},
    });
  };

  handleChangeDueDate = (date) => {
    if (date === null) {
      this.setState({
        dueDate: new Date(),
      });
    } else {
      this.setState({
        dueDate: date,
      });
    }
  };

  handleChangeSelectClientName = (selectedOption) => {
    let allClients = this.state.allClients;
    console.log(allClients);
    let selectedClientMailId =
      !isEmpty(allClients) &&
      allClients.filter((client) => client._id === selectedOption.value);
    console.log(selectedClientMailId);

    let isBillingAdress =
      selectedClientMailId[0].addresses.billing_line_one === "" &&
      selectedClientMailId[0].addresses.shipping_line_one === ""
        ? false
        : true;

    this.setState({
      errors: {},
      selectOption: selectedOption,
      clientName: selectedOption.label,
      clientId: selectedOption.value,
      clientEmail: selectedClientMailId[0].primaryContactPerson.email,
      billingAddress: isBillingAdress
        ? selectedClientMailId[0].addresses.billing_line_one +
          "," +
          selectedClientMailId[0].addresses.shipping_line_one
        : "",
    });

    // console.log(selectedOption);
  };

  handleOnClickAdd = (status) => (e) => {
    console.log(this.state);
    const { billItems, fileData } = this.state;

    //calculate subtotal Amount
    let subTotalAmount = 0;
    subTotalAmount = this.calculateSubtotal();
    //calculate total tax amount
    let subTotalTaxAmount = 0;
    subTotalTaxAmount = this.calculateSubtotalTax();
    // calculate total amount
    let totalAmount = 0;
    totalAmount = this.calculateTotal();

    let finalItemArray = [];
    if (!isEmpty(billItems)) {
      billItems.map((item) => {
        finalItemArray.push({
          title: item.title,
          description: item.projectName.label,
          quantity: item.qty,
          rate: item.rate,
          tax: item.tax,
          amount: item.amount,
        });
      });
    }
    // console.log(finalItemArray);

    const { errors, isValid } = validateAddInvoice(this.state);

    if (!isValid) {
      this.setState({
        errors: errors,
      });
    } else {
      const formData = {
        invoice_number: this.state.invoiceNum,
        client: this.state.clientId,
        due_date: this.state.dueDate.toISOString(),
        items: [finalItemArray],
        notes: this.state.additionalNotes,
        subTotal: subTotalAmount,
        totalTax: subTotalTaxAmount,
        total: totalAmount,
        documents: fileData,
        status: status,
        email: this.state.clientEmail,
      };
      this.props.createInvoice(formData, this.props.history);
    }
  };
  /*=================================================================
      renderRow1
  =================================================================*/
  renderRow1 = () => {
    const { errors } = this.state;
    return (
      <>
        <div className="row mx-0 align-items-start mb-30">
          <div className="col-3 pt-20">
            {/*<h3 className="font-18-bold-space-light-uppercase mb-20 mr-30">
              Client Name
    </h3>*/}
            <div>
              <Select
                className="react-select-container react-select-container--addMember"
                classNamePrefix="react-select-elements"
                value={this.state.selectOption}
                onChange={this.handleChangeSelectClientName}
                options={this.state.optionsClient}
                placeholder="Client Name"
                isSearchable={false}
              />
              {!isEmpty(errors.clientId) && (
                <p className="error-message">{errors.clientId}</p>
              )}
            </div>
          </div>
          <div className="col-3">
            <InputFieldEmailTextPassword
              containerClassName="container-login-flow-input container-login-flow-input--forms mt-20"
              //label="client mail address"
              name="clientEmail"
              value={this.state.clientEmail}
              onChange={this.handleChange}
              type="email"
              placeholder="client mail address"
              error={!isEmpty(errors.clientEmail) && errors.clientEmail}
            />
          </div>
          <div className="col-3 pt-20">
            <div className="date-picker-common">
              {/*<h3 className="font-18-bold-space-light-uppercase mb-20 mr-30">
                due date
  </h3>*/}
              <DatePicker
                minDate={new Date()}
                selected={this.state.dueDate}
                onChange={this.handleChangeDueDate}
                placeholderText="due date"
              />
            </div>
          </div>
          <div className="col-2 text-center">
            {/**font-18-bold-space-light-uppercase */}
            <h3 className="add-invoice-id-text  mr-30">invoice ID</h3>
            {/**font-32-extraBold-letterspace-6-4 */}
            <p className="add-invoice-number-text">{this.state.invoiceNum}</p>
          </div>
        </div>
        <div className="row mx-0 mb-30">
          <div className="col-6">
            <TextareaField
              containerClassName="container-login-flow-textarea container-login-flow-textarea--addInvoice"
              //label="Billing address"
              placeholder="Billing address"
              name="billingAddress"
              value={this.state.billingAddress}
              onChange={this.handleChange}
              error={!isEmpty(errors.billingAddress) && errors.billingAddress}
            />
          </div>
        </div>
      </>
    );
  };

  /*============================================================
      renderTable
  ============================================================*/
  // table handlers

  handleChangeTable = (index) => (e) => {
    let billItems = this.state.billItems;
    if (e.target.name === "title") {
      billItems[index]["title"] = e.target.value;
      this.setState({ billItems });
    }
  };

  handleChangeSelectProjectNameTable = (index) => (selectedOption) => {
    let billItems = this.state.billItems;
    console.log(selectedOption);

    billItems[index]["projectName"] = selectedOption;
    this.setState({ billItems });
  };

  generateAmount = (index) => {
    const { billItems } = this.state;
    // let totalAmount = "0";
    let qty = billItems[index].qty;
    let rate = billItems[index].rate;
    let tax = billItems[index].tax;
    let amount = qty * rate;
    // if amount require with tax calculation
    // if (isEmpty(tax)) {
    //   totalAmount = amount;
    // } else {
    //   totalAmount = amount + (tax * amount) / 100;
    // }

    return amount;
  };

  handleChangeNumberTable = (index) => (e) => {
    let billItems = this.state.billItems;

    if (e.target.name === "qty") {
      billItems[index]["qty"] = e.target.validity.valid ? e.target.value : "1";
      this.setState({ billItems });
    } else if (e.target.name === "rate") {
      billItems[index]["rate"] = e.target.validity.valid ? e.target.value : "0";
      this.setState({ billItems });
    } else if (e.target.name === "tax") {
      billItems[index]["tax"] = e.target.validity.valid ? e.target.value : "0";
      this.setState({ billItems });
    }

    if (
      !isEmpty(billItems[index]["qty"]) ||
      !isEmpty(billItems[index]["rate"])
    ) {
      billItems[index]["amount"] = this.generateAmount(index);
      this.setState({ billItems });
    }
  };

  handleOnClickRemoveTableRow = (index) => (e) => {
    let allBillingItem = this.state.billItems;
    allBillingItem.splice(index, 1);
    this.setState({
      billItems: allBillingItem,
    });
  };

  handleOnClickAddNewRow = () => {
    let allBillingItem = this.state.billItems;
    allBillingItem.push({
      title: "",
      projectName: "",
      qty: "1",
      rate: "0",
      tax: "0",
      amount: "0",
    });
    this.setState({
      billItems: allBillingItem,
    });
  };

  // renderTable
  renderTable = () => {
    const { billItems } = this.state;
    return (
      <>
        {/* heading row */}
        <div className="finances-table-thead">
          <table className="finances-table finances-table--addInvoice">
            <thead>
              <tr>
                <th>
                  <span>Sr.</span>
                </th>
                <th>
                  <span>Title</span>
                </th>
                <th>
                  <span>Project Name</span>
                </th>
                <th>
                  <span>Qty</span>
                </th>
                <th>
                  <span>
                    rate <br /> ($)
                  </span>
                </th>
                <th>
                  <span>
                    amount <br />
                    ($)
                  </span>
                </th>
                <th>
                  <span>
                    Tax <br />
                    (%)
                  </span>
                </th>
                <th>
                  <span className="opacity-0">0</span>
                </th>
              </tr>
            </thead>
          </table>
        </div>
        {/* content row */}
        <div className="finances-table-tbody finances-table-tbody--addExpense mb-30">
          <table className="finances-table finances-table--addInvoice">
            <tbody>
              {billItems.map((data, index) => (
                <tr key={index}>
                  <td>
                    <span>{index + 1}</span>
                  </td>
                  <td>
                    <InputFieldEmailTextPassword
                      containerClassName="container-login-flow-input container-login-flow-input--addExpense-title"
                      name="title"
                      value={data.title}
                      onChange={this.handleChangeTable(index)}
                      type="text"
                    />
                  </td>
                  <td>
                    <Select
                      className="react-select-container react-select-container--addMember"
                      classNamePrefix="react-select-elements"
                      value={this.state.projectName}
                      onChange={this.handleChangeSelectProjectNameTable(index)}
                      options={this.state.optionsProject}
                      placeholder="Select"
                      isSearchable={false}
                    />
                    <p className="error-message opacity-0">error</p>
                  </td>
                  <td>
                    <InputFieldNumber
                      containerClassName="container-login-flow-input container-login-flow-input--addExpenseSmall"
                      name="qty"
                      value={data.qty}
                      onChange={this.handleChangeNumberTable(index)}
                    />
                  </td>
                  <td>
                    <InputFieldNumber
                      containerClassName="container-login-flow-input container-login-flow-input--addExpenseSmall"
                      name="rate"
                      value={data.rate}
                      onChange={this.handleChangeNumberTable(index)}
                    />
                  </td>
                  <td>
                    <div className="display-client-date-border-div display-client-date-border-div--add-expense">
                      <span>{data.amount}</span>
                    </div>
                    <p className="error-message opacity-0">error</p>
                  </td>
                  <td>
                    <InputFieldNumber
                      containerClassName="container-login-flow-input container-login-flow-input--addExpense"
                      name="tax"
                      value={data.tax}
                      onChange={this.handleChangeNumberTable(index)}
                    />
                  </td>
                  <td>
                    {billItems.length > 1 && (
                      <span>
                        <i
                          className="fa fa-times cursor-pointer"
                          onClick={this.handleOnClickRemoveTableRow(index)}
                        ></i>
                      </span>
                    )}
                  </td>
                </tr>
              ))}
              {/* for empty data array */}
              {/* <tr>
                <td colSpan={0} className="text-center">
                  <span className="font-14-semibold table-data-empty-message">No data found</span>
                </td>
              </tr> */}
            </tbody>
          </table>
        </div>

        <div className="mb-50">
          <GrayButtonSmallFont
            text="New Row"
            onClick={this.handleOnClickAddNewRow}
            extraClassName="add-invoice-new-row-btn"
          />
        </div>
      </>
    );
  };

  /*============================================================
      renderAdditionalNotesRow
  ============================================================*/

  //   handlers
  calculateSubtotal = () => {
    let subTotalAmount = 0;
    this.state.billItems.forEach((elements) => {
      subTotalAmount =
        subTotalAmount + parseFloat(elements.qty * elements.rate);
    });
    return parseFloat(subTotalAmount.toFixed(2));
  };

  calculateSubtotalTax = () => {
    let currentTax = 0;
    let subTotalTax = 0;
    let currentAmount = 0;
    this.state.billItems.forEach((elements) => {
      currentAmount = parseFloat(elements.qty * elements.rate);

      if (isEmpty(elements.tax)) {
        subTotalTax = subTotalTax;
      } else {
        currentTax = (currentAmount * parseFloat(elements.tax)) / 100;
        subTotalTax = subTotalTax + currentTax;
      }
    });

    return parseFloat(subTotalTax.toFixed(2));
  };

  calculateTotal = () => {
    let totalAmt = 0;
    let taxCalculated = this.calculateSubtotalTax();

    this.state.billItems.forEach((elements) => {
      if (!isEmpty(elements.amount)) {
        totalAmt = totalAmt + parseFloat(elements.amount);
      }
    });

    // if amount is not calculated including tax
    totalAmt = parseFloat(totalAmt) + parseFloat(taxCalculated);
    return parseFloat(totalAmt.toFixed(2));
  };

  //   renderAdditionalNotesRow
  renderAdditionalNotesRow = () => {
    return (
      <div className="row mx-0 mb-40">
        <div className="col-8">
          <TextareaField
            containerClassName="container-login-flow-textarea container-login-flow-textarea--addExpense"
            //label="Additional Notes"
            name="additionalNotes"
            value={this.state.additionalNotes}
            placeholder="Additional Notes"
            onChange={this.handleChange}
          />
        </div>
        <div className="col-4">
          {/*font-24-semiBold to font-24-extraBold-montserrat-letter-spacing , font-24-bold*/}
          <table className="add-expense-price-table add-expense-price-table--add-invoice">
            <tbody>
              <tr>
                <td>
                  <span className="font-24-bold">Subtotal ($)</span>
                </td>
                <td>
                  <span className="font-24-extraBold-montserrat-letter-spacing">
                    {this.calculateSubtotal()}
                  </span>
                </td>
              </tr>
              <tr>
                <td>
                  <span className="font-24-bold">Tax Amount ($)</span>
                </td>
                <td>
                  <span className="font-24-extraBold-montserrat-letter-spacing">
                    {this.calculateSubtotalTax()}
                  </span>
                </td>
              </tr>
              <tr>
                <td>
                  <span className="font-24-bold">Total ($)</span>
                </td>
                <td>
                  <span className="font-24-extraBold-montserrat-letter-spacing">
                    {this.calculateTotal()}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    );
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

    this.props.fileUpload(data, this.callBackFileUpload);
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
        containerClassName="upload-img__mainBlock upload-img__mainBlock--new-client upload-img__mainBlock--new-client--add-invoice"
        buttonName="Upload Documents"
        //buttonName="+ New Doc"
        fileNameValue={this.state.fileName}
        // acceptType="image/jpeg, image/png"
        onChange={this.handleOnChangeUploadDocuments}
        handleOnClickRemoveDocument={this.handleOnClickRemoveDocument}
      />
    );
  };

  /*============================================================
      renderMultipleFilesRow
  ============================================================*/
  renderMultipleFilesRow = () => {
    return (
      <div className="row mx-0">
        <div className="col-6">
          <h3 className="font-18-bold-space-light-uppercase mb-30">
            documents
          </h3>
          {this.renderUploadMultipleFiles()}
        </div>
      </div>
    );
  };

  /*=================================================================
      main
  =================================================================*/
  render() {
    // console.log(unix);
    console.log(this.state.clientId);
    console.log(this.state.clientName);
    return (
      <>
        <div className="main-page-padding">
          {/* pagetitle and topnavbar */}
          <div className="pageTitle-topNavbar-div">
            <PageTitle title="Add invoice" />
            <GrayLinkSmallFont path="/finances" text="Go Back" />
          </div>

          <div className="add-expense-content-div">
            {this.renderRow1()}
            {this.renderTable()}
            {this.renderAdditionalNotesRow()}
            {this.renderMultipleFilesRow()}

            <div className="text-right">
              <GrayButtonSmallFont
                text="Save Draft"
                onClick={this.handleOnClickAdd("DRAFT")}
              />
              <GreenButtonSmallFont
                //text="Add"
                text="Save &amp; Add"
                onClick={this.handleOnClickAdd("SENT")}
              />
            </div>
          </div>
        </div>
      </>
    );
  }
}

const mapStateToProps = (state) => ({
  allProjects: state.projects.allProjects,
});

export default connect(mapStateToProps, {
  fileUpload,
  createInvoice,
  getAllProjectAction,
})(withRouter(FinanceAddInvoice));
