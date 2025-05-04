const validateTaskId = (req, res, next) => {
    const taskId = parseInt(req.params.id, 10);
    if (Number.isNaN(taskId)) {
        return res.status(400).send({ err: "Task ID should be a number" });
    }
    req.taskId = taskId; // attach parsed ID to request
    next();
}

function validateTaskBody(required = true) {
    return (req, res, next) => {
        const { title, description, completed } = req.body;

        if (!required && title === undefined && description === undefined && completed === undefined) {
            return res.status(400).send({ err: "At least one field must be provided" });
        }

        if (title !== undefined) {
            if (typeof title !== "string" || title.trim() === "") {
                return res.status(400).send({ err: "Title must be a non-empty string" });
            }
        }

        if (description !== undefined) {
            if (typeof description !== "string" || description.trim() === "") {
                return res.status(400).send({ err: "Description must be a non-empty string" });
            }
        }

        if (completed !== undefined) {
            if (typeof completed !== "boolean") {
                return res.status(400).send({ err: "Completed must be a boolean" });
            }
        }

        next();
    };
}

module.exports = {
    validateTaskId,
    validateTaskBody,
}