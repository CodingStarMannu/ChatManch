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
    })
}