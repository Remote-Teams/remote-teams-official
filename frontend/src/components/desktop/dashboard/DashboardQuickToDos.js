import React, { useState, useEffect } from "react";
import Checkbox from "rc-checkbox";
import "rc-checkbox/assets/index.css";
import InputFieldEmailTextPassword from "../common/InputFieldEmailTextPassword";
import { useDispatch, useSelector } from "react-redux";
import {
  createToDo,
  updateToDo,
  deleteToDoById,
} from "./../../../store/actions/dashboardAction";
import isEmpty from "../../../store/validations/is-empty";
import dateFns, { format } from "date-fns";
import * as moment from "moment";
import { maxLengths } from "./../../../store/validations/maxLengths/MaxLengths";

export default function DashboardQuickToDos() {
  const dispatch = useDispatch();
  const [isAddSomethingToDo, setIsAddSomethingToDo] = useState(false);

  const [newToDo, setNewToDo] = useState({
    label: "",
  });
  const [editToDo, setEditToDo] = useState({
    label: "",
  });
  const [activeIndex, setActiveIndex] = useState(null);

  const [values, setValues] = useState({
    toDoList: [
      {
        label:
          "You can list your quick small tasks here and cross them off when done",
        value: true,
      },
      {
        label: "And Add new using the button",
        value: false,
      },
      {
        label: "Try it out!",
        value: false,
      },
    ],
  });

  const allToDo = useSelector((state) => state.dashboard.allToDo);

  useEffect(() => {
    if (!isEmpty(allToDo)) {
      let toDoList = [];
      // setValues(allToDo)
      allToDo.forEach((element) => {
        toDoList.push({
          label: element.name,
          value: element.status === "NOT_STARTED" ? false : true,
          data: element,
        });
      });
      setValues({
        ...values,
        toDoList: toDoList,
      });
      console.log(allToDo);
    } else {
      setValues({
        ...values,
        toDoList: [],
      });
    }
  }, [allToDo]);

  /*=======================================

             handler

  =======================================*/

  const handleAddSomethingToDo = () => {
    setIsAddSomethingToDo(!isAddSomethingToDo);
    console.log(isAddSomethingToDo);
    setActiveIndex(null);
  };

  const handleChangeCheckbox = (index, data) => (e) => {
    if (e.target.checked === false) {
      const formData = data.data;
      formData.status = "NOT_STARTED";

      dispatch(updateToDo(formData._id, formData));
    } else {
      const formData = data.data;
      formData.status = "COMPLATED";

      dispatch(updateToDo(formData._id, formData));
    }

    // let newValues = values.toDoList;
    // //newValues[index].label = e.target.value;
    // newValues[index].value = e.target.checked;
    // setValues({
    //   ...values,
    //   newValues,
    // });
    // console.log(values);
    setActiveIndex(null);
  };

  const handleEdit = (index, todoData) => (e) => {
    //console.log(todoData.data._id);
    setActiveIndex(index);
    console.log(activeIndex, "activeIndex");

    setEditToDo({
      ...editToDo,
      label: todoData.label,
    });
  };

  const handleDelete = (todoData) => (e) => {
    console.log("Onclick delete", todoData.data._id);
    dispatch(deleteToDoById(todoData.data._id));
  };

  const callBackAddTodo = () => {
    setIsAddSomethingToDo(!isAddSomethingToDo);
    setNewToDo({
      label: "",
    });
  };

  const handleSave = () => {
    console.log("Onclick save");
  };

  const handleOnChange = (e) => {
    setNewToDo({
      ...newToDo,
      [e.target.name]: e.target.value,
    });
  };

  const handleOnEditChange = (e) => {
    setEditToDo({
      ...editToDo,
      [e.target.name]: e.target.value,
    });
  };

  const handleAddNewToDo = (e) => {
    e.preventDefault();
    // let oldValues = values.toDoList;
    // //let newValues = newToDo;
    // let newValues = {
    //   label: newToDo.label.toString(),
    //   value: newToDo.value,
    // };

    // // console.log(newValues);

    // let finalValues = oldValues.push(newValues);

    // setValues({
    //   ...values,
    //   finalValues,
    // });
    const formData = {
      name: newToDo.label,
      desc: newToDo.label,
      dueDate: "",
      status: "NOT_STARTED",
    };
    dispatch(createToDo(formData, callBackAddTodo));

    // console.log(values.toDoList, oldValues.length);
  };

  const callbackUpdate = (status) => {
    if (status === 200) {
      setActiveIndex(null);
    }
  };

  const handleEditSave = (data) => (e) => {
    e.preventDefault();
    console.log(editToDo);

    const formData = data.data;
    formData.name = editToDo.label;
    formData.desc = editToDo.label;

    dispatch(updateToDo(formData._id, formData, callbackUpdate));
  };

  const handleEditClose = () => {
    setActiveIndex(null);
  };
  /*=======================================

             to do card

  =======================================*/
  const renderToDo = () => {
    return (
      <>
        {!isEmpty(values.toDoList) ? (
          <>
            {values.toDoList.map((data, index) => (
              <div
                className="dashboard-to-do-content-div row mx-0 align-items-center"
                key={index}
              >
                <div className="row mx-0 align-items-start">
                  <div className="customCheckbox customCheckbox--cmd-checkbox mt-10">
                    <Checkbox
                      id={`optionName${index}`}
                      value={data.value}
                      checked={data.value}
                      name="label"
                      onChange={handleChangeCheckbox(index, data)}
                    />
                  </div>
                  {index === activeIndex ? (
                    <> {renderEditTodo(data)} </>
                  ) : (
                    <>
                      <div className="dashboard-to-do-label-div">
                        <h4 className="font-24-regular dashboard-to-do-label">
                          {data.value ? (
                            <span className="dashboard-to-do-label-color-change">
                              <s> {data.label} </s>
                            </span>
                          ) : (
                            <>{data.label} </>
                          )}
                        </h4>
                        <h5 className="font-14-extraBold dashboard-to-do-time-text">
                          4hr ago
                        </h5>
                      </div>
                      <div className="row mx-0 align-items-center dashboard-to-do-btn-div">
                        <button onClick={handleEdit(index, data)}>
                          <img
                            src={require("../../../assets/img/icons/dashboard-to-do-edit-icon.svg")}
                            alt="edit"
                          />
                        </button>
                        <button onClick={handleDelete(data)}>
                          <img
                            src={require("../../../assets/img/icons/dashboard-to-do-delete-icon.svg")}
                            alt="delete"
                          />
                        </button>
                        <button className="mx-0" onClick={handleSave}>
                          <img
                            src={require("../../../assets/img/icons/dashboard-to-do-save-icon.svg")}
                            alt="save"
                          />
                        </button>
                      </div>{" "}
                    </>
                  )}
                </div>
              </div>
            ))}
          </>
        ) : (
          <div className="text-center to-do-not-found-div">
            <img
              src={require("../../../assets/img/illustrations/dashboard-to-do.png")}
              alt="to do"
              className="to-do-not-found-img"
            />
            <span className="no-to-do-found-text">No tasks found</span>
          </div>
        )}
      </>
    );
  };

  /*===========================================
                 renderEditTodo
  ============================================*/

  const renderEditTodo = (data) => {
    return (
      <div className="row mx-0 align-items-start to-do-edit-div">
        <InputFieldEmailTextPassword
          containerClassName="container-login-flow-input container-login-flow-input--forms container-login-flow-input--forms--edit-to-do"
          name="label"
          value={editToDo.label}
          onChange={handleOnEditChange}
          type="text"
          placeholder="Type your new To do here"
        />
        <button onClick={handleEditSave(data)} className="to-do-edit-check-btn">
          <i className="fa fa-check" />
        </button>
        <button onClick={handleEditClose} className="to-do-edit-close-btn">
          <i className="fa fa-close" />
        </button>
      </div>
    );
  };
  /*=======================================

             return

  =======================================*/

  return (
    <div className="dashboard-quick-to-dos-div">
      <div className="dashboard-quick-to-do-text-div1">
        <h2 className="font-24-bold">
          {dateFns.format(new Date(), "Do MMMM YYYY")}
        </h2>
        <h5 className="dashboard-quick-to-do-text1">
          {moment(new Date()).format("dddd")}
        </h5>
      </div>
      <div className="dashboard-todo-add-something-btn-div">
        {isAddSomethingToDo ? (
          <div className="row mx-0 align-items-start">
            <form noValidate onSubmit={handleAddNewToDo}>
              <InputFieldEmailTextPassword
                containerClassName="container-login-flow-input container-login-flow-input--forms container-login-flow-input--forms--to-do"
                name="label"
                value={newToDo.label}
                onChange={handleOnChange}
                type="text"
                placeholder="Type your new To do here"
                maxLength={maxLengths.char500}
              />
            </form>
            <button
              onClick={handleAddNewToDo}
              className="dashboard-add-to-do-plus-btn"
            >
              <i className="fa fa-plus" />
            </button>
          </div>
        ) : (
          <button
            onClick={handleAddSomethingToDo}
            className="dashboard-todo-add-something-btn"
          >
            <i className="fa fa-plus" />
            Add SomeThing to do
          </button>
        )}
      </div>
      {renderToDo()}
    </div>
  );
}
