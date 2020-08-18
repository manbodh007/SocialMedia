const mongoose = require("mongoose");
const multer = require("multer");
const path = require("path");
const UPLOADED_POST_IMG = path.join("/uploads/users/posts/images");
const UPLOADED_POST_VIDEO = path.join("/uploads/users/posts/videos");

const postSchema = new mongoose.Schema(
  {
    content: {
      type: String,
    //   required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    // include the all comment's id for each post
    comments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment",
      },
    ],
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Like",
      },
    ],
    image: {
      type: String,
    },
    video:{
        type:String,
    }
  },
  {
    timestamps: true,
  }
);

let storage = multer.diskStorage({
  destination: function (req, file, cb) {
    if(file.mimetype=='video/mp4')
    cb(null,path.join(__dirname,'..',UPLOADED_POST_VIDEO));
    else
    cb(null, path.join(__dirname, "..", UPLOADED_POST_IMG));
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + "-" + Date.now());
  },
});

postSchema.statics.uploadedPostImg = multer({ storage: storage }).single(
  "files"
);
postSchema.statics.imagePath = UPLOADED_POST_IMG;
postSchema.statics.videoPath = UPLOADED_POST_VIDEO;

const Post = mongoose.model("Post", postSchema);
module.exports = Post;
