const mongoose = require("mongoose");
const userSchema = require("user.js")

const Schema = mongoose.Schema;

const postSchema = new Schema(
  {
    userID: {
      type: Schema.Types.ObjectId,
      ref: 'user',
      required: true,
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


module.exports = mongoose.model('Post', postSchemaSchema)
