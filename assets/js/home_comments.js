{
   
    let createComment = function(){
        let Ids = [];
        let i=0;
        $('#posts-list-container>li').each(function(){
           Ids[i++] = $(this);
        });
        let postIds = [];
        for(let i=0;i<Ids.length;i++){
           postIds[i] = Ids[i].prop('id').split('-')[1];
        }
        for(let j=0;j<postIds.length;j++){

          let newComment = $(`#post-${postIds[j]}-comments-form`); 
          newComment.submit(function(e){
            e.preventDefault();
            $.ajax({
                type:'post',
                url:'/comments/create',
                data:newComment.serialize(),
                success:function(data){
                    let addnewComment = newCommentDom(data.data.comment);
                    $(`#post-comment-${postIds[j]}`).prepend(addnewComment);
                    deleteComment($(' .delete-comment-button',addnewComment));
                }
            });
          });

          let postContainer = $(`#post-${postIds[j]}`);
          $(' .delete-comment-button',postContainer).each(function(){
              deleteComment($(this));
          });
        }
        
    }

    function newCommentDom(comment){
        return $(`
           <li id = "comment-${comment._id}">

             <div>
                <span><img src="${comment.user.avatar}" alt="user"></span>
                <span> ${comment.user.name}</span>
             </div>
             <p>${comment.content}</p>
            <small>
                <a class = "delete-comment-button" href="/comments/distroy/${comment._id}" >
                <img src="https://img.icons8.com/color/16/000000/delete-sign.png"/>
                </a>
           </small>
             <a href="/likes/toggle/?id =${comment._id}&&type=Comment" class ="toggle-like-button" data-likes = "0" >0 
             <img src="https://img.icons8.com/fluent/26/000000/good-quality.png"/>
             </a>

             </li>

             <script>
              $('.toggle-like-button').each(function () {
                 let self = this;
                 let toggeller = new ToggleLike(self);
                })
              </script> 
        `);
    }

    let deleteComment = function(deleteLink){
          $(deleteLink).click(function(e){
              e.preventDefault();
              $.ajax({
                  type:'get',
                  url:$(deleteLink).prop('href'),
                  success:function(data){
                     $(`#comment-${data.data.comment_id}`).remove();
                  },
                  error:function(error){
                    console.log(error.responseText);
                 }
              })
          })
    }



    createComment();
    
}