import { Server } from "socket.io";

import Connection from "./database/db.js";

import {
  getDocument,
  updateDocument,
} from "./controller/documentController.js";

const PORT = 9000;

Connection();

// allow cors
const io = new Server(PORT, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  // broadcast changes to a particular document id
  socket.on("get-document", async (documentId) => {
    const document = await getDocument(documentId);

    socket.join(documentId);
    socket.emit("load-document", document.data);

    socket.on("send-changes", (delta) => {
      // broadcast all changes to frontend , to all users
      socket.broadcast.to(documentId).emit("receive-changes", delta);
    });

    socket.on("save-document", async (data) => {
      await updateDocument(documentId, data);
    });
  });
});
