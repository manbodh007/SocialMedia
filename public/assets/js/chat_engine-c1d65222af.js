class ChatEngine{constructor(s,e,a,t){this.chatBox=$("#"+s),this.userId=a,this.userEmail=e,this.userName=t,this.chatroom="chat-"+a,this.minimizeWindow(),this.connect()}minimizeWindow(){$(".minimize-window").each((function(){let s=!1;$(this).click((function(){s?($("#chat-messages").css("display","block"),$(".chat-form").css("display","flex"),$(".user-chat-box").css("bottom","12%"),$(".user-chat-box").css("height","30vh"),s=!1):($("#chat-messages").css("display","none"),$(".chat-form").css("display","none"),$(".user-chat-box").css("bottom","0%"),$(".user-chat-box").css("height","auto"),s=!0),console.log("inside function")}))}))}connect(){let s=this,e=$(".chat-on"),a=($(".delete-chat-box"),[]),t=[];for(let n=0;n<e.length;n++){a[n]=$(e[n]).prop("id").split("-")[1];let o=$("#chat-"+a[n]);t[n]=!1,$(o).click((async function(){t[n]?$("#chat-box-"+a[n]).css("display","block"):(t[n]=!0,$.ajax({type:"POST",url:"/users/connect-with-chat/"+a[n],success:function(e){console.log("Data",e),s.connectionHandler(e.chatroom._id,a[n]);let t=s.appendchatBox(e);$("#chat-boxes").prepend(t);for(let a of e.chatroom.messages)if(a.sender==s.userEmail){let t=s.appendMsg(a,"self-messages");$("#chat-messages-"+e.user1._id).append(t)}else{let t=s.appendMsg(a,"other-messages");$("#chat-messages-"+e.user1._id).append(t)}}})),setInterval(()=>{$("#delete-chat-"+a[n]).click((function(){$("#chat-box-"+a[n]).css("display","none")}))},500)}))}}appendchatBox(s){return $(`\n        <div class = "user-chat-box" id = 'chat-box-${s.user1._id}'>\n             <div class = 'chatBox-heading'>\n                <div style="font-family: sans-serif;text-transform: capitalize; font-weight:bold;">${s.user1.name}</div>\n                 <div>\n                   <small class = 'minimize-window'><img src="https://img.icons8.com/ios/24/000000/restore-window.png"/></small>\n                   <small id = 'delete-chat-${s.user1._id}'><img src="https://img.icons8.com/small/24/000000/delete-message.png"/></small>\n                </div>\n              </div>\n              <ul id ="chat-messages-${s.user1._id}" class='chat-messages'>\n              \n              </ul>\n            \n            <div class="chat-form">\n                   <textarea name="message" placeholder="Type your message..." id = "chat-message-input-${s.user1._id}"></textarea>\n                   <button id = 'send-message-${s.user1._id}'><img src="https://img.icons8.com/color/48/000000/send-letter--v1.png"/></button>\n            </div>\n    \n        </div>\n        `)}appendMsg(s,e){return $(`\n        <li class = '${e}'>\n        <p>\n         <span class = 'text'>${s.message}</span>\n         <span class = 'chat-user-name' >${s.time}</span>\n        </p>\n       </li>\n        `)}connectionHandler(s,e){let a=this;console.log("chatroom =",s);const t=io.connect("http://localhost:5000");t.on("connect",(function(){t.on("message",s=>{console.log(s)}),t.emit("join_chatRoom",{user_email:a.userEmail,chatroom:s}),t.on("user_joined",(function(s){console.log("a user join chatroom",s)})),t.on("user_status",(function(s){console.log(s)})),$("#send-message-"+e).click((function(){let n=$("#chat-message-input-"+e).val();""!=n&&(console.log(n),t.emit("send_message",{message:n,user_email:a.userEmail,chatroom:s,username:a.userName,chatroom_id:s})),$("#chat-messages-"+e).stop().animate({scrollTop:$("#chat-messages-"+e)[0].scrollHeight},1e3),$("#chat-message-input-"+e)[0].value=""})),t.on("received_message",(function(s){a.storeMessageIntodb(s),a.outputMessage(s,e)}))}))}outputMessage(s,e){console.log("message is received by a user",s);let a=$("<li>"),t="other-messages";s.user_email==this.userEmail&&(t="self-messages"),a.append($("<p>",{html:`<span class = 'text'>${s.message}</span> <span class = 'chat-user-name' >${moment().format("h:mm a")}`})),a.addClass(t),$("#chat-messages-"+e).append(a)}storeMessageIntodb(s){$.ajax({type:"POST",url:`/users/messages/save/?id=${s.chatroom_id}&&message=${s.message}&&email=${s.user_email}&&username=${s.username}&&time=${moment().format("h:mm a")}`,success:function(s){console.log("data",s)}})}}