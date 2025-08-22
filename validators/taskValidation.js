import { body } from "express-validator";

export const createTaskValidation = [
  body("title")
    .notEmpty()
    .withMessage("Title is required")
    .isLength({ min: 3 })
    .withMessage("Title must be at least 3 characters long"),

  body("description")
    .optional()
    .isLength({ max: 500 })
    .withMessage("Description cannot be more than 500 characters"),

  body("priority")
    .optional()
    .isIn(["Low", "Medium", "High"])
    .withMessage("Priority must be Low, Medium, or High"),

  body("status")
    .optional()
    .isIn(["Pending", "In Progress", "Completed"])
    .withMessage("Status must be Pending, In Progress, or Completed"),

  body("dueDate") // note: in your schema you wrote `dueData` typo, should fix
    .notEmpty()
    .withMessage("Due date is required")
    .isISO8601()
    .withMessage("Due date must be a valid date"),

  body("assignedTo")
    .optional()
    .isArray()
    .withMessage("AssignedTo must be an array of user IDs"),

  body("assignedTo.*")
    .optional()
    .isMongoId()
    .withMessage("Each assigned user ID must be a valid MongoID"),

  body("createdBy")
    .optional()
    .isMongoId()
    .withMessage("CreatedBy must be a valid MongoID"),

  body("attachments")
    .optional()
    .isArray()
    .withMessage("Attachments must be an array of strings"),

  body("attachments.*")
    .optional()
    .isString()
    .withMessage("Each attachment must be a string URL"),

  body("todoChecklist")
    .optional()
    .isArray()
    .withMessage("Todo checklist must be an array"),

  body("todoChecklist.*.text")
    .notEmpty()
    .withMessage("Todo item text is required"),

  body("todoChecklist.*.completed")
    .optional()
    .isBoolean()
    .withMessage("Todo item completed must be true or false"),

  body("progress")
    .optional()
    .isInt({ min: 0, max: 100 })
    .withMessage("Progress must be between 0 and 100"),
];
