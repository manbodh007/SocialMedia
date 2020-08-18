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
              if(data.data.liked==true){
                likesCount -= 1;
              }else{
                likesCount += 1;
              }
              $(self).attr('data-likes',likesCount);
              console.log(likesCount);
              $(self).html(`${likesCount} <img src="https://img.icons8.com/fluent/26/000000/good-quality.png"/>`);
           })
           .fail(function(errData) {
            console.log('error in completing the request');
          });
       })
    }
}