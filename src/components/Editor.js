import React, { useEffect, useRef, useState } from "react";
import Codemirror from "codemirror";
import "codemirror/lib/codemirror.css";
import "codemirror/theme/dracula.css";
import "codemirror/mode/javascript/javascript";
import "codemirror/addon/edit/closetag";
import "codemirror/addon/edit/closebrackets";
// import options from "../utils/options";
import ACTIONS from "../Actions";

function doQuatotaion(string) {}

const Editor = ({ socketRef, roomId, onCodeChange }) => {
  const editorRef = useRef(null);
  const [code, setCode] = useState("");
  const [output, setOutput] = useState("Output will be shown here");
  useEffect(() => {
    async function init() {
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

      editorRef.current.on("change", (instance, changes) => {
        const { origin } = changes;
        const code = instance.getValue();
        onCodeChange(code);
        if (origin !== "setValue") {
          socketRef.current.emit(ACTIONS.CODE_CHANGE, {
            roomId,
            code,
          });
        }
      });
    }
    init();
  }, []);

  useEffect(() => {
    if (socketRef.current) {
      socketRef.current.on(ACTIONS.CODE_CHANGE, ({ code }) => {
        if (code !== null) {
          editorRef.current.setValue(code);
        }
      });
    }

    return () => {
      socketRef.current.off(ACTIONS.CODE_CHANGE);
    };
  }, [socketRef.current]);

  const compileAndRun = async () => {
    const preElements = document.querySelectorAll(".CodeMirror-code pre");
    let mycode;
    preElements.forEach((preElement) => {
      preElement = preElement.textContent;
      preElement = preElement.trim();
      preElement = preElement.replace(/"/g, '\\"');
      if (!preElement.endsWith(";")) preElement += " \\n ";
      mycode += preElement;
      mycode += " ";
    });
    mycode = mycode.substring(9);
    // setCode(mycode);
    const options = {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "X-RapidAPI-Key": "3e36b55b3dmshbc37e0d7902dffep1148ebjsn22b47a5d302e",
        "X-RapidAPI-Host": "cpp-17-code-compiler.p.rapidapi.com",
      },
      body: `{ "code":"${mycode}","version":"latest"}`,
      // body: `{ "code":"#include<iostream> \\n using namespace std; int main(){cout<<\\"Hellkjkjo, World!\\";}","version":"latest"}`,
    };
    //SOME NECESSERY CHECKS FOR THE BODY PART
    //1-> \n ==\\n
    //2->

    fetch("https://cpp-17-code-compiler.p.rapidapi.com/", options)
      .then((response) => response.json())
      .then((response) => {
        console.log(response);
        setOutput(response.output);
      })
      .catch((err) => console.error(err));
  };

  return (
    <>
      <textarea id="realtimeEditor"></textarea>
      {console.log(code)}
      <div id="bottom">
        <textarea
          name=""
          value={output}
          id="console"
          cols="10"
          rows="8"
        ></textarea>
        <div className="output-aside">
          <button className="btn">Output </button>
          <button className="run-btn btn" onClick={compileAndRun}>
            Compile and Run Code
          </button>
        </div>
      </div>
    </>
  );
};

export default Editor;
