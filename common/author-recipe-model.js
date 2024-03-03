const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const AuthorRecipesSchema = new mongoose.Schema(
  {
    author: { type: Schema.Types.ObjectId, ref: "Author" },
    name: {
      type: String,
      required: true,
      index: true,
    },
    ingredients: {
      type: Array,
      required: true,
      schema: {
        name: {
          type: String,
        },
        quantity: {
          type: Number,
        },
        unit: {
          type: String,
        },
      },
    },
    steps: {
      type: Array,
      required: true,
      schema: {
        step: {
          type: Number,
        },
        description: {
          type: String,
        },
      },
    },
    portions: {
      type: Number,
      required: true,
    },
    cookingTime: {
      type: Object,
      schema: {
        time: {
          type: Number,
        },
        unit: {
          type: String,
        },
      },
    },
    deleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    collection: "authorRecipes",
    toObject: { virtuals: true },
    toJSON: {
      virtuals: true,
      transform: (doc, ret) => {
        delete ret._id;
      },
    },
  }
);

module.exports = mongoose.models.authorRecipes
  ? mongoose.models.authorRecipes
  : mongoose.model("authorRecipes", AuthorRecipesSchema);
