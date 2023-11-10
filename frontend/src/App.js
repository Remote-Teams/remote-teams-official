import React, { Component, Fragment } from "react";
import "./App.scss";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
//redux setup
import { Provider } from "react-redux";
import store from "./store/store";
import PaymentPrivateRoute from "./store/Privateroute/PaymentPrivateRoute";

import "bootstrap/dist/css/bootstrap.min.css";
import "font-awesome/css/font-awesome.min.css";
import Default from "./components/Default";
import ErrorBoundary from "./components/ErrorBoundary";
import setAuthToken from "./store/utils/setAuthToken";
import {
  SET_LOGIN,
  SET_NEW_MEESAGE_STATUS,
  SET_NEW_ANNOUNCEMENT_STATUS,
  SET_NEW_NOTIFICATION_STATUS,
} from "./../src/store/types";

import DisplayGanttChart from "./components/desktop/gantt-chart/DisplayGanttChart";
import Resources from "./components/desktop/resources/Resources";
import Clients from "./components/desktop/clients/Clients";
import GanttChartTimeline from "./components/desktop/gantt-chart-timeline/GanttChartTimeline";
import DisplayGanttChart2 from "./components/desktop/gantt-chart-2/DisplayGanttChart2";
// import LoginFlow from "./components/desktop/auth/LoginFlow";
import AllProjects from "./components/desktop/allProjects/AllProjects";
import { DispalyDhtmlGantt } from "./components/desktop/dhtmlgantt/DispalyDhtmlGantt";
import { Sheduler } from "./components/desktop/scheduler/Sheduler";
import Demo from "./components/desktop/scheduler/demo";
import SignUpSuccessful from "./components/desktop/auth/SignUpSuccessful";
import LoginSignup from "./components/desktop/auth/LoginSignup";
import LoginFlowDashboard from "./components/desktop/auth/LoginFlowDashboard";
import UserProfile from "./components/desktop/Profile/UserProfile";
import LoginUsernamePassword from "./components/desktop/auth/LoginUsernamePassword";
import SuperAdminPrivateRoute from "./store/Privateroute/SuperAdminPrivateRoute";
import SetMemberPassword from "./components/desktop/auth/SetMemberPassword";
import PaymentSuccess from "./components/desktop/Payment/PaymentSuccess";
import ForgetPassword from "./components/desktop/auth/ForgetPassword";
import ForgetPasswordConfirmation from "./components/desktop/auth/ForgetPasswordConfirmation";
import UserResetPassword from "./components/desktop/auth/UserResetPassword";
import Payment from "./components/desktop/Payment/Payment";
import Calender from "./components/desktop/calender/Calender";
import DashboardMain from "./components/desktop/dashboard/DashboardMain";
import DashboardMainGrid from "./components/desktop/dashboard/DashboardMainGrid";
import PrivateRoute from "./store/Privateroute/PrivateRoute";
import ReportsMain from "./components/desktop/reports/ReportsMain";
import Finances from "./components/desktop/finances/Finances";
import Workspaces from "./components/super-admin/desktop/workspaces/Workspaces";
import Users from "./components/super-admin/desktop/workspaces/Users";
import Notes from "./components/desktop/notes/Notes";
import FinanceAddSubscription from "./components/desktop/finances/FinanceAddSubscription";
import Settings from "./components/desktop/Settings/Settings";
import SettingsAccess from "./components/desktop/Settings/SettingsAccess";
import SettingsOrganisation from "./components/desktop/Settings/SettingsOrganisation";
import FinanceAddExpense from "./components/desktop/finances/FinanceAddExpense";
import SettingsHelp from "./components/desktop/Settings/SettingsHelp";
import Notifications from "./components/desktop/notification/Notifications";
import FinanceAddInvoice from "./components/desktop/finances/FinanceAddInvoice";
import Annoucement from "./components/desktop/annoucement/Annoucement";
import AnnoucementCheckDetails from "./components/desktop/annoucement/AnnoucementCheckDetails";
import AddNewNotes from "./components/desktop/notes/AddNewNotes";
import AddNewAnnoucement from "./components/desktop/annoucement/AddNewAnnoucement";
import Vault from "./components/desktop/vault/Vault";
import Support from "./components/desktop/support/Support";
import SupportAddNewTicket from "./components/desktop/support/SupportAddNewTicket";
import Timesheet from "./components/desktop/timesheet/Timesheet";
import CalendarLeaveHistory from "./components/desktop/calender/CalendarLeaveHistory";
import AllProjectsDetail from "./components/desktop/all-projects-detail/AllProjectsDetail";
import Chat from "./components/desktop/chat/Chat";
import AllProjectExpenseAdd from "./components/desktop/all-project-expenses/AllProjectExpenseAdd";
import FinanceEditExpense from "./components/desktop/finances/FinanceEditExpense";
import FinanceEditInvoice from "./components/desktop/finances/FinanceEditInvoice";
import FinancesDisplayInvoice from "./components/desktop/finances/FinancesDisplayInvoice";
import AllProjectAddNewmember from "./components/desktop/all-projects-detail/AllProjectAddNewmember";
import SupportEditTicket from "./components/desktop/support/SupportEditTicket";
import SupportDisplayTicket from "./components/desktop/support/SupportDisplayTicket";
import ChatRobot from "./components/ChatRobot";
import SchedulerTwoMain from "./components/desktop/scheduler-two/SchedulerTwoMain";
import Proposals from "./components/desktop/proposals/Proposals";
import ProposalEditor from "./components/desktop/ProposalEditor/Component/ProposalMainEditorPanel";
import HighchartSankey from "./components/desktop/highcharts-examples/HighchartSankey";
import HighchartNetwork from "./components/desktop/highcharts-examples/HighchartNetwork";
import HighchartStream from "./components/desktop/highcharts-examples/HighchartStream";
import HighchartDependencyWheel from "./components/desktop/highcharts-examples/HighchartDependencyWheel";
import HighchartSplitPackedBubble from "./components/desktop/highcharts-examples/HighchartSplitPackedBubble";
import HighchartWindrose from "./components/desktop/highcharts-examples/HighchartWindrose";
import Workboard from "./components/desktop/workboard/Workboard";
import Toast from "light-toast";
import io from "socket.io-client";
import { url } from "./store/actions/config";
import isEmpty from "./store/validations/is-empty";
import { socket } from "./components/desktop/dashboard/DashboardMain";
import Modal from "react-responsive-modal";

