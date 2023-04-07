import React, { useEffect, useRef, useState } from "react";
import Codemirror from "codemirror";
import "codemirror/lib/codemirror.css";
import "codemirror/theme/dracula.css";
import "codemirror/mode/javascript/javascript";
import "codemirror/addon/edit/closetag";
import "codemirror/addon/edit/closebrackets";
import "codemirror/addon/hint/anyword-hint";
import "codemirror/addon/hint/show-hint";
// import "codemirror/keymap/sublime";

import Console from "./Console";
import ACTIONS from "../Actions";

const Editor = ({ socketRef, roomId, onCodeChange }) => {
  const editorRef = useRef(null);

  useEffect(() => {
    console.log("Calling useEffect ININT");

    async function init() {
      //(BUG)->Necessery condtiton coz editor getting duplicated
      if (editorRef.current === null) {
        editorRef.current = Codemirror.fromTextArea(
          document.getElementById("realtimeEditor"),
          {
            // mode: "text/x-c++src",
            mode: { name: "javascript", json: true },
            theme: "dracula",
            autoCloseTags: true,
            autoCloseBrackets: true,
            lineNumbers: true,
            autofocus: true,
            showCursorWhenSelecting: true,
            indentUnit: 4,
            extraKeys: {
              "Ctrl-Space": "autocomplete",
              // "Ctrl-Space": function (cm) {
              //   const suggestions = Codemirror.hint.anyword(cm);
              //   Codemirror.showHint(cm, Codemirror.hint.anyword);
              //   console.log(suggestions);
              // },
            },

            hintOptions: {
              completeOnSingleClick: true,
              closeOnUnfocus: false,
            },
          }
        );
      }

      editorRef.current.on("keyup", function (cm, event) {
        const cur = cm.getCursor();
        const token = cm.getTokenAt(cur);
        const currentWord = token.string.trim();
        console.log("currentWord is : " + currentWord);
        if (
          !cm.state.completionActive &&
          event.keyCode != 13 &&
          event.keyCode != 27 &&
          event.keyCode != 16 &&
          event.keyCode != 17 &&
          event.keyCode != 18 &&
          event.keyCode != 20 &&
          currentWord.length >= 2
        ) {
          cm.showHint({ hint: Codemirror.hint.anyword });
        }
      });
      editorRef.current.on("change", (instance, changes) => {
        const { origin } = changes;
        const code = instance.getValue();
        onCodeChange(code);
        if (origin !== "setValue") {
          const cursorPosition = editorRef.current.getCursor();

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
        if (editorRef.current && code !== null) {
          editorRef.current.setValue(code);
          if (cursorPosition.line)
            editorRef.current.setCursor({
              line: cursorPosition.line,
              ch: cursorPosition.ch,
            });

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
