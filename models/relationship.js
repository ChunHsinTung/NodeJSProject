const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const relationshipSchema = new Schema({
    userID_a: {
        type: mongoose.Schema.ObjectId,
        ref: 'user',
        required: [true, "用戶ID_a為必填"]
    },

    userID_b: {
        type: mongoose.Schema.ObjectId,
        ref: 'user',
        required: [true, "用戶ID_b為必填"]
    }
});

const relationship = mongoose.model("relationship", UserSchema);

module.exports = { relationship };