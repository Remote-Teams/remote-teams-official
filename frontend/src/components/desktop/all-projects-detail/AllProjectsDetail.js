import React, { Component } from "react";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";
import PageTitle from "../common/PageTitle";
import LeftNavbar from "../header/LeftNavbar";
import TopNavbar from "../header/TopNavbar";
import GreenButtonSmallFont from "../common/GreenButtonSmallFont";
import GrayLinkSmallFont from "../common/GrayLinkSmallFont";
import GrayButtonSmallFont from "../common/GrayButtonSmallFont";
import AllProjectResources from "../all-project-resources/AllProjectResources";
import AllProjectScrum from "../all-project-scrum/AllProjectScrum";
import AllProjectExpenses from "../all-project-expenses/AllProjectExpenses";
import AllProjectFiles from "../all-project-files/AllProjectFiles";
import AllProjectDiscussion from "../all-project-discussion/AllProjectDiscussion";
import AllProjectHistory from "../all-project-history/AllProjectHistory";
import AllProjectPlanning from "../all-project-planning/AllProjectPlanning";
import AllProjectProgress from "../all-project-progress/AllProjectProgress";
import AllProjectOverview from "../all-project-overview/AllProjectOverview";
import AddKanBanList from "./../all-project-planning/AddKanBanList";
// import AddKanBanCard from "./../all-project-planning/AddKanBanCard";
import EditKanBanList from "./../all-project-planning/EditKanBanList";
import { connect } from "react-redux";
import { getProjectDataById } from "./../../../store/actions/projectAction";
import {
  // getAllBoards,
  // getStackOfPerticularBoard,
  updateStack,
  deleteStack,
} from "./../../../store/actions/kanbanAction";
import isEmpty from "../../../store/validations/is-empty";
import store from "../../../store/store";
import { SET_KANBAN_VIEW } from "./../../../store/types";
import Modal from "react-responsive-modal";
import InputFieldEmailTextPassword from "./../../../components/desktop/common/InputFieldEmailTextPassword";
import TextareaField from "./../../../components/desktop/common/TextareaField";
import DropdownIcon from "rc-dropdown";
import "rc-dropdown/assets/index.css";
import Menu, { Item as MenuItem, Divider } from "rc-menu";
import {
  getAllResourceAction,
  resourceSearchApi,
} from "./../../../store/actions/resourcesAction";
import {
  onScheduleIndicator,
  ScheduleIndicatorTaskCompletionByWeek,
  // avgCostOfEmployeePerHour,
  // toatalCostOfEmployeePerHour,
  getTaskStatusGrouping,
} from "./../../../store/actions/projectAction";
// import GreenLinkSmallFont from "../common/GreenLinkSmallFont";
import BreadcrumbMenu from "../common/BreadcrumbMenu";
import AllProjectDirectories from "../all-project-directories/AllProjectDirectories";
import AllProjectDocs from "../all-project-docs/AllProjectDocs";
import AllProjectWorkboard from "../all-project-workboard/AllProjectWorkboard";
import Loader from "react-loader-spinner";
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import ProjectWorkboardsFeaturesIllustration from "../features-illustration/ProjectWorkboardsFeaturesIllustration";
import ProjectDiscussionFeaturesIllustration from "../features-illustration/ProjectDiscussionFeaturesIllustration";
import ProjectProgressFeaturesIllustration from "../features-illustration/ProjectProgressFeaturesIllustration";
import ProjectDirectoriesFeaturesIllustration from "../features-illustration/ProjectDirectoriesFeaturesIllustration";
import ProjectDocsFeaturesIllustration from "../features-illustration/ProjectDocsFeaturesIllustration";
import ProjectScrumFeaturesIllustration from "../features-illustration/ProjectScrumFeaturesIllustration";

/*============================
          TabList
==============================*/

