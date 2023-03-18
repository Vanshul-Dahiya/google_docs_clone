import { Server } from "socket.io";

const PORT = 9000;

// allow cors
const io = new Server(PORT, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  socket.on("send-changes", (delta) => {
    // broadcast all changes to frontend , to all users
    socket.broadcast.emit("receive-changes", delta);
  });
});
