import React, { useState, useEffect } from "react";
import PageTitle from "../common/PageTitle";
import CountCardCommon from "../common/CountCardCommon";
import ClientCard from "../clients/ClientCard";
import Select from "react-select";
import GrayButtonSmallFont from "../common/GrayButtonSmallFont";
import GreenButtonSmallFont from "../common/GreenButtonSmallFont";
import SearchInput from "../common/SearchInput";
import AddNewClient from "./AddNewClient";
import LeftNavbar from "../header/LeftNavbar";
import TopNavbar from "../header/TopNavbar";
import { connect } from "react-redux";
import {
  getAllOverview,
  getAllClients,
  getClientCount,
  clientSearchApi,
  clientCountThisMonth,
} from "./../../../store/actions/clientAction";
import { getAllUserRoles } from "./../../../store/actions/authAction";
import isEmpty from "../../../store/validations/is-empty";
import store from "../../../store/store";
import { SET_API_STATUS } from "./../../../store/types";
import GreenLinkSmallFont from "../common/GreenLinkSmallFont";
import { useDispatch, useSelector } from "react-redux";

import { startOfMonth, endOfMonth } from "date-fns";
import Loader from "react-loader-spinner";
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";

const options = [
  { value: "All Clients", label: "All Clients" },
  { value: "My Clients", label: "My Clients" },
];

