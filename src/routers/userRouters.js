const express = require("express");
const User = require("../models/user"); //loading the user model
const auth = require("../middleware/auth");
const multer = require('multer');
const sharp = require('sharp');
const {
    sendWelcomeEmail,
    sendCancellationEmail
} = require('../emails/accounts')

const router = new express.Router();

//dummy routes
router.get("/test", (req, res) => {
    res.send("from router fileeeeee");
});

//using async/await instead of promise chaining...
router.post("/users", async (req, res) => {
    console.log(req.body);

    const user = new User(req.body);
    try {
        await user.save();
        sendWelcomeEmail(user.email, user.name)
        //generate the token for the saved user...
        const token = await user.generateAuthToken();
        //send back the generated token along with the user in the object
        res.status(201).send({
            user,
            token
        });
    } catch (error) {
        res.status(400).send(error);
    }
});

// router.get('/users', auth, async (req, res) => {

//     try {
//         const users = await User.find({});
//         res.send(users);
//     } catch (e) {
//         console.log(e)
//         res.status(500).send(e);
//     }

// });

router.get("/users/me", auth, async (req, res) => {
    res.send(req.user);
});

//not needed
// router.get("/users/:id", async (req, res) => {
//     console.log(req.params);
//     const _id = req.params.id;

//     console.log(_id);

//     try {
//         const user = await User.findById(_id);
//         if (!user) {
//             return res.status(400).send();
//         }
//         res.send(user);
//     } catch (e) {
//         res.status(500).send(e);
//     }
// });

/**
 * updating the user
 *
 * Important: all the routes should start with '/' forward slash
 */

router.patch("/users/me", auth, async (req, res) => {
    const updates = Object.keys(req.body);
    // console.log("updates...", updates);
    const updatesAllowed = ["name", "email", "password", "age"];

    const isValidUpdate = updates.every(update => {
        return updatesAllowed.includes(update);
    });

    if (!isValidUpdate) {
        return res.status(400).send({
            //need to stop the function processing further by using return
            error: "Invalid updates!!!!"
        });
    }

    try {
        //commenting out to make use of middleware
        // const user = await User.findByIdAndUpdate(req.params.id, req.body, {
        //     new: true,
        //     runValidators: true
        // });
        //since using middleware
        // console.log("req.params.id...", req.params.id);
        // const user = await User.findById(req.params.id);
        // console.log("user..before..", JSON.stringify(user));

        updates.forEach(update => {
            //  console.log(req.body[update]);
            req.user[update] = req.body[update]; //dynamically accessing the property of the object and changing its value
        });
        // console.log("user..after..", JSON.stringify(req.user));
        await req.user.save(); //now the middleware will be called before saving ther user
        // console.log("user..after.middleware call.", JSON.stringify(req.user));
        if (!req.user) {
            return res.status(404).send();
        }
        res.send(req.user);
    } catch (e) {
        console.log("inside catch......", e);
        res.status(400).send(e);
    }
});

router.delete("/users/me", auth, async (req, res) => {
    try {
        await req.user.remove();
        sendCancellationEmail(req.user.email, req.user.name);
        res.send(req.user);
    } catch (e) {
        res.status(500).send();
    }
});

router.post("/users/login", async (req, res) => {
    try {
        // re-usable custom function created in User model.
        const fetchUser = await User.findByCredentials(
            req.body.email,
            req.body.password
        );
        const token = await fetchUser.generateAuthToken();

        res.send({
            fetchUser,
            token
        });
    } catch (e) {
        console.log(e);
        res.status(400).send(e);
    }
});

router.post("/users/logout", auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((tokenObj) => {
            return tokenObj.token !== req.token;
        });

        await req.user.save();
        res.send();

    } catch (e) {
        res.status(500).send();
    }
});


router.post('/users/logoutAll', auth, async (req, res) => {

    try {
        req.user.tokens = [];
        await req.user.save()
        res.send();

    } catch (e) {
        res.status(500).send();
    }

});


//create the multer middleware
const upload = multer({ //options object to configure the destination folder for file uploads
    // dest: 'avatars', --need this only when multer saves the files to the folder inside the project
    //no need this if we want to save the image in the database...
    limits: {
        fileSize: 1000000
    },
    fileFilter: (req, file, cb) => {
        if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
            return cb(new Error('Please upload valid file formats!!!..the valid file formats are jpg,jpeg,png!!!'));
            //in case of error
        }
        cb(undefined, true); //accept the given upload..callback should be called....
    }
})

//register the multer middleware
//choosing the name "avatar" for the key when registering the middleware(multer)
router.post('/users/me/avatar', auth, upload.single('avatar'), async (req, res) => {


    const buffer = await sharp(req.file.buffer).resize({
        width: 250,
        height: 250
    }).png().toBuffer();
    // req.user.avatar = req.file.buffer;
    req.user.avatar = buffer;
    await req.user.save();
    res.send('file uploaded!!!!')
}, (error, req, res, next) => {
    res.status(400).send({
        error: error.message
    })
});


router.delete('/users/me/avatar', auth, async (req, res) => {
    req.user.avatar = undefined;
    try {
        await req.user.save();
        res.send('avatar deleted from your your profile!!!')
    } catch (e) {
        res.status(500).send('Error while deleting avatar!!!')
    }

});


router.get('/users/:id/avatar', async (req, res) => {

    try {
        const user = await User.findById(req.params.id); //await ia mandatory as we are handling promise here..
        console.log(user)
        if (!user || !user.avatar) { //failure case handling
            throw new Error()
        }
        //success case
        res.set('Content-Type', 'image/png'); //need to set the response header
        //as we are not sending JSON, we are sending the image back to the client
        res.send(user.avatar);
    } catch (e) {
        res.status(404).send('the avatar is not available..please check!')
    }
})

module.exports = router;