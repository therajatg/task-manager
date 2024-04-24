const express = require("express");
const { v4: uuid } = require("uuid");
const fs = require("fs");
const { tasks } = require("./task.json");
const Validator = require("./helpers/validator");
const app = express();
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/tasks", (req, res) => {
  res.status(200).json(tasks);
});

app.get("/tasks/:id", (req, res) => {
  try {
    const taskId = req.params.id;
    const requiredTask = tasks.find((task) => task.id == taskId);
    if (!requiredTask) {
      res.status(404).json("No Task With The Sent Task ID");
    }
    res.status(200).json(requiredTask);
  } catch (error) {
    res.status(500).json("Internal Server Error");
  }
});

app.post("/tasks", (req, res) => {
  try {
    const taskToAdd = req.body;
    if (Validator.validateTaskInfo(taskToAdd).status) {
      tasks.push({ id: uuid(), ...taskToAdd });
      fs.writeFile(
        "./task.json",
        JSON.stringify({ tasks }),
        { encoding: "utf8", flag: "w" },
        (error) => {
          if (error) {
            return res.status(500).json("Internal server error");
          } else {
            return res.status(201).json("Task added successfully");
          }
        }
      );
    } else {
      return res
        .status(400)
        .json(Validator.validateTaskInfo(taskToAdd).message);
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json("Internal server error");
  }
});

app.put("/tasks/:id", (req, res) => {
  try {
    const id = req.params.id;
    const validation = Validator.validateTaskId(id);
    if (validation.status) {
      const newTask = req.body;
      if (Validator.validateTaskInfo(newTask).status) {
        const updatedTaskList = tasks.map((task) =>
          task.id == id ? { id, ...newTask } : task
        );

        fs.writeFile(
          "./task.json",
          JSON.stringify({ tasks: updatedTaskList }),
          { encoding: "utf8", flag: "w" },
          (error) => {
            if (error) {
              return res.status(500).json("Internal server error");
            } else {
              return res.status(200).json("Task updated successfully");
            }
          }
        );
      } else {
        return res
          .status(400)
          .json(Validator.validateTaskInfo(newTask).message);
      }
    } else {
      return res.status(404).json(validation.message);
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json("Internal server error");
  }
});

app.delete("/tasks/:id", (req, res) => {
  try {
    const id = req.params.id;
    const validation = Validator.validateTaskId(id);
    if (validation.status) {
      const updatedTaskList = tasks.filter((task) => task.id != id);
      fs.writeFile(
        "./task.json",
        JSON.stringify({ tasks: updatedTaskList }),
        {
          encoding: "utf8",
          flag: "w",
        },
        (error) => {
          if (error) {
            return res.status(500).json("Internal server error");
          } else {
            return res.status(200).json("Task deleted successfully");
          }
        }
      );
    } else {
      return res.status(404).json(validation.message);
    }
  } catch (error) {
    return res.status(500).json("Internal server error");
  }
});

app.listen(port, (err) => {
  if (err) {
    return console.log("Something bad happened", err);
  }
  console.log(`Server is listening on ${port}`);
});

module.exports = app;
