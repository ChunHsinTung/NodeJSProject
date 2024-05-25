const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const likeSchema = new Schema({
  action: { // like 代表按讚，dislike 代表取消按讚
    type: String,
    required: true,
  },
  articleId: {
    type: String,
    required: true,
  },
  userId: {
    type: String,
    required: true,
  },
  commentId: {
    type: String,
    //required: false,
  }
});

module.exports = mongoose.model('like', likeSchema)
