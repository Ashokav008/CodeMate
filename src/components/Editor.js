import React, { useEffect, useRef, useState } from "react";
import Codemirror from "codemirror";
import "codemirror/lib/codemirror.css";
import "codemirror/theme/dracula.css";
import "codemirror/mode/javascript/javascript";
import "codemirror/addon/edit/closetag";
import "codemirror/addon/edit/closebrackets";
import Console from "./Console";
import ACTIONS from "../Actions";

const Editor = ({ socketRef, roomId, onCodeChange }) => {
  const editorRef = useRef(null);

  useEffect(() => {
    console.log("Calling useEffect ININT");

    async function init() {
      // this if conciton is because the editor gettign rendered multiple times and that is causing too many issues
      if (editorRef.current === null) {
        editorRef.current = Codemirror.fromTextArea(
          document.getElementById("realtimeEditor"),
          {
            mode: { name: "javascript", json: true },
            // mode: "text/x-c++src",
            theme: "dracula",
            autoCloseTags: true,
            autoCloseBrackets: true,
            lineNumbers: true,
          }
        );
      }

      editorRef.current.on("change", (instance, changes) => {
        const { origin } = changes;
        const code = instance.getValue();
        onCodeChange(code);
        if (origin !== "setValue") {
          const cursorPosition = editorRef.current.getCursor();
          // const cursorPosition = `Line: ${cursor.line}, Character: ${cursor.ch}`;
          // console.log("Position is : " + cursorPosition);
          // console.log("sending the output from Sender");
          socketRef.current.emit(ACTIONS.CODE_CHANGE, {
            roomId,
            code,
            cursorPosition,
          });
        }
      });
    }
    init();
  }, []);

  useEffect(() => {
    if (socketRef.current) {
      socketRef.current.on(ACTIONS.CODE_CHANGE, ({ code, cursorPosition }) => {
        if (code !== null) {
          editorRef.current.setValue(code);

          editorRef.current.setCursor({
            line: cursorPosition.line,
            ch: cursorPosition.ch,
          });
          // editorRef.current.scrollTo(
          //   null,
          //   editorRef.current.charCoords(
          //     { line: cursorPosition.line, ch: cursorPosition.ch },
          //     "local"
          //   ).top
          // );
          editorRef.current.focus();
        }
      });
    }

    return () => {
      socketRef.current.off(ACTIONS.CODE_CHANGE);
    };
  }, [socketRef.current]);

  return (
    <>
      <textarea id="realtimeEditor"></textarea>
      <Console socketRef={socketRef} roomId={roomId} />
    </>
  );
};

export default Editor;
