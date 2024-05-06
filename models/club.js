const mongoose = require("mongoose");
const userSchema = require("user.js")

const Schema = mongoose.Schema;

const clubSchema = new Schema(
  {
    club_name: {
      type: String,
      required: true,
    },

    description: {
      type: String,
      required: true,
    },

    managers: [
      {
        type: Schema.Types.ObjectId,
        ref: 'user'
      }
    ],

    images: [
      {
        type: String,
      }
    ]
  },
  {
    versionKey: false,
    timestamps: true
  });


module.exports = mongoose.model('club', clubSchema)
