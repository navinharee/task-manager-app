const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const uniqueValidator = require("mongoose-unique-validator");
const jwt = require('jsonwebtoken')

const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        index: true,
        unique: true, //create index in mongodb to gaurentee uniqueness
        required: true,
        trim: true,
        lowercase: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error("Email is invalid!!");
            }
        }
    },
    password: {
        type: String,
        required: true,
        minlength: 6,
        trim: true,
        validate(value) {
            if (value.toLowerCase().includes("password")) {
                throw new Error("password should not contain password in it.");
            }
        }
    },
    age: {
        type: Number,
        default: 0,
        validate(value) {
            if (value < 0) {
                throw new Error("Age should be positive!");
            }
        }
    },
    avatar: {
        type: Buffer
    },
    //tokens below is an array of objects.
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }]
}, {
    timestamps: true
});

userSchema.virtual('tasks', {
    ref: 'Tasks',
    localField: '_id',
    foreignField: 'owner'
})


userSchema.plugin(uniqueValidator, {
    message: "Error, expected {PATH} to be unique."
});

userSchema.methods.toJSON = function () {
    const user = this;
    const userObject = user.toObject();

    delete userObject.password;
    delete userObject.tokens

    return userObject;

}

//calling the below method on the individual user instance, so we need to access this...so no arrow function used.
userSchema.methods.generateAuthToken = async function () {
    const user = this;

    const token = jwt.sign({
        _id: user._id.toString() //payload which uniquily identifies the user
    }, 'nhk@1986');

    //adding the generated tokens to the user document and saving it to the collection/db
    user.tokens = user.tokens.concat({
        token
    })

    await user.save();
    return token;
}

userSchema.statics.findByCredentials = async (email, password) => {
    console.log(email)
    const user = await User.findOne({
        email
    });
    if (!user) {
        throw new Error("Unable to find the User with the given email!!!");
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        throw new Error(
            "Password does not match...please check the password!!!unable to login"
        );
    }
    return user;
};

userSchema.pre("save", async function (next) {
    const user = this;
    console.log("inside the middleware before saving.....");
    if (user.isModified("password")) {
        user.password = await bcrypt.hash(user.password, 8); //taking the plain text password and hashing it and overring the
        //the password in user with the hased password....note:bcrypt.hash returns promise so await is mandatory
        console.log('hashing pwd before saving...')
    }
    next();
});

//define Model for user collection
const User = mongoose.model("User", userSchema);

module.exports = User;