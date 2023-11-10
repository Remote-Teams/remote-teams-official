import React, { useState, useEffect } from "react";
import SearchInput from "../common/SearchInput";
import AllProjectSheduleScrum from "./AllProjectSheduleScrum";
import { connect } from "react-redux";
import { getAllScrums } from "./../../../store/actions/projectAction";
import { getAllResourceAction } from "./../../../store/actions/resourcesAction";
import isEmpty from "../../../store/validations/is-empty";
import AllProjectScrumCard from "./AllProjectScrumCard";
import { Fragment } from "react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

function AllProjectScrum() {
  const dispatch = useDispatch();
  const [searchInput, setsearchInput] = useState("");
  const [allScrumsData, setallScrumsData] = useState([]);

  useEffect(() => {
    var projectData = JSON.parse(localStorage.getItem("projectData"));
    const formData = {
      query: {
        project: projectData._id,
      },
    };
    dispatch(getAllScrums(formData));
    dispatch(getAllResourceAction());
  }, []);

  const allScrums = useSelector((state) => state.projects.allScrums);
  useEffect(() => {
    if (!isEmpty(allScrums)) {
      setallScrumsData(allScrums);
    } else {
      setallScrumsData([]);
    }
  }, [allScrums]);

  const handleChangeSearchInput = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  };

  /*============================================================
      renderScrumTable
  ============================================================*/
  // handlers

  const handleOnClickExportIcon = () => {
    console.log("clicked on export icon");
  };
  const handleSortTableColumnData = (name) => (e) => {
    console.log("sort data of column: ", name);
  };
  // renderScrumTable

  return (
    <div>
      <div className="all-project-tab-panel">
        <div className="row mx-0 justify-content-center align-items-center scrum--btn-div">
          <AllProjectSheduleScrum />
          {/* <SearchInput
            name="searchInput"
            placeholder="Search"
            onChange={handleChangeSearchInput}
            value={searchInput}
          /> */}
        </div>
        {/*<div className="mb-30">{this.renderScrumTable()}</div>*/}
        <div className="row mx-0">
          {!isEmpty(allScrumsData) &&
            allScrumsData.map((data, index) => (
              <Fragment key={index}>
                <AllProjectScrumCard id={data._id} scrumData={data} />
              </Fragment>
            ))}
        </div>
      </div>
    </div>
  );
}

export default AllProjectScrum;

// import React, { Component } from "react";
// import SearchInput from "../common/SearchInput";
// import AllProjectSheduleScrum from "./AllProjectSheduleScrum";
// import { connect } from "react-redux";
// import { getAllScrums } from "./../../../store/actions/projectAction";
// import { getAllResourceAction } from "./../../../store/actions/resourcesAction";
// import isEmpty from "../../../store/validations/is-empty";
// import AllProjectScrumCard from "./AllProjectScrumCard";
// import { Fragment } from "react";
// import { Link } from "react-router-dom";

// const dummyData = [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }];

// class AllProjectScrum extends Component {
//   constructor() {
//     super();
//     this.state = {
//       searchInput: "",
//     };
//   }

//   componentDidMount() {
//     this.props.getAllScrums();
//     this.props.getAllResourceAction();
//   }

//   static getDerivedStateFromProps(nextProps, nextState) {
//     if (
//       !isEmpty(nextProps.allScrums) &&
//       nextProps.allScrums !== nextState.allScrums
//     ) {
//       return {
//         allScrums: nextProps.allScrums,
//       };
//     }
//     return null;
//   }

//   handleChangeSearchInput = (e) => {
//     this.setState({
//       [e.target.name]: e.target.value,
//     });
//   };
//   /*============================================================
//       renderScrumTable
//   ============================================================*/
//   // handlers

//   // handleOnClickExportIcon = () => {
//   //  console.log("clicked on export icon");
//   //};
//   //handleSortTableColumnData = (name) => (e) => {
//   //  console.log("sort data of column: ", name);
//   //};
//   // renderScrumTable
//   //renderScrumTable = () => {
//   //  const { allScrums } = this.state;
//   //  return (
//   //    <>
//   //      <div className="finances-table-thead">
//   //        <table className="finances-table finances-table--scrum">
//   //          <thead>
//   //            <tr>
//   //              <th>
//   //                <span
//   //                 className="cursor-pointer"
//   //                 onClick={this.handleSortTableColumnData("date")}
//   //               >
//   //                 Date <i className="fa fa-sort"></i>
//   ///            </span>
//   //             </th>
//   //             <th>
//   //               <span
//   //                 className="cursor-pointer"
//   //                 onClick={this.handleSortTableColumnData("date")}
//   //               >
//   //                 timings <i className="fa fa-sort"></i>
//   //               </span>
//   //             </th>
//   //             <th>
//   //              <span>meeting notes</span>
//   //             </th>
//   //             <th>
//   //               <span className="opacity-0">0</span>
//   //             </th>
//   //           </tr>
//   //         </thead>
//   //       </table>
//   //     </div>
//   //      <div className="finances-table-tbody finances-table-tbody--scrum">
//   //        <table className="finances-table finances-table--scrum">
//   //          <tbody>
//   //            {!isEmpty(allScrums) &&
//   //              allScrums.map((data, index) => (
//   //                <tr key={index}>
//   //                  <td>
//   //                    <span>02-Jan-2020</span>
//   //                  </td>
//   //                  <td>
//   //                    <span>10:00 AM - 10:15 AM</span>
//   //                  </td>
//   //                  <td>
//   //                    <span>
//   //                      Lorem ipsum dolor sit amet, consectetur adipiscing elit,
//   //                      sed do eiusmod tempor incididunt ut labore et dolore
//   //                      magna aliqua. Ut enim ad minim.... veniam, quis nostrud
//   //                      exercitation ullamco laboris nisi ut aliquip ex ea
//   //                      commodo consequat
//   //                    </span>
//   //                  </td>
//   //                  <td>
//   //                    <span className="row mx-0 flex-nowrap align-items-start justify-content-center">
//   //                      <img
//   //                        src={require("../../../assets/img/icons/export-icon.svg")}
//   //                        alt="export"
//   //                      className="finances-table__export-icon-img"
//   //                       onClick={this.handleOnClickExportIcon}
//   //                     />
//   //                   </span>
//   //                 </td>
//   //                </tr>
//   //              ))}
//   //            {/* for empty data array */}
//   //            {/* <tr>
//   //              <td colSpan={0} className="text-center">
//   //                <span className="font-14-semibold table-data-empty-message">No data found</span>
//   //              </td>
//   //            </tr>
//   //          </tbody>
//   //        </table>
//   //      </div>
//   //    </>
//   //  );
//   //};

//   render() {
//     return (
//       <div className="all-project-tab-panel">
//         <div className="row mx-0 justify-content-between align-items-center scrum--btn-div">
//           <AllProjectSheduleScrum />
//           <SearchInput
//             name="searchInput"
//             placeholder="Search"
//             onChange={this.handleChangeSearchInput}
//             value={this.state.SearchInput}
//           />
//         </div>
//         {/*<div className="mb-30">{this.renderScrumTable()}</div>*/}
//         <div className="row mx-0">
//           {dummyData.map((data, index) => (
//             <Fragment key={index}>
//               <AllProjectScrumCard id={data.id} />
//             </Fragment>
//           ))}
//         </div>
//       </div>
//     );
//   }
// }

// const mapStateToProps = (state) => ({
//   allScrums: state.projects.allScrums,
// });

// export default connect(mapStateToProps, { getAllScrums, getAllResourceAction })(
//   AllProjectScrum
// );