import {
  notifications,
  checkOnlineUsers,
  receiveMessage,
} from "./store/actions/socketAction";
import ClientNew from "./components/desktop/clients/ClientNew";
import { SeeThroughDemo } from "./components/SeeThroughDemo";
import VideoCallingMain from "./components/desktop/video-calling/VideoCallingMain";
import VideoCallingStart from "./components/desktop/video-calling/VideoCallingStart";
import VideoCallingRejoin from "./components/desktop/video-calling/VideoCallingRejoin";
import VideoCallingJoinedMainScreen from "./components/desktop/video-calling/VideoCallingJoinedMainScreen";
import CreateNewWorkflow from "./components/desktop/workflow-create-new/CreateNewWorkflow";
import EditWorkflow from "./components/desktop/workflow-edit/EditWorkflow";
import WorkflowsMain from "./components/desktop/workflows/WorkflowsMain";
import WorkflowDetails from "./components/desktop/workflows/WorkflowDetails";
import WorkflowCardDetails from "./components/desktop/workflows/WorkflowCardDetails";
import AllProjectScrumDetails from "./components/desktop/all-project-scrum/AllProjectScrumDetails";
import PaymentMain from "./components/desktop/Payment/PaymentMain";
import CommandCentreMain from "./components/desktop/command-centre/CommandCentreMain";
import AddProjectNew from "./components/desktop/add-project-new/AddProjectNew";
import AddMemberNew from "./components/desktop/add-member-new/AddMemberNew";
import AllProjectAddDocs from "./components/desktop/all-project-docs/AllProjectAddDocs";
import AddNewClient from "./components/desktop/add-client-new/AddNewClient";
import LoginFlowWelcomeUser from "./components/desktop/auth/LoginFlowWelcomeUser";
import AllProjectDocsDetail from "./components/desktop/all-project-docs/AllProjectDocsDetail";
import WorkflowsAddNewMain from "./components/desktop/workflows-add-new/WorkflowsAddNewMain";
import WorkspaceSocialLogin from "./components/desktop/auth/WorkspaceSocialLogin";
import SettingsNew from "./components/desktop/settings-new/SettingsNew";
// import WorkflowEditNewMain from "./components/desktop/workflows-add-new/WorkflowEditNewMain";
import InstanceCardDetails from "./components/desktop/workflows/InstanceCardDetails";
import PreviewFeaturesMain from "./components/desktop/preview-features/PreviewFeaturesMain";
import Interceptor from "./store/Interceptor";

