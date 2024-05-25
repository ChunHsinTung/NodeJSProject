const mongoose = require("mongoose");
const userSchema = require("./user")

const Schema = mongoose.Schema;

const postSchema = new Schema(
  {
    userID: {
      type: Schema.Types.ObjectId,
      ref: 'user',
      required: true,
    },

    likeCount: {
      type: Number,
      default: 0
    },

    pageID: {
      type: Schema.Types.ObjectId,
      ref: 'club',
    },

    articleID: {
      type: String,
      required: true,
    },

    title: {
      type: String,
      default: Date.now
    },

    content: {
      type: String,
      required: true,
    },
    images: [
      {
        type: String,
      }
    ],
    videos: [
      {
        type: String,
      }
    ],
    tags: [
      {
        type: String,
        required: true,
      }
    ],
  },
  {
    versionKey: false,
    timestamps: true,
  });


//const post = mongoose.model("post", postSchema);
//module.exports = { post };
module.exports = mongoose.model('post', postSchema)
