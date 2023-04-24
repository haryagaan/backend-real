const mongoose = require("mongoose");

const uri = process.env.URI;

async function connect() {
  try {
    await mongoose.connect(uri);
    console.log("connected to DB");
  } catch (error) {
    console.log(error);
  }
}

module.exports = connect;