var userData = JSON.parse(localStorage.getItem("UserData"));
var newMessage = JSON.parse(localStorage.getItem("newMessage"));
var newAnnouncement = JSON.parse(localStorage.getItem("newAnnouncement"));
var newNotification = JSON.parse(localStorage.getItem("newNotification"));
var currentDate = new Date();
var currentTime = currentDate.getTime();
if (userData && currentTime < userData.tokenExpiresOn) {
  // console.log("checked");
  // Set auth token header auth
  setAuthToken(userData.token);
  store.dispatch({
    type: SET_LOGIN,
    payload: userData,
  });
}
if (newMessage === true) {
  store.dispatch({
    type: SET_NEW_MEESAGE_STATUS,
    payload: true,
  });
}
if (newAnnouncement === true) {
  store.dispatch({
    type: SET_NEW_ANNOUNCEMENT_STATUS,
    payload: true,
  });
}
if (newNotification === true) {
  store.dispatch({
    type: SET_NEW_NOTIFICATION_STATUS,
    payload: true,
  });
}

export class App extends Component {
  constructor() {
    super();
    this.state = {
      // require for responsive window
      windowWidth: window.innerWidth,
      notificationPopup: false,
      announcementTitle: "",
      announcementDescription: "",
    };
    notifications((data) => {
      console.log(data);
      if (data.notificationType === "ANNOUNCEMENT") {
        if (data.notification.from !== userData.id) {
          Toast.info("Got new announcement", 3000);
          this.setState({
            announcementTitle: data.notification.notification.title,
            announcementDescription: data.notification.notification.message,
            notificationPopup: true,
          });
        }
        localStorage.setItem("newAnnouncement", true);
        store.dispatch({
          type: SET_NEW_ANNOUNCEMENT_STATUS,
          payload: true,
        });
      } else {
        let notificationForUsers = data.notification.attendees;
        if (!isEmpty(notificationForUsers)) {
          let filterUsers = notificationForUsers.filter(
            (user) => user === userData.id
          );
          // console.log(filterUsers);
          if (!isEmpty(filterUsers)) {
            Toast.info("Got new notification", 3000);

            localStorage.setItem("newNotification", true);
            store.dispatch({
              type: SET_NEW_NOTIFICATION_STATUS,
              payload: true,
            });
          }
        }
        console.log(data);
      }
    });
    receiveMessage((data) => {
      console.log(data);
      if (data.to === userData.id) {
        localStorage.setItem("newMessage", true);
        store.dispatch({
          type: SET_NEW_MEESAGE_STATUS,
          payload: true,
        });
      }
    });
    // checkOnlineUsers((data) => {
    //   console.log(data);
    // });
  }

