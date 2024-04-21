const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      unique: true,
      required: true,
    },

    password: {
      type: String,
      required: true,
      max: 100,
    },

    createdAt: {
      type: Date,
      default: Date.now
    },
    friends: [
      {
        id: String,
        name: String,
        status: { type: Boolean, default: false }
      }
    ],
    clubs: [
      {
        id: String,
        name: String
      }
    ],
    googleId: String,
  },
  {
    versionKey: false,
    timestamps: true
  });


// google第三方 若有資料就顯示，沒有就新增
userSchema.statics.findOrCreate = async function (doc) {
  let result = await this.findOne({ googleId: doc.googleId });
  if (result) {
    return result;
  } else {
    result = new this(doc);
    return await result.save();
  }
};

//const user = mongoose.model("user", userSchema);
//module.exports = { user };
//module.exports = mongoose.model('user', userSchema);
module.exports = mongoose.models.User || mongoose.model('User', userSchema);
