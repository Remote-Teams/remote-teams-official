import React, { Component, Fragment } from "react";
import LeftNavbar from "../header/LeftNavbar";
import PageTitle from "../common/PageTitle";
import TopNavbar from "../header/TopNavbar";
import isEmpty from "./../../../store/validations/is-empty";
import SearchInput from "../common/SearchInput";
import GreenButtonSmallFont from "../common/GreenButtonSmallFont";
import { connect } from "react-redux";
import {
  getAllChatsAction,
  getAllUsersForChat,
  sendMessageForOfflinerUser,
  markChatAsRead,
} from "./../../../store/actions/chatAction";
import io from "socket.io-client";
import store from "../../../store/store";
import {
  SET_ALL_CHATING_OF_USERS,
  SET_NEW_MEESAGE_STATUS,
} from "./../../../store/types";
import dateFns from "date-fns";
import { fileUpload } from "./../../../store/actions/resourcesAction";
import { url } from "./../../../store/actions/config";
import {
  receiveMessage,
  checkOnlineUsers,
} from "./../../../store/actions/socketAction";
import { socket } from "./../dashboard/DashboardMain";
import Modal from "react-responsive-modal";
import GrayButtonSmallFont from "../common/GrayButtonSmallFont";
import InputFieldEmailTextPassword from "../common/InputFieldEmailTextPassword";
import DatePicker from "react-datepicker";
import { createToDo } from "./../../../store/actions/dashboardAction";
import ChatFeaturesIllustration from "../features-illustration/ChatFeaturesIllustration";

// emoji array
const emojiArray = [
  "😀",
  "😀",
  "😀",
  "😀",
  "😀",
  "😀",
  "😀",
  "😀",
  "😀",
  "😀",
  "😀",
  "😀",
  "🗺️",
  "⌛",
  "⏲️",
  "⏱️",
  "🎁",
  "🎉",
  "🎈",
  "💎",
  "💻",
  "📞",
  "📱",
  "📱",
  "🖨️",
  "💻",
  "📞",
  "📱",
  "📱",
];

// new chat modal
const list = ["Aaron McIntosh", "John Bell", "Aaron Bell"];

let feature = { name: "Chat", isDisabled: false };

class Chat extends Component {
  constructor() {
    super();
    this.state = {
      messageSearch: "",
      messageText: "",
      fileName: "",
      isMainEmojiClick: "",
      active: 0,
      // new chat modal
      open: false,
      selectedOption: "",
      dropdown: false,
      suggestionList: list,
      messageSent: [],
      messageRecieve: [],
      //chat
      toChatUser: {},
      allChating: [],
      selectedUserInfoForChat: {},
      chatUsers: [],
      hasSet: false,
      messageType: "",
      files: {},
      todoPopup: false,
      addToDoConfirmation: false,
      toDoDueDate: new Date(),
      toDoTitle: "",
    };
    receiveMessage((data) => {
      console.log(data);
      let messageRecieveArray = this.state.allChating;
      messageRecieveArray.push({
        createdAt: new Date().toISOString(),
        from: this.state.toChatUser,
        message: data.message,
        to: this.props.logedInUserId,
        files: data.files,
        messageType: data.messageType,
      });
      this.setState({
        allChating: messageRecieveArray,
      });
    });

    checkOnlineUsers((data) => {
      console.log(data);
      this.setState({
        onlineUsers: data,
      });
    });
  }

  /*============================================
              Lifecycle Method
================================================*/
  componentDidMount() {
    localStorage.removeItem("newMessage");
    store.dispatch({
      type: SET_NEW_MEESAGE_STATUS,
      payload: false,
    });
    this.props.getAllUsersForChat(this.props.logedInUserId);
    socket.emit("online_users", {});
  }

