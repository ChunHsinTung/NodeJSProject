const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema(
    {
        comment: {
            type: String,
            required: [true, '回覆內容不能為空']
        },
        createdAt: {
            type: Date,
            default: Date.now
        },
        user: {
            type: mongoose.Schema.ObjectId,
            ref: 'user',
            require: ['true', '回覆一定是屬於某一使用者的']
        },
        post: {
            type: mongoose.Schema.ObjectId,
            ref: 'post',
            require: ['true', '回覆一定是針對某一貼文回覆的']
        }
    }
);
commentSchema.pre(/^find/, function (next) {
    this.populate({
        path: 'user',
        select: 'name id createdAt'
    });

    next();
});
const Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment;