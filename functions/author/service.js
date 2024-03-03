const Author = require("../../common/author-model");
const mongo = require("../../common/db/mongo");
module.exports.createAuthor = async (data) => {
  const { name, email } = data;
  if (!name || !email) {
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
  });

  await author.save();
  await mongo.disconnect();
  return author;
};

module.exports.searchAuthor = async (data) => {
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

module.exports.deleteAuthor = async (email) => {
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

module.exports.updateAuthor = async (email, data) => {
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