  static getDerivedStateFromProps(nextProps, nextState) {
    let featureArray = JSON.parse(localStorage.getItem("UserFeatures"));
    if (
      !isEmpty(nextProps.allChatUsers) &&
      nextProps.allChatUsers !== nextState.allChatUsers &&
      !nextState.hasSet
    ) {
      nextProps.markChatAsRead(nextProps.allChatUsers[0]._id);
      return {
        chatUsers: nextProps.allChatUsers,
        toChatUser: nextProps.allChatUsers[0]._id,
        selectedUserInfoForChat: nextProps.allChatUsers[0],
        hasSet: true,
      };
    }
    if (
      !isEmpty(nextProps.allChating) &&
      nextProps.allChating !== nextState.allChating
    ) {
      return {
        allChating: nextProps.allChating,
      };
    }
    if (!isEmpty(featureArray)) {
      let filteredFeature = featureArray.filter((ele) => ele === feature.name);
      if (!isEmpty(filteredFeature)) {
        feature.isDisabled = false;
      } else {
        feature.isDisabled = true;
      }
    }
    return null;
  }

  componentDidUpdate() {
    if (this.props.allChating !== this.state.allChating) {
      this.setState({
        allChating: this.props.allChating,
      });
    }
    if (this.props.allChatUsers !== this.state.chatUsers) {
      this.setState({
        chatUsers: this.props.allChatUsers,
      });
    }
  }

  componentWillUnmount() {
    // activeNotificationTabIndex
    localStorage.removeItem("newMessage");
    store.dispatch({
      type: SET_NEW_MEESAGE_STATUS,
      payload: false,
    });
  }

  /*
   * lifecycle methods for dropdown
   */

  /*
   * Model Event Handlers
   */

  onOpenModal = () => {
    this.setState({
      open: true,
      selectedOption: "",
      dropdown: false,
      suggestionList: list,
    });
  };

  onCloseModal = () => {
    this.setState({
      open: false,
      todoPopup: false,
      addToDoConfirmation: false,
    });
  };

  onDropdownKeyPress = (e) => {
    if (this.state.dropdown) {
      if (e.keyCode === 13) {
        this.dropDownToggler();
      }
    }
  };

  onDropdownClick = (e) => {
    if (this.state.dropdown) {
      if (!document.getElementById("selectedOption").contains(e.target)) {
        this.dropDownToggler();
      }
    }

    if (!document.getElementById("message-emoji-block-id").contains(e.target)) {
      this.setState({
        isMainEmojiClick: false,
      });
    }
  };

  onDropdownChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  };

  dropDownToggler = (e) => {
    this.setState({
      dropdown: !this.state.dropdown,
    });
  };

  dropDownSelect = (value) => (e) => {
    this.setState({
      selectedOption: value,
      dropdown: !this.state.dropdown,
    });
  };

  handleSubmitNewChat = (e) => {
    e.preventDefault();
    console.log(this.state);
    this.onCloseModal();
  };

  /*
   * Model Event Handlers end
   */

  /*
   *  handlers
   */
  handleOnChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  };

  callBackFileUpload = (data) => {
    console.log(data);
    this.setState({
      files: data,
      messageText: data.originalname,
    });
  };

  handleOnChangeFile = (e) => {
    const data = new FormData();
    // data.append("image", e.target.files[0].name);
    data.append("file", e.target.files[0]);
    this.setState({
      fileName:
        e.target.files.length > 0 ? e.target.files[0].name : e.target.value,
    });

    console.log("file selected: ", e.target.files[0].name);

    this.props.fileUpload(data, this.callBackFileUpload);
  };

  handleOnClickMainEmoji = () => {
    this.setState({
      isMainEmojiClick: true,
    });
  };

  handleOnClickSelectEmoji = (emoji) => (e) => {
    e.preventDefault();
    let msg = this.state.messageText;
    this.setState({
      isMainEmojiClick: false,
      messageText: msg + emoji,
    });
  };

  handleOnClickMessageCard = (val, user) => (e) => {
    e.preventDefault();
    this.setState({
      allChating: [],
      active: val,
      toChatUser: user._id,
      selectedUserInfoForChat: user,
    });
    this.props.getAllChatsAction(user._id);
    let formData = user;
    user.chats = [];
    this.props.markChatAsRead(user._id, formData);
  };

  handleOnSubmitSearch = (e) => {
    e.preventDefault();
    console.log(this.state.messageSearch);
  };

  handleOnSubmitMessage = (e) => {
    e.preventDefault();
    socket.emit("online_users", {});

    socket.on("online_users", (data) => {
      console.log(data);
    });

    socket.emit("send_message", {
      to: "84723cc0-2cd8-11ec-8c23-c3e42f43b782",
      message: "asdasd",
      files: [],
      messageType: "TEXT",
    });

    socket.on("receive_message", (data) => {
      console.log(data);
    });

    // const { toChatUser, onlineUsers, files } = this.state;
    // let onlineUserId = "";
    // if (!isEmpty(onlineUsers)) {
    //   onlineUserId = onlineUsers.filter((id) => id === toChatUser);
    //   // console.log(onlineUserId);
    // }
    // if (onlineUserId[0] === toChatUser) {
    //   // check sending data is of file type or text

    //   if (!isEmpty(files)) {
    //     let messageSentArray = this.state.allChating;
    //     e.preventDefault();
    //     // console.log(this.state.toChatUser);
    //     socket.emit("send_message", {
    //       to: this.state.toChatUser,
    //       message: this.state.messageText,
    //       files: files,
    //       messageType: "FILES",
    //     });
    //     // console.log("sent");
    //     messageSentArray.push({
    //       createdAt: new Date().toISOString(),
    //       from: this.props.logedInUserId,
    //       message: this.state.messageText,
    //       to: this.state.toChatUser,
    //       files: files,
    //       messageType: "FILES",
    //     });
    //     // console.log(messageSentArray);
    //     this.setState({
    //       // allChating: messageSentArray,
    //       files: {},
    //       messageText: "",
    //     });

    //     store.dispatch({
    //       type: SET_ALL_CHATING_OF_USERS,
    //       payload: messageSentArray,
    //     });
    //   } else {
    //     let messageSentArray = this.state.allChating;
    //     e.preventDefault();
    //     // console.log(this.state.toChatUser);
    //     socket.emit("send_message", {
    //       to: this.state.toChatUser,
    //       message: this.state.messageText,
    //       files: {},
    //       messageType: "TEXT",
    //     });
    //     // console.log("sent");
    //     messageSentArray.push({
    //       createdAt: new Date().toISOString(),
    //       from: this.props.logedInUserId,
    //       message: this.state.messageText,
    //       to: this.state.toChatUser,
    //       files: {},
    //       messageType: "TEXT",
    //     });
    //     // console.log(messageSentArray);
    //     this.setState({
    //       // allChating: messageSentArray,
    //       messageText: "",
    //     });

    //     store.dispatch({
    //       type: SET_ALL_CHATING_OF_USERS,
    //       payload: messageSentArray,
    //     });
    //   }
    // } else {
    //   if (!isEmpty(files)) {
    //     let userData = JSON.parse(localStorage.getItem("UserData"));
    //     let messageSentArray = this.state.allChating;
    //     // console.log("allow post api ");
    //     const formData = {
    //       message: this.state.messageText,
    //       from: this.props.logedInUserId,
    //       to: this.state.toChatUser,
    //       workspaceId: userData.workspaceId,
    //       files: this.state.files,
    //       messageType: "FILES",
    //     };

    //     messageSentArray.push({
    //       createdAt: new Date().toISOString(),
    //       from: this.props.logedInUserId,
    //       message: this.state.messageText,
    //       to: this.state.toChatUser,
    //       files: files,
    //       messageType: "FILES",
    //     });
    //     this.setState({
    //       // allChating: messageSentArray,
    //       messageText: "",
    //     });

    //     this.props.sendMessageForOfflinerUser(formData);
    //   } else {
    //     let userData = JSON.parse(localStorage.getItem("UserData"));

    //     let messageSentArray = this.state.allChating;
    //     // console.log("allow post api ");
    //     const formData = {
    //       message: this.state.messageText,
    //       from: this.props.logedInUserId,
    //       to: this.state.toChatUser,
    //       workspaceId: userData.workspaceId,
    //       files: {},
    //       messageType: "TEXT",
    //     };

    //     messageSentArray.push({
    //       createdAt: new Date().toISOString(),
    //       from: this.props.logedInUserId,
    //       message: this.state.messageText,
    //       to: this.state.toChatUser,
    //       files: {},
    //       messageType: "TEXT",
    //     });

    //     this.setState({
    //       // allChating: messageSentArray,
    //       messageText: "",
    //     });

    //     this.props.sendMessageForOfflinerUser(formData);
    //   }
    // }
  };

  /*
   * renderColm1TitleBlock
   */
  renderColm1TitleBlock = () => {
    const { userInfo } = this.state;

    // let dataToken = JSON.parse(localStorage.getItem("Data"));
    return (
      <div className="row m-0 dashboard-message__colm1__row1">
        {/* <img
          src={`${
            !isEmpty(this.props.userInfo) && this.props.userInfo.profileImage
          }&token=${dataToken.token}`}
          alt="person"
          className="dashboard-message__colm1__row1__img"
        /> */}
        <div className="row m-0 justify-content-between align-items-start flex-grow-1">
          <h1 className="font-21-semibold mr-30">
            {!isEmpty(userInfo) && userInfo.name}
          </h1>
        </div>
      </div>
    );
  };
  /*
   * renderColm1SearchBlock
   */
  renderColm1SearchBlock = () => {
    return (
      <>
        {/* search block */}
        <SearchInput
          containerClassName="chat-search-block"
          name="messageSearch"
          placeholder="Search"
          placeholder="Search"
          onChange={this.handleOnChange}
          value={this.state.messageSearch}
        />
      </>
    );
  };

  checkOnlineUserOrNot = (userId) => {
    const { onlineUsers } = this.state;
    let newId = "";
    if (!isEmpty(onlineUsers)) {
      newId = onlineUsers.filter((id) => id === userId);
      // console.log(newId);
    }

    return newId[0] === userId ? (
      <>
        {" "}
        <i className="fa fa-circle"></i> Online
      </>
    ) : (
      ""
    );
  };

  /*
   * renderColm1MessageCard
   */
  renderColm1MessageCard = () => {
    const { chatUsers } = this.state;

    if (!isEmpty(chatUsers)) {
      return chatUsers.map((user, index) => (
        <div
          onClick={this.handleOnClickMessageCard(index, user)}
          key={index}
          className={"message-colm1-card"}
        >
          <div className="message-colm1-card__text-img">
            <div className="message-colm1-card__text-bg-block">
              <span className="text-center text-uppercase">
                {user.firstName.charAt(0)}
                {user.lastName.charAt(0)}
              </span>
            </div>
            <div className="mr-30">
              <h2 className="text-capitalize">{user.name}</h2>
              <p>
                {!isEmpty(user.chats) &&
                  user.chats[user.chats.length - 1].message}
              </p>
            </div>
          </div>
          <div>
            <span className="font-18-regular message-colm1-card__available">
              {this.checkOnlineUserOrNot(user._id)}
            </span>
            {!isEmpty(user.chats) && (
              <div className="message-colm1-card__notification">
                <span>{user.chats.length}</span>
              </div>
            )}
          </div>
        </div>
      ));
    } else {
      return (
        <div className="no_users_found_for_chat  mt-30">
          <h3>No Users Found</h3>
        </div>
      );
    }

    // const { allChatUsers } = this.state;
    // let dataToken = JSON.parse(localStorage.getItem("Data"));
    // if (!isEmpty(allChatUsers)) {
    //   return allChatUsers.map((user, index) => (
    //     <div
    //       key={index}
    //       className={
    //         index === this.state.active
    //           ? "message-colm1-card message-colm1-card__active"
    //           : "message-colm1-card"
    //       }
    //       onClick={this.handleOnClickMessageCard(index, user)}
    //     >
    //       <div className="message-colm1-card__text-img">
    //         <div>
    //           <img
    //             src={`${user.profileImage}&token=${dataToken.token}`}
    //             alt="person"
    //             className="message-colm1-card__img"
    //           />
    //         </div>
    //         <div className="mr-30">
    //           <h2>{user.name}</h2>
    //           <p>
    //             <i className="fa fa-caret-right"></i>
    //             Lorem ipsum dolor sit amet.
    //           </p>
    //         </div>
    //       </div>
    //       <div className="message-colm1-card__notification">
    //         <span>10</span>
    //       </div>
    //     </div>
    //   ));
    // } else {
    //   return (
    //     <div className="no_users_found_for_chat  mt-30">
    //       <h3>No Users Found</h3>
    //     </div>
    //   );
    // }
  };

  /*
   * renderColm2MessageBlock
   */

  /*========================================================

              All Chat Display Fuctinality
   ==========================================================*/

  addToDoConfirm = () => {
    this.setState({
      addToDoConfirmation: true,
    });
  };

  handleChangeDate = (date) => {
    if (date === null) {
      this.setState({
        toDoDueDate: new Date(),
      });
    } else {
      this.setState({
        toDoDueDate: date,
      });
    }
  };

  callBackAddTodo = (status) => {
    if (status === 200) {
      this.setState({
        todoPopup: false,
        addToDoConfirmation: false,
      });
    }
  };

  addChatToDo = () => {
    console.log(this.state.toDoTitle, this.state.toDoDueDate);
    const formData = {
      name: this.state.toDoTitle,
      desc: "any description",
      dueDate: this.state.toDoDueDate.toISOString(),
      status: "NOT_STARTED",
    };

    this.props.createToDo(formData, this.callBackAddTodo);
  };

  renderAddToDo = () => {
    const { addToDoConfirmation } = this.state;
    return (
      <Fragment>
        <Modal
          open={this.state.todoPopup}
          onClose={this.onCloseModal}
          closeOnEsc={true}
          closeOnOverlayClick={false}
          center
          classNames={{
            overlay: "customOverlay",
            modal: "customModal customModal--addChatToDo",
            closeButton: "customCloseButton",
          }}
        >
          <span className="closeIconInModal" onClick={this.onCloseModal} />
          {addToDoConfirmation ? (
            <div className="add_chat_to_do">
              <h2>Add to do</h2>
              <div className="col-4 px-0">
                <InputFieldEmailTextPassword
                  containerClassName="container-login-flow-input container-login-flow-input--forms"
                  label="Title"
                  name="toDoTitle"
                  value={this.state.toDoTitle}
                  onChange={this.handleOnChange}
                  type="text"
                />
              </div>
              <div className="date-picker-common">
                <h3 className="font-18-bold-space-light-uppercase mb-20">
                  date
                </h3>
                <DatePicker
                  minDate={new Date()}
                  selected={this.state.toDoDueDate}
                  onChange={this.handleChangeDate}
                />
              </div>
              <GreenButtonSmallFont onClick={this.addChatToDo} text={"Add"} />
            </div>
          ) : (
            <div className="add_chat_to_do_popup_warning">
              <img
                src={require("./../../../assets/img/chat/addChatToDo.svg")}
                alt={""}
              />
              <h3>Do you want to add this message in your To-Do List?</h3>
              <GrayButtonSmallFont onClick={this.onCloseModal} text={"No"} />
              <GreenButtonSmallFont
                onClick={this.addToDoConfirm}
                text={"Yes"}
              />
            </div>
          )}
        </Modal>
      </Fragment>
    );
  };

  downloadFileHandler = (filesData) => {};

  messageRecieve = (chat) => {
    let userData = JSON.parse(localStorage.getItem("UserData"));
    // console.log(chat);
    return (
      <>
        {/* message received */}
        <div onClick={() => console.log(chat)} className="text-left">
          <div className="message-colm2-block__msg-received">
            {chat.messageType === "FILES" && (
              <a
                target="_blank"
                href={`${url}${!isEmpty(chat.files) &&
                  chat.files.fileUrlPath}&token=${userData.token}`}
                download
              >
                <i
                  onClick={this.downloadFileHandler(chat.files)}
                  className="fa fa-download"
                  aria-hidden="true"
                ></i>
              </a>
            )}
            <p className="font-18-regular">{chat.message}</p>
            <p className="message-colm2-block__msg-received-time">
              {dateFns.format(chat.createdAt, "hh:mm a")}
            </p>
          </div>
        </div>
      </>
    );
  };

  messageSent = (chat) => {
    let userData = JSON.parse(localStorage.getItem("UserData"));
    return (
      <>
        {/* message sent */}
        <div
          onClick={() =>
            this.setState({
              toDoTitle: chat.message,
              todoPopup: true,
            })
          }
          className="message-colm2-block__sent"
        >
          <div className="message-colm2-block__msg-sent">
            {chat.messageType === "FILES" && (
              <a
                target="_blank"
                href={`${url}${!isEmpty(chat.files) &&
                  chat.files.fileUrlPath}&token=${userData.token}`}
                download
              >
                <i
                  onClick={this.downloadFileHandler(chat.files)}
                  className="fa fa-download"
                  aria-hidden="true"
                ></i>
              </a>
            )}
            <p className="font-18-regular">{chat.message}</p>
            <p className="message-colm2-block__msg-received-time text-right">
              {dateFns.format(chat.createdAt, "hh:mm a")}
            </p>
          </div>
        </div>
      </>
    );
  };

  renderColm2MessageBlock = () => {
    const { allChating } = this.props;
    const { selectedUserInfoForChat, allChatUsers } = this.state;
    let messageReciev = this.state.toChatUser;
    let messageSent = this.props.logedInUserId;
    // console.log(messageSent);
    let dataToken = JSON.parse(localStorage.getItem("Data"));
    const constMessagesSentReceive = () => {
      // console.log(allChating);
      return (
        <>
          {!isEmpty(allChating) &&
            allChating.map((chat, index) => {
              return (
                <Fragment key={index}>
                  {chat.from === messageReciev
                    ? this.messageRecieve(chat)
                    : this.messageSent(chat)}
                </Fragment>
              );
            })}
          {/* {this.messageRecieve("")}
          {this.messageSent("")}
          {this.messageRecieve("")}
          {this.messageRecieve("")}
          {this.messageSent("")}
          {this.messageSent("")} */}
        </>
      );
    };
    return (
      <div>
        {/* title */}
        <div className="message-colm2-block__title">
          {/* {!isEmpty(allChatUsers) ? ( */}
          <div className="dashboard-message__colm1__row1__img_div">
            {/*<img
            src={require("../../../assets/img/dummy/member-female.png")}
            alt="person"
            className="dashboard-message__colm1__row1__img"
          />*/}
          </div>
          {/* ) : (
            <div className="no_users_found_for_chat">
              <h3>No User Found</h3>
            </div>
          )} */}
          {/*font-18-bold-space-light-uppercase color-white */}
          <h2 className="dashboard-message__colm1__row1__title">
            lorem
            {!isEmpty(selectedUserInfoForChat) && selectedUserInfoForChat.name}
            {/* Jen Doe */}
          </h2>
        </div>
        {/* messages */}
        <div className="message-colm2-block__container">
          {constMessagesSentReceive()}
        </div>

        <form onSubmit={this.handleOnSubmitMessage}>
          <div className="message-colm2-block__input-block">
            <input
              type="text"
              id="messageText"
              name="messageText"
              className="message-colm2-block__input"
              placeholder="Say Something.."
              onChange={this.handleOnChange}
              value={this.state.messageText}
            />
            <div className="message-colm2-block__element">
              <div className="message-colm2-block__element-file-block">
                <input
                  type="file"
                  title=""
                  className="message-colm2-block__element-file"
                  onChange={this.handleOnChangeFile}
                  hidden
                  id="chat-attachment"
                />
                {/*<span
                  className="font-24-semibold"
                  role="img"
                  aria-labelledby="emoji"
                >
                  📎
                </span>*/}
                <label htmlFor={"chat-attachment"}>
                  <div className="chat-pin-img-div">
                    <img
                      src={require("./../../../assets/img/icons/gradient-attachment-icon.svg")}
                      alt="chat attachement"
                      className="chat-pin-img"
                    />
                  </div>
                </label>
              </div>

              <div
                className="message-main-emoji-block"
                id="message-emoji-block-id"
              >
                {this.state.isMainEmojiClick && (
                  <div className="message-main-emoji-block__block1">
                    <ul className="message-emoji-block">
                      {emojiArray.map((emoji, index) => (
                        <li
                          key={index}
                          className="font-24-semibold"
                          role="img"
                          aria-labelledby="emoji"
                          onClick={this.handleOnClickSelectEmoji(emoji)}
                        >
                          {emoji}
                        </li>
                      ))}
                    </ul>
                    <i className="fa fa-caret-down"></i>
                  </div>
                )}
                <span
                  className="font-24-semibold cursor-pointer"
                  role="img"
                  aria-labelledby="emoji"
                  onClick={this.handleOnClickMainEmoji}
                >
                  &#128522;
                </span>
              </div>
              <span className="message-colm2-block__border-gray-right"></span>
              <GreenButtonSmallFont type="Submit" text="Send" />
            </div>
          </div>
        </form>
      </div>
    );
  };

  render() {
    console.log(feature);
    // console.log(this.state.files);
    // console.log(this.state.chatUsers);
    // console.log(this.state.selectedUserInfoForChat);

    // console.log(this.state.messageRecieve);
    // console.log(this.state.toChatUser);
    // console.log(this.state.allChating);
    // console.log(this.state.selectedUserInfoForChat);
    return (
      <>
        <div>
          {/* left navbar */}
          <LeftNavbar activeMenu="chat" />
          {this.renderAddToDo()}

          <div className="main-page-padding">
            {/* pagetitle and topnavbar */}
            <div className="pageTitle-topNavbar-div">
              <PageTitle title="chat" />
              <TopNavbar activeMenu={"chat"} />
            </div>
            {feature.isDisabled === false ? (
              <div className="dashboard-message">
                <div className="dashboard-message__colm1">
                  {/* {this.renderColm1TitleBlock()} */}
                  <div className="mb-20">{this.renderColm1SearchBlock()}</div>
                  <div className="dashboard-message__colm1__overflow-cards">
                    {this.renderColm1MessageCard()}
                  </div>
                </div>
                <div className="dashboard-message__colm2">
                  {this.renderColm2MessageBlock()}
                </div>
              </div>
            ) : (
              <>
                {/* "Show illustration component here" */}
                <ChatFeaturesIllustration />
              </>
            )}
          </div>
        </div>
      </>
    );
  }
}

const mapStateToProps = (state) => ({
  userData: state.auth.user.id,
  allChating: state.chats.allChating,
  logedInUserId: state.auth.user.id,
  allChatUsers: state.chats.allChatUsers,
});

export default connect(mapStateToProps, {
  getAllChatsAction,
  getAllUsersForChat,
  sendMessageForOfflinerUser,
  fileUpload,
  markChatAsRead,
  createToDo,
})(Chat);
