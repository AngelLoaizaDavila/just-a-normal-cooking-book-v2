const mongoose = require('mongoose')
require("dotenv").config();
module.exports.init = async function () {
  const uri = `mongodb+srv://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASS}@cluster0.udbqgft.mongodb.net/?retryWrites=true&w=majority`;
  await mongoose.connect(uri)
}

module.exports.disconnect = async function () {
  try {
    await mongoose.disconnect()
  } catch (err) {
    console.log(err)
  }
}