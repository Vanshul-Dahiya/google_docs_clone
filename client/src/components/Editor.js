import React from "react";

import { useEffect, useState } from "react";

import Quill from "quill";
import "quill/dist/quill.snow.css";

import { Box } from "@mui/material";
import styled from "@emotion/styled";

import { io } from "socket.io-client";

import { useParams } from "react-router-dom";

const Component = styled.div`
  background: #f5f5f5;
`;

const toolbarOptions = [
  ["bold", "italic", "underline", "strike"], // toggled buttons
  ["blockquote", "code-block"],

  [{ header: 1 }, { header: 2 }], // custom button values
  [{ list: "ordered" }, { list: "bullet" }],
  [{ script: "sub" }, { script: "super" }], // superscript/subscript
  [{ indent: "-1" }, { indent: "+1" }], // outdent/indent
  [{ direction: "rtl" }], // text direction

  [{ size: ["small", false, "large", "huge"] }], // custom dropdown
  [{ header: [1, 2, 3, 4, 5, 6, false] }],

  [{ color: [] }, { background: [] }], // dropdown with defaults from theme
  [{ font: [] }],
  [{ align: [] }],

  ["clean"], // remove formatting button
];

const Editor = () => {
  const [socket, setSocket] = useState();
  const [quill, setQuill] = useState();
  const { id } = useParams();

  // useEffect will run only once , when component initializes
  useEffect(() => {
    const quillServer = new Quill("#container", {
      theme: "snow",
      modules: { toolbar: toolbarOptions },
    });
    quillServer.disable();
    quillServer.setText("Loading the document ... ");
    setQuill(quillServer);
  }, []);

  // make a connection with backend and call it
  useEffect(() => {
    const socketServer = io("http://localhost:9000");
    setSocket(socketServer);

    // when component unmounts , disconnect server
    return () => {
      socketServer.disconnect();
    };
  }, []);

  // detect changes and send to backend
  useEffect(() => {
    if (socket === null || quill === null) return;

    // delta stores changes
    const handleChange = (delta, oldData, source) => {
      if (source !== "user") return;

      // user's changes detected then-> send changes
      socket && socket.emit("send-changes", delta);
    };

    quill && quill.on("text-change", handleChange);

    return () => {
      quill && quill.off("text-change", handleChange);
    };
  }, [quill, socket]);

  // receive broadcast from backend
  useEffect(() => {
    if (socket === null || quill === null) return;

    const handleChange = (delta) => {
      // socket is sending changes, update them with help of quill
      quill.updateContents(delta);
    };

    socket && socket.on("receive-changes", handleChange);

    return () => {
      socket && socket.off("receive-changes", handleChange);
    };
  }, [quill, socket]);

  // document loading , quill enabling
  useEffect(() => {
    if (quill === null || socket === null) return;

    // once document loads -
    socket &&
      socket.once("load-document", (document) => {
        quill && quill.setContents(document);
        quill && quill.enable();
      });

    // fetch document and id
    socket && socket.emit("get-document", id);
  }, [quill, socket, id]);

  // save data (document)
  useEffect(() => {
    if (quill === null || socket === null) return;

    // always unmount setInterval
    const interval = setInterval(() => {
      socket && socket.emit("save-document", quill.getContents());
    }, 2000);

    return () => {
      clearInterval(interval);
    };
  }, [socket, quill]);

  return (
    <Component>
      <Box className="container" id="container"></Box>
    </Component>
  );
};

export default Editor;