function Clients() {
  const dispatch = useDispatch();
  const [values, setValues] = useState({
    isAddNew: false,
    selectedOption: options[0],
    searchInput: "",
    clientOverview: {},
    allClients: {},
    totalClientCount: {},
    allClientCount: {},
    totalClientCountThisMonth: {},
  });

  useEffect(() => {
    dispatch(getAllUserRoles());
    dispatch(getAllOverview());
    dispatch(getAllClients());
    dispatch(getClientCount());

    let startMonth = startOfMonth(new Date());
    let endMonth = endOfMonth(new Date());
    const formData = {
      query: {
        $and: [
          { createdAt: { $lte: new Date(endMonth) } },
          { createdAt: { $gte: new Date(startMonth) } },
        ],
      },
    };
    dispatch(clientCountThisMonth(formData));
  }, []);

  const allClients = useSelector((state) => state.client.allClients);
  const clientOverview = useSelector((state) => state.client.clientOverview);
  const allClientCount = useSelector((state) => state.client.allClientCount);
  const loader = useSelector((state) => state.auth.loader);

  const totalClientCountThisMonth = useSelector(
    (state) => state.client.totalClientCountThisMonth
  );

  useEffect(() => {
    if (!isEmpty(allClients)) {
      setValues({
        ...values,
        allClients: allClients,
      });
    } else {
      setValues({
        ...values,
        allClients: [],
      });
    }
  }, [allClients]);

  useEffect(() => {
    if (!isEmpty(clientOverview)) {
      setValues({
        ...values,
        clientOverview: clientOverview,
      });
    }
  }, [clientOverview]);

  useEffect(() => {
    if (!isEmpty(allClientCount)) {
      setValues({
        ...values,
        totalClientCount: allClientCount,
      });
    }
  }, [allClientCount]);

  useEffect(() => {
    if (!isEmpty(totalClientCountThisMonth)) {
      setValues({
        ...values,
        totalClientCountThisMonth: totalClientCountThisMonth,
      });
    }
  }, [totalClientCountThisMonth]);

  /*============================================================
      handlers
  ============================================================*/

  const handleChangeDropdown = (selectedOption) => {
    setValues({ ...values, selectedOption });
    console.log(`Option selected:`, selectedOption);
  };

  const handleChangeSearchInput = (e) => {
    setValues({
      ...values,
      [e.target.name]: e.target.value,
    });
  };

  const handleOnClickAddNew = () => {
    setValues({
      ...values,
      isAddNew: true,
    });
  };

  const handleOnClickBack = () => {
    dispatch(getAllOverview());
    dispatch(getAllClients());
    setValues({
      ...values,
      isAddNew: false,
    });
  };

  const onCardClickHadnler = (status) => (e) => {
    if (status === "TOTAL") {
      const formData = {
        // "pageNo":1,
        // "pageSize":10,
        query: {},
      };
      dispatch(clientSearchApi(formData));
    } else if (status === "INACTIVE") {
      const formData = {
        // "pageNo":1,
        // "pageSize":10,
        query: {
          status: status,
        },
      };
      dispatch(clientSearchApi(formData));
    } else if (status === "ACTIVE") {
      const formData = {
        // "pageNo":1,
        // "pageSize":10,
        query: {
          status: status,
        },
      };
      dispatch(clientSearchApi(formData));
    }
  };

  const { selectedOption, isAddNew } = values;
  // console.log(this.state.allClients);

  // console.log(this.state.clientOverview);

  let activeClient =
    !isEmpty(values.clientOverview) &&
    values.clientOverview.filter((client) => client._id === "ACTIVE");

  let inactiveClient =
    !isEmpty(values.clientOverview) &&
    values.clientOverview.filter((client) => client._id === "INACTIVE");

  // console.log(this.props.apiStatus);

  let filtereddata = [];
  if (!isEmpty(values.searchInput)) {
    let search = new RegExp(values.searchInput, "i");
    filtereddata = values.allClients.filter((getall) => {
      if (search.test(getall.name)) {
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
    filtereddata = values.allClients;
  }

  return (
    <>
      {loader === true && (
        <Loader type="Triangle" color="#57cba1" className="remote-loader" />
      )}
      {isAddNew ? (
        <>
          <div className="login-flow-dashboard-buttons-block">
            <GrayButtonSmallFont text="Back" onClick={this.handleOnClickBack} />
          </div>
          <AddNewClient />
        </>
      ) : (
        <>
          {/* left navbar */}
          <LeftNavbar activeMenu="clients" />

          <div className="main-page-padding">
            {/* pagetitle and topnavbar */}
            <div className="pageTitle-topNavbar-div">
              <PageTitle
                title="Clients"
                isLinkDisplay={true}
                linkPath="/add-new-client"
                linkText="+ New Client"
              />
              <TopNavbar />
            </div>
            {/* pagetitle and topnavbar end */}
            {/*<GreenButtonSmallFont
                //text="+ New Client"
                text="Add Client"
                onClick={this.handleOnClickAddNew}
              />*/}
            {/* <GreenLinkSmallFont path={"/add-new-client"} text="Add Client" /> */}
            <div className="row mx-0 page-count-row">
              <CountCardCommon
                title="TOTAL Clients"
                count={
                  !isEmpty(values.totalClientCount)
                    ? values.totalClientCount
                    : 0
                }
                onClick={onCardClickHadnler("TOTAL")}
              />
              <CountCardCommon
                title="inactive clients"
                count={
                  !isEmpty(inactiveClient[0]) ? inactiveClient[0].count : 0
                }
                onClick={onCardClickHadnler("INACTIVE")}
              />
              <CountCardCommon
                title="active clients"
                count={!isEmpty(activeClient[0]) ? activeClient[0].count : 0}
                onClick={onCardClickHadnler("ACTIVE")}
              />

              <CountCardCommon
                title="clients joined this month"
                count={
                  !isEmpty(totalClientCountThisMonth)
                    ? totalClientCountThisMonth
                    : 0
                }
                onClick={onCardClickHadnler("JOINED")}
              />
            </div>
            <div className="row mx-0 justify-content-between clients-btn-search-div">
              <Select
                isSearchable={false}
                className="react-select-container"
                classNamePrefix="react-select-elements"
                value={selectedOption}
                onChange={handleChangeDropdown}
                options={options}
                placeholder="Select"
              />
              <SearchInput
                name="searchInput"
                placeholder="Search"
                onChange={handleChangeSearchInput}
                value={values.searchInput}
              />
            </div>
            {!isEmpty(filtereddata) ? (
              <div className="row mx-0 clients-cards-overflow-div">
                {!isEmpty(filtereddata) &&
                  filtereddata.map((client, index) => {
                    return <ClientCard key={index} cardData={client} />;
                  })}
              </div>
            ) : (
              <div className="text-center">
                <img
                  src={require("../../../assets/img/illustrations/clients.svg")}
                  alt="clients not found"
                  className="clients-not-found-img"
                />
                <h5 className="all-project-not-found-text">No Clients found</h5>
                {/*<GreenButtonSmallFont
                    text="Add Client"
                    onClick={this.handleOnClickAddNew}
                  />*/}
                <GreenLinkSmallFont
                  path={"/add-new-client"}
                  text="Add Client"
                />
              </div>
            )}
          </div>
        </>
      )}
    </>
  );
}

export default Clients;

// import React, { Component } from "react";
// import PageTitle from "../common/PageTitle";
// import CountCardCommon from "../common/CountCardCommon";
// import ClientCard from "../clients/ClientCard";
// import Select from "react-select";
// import GrayButtonSmallFont from "../common/GrayButtonSmallFont";
// import GreenButtonSmallFont from "../common/GreenButtonSmallFont";
// import SearchInput from "../common/SearchInput";
// import AddNewClient from "./AddNewClient";
// import LeftNavbar from "../header/LeftNavbar";
// import TopNavbar from "../header/TopNavbar";
// import { connect } from "react-redux";
// import {
//   getAllOverview,
//   getAllClients,
//   getClientCount,
//   clientSearchApi,
//   clientCountThisMonth,
// } from "./../../../store/actions/clientAction";
// import { getAllUserRoles } from "./../../../store/actions/authAction";
// import isEmpty from "../../../store/validations/is-empty";
// import store from "../../../store/store";
// import { SET_API_STATUS } from "./../../../store/types";
// import GreenLinkSmallFont from "../common/GreenLinkSmallFont";

// import { startOfMonth, endOfMonth } from "date-fns";

// const options = [
//   { value: "All Clients", label: "All Clients" },
//   { value: "My Clients", label: "My Clients" },
// ];

// class Clients extends Component {
//   constructor() {
//     super();
//     this.state = {
//       isAddNew: false,
//       selectedOption: options[0],
//       searchInput: "",
//       clientOverview: {},
//       allClients: {},
//       totalClientCount: {},
//     };
//   }

//   /*==============================================
//                  Lifecycle Methods
//   ================================================*/
//   componentDidMount() {
//     this.props.getAllUserRoles();
//     this.props.getAllOverview();
//     this.props.getAllClients();
//     this.props.getClientCount();

//     let startMonth = startOfMonth(new Date());
//     let endMonth = endOfMonth(new Date());
//     const formData = {
//       query: {
//         $and: [
//           { createdAt: { $lte: new Date(endMonth) } },
//           { createdAt: { $gte: new Date(startMonth) } },
//         ],
//       },
//     };
//     this.props.clientCountThisMonth(formData);
//   }

//   static getDerivedStateFromProps(nextProps, nextState) {
//     if (
//       !isEmpty(nextProps.allClients) &&
//       nextProps.allClients !== nextState.allClients
//     ) {
//       return {
//         allClients: nextProps.allClients,
//       };
//     }
//     if (
//       !isEmpty(nextProps.clientOverview) &&
//       nextProps.clientOverview !== nextState.clientOverview
//     ) {
//       return {
//         clientOverview: nextProps.clientOverview,
//       };
//     }
//     if (!isEmpty(nextProps.apiStatus) && nextProps.apiStatus === 200) {
//       return {
//         isAddNew: false,
//       };
//     }
//     if (
//       !isEmpty(nextProps.allClientCount) &&
//       nextProps.allClientCount !== nextState.totalClientCount
//     ) {
//       return {
//         totalClientCount: nextProps.allClientCount,
//       };
//     }
//     if(!isEmpty(nextProps.totalClientCountThisMonth) && nextProps.totalClientCountThisMonth !== nextState.totalClientCountThisMonth){
//       return {
//         totalClientCountThisMonth:nextProps.totalClientCountThisMonth
//       }
//     }
//     return null;
//   }

//   componentDidUpdate() {
//     if (this.props.allClients !== this.state.allClients) {
//       this.setState({
//         allClients: this.props.allClients,
//       });
//     }
//     if (this.props.clientOverview !== this.state.clientOverview) {
//       this.setState({
//         clientOverview: this.props.clientOverview,
//       });
//     }
//   }

//   /*============================================================
//       handlers
//   ============================================================*/

//   handleChangeDropdown = (selectedOption) => {
//     this.setState({ selectedOption });
//     console.log(`Option selected:`, selectedOption);
//   };

//   handleChangeSearchInput = (e) => {
//     this.setState({
//       [e.target.name]: e.target.value,
//     });
//   };

//   handleOnClickAddNew = () => {
//     store.dispatch({
//       type: SET_API_STATUS,
//       payload: {},
//     });
//     this.setState({
//       isAddNew: true,
//     });
//   };

//   handleOnClickBack = () => {
//     this.props.getAllOverview();
//     this.props.getAllClients();
//     this.setState({
//       isAddNew: false,
//     });
//   };

//   onCardClickHadnler = (status) => (e) => {
//     if (status === "TOTAL") {
//       const formData = {
//         // "pageNo":1,
//         // "pageSize":10,
//         query: {},
//       };
//       this.props.clientSearchApi(formData);
//     } else if (status === "INACTIVE") {
//       const formData = {
//         // "pageNo":1,
//         // "pageSize":10,
//         query: {
//           status: status,
//         },
//       };
//       this.props.clientSearchApi(formData);
//     } else if (status === "ACTIVE") {
//       const formData = {
//         // "pageNo":1,
//         // "pageSize":10,
//         query: {
//           status: status,
//         },
//       };
//       this.props.clientSearchApi(formData);
//     }
//   };

//   /*============================================================
//       main
//   ============================================================*/
//   render() {
//     const { selectedOption, isAddNew } = this.state;
//     // console.log(this.state.allClients);
//     const { allClients, clientOverview, totalClientCount } = this.state;
//     // console.log(this.state.clientOverview);

//     let activeClient =
//       !isEmpty(clientOverview) &&
//       clientOverview.filter((client) => client._id === "ACTIVE");

//     let inactiveClient =
//       !isEmpty(clientOverview) &&
//       clientOverview.filter((client) => client._id === "INACTIVE");

//     // console.log(this.props.apiStatus);

//     let filtereddata = [];
//     if (!isEmpty(this.state.searchInput)) {
//       let search = new RegExp(this.state.searchInput, "i");
//       filtereddata = allClients.filter((getall) => {
//         if (search.test(getall.name)) {
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
//       filtereddata = this.state.allClients;
//     }

//     return (
//       <>
//         {isAddNew ? (
//           <>
//             <div className="login-flow-dashboard-buttons-block">
//               <GrayButtonSmallFont
//                 text="Back"
//                 onClick={this.handleOnClickBack}
//               />
//             </div>
//             <AddNewClient />
//           </>
//         ) : (
//           <>
//             {/* left navbar */}
//             <LeftNavbar activeMenu="clients" />

//             <div className="main-page-padding">
//               {/* pagetitle and topnavbar */}
//               <div className="pageTitle-topNavbar-div">
//                 <PageTitle title="Clients" />
//                 <TopNavbar />
//               </div>
//               {/* pagetitle and topnavbar end */}
//               {/*<GreenButtonSmallFont
//                 //text="+ New Client"
//                 text="Add Client"
//                 onClick={this.handleOnClickAddNew}
//               />*/}
//               <GreenLinkSmallFont path={"/add-new-client"} text="Add Client" />
//               <div className="row mx-0 page-count-row">
//                 <CountCardCommon
//                   title="TOTAL Clients"
//                   count={!isEmpty(totalClientCount) ? totalClientCount : 0}
//                   onClick={this.onCardClickHadnler("TOTAL")}
//                 />
//                 <CountCardCommon
//                   title="inactive clients"
//                   count={
//                     !isEmpty(inactiveClient[0]) ? inactiveClient[0].count : 0
//                   }
//                   onClick={this.onCardClickHadnler("INACTIVE")}
//                 />
//                 <CountCardCommon
//                   title="active clients"
//                   count={!isEmpty(activeClient[0]) ? activeClient[0].count : 0}
//                   onClick={this.onCardClickHadnler("ACTIVE")}
//                 />
//                 <CountCardCommon
//                   title="clients joined this month"
//                   count={0}
//                   onClick={this.onCardClickHadnler("JOINED")}
//                 />
//               </div>
//               <div className="row mx-0 justify-content-between clients-btn-search-div">
//                 <Select
//                   isSearchable={false}
//                   className="react-select-container"
//                   classNamePrefix="react-select-elements"
//                   value={selectedOption}
//                   onChange={this.handleChangeDropdown}
//                   options={options}
//                   placeholder="Select"
//                 />
//                 <SearchInput
//                   name="searchInput"
//                   placeholder="Search"
//                   onChange={this.handleChangeSearchInput}
//                   value={this.state.searchInput}
//                 />
//               </div>
//               {!isEmpty(filtereddata) ? (
//                 <div className="row mx-0 clients-cards-overflow-div">
//                   {!isEmpty(filtereddata) &&
//                     filtereddata.map((client, index) => {
//                       return <ClientCard key={index} cardData={client} />;
//                     })}
//                 </div>
//               ) : (
//                 <div className="text-center">
//                   <img
//                     src={require("../../../assets/img/illustrations/clients.svg")}
//                     alt="clients not found"
//                     className="clients-not-found-img"
//                   />
//                   <h5 className="all-project-not-found-text">
//                     No Clients found
//                   </h5>
//                   {/*<GreenButtonSmallFont
//                     text="Add Client"
//                     onClick={this.handleOnClickAddNew}
//                   />*/}
//                   <GreenLinkSmallFont
//                     path={"/add-new-client"}
//                     text="Add Client"
//                   />
//                 </div>
//               )}
//             </div>
//           </>
//         )}
//       </>
//     );
//   }
// }

// const mapStateToProps = (state) => ({
//   allClients: state.client.allClients,
//   clientOverview: state.client.clientOverview,
//   apiStatus: state.client.apiStatus,
//   allClientCount: state.client.allClientCount,
//   totalClientCountThisMonth:state.client.totalClientCountThisMonth
// });

// export default connect(mapStateToProps, {
//   getAllOverview,
//   getAllClients,
//   getClientCount,
//   getAllUserRoles,
//   clientSearchApi,
//   clientCountThisMonth,
// })(Clients);
