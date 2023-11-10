import React, { Component } from "react";
import CountCardCommon from "../common/CountCardCommon";
import GreenLinkSmallFont from "../common/GreenLinkSmallFont";
import SearchInput from "../common/SearchInput";
import { connect } from "react-redux";
import isEmpty from "../../../store/validations/is-empty";
import { getExpenseByQuery } from "./../../../store/actions/financeAction";
import { getProjectExpenseOverview } from "./../../../store/actions/projectAction";
import { format } from "date-fns";

const dummyData = [1, 2, 3, 4, 5];

class AllProjectExpenses extends Component {
  constructor() {
    super();
    this.state = {
      searchInput: "",
      allExpanses: [],
    };
  }

  static getDerivedStateFromProps(nextProps, nextState) {
    if (
      !isEmpty(nextProps.allExpanses) &&
      nextProps.allExpanses !== nextState.allExpanses
    ) {
      return {
        allExpanses: nextProps.allExpanses,
      };
    }
    if (
      !isEmpty(nextProps.projectExpenseOverview) &&
      nextProps.projectExpenseOverview !== nextState.projectExpenseOverview
    ) {
      return {
        projectExpenseOverview: nextProps.projectExpenseOverview,
      };
    }

    return null;
  }

  componentDidMount() {
    let projectData = JSON.parse(localStorage.getItem("projectData"));
    let queryData = {
      pageNo: 1,
      pageSize: 10,
      query: {
        project: projectData._id,
      },
    };
    this.props.getExpenseByQuery(queryData);
    this.props.getProjectExpenseOverview(projectData._id);
  }

