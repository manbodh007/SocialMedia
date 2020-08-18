{
  let sendRequest = function(){
      let actions = [];
      let i=0;
      
      $('#friends-list-container>div').each(function(){
          actions[i++] = $(this);
      });
      let ids = [];
      for(let i=0;i<actions.length;i++){
        ids[i] = actions[i].prop('id').split('-')[1];
      }
      console.log(ids);
      for(let j=0;j<ids.length;j++){
         let newRequest = $(`#friend-request-${ids[j]}`);
         console.log('new request',newRequest);
         let status = newRequest[0].innerHTML;
         console.log(status);
         newRequest.click(function(e){
             e.preventDefault();
             $.ajax({
                 type:'POST',
                 url:`/users/friend/request/?id=${ids[j]}`,
                 success:function(data){
                     console.log(data);
                     status = data.status;
                    newRequest[0].innerHTML = data.status;
                    console.log(newRequest);
                   
                 }
             });
         })
      }
      
   } 

   let acceptRequest = function(req,res){
      let actions = [];
      let i=0;
      
      $('#friend-request-list-container>div').each(function(){
          actions[i++] = $(this);
      });
      let ids = [];
      for(let i=0;i<actions.length;i++){
        ids[i] = actions[i].prop('id').split('-')[1];
      }
      console.log(ids);
      for(let j=0;j<ids.length;j++){
         let newRequest = $(`#friend-request-${ids[j]}`);
         console.log('new request',newRequest);
         let status = newRequest[0].innerHTML;
         console.log(status);
         newRequest.click(function(e){
             e.preventDefault();
             $.ajax({
                 type:'GET',
                 url:`/users/friend/request-accept/${ids[j]}`,
                 success:function(data){
                      console.log(data);
                      newRequest[0].innerHTML = 'accepted';
                      console.log(newRequest);
                 }
             });
         })
      }}
     
   
   sendRequest(); 
   acceptRequest();
}