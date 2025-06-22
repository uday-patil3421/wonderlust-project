const mongoose = require("mongoose");

main()
  .then(() => {
    console.log("connected...");
  })
  .catch((err) => console.log(err));

async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/relDemo");
}

const orderSchema = mongoose.Schema({
  item: String,
  price: Number,
});

const order = mongoose.model("order", orderSchema);

// const addOrder = async () => {
//   const res = await order.insertMany([
//     { item: "piza", price: 250 },
//     { item: "chokalate", price: 50 },
//     { item: "cake", price: 50 },
//   ]);
//   console.log(res);
// };

// addOrder();

const customerSchema = new mongoose.Schema({
  name: String,
  orders: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "order",
    },
  ],
});

//middleware

customerSchema.post("findOneAndDelete", async (data) => {
  if (data.orders.length) {
    let res = await order.deleteMany({ _id: { $in: data.orders } });
    console.log(res);
  }
});

const customer = mongoose.model("customer", customerSchema);

const addCustomer = async () => {
  const customer1 = new customer({
    name: "ram das",
  });

  const order1 = await order.findOne({ item: "chokalate" });

  const order2 = await order.findOne({ item: "chai" });

  customer1.orders.push(order1);
  customer1.orders.push(order2);

  const res = await customer1.save();

  console.log(res);
};

//addCustomer();

const addDetails = async () => {
  const newOrd = new order({
    item: "chai",
    price: 10,
  });

  const newCust = new customer({
    name: "mohan das",
  });

  newCust.orders.push(newOrd);

  // const res = {
  //   ord: ,
  //   cust: null,
  // };

  const cust = await newCust.save();
  const ord = await newOrd.save();

  console.log(cust, ord);
};

//addDetails();
const del = async () => {
  const res = await customer.findByIdAndDelete("682a09b59f20327a83695f87");
};

del();
