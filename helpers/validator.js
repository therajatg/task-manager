const { tasks } = require("../task.json");

class Validator {
  static validateTaskInfo(taskInfo) {
    if (
      taskInfo.hasOwnProperty("title") &&
      taskInfo.hasOwnProperty("description") &&
      taskInfo.hasOwnProperty("completed") &&
      typeof taskInfo["completed"] === "boolean"
    ) {
      return { status: true, message: "Validated Successfully" };
    } else {
      return {
        status: false,
        message: "Task info is malformed",
      };
    }
  }

  static validateTaskId(taskId) {
    if (tasks.find((task) => task.id == taskId)) {
      return { status: true, message: "taskId Validated Successfully" };
    } else {
      return {
        status: false,
        message: "Task Id is incorrect",
      };
    }
  }
}

module.exports = Validator;
