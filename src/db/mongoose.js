const mongoose = require("mongoose");
const User = require("../models/user");
//1st parameter - connection url - here we need to specifify database name in the url
//options object//
mongoose.connect(process.env.MONGODB_URL, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
  useFindAndModify: false
});

// //create instance.
// //use constructor function
// const me = new User({
//   name: "  johnjoe   ",
//   email: " jonnyc@GMAIL.COM",
//   password: "testig123"
// });

//save() returns promise and we can use then and catch promise methods for handling the success and error handlers

// me.save()
//   .then(() => {
//     console.log(me);
//   })
//   .catch(error => {
//     console.log("Error occured....", error);
//   });

// const newTask = new tasks({
//   description: "  make progress on NodeJS   "
// });

// newTask
//   .save()
//   .then(result => {
//     console.log(result);
//   })
//   .catch(error => {
//     console.log(error);
//   });