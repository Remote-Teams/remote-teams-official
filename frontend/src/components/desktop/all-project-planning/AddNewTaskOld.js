import React, { useState, useEffect } from "react";
import Modal from "react-responsive-modal";
import InputFieldEmailTextPassword from "./../../desktop/common/InputFieldEmailTextPassword";
import GreenButtonSmallFont from "./../common/GreenButtonSmallFont";
import GrayButtonSmallFont from "./../common/GrayButtonSmallFont";
import DatePickerFromToDate from "./../common/DatePickerFromToDate";
import { createNewTaskAction } from "./../../../store/actions/projectAction";
import { connect } from "react-redux";
import Select from "react-select";
import isEmpty from "../../../store/validations/is-empty";
import { useDispatch } from "react-redux";
import { validateAddTask } from "./../../../store/validations/projectValidation/AddTaskValidation";

function AddNewTaskOld({ allModules }) {
  const dispatch = useDispatch();

  const [values, setValues] = useState({
    open: false,
    taskName: "",
    startDate: new Date(),
    endDate: new Date(),
    selectedModule: "",
    selectedSprint: "",
    moduleOptions: [],
    sprintOptions: [],
    errors: {},
  });

  useEffect(() => {
    let newArray =
      !isEmpty(allModules) &&
      allModules.map((client) => ({
        value: client._id,
        label: client.name,
        data: client,
      }));

    setValues({
      ...values,
      moduleOptions: newArray,
    });
  }, [allModules]);

  const handleChangeSelectModule = (selectedOption) => {
    // console.log(selectedOption);

    // console.log(`Option selected:`, selectedOption);
    let finalArray = [];
    selectedOption.data.sprints.forEach((sprint) => {
      if (!isEmpty(sprint._id)) {
        finalArray.push({
          value: sprint._id,
          label: sprint.name,
          data: sprint,
        });
      }
    });

    setValues({
      ...values,
      selectedModule: {
        value: selectedOption.value,
        label: selectedOption.label,
      },
      sprintOptions: finalArray,
      selectedSprint: "",
      errors: {},
    });
  };

  const handleChangeSelectSprint = (selectedOption) => {
    console.log(selectedOption);
    setValues({ ...values, selectedSprint: selectedOption, errors: {} });
    console.log(`Option selected:`, selectedOption);
  };

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

  const handleChange = (e) => {
    setValues({
      ...values,
      [e.target.name]: e.target.value,
      errors: {},
    });
  };

  const onOpenModal = () => {
    // setDropdownOption();
    setValues({
      ...values,
      open: true,
    });
  };

  // const setDropdownOption = () => {

  //   let newArray =
  //     !isEmpty(allModules) &&
  //     allModules.map((client) => ({
  //       value: client._id,
  //       label: client.name,
  //       data: client,
  //     }));

  //     setValues({
  //       ...values,
  //     moduleOptions: newArray,
  //   });
  // };

  const onCloseModal = () => {
    setValues({
      ...values,
      open: false,
    });
  };

  const callBackAddTask = (status) => {
    if (status === 200) {
      setValues({
        ...values,
        open: false,
      });
    }
  };

  const addSprintHandler = () => {
    // console.log(this.props.singleProjectData);
    var projectData = JSON.parse(localStorage.getItem("projectData"));

    const { errors, isValid } = validateAddTask(values);

    if (!isValid) {
      setValues({
        ...values,
        errors: errors,
      });
    } else {
      const formData = {
        name: values.taskName,
        module: values.selectedModule.value,
        project: projectData._id,
        sprint: values.selectedSprint.value,
        startDate: values.startDate.toISOString(),
        endDate: values.endDate.toISOString(),
        additionObjects: {},
        status: "UPCOMING",
      };
      dispatch(createNewTaskAction(formData, callBackAddTask));
    }

    // console.log(formData);
  };

  console.log(values.selectedModule);

  return (
    <div>
      <GrayButtonSmallFont onClick={onOpenModal} text={"Add Task"} />
      <Modal
        open={values.open}
        onClose={onCloseModal}
        closeOnEsc={false}
        closeOnOverlayClick={false}
        center
        classNames={{
          overlay: "customOverlay",
          modal: "customModal customModal--addNewTask",
          closeButton: "customCloseButton",
        }}
      >
        {/* close modal */}
        <span className="closeIconInModal" onClick={onCloseModal} />

        {/*<h1 className="text-center">create new task</h1>*/}
        <h1 className="add-meeting-title add-meeting-title--create-module">
          create new task
        </h1>

        <InputFieldEmailTextPassword
          containerClassName="container-login-flow-input"
          label="Name"
          name="taskName"
          value={values.taskName}
          onChange={handleChange}
          type="text"
          autoFocus={true}
          error={!isEmpty(values.errors.taskName) && values.errors.taskName}
        />
        <div
          style={{ display: "flex", justifyContent: "space-between" }}
          className="col-12  pb-10 mb-40"
        >
          <div>
            {/*<h3 className="font-18-bold-space-light-uppercase mb-20">
                Module Name
        </h3>*/}
            <Select
              className="react-select-container react-select-container--addMember "
              classNamePrefix="react-select-elements"
              value={values.selectedOption}
              onChange={handleChangeSelectModule}
              options={values.moduleOptions}
              placeholder="Module Name"
              isSearchable={false}
            />
            {!isEmpty(values.errors.selectedModule) && (
              <p className="error-message">{values.errors.selectedModule}</p>
            )}
          </div>
          <div className="mb-40">
            {/*<h3 className="font-18-bold-space-light-uppercase mb-20">
                Sprint Name
      </h3>*/}
            <Select
              className="react-select-container react-select-container--addMember "
              classNamePrefix="react-select-elements"
              value={values.selectedSprint}
              onChange={handleChangeSelectSprint}
              options={values.sprintOptions}
              placeholder="Sprint Name"
              isSearchable={false}
            />
            {!isEmpty(values.errors.selectedSprint) && (
              <p className="error-message">{values.errors.selectedSprint}</p>
            )}
          </div>
        </div>

        <div className="col-12 pb-10">
          <DatePickerFromToDate
            //labelStart="Start date"
            startDateValue={values.startDate}
            //labelEnd="End date"
            endDateValue={values.endDate}
            handleChangeStart={handleChangeStart}
            handleChangeEnd={handleChangeEnd}
            placeholderStart="Start date"
            placeholderEnd="End date"
          />
        </div>
        <div className="text-center">
          <GreenButtonSmallFont onClick={addSprintHandler} text={"Finish"} />
        </div>
      </Modal>
    </div>
  );
}

