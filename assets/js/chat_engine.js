

class ChatEngine {
  constructor(chatBoxId, userEmail, userId,username) {
    this.chatBox = $(`#${chatBoxId}`);
    this.userId = userId;
    this.userEmail = userEmail;
    this.userName = username;
    this.chatroom = `chat-${userId}`
    this.minimizeWindow();
    this.connect();

    // this.testSocket();
    // if (this.userEmail) {
    //   this.connectionHandler();
    // }
    // this.activeRoom();
  }

  minimizeWindow() {
    $(".minimize-window").each(function () {
      let flag = false;
      $(this).click(function () {
        if (!flag) {
          $("#chat-messages").css("display", "none");
          $(".chat-form").css("display", "none");
          $(".user-chat-box").css("bottom", "0%");
          $(".user-chat-box").css("height", "auto");
          flag = true;
        } else {
          $("#chat-messages").css("display", "block");
          $(".chat-form").css("display", "flex");
          $(".user-chat-box").css("bottom", "12%");
          $(".user-chat-box").css("height", "30vh");
          flag = false;
        }
        console.log("inside function");
      });
    });
  }

  connect() {
    let self = this;
    let chatBtn = $(".chat-on");
    let deleteChatBoxBtn = $(".delete-chat-box");
    let ids = [];
    let flag = [];

    for (let i = 0; i < chatBtn.length; i++) {
      ids[i] = $(chatBtn[i]).prop("id").split("-")[1];
      let chatOnBtn = $(`#chat-${ids[i]}`);
      flag[i] = false;

      $(chatOnBtn).click(async function () {
        // $(`#chat-box-${ids[i]}`).css("display", "block");
        if(!flag[i]){
          flag[i] = true;
           $.ajax({
          type: "POST",
          url:`/users/connect-with-chat/${ids[i]}`,
          success: function (data) {
            console.log('Data',data);
            self.connectionHandler(data.chatroom._id,ids[i]);
            let newChatbox = self.appendchatBox(data);
            $('#chat-boxes').prepend(newChatbox);
            // append messages into the chatbox

            for(let msg of data.chatroom.messages){
                if(msg.sender==self.userEmail){
                  let li = self.appendMsg(msg,'self-messages');
                  $(`#chat-messages-${data.user1._id}`).append(li);
                }else{
                  let li = self.appendMsg(msg,'other-messages');
                  $(`#chat-messages-${data.user1._id}`).append(li);
                }
            }
           },
          });
        }else{
          // if chat box is already appeared the just show the chat-box
          $(`#chat-box-${ids[i]}`).css('display','block');
        }


       // hide chat-box when delete btn pressed

        setInterval(() => {
          $(`#delete-chat-${ids[i]}`).click(function(){
            $(`#chat-box-${ids[i]}`).css('display','none');
          })
        },500);

      });
      

      // $(hideChatBoxBtn[i]).click(function () {
      //   $(`#chat-box-${ids[i]}`).css("display", "none");
      // });
    }

  };


  appendchatBox(chatroom){
    return $(`
        <div class = "user-chat-box" id = 'chat-box-${chatroom.user1._id}'>
             <div class = 'chatBox-heading'>
                <div style="font-family: sans-serif;text-transform: capitalize; font-weight:bold;">${chatroom.user1.name}</div>
                 <div>
                   <small class = 'minimize-window'><img src="https://img.icons8.com/ios/24/000000/restore-window.png"/></small>
                   <small id = 'delete-chat-${chatroom.user1._id}'><img src="https://img.icons8.com/small/24/000000/delete-message.png"/></small>
                </div>
              </div>
              <ul id ="chat-messages-${chatroom.user1._id}" class='chat-messages'>
              
              </ul>
            
            <div class="chat-form">
                   <textarea name="message" placeholder="Type your message..." id = "chat-message-input-${chatroom.user1._id}"></textarea>
                   <button id = 'send-message-${chatroom.user1._id}'><img src="https://img.icons8.com/color/48/000000/send-letter--v1.png"/></button>
            </div>
    
        </div>
        `);
  }

  appendMsg(data,className){
        return $(`
        <li class = '${className}'>
        <p>
          <span class = 'text'>${data.message}</span>
          <span class = 'message-time' >${data.time}</span>
        </p>
        
       </li>
        `)
  }

 



  connectionHandler(chatroom,id) {
             let self = this;
             console.log('chatroom =',chatroom);

             const socket = io.connect("http://localhost:5000");

             socket.on("connect", function(){

                socket.on('message',message =>{
                  console.log(message);
                })

               

                socket.emit("join_chatRoom",{
                  user_email: self.userEmail,
                  chatroom: chatroom
                });
        
                socket.on("user_joined", function (data) {
                  console.log("a user join chatroom", data);
                });
                // receive the status of user
                socket.on('user_status',function(data){
                  console.log(data);
                }) 


                $(`#send-message-${id}`).click(function () {
                  let message = $(`#chat-message-input-${id}`).val();
                  if (message != "") {
                      console.log(message);
                      socket.emit("send_message", {
                      message: message,
                      user_email: self.userEmail,
                      chatroom:chatroom,
                      username:self.userName,
                      chatroom_id:chatroom,
                      isStored:false,
                    });
                  }

                        $(`#chat-message-input-${id}`)[0].value = ""; // doing empty input box
                });

                socket.on('received_msg',  function (data) {
                  // store messages into database;
                  if(data.user_email==self.userEmail){
                      self.storeMessageIntodb(data);
                  }
                  // output message
                  self.outputMessage(data,id);
                  //scroll chatbox to bottom
                  $(`#chat-messages-${id}`)
                  .animate({ scrollTop: $(`#chat-messages-${id}`)[0].scrollHeight },1000);
                 });
                   // scroll chatbox to bottom;
                 $(`#chat-messages-${id}`)
                 .animate({ scrollTop: $(`#chat-messages-${id}`)[0].scrollHeight },1000);
                
             });  
    
  }

  outputMessage(data,id){
      let self = this;
    
      console.log("message is received by a user", data);
      let newMessage = $("<li>");
      let messageType = "other-messages";
      if (data.user_email == self.userEmail) {
        messageType = "self-messages";
      }

      newMessage.append(
        $("<p>", {
          html: `<span class = 'text'>${data.message}</span> <span class = 'message-time' >${moment().format('h:mm a')}`,
        })
      );

      newMessage.addClass(messageType);
      $(`#chat-messages-${id}`).append(newMessage);
  }
   
  storeMessageIntodb(data){
     
    if(!data.isStored){
      $.ajax({
        type:'POST',
        url:`/users/messages/save/?id=${data.chatroom_id}&&message=${data.message}&&email=${data.user_email}&&username=${data.username}&&time=${moment().format('h:mm a')}`,
  
        success:function(data){
           console.log('data',data);
        }
      })
      data.isStored = true;
    }

  }

  // activeRoom(){
  //   let self = this;
  //   $.ajax({
  //     type:'GET',
  //     url:`/users/chatbox/active/${self.userId}`,
  //     success:function(data){
  //       console.log(data);
  //       for(let i of data.chatroom){
  //        self.connectionHandler(i._id,i.user1);
  //       }
  //     }
  //   })
  // }

  
    
     

    

    
  
}


