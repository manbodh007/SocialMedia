class ToggleLike{
  constructor(toggleElement){
      this.toggler = toggleElement;
      
      this.toggleLike();
  }

  toggleLike(){
        
       $(this.toggler).click(function(e){
         console.log('function',this);
           let self = this;
           e.preventDefault();
           $.ajax({
             type:'POST',
             url:$(self).attr('href')
           })
           .done(function(data){
              let likesCount = parseInt($(self).attr('data-likes'));
              console.log(likesCount);
              let color = 'grey';
              if(data.data.liked==true){
                likesCount -= 1;
              }else{
                likesCount += 1;
                color = "rgb(0, 162, 255)"
              }
              $(self).attr('data-likes',likesCount);

              console.log('datal',data);

              if(data.data.likeable=='Post')
                    $(self).html(`${likesCount} <i class="material-icons" style="font-size:70px;color:${color}; position: relative; top:10px;">thumb_up</i>`);
                else{
                    $(self).html(`${likesCount} <i class="fa fa-thumbs-up" style = "color:${color};"></i>`);
                }
           })
           .fail(function(errData) {
            console.log('error in completing the request');
          });
       })
    }
}