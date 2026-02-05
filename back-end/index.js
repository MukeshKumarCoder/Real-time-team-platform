const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 4000;
const database = require("./Configs/db");

const userRouter = require("./Routes/AuthRoutes");
const projectRouter = require("./Routes/ProjectRoutes");
const taskRouter = require("./Routes/TaskRoutes");
const teamRouter = require("./Routes/TeamRoute");
const chatRouter = require("./Routes/ChatRoute"); // new chat route

// Database connect
database.connect();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

// Routes
app.use("/api/auth", userRouter);
app.use("/api/projects", projectRouter);
app.use("/api/task", taskRouter);
app.use("/api/team", teamRouter);
app.use("/api/chat", chatRouter);

app.get("/", (req, res) => {
  res.send("API is running...");
});

// Socket.IO setup
const io = new Server(server, {
  cors: { origin: "http://localhost:5173", methods: ["GET", "POST"] },
});

const Chat = require("./Models/Chat");

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("joinProject", (projectId) => {
    socket.join(projectId);
    console.log(`Socket ${socket.id} joined project ${projectId}`);
  });

  socket.on("joinTeam", (teamId) => {
    socket.join(teamId);
    console.log(`Socket ${socket.id} joined team ${teamId}`);
  });

  socket.on("sendMessage", async ({ projectId, teamId, message, senderId }) => {
    try {
      const msgData = { content: message, sender: senderId };
      if (projectId) msgData.projectId = projectId;
      if (teamId) msgData.teamId = teamId;

      const savedMessage = await Chat.create(msgData);
      const populated = await savedMessage.populate("sender", "name email");

      const roomId = projectId || teamId;
      io.to(roomId).emit("receiveMessage", {
        message: populated.content,
        sender: populated.sender.name,
        timestamp: populated.timestamp,
      });
    } catch (err) {
      console.error("Socket sendMessage error:", err);
    }
  });

  socket.on("disconnect", () => console.log("User disconnected:", socket.id));
});

server.listen(PORT, () => {
  console.log(`App is running at ${PORT}`);
});
