const queue = require('../config/kue');

const commentsMailer = require('../mailers/comment_mail');

queue.process('emails',function(job,done){
    console.log('email worker is processing a job',job);
    commentsMailer.newComment(job.data);
    done();
})