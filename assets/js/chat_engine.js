// this is the user side chat engine
class ChatEngine{
    //taking user email and chat-box id from frontend
    constructor(chatBoxId, userEmail){
        this.chatBox = $(`#${chatBoxId}`);
        this.userEmail = userEmail;

          //sending the connection request to the observer(server)
        //'connect' event is fired when new connection is fired
        this.socket = io.connect('http://:5000');

        //if userEmail exists then connectionHandler is called to detect the connection
        if(this.userEmail){
            this.connectionHandler();
        }

    }

    connectionHandler(){
        let self=this;

        //receives the request if connection is established from observer
        this.socket.on('connect', function(){
            console.log("Connection Established using sockets....");

        //user sending request to join room named ChatManch and sending some data    
        self.socket.emit('join_room',{
            user_email:self.userEmail,
            chatroom:'Chat-Manch'
        });

           //receives request when an user joined the chatroom named 'Chat-Manch' by detecting 'user_joined" event
           self.socket.on('user_joined',function(data){
            console.log('a user joined',data);
        });
    });

        // CHANGE :: send a message on clicking the send message button
        $('#send-message').click(function(){
            let msg = $('#chat-message-input').val();

            if (msg != ''){
                self.socket.emit('send_message', {
                    message: msg,
                    user_email: self.userEmail,
                    chatroom: 'codeial'
                });
            }
        });

         //receiving self message and other message 
        self.socket.on('receive_message', function(data){
            console.log('message received', data.message);

           //displaying message in dom
            let newMessage = $('<li>');

            let messageType = 'other-message';

            if (data.user_email == self.userEmail){
                messageType = 'self-message';
            }

            newMessage.append($('<span>', {
                'html': data.message
            }));

            newMessage.append($('<sub>', {
                'html': data.user_email
            }));

            newMessage.addClass(messageType);

            $('#chat-messages-list').append(newMessage);
        });


    }
}