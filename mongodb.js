//CRUD create read update delete
//not part of the application...just to get some hands on 
const mongodb = require('mongodb')

const MongoClient = mongodb.MongoClient //gives access to fns needed for connecting to DB.
const ObjectID = mongodb.ObjectID;

const connectionURL = 'mongodb://127.0.0.1:27017'
const databaseName = 'task-manager'

const id = new ObjectID();

console.log(id)
console.log(id.toHexString())
console.log(id.id.length)
console.log(id.getTimestamp())
MongoClient.connect(connectionURL, {
    useNewUrlParser: true, //
    useUnifiedTopology: true
}, (error, client) => {
    if (error) {
        return console.log('unable to connect to MongoDB...', error);
    }
    console.log('MongoDB connected!!!');
    const db = client.db(databaseName);

    // const tasks = [{
    //     description: 'complete the NodeJS course',
    //     completed: false
    // }, {
    //     description: 'complete the Docker course',
    //     completed: false
    // }]

    // db.collection('tasks').insertMany(tasks, (error, result) => {
    //     if (error) {
    //         return console.log('Exception occured!!!'); //use return to stop the execution!!!
    //     }
    //     console.log(result.ops);

    // })

    // db.collection('tasks').findOne({
    //     _id: new ObjectID('5eea5864533e000660ee0101')
    // }, (error, task) => {
    //     if (error) {
    //         return console.log('Error occured while fetching tasks!!!');
    //     }

    //     console.log(task);
    // });

    // db.collection('tasks').find({ //find returns cursor to the results in mongodb, so using toArray() to fetch the documents //from mongo
    //     completed: false
    // }).toArray((error, tasks) => {
    //     if (error) {
    //         return console.log('Error occured while fetching tasks!!!');

    //     }
    //     console.log(tasks.length);

    // });

    // db.collection('tasks').updateMany({
    //     completed: true
    // }, {
    //     $set: {
    //         completed: false
    //     }
    // }).then((result) => {
    //     console.log(result);
    // }).then((error) => {
    //     console.log(error);
    // });

    // db.collection('users').updateOne({
    //     _id: new ObjectID('5eea1e20938d9804f95becc0')
    // }, {
    //     $set: {
    //         name: 'vikram Joe'
    //     }
    // }).then((result) => {
    //     console.log(result)
    // }).catch((error) => {
    //     console.log(error)
    // })


    // db.collection('users').deleteMany({
    //     age: 33
    // }).then((result) => {
    //     console.log(result);
    // }).catch((error) => {
    //     console.log(error);
    // })

    db.collection('tasks').deleteOne({
        description: 'complete the OpenShift course'
    }).then((result) => {
        console.log(result);
    }).catch((error) => {
        console.log(error);
    })
})