const tabListData = [
  {
    path: require("../../../assets/img/projects-detail/tab-icons/pd-overview.svg"),
    activePath: require("../../../assets/img/projects-detail/tab-icons/pd-overview-active.svg"),
    imgClass: "pd-tablist-img1",
    title: "overview",
    featureName: "Overview",
    isDisabled: false,
  },
  {
    path: require("../../../assets/img/projects-detail/tab-icons/pd-planning.svg"),
    activePath: require("../../../assets/img/projects-detail/tab-icons/pd-planning-active.svg"),
    imgClass: "pd-tablist-img2",
    title: "Planning",
    featureName: "Planning",
    isDisabled: false,
  },
  {
    path: require("../../../assets/img/projects-detail/tab-icons/pd-progress.svg"),
    activePath: require("../../../assets/img/projects-detail/tab-icons/pd-progress-active.svg"),
    imgClass: "pd-tablist-img3",
    title: "Progress",
    featureName: "Progress",
    isDisabled: false,
  },
  {
    path: require("../../../assets/img/projects-detail/tab-icons/pd-directories.svg"),
    activePath: require("../../../assets/img/projects-detail/tab-icons/pd-directories-active.svg"),
    imgClass: "pd-tablist-img4",
    title: "Directories",
    featureName: "Directories",
    isDisabled: false,
  },
  //{
  //   path: require("../../../assets/img/projects-detail/tab-icons/pd-overview.svg"),
  //  activePath: require("../../../assets/img/projects-detail/tab-icons/pd-overview-active.svg"),
  //  imgClass: "pd-tablist-img5",
  //  title: "Resources",
  //},
  {
    path: require("../../../assets/img/projects-detail/tab-icons/pd-docs.svg"),
    activePath: require("../../../assets/img/projects-detail/tab-icons/pd-docs-active.svg"),
    imgClass: "pd-tablist-img6",
    title: "Docs",
    featureName: "Docs",
    isDisabled: false,
  },
  {
    path: require("../../../assets/img/projects-detail/tab-icons/pd-scrums.svg"),
    activePath: require("../../../assets/img/projects-detail/tab-icons/pd-scrums-active.svg"),
    imgClass: "pd-tablist-img7",
    title: "Standup",
    featureName: "Scrum",
    isDisabled: false,
  },
  {
    path: require("../../../assets/img/projects-detail/tab-icons/pd-discussion.svg"),
    activePath: require("../../../assets/img/projects-detail/tab-icons/pd-discussion-active.svg"),
    imgClass: "pd-tablist-img8",
    title: "Discussion",
    featureName: "Discussions",
    isDisabled: false,
  },
  {
    path: require("../../../assets/img/projects-detail/tab-icons/pd-workboard.svg"),
    activePath: require("../../../assets/img/projects-detail/tab-icons/pd-workboard-active.svg"),
    imgClass: "pd-tablist-img9",
    title: "Workboard",
    featureName: "Work_Boards",
    isDisabled: false,
  },
  {
    path: require("../../../assets/img/projects-detail/tab-icons/pd-expenses.svg"),
    activePath: require("../../../assets/img/projects-detail/tab-icons/pd-expenses-active.svg"),
    imgClass: "pd-tablist-img10",
    title: "Expenses",
    featureName: "Expenses",
    isDisabled: false,
  },
  {
    path: require("../../../assets/img/projects-detail/tab-icons/pd-timeline.svg"),
    activePath: require("../../../assets/img/projects-detail/tab-icons/pd-timeline-active.svg"),
    imgClass: "pd-tablist-img11",
    title: "Timeline",
    featureName: "Timeline",
    isDisabled: false,
  },
];
// const workboardText = (
//   <>
//     <img
//       src={require("../../../assets/img/icons/workboard-icon.svg")}
//       alt="workboard"
//       className="all-project-workboard-img"
//     />
//     <span>Workboard</span>
//   </>
// );

export class AllProjectsDetail extends Component {
  constructor() {
    super();
    this.state = {
      kanBanView: false,
      dragStartData: {},
      dragStartCardData: {},
      dragStartCardIndex: {},
      kanbanCardDetailsPopup: false,
      editCardContentPopup: false,
      selectedCardName: "",
      selectedCardDescription: "",
      selectedCardIndex: "",
      selectedStackData: "",
      activeTabIndex: localStorage.getItem("activeProjectDetailTabIndex"),
    };
  }

