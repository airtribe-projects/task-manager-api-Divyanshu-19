const express = require('express');

// middleware
const {validateTaskId, validateTaskBody} = require("./src/middleware/taskValidations");

// static data
const tasks = require('./task.json').tasks;


const app = express();
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/tasks", (req, res) => {
    return res.status(200).send(tasks);
})

app.get("/tasks/:id", validateTaskId, (req, res) => {
    const {taskId} = req;
    const response = tasks.find(task => task.id === taskId);
    if(!response){
        return res.status(404).send({err: "No response found"});
    }
    return res.status(200).send(response);
})

app.post("/tasks", validateTaskBody(true), (req, res) => {
    const { title, description, completed } = req.body;
    const newTask = {
        id: tasks.length + 1,
        title: title.trim(),
        description: description.trim(),
        completed
    };
    tasks.push(newTask);
    return res.status(201).send(newTask);
})

app.put("/tasks/:id", validateTaskId, validateTaskBody(false), (req, res) => {
    const {taskId} = req;

    const task = tasks.find(task => task.id === taskId);
    if(!task) {
        return res.status(404).send({err: "No such task available"})
    }

    const { title, description, completed } = req.body;
    if (title !== undefined) task.title = title.trim();
    if (description !== undefined) task.description = description.trim();
    if (completed !== undefined) task.completed = completed;

    res.status(200).send(task);
})

app.delete('/tasks/:id', validateTaskId, (req, res) => {
    const {taskId} = req;

    const taskIndex = tasks.findIndex(task => task.id === taskId);
    if (taskIndex === -1) {
        return res.status(404).json({ error: 'Task not found' });
    }

    const deletedTask = tasks.splice(taskIndex, 1)[0];
    res.status(200).send(deletedTask);
});


app.listen(port, (err) => {
    if (err) {
        return console.log('Something bad happened', err);
    }
    console.log(`Server is listening on ${port}`);
});



module.exports = app;