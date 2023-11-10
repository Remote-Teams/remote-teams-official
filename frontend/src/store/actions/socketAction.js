import { url } from "./config";
import io from "socket.io-client";
import isEmpty from "../validations/is-empty";
import { socket } from "./../../components/desktop/dashboard/DashboardMain";

function checkSocketConnection(message) {
  socket.on("connect", (data) => {
    message("Socket Connected");
  });
}

function receiveMessage(output) {
  // listen for any messages coming through
  // of type 'chat' and then trigger the
  // callback function with said message
  socket.on("receive_message", (data) => {
    output(data);
  });
}

function checkOnlineUsers(output) {
  // setInterval(function() {
  //   socket.emit("online_users", {});
  //   socket.on("online_users", (data) => {
  //     output(data);
  //     // this.setState({
  //     //   onlineUsers: data,
  //     // });
  //   });
  // }, 5000);
  // socket.emit("online_users", {});
  socket.on("online_users", (data) => {
    output(data);
    // this.setState({
    //   onlineUsers: data,
    // });
  });
}

function notifications(output) {
  // listen for any messages coming through
  // of type 'chat' and then trigger the
  // callback function with said message
  socket.on("notifications", (data) => {
    output(data);
  });
}

export {
  notifications,
  checkSocketConnection,
  receiveMessage,
  checkOnlineUsers,
};
