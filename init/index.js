const mongoose = require("mongoose");
const initData = require("./data.js");
const listing = require("../models/listing.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/wonderlust";

main()
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(MONGO_URL);
}

const initDB = async () => {
  try {
    await listing.deleteMany({});
    initData.data = initData.data.map((obj) => {
      return { ...obj, owner: "683aff5662818e305b7df63d" };
    });
    await listing.insertMany(initData.data);
    console.log("data was initialized");
  } catch (err) {
    console.log(err);
  }
};

initDB();
