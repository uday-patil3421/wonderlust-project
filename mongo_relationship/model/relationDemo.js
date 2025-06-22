const mongoose = require("mongoose");

main()
  .then(() => {
    console.log("connected...");
  })
  .catch((err) => console.log(err));

async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/relDemo");
}

const userSchema = mongoose.Schema({
  username: String,
  address: [
    {
      location: String,
      city: String,
    },
  ],
});

const user = mongoose.model("user", userSchema);

// const addUser = async () => {
//   const user1 = new user({
//     username: "uday",
//     address: [
//       {
//         location: "india",
//         city: "pune",
//       },
//     ],
//   });

//   user1.address.push({ location: "usa", city: "xyz" });
//   await user1.save();
// };

//addUser()
