const mongoose = require("mongoose");
const userSchema = require("../models/user")

const Schema = mongoose.Schema;

const postSchema = new Schema(
  {
    // userId: {
    //   type: Schema.Types.ObjectId,
    //   ref: 'User',
    //   required: true,
    // },

    userId: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
      },
    ],

    likeCount: {
      type: Number,
      default: 0
    },

    pageId: {
      type: Schema.Types.ObjectId,
      ref: 'club',
    },

    articleId: {
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
