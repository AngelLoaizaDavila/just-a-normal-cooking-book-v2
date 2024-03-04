const authorService = require("../../functions/author/service");
require("dotenv").config({ path: "../../.env" });

const main = async () => {
  const author = await authorService.searchAuthor({
    email: "brookebriggs@mixers.com",
  });
  console.log(JSON.stringify(author, null, 2));
  return author;
};

main();
