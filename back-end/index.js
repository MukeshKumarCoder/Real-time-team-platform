const express = require("express");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 4000;
const database = require("./Configs/db");

const userRouter = require("./Routes/AuthRoutes");
const projectRouter = require("./Routes/ProjectRoutes");
const taskRouter = require("./Routes/TaskRoutes");

//database connect
database.connect();

app.use(cors());
app.use(express.json());

app.use("/api/users", userRouter);
app.use("/api/projects", projectRouter);
app.use("/api/task", taskRouter);

app.get("/", (req, res) => {
  res.send("API is running...");
});

app.listen(PORT, () => {
  console.log(`App is running at ${PORT}`);
});
