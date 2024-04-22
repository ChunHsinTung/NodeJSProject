const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const clubSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  description: {
    type: String,
    required: true
  },
  members: [
    {
      id: String,
      name: String,
      status: { type: Boolean, default: false }, // 預設未取得社團同意 
      isManager: { type: Boolean, default: false }, // 是否為管理者
    }
  ]
},
  {
    versionKey: false,
    timestamps: true
  }
);

module.exports = mongoose.model('club', clubSchema)
