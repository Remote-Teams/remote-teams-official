import React, { Component } from "react";
import Select from "react-select";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import PageTitle from "../common/PageTitle";
import LeftNavbar from "../header/LeftNavbar";
import TopNavbar from "../header/TopNavbar";
import BreadcrumbMenu from "../common/BreadcrumbMenu";
import InputFieldEmailTextPassword from "../common/InputFieldEmailTextPassword";
import Toggle from "../common/Toggle";
import GrayButtonSmallFont from "../common/GrayButtonSmallFont";
import TextareaField from "../common/TextareaField";
import GreenButtonSmallFont from "../common/GreenButtonSmallFont";
import UploadMultipleFiles from "../common/UploadMultipleFiles";
import CustomRadioButton from "../common/CustomRadioButton";
import InputFieldNumber from "../common/InputFieldNumber";
import isEmpty from "../../../store/validations/is-empty";
import { connect } from "react-redux";
import {
  getAllProjectAction,
  addProjectExpanses,
} from "./../../../store/actions/projectAction";
import { fileUpload } from "./../../../store/actions/resourcesAction";
import { AddProjectExpenseValidation } from "./../../../store/validations/projectValidation/AddProjectExpenseValidation";

// const this.state.optionsProject = [
//   { value: "Project 1", label: "Project 1" },
//   { value: "Project 2", label: "Project 2" },
//   { value: "Project 3", label: "Project 3" },
// ];