  componentDidMount() {
    this.props.getProjectDataById(this.props.location.state.projectData._id);
    localStorage.setItem(
      "projectData",
      JSON.stringify(this.props.location.state.projectData)
    );
    // this.props.getAllBoards();
    // this.props.getAllResourceAction();
    this.props.resourceSearchApi({
      query: {},
    });
    if (!isEmpty(this.props.location.state.projectData)) {
      let projectData = this.props.location.state.projectData;

      this.props.onScheduleIndicator(projectData._id);
      this.props.ScheduleIndicatorTaskCompletionByWeek(projectData._id);
      // this.props.avgCostOfEmployeePerHour(projectData._id);
      // this.props.toatalCostOfEmployeePerHour(projectData._id);

      this.props.getTaskStatusGrouping(projectData._id);
    }

    this.setKanBanView();

    // console.log(this.props.location.state.projectData);
  }

  componentWillUnmount() {
    localStorage.removeItem("boardData");
    store.dispatch({
      type: SET_KANBAN_VIEW,
      payload: false,
    });
  }

  setKanBanView = () => {
    var boardData = JSON.parse(localStorage.getItem("boardData"));
    // console.log(boardData);
    if (!isEmpty(boardData)) {
      const formData = {
        pageNo: 1,
        pageSize: 10,
        query: {
          kanban: boardData._id,
        },
      };

      // this.props.getStackOfPerticularBoard(formData);
      store.dispatch({
        type: SET_KANBAN_VIEW,
        payload: true,
      });
    }
  };

  static getDerivedStateFromProps(nextProps, nextState) {
    let featureArray = JSON.parse(localStorage.getItem("UserFeatures"));
    if (
      !isEmpty(nextProps.singleProjectData) &&
      nextProps.singleProjectData !== nextState.singleProjectData
    ) {
      return {
        singleProjectData: nextProps.singleProjectData,
      };
    }
    if (
      !isEmpty(nextProps.kanBanView) &&
      nextProps.kanBanView !== nextState.kanBanView
    ) {
      return {
        kanBanView: nextProps.kanBanView,
      };
    }
    if (
      !isEmpty(nextProps.stackListOfBoard) &&
      nextProps.stackListOfBoard !== nextState.stackListOfBoard
    ) {
      return {
        stackListOfBoard: nextProps.stackListOfBoard,
      };
    }
    if (!isEmpty(featureArray)) {
      tabListData.forEach((feature) => {
        let filteredFeature = featureArray.filter(
          (ele) => ele === feature.featureName
        );
        if (
          feature.featureName !== "Overview" &&
          feature.featureName !== "Planning" &&
          feature.featureName !== "Discussions" &&
          feature.featureName !== "Expenses" &&
          feature.featureName !== "Timeline"
        )
          if (!isEmpty(filteredFeature)) {
            feature.isDisabled = false;
          } else {
            feature.isDisabled = true;
          }
      });
    }
    return null;
  }

  componentDidUpdate() {
    if (this.props.stackListOfBoard !== this.state.stackListOfBoard) {
      this.setState({
        stackListOfBoard: this.props.stackListOfBoard,
      });
    }
  }

  /*=================================================================
      handlers
  ==================================================================*/

  handleOnSelect = (val) => {
    // activeProjectDetailTabIndex
    localStorage.setItem("activeProjectDetailTabIndex", val);
    this.setState({ activeTabIndex: val });
    // // add resource and add expense after submit will required this indexvalue
    // // so we will removing item from localstorage in main all project page
  };

