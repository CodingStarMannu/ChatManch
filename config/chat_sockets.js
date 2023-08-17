

module.exports.chatSockets = function(socketServer){
    let io = require('socket.io')(socketServer,{
        cors:{
            origin: "http://localhost:8000"
        }
    });

    io.on('connection', function(socket){
        console.log("New connection received", socket.id);

        socket.on('disconnect', () => {
            console.log('Socket disconnected');
        });
      //server will receive request by subscriber to join chatroom by detection the 'join_room' event 
    socket.on('join_room',function(data){
        console.log('joining request received',data);

        //if request received then socket will join that chatroom
        // ---> this function will add subscriber to chatroom
        //if chatroom with name 'Chat-Manch' is already exists then user will enter and
        // if not exist then socket will create new and user will be enter
        socket.join(data.chatroom);

        //emit to all the other users in the chatroom that 'an user has joined the room by notifying them'
        io.in(data.chatroom).emit('user_joined',data);
    });

    // detect send_message and broadcast to everyone in the room
    socket.on('send_message', function(data){
        io.in(data.chatroom).emit('receive_message', data);
    });

});

}