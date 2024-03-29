const Author = require("../../common/author-model");
const AuthorRecipe = require("../../common/author-recipe-model");
const mongo = require("../../common/db/mongo");
const createError = require("http-errors");
module.exports.createAuthor = async (data) => {
  const { name, email, userId } = data;
  if (!name || !email || !userId) {
    throw createError(400, "missing required params");
  }

  await mongo.init();
  const alreadyExists = await Author.findOne({ email: email });
  if (alreadyExists !== null) {
    await mongo.disconnect();
    throw createError(400, "Author already exists");
  }
  const author = new Author({
    name: name,
    email: email,
    user: userId
  });

  await author.save();
  await mongo.disconnect();
  return author;
};

module.exports.searchAuthorWithAuthorEmail = async (data) => {
  const { email } = data;
  if (!email) {
    throw createError(400, "Missing required param");
  }
  await mongo.init();
  const author = await Author.findOne({
    email: email,
  });
  if (!author) {
    await mongo.disconnect();
    throw createError(404, "Author not found");
  }
  await mongo.disconnect();
  return author;
};
module.exports.searchAuthorWithUserId = async (data) => {
  const { userId } = data;
  if (!userId) {
    throw createError(400, "Missing required param");
  }
  await mongo.init();
  const author = await Author.findOne({
    user: userId,
  });
  if (!author) {
    await mongo.disconnect();
    throw createError(404, "Author not found");
  }
  await mongo.disconnect();
  return author;
};
module.exports.searchAuthorAndPopulateRecipeWithAuthorEmail = async (data) => {
  const { email } = data;
  if (!email) {
    throw createError(400, "Missing required param");
  }
  await mongo.init();
  const author = await Author.findOne({
    email: email,
  });
  if (!author) {
    await mongo.disconnect();
    throw createError(404, "Author not found");
  }
  if (author.recipes.length === 0) {
    await mongo.disconnect();
    throw createError(404, "Author has no recipes");
  }
  const authorRecipes = await AuthorRecipe.find({
    _id: { $in: author.recipes },
  })
  console.log(authorRecipes);
  await mongo.disconnect();
  return {
    author,
    authorRecipes,
  };
};
module.exports.searchAuthorAndPopulateRecipeWithUserId = async (data) => {
  const { userId } = data;
  if (!userId) {
    throw createError(400, "Missing required param");
  }
  await mongo.init();
  const author = await Author.findOne({
    user: userId,
  });
  if (!author) {
    await mongo.disconnect();
    throw createError(404, "Author not found");
  }
  if (author.recipes.length === 0) {
    await mongo.disconnect();
    throw createError(404, "Author has no recipes");
  }
  const authorRecipes = await AuthorRecipe.find({
    _id: { $in: author.recipes },
  })
  await mongo.disconnect();
  return {
    author,
    authorRecipes,
  };
};

module.exports.deleteAuthorWithAuthorEmail = async (email) => {
  if (!email) {
    throw createError(400, "Missing required param");
  }
  await mongo.init();
  const author = await Author.findOneAndDelete({
    email: email,
  });
  if (!author) {
    await mongo.disconnect();
    throw createError(404, "Author not found");
  }
  await mongo.disconnect();
  return author;
};

module.exports.updateAuthorWithAuthorEmail = async (email, data) => {
  if (!email) {
    throw createError(400, "Missing required param");
  }
  await mongo.init();
  const author = await Author.findOneAndUpdate(
    { email: email },
    { $set: data },
    { new: true }
  );
  if (!author) {
    await mongo.disconnect();
    throw createError(404, "Author not found");
  }
  await mongo.disconnect();
  return {
    message: "Author updated successfully!",
    author,
  };
};
