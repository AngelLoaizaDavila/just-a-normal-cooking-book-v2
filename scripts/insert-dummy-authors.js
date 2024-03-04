const Author = require('../common/author-model');
const mongo = require("../common/db/mongo");
require("dotenv").config({ path: "../.env" });
const dummyAuthors = [
  {
    name: "Donovan Pennington",
    email: "donovanpennington@mixers.com",
  },
  {
    name: "Brooke Briggs",
    email: "brookebriggs@mixers.com",
  },
  {
    name: "Wooten Mcclure",
    email: "wootenmcclure@mixers.com",
  },
  {
    name: "Mckenzie Gray",
    email: "mckenziegray@mixers.com",
  },
  {
    name: "Castro Moreno",
    email: "castromoreno@mixers.com",
  },
  {
    name: "Milagros Kidd",
    email: "milagroskidd@mixers.com",
  },
  {
    name: "Donna Montgomery",
    email: "donnamontgomery@mixers.com",
  },
];

const insertDummyAuthors = async (data) => {
  await mongo.init();
  await Author.insertMany(data);
  await mongo.disconnect();
};

const main = async () => {
  await insertDummyAuthors(dummyAuthors);
};
main();
