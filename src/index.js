//starting point for the application where express server will be initialised
const express = require("express");
const mongoose = require("./db/mongoose"); //need to initiale mongoose by loading here
// const User = require('./models/user');
// const Task = require('./models/task');
const userRouter = require("./routers/userRouters");
const taskRouter = require("./routers/taskRouters");

const multer = require("multer");

//configure multer

const app = express();

const port = process.env.PORT;

// app.use((req, res, next) => {
//     res.status(503).send('The server is under Maintainence until midnight!!!');
// })

// const upload = multer({
//   //passing options object
//   dest: "images",
//   limits: {
//     fileSize: 1000000
//   },
//   fileFilter: (req, file, cb) => {
//     console.log("file....", file);
//     if (!file.originalname.match(/\.(doc|docx)$/)) {
//       return cb(new Error("Please upload a Word document!!!"));
//     }
//     console.log("inside fileFilter.....");

//     cb(undefined, true);
//   }
// });

// app.post(
//   "/uploads",
//   upload.single("upload"),
//   (req, res) => {
//     res.send();
//   },
//   (error, req, res, next) => {
//     //function to handle any un caught errors..express calls this function automatically in case
//     //of any un-caught errors...so the call signature arguments is mandatory and its to be in the same order...(error,req,res,next)
//     res.status(400).send({
//       error: error.message
//     });
//   }
// );

app.use(express.json()); //this for automatically convert the req payload to json and map it to the route handlers req object
app.use(userRouter); //registering the router with express
app.use(taskRouter);
//promise chaining commented and used async/await below
// app.post('/users', (req, res) => {
//     // console.log(req.body);
//     const user = new User(req.body);

//     user.save().then(() => {
//         res.status(201).send(user);

//     }).catch((error) => {
//         console.log('inside catch....', error)
//         res.status(400).send(error);
//         //   res.send(error)
//     })
// });

//index.js creates the express app and gets  that up and running but what the express app actually does is defined in that
//routers file

//commenting promise chaining and using async/await instead
// app.get('/users', (req, res) => {

//     User.find({}).then((users) => {
//         res.send(users);
//     }).catch(() => {
//         res.status(500).send();
//     })
// });

// app.get('/users/:id', (req, res) => {
//     console.log(req.params);
//     const _id = req.params.id;

//     console.log(_id);
//     User.findById(
//         _id
//     ).then((user) => {
//         console.log(user)
//         if (!user) {
//             return res.status(404).send();
//         }
//         res.send(user)
//     }).catch((e) => {
//         console.log('inside catch...')
//         res.status(500).send();
//     })
// });

app.listen(port, () => {
  console.log("server is up on port......." + port);
});

// const Task = require('../src/models/task');
// const User = require('../src/models/user')

// const getTask = async () => {
//     // const task = await Task.findById('5ef559e09a72130a74fe9160');
//     // await task.populate('owner').execPopulate();
//     // console.log(task.owner.name);

//     // const user = await User.findById('5ef56254a667ce0ca8714f7b');
//     // await user.populate('tasks').execPopulate();
//     // console.log('from index...', user.tasks);
// };

// getTask();

//file uploads example in isolatin
