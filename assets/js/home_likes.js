class ToggleLike{
  constructor(toggleElement){
      this.toggler = toggleElement;
      
      this.toggleLike();
  }

  toggleLike(){
        
       $(this.toggler).click(function(e){
        //  console.log('function',this);
           let self = this;
           let emojiType = localStorage.getItem('emoji');
           let link = $(self).attr('href')+`&&name=${emojiType}`;
           e.preventDefault();
           $.ajax({
             type:'POST',
             url:link   //$(self).attr('href')
           })
           .done(function(data){
              let likesCount = parseInt($(self).attr('data-likes'));
              // console.log(likesCount);
              let color = 'grey';
              if(data.data.liked==true){
                likesCount -= 1;
              }else{
                likesCount += 1;
                color = "rgb(0, 162, 255)"
              }
              $(self).attr('data-likes',likesCount);

              // console.log('datal',data);

              if(data.data.likeable=='Post'){
                    // console.log('emojitype',emojiType);
                   if(!data.data.liked){
                       $(self).html(`${likesCount} <img style = 'width:30px; position: relative; top:-5px;' src="/images/${emojiType}.png" alt="">`);
                   }
                    else{
                      // $(self).html(`${likesCount} <i class="material-icons" style="font-size:35px;color:${color}; position: relative; top:5px;">thumb_up</i>`);
                      $(self).html(`${likesCount} <img style = 'width:30px; position: relative; top:-5px;' src="/images/unlike.png" alt="">`)
                    } 

                    localStorage.setItem('emoji','like');
                }
                else{
                    $(self).html(`${likesCount} <i class="fa fa-thumbs-up" style = "color:${color}; font-size:18px"></i>`);
                }
           })
           .fail(function(errData) {
            console.log('error in completing the request');
          });
       })
    }
}