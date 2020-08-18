const { constants } = require('crypto');

module.exports.chatSockets = function(socketServer){

  let io = require('socket.io')(socketServer);

  io.sockets.on('connection',function(socket){
         console.log('new connection received..');
         
         socket.emit('message','welcome to eroschat');

        
         socket.on('disconnect',function(){
           // socket broadcast
           io.emit('user_status','user left the chatroom');
           console.log('socket disconnected');
         })

      socket.on('join_chatRoom',function(data){
        // broadcast message to all user axcept joined user
        // socket.broadcast.emit('user_status','new user joined');
        
        console.log('joining request received',data);
        // join chatroom
        socket.join(data.chatroom);
        io.in(data.chatroom).emit('user_joined',data);
      })

      // receiving a message send by user
      socket.on('send_message',function(data){
         console.log('message received',data);
         io.in(data.chatroom).emit('received_message',data);
      });

  })


}