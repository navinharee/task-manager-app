const express = require('express');
const auth = require('../middleware/auth')
const User = require('../models/user')
const Task = require('../models/task'); //losd the Task model , since we are using it here

const router = new express.Router(); //syntax is critical


router.post('/tasks', auth, async (req, res) => {

    const task = new Task({
        ...req.body,
        owner: req.user._id
    });
    try {
        await task.save();
        res.status(201).send(task);
    } catch (e) {
        res.status(400).send(e);
    }

});

//GET /tasks?completed=true
//GET /tasks?limit=10&skip=3
//GET /tasks?sortBy=createdAt:desc
router.get('/tasks', auth, async (req, res) => {
    const match = {}
    const sort = {}
    console.log('req.completed....', req.query.completed)
    if (req.query.completed) {
        match.completed = req.query.completed === 'true' //since all the query parameters are string we need to convert it to
        //boolean before sending the match object.
        //match.completed is boolean property...
    }

    if (req.query.sortBy) {
        const parts = req.query.sortBy.split(':');
        sort[parts[0]] = parts[1] === 'desc' ? -1 : 1;
    }
    console.log('match...', match)
    try {
        console.log(req.user._id);
        const tasks = await req.user.populate({
            path: 'tasks',
            match, //property shorthand
            options: {
                limit: parseInt(req.query.limit),
                skip: parseInt(req.query.skip),
                sort //property shorthand
                //somthing similar below is achieved dynamically...
                // sort: {
                //     createdAt: -1
                // }
            }
        }).execPopulate()

        res.send(req.user.tasks)
        // const user = await User.findById(req.user._id);
        // console.log(user);
        // await user.populate('tasks').execPopulate();
        // console.log('user.tasks...', user.tasks)
        // res.send(user.tasks);

    } catch (e) {
        console.log(e)
        res.status(500).send();
    }

});

router.get('/tasks/:id', auth, async (req, res) => {

    const _id = req.params.id;
    try {
        // const task = await Task.findById(_id);

        const task = await Task.findOne({
            _id,
            owner: req.user._id
        });
        if (!task) {
            return res.status(400).send({
                error: 'no task found for the given user'
            });
        }
        res.send(task);
    } catch (e) {
        res.status(500).send()
    }
});


router.patch('/tasks/:id', auth, async (req, res) => {
    console.log('tttttttt');
    const updatesFromReq = Object.keys(req.body);
    const allowedUpdates = ['description', 'completed'];

    const isValidUpdate = updatesFromReq.every((updateField) => {
        return allowedUpdates.includes(updateField);
    });
    console.log('22222');
    if (!isValidUpdate) {
        return res.status(400).send({
            error: 'Invalid updates..please check!!!'
        });
    }

    try {
        const task = await Task.findOne({
            _id: req.params.id,
            owner: req.user._id
        })

        console.log('3333....', task);
        if (!task) {
            return res.status(404).send({
                error: ' Specified task not available for the given'
            });
        }

        updatesFromReq.forEach((update) => {
            task[update] = req.body[update];
        })
        await task.save();


        res.send(task);
    } catch (e) {
        res.status(400).send({
            error: 'bad input...'
        })
    }
});


router.delete('/tasks/:id', auth, async (req, res) => {
    try {
        console.log('111111')

        const task = await Task.findOneAndDelete({
            _id: req.params.id,
            owner: req.user._id
        })
        // const task = await Task.findByIdAndDelete(req.params.id); //create a variable to store the deleteed task
        console.log('22222....')
        if (!task) {
            return res.status(404).send({
                error: 'The task cannot be deleted as it does not belong to the given user'
            });
        }
        res.send(task); //if you are not sending the response back to the client...the client will not get anything...
        //in this case postman will be keep on waiting...this for success case scenario...very important...
    } catch (e) {
        console.log(e)
        res.status(400).send();
    }
});

module.exports = router