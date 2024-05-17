const express = require("express");
const Like = require("../models/like");
const Post = require("../models/post");
const router = express.Router();

router.get("/", (req, res) => {
  res.status(200).send("Like Route success");
});

router.post("/:id", async (req, res) => {
  const { action, articleId, userId, commentId } = req.body;

  try {
    // 檢查用戶是否已對該貼文點讚
    const existingLike = await Like.findOne({ articleId, userId });

    // 建立新的 document
    const newLike = new Like({
      action,
      articleId,
      userId,
      commentId,
    });

    // 儲存
    await newLike.save();

    // 更新貼文文件中的按讚數
    const post = await Post.findByIdAndUpdate(articleId, {
      $inc: { likeCount: 1 },
    });

    if (!post) {
      // 如果找不到該貼文，則傳回錯誤訊息
      res.status(404).json({
        status: false,
        message: 'Post not found',
      });
      return;
    }

    // 成功回應
    res.status(200).json({
      status: true,
      data: {
        articleId: post.articleId,
        userId: post.userId,
        likeCount: post.likeCount,
        commentId: commentId || null,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: false,
      message: 'Internal server error',
    });
  }
});


module.exports = router;