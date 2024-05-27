const express = require('express');
const router = express.Router();
const Article = require('../models/article'); // 引入 Article 模型

// 新增一篇文章
router.post('/', async (req, res) => {
  console.log("新增一篇文章")
  try {
    // 作者 id 應該讀取 JWT 自動填入
    // TODO 目前如何讀取 JWT ?
    const article = new Article(req.body);
    await article.save();
    res.status(201).send(article);
  } catch (error) {
    res.status(400).send(error);
  }
});

// 獲取所有文章
router.get('/', async (req, res) => {
  console.log("獲取所有文章")
  try {
    const articles = await Article.find();
    res.status(200).send(articles);
  } catch (error) {
    res.status(500).send(error);
  }
});

// 根據ID獲取文章
router.get('/:id', async (req, res) => {
  console.log(`找 id=${req.params.id} 的文章`)
  try {
    const article = await Article.findById(req.params.id);
    if (!article) {
      return res.status(404).send();
    }
    res.status(200).send(article);
  } catch (error) {
    res.status(500).send(error);
  }
});

// 更新文章
router.patch('/:id', async (req, res) => {
  console.log(`更新 id=${req.params.id} 的文章`)
  const updates = Object.keys(req.body);

  const allowedUpdates = ['title', 'content', 'tags', 'images', 'videos'];
  const isValidOperation = updates.every(update => allowedUpdates.includes(update));

  if (!isValidOperation) {
    return res.status(400).send({
      error: 'Invalid updates!'
    });
  }

  try {
    const article = await Article.findById(req.params.id);
    if (!article) {
      return res.status(404).send();
    }
    // 把 update 的項目逐一改上去
    updates.forEach(update => article[update] = req.body[update]);
    await article.save();
    res.status(200).send(article);
  } catch (error) {
    res.status(400).send(error);
  }
});

// 刪除文章
router.delete('/:id', async (req, res) => {
  console.log(`刪除 id=${req.params.id} 的文章`)
  try {
    const article = await Article.findByIdAndDelete(req.params.id);
    if (!article) {
      return res.status(404).send();
    }
    res.status(200).send(article);
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = router;
