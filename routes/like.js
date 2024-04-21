const express = require("express");
const Like = require("../models/like");
const Post = require("../models/post");
const router = express.Router();

router.get("/", (req, res) => {
  res.status(200).send("Like Route success");
});

router.post("/:id", async (req, res) => {
  const articleId = req.params.id;
  const userId = req.body.userId;
  try {
    const post = await Post.findOne({ articleId });
    if (!post) {
      return res.status(404).json({ message: '貼文不存在' });
    }

    const isLiked = post.likes.some((like) => like.userId === userId);
    if (isLiked) {
      return res.status(400).json({ message: '您已點讚過此貼文' });
    }

    post.likes.push({ userId });
    post.likeCount += 1;
    await post.save();

    res.status(200).json({
      message: '貼文已按讚',
      data: {
        articleId: post.articleId,
        likeCount: post.likeCount,
      },
    });
  } catch (err) {
    res.status(400).send({
        status:"Failure",
        message:err
    })
  }
});


module.exports = router;