class AllProjectExpenseAdd extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // renderRow1
      payeeName: "",
      isStatusActive: true,
      projectName: "",
      selectedRadioOption: "radioTypeProject",
      optionsProject: [],
      // renderTable
      billItems: [
        {
          title: "SSD",
          desc: "",
          date: new Date(),
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
    };
  }

  componentDidMount() {
    this.props.getAllProjectAction();
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
      let projectData = JSON.parse(localStorage.getItem("projectData"));
      return {
        optionsProject: newArray,
        projectName: { value: projectData._id, label: projectData.name },
      };
    }
    return null;
  }

  /*=================================================================
      handlers
  =================================================================*/
  handleChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
      errors: {},
    });
  };

  handleOnChangeToggle = (e) => {
    this.setState({
      [e.target.name]: e.target.checked,
    });
  };

  handleChangeSelectProjectName = (selectedOption) => {
    this.setState({ projectName: selectedOption, errors: {} });
    console.log(`Option selected:`, selectedOption);
  };

  handleOnClickRadioOption = (e) => {
    this.setState({
      selectedRadioOption: e.target.value,
    });
  };

  handleOnClickAdd = () => {
    // console.log(this.state);
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
          description: item.desc,
          date: item.date.toISOString(),
          quantity: item.qty,
          rate: item.rate,
          tax: item.tax,
          amount: item.amount,
        });
      });
    }
    // console.log("final item array", finalItemArray);

    // console.log(this.state);

    const { errors, isValid } = AddProjectExpenseValidation(this.state);

    if (!isValid) {
      this.setState({
        errors: errors,
      });
    } else {
      const formData = {
        payee_name:
          this.props.userData.firstName + " " + this.props.userData.lastName,
        expenseTitle: this.state.payeeName,
        expenseType:
          this.state.selectedRadioOption === "radioTypeProject"
            ? "PROJECT"
            : "MISCELLENOUS",
        BillingType: this.state.isStatusActive ? "BILLABLE" : "UNBILLABLE",
        project: this.state.projectName.value,
        // this.state.selectedRadioOption === "radioTypeProject"
        //   ? this.state.projectName.value
        //   : "",
        expenseItems: finalItemArray,
        notes: this.state.additionalNotes,
        subTotal: subTotalAmount,
        totalTax: subTotalTaxAmount,
        total: totalAmount,
        documents: fileData,
        status: "SENT",
        paynee_name: "",
      };
      console.log(formData);
      this.props.addProjectExpanses(formData, this.props.history);
    }
  };
  /*=================================================================
      renderRow1
  =================================================================*/
  renderRow1 = () => {
    const { errors } = this.state;
    return (
      <div className="row mx-0 add-expense-row-1">
        <div className="col-4 pl-0">
          <InputFieldEmailTextPassword
            containerClassName="container-login-flow-input container-login-flow-input--forms"
            label="Expense form name"
            name="payeeName"
            value={this.state.payeeName}
            onChange={this.handleChange}
            type="text"
            error={!isEmpty(errors) && errors.payeeName}
          />
        </div>
        <div className="col-8">
          <div className="row mx-0">
            <div className="col-12">
              <h3 className="font-18-bold-space-light-uppercase mb-30">
                type of expense
              </h3>
            </div>
            <div className="col-4">
              <CustomRadioButton
                label="Project"
                name="radioTypeProject"
                selectedRadioOption={this.state.selectedRadioOption}
                handleOnClickRadioOption={this.handleOnClickRadioOption}
              />
              {/* <CustomRadioButton
                label="Miscellaneous"
                name="radioTypeProjectMisc"
                selectedRadioOption={this.state.selectedRadioOption}
                handleOnClickRadioOption={this.handleOnClickRadioOption}
              /> */}
            </div>
            <div className="col-8">
              <Toggle
                textClassName="font-18-bold-space-light-uppercase"
                name="isStatusActive"
                text1={"BILLABLE"}
                text2={"UNBILLABLE"}
                onChange={this.handleOnChangeToggle}
                defaultChecked={this.state.isStatusActive}
              />
              {this.state.selectedRadioOption === "radioTypeProject" &&
                this.state.isStatusActive && (
                  <div className="row mx-0 flex-nowrap align-items-center mt-30">
                    <h3 className="font-18-bold-space-light-uppercase mb-40 mr-30">
                      Project Name
                    </h3>
                    <div>
                      <Select
                        className="react-select-container react-select-container--addMember"
                        classNamePrefix="react-select-elements"
                        value={this.state.projectName}
                        onChange={this.handleChangeSelectProjectName}
                        options={this.state.optionsProject}
                        placeholder="Select"
                        isSearchable={false}
                        isDisabled={true}
                      />
                      {errors ? (
                        <p className="error-message">{errors.projectName}</p>
                      ) : (
                        <p className="error-message opacity-0">error</p>
                      )}
                    </div>
                  </div>
                )}
            </div>
          </div>
        </div>
      </div>
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
    } else if (e.target.name === "desc") {
      billItems[index]["desc"] = e.target.value;
      this.setState({ billItems });
    }
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

  handleChangeDateTable = (index) => (date) => {
    let billItems = this.state.billItems;
    if (date === null) {
      billItems[index] = { ...billItems[index], date: new Date() };
      this.setState({ billItems });
    } else {
      billItems[index] = { ...billItems[index], date };
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
      desc: "",
      date: new Date(),
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
          <table className="finances-table finances-table--addExpense">
            <thead>
              <tr>
                <th>
                  <span>Sr.</span>
                </th>
                <th>
                  <span>Title</span>
                </th>
                <th>
                  <span>
                    Description <br /> (if any)
                  </span>
                </th>
                <th>
                  <span>Date</span>
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
          <table className="finances-table finances-table--addExpense">
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
                    <InputFieldEmailTextPassword
                      containerClassName="container-login-flow-input container-login-flow-input--addExpenseBig"
                      name="desc"
                      value={data.desc}
                      onChange={this.handleChangeTable(index)}
                      type="text"
                    />
                  </td>
                  <td>
                    <div className="date-picker-common date-picker-common--addExpense mb-30">
                      <DatePicker
                        minDate={new Date()}
                        selected={data.date}
                        onChange={this.handleChangeDateTable(index)}
                      />
                    </div>
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
                  <td className="all-project-add-expense-amount-td">
                    <div className="display-client-date-border-div display-client-date-border-div--add-expense">
                      <span>{data.amount}</span>
                    </div>
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
            text=" New Row"
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

  calculateSubtotal = () => {
    let subTotalAmount = 0;
    this.state.billItems.forEach((elements) => {
      subTotalAmount =
        subTotalAmount + parseFloat(elements.qty * elements.rate);
    });
    return subTotalAmount.toFixed(2);
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

    return subTotalTax.toFixed(2);
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
    return totalAmt.toFixed(2);
  };

  renderAdditionalNotesRow = () => {
    return (
      <div className="row mx-0 mb-40">
        <div className="col-8">
          <TextareaField
            containerClassName="container-login-flow-textarea container-login-flow-textarea--addExpense"
            label="Additional Notes"
            name="additionalNotes"
            value={this.state.additionalNotes}
            onChange={this.handleChange}
          />
        </div>
        <div className="col-4">
          <table className="add-expense-price-table  add-expense-price-table--add-invoice">
            <tbody>
              <tr>
                <td>
                  <span className="font-24-bold">Subtotal</span>
                </td>
                <td>
                  <span className="font-24-extraBold-montserrat-letter-spacing">
                    {this.calculateSubtotal()}
                  </span>
                </td>
              </tr>
              <tr>
                <td>
                  <span className="font-24-bold">
                    {/*Tax on subtotal*/}
                    Tax Amount
                  </span>
                </td>
                <td>
                  <span className="font-24-extraBold-montserrat-letter-spacing">
                    {this.calculateSubtotalTax()}
                  </span>
                </td>
              </tr>
              <tr>
                <td>
                  <span className="font-24-bold">Total</span>
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

  /*============================================================
      renderMultipleFilesRow
  ============================================================*/

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

  renderMultipleFilesRow = () => {
    return (
      <div className="row mx-0">
        <div className="col-6">
          {/*<h3 className="font-18-bold-space-light-uppercase mb-30">
            documents
    </h3>*/}
          <UploadMultipleFiles
            containerClassName="upload-img__mainBlock upload-img__mainBlock--new-client upload-img__mainBlock--new-client--add-invoice"
            buttonName="Upload Documents"
            //buttonName="+ New Doc"
            fileNameValue={this.state.fileName}
            // acceptType="image/jpeg, image/png"
            onChange={this.handleOnChangeUploadDocuments}
            handleOnClickRemoveDocument={this.handleOnClickRemoveDocument}
          />
        </div>
      </div>
    );
  };

  handleGoBack = () => {
    this.props.history.goBack();
  };

  /*=================================================================
      main
  =================================================================*/
  render() {
    let projectData = JSON.parse(localStorage.getItem("projectData"));
    return (
      <>
        {/* <div className="main-page-padding"> */}
        {/* pagetitle and topnavbar */}
        {/* <div className="pageTitle-topNavbar-div">
            <PageTitle title="Add expense" />
            <GrayButtonSmallFont onClick={this.handleGoBack} text="Go Back" />
          </div> */}

        {/* left navbar */}
        <LeftNavbar activeMenu="all-projects" />
        <div className="main-page-padding">
          {/* pagetitle and topnavbar */}
          <div className="pageTitle-topNavbar-div">
            <PageTitle title="Project Name" />
            <TopNavbar />
          </div>

          <BreadcrumbMenu
            menuObj={[
              {
                title: "Projects",
                link: "/all-projects",
              },
              {
                title: `${projectData.name}`,
                type: "goBackButton",
              },
              {
                title: "Expenses",
                type: "goBackButton",
              },
              {
                title: "Add New Expense",
              },
            ]}
          />

          <div className="add-expense-content-div add-expense-content-div--allProject">
            <div className="mb-20">
              <h2 className="add-project-select-cover-img-text">
                Add New Expense
              </h2>
            </div>
            {this.renderRow1()}
            {this.renderTable()}
            {this.renderAdditionalNotesRow()}
            {this.renderMultipleFilesRow()}

            <div className="text-right">
              <GreenButtonSmallFont
                text="Save &amp; Add"
                //text="Add"
                onClick={this.handleOnClickAdd}
              />
            </div>
          </div>
        </div>
      </>
    );
  }
}

const mapStateToProps = (state) => ({
  userData: state.auth.user,
  allProjects: state.projects.allProjects,
});

export default connect(mapStateToProps, {
  getAllProjectAction,
  addProjectExpanses,
  fileUpload,
})(AllProjectExpenseAdd);
