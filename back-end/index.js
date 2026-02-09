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
const chatRouter = require("./Routes/ChatRoute");

// Database connect
database.connect();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(
  cors({
    origin: ["http://localhost:5173"],
    credentials: true,
  }),
);

// Routes
app.use("/api/auth", userRouter);
app.use("/api/project", projectRouter);
app.use("/api/task", taskRouter);
app.use("/api/team", teamRouter);
app.use("/api/chat", chatRouter);

app.get("/", (req, res) => {
  res.send("API is running...");
});

// Socket.IO setup
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173"],
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// Chat model
const Chat = require("./Models/Chat");

// Socket.IO connection
io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("setup", (userId) => {
    socket.join(userId);
    console.log("User joined private room:", userId);
  });

  socket.on("joinChat", (roomId) => {
    socket.join(roomId);
    console.log(`User joined room: ${roomId}`);
  });

  socket.on("joinProject", (projectId) => {
    socket.join(projectId);
    console.log(`Socket joined project room: ${projectId}`);
  });

  socket.on("joinTeam", (teamId) => {
    socket.join(teamId);
    console.log(`Socket joined team room: ${teamId}`);
  });

  socket.on(
    "sendMessage",
    async ({ projectId, teamId, receiverId, message, senderId }) => {
      try {
        const msgData = {
          content: message,
          sender: senderId,
          projectId,
          teamId,
          receiverId,
        };

        const savedMessage = await Chat.create(msgData);
        const populated = await savedMessage.populate("sender", "name email");

        const responseData = {
          _id: populated._id,
          sender: {
            _id: populated.sender._id,
            name: populated.sender.name,
          },
          content: populated.content,
          projectId,
          teamId,
          receiverId,
          timestamp: populated.timestamp,
        };
        io.to(room).emit("receiveMessage", responseData);

        if (receiverId) {
          io.to(receiverId).to(senderId).emit("receiveMessage", responseData);
        } else {
          const room = projectId || teamId;
          io.to(room).emit("receiveMessage", responseData);
        }
      } catch (err) {
        console.error("Socket sendMessage error:", err);
      }
    },
  );
  socket.on("disconnect", () => console.log("User disconnected:"));
});

server.listen(PORT, () => {
  console.log(`App is running at ${PORT}`);
});