export default AddNewTaskOld;

// import React, { Component } from "react";
// import Modal from "react-responsive-modal";
// import InputFieldEmailTextPassword from "./../../desktop/common/InputFieldEmailTextPassword";
// import GreenButtonSmallFont from "./../common/GreenButtonSmallFont";
// import GrayButtonSmallFont from "./../common/GrayButtonSmallFont";
// import DatePickerFromToDate from "./../common/DatePickerFromToDate";
// import { createNewTaskAction } from "./../../../store/actions/projectAction";
// import { connect } from "react-redux";
// import Select from "react-select";
// import isEmpty from "../../../store/validations/is-empty";

// export class AddNewTask extends Component {
//   constructor() {
//     super();
//     this.state = {
//       open: false,
//       taskName: "",
//       startDate: new Date(),
//       endDate: new Date(),
//       selectedModule: "",
//       selectedSprint: "",
//       moduleOptions: [
//         { value: "Annual", label: "Annual" },
//         { value: "Medical", label: "Medical" },
//         { value: "Unpaid", label: "Unpaid" },
//       ],
//       sprintOptions: [],
//     };
//   }

//   handleChangeSelectModule = (selectedOption) => {
//     this.setState({
//       selectedModule: selectedOption,
//       sprintOptions: [],
//       selectedSprint: "",
//     });
//     console.log(`Option selected:`, selectedOption);
//     let finalArray = [];
//     selectedOption.data.sprints.forEach((sprint) => {
//       if (!isEmpty(sprint._id)) {
//         finalArray.push({
//           value: sprint._id,
//           label: sprint.name,
//           data: sprint,
//         });
//       }
//     });
//     this.setState({
//       sprintOptions: finalArray,
//     });
//   };

//   handleChangeSelectSprint = (selectedOption) => {
//     this.setState({ selectedSprint: selectedOption });
//     console.log(`Option selected:`, selectedOption);
//   };

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

//   handleChange = (e) => {
//     this.setState({
//       [e.target.name]: e.target.value,
//     });
//   };

