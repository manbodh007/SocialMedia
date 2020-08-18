{
    let handleEditButton = function(){

        $('#edit-profile-btn').click(function(){
            let form = $('#profile>form>input');
            form.each(function(){
                this.removeAttribute('disabled');
                console.log(this);
            });
        })
    }

    handleEditButton();
}