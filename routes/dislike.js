const express = require("express");
const Post = require("../models/post");
const User = require("../models/user");
const router = express.Router();
// const ObjectID = require('mongodb').ObjectID;

router.get("/", (req, res) => {
  res.status(200).send("Dislike Route success");
});

router.delete('/:id', async (req, res) => {
  const { articleId, userId, commentId } = req.query;
  const user_id = req.params.id;
  try {
    // 檢查使用者是否存在
    const user = await User.findById(user_id);
    if (!user) {
      return res.status(404).json({ message: '使用者不存在' });
    }

    // 檢查貼文是否存在
    // const post = await Post.findOne({ articleId, userId: {$in: userId} });
    const post = await Post.findOne({ articleId, userId, });
    if (!post) {
      return res.status(404).json({ message: '貼文不存在' });
    }

    // 檢查使用者是否已按讚該貼文
    if (!post.likes.includes(userId)) {
      return res.status(400).json({ message: '使用者尚未按讚該貼文' });
    }

    // 更新貼文按讚數
    post.likeCount -= 1;
    post.likes = post.likes.filter((id) => id !== userId);
    await post.save();

    // 回傳收回讚的訊息
    const message = `使用者 ${user.username} 已收回對貼文 ${articleId} 的按讚`;
    res.status(200).json({ message });
  } catch (err) {
    console.error(error);
  }
});

module.exports = router;