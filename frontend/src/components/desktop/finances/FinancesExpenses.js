import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Select from "react-select";
import SearchInput from "../common/SearchInput";
import GreenLinkSmallFont from "../common/GreenLinkSmallFont";
import DatepickerFromTo from "../common/DatepickerFromTo";
import FinanceSummaryCard from "../common/FinanceSummaryCard";
import { connect } from "react-redux";
import isEmpty from "../../../store/validations/is-empty";
import {
  getAllExpanses,
  deleteExpanse,
  expenseOverviewTableByDate,
  getMiscellaneousExpense,
} from "./../../../store/actions/financeAction";
import dateFns from "date-fns";
import { startOfDay, endOfDay } from "date-fns";
import { startOfMonth, endOfMonth } from "date-fns";
import { useDispatch, useSelector } from "react-redux";

// const options = [
//   { value: "All Projects", label: "All Projects" },
//   { value: "My Projects", label: "My Projects" },
// ];

const productOptions = [
  { value: "Product Name", label: "Product Name" },
  { value: "Product Name 2", label: "Product Name 2" },
];

const dummyData = [1, 2, 3, 4, 5];

function FinancesExpenses() {
  const dispatch = useDispatch();
  const [values, setValues] = useState({
    isAddNew: false,
    startSummaryDate: startOfMonth(new Date()),
    endSummaryDate: endOfMonth(new Date()),
    selectedOption: "",
    searchInput: "",
    startDate: startOfMonth(new Date()),
    endDate: endOfMonth(new Date()),
    allExpanses: [],
  });

  const [options, setOptions] = useState([]);

  const allExpanses = useSelector((state) => state.finance.allExpanses);
  const expenseTableOverviewCount = useSelector(
    (state) => state.finance.expenseTableOverviewCount
  );
  const AllMiscellaneousExpense = useSelector(
    (state) => state.finance.AllMiscellaneousExpense
  );
  const allProjects = useSelector((state) => state.projects.allProjects);

  useEffect(() => {
    const formData = {
      from: startOfMonth(new Date()).toISOString(),
      to: endOfMonth(new Date()).toISOString(),
    };

    dispatch(expenseOverviewTableByDate(formData));
    let newStartDate = startOfMonth(new Date());
    let endStartDate = endOfMonth(new Date());
    const formDataGetExpense = {
      query: {
        expenseType: "PROJECT",
        $and: [
          { createdAt: { $lte: new Date(endStartDate) } },
          { createdAt: { $gte: new Date(newStartDate) } },
        ],
      },
    };
    dispatch(getAllExpanses(formDataGetExpense));
  }, []);

  useEffect(() => {
    if (!isEmpty(allExpanses)) {
      setValues({
        ...values,
        allExpanses: allExpanses,
      });
    } else {
      setValues({
        ...values,
        allExpanses: [],
      });
    }
  }, [allExpanses]);
  useEffect(() => {
    if (!isEmpty(expenseTableOverviewCount)) {
      setValues({
        ...values,
        expenseTableOverviewCount: expenseTableOverviewCount,
      });
    } else {
      setValues({
        ...values,
        expenseTableOverviewCount: {},
      });
    }
  }, [expenseTableOverviewCount]);

  useEffect(() => {
    if (!isEmpty(AllMiscellaneousExpense)) {
      setValues({
        ...values,
        AllMiscellaneousExpense: AllMiscellaneousExpense,
      });
    } else {
      setValues({
        ...values,
        AllMiscellaneousExpense: [],
      });
    }
  }, [AllMiscellaneousExpense]);

  useEffect(() => {
    if (!isEmpty(allProjects)) {
      let newArray =
        !isEmpty(allProjects) &&
        allProjects.map((project) => ({
          value: project._id,
          label: project.name,
        }));
      setOptions(newArray);
    }
  }, [allProjects]);

  /*============================================================
      handlers
  ============================================================*/

  //    FinanceSummaryCard handlers
  const handleChangeSummaryStart = (date) => {
    if (date === null) {
      setValues({
        ...values,
        startSummaryDate: new Date(),
      });
    } else {
      setValues({
        ...values,
        startSummaryDate: date,
      });
    }
  };

  const handleChangeSummaryEnd = (date) => {
    if (date === null) {
      setValues({
        ...values,
        endSummaryDate: new Date(),
      });
    } else {
      setValues({
        ...values,
        endSummaryDate: date,
      });
    }
  };

  const handleOnClickSummaryDateArrowIcon = () => {
    console.log("clicked on arrow icon");
    const { startSummaryDate, endSummaryDate } = values;
    if (startSummaryDate === endSummaryDate) {
      const formData = {
        from: startOfDay(startSummaryDate).toISOString(),
        to: endOfDay(endSummaryDate).toISOString(),
      };

      dispatch(expenseOverviewTableByDate(formData));
    } else {
      const formData = {
        from: startSummaryDate.toISOString(),
        to: endSummaryDate.toISOString(),
      };

      dispatch(expenseOverviewTableByDate(formData));
    }
  };
  //    FinanceSummaryCard handlers end

  const handleChangeDropdown = (selectedOption) => {
    setValues({ ...values, selectedOption });
    console.log(`Option selected:`, selectedOption);
    let newStartDate = startOfMonth(values.startDate);
    let endStartDate = endOfMonth(values.endDate);
    const formDataGetExpense = {
      query: {
        project: selectedOption.value,
        expenseType: "PROJECT",
        $and: [
          { createdAt: { $lte: new Date(endStartDate) } },
          { createdAt: { $gte: new Date(newStartDate) } },
        ],
      },
    };
    dispatch(getAllExpanses(formDataGetExpense));
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
        expenseType: "PROJECT",
        $and: [
          { createdAt: { $lte: new Date(endStartDate) } },
          { createdAt: { $gte: new Date(newStartDate) } },
        ],
      },
    };
    const formDataMiscellaneaous = {
      query: {
        expenseType: "MISCELLENOUS",
        $and: [
          { createdAt: { $lte: new Date(endStartDate) } },
          { createdAt: { $gte: new Date(newStartDate) } },
        ],
      },
    };
    dispatch(getAllExpanses(formData));
    dispatch(getMiscellaneousExpense(formDataMiscellaneaous));
  };

  const renderDateFromTo = () => {
    return (
      <div className="datepicker-no-border datepicker-no-border--expenses">
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
      renderButtonAndSearchInput
  ============================================================*/
  const renderButtonAndSearchInput = () => {
    const { selectedOption } = values;
    return (
      <div className="row mx-0 justify-content-between subscription-btn-search-div">
        <div className="row mx-0">
          <div className="mr-50">
            <Select
              isSearchable={false}
              className="react-select-container react-select-container--finances"
              classNamePrefix="react-select-elements"
              value={selectedOption}
              onChange={handleChangeDropdown}
              options={options}
              placeholder="Select"
            />
          </div>
        </div>
        <div className="row mx-0">
          {renderDateFromTo()}
          <SearchInput
            name="searchInput"
            placeholder="Search"
            onChange={handleChangeSearchInput}
            value={values.SearchInput}
          />
        </div>
      </div>
    );
  };

  /*============================================================
      renderExpensesTable
  ============================================================*/
  // handlers
  const handleOnClickDeleteIcon = (expanseData) => (e) => {
    console.log("clicked on delete icon");
    dispatch(deleteExpanse(expanseData._id));
  };

  const handleSortTableColumnData = (name) => (e) => {
    console.log("sort data of column: ", name);
  };

  // renderExpensesTable
  const renderExpensesTable = () => {
    const { allExpanses } = values;

    let filtereddata = [];
    if (!isEmpty(values.searchInput)) {
      let search = new RegExp(values.searchInput, "i");
      filtereddata = allExpanses.filter((getall) => {
        if (search.test(getall.expenseTitle)) {
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
      filtereddata = allExpanses;
    }
    // let projectWiseExpanse =
    //   !isEmpty(allExpanses) &&
    //   allExpanses.filter(
    //     (expanse) =>
    //       expanse.expenseType === "PROJECT" &&
    //       (expanse.status === "APPROVED" || expanse.status === "DRAFT")
    //   );
    // console.log(projectWiseExpanse);
    return (
      <>
        {/* heading row */}
        <div className="finances-table-thead">
          <table className="finances-table finances-table--expense">
            <thead>
              <tr>
                <th>
                  <span>Title</span>
                </th>
                {/* <th>
                  <span>Desc</span>
                </th> */}

                <th>
                  <span>Type</span>
                </th>
                <th>
                  <span
                    className="cursor-pointer"
                    onClick={handleSortTableColumnData("date")}
                  >
                    Date <i className="fa fa-sort"></i>
                  </span>
                </th>
                <th>
                  <span
                    className="cursor-pointer"
                    onClick={handleSortTableColumnData("subtotal")}
                  >
                    Subtotal <i className="fa fa-sort"></i>
                  </span>
                </th>
                <th>
                  <span
                    className="cursor-pointer"
                    onClick={handleSortTableColumnData("tax")}
                  >
                    Tax (%) <i className="fa fa-sort"></i>
                  </span>
                </th>
                <th>
                  <span
                    className="cursor-pointer"
                    onClick={handleSortTableColumnData("total")}
                  >
                    Total <i className="fa fa-sort"></i>
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
        <div className="finances-table-tbody">
          <table className="finances-table finances-table--expense">
            <tbody>
              {!isEmpty(filtereddata) && filtereddata !== false ? (
                filtereddata.map((expanse, index) => (
                  <tr key={index}>
                    <td>
                      <span>{expanse.expenseTitle}</span>
                    </td>
                    {/* <td>
                      <span>{expanse.expenseTitle}</span>
                    </td> */}

                    <td>
                      <span>{expanse.BillingType}</span>
                    </td>
                    <td>
                      <span>
                        {dateFns.format(expanse.createdAt, "D-MMM-YYYY")}
                      </span>
                    </td>
                    <td>
                      <span>{expanse.subTotal}</span>
                    </td>
                    <td>
                      <span>
                        {!isEmpty(expanse.totalTax) ? expanse.totalTax : " Na"}{" "}
                      </span>
                    </td>
                    <td>
                      <span>{expanse.total}</span>
                    </td>

                    <td>
                      <span className="row mx-0 flex-nowrap align-items-start">
                        <Link
                          to={{
                            pathname: "/edit-expense",
                            state: {
                              expenseData: expanse,
                            },
                          }}
                        >
                          <i className="fa fa-pencil finances-table__fa-icon-edit"></i>
                        </Link>
                        <i
                          className="fa fa-trash finances-table__fa-icon-delete"
                          onClick={handleOnClickDeleteIcon(expanse)}
                        ></i>
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={0} className="text-center">
                    <span className="font-14-semibold table-data-empty-message">
                      No data found
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

  /*============================================================
      renderMiscExpensesTable
  ============================================================*/
  // handlers
  const handleOnClickDeleteIconMisc = (expanseData) => (e) => {
    console.log("clicked on delete icon");
    dispatch(deleteExpanse(expanseData._id));
  };

  const handleSortTableColumnDataMisc = (name) => (e) => {
    console.log("sort data of column: ", name);
  };

  // renderMiscExpensesTable
  const renderMiscExpensesTable = () => {
    const { allExpanses, AllMiscellaneousExpense } = values;

    let filtereddata = [];
    if (!isEmpty(values.searchInput)) {
      let search = new RegExp(values.searchInput, "i");
      filtereddata = AllMiscellaneousExpense.filter((getall) => {
        if (search.test(getall.expenseTitle)) {
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
      filtereddata = AllMiscellaneousExpense;
    }
    // let miscellinousExpanse =
    //   !isEmpty(allExpanses) &&
    //   allExpanses.filter(
    //     (expanse) =>
    //       expanse.expenseType === "MISCELLENOUS" &&
    //       (expanse.status === "APPROVED" || expanse.status === "DRAFT")
    //   );

    return (
      <>
        {/* heading row */}
        <div className="finances-table-thead">
          <table className="finances-table finances-table--miscExpense">
            <thead>
              <tr>
                <th>
                  <span>Title</span>
                </th>
                {/* <th>
                  <span>Desc</span>
                </th> */}
                <th>
                  <span>Type</span>
                </th>

                <th>
                  <span
                    className="cursor-pointer"
                    onClick={handleSortTableColumnDataMisc("date")}
                  >
                    Date <i className="fa fa-sort"></i>
                  </span>
                </th>
                <th>
                  <span
                    className="cursor-pointer"
                    onClick={handleSortTableColumnDataMisc("subtotal")}
                  >
                    Subtotal <i className="fa fa-sort"></i>
                  </span>
                </th>
                <th>
                  <span
                    className="cursor-pointer"
                    onClick={handleSortTableColumnDataMisc("tax")}
                  >
                    Tax (%) <i className="fa fa-sort"></i>
                  </span>
                </th>
                <th>
                  <span
                    className="cursor-pointer"
                    onClick={handleSortTableColumnDataMisc("total")}
                  >
                    Total <i className="fa fa-sort"></i>
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
        <div className="finances-table-tbody">
          <table className="finances-table finances-table--miscExpense">
            <tbody>
              {!isEmpty(filtereddata) && filtereddata !== false ? (
                filtereddata.map((expanse, index) => (
                  <tr key={index}>
                    <td>
                      <span>{expanse.expenseTitle}</span>
                    </td>
                    {/* <td>
                      <span>{expanse.expenseTitle}</span>
                    </td> */}
                    <td>
                      <span>{expanse.BillingType}</span>
                    </td>
                    <td>
                      <span>
                        {dateFns.format(expanse.createdAt, "D-MMM-YYYY")}
                      </span>
                    </td>
                    <td>
                      <span>{expanse.subTotal}</span>
                    </td>
                    <td>
                      <span>
                        {!isEmpty(expanse.totalTax) ? expanse.totalTax : " Na"}
                      </span>
                    </td>
                    <td>
                      <span>{expanse.total}</span>
                    </td>

                    <td>
                      <span className="row mx-0 flex-nowrap align-items-start">
                        <Link
                          to={{
                            pathname: "/edit-expense",
                            state: {
                              expenseData: expanse,
                            },
                          }}
                        >
                          <i className="fa fa-pencil finances-table__fa-icon-edit"></i>
                        </Link>
                        <i
                          className="fa fa-trash finances-table__fa-icon-delete"
                          onClick={handleOnClickDeleteIconMisc(expanse)}
                        ></i>
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={0} className="text-center">
                    <span className="font-14-semibold table-data-empty-message">
                      No data found
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
    <>
      {/* counts */}
      <div className="row mx-0 page-count-row">
        <FinanceSummaryCard
          summaryTitle="monthly expense($)"
          startSummaryDate={values.startSummaryDate}
          endSummaryDate={values.endSummaryDate}
          handleChangeSummaryStart={handleChangeSummaryStart}
          handleChangeSummaryEnd={handleChangeSummaryEnd}
          handleOnClickSummaryDateArrowIcon={handleOnClickSummaryDateArrowIcon}
          dataRow1Colm1="Billed expense"
          dataRow1Colm2={
            !isEmpty(values.expenseTableOverviewCount)
              ? values.expenseTableOverviewCount.billed
              : 0
          }
          dataRow1Colm3="Miscellaneous Expense"
          dataRow1Colm4={
            !isEmpty(values.expenseTableOverviewCount)
              ? values.expenseTableOverviewCount.misc
              : 0
          }
          dataRow2Colm1="unbilled Expense"
          dataRow2Colm2={
            !isEmpty(values.expenseTableOverviewCount)
              ? values.expenseTableOverviewCount.unbilled
              : 0
          }
          dataRow2Colm3="Subscription Cost"
          dataRow2Colm4={
            !isEmpty(values.expenseTableOverviewCount)
              ? values.expenseTableOverviewCount.subscription
              : 0
          }
        />
      </div>

      <div className="row mx-0">
        {/* font-33-semiBold */}
        <h3 className="expenses-project-name-text mb-30 pr-50">
          Project Wise Expenses
        </h3>
        <GreenLinkSmallFont
          //text="+ New Expense"
          extraClassName="finances-expenses-add-btn"
          text="New Expense"
          path="/add-expense"
        />
      </div>

      {/* button and search */}
      {renderButtonAndSearchInput()}

      {/* renderExpensesTable */}
      {renderExpensesTable()}

      {/* Miscellaneous Expenses */}
      <h3 className="expenses-project-name-text expenses-project-name-text--expenses mt-30 mb-30 pt-20 ">
        Miscellaneous Expenses
      </h3>
      {renderMiscExpensesTable()}
    </>
  );
}

export default FinancesExpenses;

// import React, { Component } from "react";
// import { Link } from "react-router-dom";
// import Select from "react-select";
// import SearchInput from "../common/SearchInput";
// import GreenLinkSmallFont from "../common/GreenLinkSmallFont";
// import DatepickerFromTo from "../common/DatepickerFromTo";
// import FinanceSummaryCard from "../common/FinanceSummaryCard";
// import { connect } from "react-redux";
// import isEmpty from "../../../store/validations/is-empty";
// import {
//   getAllExpanses,
//   deleteExpanse,
//   expenseOverviewTableByDate,
//   getMiscellaneousExpense,
// } from "./../../../store/actions/financeAction";
// import dateFns from "date-fns";
// import { startOfDay, endOfDay } from "date-fns";
// import { startOfMonth, endOfMonth } from "date-fns";

// const options = [
//   { value: "All Projects", label: "All Projects" },
//   { value: "My Projects", label: "My Projects" },
// ];

// const productOptions = [
//   { value: "Product Name", label: "Product Name" },
//   { value: "Product Name 2", label: "Product Name 2" },
// ];

// const dummyData = [1, 2, 3, 4, 5];

// const orgDataLocalStorage = JSON.parse(
//   localStorage.getItem("OrganizationData")
// );

// const isLocalStorageOrgCompanyTypeService =
//   orgDataLocalStorage !== null && orgDataLocalStorage.companyType === "SERVICE"
//     ? true
//     : false;

// class FinancesExpenses extends Component {
//   constructor() {
//     super();
//     this.state = {
//       isAddNew: false,
//       startSummaryDate: startOfMonth(new Date()),
//       endSummaryDate: endOfMonth(new Date()),
//       selectedOption: isLocalStorageOrgCompanyTypeService
//         ? options[0]
//         : productOptions[0],
//       searchInput: "",
//       startDate: startOfMonth(new Date()),
//       endDate: endOfMonth(new Date()),
//       allExpanses: [],
//     };
//   }

//   componentDidMount() {
//     const formData = {
//       from: startOfMonth(new Date()).toISOString(),
//       to: endOfMonth(new Date()).toISOString(),
//     };

//     this.props.expenseOverviewTableByDate(formData);
//   }

//   /*====================================================
//                   Lifecycle Method
//   =====================================================*/
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
//       !isEmpty(nextProps.expenseTableOverviewCount) &&
//       nextProps.expenseTableOverviewCount !==
//         nextState.expenseTableOverviewCount
//     ) {
//       return {
//         expenseTableOverviewCount: nextProps.expenseTableOverviewCount,
//       };
//     }
//     if (
//       !isEmpty(nextProps.AllMiscellaneousExpense) &&
//       nextProps.AllMiscellaneousExpense !== nextState.AllMiscellaneousExpense
//     ) {
//       return {
//         AllMiscellaneousExpense: nextProps.AllMiscellaneousExpense,
//       };
//     }
//     return null;
//   }

//   componentDidUpdate() {
//     if (this.props.allExpanses !== this.state.allExpanses) {
//       this.setState({
//         allExpanses: this.props.allExpanses,
//       });
//     }
//     if (
//       this.props.expenseTableOverviewCount !==
//       this.state.expenseTableOverviewCount
//     ) {
//       this.setState({
//         expenseTableOverviewCount: this.props.expenseTableOverviewCount,
//       });
//     }
//     if (
//       this.props.AllMiscellaneousExpense !== this.state.AllMiscellaneousExpense
//     ) {
//       this.setState({
//         AllMiscellaneousExpense: this.props.AllMiscellaneousExpense,
//       });
//     }
//   }

//   /*============================================================
//       handlers
//   ============================================================*/

//   //    FinanceSummaryCard handlers
//   handleChangeSummaryStart = (date) => {
//     if (date === null) {
//       this.setState({
//         startSummaryDate: new Date(),
//       });
//     } else {
//       this.setState({
//         startSummaryDate: date,
//       });
//     }
//   };

//   handleChangeSummaryEnd = (date) => {
//     if (date === null) {
//       this.setState({
//         endSummaryDate: new Date(),
//       });
//     } else {
//       this.setState({
//         endSummaryDate: date,
//       });
//     }
//   };

//   handleOnClickSummaryDateArrowIcon = () => {
//     console.log("clicked on arrow icon");
//     const { startSummaryDate, endSummaryDate } = this.state;
//     if (startSummaryDate === endSummaryDate) {
//       const formData = {
//         from: startOfDay(startSummaryDate).toISOString(),
//         to: endOfDay(endSummaryDate).toISOString(),
//       };

//       this.props.expenseOverviewTableByDate(formData);
//     } else {
//       const formData = {
//         from: startSummaryDate.toISOString(),
//         to: endSummaryDate.toISOString(),
//       };

//       this.props.expenseOverviewTableByDate(formData);
//     }
//   };
//   //    FinanceSummaryCard handlers end

//   handleChangeDropdown = (selectedOption) => {
//     this.setState({ selectedOption });
//     console.log(`Option selected:`, selectedOption);
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
//         expenseType: "PROJECT",
//         $and: [
//           { createdAt: { $lte: new Date(endStartDate) } },
//           { createdAt: { $gte: new Date(newStartDate) } },
//         ],
//       },
//     };
//     const formDataMiscellaneaous = {
//       query: {
//         expenseType: "MISCELLENOUS",
//         $and: [
//           { createdAt: { $lte: new Date(endStartDate) } },
//           { createdAt: { $gte: new Date(newStartDate) } },
//         ],
//       },
//     };
//     this.props.getAllExpanses(formData);
//     this.props.getMiscellaneousExpense(formDataMiscellaneaous);
//   };

//   renderDateFromTo = () => {
//     return (
//       <div className="datepicker-no-border datepicker-no-border--expenses">
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
//       renderButtonAndSearchInput
//   ============================================================*/
//   renderButtonAndSearchInput = () => {
//     const { selectedOption } = this.state;
//     return (
//       <div className="row mx-0 justify-content-between subscription-btn-search-div">
//         <div className="row mx-0">
//           <div className="mr-50">
//             <Select
//               isSearchable={false}
//               className="react-select-container react-select-container--finances"
//               classNamePrefix="react-select-elements"
//               value={selectedOption}
//               onChange={this.handleChangeDropdown}
//               options={
//                 isLocalStorageOrgCompanyTypeService ? options : productOptions
//               }
//               placeholder="Select"
//             />
//           </div>
//         </div>
//         <div className="row mx-0">
//           {this.renderDateFromTo()}
//           <SearchInput
//             name="searchInput"
//             placeholder="Search"
//             onChange={this.handleChangeSearchInput}
//             value={this.state.SearchInput}
//           />
//         </div>
//       </div>
//     );
//   };

//   /*============================================================
//       renderExpensesTable
//   ============================================================*/
//   // handlers
//   handleOnClickDeleteIcon = (expanseData) => (e) => {
//     console.log("clicked on delete icon");
//     this.props.deleteExpanse(expanseData._id);
//   };

//   handleSortTableColumnData = (name) => (e) => {
//     console.log("sort data of column: ", name);
//   };

//   // renderExpensesTable
//   renderExpensesTable = () => {
//     const { allExpanses } = this.state;

//     let projectWiseExpanse =
//       !isEmpty(allExpanses) &&
//       allExpanses.filter(
//         (expanse) =>
//           expanse.expenseType === "PROJECT" &&
//           (expanse.status === "APPROVED" || expanse.status === "DRAFT")
//       );
//     // console.log(projectWiseExpanse);
//     return (
//       <>
//         {/* heading row */}
//         <div className="finances-table-thead">
//           <table className="finances-table finances-table--expense">
//             <thead>
//               <tr>
//                 <th>
//                   <span>Title</span>
//                 </th>
//                 {/* <th>
//                   <span>Desc</span>
//                 </th> */}
//                 {!isLocalStorageOrgCompanyTypeService && (
//                   <th>
//                     <span>Product Name</span>
//                   </th>
//                 )}
//                 <th>
//                   <span>Type</span>
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
//                     Subtotal <i className="fa fa-sort"></i>
//                   </span>
//                 </th>
//                 <th>
//                   <span
//                     className="cursor-pointer"
//                     onClick={this.handleSortTableColumnData("tax")}
//                   >
//                     Tax (%) <i className="fa fa-sort"></i>
//                   </span>
//                 </th>
//                 <th>
//                   <span
//                     className="cursor-pointer"
//                     onClick={this.handleSortTableColumnData("total")}
//                   >
//                     Total <i className="fa fa-sort"></i>
//                   </span>
//                 </th>
//                 {!isLocalStorageOrgCompanyTypeService && (
//                   <th>
//                     <span>Status</span>
//                   </th>
//                 )}
//                 <th>
//                   <span className="opacity-0">0</span>
//                 </th>
//               </tr>
//             </thead>
//           </table>
//         </div>
//         {/* content row */}
//         <div className="finances-table-tbody">
//           <table className="finances-table finances-table--expense">
//             <tbody>
//               {!isEmpty(projectWiseExpanse) && projectWiseExpanse !== false ? (
//                 projectWiseExpanse.map((expanse, index) => (
//                   <tr key={index}>
//                     <td>
//                       <span>{expanse.expenseTitle}</span>
//                     </td>
//                     {/* <td>
//                       <span>{expanse.expenseTitle}</span>
//                     </td> */}
//                     {!isLocalStorageOrgCompanyTypeService && (
//                       <td>
//                         <span>Lorem</span>
//                       </td>
//                     )}
//                     <td>
//                       <span>{expanse.BillingType}</span>
//                     </td>
//                     <td>
//                       <span>
//                         {dateFns.format(expanse.createdAt, "D-MMM-YYYY")}
//                       </span>
//                     </td>
//                     <td>
//                       <span>{expanse.subTotal}</span>
//                     </td>
//                     <td>
//                       <span>
//                         {!isEmpty(expanse.totalTax) ? expanse.totalTax : " Na"}{" "}
//                       </span>
//                     </td>
//                     <td>
//                       <span>{expanse.total}</span>
//                     </td>
//                     {!isLocalStorageOrgCompanyTypeService && (
//                       <td>
//                         <span>Active</span>
//                       </td>
//                     )}
//                     <td>
//                       <span className="row mx-0 flex-nowrap align-items-start">
//                         <Link
//                           to={{
//                             pathname: "/edit-expense",
//                             state: {
//                               expenseData: expanse,
//                             },
//                           }}
//                         >
//                           <i className="fa fa-pencil finances-table__fa-icon-edit"></i>
//                         </Link>
//                         <i
//                           className="fa fa-trash finances-table__fa-icon-delete"
//                           onClick={this.handleOnClickDeleteIcon(expanse)}
//                         ></i>
//                       </span>
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
//       </>
//     );
//   };

//   /*============================================================
//       renderMiscExpensesTable
//   ============================================================*/
//   // handlers
//   handleOnClickDeleteIconMisc = (expanseData) => (e) => {
//     console.log("clicked on delete icon");
//     this.props.deleteExpanse(expanseData._id);
//   };

//   handleSortTableColumnDataMisc = (name) => (e) => {
//     console.log("sort data of column: ", name);
//   };

//   // renderMiscExpensesTable
//   renderMiscExpensesTable = () => {
//     const { allExpanses, AllMiscellaneousExpense } = this.state;
//     // let miscellinousExpanse =
//     //   !isEmpty(allExpanses) &&
//     //   allExpanses.filter(
//     //     (expanse) =>
//     //       expanse.expenseType === "MISCELLENOUS" &&
//     //       (expanse.status === "APPROVED" || expanse.status === "DRAFT")
//     //   );

//     return (
//       <>
//         {/* heading row */}
//         <div className="finances-table-thead">
//           <table className="finances-table finances-table--miscExpense">
//             <thead>
//               <tr>
//                 <th>
//                   <span>Title</span>
//                 </th>
//                 {/* <th>
//                   <span>Desc</span>
//                 </th> */}
//                 {isLocalStorageOrgCompanyTypeService && (
//                   <th>
//                     <span>Type</span>
//                   </th>
//                 )}
//                 <th>
//                   <span
//                     className="cursor-pointer"
//                     onClick={this.handleSortTableColumnDataMisc("date")}
//                   >
//                     Date <i className="fa fa-sort"></i>
//                   </span>
//                 </th>
//                 <th>
//                   <span
//                     className="cursor-pointer"
//                     onClick={this.handleSortTableColumnDataMisc("subtotal")}
//                   >
//                     Subtotal <i className="fa fa-sort"></i>
//                   </span>
//                 </th>
//                 <th>
//                   <span
//                     className="cursor-pointer"
//                     onClick={this.handleSortTableColumnDataMisc("tax")}
//                   >
//                     Tax (%) <i className="fa fa-sort"></i>
//                   </span>
//                 </th>
//                 <th>
//                   <span
//                     className="cursor-pointer"
//                     onClick={this.handleSortTableColumnDataMisc("total")}
//                   >
//                     Total <i className="fa fa-sort"></i>
//                   </span>
//                 </th>
//                 {!isLocalStorageOrgCompanyTypeService && (
//                   <th>
//                     <span>Status</span>
//                   </th>
//                 )}
//                 <th>
//                   <span className="opacity-0">0</span>
//                 </th>
//               </tr>
//             </thead>
//           </table>
//         </div>
//         {/* content row */}
//         <div className="finances-table-tbody">
//           <table className="finances-table finances-table--miscExpense">
//             <tbody>
//               {!isEmpty(AllMiscellaneousExpense) &&
//               AllMiscellaneousExpense !== false ? (
//                 AllMiscellaneousExpense.map((expanse, index) => (
//                   <tr key={index}>
//                     <td>
//                       <span>{expanse.expenseTitle}</span>
//                     </td>
//                     {/* <td>
//                       <span>{expanse.expenseTitle}</span>
//                     </td> */}
//                     {isLocalStorageOrgCompanyTypeService && (
//                       <td>
//                         <span>{expanse.BillingType}</span>
//                       </td>
//                     )}
//                     <td>
//                       <span>
//                         {dateFns.format(expanse.createdAt, "D-MMM-YYYY")}
//                       </span>
//                     </td>
//                     <td>
//                       <span>{expanse.subTotal}</span>
//                     </td>
//                     <td>
//                       <span>
//                         {!isEmpty(expanse.totalTax) ? expanse.totalTax : " Na"}
//                       </span>
//                     </td>
//                     <td>
//                       <span>{expanse.total}</span>
//                     </td>
//                     {!isLocalStorageOrgCompanyTypeService && (
//                       <td>
//                         <span>Active</span>
//                       </td>
//                     )}
//                     <td>
//                       <span className="row mx-0 flex-nowrap align-items-start">
//                         <Link
//                           to={{
//                             pathname: "/edit-expense",
//                             state: {
//                               expenseData: expanse,
//                             },
//                           }}
//                         >
//                           <i className="fa fa-pencil finances-table__fa-icon-edit"></i>
//                         </Link>
//                         <i
//                           className="fa fa-trash finances-table__fa-icon-delete"
//                           onClick={this.handleOnClickDeleteIconMisc(expanse)}
//                         ></i>
//                       </span>
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
//       </>
//     );
//   };

//   /*============================================================
//       main
//   ============================================================*/
//   render() {
//     const { expenseTableOverviewCount } = this.state;
//     return (
//       <>
//         {/* counts */}
//         <div className="row mx-0 page-count-row">
//           <FinanceSummaryCard
//             summaryTitle="monthly expense($)"
//             startSummaryDate={this.state.startSummaryDate}
//             endSummaryDate={this.state.endSummaryDate}
//             handleChangeSummaryStart={this.handleChangeSummaryStart}
//             handleChangeSummaryEnd={this.handleChangeSummaryEnd}
//             handleOnClickSummaryDateArrowIcon={
//               this.handleOnClickSummaryDateArrowIcon
//             }
//             dataRow1Colm1="Billed expense"
//             dataRow1Colm2={
//               !isEmpty(expenseTableOverviewCount)
//                 ? expenseTableOverviewCount.billed
//                 : 0
//             }
//             dataRow1Colm3="Miscellaneous Expense"
//             dataRow1Colm4={
//               !isEmpty(expenseTableOverviewCount)
//                 ? expenseTableOverviewCount.misc
//                 : 0
//             }
//             dataRow2Colm1="unbilled Expense"
//             dataRow2Colm2={
//               !isEmpty(expenseTableOverviewCount)
//                 ? expenseTableOverviewCount.unbilled
//                 : 0
//             }
//             dataRow2Colm3="Subscription Cost"
//             dataRow2Colm4={
//               !isEmpty(expenseTableOverviewCount)
//                 ? expenseTableOverviewCount.subscription
//                 : 0
//             }
//           />
//         </div>

//         <div className="row mx-0">
//           {/* font-33-semiBold */}
//           <h3 className="expenses-project-name-text mb-30 pr-50">
//             Project Wise Expenses
//           </h3>
//           <GreenLinkSmallFont
//             //text="+ New Expense"
//             extraClassName="finances-expenses-add-btn"
//             text="New Expense"
//             path="/add-expense"
//           />
//         </div>

//         {/* button and search */}
//         {this.renderButtonAndSearchInput()}

//         {/* renderExpensesTable */}
//         {this.renderExpensesTable()}

//         {/* Miscellaneous Expenses */}
//         <h3 className="expenses-project-name-text expenses-project-name-text--expenses mt-30 mb-30 pt-20 ">
//           Miscellaneous Expenses
//         </h3>
//         {this.renderMiscExpensesTable()}
//       </>
//     );
//   }
// }

// const mapStateToProps = (state) => ({
//   allExpanses: state.finance.allExpanses,
//   expenseTableOverviewCount: state.finance.expenseTableOverviewCount,
//   AllMiscellaneousExpense: state.finance.AllMiscellaneousExpense,
// });

// export default connect(mapStateToProps, {
//   deleteExpanse,
//   expenseOverviewTableByDate,
//   getAllExpanses,
//   getMiscellaneousExpense,
// })(FinancesExpenses);
