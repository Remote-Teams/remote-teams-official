import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Select from "react-select";
import LeftNavbar from "../header/LeftNavbar";
import PageTitle from "../common/PageTitle";
import TopNavbar from "../header/TopNavbar";
import GreenLinkSmallFont from "../common/GreenLinkSmallFont";
import DatepickerFromTo from "../common/DatepickerFromTo";
import SearchInput from "../common/SearchInput";
// api
import isEmpty from "../../../store/validations/is-empty";
import {
  ticketsFilter,
  getAllTickets,
  updateTicket,
  deleteTicket,
} from "./../../../store/actions/supportAction";
import { getAllResourceAction } from "./../../../store/actions/resourcesAction";
import { getAllProjectAction } from "./../../../store/actions/projectAction";
import { startOfMonth, endOfMonth } from "date-fns";
import { startOfDay, endOfDay } from "date-fns";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router";
import Loader from "react-loader-spinner";
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";

const optionsPriority = [
  { value: "HIGH", label: "High" },
  { value: "MEDIUM", label: "Medium" },
  { value: "LOW", label: "Low" },
];

const optionsStatus = [
  { value: "INPROGRESS", label: "In Progress" },
  { value: "ANSWERED", label: "Closed" },
  { value: "ONHOLD", label: "On Hold" },
];

// table
const optionsStatusTable = [
  { value: "INPROGRESS", label: "In Progress" },
  { value: "ANSWERED", label: "Closed" },
  { value: "ONHOLD", label: "On Hold" },
];

let countComponentUpdate = 0;
// let optionsAssignTo = [];
let optionsProject = [];

