import React, { Component, Fragment } from "react";
import Modal from "react-responsive-modal";
import Select from "react-select";
import InputFieldEmailTextPassword from "../common/InputFieldEmailTextPassword";
import GrayButtonSmallFont from "../common/GrayButtonSmallFont";
import dateFns from "date-fns";
import { connect } from "react-redux";
import { updateClientWithId } from "./../../../store/actions/clientAction";
import isEmpty from "../../../store/validations/is-empty";
import { fileUpload } from "./../../../store/actions/resourcesAction";
import UploadMultipleFilesListDisplay from "../common/UploadMultipleFilesListDisplay";
import { url } from "../../../store/actions/config";
import InputFieldPhoneCountryNumber from "../common/InputFieldPhoneCountryNumber";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";
import { getAllFieldsValue } from "./../../../store/actions/commandCenterAction";

const imgClientDemo = require("../../../assets/img/dummy/block-img-client-card.svg");
const options = [
  { value: "Profile", label: "Profile" },
  { value: "Work", label: "Work" },
  { value: "Contract", label: "Contract" },
];

class DisplayClientModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedOption: options[0],
      //  renderTitleBlock
      thumbnail: imgClientDemo,
      clientName: "Client Name",
      //   renderProfileContent
      contactName: "",
      contactCountryCode: "+1",
      contactNumber: "",
      contactEmail: "",
      multipleContact: [],
      location: "",
      //   renderWorkContent
      website: "",
      billingAddress1: "",
      shippingAddress1: "",
      billingAddress2: "",
      shippingAddress2: "",
      billingAddress3: "",
      shippingAddress3: "",
      //   renderContractContent
      startDate: "",
      endDate: "",
      document: "",
      clientData: this.props.editCardData,
      fileName: [],
      fileData: [],

      //  renderCustomFields
      customFields: "",
      allFieldsValue: [],
    };
  }

  componentDidMount() {
    const { clientData } = this.state;
    this.setState({
      contactName: clientData.primaryContactPerson.name,
      contactCountryCode: clientData.primaryContactPerson.country_code,
      contactEmail: clientData.primaryContactPerson.email,
      location: clientData.location,
      contactNumber: clientData.primaryContactPerson.phone,
      website: clientData.website,
      billingAddress1: clientData.addresses.billing_line_one,
      billingAddress2: clientData.addresses.billing_line_two,
      billingAddress3: clientData.addresses.billing_line_three,
      shippingAddress1: clientData.addresses.shipping_line_one,
      shippingAddress2: clientData.addresses.shipping_line_two,
      shippingAddress3: clientData.addresses.shipping_line_three,
      startDate: clientData.contract.start_date,
      endDate: clientData.contract.end_date,
      clientName: clientData.name,
      thumbnail: clientData.coverImg,
      fileName: isEmpty(clientData.documents)
        ? []
        : clientData.documents.map((doc) => doc.originalname),
      fileData: isEmpty(clientData.documents) ? [] : clientData.documents,
    });
    this.props.getAllFieldsValue({
      entity_Id: clientData._id,
    });

    // dispatch(getAllCustomFieldsByEntity("CLIENT"));
  }
  static getDerivedStateFromProps(nextProps, nextState) {
    if (!isEmpty(nextProps.allFieldsValue)) {
      console.log(nextProps.allFieldsValue);
      return {
        allFieldsValue: nextProps.allFieldsValue,
      };
    }
    return null;
  }

  /*============================================================
      handlers
  ============================================================*/

  handleDropdownChange = (selectedOption) => {
    this.setState({ selectedOption });
    console.log(`Option selected:`, selectedOption);
  };

  handleChangeStart = (date) => {
    if (date === null) {
      this.setState({
        startDate: new Date(),
      });
    } else {
      this.setState({
        startDate: date,
      });
    }
  };

  handleChangeEnd = (date) => {
    if (date === null) {
      this.setState({
        endDate: new Date(),
      });
    } else {
      this.setState({
        endDate: date,
      });
    }
  };

  /*============================================================
      renderTitleBlock
  ============================================================*/
  renderTitleBlock = () => {
    const btnName = <i className="fa fa-pencil" />;
    return (
      <div className="row mx-0 mb-20">
        <div className="web-client-icon web-client-icon--client web-client-icon--client--display">
          <img
            // src={`${this.state.thumbnail}&token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7Il9pZCI6IjQ2M2RkODUwLTk4M2MtMTFlYi04YjhjLWQxNTRlNDIxMzFlNSIsImVtYWlsIjoiYWtzaGF5bmFnYXJnb2plMDcxNkBnbWFpbC5jb20iLCJ3b3Jrc3BhY2VJZCI6ImRlbW8zMDIifSwic3ViIjoiU3lzdGVtX1Rva2VuIiwiaXNzIjoiZG9taW5hdGUuYWkiLCJhdWQiOiJkb21pbmF0ZWFkbWluQGRvbWluYXRlLmFpIiwiaWF0IjoxNjE4NDc4NzEwLCJleHAiOjE2Mzg0Nzg3MTB9.-appa9PXDxbpFSOeNzeZYEZkTI3DGfBBlxaPZkHZDBs`}
            src={require("../../../assets/img/clients/new-client-profile.svg")}
            alt="person"
            className="img-wh-100"
          />
        </div>

        <div>
          <h3 className="new-client-name-display">{this.state.clientName}</h3>
          {/* <InputFieldEmailTextPassword
            containerClassName="container-login-flow-input container-login-flow-input--forms container-login-flow-input--editModal"
            label=""
            name="clientName"
            value={this.state.clientName}
            onChange={this.handleChange}
            type="text"
            isReadOnly={true}
         />*/}
        </div>
      </div>
    );
  };

  /*============================================================
      renderProfileContent
  ============================================================*/
  renderProfileContent = () => {
    return (
      <div className="row mx-0">
        <div className="col-5 pl-0">
          {/*<h3 className="font-18-bold-space-light-uppercase mb-20 mr-30">
            Primary contact name
          </h3>
    <p className="font-18-semiBold mb-50">{this.state.contactName}</p>*/}
          <h5 className="font-18-bold color-offwhite">Primary Contact Name</h5>
          <InputFieldEmailTextPassword
            containerClassName="container-login-flow-input container-login-flow-input--forms mt-20"
            //label=""
            name="contactName"
            value={this.state.contactName}
            onChange={this.handleChange}
            type="text"
            isReadOnly={true}
            placeholder="Primary Contact Name"
          />
        </div>
        <div className="col-5">
          {/*<h3 className="font-18-bold-space-light-uppercase mb-20 mr-30">
            primary contact email
          </h3>
  <p className="font-18-semiBold mb-50">{this.state.contactEmail}</p>*/}
          <h5 className="font-18-bold color-offwhite">Primary Contact Email</h5>
          <InputFieldEmailTextPassword
            containerClassName="container-login-flow-input container-login-flow-input--forms mt-20"
            //label=""
            name="contactEmail"
            value={this.state.contactEmail}
            onChange={this.handleChange}
            type="text"
            isReadOnly={true}
            placeholder="Primary Contact Email Address"
          />
        </div>
        <div className="col-5 pl-0">
          {/*<h3 className="font-18-bold-space-light-uppercase mb-20 mr-30">
            primary contact number
          </h3>
          <p className="font-18-semiBold mb-50">
            {this.state.contactCountryCode} {this.state.contactNumber}
</p>*/}
          <div className="container-login-flow-input--forms--display-clients">
            <h5 className="font-18-bold color-offwhite">
              Primary Contact Number
            </h5>
            <InputFieldPhoneCountryNumber
              containerClassName="container-login-flow-input container-login-flow-input--forms mt-20"
              //label="contact number"
              placeholder="Primary Contact Phone number"
              name="contactNumber"
              value={this.state.contactNumber}
              countryCode={this.state.contactCountryCode}
              //handleChangeCountryCode={this.handleChangeCountryCodeMultiContact}
              //onChange={this.handleChangeNumberMultiContact()}
              errorCountryCode={""}
              errorPhone={""}
              isReadOnly
            />
          </div>
        </div>
        <div className="col-5">
          {/*<h3 className="font-18-bold-space-light-uppercase mb-20 mr-30">
            Location
          </h3>
<p className="font-18-semiBold mb-50">{this.state.location}</p>*/}
          <h5 className="font-18-bold color-offwhite">Location</h5>
          <InputFieldEmailTextPassword
            containerClassName="container-login-flow-input container-login-flow-input--forms mt-20"
            label=""
            name="location"
            value={this.state.location}
            onChange={this.handleChange}
            type="text"
            isReadOnly={true}
            placeholder="Location"
          />
        </div>
      </div>
    );
  };

  /*=================================================================
      renderWorkContent
  =================================================================*/
  renderWorkContent = () => {
    return (
      <>
        <div className="row mx-0">
          <div className="col-5 pl-0">
            {/*<h3 className="font-18-bold add-new-client-work-details-text mt-0">
              Work Details
    </h3>*/}
            {/*<h3 className="font-18-bold-space-light-uppercase mb-20 mr-30">
              Website
            </h3>
    <p className="font-18-semiBold mb-50">{this.state.website}</p>*/}
            <h5 className="font-18-bold color-offwhite">Website</h5>
            <InputFieldEmailTextPassword
              containerClassName="container-login-flow-input container-login-flow-input--forms mt-20"
              label=""
              name="website"
              value={this.state.website}
              onChange={this.handleChange}
              type="text"
              isReadOnly={true}
              placeholder="Website"
            />
          </div>
        </div>
        {/* 1 */}
        <div className="row mx-0">
          <div className="col-5 pl-0">
            <h3 className="font-18-bold color-offwhite">Billing Address</h3>
            {/*<h3 className="font-18-bold-space-light-uppercase mb-20 mr-30">
              billing address line 1
            </h3>
            <p className="font-18-semiBold mb-50">
              {this.state.billingAddress1}
  </p>*/}
            <InputFieldEmailTextPassword
              containerClassName="container-login-flow-input container-login-flow-input--forms mt-50"
              label=""
              name="billingAddress1"
              value={this.state.billingAddress1}
              onChange={this.handleChange}
              type="text"
              isReadOnly={true}
              placeholder="billing address line 1"
            />
          </div>
          <div className="col-5 ">
            <h3 className="font-18-bold color-offwhite">Shipping Address</h3>
            {/*<h3 className="font-18-bold-space-light-uppercase mb-20 mr-30">
              shipping address line 1
            </h3>
            <p className="font-18-semiBold mb-50">
              {this.state.shippingAddress1}
</p>*/}
            <InputFieldEmailTextPassword
              containerClassName="container-login-flow-input container-login-flow-input--forms mt-50"
              label=""
              name="shippingAddress1"
              value={this.state.shippingAddress1}
              onChange={this.handleChange}
              type="text"
              isReadOnly={true}
              placeholder="shipping address line 1"
            />
          </div>
        </div>
        {/* 2 */}
        <div className="row mx-0">
          <div className="col-5 pl-0">
            {/*<h3 className="font-18-bold-space-light-uppercase mb-20 mr-30">
              billing address line 2
            </h3>
            <p className="font-18-semiBold mb-50">
              {this.state.billingAddress2}
</p>*/}
            <InputFieldEmailTextPassword
              containerClassName="container-login-flow-input container-login-flow-input--forms"
              label=""
              name="billingAddress2"
              value={this.state.billingAddress2}
              onChange={this.handleChange}
              type="text"
              isReadOnly={true}
              placeholder="billing address line 2"
            />
          </div>
          <div className="col-5">
            {/*<h3 className="font-18-bold-space-light-uppercase mb-20 mr-30">
              shipping address line 2
            </h3>
            <p className="font-18-semiBold mb-50">
              {this.state.shippingAddress2}
</p>*/}
            <InputFieldEmailTextPassword
              containerClassName="container-login-flow-input container-login-flow-input--forms"
              label=""
              name="shippingAddress2"
              value={this.state.shippingAddress2}
              onChange={this.handleChange}
              type="text"
              isReadOnly={true}
              placeholder="shipping address line 2"
            />
          </div>
        </div>
        {/* 3 */}
        <div className="row mx-0">
          <div className="col-5 pl-0">
            {/*<h3 className="font-18-bold-space-light-uppercase mb-20 mr-30">
              billing address line 3
            </h3>
            <p className="font-18-semiBold mb-50">
              {this.state.billingAddress3}
</p>*/}
            <InputFieldEmailTextPassword
              containerClassName="container-login-flow-input container-login-flow-input--forms"
              label=""
              name="billingAddress3"
              value={this.state.billingAddress3}
              onChange={this.handleChange}
              type="text"
              isReadOnly={true}
              placeholder="billing address line 3"
            />
          </div>
          <div className="col-5">
            {/*<h3 className="font-18-bold-space-light-uppercase mb-20 mr-30">
              shipping address line 3
            </h3>
            <p className="font-18-semiBold mb-50">
              {this.state.shippingAddress3}
</p>*/}
            <InputFieldEmailTextPassword
              containerClassName="container-login-flow-input container-login-flow-input--forms"
              label=""
              name="shippingAddress3"
              value={this.state.shippingAddress3}
              onChange={this.handleChange}
              type="text"
              isReadOnly={true}
              placeholder="shipping address line 3"
            />
          </div>
        </div>
      </>
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

  renderListOfDocumentsAttached = () => {
    return (
      <>
        <UploadMultipleFilesListDisplay
          dataDocuments={this.state.fileData}
          handleOnClickDocumentName={this.handleOnClickDocumentName}
        />
      </>
    );
  };

  /*=================================================================
      renderContractContent
  =================================================================*/
  renderContractContent = () => {
    return (
      <>
        <div className="row mx-0 mt-50">
          <div className="col-6 pl-0">
            {/*<h3 className="font-18-bold-space-light-uppercase mb-20 mr-30">
              Start date
    </h3>*/}
            <h3 className="font-18-bold color-offwhite">Contract Start Date</h3>{" "}
            <div className="display-client-date-border-div mt-20">
              <span>{dateFns.format(this.state.startDate, "D-MM-YYYY")}</span>
              <div className="datepeacker-date-icon-div">
                <img
                  src={require("../../../assets/img/icons/new-date-icon.svg")}
                  alt="date"
                />
              </div>
            </div>
          </div>
          <div className="col-6">
            {/*<h3 className="font-18-bold-space-light-uppercase mb-20 mr-30">
              End date
  </h3>*/}
            <h3 className="font-18-bold color-offwhite">Contract End Date</h3>
            <div className="display-client-date-border-div mt-20">
              <span>{dateFns.format(this.state.endDate, "D-MM-YYYY")}</span>
              <div className="datepeacker-date-icon-div">
                <img
                  src={require("../../../assets/img/icons/new-date-icon.svg")}
                  alt="date"
                />
              </div>
            </div>
          </div>

          <div className="col-10 pl-0">
            {/* 
            <h3 className="font-18-bold-space-light-uppercase mb-20">
              attach document <span className="text-lowercase">(if any)</span>
            </h3>*/}
            <h3 className="font-18-bold color-offwhite pt-50 mb-20">
              Documents
            </h3>
            {this.renderListOfDocumentsAttached()}
          </div>
        </div>
      </>
    );
  };

  /*==================================================
                        renderCustomFields
  ===================================================*/

  renderCustomFieldsContent = () => {
    const { allFieldsValue } = this.state;
    if (!isEmpty(allFieldsValue)) {
      return allFieldsValue.map((data, index) => {
        return (
          <Fragment key={index}>
            <h3 className="font-18-bold color-offwhite">
              {data.fieldData.name}
            </h3>
            <div className="row mx-0 align-items-start mt-20">
              <div className="col-5 pl-0">
                <InputFieldEmailTextPassword
                  containerClassName="container-login-flow-input container-login-flow-input--forms"
                  //label="shipping address line 3"
                  name="customFields"
                  value={data.value}
                  onChange={this.handleChange}
                  type="text"
                  placeholder={"Custom Fields"}
                  isReadOnly={true}
                />
              </div>
            </div>
          </Fragment>
        );
      });
    }
  };
  /*============================================================
      main
  ============================================================*/
  render() {
    const { editCardData, isDisplayModalOpen, onCloseModal } = this.props;
    const { selectedOption, allFieldsValue } = this.state;
    console.log(this.props.allFieldsValue);
    return (
      <div>
        {console.log(editCardData)}
        <Modal
          open={isDisplayModalOpen}
          onClose={onCloseModal}
          closeOnEsc={false}
          closeOnOverlayClick={false}
          center
          classNames={{
            overlay: "customOverlay",
            modal: "customModal customModal--clientEditModal",
            closeButton: "customCloseButton",
          }}
        >
          {/* close modal */}
          <span className="closeIconInModal" onClick={onCloseModal} />
          {/* content */}
          <div className="edit-client-modal-content">
            {this.renderTitleBlock()}
            {/*<div className="mb-50">
              <Select
                isSearchable={false}
                className="react-select-container"
                classNamePrefix="react-select-elements"
                value={selectedOption}
                onChange={this.handleDropdownChange}
                options={options}
                placeholder="Select"
              />
        </div>*/}
            {/*selectedOption.value === "Profile" && (
              <>
                <div className="edit-client-work-overflow-div">
                  {this.renderProfileContent()}
                </div>
              </>
            )}
            {selectedOption.value === "Work" && (
              <>
                <div className="edit-client-work-overflow-div">
                  {this.renderWorkContent()}
                </div>
              </>
            )}
            {selectedOption.value === "Contract" && (
              <>
                <div className="edit-client-work-overflow-div">
                  {this.renderContractContent()}
                </div>
              </>
            )}

            {/* <div className="row mx-0">
              <div className="col-12 text-right">
                <GrayButtonSmallFont text="Close" onClick={this.onCloseModal} />
              </div>
            </div> */}
            <div className="profile_tabs_section pt-40 mt-0 profile_tabs_section--member-details-new">
              <Tabs>
                <TabList>
                  <Tab>Profile</Tab>
                  <Tab>Work</Tab>
                  <Tab>Contract</Tab>
                  {!isEmpty(allFieldsValue) && <Tab>Custom Fields</Tab>}
                </TabList>

                <TabPanel>
                  <div className="edit-client-work-overflow-div">
                    {this.renderProfileContent()}
                  </div>
                </TabPanel>
                <TabPanel>
                  <div className="edit-client-work-overflow-div">
                    {this.renderWorkContent()}
                  </div>
                </TabPanel>
                <TabPanel>
                  <div className="edit-client-work-overflow-div">
                    {this.renderContractContent()}
                  </div>
                </TabPanel>
                {!isEmpty(allFieldsValue) && (
                  <TabPanel>
                    <div className="edit-client-work-overflow-div">
                      {this.renderCustomFieldsContent()}
                    </div>
                  </TabPanel>
                )}
              </Tabs>
            </div>
          </div>
        </Modal>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  allFieldsValue: state.commandCenter.allFieldsValue,
});

export default connect(mapStateToProps, {
  fileUpload,
  updateClientWithId,
  getAllFieldsValue,
})(DisplayClientModal);