  handleChangeSearchInput = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  };
  /*============================================================
      renderExpensesTable
  ============================================================*/
  // handlers

  handleSortTableColumnData = (name) => (e) => {
    console.log("sort data of column: ", name);
  };
  // renderExpensesTable
  renderExensesTable = () => {
    const { allExpanses } = this.state;
    // console.log(allExpanses);
    return (
      <>
        <div className="finances-table-thead">
          <table className="finances-table finances-table--expenses">
            <thead>
              <tr>
                <th>
                  <span>name</span>
                </th>
                <th>
                  <span>desc</span>
                </th>
                <th>
                  <span>type</span>
                </th>
                <th>
                  <span
                    className="cursor-pointer"
                    onClick={this.handleSortTableColumnData("date")}
                  >
                    Date <i className="fa fa-sort"></i>
                  </span>
                </th>
                <th>
                  <span
                    className="cursor-pointer"
                    onClick={this.handleSortTableColumnData("subtotal")}
                  >
                    subtotal($) <i className="fa fa-sort"></i>
                  </span>
                </th>
                <th>
                  <span
                    className="cursor-pointer"
                    onClick={this.handleSortTableColumnData("tax")}
                  >
                    tax (%)<i className="fa fa-sort"></i>
                  </span>
                </th>
                <th>
                  <span
                    className="cursor-pointer"
                    onClick={this.handleSortTableColumnData("total")}
                  >
                    total($) <i className="fa fa-sort"></i>
                  </span>
                </th>
              </tr>
            </thead>
          </table>
        </div>
        <div className="finances-table-tbody finances-table-tbody--expenses">
          <table className="finances-table finances-table--expenses">
            <tbody>
              {!isEmpty(allExpanses) &&
                allExpanses.map((data, index) => (
                  <tr key={index}>
                    <td>
                      <span>{data.expenseTitle}</span>
                    </td>
                    <td>
                      <span>{data.notes}</span>
                    </td>
                    <td>
                      <span>{data.expenseType}</span>
                    </td>
                    <td>
                      <span>{format(data.createdAt, "DD-MMM-YYYY")}</span>
                    </td>
                    <td>
                      <span>{data.subTotal}</span>
                    </td>
                    <td>
                      <span>{data.totalTax}</span>
                    </td>
                    <td>
                      <span>{data.total}</span>
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
      </>
    );
  };

  render() {
    const { projectExpenseOverview } = this.state;

    return (
      <>
        <div className="row  mx-0 page-count-row page-count-row--project-expenses">
          <CountCardCommon
            title="total expenses ($)"
            count={
              !isEmpty(projectExpenseOverview) &&
              projectExpenseOverview.Project_Expense
            }
          />
          <CountCardCommon
            title="billed expenses ($)"
            count={
              !isEmpty(projectExpenseOverview) &&
              projectExpenseOverview.Billed_Expense
            }
          />
          <CountCardCommon
            title="unbilled expenses ($)"
            count={
              !isEmpty(projectExpenseOverview) &&
              projectExpenseOverview.Unbilled_Expense
            }
          />
          <CountCardCommon
            title="pending requests"
            count={
              !isEmpty(projectExpenseOverview) &&
              projectExpenseOverview.Pending_Requests
            }
          />
        </div>
        <div className="row mx-0 justify-content-between align-items-center expenses-btn-div">
          <GreenLinkSmallFont
            path="/add-expense-project"
            text="Add Expense"
            extraClassName="add-discussion-btn"
          />
          <SearchInput
            name="searchInput"
            placeholder="Search"
            onChange={this.handleChangeSearchInput}
            value={this.state.SearchInput}
          />
        </div>
        <div className="expenses-table-div pr-0">
          {this.renderExensesTable()}
        </div>
      </>
    );
  }
}

const mapStateToProps = (state) => ({
  allExpanses: state.finance.allExpanses,
  projectExpenseOverview: state.projects.projectExpenseOverview,
});

export default connect(mapStateToProps, {
  getExpenseByQuery,
  getProjectExpenseOverview,
})(AllProjectExpenses);

// import React, { Component } from "react";
// import { AgGridReact } from "ag-grid-react";
// import "ag-grid-community/dist/styles/ag-grid.css";
// import "ag-grid-community/dist/styles/ag-theme-alpine.css";
// import { Link } from "react-router-dom";
// import CountCardCommon from "../common/CountCardCommon";
// import GreenLinkSmallFont from "../common/GreenLinkSmallFont";
// import SearchInput from "../common/SearchInput";
// import { connect } from "react-redux";
// import isEmpty from "../../../store/validations/is-empty";
// import { getExpenseByQuery } from "./../../../store/actions/financeAction";
// import { getProjectExpenseOverview } from "./../../../store/actions/projectAction";

// class AllProjectExpenses extends Component {
//   constructor() {
//     super();
//     this.state = {
//       searchInput: "",
//       allExpanses: [],
//       columnDefs: [
//         {
//           headerName: "NAME",
//           field: "NAME",
//           width: 170,
//         },
//         {
//           headerName: "DESC",
//           field: "DESC",
//           width: 180,
//         },
//         {
//           headerName: "TYPE",
//           field: "TYPE",
//           width: 150,
//         },
//         {
//           headerName: "DATE",
//           field: "DATE",
//           width: 180,
//           sortable: true,
//         },
//         {
//           headerName: "SUBTOTAL",
//           field: "SUBTOTAL",
//           width: 130,
//           sortable: true,
//           // sortingOrder: ["asc", "desc"],
//         },
//         {
//           headerName: "TAX(%)",
//           field: "TAX",
//           width: 150,
//           sortable: true,
//         },
//         {
//           headerName: "TOTAL",
//           field: "TOTAL",
//           width: 150,
//           sortable: true,
//         },
//         {
//           headerName: "",
//           field: "ACTION_EDIT",
//           width: 20,
//           cellRendererFramework: function(params) {
//             return (
//               <Link
//                 to={{
//                   pathname: "/edit-expense",
//                   state: {
//                     expenseData: {},
//                   },
//                 }}
//               >
//                 <div className="ag-grid-delete-btn">
//                   <i className="fa fa-pencil"></i>
//                 </div>
//               </Link>
//             );
//           },
//         },
//         {
//           headerName: "",
//           field: "ACTION_DELETE",
//           width: 20,
//           cellRendererFramework: function(params) {
//             return (
//               <button
//                 className="ag-grid-delete-btn"
//                 onClick={() => console.log(params)}
//               >
//                 <i className="fa fa-trash"></i>
//               </button>
//             );
//           },
//         },
//       ],
//       rowData: [
//         {
//           NAME: "meeting",
//           DESC: "lorem",
//           TYPE: "ipsum",
//           DATE: "23-Dec-2019",
//           SUBTOTAL: "10.00",
//           TAX: "0.30",
//           TOTAL: "10.30",
//           ACTION_EDIT: "edit",
//           ACTION_DELETE: "delete",
//         },
//         {
//           NAME: "phone",
//           DESC: "lorem",
//           TYPE: "lorem",
//           DATE: "25-Dec-2019",
//           SUBTOTAL: "30.00",
//           TAX: "0.20",
//           TOTAL: "30.20",
//           ACTION_EDIT: "edit",
//           ACTION_DELETE: "delete",
//         },
//         {
//           NAME: "email",
//           DESC: "lorem",
//           TYPE: "ipsum",
//           DATE: "27-Dec-2019",
//           SUBTOTAL: "20.00",
//           TAX: "0.50",
//           TOTAL: "20.50",
//           ACTION_EDIT: "edit",
//           ACTION_DELETE: "delete",
//         },
//       ],
//     };
//   }

//   /*============================================================================
//         ag-grid-react table handlers
//   ============================================================================*/

//   onSortChanged = (e) => {
//     console.log(e);
//   };

//   onGridReady = (param) => {
//     console.log("grid ready", param);
//   };

//   /*============================================================================
//         ag-grid-react table handlers end
//   ============================================================================*/

//   static getDerivedStateFromProps(nextProps, nextState) {
//     if (
//       !isEmpty(nextProps.allExpanses) &&
//       nextProps.allExpanses !== nextState.allExpanses
//     ) {
//       return {
//         allExpanses: nextProps.allExpanses,
//       };
//     }
//     if (
//       !isEmpty(nextProps.projectExpenseOverview) &&
//       nextProps.projectExpenseOverview !== nextState.projectExpenseOverview
//     ) {
//       return {
//         projectExpenseOverview: nextProps.projectExpenseOverview,
//       };
//     }

//     return null;
//   }

//   componentDidMount() {
//     let projectData = JSON.parse(localStorage.getItem("projectData"));
//     let queryData = {
//       pageNo: 1,
//       pageSize: 10,
//       query: {
//         project: projectData._id,
//       },
//     };
//     this.props.getExpenseByQuery(queryData);
//     this.props.getProjectExpenseOverview(projectData._id);
//   }

//   handleChangeSearchInput = (e) => {
//     this.setState({
//       [e.target.name]: e.target.value,
//     });
//   };
//   /*============================================================
//       renderExpensesTable
//   ============================================================*/
//   // handlers

//   handleSortTableColumnData = (name) => (e) => {
//     console.log("sort data of column: ", name);
//   };

//   // renderExpensesTable
//   renderExensesTable = () => {
//     const { allExpanses } = this.state;
//     // console.log(allExpanses);
//     return (
//       <>
//         <div
//           className="ag-theme-alpine-dark ag-grid-custom-table ag-grid-custom-table--reports"
//           style={{
//             height: "200px",
//             width: "100%",
//           }}
//         >
//           <AgGridReact
//             defaultColDef={{
//               resizable: true,
//             }}
//             onSortChanged={this.onSortChanged}
//             onGridReady={this.onGridReady}
//             columnDefs={this.state.columnDefs}
//             rowData={this.state.rowData}
//           ></AgGridReact>
//         </div>

//         {/* <div className="finances-table-thead">
//           <table className="finances-table finances-table--expenses">
//             <thead>
//               <tr>
//                 <th>
//                   <span>name</span>
//                 </th>
//                 <th>
//                   <span>desc</span>
//                 </th>
//                 <th>
//                   <span>type</span>
//                 </th>
//                 <th>
//                   <span
//                     className="cursor-pointer"
//                     onClick={this.handleSortTableColumnData("date")}
//                   >
//                     Date <i className="fa fa-sort"></i>
//                   </span>
//                 </th>
//                 <th>
//                   <span
//                     className="cursor-pointer"
//                     onClick={this.handleSortTableColumnData("subtotal")}
//                   >
//                     subtotal($) <i className="fa fa-sort"></i>
//                   </span>
//                 </th>
//                 <th>
//                   <span
//                     className="cursor-pointer"
//                     onClick={this.handleSortTableColumnData("tax")}
//                   >
//                     tax (%)<i className="fa fa-sort"></i>
//                   </span>
//                 </th>
//                 <th>
//                   <span
//                     className="cursor-pointer"
//                     onClick={this.handleSortTableColumnData("total")}
//                   >
//                     total($) <i className="fa fa-sort"></i>
//                   </span>
//                 </th>
//               </tr>
//             </thead>
//           </table>
//         </div>
//         <div className="finances-table-tbody finances-table-tbody--expenses">
//           <table className="finances-table finances-table--expenses">
//             <tbody>
//               {!isEmpty(allExpanses) ? (
//                 allExpanses.map((data, index) => (
//                   <tr key={index}>
//                     <td>
//                       <span>meeting</span>
//                     </td>
//                     <td>
//                       <span>user feedback</span>
//                     </td>
//                     <td>
//                       <span>billed</span>
//                     </td>
//                     <td>
//                       <span>23-Dec-2019</span>
//                     </td>
//                     <td>
//                       <span>50.00</span>
//                     </td>
//                     <td>
//                       <span>Na</span>
//                     </td>
//                     <td>
//                       <span>50.00</span>
//                     </td>
//                   </tr>
//                 ))
//               ) : (
//                 <tr>
//                   <td colSpan={0} className="text-center">
//                     <span className="font-14-semibold table-data-empty-message">
//                       No data found
//                     </span>
//                   </td>
//                 </tr>
//               )}
//             </tbody>
//           </table>
//         </div>
//      */}
//       </>
//     );
//   };

//   render() {
//     const { projectExpenseOverview } = this.state;

//     return (
//       <>
//         <div className="row  mx-0 page-count-row page-count-row--project-expenses">
//           <CountCardCommon
//             title="total expenses ($)"
//             count={
//               !isEmpty(projectExpenseOverview) &&
//               projectExpenseOverview.Project_Expense
//             }
//           />
//           <CountCardCommon
//             title="billed expenses ($)"
//             count={
//               !isEmpty(projectExpenseOverview) &&
//               projectExpenseOverview.Billed_Expense
//             }
//           />
//           <CountCardCommon
//             title="unbilled expenses ($)"
//             count={
//               !isEmpty(projectExpenseOverview) &&
//               projectExpenseOverview.Unbilled_Expense
//             }
//           />
//           <CountCardCommon
//             title="pending requests"
//             count={
//               !isEmpty(projectExpenseOverview) &&
//               projectExpenseOverview.Pending_Requests
//             }
//           />
//         </div>
//         <div className="row mx-0 justify-content-between align-items-center expenses-btn-div">
//           <GreenLinkSmallFont
//             path="/add-expense-project"
//             text="Add Expense"
//             extraClassName="add-discussion-btn"
//           />
//           <SearchInput
//             name="searchInput"
//             placeholder="Search"
//             onChange={this.handleChangeSearchInput}
//             value={this.state.SearchInput}
//           />
//         </div>
//         <div className="expenses-table-div pr-0">
//           {this.renderExensesTable()}
//         </div>
//       </>
//     );
//   }
// }

// const mapStateToProps = (state) => ({
//   allExpanses: state.finance.allExpanses,
//   projectExpenseOverview: state.projects.projectExpenseOverview,
// });

// export default connect(mapStateToProps, {
//   getExpenseByQuery,
//   getProjectExpenseOverview,
// })(AllProjectExpenses);
