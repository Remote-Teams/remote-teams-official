const io = require('socket.io-client');
const configResolve = require("./configResolver");
const server_url = configResolve.getConfig().server_url;
const systemToken = configResolve.getConfig().systemToken;
var socket;

function initNotificationClient() {

    socket = io.connect(server_url, {
        "transports": ["false", "websocket"],
        "query": {
            "token": systemToken
        }
    });
    socket.on('connect', function () { console.log("server socket client connected..."); });
}

function notifyAll(type, payload, toUserWorkSpaceId, createdAt, name) {

    socket.emit("notify_all",
        {
            "notification": payload,
            "workspaceId": toUserWorkSpaceId,
            "notificationType": type,
            "createdAt":createdAt,
            "name":name
        }
    );
    socket.on('error', function (err) {
        console.log("SOCKET ERROR",err);
    });
}

function notify(type, payload, toUserWorkSpaceId, toUserId) {

    socket.emit("notify",
        {
            "to": toUserId,
            "notification": payload,
            "workspaceId": toUserWorkSpaceId,
            "notificationType": type
        }
    );
    socket.on('error', function (err) {
        console.log("SOCKET ERROR",err);
    });
}

function notifyMeeting(type, payload, toUserWorkSpaceId, toUserId, attendeesUser) {
    
        socket.emit("notifyMeeting", {
            "attendeesUser":attendeesUser,
            "to": toUserId,
            "notification": payload,
            "workspaceId": toUserWorkSpaceId,
            "notificationType": type
        });
        socket.on('error', function (err) {
            console.log("SOCKET ERROR", err);
        });
}

function notifyProject(type, payload, toUserWorkSpaceId, toUserId, attendeesUser) {
    
    socket.emit("notifyProject", {
        "attendeesUser":attendeesUser,
        "to": toUserId,
        "notification": payload,
        "workspaceId": toUserWorkSpaceId,
        "notificationType": type
    });
    socket.on('error', function (err) {
        console.log("SOCKET ERROR", err);
    });
}

function notifyTicket(type, payload, toUserWorkSpaceId, toUserId, attendeesUser) {
    
    socket.emit("notifyTicket", {
        "attendeesUser":attendeesUser,
        "to": toUserId,
        "notification": payload,
        "workspaceId": toUserWorkSpaceId,
        "notificationType": type
    });
    socket.on('error', function (err) {
        console.log("SOCKET ERROR", err);
    });
}

module.exports = {
    initNotificationClient: initNotificationClient,
    notifyAll: notifyAll,
    notify: notify,
    notifyMeeting: notifyMeeting,
    notifyProject: notifyProject,
    notifyTicket: notifyTicket
}