const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const z = require("zod");
dotenv.config({ path: "./.env" });
const { User, Task } = require("./db");
const { registerSchema, loginSchema, taskSchema } = require("./types");
const app = express();
const port = 3000;

const saltRounds = 10;

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

// sign up
app.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

  const isValidInfo = registerSchema.safeParse(req.body);

  if (!isValidInfo.success) {
    return res.status(400).json({
      message: "Invalid credentials",
    });
  }

  const userExists = await User.findOne({ email });
  if (userExists) {
    return res.json({
      message: "user already exists",
    });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const newUser = await User.create({
      name,
      email,
      hashedPassword,
    });

    return res.json({
      message: "User saved to db",
    });
  } catch (error) {
    return res.json({ message: "failed to save user to db" });
  }
});
// login
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const isValidInfo = loginSchema.safeParse(req.body);

  if (!isValidInfo.success) {
    return res.status(400).json({
      message: "Invalid credentials",
    });
  }

  const userExists = await User.findOne({ email });

  if (!userExists) {
    return res.json({ message: "User not registered" });
  }

  try {
    const passwordsMatch = await bcrypt.compare(
      password,
      userExists.hashedPassword
    );

    if (!passwordsMatch) {
      throw new Error("passwords do not match");
    }

    const token = jwt.sign({ userId: userExists._id }, process.env.JWT_SECRET);

    return res.json({ token });
  } catch (error) {
    return res.json({ message: "failed to save user to db" });
  }
});

function verifyUser(req, res, next) {
  const { token } = req.headers;

  try {
    const decodedUser = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decodedUser.userId;
    next();
  } catch (error) {
    return res.status(403).json({ message: "unauthorized" });
  }
}

app.get("/verify", (req, res) => {
  try {
    const userId = req;
    if (!userId) {
      return res.status(403).json({
        message: "Unauthorized",
      });
    }

    return res.json({
      message: "Authorized",
    });
  } catch (error) {
    return res.status(403).json({
      message: "Unauthorized",
    });
  }
});

//tasks
app.post("/tasks", verifyUser, async (req, res) => {
  const { description, isCompleted } = req.body;

  const isValidTaskDetails = taskSchema.safeParse(req.body);

  if (!isValidTaskDetails.success) {
    return res.status(400).json({
      message: "Please provide correct details",
    });
  }

  try {
    const newTask = await Task.create({
      description,
      isCompleted,
      createdBy: req.userId,
    });

    if (newTask) {
      return res.json({
        message: "Task created successfully",
      });
    }
  } catch (error) {
    return res.json({
      message: "failed to create task",
    });
  }
});

app.get("/tasks", verifyUser, async (req, res) => {
  try {
    const userTasks = await Task.find({
      createdBy: req.userId,
    });
    return res.json(userTasks);
  } catch (error) {
    return res.json({
      message: "Failed to get user tasks",
    });
  }
});

app.put("/tasks/:id", verifyUser, async (req, res) => {
  const taskId = req.params.id;

  const isValidTaskDetails = taskSchema.safeParse(req.body);

  if (!isValidTaskDetails.success) {
    return res.status(400).json({
      message: "Please provide correct details",
    });
  }

  const { description, isCompleted } = req.body;

  try {
    await Task.findByIdAndUpdate(
      taskId,
      { description, isCompleted, createdBy: req.userId },
      {
        new: true,
      }
    );

    return res.status(210).json({
      message: "updated task",
    });
  } catch (error) {
    return res.status(400).json({
      message: "Error updating task",
    });
  }
});

app.delete("/tasks/:id", verifyUser, async (req, res) => {
  const taskId = req.params.id;

  try {
    const taskToDelete = await Task.findById({ _id: taskId });
    if (!taskToDelete) {
      return res.json({
        message: "Cannot find task",
      });
    }
    await Task.findByIdAndDelete(taskId);

    return res.json({
      message: "Task deleted",
    });
  } catch (error) {
    return res.json({
      message: "Error deleting task",
    });
  }
});

app.listen(port, async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log(`Example app listening on port ${port}`);
  } catch (error) {
    console.log(error);
  }
});
