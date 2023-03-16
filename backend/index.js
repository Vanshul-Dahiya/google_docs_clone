import { Server } from "socket.io";

const PORT = 9000;

// allow cors
const io = new Server(PORT, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {});