//   onOpenModal = () => {
//     this.setDropdownOption();
//     this.setState({
//       open: true,
//     });
//   };

//   setDropdownOption = () => {
//     const { allModules } = this.props;

//     let newArray =
//       !isEmpty(allModules) &&
//       allModules.map((client) => ({
//         value: client._id,
//         label: client.name,
//         data: client,
//       }));

//     this.setState({
//       moduleOptions: newArray,
//     });
//   };

//   onCloseModal = () => {
//     this.setState({
//       open: false,
//     });
//   };

//   callBackAddTask = (status) => {
//     if (status === 200) {
//       this.setState({
//         open: false,
//       });
//     }
//   };

//   addSprintHandler = () => {
//     // console.log(this.props.singleProjectData);

//     var projectData = JSON.parse(localStorage.getItem("projectData"));
//     const formData = {
//       name: this.state.taskName,
//       module: this.state.selectedModule.value,
//       project: projectData._id,
//       sprint: this.state.selectedSprint.value,
//       startDate: this.state.startDate.toISOString(),
//       endDate: this.state.endDate.toISOString(),
//       additionObjects: {},
//       status: "UPCOMING",
//     };
//     this.props.createNewTaskAction(formData, this.callBackAddTask);
//     // console.log(formData);
//   };

//   render() {
//     // console.log(this.state.sprintOptions);
//     const { open } = this.state;
//     return (
//       <div>
//         <GrayButtonSmallFont onClick={this.onOpenModal} text={"Add Task"} />
//         <Modal
//           open={open}
//           onClose={this.onCloseModal}
//           closeOnEsc={false}
//           closeOnOverlayClick={false}
//           center
//           classNames={{
//             overlay: "customOverlay",
//             modal: "customModal customModal--addNewTask",
//             closeButton: "customCloseButton",
//           }}
//         >
//           {/* close modal */}
//           <span className="closeIconInModal" onClick={this.onCloseModal} />

//           {/*<h1 className="text-center">create new task</h1>*/}
//           <h1 className="add-meeting-title add-meeting-title--create-module">
//             create new task
//           </h1>

//           <InputFieldEmailTextPassword
//             containerClassName="container-login-flow-input"
//             label="Name"
//             name="taskName"
//             value={this.state.taskName}
//             onChange={this.handleChange}
//             type="text"
//             autoFocus={true}
//             error={""}
//           />
//           <div
//             style={{ display: "flex", justifyContent: "space-between" }}
//             className="col-12  pb-10"
//           >
//             <div>
//               {/*<h3 className="font-18-bold-space-light-uppercase mb-20">
//                 Module Name
//         </h3>*/}
//               <Select
//                 className="react-select-container react-select-container--addMember mb-40"
//                 classNamePrefix="react-select-elements"
//                 value={this.state.selectedModule}
//                 onChange={this.handleChangeSelectModule}
//                 options={this.state.moduleOptions}
//                 placeholder="Module Name"
//                 isSearchable={false}
//               />
//             </div>
//             <div>
//               {/*<h3 className="font-18-bold-space-light-uppercase mb-20">
//                 Sprint Name
//       </h3>*/}
//               <Select
//                 className="react-select-container react-select-container--addMember mb-40"
//                 classNamePrefix="react-select-elements"
//                 value={this.state.selectedSprint}
//                 onChange={this.handleChangeSelectSprint}
//                 options={this.state.sprintOptions}
//                 placeholder="Sprint Name"
//                 isSearchable={false}
//               />
//             </div>
//           </div>

//           <div className="col-12 pb-10">
//             <DatePickerFromToDate
//               //labelStart="Start date"
//               startDateValue={this.state.startDate}
//               //labelEnd="End date"
//               endDateValue={this.state.endDate}
//               handleChangeStart={this.handleChangeStart}
//               handleChangeEnd={this.handleChangeEnd}
//               placeholderStart="Start date"
//               placeholderEnd="End date"
//             />
//           </div>
//           <div className="text-center">
//             <GreenButtonSmallFont
//               onClick={this.addSprintHandler}
//               text={"Finish"}
//             />
//           </div>
//         </Modal>
//       </div>
//     );
//   }
// }

// export default connect(null, {
//   createNewTaskAction,
// })(AddNewTask);
