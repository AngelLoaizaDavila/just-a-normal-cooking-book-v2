const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const AuthorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    index: true,
  },
  email: {
    type: String,
    required: true,
  },
  recipes: [
    {
      type: Schema.Types.ObjectId,
      ref: "Recipes",
    },
  ],
},
{
  timestamps: true,
  collection: "author",
  toObject: { virtuals: true },
  toJSON: {
    virtuals: true,
    transform: (doc, ret) => {
      delete ret._id;
    },
  },
});
module.exports = mongoose.models.author
  ? mongoose.models.author
  : mongoose.model("author", AuthorSchema);