  renderAllProjectTabs = () => {
    const { singleProjectData, activeTabIndex } = this.state;
    let projectData = JSON.parse(localStorage.getItem("projectData"));

    const tabTitleList = [
      "Overview",
      "Planning",
      "Progress",
      "Directories",
      "Docs",
      "Scrum/Standup",
      "Discussion",
      "Workboard",
      "Expenses",
      "Timeline",
    ];

    console.log(tabListData);

    return (
      <>
        <LeftNavbar activeMenu="all projects" />
        <div className="main-page-padding">
          {/* pagetitle and topnavbar */}
          <div className="pageTitle-topNavbar-div">
            <PageTitle
              title={!isEmpty(projectData) && projectData.name}
              isLinkDisplay={true}
              linkPath="/add-new-project"
              linkText="+ New Project"
            />
            <TopNavbar />
          </div>
          {/* pagetitle and topnavbar end */}
          <BreadcrumbMenu
            menuObj={[
              {
                title: "Projects",
                link: "/all-projects",
              },
              {
                title: !isEmpty(projectData)
                  ? projectData.name
                  : "Project Name",
                link: {
                  pathname: "/all-projects-detail",
                  state: {
                    projectData: projectData,
                  },
                },
              },
              {
                title:
                  activeTabIndex === 0
                    ? tabTitleList[0]
                    : activeTabIndex === 1
                    ? tabTitleList[1]
                    : activeTabIndex === 2
                    ? tabTitleList[2]
                    : activeTabIndex === 3
                    ? tabTitleList[3]
                    : activeTabIndex === 4
                    ? tabTitleList[4]
                    : activeTabIndex === 5
                    ? tabTitleList[5]
                    : activeTabIndex === 6
                    ? tabTitleList[6]
                    : activeTabIndex === 7
                    ? tabTitleList[7]
                    : activeTabIndex === 8
                    ? tabTitleList[8]
                    : activeTabIndex === 9
                    ? tabTitleList[9]
                    : tabTitleList[0],
              },
            ]}
          />
          {/* <GrayLinkSmallFont
            path="/all-projects"
            //text="Back To All Projects"
            text="Go Back"
          />
          <GreenLinkSmallFont
            path="/workboard"
            text={workboardText}
            extraClassName="workboard-btn"
          /> */}
          <div className="profile_tabs_section profile_tabs_section--allProject">
            <Tabs
              defaultIndex={parseInt(
                localStorage.getItem("activeProjectDetailTabIndex")
              )}
              onSelect={this.handleOnSelect}
            >
              <TabList>
                {tabListData.map((data, index) => (
                  <Tab key={index}>
                    <div className="all-project-detail-img-title-div row mx-0 align-items-center justify-content-center flex-nowrap">
                      <img
                        src={data.path}
                        alt={data.title}
                        className={`all-project-detail-tab__inactive-img ${data.imgClass}`}
                      />
                      <img
                        src={data.activePath}
                        alt={data.title}
                        className={`all-project-detail-tab__active-img ${data.imgClass}`}
                      />
                      <span>{data.title}</span>
                    </div>
                  </Tab>
                ))}
                {/*<Tab>Overview</Tab>
                <Tab>Planning</Tab>
                <Tab>Progress</Tab>
                <Tab>Directories</Tab>
                {/* <Tab>Resources</Tab> 
                <Tab>Docs</Tab>
                <Tab>Scrum/Standup</Tab>
                <Tab>Discussion</Tab>
                <Tab>Workboard</Tab>
                <Tab>Expenses</Tab>
                <Tab>Timeline</Tab>*/}
              </TabList>

              <TabPanel>
                <AllProjectOverview />
              </TabPanel>
              <TabPanel>
                <AllProjectPlanning
                  singleProjectData={
                    !isEmpty(singleProjectData) && singleProjectData
                  }
                />
              </TabPanel>
              <TabPanel>
                {tabListData[2].isDisabled === false ? (
                  <AllProjectProgress />
                ) : (
                  <>
                    {/* "Show illustartion component here" */}
                    <ProjectProgressFeaturesIllustration />
                  </>
                )}
              </TabPanel>
              <TabPanel>
                {/* <AllProjectFiles /> */}
                {tabListData[3].isDisabled === false ? (
                  <AllProjectDirectories />
                ) : (
                  <>
                    {/* "Show illustartion component here" */}
                    <ProjectDirectoriesFeaturesIllustration />
                  </>
                )}
              </TabPanel>
              <TabPanel>
                {tabListData[4].isDisabled === false ? (
                  <AllProjectDocs />
                ) : (
                  <>
                    {/* "Show illustartion component here" */}
                    <ProjectDocsFeaturesIllustration />
                  </>
                )}
              </TabPanel>
              {/* <TabPanel>
                <AllProjectResources />
              </TabPanel> */}
              <TabPanel>
                {tabListData[5].isDisabled === false ? (
                  <AllProjectScrum />
                ) : (
                  <>
                    {/* "Show illustartion component here" */}
                    <ProjectScrumFeaturesIllustration />
                  </>
                )}
              </TabPanel>
              <TabPanel>
                {tabListData[6].isDisabled === false ? (
                  <AllProjectDiscussion
                    projectId={this.props.location.state.projectData._id}
                  />
                ) : (
                  <ProjectDiscussionFeaturesIllustration />
                )}
              </TabPanel>
              <TabPanel>
                {/* workboard */}
                {tabListData[7].isDisabled === false ? (
                  <AllProjectWorkboard />
                ) : (
                  <>
                    {/* "Show illustartion component here" */}
                    <ProjectWorkboardsFeaturesIllustration />
                  </>
                )}
              </TabPanel>
              <TabPanel>
                <AllProjectExpenses />
              </TabPanel>
              <TabPanel>
                <AllProjectHistory />
              </TabPanel>
            </Tabs>
          </div>
        </div>
      </>
    );
  };
  // projectData;

