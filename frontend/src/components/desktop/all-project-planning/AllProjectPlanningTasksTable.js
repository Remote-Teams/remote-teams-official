import React, { useState, useEffect } from "react";
// import { AgGridReact } from "ag-grid-react";
// import "ag-grid-community/dist/styles/ag-grid.css";
// import "ag-grid-community/dist/styles/ag-theme-alpine.css";
import isEmpty from "../../../store/validations/is-empty";
import { useSelector } from "react-redux";
import { format } from "date-fns";
import * as moment from "moment";

export default function AllProjectPlanningTasksTable() {
  const [values, setValues] = useState({
    allExpanses: [1],
    // columnDefs: [
    //   {
    //     headerName: "TASK TITLE",
    //     field: "TASK_TITLE",
    //     width: 170,
    //   },
    //   {
    //     headerName: "START DATE",
    //     field: "START_DATE",
    //     width: 150,
    //   },
    //   {
    //     headerName: "END DATE",
    //     field: "END_DATE",
    //     width: 150,
    //   },
    //   {
    //     headerName: "FROM TIME",
    //     field: "FROM_TIME",
    //     width: 130,
    //   },
    //   {
    //     headerName: "TO TIME",
    //     field: "TO_TIME",
    //     width: 130,
    //   },
    //   {
    //     headerName: "PRIORITY",
    //     field: "PRIORITY",
    //     width: 150,
    //   },
    //   {
    //     headerName: "MEMBERS",
    //     field: "MEMBERS",
    //     width: 170,
    //     cellRendererFramework: function(params) {
    //       const arr = JSON.parse(params.value);
    //       return (
    //         <>
    //           <div className="row mx-0 align-items-center all-project-task-table-member-list-block">
    //             {!isEmpty(arr)
    //               ? arr.map((data, index) => (
    //                   <p
    //                     key={index}
    //                     className="all-project-task-table-member-list-block__elmnt"
    //                   >
    //                     {arr[index]}
    //                   </p>
    //                 ))
    //               : ""}
    //           </div>
    //         </>
    //       );
    //     },
    //   },
    //   {
    //     headerName: "STAGE",
    //     field: "STAGE",
    //     width: 150,
    //   },
    // ],
    // rowData: [
    //   {
    //     TASK_TITLE: "UI Design",
    //     START_DATE: "12/12/12",
    //     END_DATE: "12/12/12",
    //     FROM_TIME: "10:00",
    //     TO_TIME: "16:00 ",
    //     PRIORITY: "High",
    //     MEMBERS: `["RM", "RM", "RM"]`,
    //     STAGE: "Ongoing",
    //   },
    // ],
  });

  const [TaskData, setTaskData] = useState([]);

  const allTasks = useSelector((state) => state.projects.allTasks);

  useEffect(() => {
    if (!isEmpty(allTasks)) {
      setTaskData(allTasks);
    } else {
      setTaskData();
    }
  }, [allTasks]);

  /*============================================================
      renderTaskTable
  ============================================================*/
  // const handleOnGridReady = () => {
  //   // console.log("on grid ready");
  // };

  const renderTaskTable = () => {
    return (
      <>
        {/* <div
          className="ag-theme-alpine-dark ag-grid-custom-table ag-grid-custom-table--reports"
          style={{
            height: "200px",
            width: "100%",
          }}
        >
          <AgGridReact
            defaultColDef={{
              resizable: true,
            }}
            onGridReady={handleOnGridReady}
            columnDefs={values.columnDefs}
            rowData={values.rowData}
          ></AgGridReact>
        </div> */}

        <div className="finances-table-thead">
          <table className="finances-table finances-table--expenses">
            <thead>
              <tr>
                <th>
                  <span>TASK TITLE</span>
                </th>
                <th>
                  <span>START DATE</span>
                </th>
                <th>
                  <span>END DATE</span>
                </th>
                <th>
                  <span>COMPLETION DATE</span>
                </th>
                {/* <th>
                  <span>TO TIME</span>
                </th> */}
                <th>
                  <span>PRIORITY</span>
                </th>
                <th>
                  <span>MEMBERS</span>
                </th>
                <th>
                  <span>STAGE</span>
                </th>
              </tr>
            </thead>
          </table>
        </div>
        <div className="finances-table-tbody finances-table-tbody--expenses">
          <table className="finances-table finances-table--expenses">
            <tbody>
              {!isEmpty(TaskData) ? (
                TaskData.map((data, index) => (
                  <tr key={index}>
                    <td>
                      <span>{data.name}</span>
                    </td>
                    <td>
                      <span> {moment(data.startDate).format("DD/MM/YY")}</span>
                    </td>
                    <td>
                      <span> {moment(data.endDate).format("DD/MM/YY")}</span>
                    </td>
                    <td>
                      <span>
                        {!isEmpty(data.completionDate)
                          ? moment(data.completionDate).format("DD/MM/YY")
                          : "NA"}
                      </span>
                    </td>
                    {/* <td>
                      <span>16:00</span>
                    </td> */}
                    <td>
                      <span>{data.priority}</span>
                    </td>
                    <td>
                      <div className="row mx-0 align-items-center all-project-task-table-member-list-block">
                        {!isEmpty(data.assignees)
                          ? data.assignees.map((data, index) => {
                              return (
                                <p
                                  key={index}
                                  className="all-project-task-table-member-list-block__elmnt"
                                >
                                  {`${!isEmpty(data.firstName) &&
                                    data.firstName.charAt(0)}${!isEmpty(
                                    data.lastName
                                  ) && data.lastName.charAt(0)}`}
                                </p>
                              );
                            })
                          : "NA"}
                      </div>
                    </td>
                    <td>
                      <span>{data.stage.name}</span>
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

  return <div className="expenses-table-div pr-0">{renderTaskTable()}</div>;
}
