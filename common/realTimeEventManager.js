const apis = require('../config/api-config');
var httpContext = require('express-http-context');
const io = apis.socketIO;
const socketClientManager = require('./socketClientManager')();
var currentContext = require('./currentContext');
const jwtTokenParser = require('./tokenParserUtil');
const chatService = require('../api/services/chat.service');
const notificationService = require('../api/services/notification.service');
const socketIORedis = require('socket.io-redis');
const configResolve = require("../common/configResolver");
const redisHost = configResolve.getConfig().redisHost;
const clientService = require('../api/services/client.service');
var clientModel = require("../api/models/client.model");
const redis = require('redis');



function initRealTimeEventManager() {

    io.adapter(socketIORedis({ host: redisHost, port: 6379 }));
// always authenticates the connection to the socket before allowing anything
    io.use(function (socket, next) {
        if (socket.handshake.query && socket.handshake.query.token) {
            const decoded = jwtTokenParser.parseToken(socket.handshake.query.token);
            if (decoded) {
                socket.decoded = decoded;
                next();
            } else {
                next(new Error('Invalid token'));
            }
        } else {
            next(new Error('Authentication error'));
        }
    })
        .on('connection', function (socket) {

            socketClientManager.addClient(socket);

            socket.on('disconnect', function () {
                socketClientManager.removeClient(socket);
            })
            //ability to send and receive messages
            socket.on('send_message', async (data) => {
                try {
                    const destSocketId = await socketClientManager.getUserByIdWithWorkspace(socket.decoded.user.workspaceId, data.to);

                    data['from'] = socket.decoded.user._id;
                    chatService.addChat(data, socket.decoded.user.workspaceId).then((res) => {
                        if (destSocketId) {
                            io.to(destSocketId).emit('receive_message', data);
                        } else {
                            console.log("failed to send message... User is offline... message saved.");
                        }
                    }).catch((err) => {
                        console.log("failed to save");
                    });
                } catch (err) {
                    console.error(err);
                }
            })
            //function for displaying the online users
            socket.on('online_users', function () {

                socketClientManager.getAvailableUsers(socket.decoded.user.workspaceId).then(data => {
                    socket.emit('online_users', data);
                }).catch((err) => {
                    console.error("Failed to emit online_users notification.");
                });

            })

            socket.on('notify', async (data) => {
                try {
                    if (data.to) {
                        let destSocketId;
                        if ((socket.decoded.sub === 'System_Token')) {
                            destSocketId = await socketClientManager.getUserById(data.to);
                        } else {
                            destSocketId = await socketClientManager.getUserByIdWithWorkspace(socket.decoded.user.workspaceId, data.to);
                        }

                        data['from'] = socket.decoded.user._id;
                        notificationService.addNotification(data, data.workspaceId).then((res) => {
                            if (destSocketId) {
                                io.to(destSocketId).emit('notifications', data);
                            } else {
                                console.log("failed to notify... User is offline... notification saved.");
                            }
                        }).catch((err) => {
                            console.log("failed to save");
                        });
                    }
                } catch (err) {
                    console.error("failed to notify");
                }
            })

            socket.on('notify_all', function (data) {
                var targetWorkspaceId;
                if (socket.decoded.sub === 'System_Token') {
                    targetWorkspaceId = data.workspaceId;
                } else {
                    targetWorkspaceId = socket.decoded.user.workspaceId;
                }

                socketClientManager.getAvailableClients(targetWorkspaceId).then(clients => {
                    data['from'] = socket.decoded.user._id;
                    data['to'] = '*';

                    notificationService.addNotification(data, targetWorkspaceId).then((res) => {
                        clients.forEach(c => io.to(c).emit('notifications', data));
                    }).catch((err) => {
                        console.log("failed to save");
                    });
                }).catch((err) => {
                    console.error("Failed to emit notify_all notification.");
                });
            })

            socket.on('notifyMeeting', async function (data) 
            {
                var targetWorkspaceId;
                if (socket.decoded.sub === 'System_Token') {
                    targetWorkspaceId = data.workspaceId;
                } else {
                    targetWorkspaceId = socket.decoded.user.workspaceId;
                }

                var attendees = data.attendeesUser;
                var rough=[];
                    attendees.push(socket.decoded.user._id);
                    for (i in attendees){
                    destSocketId = await socketClientManager.getUserById(attendees[i])
                    if(destSocketId!==null)
                    rough.push(destSocketId);
                 }
                socketClientManager.getAvailableClients(targetWorkspaceId).then(clients => {
                    data['from'] = socket.decoded.user._id;
                    data['to'] = '*';
                     notificationService.addNotification(data, targetWorkspaceId).then((res) => {
                        // for (i in rough){
                        //     clients.push(rough[i]);
                        // }
                        //clients.forEach(c => io.to(c).emit('notifications', data));
                        io.to(destSocketId).emit('notifications', data);

                    }).catch((err) => {
                        console.log("failed to save");
                    });
                }).catch((err) => {
                    console.error("Failed to emit notify_all notification.");
                });
            })


            socket.on('notifyProject', async function (data) 
            {
                var targetWorkspaceId;
                if (socket.decoded.sub === 'System_Token') {
                    targetWorkspaceId = data.workspaceId;
                } else {
                    targetWorkspaceId = socket.decoded.user.workspaceId;
                }

                var attendees = data.attendeesUser;
                var rough=[];
                    attendees.push(socket.decoded.user._id);
                    for (i in attendees){
                    destSocketId = await socketClientManager.getUserById(attendees[i])
                    if(destSocketId!==null)
                    rough.push(destSocketId);
                 }
                socketClientManager.getAvailableClients(targetWorkspaceId).then(clients => {
                    data['from'] = socket.decoded.user._id;
                    data['to'] = '*';
                     notificationService.addNotification(data, targetWorkspaceId).then((res) => {
                        // for (i in rough){
                        //     clients.push(rough[i]);
                        // }
                        //clients.forEach(c => io.to(c).emit('notifications', data));
                        io.to(destSocketId).emit('notifications', data);

                    }).catch((err) => {
                        console.log("failed to save");
                    });
                }).catch((err) => {
                    console.error("Failed to emit notify_all notification.");
                });
            })

            socket.on('notifyTicket', async function (data) 
            {
                var targetWorkspaceId;
                if (socket.decoded.sub === 'System_Token') {
                    targetWorkspaceId = data.workspaceId;
                } else {
                    targetWorkspaceId = socket.decoded.user.workspaceId;
                }

                var attendees = data.attendeesUser;
                var rough=[];
                    attendees.push(socket.decoded.user._id);
                    for (i in attendees){
                    destSocketId = await socketClientManager.getUserById(attendees[i])
                    if(destSocketId!==null)
                    rough.push(destSocketId);
                 }
                socketClientManager.getAvailableClients(targetWorkspaceId).then(clients => {
                    data['from'] = socket.decoded.user._id;
                    data['to'] = '*';
                     notificationService.addNotification(data, targetWorkspaceId).then((res) => {
                        // for (i in rough){
                        //     clients.push(rough[i]);
                        // }
                        //clients.forEach(c => io.to(c).emit('notifications', data));
                        io.to(destSocketId).emit('notifications', data);

                    }).catch((err) => {
                        console.log("failed to save");
                    });
                }).catch((err) => {
                    console.error("Failed to emit notify_all notification.");
                });
            })

            // setInterval(function(){
            //     //console.log(session.key);
            //     clientModel.countDocuments({}).then((data) => { 
            //         //console.log(data);
            //     io.emit('update', {"data": data});})
            //     clientService.getAllClientsCount().then((dataA) => { 
            //         //console.log(dataA);
            //     io.emit('count', {"dataA": dataA});})
            //    }, 10000);
            
              
            


        });
}



module.exports = {
    initRealTimeEventManager: initRealTimeEventManager
}