  /*===============================================================================================
                                              kanban view
  ================================================================================================*/
  onCloseModal = () => {
    this.setState({
      kanbanCardDetailsPopup: false,
      selectedCardName: "",
      selectedCardDescription: "",
    });
  };

  onCloseEditCardModal = () => {
    this.setState({
      kanbanCardDetailsPopup: true,
      editCardContentPopup: false,
    });
  };

  editCardHandler = () => {
    this.setState({
      editCardContentPopup: true,
    });
  };

  handleChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  };

  callBackUpdateCard = (status) => {
    this.setState({
      editCardContentPopup: false,
    });
  };

  callBackDeleteCard = (status) => {
    this.setState({
      kanbanCardDetailsPopup: false,
    });
  };

  deleteCardHandler = () => {
    const {
      selectedCardIndex,
      selectedStackData,
      selectedCardName,
      selectedCardDescription,
    } = this.state;

    let finalPreviousStackData = selectedStackData;
    let finalPreviousCardData = selectedStackData.cards;
    finalPreviousCardData.splice(selectedCardIndex, 1);
    // console.log(cardData);
    finalPreviousStackData.cards = finalPreviousCardData;
    console.log(finalPreviousStackData);

    this.props.updateStack(
      finalPreviousStackData._id,
      finalPreviousStackData,
      this.callBackDeleteCard
    );
  };

  updateCardHandler = () => {
    const {
      selectedCardIndex,
      selectedStackData,
      selectedCardName,
      selectedCardDescription,
    } = this.state;
    // console.log(selectedCardIndex, selectedStackData);
    let previousCardData = selectedStackData.cards;
    let previousStackData = selectedStackData;
    if (selectedCardIndex !== -1) {
      previousCardData[selectedCardIndex] = {
        name: selectedCardName,
        description: selectedCardDescription,
      };
    }

    previousStackData.cards = previousCardData;

    this.props.updateStack(
      previousStackData._id,
      previousStackData,
      this.callBackUpdateCard
    );

    console.log(previousCardData);
  };

  /*================================================
             Render Stack edit dropdown
  =================================================*/
  onSelect = (action, stackData) => {
    if (action === "edit") {
      console.log("edit", stackData);
    } else {
      console.log("delete", stackData);
      // this.props.deleteBoardById(stackData._id);
      this.props.deleteStack(stackData._id);
    }
  };

  renderStackEditDropdown = (stackData) => {
    // const { admin } = this.state;
    const { userRole } = this.props;
    const menu = (
      <Menu>
        <MenuItem onClick={() => this.onSelect("edit", stackData)}>
          <EditKanBanList stackData={stackData} />
        </MenuItem>
        <Divider />

        <MenuItem onClick={() => this.onSelect("delete", stackData)}>
          Delete Stack
        </MenuItem>
      </Menu>
    );

    return (
      <DropdownIcon
        trigger={["click"]}
        overlay={menu}
        animation="none"
        onVisibleChange={this.onVisibleChange}
      >
        <i className="fa fa-ellipsis-v" />
      </DropdownIcon>
    );
  };

  renderEditCardDetails = () => {
    const { editCardContentPopup } = this.state;
    return (
      <div>
        <Modal
          open={editCardContentPopup}
          onClose={this.onCloseEditCardModal}
          closeOnEsc={false}
          closeOnOverlayClick={false}
          center
          classNames={{
            overlay: "customOverlay",
            modal: "customModal customModal--editcardcontent",
            closeButton: "customCloseButton",
          }}
        >
          {/* close modal */}
          <span
            className="closeIconInModal"
            onClick={this.onCloseEditCardModal}
          />
          <div className="edit_card_deatils_container">
            {/*<h3 className="text-center">EDIT CARD</h3>*/}
            <h2 className="add-meeting-title add-meeting-title--create-module">
              Edit Card
            </h2>

            <InputFieldEmailTextPassword
              containerClassName="container-login-flow-input"
              //label="Name"
              placeholder="Name"
              name="selectedCardName"
              value={this.state.selectedCardName}
              onChange={this.handleChange}
              type="text"
              autoFocus={true}
              error={""}
            />
            <TextareaField
              containerClassName="container-login-flow-textarea container-login-flow-textarea--addCard"
              //label="Description"
              name="selectedCardDescription"
              value={this.state.selectedCardDescription}
              onChange={this.handleChange}
              placeholder="Description"
            />
            <div className="text-right">
              <GreenButtonSmallFont
                onClick={this.updateCardHandler}
                text={"Save"}
              />
            </div>
          </div>
        </Modal>
      </div>
    );
  };

  renderCardDetails = () => {
    const { kanbanCardDetailsPopup } = this.state;
    return (
      <div>
        <Modal
          open={kanbanCardDetailsPopup}
          onClose={this.onCloseModal}
          closeOnEsc={false}
          closeOnOverlayClick={false}
          center
          classNames={{
            overlay: "customOverlay",
            modal: "customModal customModal--carddetails",
            closeButton: "customCloseButton",
          }}
        >
          {/* close modal */}
          <span className="closeIconInModal" onClick={this.onCloseModal} />
          <div className="card_deatils_container">
            {/*<h3 className="text-center">{this.state.selectedCardName}</h3>*/}
            <h3 className="add-meeting-title mb-20">
              {this.state.selectedCardName}
            </h3>

            <div className="description_edit_icons">
              <p>Description</p>
              <div>
                <img
                  onClick={this.editCardHandler}
                  src={require("./../../../assets/img/kanban/edit.svg")}
                  alt=""
                />
                <img
                  onClick={this.deleteCardHandler}
                  src={require("./../../../assets/img/kanban/ic_delete_24px.svg")}
                  alt=""
                />
              </div>
            </div>
            <p className="card_description">
              {this.state.selectedCardDescription}
            </p>
          </div>
        </Modal>
      </div>
    );
  };

  /*==================================
        Drag And Drop Handler
  ===================================*/

  onDragEndHandler = (e) => {
    // e.target.style.opacity = "";
    // e.currentTarget.style.background = "#ffffff";
    // e.currentTarget.style.color = "#000000";
  };
  onDragStartHandler = (stackData, data, index) => (e) => {
    // console.log("Drag Start", stackData, data, index);

    this.setState({
      dragStartStackData: stackData,
      dragStartCardData: data,
      dragStartCardIndex: index,
    });
  };

  onDropHandler = (stackData) => (e) => {
    e.preventDefault();
    const {
      dragStartStackData,
      dragStartCardData,
      dragStartCardIndex,
    } = this.state;

    if (stackData !== dragStartStackData) {
      let finalPreviousStackData = dragStartStackData;
      let finalPreviousCardData = dragStartStackData.cards;
      finalPreviousCardData.splice(dragStartCardIndex, 1);
      // console.log(cardData);
      finalPreviousStackData.cards = finalPreviousCardData;
      // console.log(finalPreviousStackData);

      stackData.cards.push(dragStartCardData);
      // console.log(stackData);
      this.props.updateStack(
        finalPreviousStackData._id,
        finalPreviousStackData
      );
      this.props.updateStack(stackData._id, stackData);
    }

    // console.log(stackData);

    // console.log(this.state.dragStartData);
    // const { dragStartData } = this.state;

    // console.log("Drop Hanlder",e.dataTransfer, value );
  };
  onDragOverHandler = (e) => {
    e.preventDefault();
    // console.log("DragOver", e);
  };

  /*===================================
            Render Cards
  ====================================*/
  onCardClickHandler = (cardData, stackData, cardIndex) => (e) => {
    console.log(cardData, stackData, cardIndex);
    this.setState({
      kanbanCardDetailsPopup: true,
      selectedCardName: cardData.name,
      selectedCardDescription: cardData.description,
      selectedCardIndex: cardIndex,
      selectedStackData: stackData,
    });
  };

  renderCards = (stackData) => {
    let list =
      !isEmpty(stackData.cards) &&
      stackData.cards.map((card, index) => (
        <div
          onClick={this.onCardClickHandler(card, stackData, index)}
          key={index}
          className="list_single_card_container"
          draggable="true"
          onDragStart={this.onDragStartHandler(stackData, card, index)}
          onDragEnd={this.onDragEndHandler}
        >
          <p className="list_single_card_container__greenText">{card.name}</p>
        </div>
      ));
    return list;
  };

  backToBoardsHandler = () => {
    localStorage.removeItem("boardData");
    store.dispatch({
      type: SET_KANBAN_VIEW,
      payload: false,
    });
  };

  /*===========================================
             Scroll KanBan View
  =============================================*/

  sideScroll = (element, direction, speed, distance, step) => {
    let scrollAmount = 0;
    var slideTimer = setInterval(function() {
      if (direction === "left") {
        element.scrollLeft -= step;
      } else {
        element.scrollLeft += step;
      }
      scrollAmount += step;
      if (scrollAmount >= distance) {
        window.clearInterval(slideTimer);
      }
    }, speed);
  };

  nextHandler = () => {
    // console.log("hello");
    var container = document.getElementById("container");
    this.sideScroll(container, "right", 25, 300, 20);
  };

  prevHandler = () => {
    var container = document.getElementById("container");
    this.sideScroll(container, "left", 25, 300, 20);
  };

  renderKanBanViewOfPerticularBoard = () => {
    const { stackListOfBoard } = this.state;
    var boardData = JSON.parse(localStorage.getItem("boardData"));
    return (
      <>
        <LeftNavbar activeMenu="all projects" />
        <div className="main-page-padding">
          {/* pagetitle and topnavbar */}
          <div className="pageTitle-topNavbar-div">
            <PageTitle title={`${boardData.name}`} />
            <TopNavbar />
          </div>
          {/* pagetitle and topnavbar end */}
          <GrayButtonSmallFont
            onClick={this.backToBoardsHandler}
            //text="Back To All Boards"
            text="Go Back"
          />
        </div>
        <div style={{ marginLeft: "80px", marginBottom: "20px" }}>
          <img
            onClick={this.prevHandler}
            id="slideBack"
            src={require("./../../../assets/img/kanban/prev.svg")}
            alt=""
          />
          &nbsp;
          <img
            id="slide"
            onClick={this.nextHandler}
            src={require("./../../../assets/img/kanban/next.svg")}
            alt=""
          />
        </div>
        <div id="container" className="kanban_view_main_container ">
          {!isEmpty(stackListOfBoard) &&
            stackListOfBoard.map((stack, index) => {
              return (
                <div key={index} className="kanban_list_columns">
                  <div className="heads">
                    <div className="stack_heading_dropdown">
                      <h3 className="heads__title">
                        <span>{stack.name} </span>
                        {this.renderStackEditDropdown(stack)}
                      </h3>
                    </div>
                  </div>
                  <div
                    className="list_conatiner"
                    onDrop={this.onDropHandler(stack)}
                    onDragOver={this.onDragOverHandler}
                  >
                    {this.renderCards(stack)}
                    {/* <AddKanBanCard stackData={stack} /> */}
                  </div>
                </div>
              );
            })}

          <AddKanBanList />
        </div>
      </>
    );
  };

  /*=================================================================
      main
  ==================================================================*/
  render() {
    // console.log(this.state.stackListOfBoard);
    const { kanBanView } = this.state;
    const { loader } = this.props;
    return (
      <>
        {loader === true && (
          <Loader type="Triangle" color="#57cba1" className="remote-loader" />
        )}{" "}
        {this.renderEditCardDetails()}
        {this.renderCardDetails()}
        {this.renderAllProjectTabs()}
      </>
    );
  }
}

const mapStateToProps = (state) => ({
  singleProjectData: state.projects.singleProjectData,
  kanBanView: state.kanban.kanBanView,
  stackListOfBoard: state.kanban.stackListOfBoard,
  loader: state.auth.loader,
});

export default connect(mapStateToProps, {
  getProjectDataById,
  // getAllBoards,
  // getStackOfPerticularProject,
  updateStack,
  deleteStack,
  getAllResourceAction,
  onScheduleIndicator,
  ScheduleIndicatorTaskCompletionByWeek,
  // avgCostOfEmployeePerHour,
  // toatalCostOfEmployeePerHour,
  resourceSearchApi,
  getTaskStatusGrouping,
})(AllProjectsDetail);
