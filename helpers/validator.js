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
}

//If course id is not unique, we can return a different message with the same status that is false, do this later

module.exports = Validator;
