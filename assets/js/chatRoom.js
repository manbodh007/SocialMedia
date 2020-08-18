
{
//   let connect = function () {
//     let chatBtn = $(".chat-on");
//     let hideChatBoxBtn = $(".hide-chat-box");
//     let ids = [];

//     for (let i = 0; i < chatBtn.length; i++) {
//       ids[i] = $(chatBtn[i]).prop("id").split("-")[1];
//       let chatOnBtn = $(`#chat-${ids[i]}`);

//       $(chatOnBtn).click(function () {
//         $(`#chat-box-${ids[i]}`).css("display", "block");
//         $.ajax({
//           type: "POST",
//           url:`/users/connect-with-chat/${ids[i]}`,
//           success: function (data) {
//             console.log(data);
//           },
//         });
//       });

//       $(hideChatBoxBtn[i]).click(function () {
//         $(`#chat-box-${ids[i]}`).css("display", "none");
//       });
//     }
//   };

//   connect();
//   console.log('chatengine',ChatEngine);
}
