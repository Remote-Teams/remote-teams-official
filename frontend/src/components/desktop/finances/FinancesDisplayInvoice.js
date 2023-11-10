import React, { Component } from "react";
import PageTitle from "../common/PageTitle";
import GrayLinkSmallFont from "../common/GrayLinkSmallFont";
import GreenButtonSmallFont from "../common/GreenButtonSmallFont";
import dateFns from "date-fns";
import { connect } from "react-redux";
import { getAllClients } from "./../../../store/actions/clientAction";
import { url } from "../../../store/actions/config";
import UploadMultipleFilesListDisplay from "../common/UploadMultipleFilesListDisplay";
import isEmpty from "../../../store/validations/is-empty";

class FinancesDisplayInvoice extends Component {
  constructor() {
    super();
    this.state = {
      invoiceData: [],
      allClients: [],
    };
  }
  /*============================================================
      lifecycle methods
  ============================================================*/

  static getDerivedStateFromProps(nextProps, nextState) {
    if (
      !isEmpty(nextProps.allClients) &&
      nextProps.allClients !== nextState.allClients
    ) {
      return {
        allClients: nextProps.allClients,
      };
    }
  }

  componentDidMount() {
    this.props.getAllClients();
    const { invoiceData } = this.props.location.state;
    // console.log(invoiceData);
    this.setState({
      invoiceData: invoiceData,
    });
  }

  /*============================================================
      handlers
  ============================================================*/
  handleOnClickDownload = () => {
    console.log("clicked on download button");
  };

  /*============================================================
      renderRow1
  ============================================================*/
  renderRow1 = () => {
    const { invoiceData, allClients } = this.state;

    let clientInfo =
      !isEmpty(invoiceData) &&
      allClients.filter((client) => client._id === invoiceData.client);
    console.log(clientInfo);
    return (
      <>
        <div className="row mx-0 mb-50">
          <div className="col-3">
            <h3 className="font-18-bold-space-light-uppercase mb-20 mr-30">
              Client Name
            </h3>
            <p className="display-invoice-text-1">
              {!isEmpty(clientInfo[0]) && clientInfo[0].name}
            </p>
          </div>
          {/**col-3 */}
          <div className="col-5 pl-0">
            <h3 className="font-18-bold-space-light-uppercase mb-20 mr-30">
              CLIENT MAIL ADDRESS
            </h3>
            <p className="display-invoice-text-1 display-invoice-text-1--email">
              {!isEmpty(invoiceData) && invoiceData.email}
            </p>
          </div>
          <div className="col-3">
            <h3 className="font-18-bold-space-light-uppercase mb-20 mr-30">
              DUE DATE
            </h3>
            <p className="display-invoice-text-1">
              {dateFns.format(invoiceData.due_date, "DD-MM-YYYY")}{" "}
            </p>
          </div>
        </div>
        <div className="row mx-0 mb-50">
          <div className="col-6">
            <h3 className="font-18-bold-space-light-uppercase mb-20 mr-30">
              BILLING ADDRESS
            </h3>
            <p className="display-invoice-text-1">
              {!isEmpty(clientInfo[0]) &&
                clientInfo[0].addresses.billing_line_one}
            </p>
          </div>
        </div>
      </>
    );
  };

  /*============================================================
      renderTable
  ============================================================*/
  renderTable = () => {
    const { invoiceData } = this.state;
    console.log(invoiceData);
    return (
      <div className="mb-50">
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
              {!isEmpty(invoiceData.items) &&
                invoiceData.items[0].map((item, index) => {
                  return (
                    <tr key={index}>
                      <td>
                        <span>{index + 1}</span>
                      </td>
                      <td>
                        <p className="font-18-semiBold">{item.title}</p>
                        <p className="error-message opacity-0">error</p>
                      </td>
                      <td>
                        <p className="font-18-semiBold">{item.description}</p>
                        <p className="error-message opacity-0">error</p>
                      </td>
                      <td>
                        {item.quantity}
                        <p className="error-message opacity-0">error</p>
                      </td>
                      <td>
                        {item.rate}
                        <p className="error-message opacity-0">error</p>
                      </td>
                      <td>
                        <span>
                          {item.amount}
                          <p className="error-message opacity-0">error</p>
                        </span>
                      </td>
                      <td>
                        {item.tax}
                        <p className="error-message opacity-0">error</p>
                      </td>
                      <td>
                        <span></span>
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  /*============================================================
      renderAdditionalNotesRow
  ============================================================*/
  renderAdditionalNotesRow = () => {
    const { invoiceData } = this.state;
    return (
      <div className="row mx-0 mb-40">
        <div className="col-6">
          <h3 className="font-18-bold-space-light-uppercase mb-20 mr-30">
            ADDITIONAL NOTES
          </h3>
          <p className="font-14-semibold">{invoiceData.notes}</p>
        </div>
        <div className="col-2"></div>
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
                    {invoiceData.subTotal}
                  </span>
                </td>
              </tr>
              <tr>
                <td>
                  <span className="font-24-bold">Tax Amount ($)</span>
                </td>
                <td>
                  <span className="font-24-extraBold-montserrat-letter-spacing">
                    {invoiceData.totalTax}
                  </span>
                </td>
              </tr>
              <tr>
                <td>
                  <span className="font-24-bold">Total ($)</span>
                </td>
                <td>
                  <span className="font-24-extraBold-montserrat-letter-spacing">
                    {invoiceData.total}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    );
  };

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

  renderListOfDocumentsAttached = (invoiceData) => {
    return (
      <>
        <UploadMultipleFilesListDisplay
          dataDocuments={invoiceData.documents}
          handleOnClickDocumentName={this.handleOnClickDocumentName}
        />
      </>
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
          {this.renderListOfDocumentsAttached(this.state.invoiceData)}
        </div>
      </div>
    );
  };

  /*============================================================
      main
  ============================================================*/
  render() {
    console.log(this.props.allClients);
    return (
      <div>
        <div className="main-page-padding">
          {/* pagetitle and topnavbar */}
          <div className="pageTitle-topNavbar-div">
            <PageTitle title="invoice IN-8681" shadow="invoice" />
            <GrayLinkSmallFont path="/finances" text="Go Back" />
          </div>

          <div className="add-expense-content-div">
            {this.renderRow1()}
            {this.renderTable()}
            {this.renderAdditionalNotesRow()}
            {this.renderMultipleFilesRow()}
            <div className="text-right">
              <GreenButtonSmallFont
                text="Download"
                onClick={this.handleOnClickDownload}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  allClients: state.client.allClients,
});

export default connect(mapStateToProps, { getAllClients })(
  FinancesDisplayInvoice
);