  /*========================================================
                mobile view event handlers
  ========================================================*/

  componentDidMount() {
    // setInterval(() => console.log("hello"), 1000);
    window.addEventListener("resize", this.handleWindowResize);
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.handleWindowResize);
  }

  handleWindowResize = () => {
    this.setState({
      windowWidth: window.innerWidth,
    });
  };

  /*========================================================
                end mobile view event handlers
  ========================================================*/

  /*===============================================
      Render Announcement and notification popup
  =================================================*/
  onCloseModal = () => {
    this.setState({
      notificationPopup: false,
    });
  };
  renderAnnouncementPopup = () => {
    const { notificationPopup } = this.state;
    return (
      <Fragment>
        <Modal
          open={notificationPopup}
          onClose={this.onCloseModal}
          closeOnEsc={true}
          closeOnOverlayClick={false}
          center
          classNames={{
            overlay: "customOverlay",
            modal:
              "customModal customModal--show_notification notification_and_announcement",
            closeButton: "customCloseButton",
          }}
        >
          <span className="closeIconInModal" onClick={this.onCloseModal} />
          <div className="announcemnt_show_popup">
            <h1>{this.state.announcementTitle}</h1>
            <div className="announcement_desription">
              {" "}
              <p>{this.state.announcementDescription}</p>
            </div>
          </div>
        </Modal>
      </Fragment>
    );
  };

  render() {
    return (
      <Provider store={store}>
        <Router>
          <ErrorBoundary>
            <Switch>
              {/* common routes */}
              <Route exact path="/see-demo" component={SeeThroughDemo} />
              <Route exact path="/workboard" component={Workboard} />
              <Route path="/clientNew" component={ClientNew} />
              <Route
                exact
                path="/highchart-sankey"
                component={HighchartSankey}
              />
              <Route
                exact
                path="/highchart-network"
                component={HighchartNetwork}
              />
              <Route
                exact
                path="/highchart-stream"
                component={HighchartStream}
              />
              <Route
                exact
                path="/highchart-dependency-wheel"
                component={HighchartDependencyWheel}
              />
              <Route
                exact
                path="/highchart-split-packed-bubble-chart"
                component={HighchartSplitPackedBubble}
              />
              <Route
                exact
                path="/highchart-windrose"
                component={HighchartWindrose}
              />
              {/* <Route exact path="/" component={Landing} /> */}
              <Route exact path="/chat-bot" component={ChatRobot} />
              <Route exact path="/gantt-chart" component={DisplayGanttChart} />
              <Route
                exact
                path="/gantt-chart-2"
                component={DisplayGanttChart2}
              />
              <Route
                exact
                path="/gantt-chart-timeline"
                component={GanttChartTimeline}
              />
              <Route exact path="/akshay-demo" component={DispalyDhtmlGantt} />
              <Route exact path="/scheduler" component={Sheduler} />
              <Route exact path="/scheduler-two" component={SchedulerTwoMain} />

              {/* super admin routes */}
              <Route exact path="/organization" component={Workspaces} />
              <Route exact path="/organization-workspace" component={Users} />
              {/* super admin routes end */}

              {/* end common */}

              {/* desktop routes */}
              {this.state.windowWidth >= 768 && (
                <Switch>
                  {/* <Route exact path="/" component={LoginFlow} /> */}
                  <Route exact path="/" component={LoginSignup} />
                  <Route
                    exact
                    path="/login"
                    component={LoginUsernamePassword}
                  />
                  <Route
                    path="/social-login"
                    component={WorkspaceSocialLogin}
                  />

                  <Route
                    exact
                    path="/login-dashboard"
                    component={LoginFlowDashboard}
                  />

                  <Route
                    exact
                    path="/welcome-user"
                    component={LoginFlowWelcomeUser}
                  />
                  <Route
                    exact
                    path="/congratulations"
                    component={SignUpSuccessful}
                  />
                  <Route
                    exact
                    path="/payment-success"
                    component={PaymentSuccess}
                  />
                  <Route
                    exact
                    path="/forgot-password"
                    component={ForgetPassword}
                  />
                  <Route
                    exact
                    path="/confirmation"
                    component={ForgetPasswordConfirmation}
                  />
                  <Route
                    path="/resetPassword/:id"
                    component={UserResetPassword}
                  />
                  <Route path="/join/:id" component={SetMemberPassword} />
                  <PaymentPrivateRoute
                    exact
                    path="/payment"
                    component={PaymentMain}
                  />
                  <PrivateRoute exact path="/resources" component={Resources} />
                  <PrivateRoute
                    exact
                    path="/add-new-client"
                    component={AddNewClient}
                  />
                  <PrivateRoute exact path="/clients" component={Clients} />
                  <PrivateRoute
                    exact
                    path="/add-new-project"
                    component={AddProjectNew}
                  />
                  <PrivateRoute
                    exact
                    path="/all-projects"
                    component={AllProjects}
                  />
                  <PrivateRoute
                    exact
                    path="/all-projects-detail"
                    component={AllProjectsDetail}
                  />
                  <PrivateRoute
                    exact
                    path="/all-projects-add-docs"
                    component={AllProjectAddDocs}
                  />
                  <PrivateRoute
                    exact
                    path="/all-projects-detail-doc/:id"
                    component={AllProjectDocsDetail}
                  />
                  <PrivateRoute
                    exact
                    path="/all-project-add-new-member"
                    component={AllProjectAddNewmember}
                  />
                  <PrivateRoute
                    exact
                    path="/add-member-new"
                    component={AddMemberNew}
                  />
                  <PrivateRoute
                    exact
                    path="/add-expense-project"
                    component={AllProjectExpenseAdd}
                  />
                  <PrivateRoute
                    exact
                    path="/all-projects-scrum-detail/:id"
                    component={AllProjectScrumDetails}
                  />
                  <PrivateRoute exact path="/profile" component={UserProfile} />
                  {/* video calling */}
                  <PrivateRoute
                    exact
                    path="/video-calling"
                    component={VideoCallingMain}
                  />
                  <PrivateRoute
                    exact
                    path="/video-call-starting"
                    component={VideoCallingStart}
                  />
                  <PrivateRoute
                    exact
                    path="/video-call-rejoin"
                    component={VideoCallingRejoin}
                  />
                  <PrivateRoute
                    exact
                    path="/video-call-joined"
                    component={VideoCallingJoinedMainScreen}
                  />
                  {/* video calling end */}
                  {/* workflow */}
                  {/* <Route
                    exact
                    path="/create-new-workflow"
                    component={CreateNewWorkflow}
                  /> 
                   <Route exact path="/edit-workflow" component={EditWorkflow} /> */}
                  <Route
                    exact
                    path="/workflow-add-new/:id"
                    component={WorkflowsAddNewMain}
                  />
                  {/*<Route
                    exact
                    path="/workflow-edit-new"
                    component={WorkflowEditNewMain}
                  />*/}
                  <Route
                    exact
                    path="/workflow-edit-new/:id"
                    component={WorkflowsAddNewMain}
                  />
                  <Route exact path="/workflows" component={WorkflowsMain} />
                  <Route
                    exact
                    path="/workflow-details/:id"
                    component={WorkflowDetails}
                  />
                  <Route
                    exact
                    path="/instance-details/:id"
                    component={InstanceCardDetails}
                  />
                  <Route
                    exact
                    path="/workflow-card-details/:id"
                    component={WorkflowCardDetails}
                  />
                  {/* workflows end */}
                  <PrivateRoute exact path="/calendar" component={Calender} />
                  <PrivateRoute
                    exact
                    path="/calendar-leave-history"
                    component={CalendarLeaveHistory}
                  />
                  <PrivateRoute exact path="/reports" component={ReportsMain} />
                  <PrivateRoute
                    exact
                    path="/dashboard"
                    component={DashboardMain}
                  />
                  {/* grid */}
                  <PrivateRoute
                    exact
                    path="/dashboard-grid"
                    component={DashboardMainGrid}
                  />
                  <PrivateRoute path="/finances" component={Finances} />
                  <PrivateRoute
                    path="/add-subscription"
                    component={FinanceAddSubscription}
                  />
                  <PrivateRoute
                    path="/add-expense"
                    component={FinanceAddExpense}
                  />
                  <PrivateRoute
                    path="/edit-expense"
                    component={FinanceEditExpense}
                  />
                  <PrivateRoute
                    path="/add-invoice"
                    component={FinanceAddInvoice}
                  />
                  <PrivateRoute
                    path="/edit-invoice"
                    component={FinanceEditInvoice}
                  />
                  <PrivateRoute
                    path="/display-invoice"
                    component={FinancesDisplayInvoice}
                  />
                  <PrivateRoute path="/settings-old" component={Settings} />
                  <PrivateRoute
                    path="/settings-access"
                    component={SettingsAccess}
                  />
                  <PrivateRoute
                    path="/settings-help"
                    component={SettingsHelp}
                  />
                  <PrivateRoute
                    path="/settings-organisation"
                    component={SettingsOrganisation}
                  />
                  <PrivateRoute path="/settings" component={SettingsNew} />
                  <PrivateRoute path="/chat" component={Chat} />
                  <PrivateRoute path="/notes" component={Notes} />
                  <PrivateRoute path="/manage-note" component={AddNewNotes} />
                  <PrivateRoute
                    path="/notifications"
                    component={Notifications}
                  />
                  <PrivateRoute path="/announcement" component={Annoucement} />
                  <PrivateRoute
                    path="/add-announcement"
                    component={AddNewAnnoucement}
                  />
                  <PrivateRoute
                    path="/announcement-check-details"
                    component={AnnoucementCheckDetails}
                  />
                  <PrivateRoute path="/vault" component={Vault} />
                  <PrivateRoute path="/support" component={Support} />
                  <PrivateRoute
                    path="/add-new-ticket"
                    component={SupportAddNewTicket}
                  />
                  <PrivateRoute
                    path="/edit-ticket"
                    component={SupportEditTicket}
                  />
                  <PrivateRoute
                    path="/display-ticket"
                    component={SupportDisplayTicket}
                  />
                  <PrivateRoute path="/timesheet" component={Timesheet} />
                  <PrivateRoute path="/proposals" component={Proposals} />
                  <PrivateRoute
                    exact
                    path="/proposal-editor"
                    component={ProposalEditor}
                  />
                  <PrivateRoute
                    exact
                    path="/proposal-editor/:id"
                    component={ProposalEditor}
                  />
                  <PrivateRoute
                    exact
                    path="/preview-features"
                    component={PreviewFeaturesMain}
                  />
                  {/** command center */}
                  <PrivateRoute
                    exact
                    path="/command-centre"
                    component={CommandCentreMain}
                  />
                  {/* super admin routes */}
                  <SuperAdminPrivateRoute
                    exact
                    path="/organization"
                    component={Workspaces}
                  />
                  <SuperAdminPrivateRoute
                    exact
                    path="/organization-workspace"
                    component={Users}
                  />
                  {/* super admin routes end */}
                  <Route component={Default} />
                </Switch>
              )}
              {/* end desktop routes */}

              {/* mobile routes */}
              {this.state.windowWidth <= 767 && (
                <Switch>
                  <Route component={Default} />
                </Switch>
              )}
              {/* end mobile routes */}
            </Switch>
          </ErrorBoundary>
        </Router>
        <span>{this.props.children}</span>
        {this.renderAnnouncementPopup()}
      </Provider>
    );
  }
}

export default App;
