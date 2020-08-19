{
  let createPost = function () {
    let newPostForm = $("#create-post1"); // id should be create-post for ajax request
    newPostForm.submit(function (e) {
      e.preventDefault();
      $.ajax({
        type: "post",
        url: "/posts/create",
        data: newPostForm.serialize(),
        success: function (data) {
          console.log("data", data);
          let newPost = newPostDom(data.data.post);
          $("#posts-list-container").prepend(newPost);
          // when new post is posted then clearing the textarea
          $("#create-post>textarea")[0].value = "";
          handlePostMenuIcon();
          convertToAjax();
        },
        error: function (error) {
          console.log(error.responseText);
        },
      });
    });
  };

  let newPostDom = function (post) {
    return $(`<li id = "post-${post._id}"> 
                    <div class = 'post-menu-icon'>
                      <img src="https://img.icons8.com/color/30/000000/menu-2.png"/>
                    </div>
                    <div class = 'post-menu-option' >
                        <a class="delete-post-button" href="/posts/distroy/${post._id}" >
                           <small><button >Delete</button></small>
                        </a>
                          <br>
                        <a href="#">
                          <small><button >Edit</button></small>
                        </a>
                    </div>
                
                   <div class = 'post-creater'>
                        ${post.user.name}
                   </div>
                   <div class = 'post-content'>
                        ${post.content}
                   </div>
                   <div class = 'post-action'>
                       <div>
                            
                            <span>
                               <a class="toggle-like-button" data-likes="0" href="/likes/toggle/?id=${post._id}&&type=Post">
                               ${post.likes.length} <i class="material-icons" style="font-size:70px;color:rgb(0, 162, 255); position: relative; top:10px;">thumb_up</i>
                               </a>
                            <span>
                            <span>
                                 <small style="color: blue; font-size:38px;">
                                   ${post.comments.length}
                                    <i class="material-icons" style="font-size:70px;color:rgb(0, 162, 255);position: relative; top:18px;">chat</i>
                                  </small>
                            </span>
                       </div>
                   </div>
                  
              <div class = "post-comments">
                <form action="/comments/create/" method="POST" id="post-${post._id}-comments-form">
                    <input type = "text" name = "content" placeholder="comment" class = 'comment'>
                    <input type = "hidden" name = "post" value = "${post._id}">
                    <input type = "submit" value = "post" class = 'comment-btn'>
                </form>
              </div>
          </li>`);
  };

  let deletePost = function (deleteLink) {
    $(deleteLink).click(function (e) {
      e.preventDefault();

      $.ajax({
        type: "get",
        url: $(deleteLink).prop("href"),
        success: function (data) {
          $(`#post-${data.data.post_id}`).remove();
        },
        error: function (error) {
          console.log(error.responseText);
        },
      });
    });
  };

  let convertToAjax = function () {
    $("#posts-list-container>li").each(function () {
      let self = $(this);
      var deleteButton = $(" .delete-post-button", self);
      deletePost(deleteButton);
    });
  };

  let handlePostMenuIcon = function () {
    let menu = $(".post-menu-icon");
    let menuItem = $(".post-menu-option");

    for (let i = 0; i < menu.length; i++) {
      let flag = false;
      console.log(menu[i]);
      $(menu[i]).click(function () {
        console.log("menu", menuItem[i]);
        let toggler = menuItem[i].style.display;
        if (!flag) {
          menuItem[i].style.display = "block";
          flag = true;
        } else {
          menuItem[i].style.display = "none";
          flag = false;
        }
      });
    }
  };
  let handlePostImage = function () {
    let selectImg = document.getElementById("select-img");
    let uploadBtn = document.getElementById("upload-post");
    let textarea = document.getElementById("post-content");
    selectImg.addEventListener("click", function () {
      uploadBtn.click();
    });

    uploadBtn.addEventListener("change", function () {
      if (uploadBtn.value) {
        console.log("uploadbtn", $(uploadBtn));
        document.getElementById("uploaded-file-responce").innerText =
          "File added successfully";
      }
    });
  };

  handlePostMenuIcon(); // here i am handling the event listener
  createPost();
  convertToAjax();
  handlePostImage();
  // you need that dlete edit with evershow me the ejs pleasew me the lo
}
