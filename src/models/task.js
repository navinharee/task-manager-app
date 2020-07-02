const mongoose = require("mongoose");
const validator = require("validator");
const Schema = mongoose.Schema;

const taskSchema = new Schema({
    description: {
        type: String,
        required: true,
        minlength: 5,

        trim: true
    },
    completed: {
        type: Boolean,
        default: false
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User' //model name of the User collection

    }
}, {
    timestamps: true
})

const tasks = mongoose.model("Tasks", taskSchema);

module.exports = tasks;