function Support() {
  const history = useHistory();
  const dispatch = useDispatch();
  const [values, setValues] = useState({
    searchInput: "",
    startDate: startOfMonth(new Date()),
    endDate: endOfMonth(new Date()),
    selectedOptionPriority: [],
    selectedOptionStatus: [],
    selectedOptionAssignTo: [],
    // api
    allResources: {},
    allTickets: {},
    allProjects: {},
  });

  const [optionsAssignTo, setoptionsAssignTo] = useState([]);

  const allResources = useSelector((state) => state.resources.allResources);
  const allTickets = useSelector((state) => state.support.allTickets);
  const allProjects = useSelector((state) => state.projects.allProjects);
  const loader = useSelector((state) => state.auth.loader);

  useEffect(() => {
    let newStartDate = startOfMonth(new Date());
    let endStartDate = endOfMonth(new Date());
    const formData = {
      query: {
        $and: [
          { createdAt: { $lte: new Date(endStartDate) } },
          { createdAt: { $gte: new Date(newStartDate) } },
        ],
      },
    };
    dispatch(getAllResourceAction());

    dispatch(getAllTickets(formData));
    dispatch(getAllProjectAction());

    return () => {
      countComponentUpdate = 0;
      // optionsAssignTo = [];
      optionsProject = [];
    };
  }, []);

  useEffect(() => {
    if (!isEmpty(allResources)) {
      setValues({
        ...values,
        allResources: allResources,
      });
      let newArray =
        !isEmpty(allResources) &&
        allResources.map((resource) => ({
          value: resource._id,
          label: resource.name,
        }));
      setoptionsAssignTo(newArray);
    }
  }, [allResources]);

  useEffect(() => {
    if (!isEmpty(allTickets)) {
      setValues({
        ...values,
        allTickets: allTickets,
      });
    } else {
      setValues({
        ...values,
        allTickets: [],
      });
    }
  }, [allTickets]);

  useEffect(() => {
    if (!isEmpty(allProjects)) {
      setValues({
        ...values,
        allProjects: allProjects,
      });
      let newArrayProject =
        !isEmpty(allProjects) &&
        allProjects.map((project) => ({
          value: project._id,
          label: project.name,
        }));
      optionsProject.push(...newArrayProject);
    }
  }, [allProjects]);

  useEffect(() => {
    console.log(values.selectedOptionAssignTo);

    let finalArray = [];

    if (!isEmpty(values.selectedOptionPriority)) {
      values.selectedOptionPriority.forEach((element) => {
        finalArray.push({ priority: { $eq: element.value } });
      });
    }
    if (!isEmpty(values.selectedOptionStatus)) {
      values.selectedOptionStatus.forEach((element) => {
        finalArray.push({ status: { $eq: element.value } });
      });
    }

    if (!isEmpty(values.selectedOptionAssignTo)) {
      values.selectedOptionAssignTo.forEach((element) => {
        finalArray.push({ assignedTo: { $eq: element.value } });
      });
    }

    let formData = {};
    if (!isEmpty(finalArray)) {
      formData = {
        query: {
          $or: finalArray,
        },
      };
    } else {
      formData = {
        query: {},
      };
    }

    dispatch(ticketsFilter(formData));
  }, [
    values.selectedOptionPriority,
    values.selectedOptionStatus,
    values.selectedOptionAssignTo,
  ]);

  /*============================================================
      handlers
  ============================================================*/

  const handleChangePriorityDropdown = (selectedOptionPriority) => {
    setValues({ ...values, selectedOptionPriority });
  };

  const handleChangeStatusDropdown = (selectedOptionStatus) => {
    setValues({ ...values, selectedOptionStatus });
  };

  const handleChangeAssignToDropdown = (selectedOptionAssignTo) => {
    setValues({ ...values, selectedOptionAssignTo });
  };

  const handleChangeSearchInput = (e) => {
    setValues({
      ...values,
      [e.target.name]: e.target.value,
    });
  };

  /*============================================================
      renderDateFromTo
  ============================================================*/
  const handleChangeStart = (date) => {
    if (date === null) {
      setValues({
        ...values,
        startDate: new Date(),
      });
    } else {
      setValues({
        ...values,
        startDate: date,
      });
    }
  };

  const handleChangeEnd = (date) => {
    if (date === null) {
      setValues({
        ...values,
        endDate: new Date(),
      });
    } else {
      setValues({
        ...values,
        endDate: date,
      });
    }
  };

  const handleOnClickDateArrowIcon = () => {
    console.log("clicked on arrow icon");

    let newStartDate = startOfDay(values.startDate);
    let endStartDate = endOfDay(values.endDate);

    const formData = {
      query: {
        $and: [
          { createdAt: { $lte: new Date(endStartDate) } },
          { createdAt: { $gte: new Date(newStartDate) } },
        ],
      },
    };
    dispatch(getAllTickets(formData));
  };

  const renderDateFromTo = () => {
    return (
      <div className="datepicker-no-border datepicker-no-border--support">
        <DatepickerFromTo
          startDateValue={values.startDate}
          endDateValue={values.endDate}
          handleChangeStart={handleChangeStart}
          handleChangeEnd={handleChangeEnd}
          handleOnClickDateArrowIcon={handleOnClickDateArrowIcon}
        />
      </div>
    );
  };

  /*============================================================
      renderSupportTable
  ============================================================*/
  //  handlers
  const handleChangeStatusDropdownTable = (data) => (selectedOption) => {
    let formData = {
      status: selectedOption.value,
    };
    dispatch(updateTicket(data._id, formData, history));
  };

  const handleChangePriorityDropdownTable = (data) => (selectedOption) => {
    let formData = {
      priority: selectedOption.value,
    };
    dispatch(updateTicket(data._id, formData, history));
  };

  const handleChangeAssignToDropdownTable = (data) => (selectedOption) => {
    let formData = {
      assignedTo: selectedOption.value,
    };
    dispatch(updateTicket(data._id, formData, history));
  };

  const handleSortTableColumnData = (name) => (e) => {
    console.log("sort data of column: ", name);
  };

  const handleOnClickDeleteTicket = (data) => (e) => {
    dispatch(deleteTicket(data._id));
  };

  // renderSupportTable
  const renderSupportTable = () => {
    const { allTickets, allProjects } = values;

    let filtereddata = [];
    if (!isEmpty(values.searchInput)) {
      let search = new RegExp(values.searchInput, "i");
      filtereddata = allTickets.filter((getall) => {
        if (search.test(getall.subject)) {
          console.log(getall);
          return getall;
        }
        // if (search.test(getall.company)) {
        //   return getall;
        // }
        // if (search.test(getall.email)) {
        //   return getall;
        // }
      });
      // console.log(filtereddata);
    } else {
      filtereddata = allTickets;
    }

    return (
      <>
        {/* heading row */}
        <div className="finances-table-thead">
          <table className="finances-table finances-table--support">
            <thead>
              <tr>
                <th>
                  <span>subject</span>
                </th>
                <th>
                  <span
                    className="cursor-pointer"
                    onClick={handleSortTableColumnData("type")}
                  >
                    type <i className="fa fa-sort"></i>
                  </span>
                </th>
                <th>
                  <span
                    className="cursor-pointer"
                    onClick={handleSortTableColumnData("client")}
                  >
                    client <i className="fa fa-sort"></i>
                  </span>
                </th>
                <th>
                  <span
                    className="cursor-pointer"
                    onClick={handleSortTableColumnData("project")}
                  >
                    project <i className="fa fa-sort"></i>
                  </span>
                </th>
                <th>
                  <span
                    className="cursor-pointer"
                    onClick={handleSortTableColumnData("status")}
                  >
                    status <i className="fa fa-sort"></i>
                  </span>
                </th>
                <th>
                  <span
                    className="cursor-pointer"
                    onClick={handleSortTableColumnData("priority")}
                  >
                    priority <i className="fa fa-sort"></i>
                  </span>
                </th>
                <th>
                  <span
                    className="cursor-pointer"
                    onClick={handleSortTableColumnData("assign to")}
                  >
                    assign to <i className="fa fa-sort"></i>
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
        <div className="finances-table-tbody finances-table-tbody--support">
          <table className="finances-table finances-table--support">
            <tbody>
              {!isEmpty(filtereddata) ? (
                filtereddata.map((data, index) => (
                  <tr key={index}>
                    <td>
                      <span>{data.subject}</span>
                    </td>
                    <td>
                      <span className="text-capitalize">
                        {data.type === "REQUEST_STATUS_UPDATE"
                          ? "REQUEST STATUS UPDATE"
                          : data.type}
                      </span>
                    </td>
                    <td>
                      <span>{data.raisedBy.name}</span>
                    </td>
                    <td>
                      <span>{data.project.name}</span>
                    </td>
                    <td>
                      {data.status === "ANSWERED" ? (
                        // disabled
                        <Select
                          className="react-select-container react-select-container--support-table"
                          classNamePrefix="react-select-elements"
                          value={optionsStatusTable.filter(
                            (a) => a.value === data.status
                          )}
                          placeholder="Closed"
                          isDisabled={true}
                        />
                      ) : (
                        // active
                        <Select
                          isSearchable={false}
                          className="react-select-container react-select-container--support-table"
                          classNamePrefix="react-select-elements"
                          value={optionsStatusTable.filter(
                            (a) => a.value === data.status
                          )}
                          onChange={handleChangeStatusDropdownTable(data)}
                          options={optionsStatusTable}
                          placeholder="New"
                        />
                      )}
                    </td>
                    <td>
                      {data.status === "ANSWERED" ? (
                        // disabled
                        <Select
                          className="react-select-container react-select-container--support-table"
                          classNamePrefix="react-select-elements"
                          value={optionsPriority.filter(
                            (a) => a.value === data.priority
                          )}
                          placeholder="Select"
                          isDisabled={true}
                        />
                      ) : (
                        // active
                        <Select
                          isSearchable={false}
                          className="react-select-container react-select-container--support-table"
                          classNamePrefix="react-select-elements"
                          value={optionsPriority.filter(
                            (a) => a.value === data.priority
                          )}
                          onChange={handleChangePriorityDropdownTable(data)}
                          options={optionsPriority}
                          placeholder="Select"
                        />
                      )}
                    </td>
                    <td>
                      {!isEmpty(optionsAssignTo) ? (
                        data.status === "ANSWERED" ? (
                          // disabled
                          <Select
                            className="react-select-container react-select-container--support-table"
                            classNamePrefix="react-select-elements"
                            value={optionsAssignTo.filter(
                              (a) => a.label === data.assignedTo.name
                            )}
                            placeholder="Select"
                            isDisabled={true}
                          />
                        ) : (
                          <>
                            {/* // active */}
                            <Select
                              isSearchable={false}
                              className="react-select-container react-select-container--support-table"
                              classNamePrefix="react-select-elements"
                              value={optionsAssignTo.filter(
                                (a) => a.label === data.assignedTo.name
                              )}
                              onChange={handleChangeAssignToDropdownTable(data)}
                              options={optionsAssignTo}
                              placeholder="Select"
                            />
                          </>
                        )
                      ) : (
                        ""
                      )}
                    </td>
                    <td>
                      <div className="row mx-0 flex-nowrap align-items-center">
                        {data.status === "ANSWERED"
                          ? !isEmpty(optionsAssignTo) &&
                            !isEmpty(optionsProject) && (
                              <Link
                                to={{
                                  pathname: "/display-ticket",
                                  state: {
                                    ticketData: data,
                                    optionsAssignToDropdown: optionsAssignTo,
                                    optionsProjectDropdown: optionsProject,
                                  },
                                }}
                              >
                                <img
                                  src={require("../../../assets/img/icons/export-icon.svg")}
                                  alt="export"
                                  className="finances-table__export-icon-img mr-25"
                                />
                              </Link>
                            )
                          : !isEmpty(optionsAssignTo) &&
                            !isEmpty(optionsProject) && (
                              <Link
                                to={{
                                  pathname: "/edit-ticket",
                                  state: {
                                    ticketData: data,
                                    optionsAssignToDropdown: optionsAssignTo,
                                    optionsProjectDropdown: optionsProject,
                                  },
                                }}
                              >
                                <i className="fa fa-pencil finances-table__fa-icon-edit mr-25"></i>
                              </Link>
                            )}
                        <i
                          className="fa fa-trash finances-table__fa-icon-delete"
                          onClick={handleOnClickDeleteTicket(data)}
                        ></i>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={0} className="text-center">
                    <span className="font-14-semibold table-data-empty-message">
                      Currently there are no tickets to solve
                    </span>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </>
    );
  };

  return (
    <div>
      {loader === true && (
        <Loader type="Triangle" color="#57cba1" className="remote-loader" />
      )}
      {/* left navbar */}
      <LeftNavbar activeMenu="support" />

      <div className="main-page-padding">
        {/* pagetitle and topnavbar */}
        <div className="pageTitle-topNavbar-div">
          <PageTitle
            title="Support"
            isLinkDisplay={true}
            linkPath="/add-new-ticket"
            linkText="+ Raise Ticket"
          />
          <TopNavbar />
        </div>
        {/* Link */}
        {/* <div className="mb-50">
                <GreenLinkSmallFont
                  path="/add-new-ticket"
                  //text="+ Raise Ticket"
                  text="Raise Ticket"
                  extraClassName="add-raise-ticket-btn"
                />
              </div> */}
        {/* date from to */}
        <div className="row mx-0 justify-content-between clients-btn-search-div mb-0">
          {renderDateFromTo()}
          <SearchInput
            name="searchInput"
            placeholder="Search"
            onChange={handleChangeSearchInput}
            value={values.SearchInput}
          />
        </div>
        <div className="row mx-0 clients-btn-search-div">
          <div className="col-12">
            <h3 className="font-18-bold-space-light-uppercase font-18-bold-space-light-uppercase--support  pb-10">
              Filter by
            </h3>
          </div>
          <Select
            isMulti
            // isClearable={false}
            isSearchable={false}
            className="react-select-container react-select-container--support1"
            classNamePrefix="react-select-elements"
            value={values.selectedOptionPriority}
            onChange={handleChangePriorityDropdown}
            options={optionsPriority}
            placeholder="Change Priority"
          />
          <Select
            isMulti
            // isClearable={false}
            isSearchable={false}
            className="react-select-container react-select-container--support2"
            classNamePrefix="react-select-elements"
            value={values.selectedOptionStatus}
            onChange={handleChangeStatusDropdown}
            options={optionsStatus}
            placeholder="Change Status"
          />
          <Select
            isMulti
            // isClearable={false}
            isSearchable={false}
            className="react-select-container react-select-container--support3"
            classNamePrefix="react-select-elements"
            value={values.selectedOptionAssignTo}
            onChange={handleChangeAssignToDropdown}
            options={optionsAssignTo}
            placeholder="Assign To"
          />
        </div>
        {/* content */}
        {renderSupportTable()}
      </div>
    </div>
  );
}

export default Support;

// import React, { Component } from "react";
// import { Link } from "react-router-dom";
// import Select from "react-select";
// import LeftNavbar from "../header/LeftNavbar";
// import PageTitle from "../common/PageTitle";
// import TopNavbar from "../header/TopNavbar";
// import GreenLinkSmallFont from "../common/GreenLinkSmallFont";
// import DatepickerFromTo from "../common/DatepickerFromTo";
// import SearchInput from "../common/SearchInput";
// // api
// import isEmpty from "../../../store/validations/is-empty";
// import { connect } from "react-redux";
// import {
//   getAllTickets,
//   updateTicket,
//   deleteTicket,
// } from "./../../../store/actions/supportAction";
// import { getAllResourceAction } from "./../../../store/actions/resourcesAction";
// import { getAllProjectAction } from "./../../../store/actions/projectAction";
// import { startOfMonth, endOfMonth } from "date-fns";
// import { startOfDay, endOfDay } from "date-fns";

// const optionsPriority = [
//   { value: "HIGH", label: "High" },
//   { value: "MEDIUM", label: "Medium" },
//   { value: "LOW", label: "Low" },
// ];

// const optionsStatus = [
//   { value: "NEW", label: "New" },
//   { value: "INPROGRESS", label: "In Progress" },
//   { value: "ANSWERED", label: "Closed" },
//   { value: "ONHOLD", label: "On Hold" },
// ];

// // table
// const optionsStatusTable = [
//   { value: "INPROGRESS", label: "In Progress" },
//   { value: "ANSWERED", label: "Closed" },
//   { value: "ONHOLD", label: "On Hold" },
// ];

// let countComponentUpdate = 0;
// let optionsAssignTo = [];
// let optionsProject = [];

// class Support extends Component {
//   constructor() {
//     super();
//     this.state = {
//       searchInput: "",
//       startDate: startOfMonth(new Date()),
//       endDate: endOfMonth(new Date()),
//       selectedOptionPriority: [],
//       selectedOptionStatus: [],
//       selectedOptionAssignTo: [],
//       // api
//       allResources: {},
//       allTickets: {},
//       allProjects: {},
//     };
//   }

//   /*==========================================================================
//         lifecycle methods
//   ============================================================================*/
//   componentDidMount() {
//     let newStartDate = startOfMonth(new Date());
//     let endStartDate = endOfMonth(new Date());
//     const formData = {
//       query: {
//         $and: [
//           { createdAt: { $lte: new Date(endStartDate) } },
//           { createdAt: { $gte: new Date(newStartDate) } },
//         ],
//       },
//     };
//     this.props.getAllResourceAction();

//     this.props.getAllTickets(formData);
//     this.props.getAllProjectAction();
//   }

//   static getDerivedStateFromProps(nextProps, nextState) {
//     if (
//       !isEmpty(nextProps.allProjects) &&
//       nextProps.allProjects !== nextState.allProjects
//     ) {
//       return {
//         allProjects: nextProps.allProjects,
//       };
//     }
//     if (
//       !isEmpty(nextProps.allResources) &&
//       nextProps.allResources !== nextState.allResources
//     ) {
//       return {
//         allResources: nextProps.allResources,
//       };
//     }
//     if (nextProps.allTickets !== nextState.allTickets) {
//       return {
//         allTickets: nextProps.allTickets,
//       };
//     }
//     return null;
//   }

//   componentDidUpdate() {
//     let { allResources, allProjects } = this.state;

//     if (!isEmpty(allResources) && !isEmpty(allProjects)) {
//       countComponentUpdate += 1;
//     }
//     // update optionsAssignTo
//     if (!isEmpty(allResources) && countComponentUpdate === 1) {
//       let newArray =
//         !isEmpty(allResources) &&
//         allResources.map((resource) => ({
//           value: resource._id,
//           label: resource.name,
//         }));
//       optionsAssignTo.push(...newArray);
//     }
//     // update optionsProject
//     if (!isEmpty(allProjects) && countComponentUpdate === 1) {
//       let newArrayProject =
//         !isEmpty(allProjects) &&
//         allProjects.map((project) => ({
//           value: project._id,
//           label: project.name,
//         }));
//       optionsProject.push(...newArrayProject);
//     }
//     // console.log(allResources, allProjects, countComponentUpdate);
//   }

//   componentWillUnmount() {
//     countComponentUpdate = 0;
//     optionsAssignTo = [];
//     optionsProject = [];
//   }

//   /*============================================================
//       handlers
//   ============================================================*/

//   handleChangePriorityDropdown = (selectedOptionPriority) => {
//     this.setState({ selectedOptionPriority });
//   };

//   handleChangeStatusDropdown = (selectedOptionStatus) => {
//     this.setState({ selectedOptionStatus });
//   };

//   handleChangeAssignToDropdown = (selectedOptionAssignTo) => {
//     this.setState({ selectedOptionAssignTo });
//   };

//   handleChangeSearchInput = (e) => {
//     this.setState({
//       [e.target.name]: e.target.value,
//     });
//   };

//   /*============================================================
//       renderDateFromTo
//   ============================================================*/
//   handleChangeStart = (date) => {
//     if (date === null) {
//       this.setState({
//         startDate: new Date(),
//       });
//     } else {
//       this.setState({
//         startDate: date,
//       });
//     }
//   };

//   handleChangeEnd = (date) => {
//     if (date === null) {
//       this.setState({
//         endDate: new Date(),
//       });
//     } else {
//       this.setState({
//         endDate: date,
//       });
//     }
//   };

//   handleOnClickDateArrowIcon = () => {
//     console.log("clicked on arrow icon");

//     let newStartDate = startOfDay(this.state.startDate);
//     let endStartDate = endOfDay(this.state.endDate);

//     const formData = {
//       query: {
//         $and: [
//           { createdAt: { $lte: new Date(endStartDate) } },
//           { createdAt: { $gte: new Date(newStartDate) } },
//         ],
//       },
//     };
//     this.props.getAllTickets(formData);
//   };

//   renderDateFromTo = () => {
//     return (
//       <div className="datepicker-no-border datepicker-no-border--support">
//         <DatepickerFromTo
//           startDateValue={this.state.startDate}
//           endDateValue={this.state.endDate}
//           handleChangeStart={this.handleChangeStart}
//           handleChangeEnd={this.handleChangeEnd}
//           handleOnClickDateArrowIcon={this.handleOnClickDateArrowIcon}
//         />
//       </div>
//     );
//   };

//   /*============================================================
//       renderSupportTable
//   ============================================================*/
//   //  handlers
//   handleChangeStatusDropdownTable = (data) => (selectedOption) => {
//     let formData = {
//       status: selectedOption.value,
//     };
//     this.props.updateTicket(data._id, formData, this.props.history);
//   };

//   handleChangePriorityDropdownTable = (data) => (selectedOption) => {
//     let formData = {
//       priority: selectedOption.value,
//     };
//     this.props.updateTicket(data._id, formData, this.props.history);
//   };

//   handleChangeAssignToDropdownTable = (data) => (selectedOption) => {
//     let formData = {
//       assignedTo: selectedOption.value,
//     };
//     this.props.updateTicket(data._id, formData, this.props.history);
//   };

//   handleSortTableColumnData = (name) => (e) => {
//     console.log("sort data of column: ", name);
//   };

//   handleOnClickDeleteTicket = (data) => (e) => {
//     this.props.deleteTicket(data._id);
//   };

//   // renderSupportTable
//   renderSupportTable = () => {
//     const { allTickets, allProjects } = this.state;

//     let filtereddata = [];
//     if (!isEmpty(this.state.searchInput)) {
//       let search = new RegExp(this.state.searchInput, "i");
//       filtereddata = allTickets.filter((getall) => {
//         if (search.test(getall.subject)) {
//           console.log(getall);
//           return getall;
//         }
//         // if (search.test(getall.company)) {
//         //   return getall;
//         // }
//         // if (search.test(getall.email)) {
//         //   return getall;
//         // }
//       });
//       // console.log(filtereddata);
//     } else {
//       filtereddata = allTickets;
//     }

//     return (
//       <>
//         {/* heading row */}
//         <div className="finances-table-thead">
//           <table className="finances-table finances-table--support">
//             <thead>
//               <tr>
//                 <th>
//                   <span>subject</span>
//                 </th>
//                 <th>
//                   <span
//                     className="cursor-pointer"
//                     onClick={this.handleSortTableColumnData("type")}
//                   >
//                     type <i className="fa fa-sort"></i>
//                   </span>
//                 </th>
//                 <th>
//                   <span
//                     className="cursor-pointer"
//                     onClick={this.handleSortTableColumnData("client")}
//                   >
//                     client <i className="fa fa-sort"></i>
//                   </span>
//                 </th>
//                 <th>
//                   <span
//                     className="cursor-pointer"
//                     onClick={this.handleSortTableColumnData("project")}
//                   >
//                     project <i className="fa fa-sort"></i>
//                   </span>
//                 </th>
//                 <th>
//                   <span
//                     className="cursor-pointer"
//                     onClick={this.handleSortTableColumnData("status")}
//                   >
//                     status <i className="fa fa-sort"></i>
//                   </span>
//                 </th>
//                 <th>
//                   <span
//                     className="cursor-pointer"
//                     onClick={this.handleSortTableColumnData("priority")}
//                   >
//                     priority <i className="fa fa-sort"></i>
//                   </span>
//                 </th>
//                 <th>
//                   <span
//                     className="cursor-pointer"
//                     onClick={this.handleSortTableColumnData("assign to")}
//                   >
//                     assign to <i className="fa fa-sort"></i>
//                   </span>
//                 </th>
//                 <th>
//                   <span className="opacity-0">0</span>
//                 </th>
//               </tr>
//             </thead>
//           </table>
//         </div>
//         {/* content row */}
//         <div className="finances-table-tbody finances-table-tbody--support">
//           <table className="finances-table finances-table--support">
//             <tbody>
//               {!isEmpty(filtereddata) ? (
//                 filtereddata.map((data, index) => (
//                   <tr key={index}>
//                     <td>
//                       <span>{data.subject}</span>
//                     </td>
//                     <td>
//                       <span className="text-capitalize">
//                         {data.type === "REQUEST_STATUS_UPDATE"
//                           ? "REQUEST STATUS UPDATE"
//                           : data.type}
//                       </span>
//                     </td>
//                     <td>
//                       <span>{data.raisedBy.name}</span>
//                     </td>
//                     <td>
//                       <span>{data.project.name}</span>
//                     </td>
//                     <td>
//                       {data.status === "ANSWERED" ? (
//                         // disabled
//                         <Select
//                           className="react-select-container react-select-container--support-table"
//                           classNamePrefix="react-select-elements"
//                           value={optionsStatusTable.filter(
//                             (a) => a.value === data.status
//                           )}
//                           placeholder="Closed"
//                           isDisabled={true}
//                         />
//                       ) : (
//                         // active
//                         <Select
//                           isSearchable={false}
//                           className="react-select-container react-select-container--support-table"
//                           classNamePrefix="react-select-elements"
//                           value={optionsStatusTable.filter(
//                             (a) => a.value === data.status
//                           )}
//                           onChange={this.handleChangeStatusDropdownTable(data)}
//                           options={optionsStatusTable}
//                           placeholder="New"
//                         />
//                       )}
//                     </td>
//                     <td>
//                       {data.status === "ANSWERED" ? (
//                         // disabled
//                         <Select
//                           className="react-select-container react-select-container--support-table"
//                           classNamePrefix="react-select-elements"
//                           value={optionsPriority.filter(
//                             (a) => a.value === data.priority
//                           )}
//                           placeholder="Select"
//                           isDisabled={true}
//                         />
//                       ) : (
//                         // active
//                         <Select
//                           isSearchable={false}
//                           className="react-select-container react-select-container--support-table"
//                           classNamePrefix="react-select-elements"
//                           value={optionsPriority.filter(
//                             (a) => a.value === data.priority
//                           )}
//                           onChange={this.handleChangePriorityDropdownTable(
//                             data
//                           )}
//                           options={optionsPriority}
//                           placeholder="Select"
//                         />
//                       )}
//                     </td>
//                     <td>
//                       {!isEmpty(optionsAssignTo) ? (
//                         data.status === "ANSWERED" ? (
//                           // disabled
//                           <Select
//                             className="react-select-container react-select-container--support-table"
//                             classNamePrefix="react-select-elements"
//                             value={optionsAssignTo.filter(
//                               (a) => a.label === data.assignedTo.name
//                             )}
//                             placeholder="Select"
//                             isDisabled={true}
//                           />
//                         ) : (
//                           <>
//                             {/* // active */}
//                             <Select
//                               isSearchable={false}
//                               className="react-select-container react-select-container--support-table"
//                               classNamePrefix="react-select-elements"
//                               value={optionsAssignTo.filter(
//                                 (a) => a.label === data.assignedTo.name
//                               )}
//                               onChange={this.handleChangeAssignToDropdownTable(
//                                 data
//                               )}
//                               options={optionsAssignTo}
//                               placeholder="Select"
//                             />
//                           </>
//                         )
//                       ) : (
//                         ""
//                       )}
//                     </td>
//                     <td>
//                       <div className="row mx-0 flex-nowrap align-items-center">
//                         {data.status === "ANSWERED"
//                           ? !isEmpty(optionsAssignTo) &&
//                             !isEmpty(optionsProject) && (
//                               <Link
//                                 to={{
//                                   pathname: "/display-ticket",
//                                   state: {
//                                     ticketData: data,
//                                     optionsAssignToDropdown: optionsAssignTo,
//                                     optionsProjectDropdown: optionsProject,
//                                   },
//                                 }}
//                               >
//                                 <img
//                                   src={require("../../../assets/img/icons/export-icon.svg")}
//                                   alt="export"
//                                   className="finances-table__export-icon-img mr-25"
//                                 />
//                               </Link>
//                             )
//                           : !isEmpty(optionsAssignTo) &&
//                             !isEmpty(optionsProject) && (
//                               <Link
//                                 to={{
//                                   pathname: "/edit-ticket",
//                                   state: {
//                                     ticketData: data,
//                                     optionsAssignToDropdown: optionsAssignTo,
//                                     optionsProjectDropdown: optionsProject,
//                                   },
//                                 }}
//                               >
//                                 <i className="fa fa-pencil finances-table__fa-icon-edit mr-25"></i>
//                               </Link>
//                             )}
//                         <i
//                           className="fa fa-trash finances-table__fa-icon-delete"
//                           onClick={this.handleOnClickDeleteTicket(data)}
//                         ></i>
//                       </div>
//                     </td>
//                   </tr>
//                 ))
//               ) : (
//                 <tr>
//                   <td colSpan={0} className="text-center">
//                     <span className="font-14-semibold table-data-empty-message">
//                       Currently there are no tickets to solve
//                     </span>
//                   </td>
//                 </tr>
//               )}
//             </tbody>
//           </table>
//         </div>
//       </>
//     );
//   };

//   /*============================================================
//       main
//   ============================================================*/
//   render() {
//     return (
//       <div>
//         {/* left navbar */}
//         <LeftNavbar activeMenu="support" />

//         <div className="main-page-padding">
//           {/* pagetitle and topnavbar */}
//           <div className="pageTitle-topNavbar-div">
//             <PageTitle
//               title="Support"
//               isLinkDisplay={true}
//               linkPath="/add-new-ticket"
//               linkText="+ Raise Ticket"
//             />
//             <TopNavbar />
//           </div>
//           {/* Link */}
//           {/* <div className="mb-50">
//             <GreenLinkSmallFont
//               path="/add-new-ticket"
//               //text="+ Raise Ticket"
//               text="Raise Ticket"
//               extraClassName="add-raise-ticket-btn"
//             />
//           </div> */}
//           {/* date from to */}
//           <div className="row mx-0 justify-content-between clients-btn-search-div mb-0">
//             {this.renderDateFromTo()}
//             <SearchInput
//               name="searchInput"
//               placeholder="Search"
//               onChange={this.handleChangeSearchInput}
//               value={this.state.SearchInput}
//             />
//           </div>
//           <div className="row mx-0 clients-btn-search-div">
//             <div className="col-12">
//               <h3 className="font-18-bold-space-light-uppercase font-18-bold-space-light-uppercase--support  pb-10">
//                 Filter by
//               </h3>
//             </div>
//             <Select
//               isMulti
//               // isClearable={false}
//               isSearchable={false}
//               className="react-select-container react-select-container--support1"
//               classNamePrefix="react-select-elements"
//               value={this.state.selectedOptionPriority}
//               onChange={this.handleChangePriorityDropdown}
//               options={optionsPriority}
//               placeholder="Change Priority"
//             />
//             <Select
//               isMulti
//               // isClearable={false}
//               isSearchable={false}
//               className="react-select-container react-select-container--support2"
//               classNamePrefix="react-select-elements"
//               value={this.state.selectedOptionStatus}
//               onChange={this.handleChangeStatusDropdown}
//               options={optionsStatus}
//               placeholder="Change Status"
//             />
//             <Select
//               isMulti
//               // isClearable={false}
//               isSearchable={false}
//               className="react-select-container react-select-container--support3"
//               classNamePrefix="react-select-elements"
//               value={this.state.selectedOptionAssignTo}
//               onChange={this.handleChangeAssignToDropdown}
//               options={optionsAssignTo}
//               placeholder="Assign To"
//             />
//           </div>
//           {/* content */}
//           {this.renderSupportTable()}
//         </div>
//       </div>
//     );
//   }
// }

// const mapStateToprops = (state) => ({
//   allResources: state.resources.allResources,
//   allTickets: state.support.allTickets,
//   allProjects: state.projects.allProjects,
// });

// export default connect(mapStateToprops, {
//   getAllTickets,
//   updateTicket,
//   deleteTicket,
//   getAllResourceAction,
//   getAllProjectAction,
// })(Support);
