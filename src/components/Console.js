import { useEffect, useRef, useState } from "react";
import { getOptionsForCompilationAPI } from "../utils/utilFunctions";
import Spinner from "./Spinner";
import ACTIONS from "../Actions";
const Console = ({ socketRef, roomId }) => {
  const [langauge, setLangauge] = useState("cpp");
  const [isLoading, setIsLoading] = useState(false);
  const [userInput, setUserInput] = useState();
  const [output, setOutput] = useState("Output will be shown here...");
  useEffect(() => {
    if (socketRef.current) {
      console.log("Emit done bro");
      socketRef.current.emit(ACTIONS.OUTPUT_CHANGE, { roomId, output });
    }
  }, [isLoading]);

  useEffect(() => {
    if (socketRef.current) {
      console.log("Output Reicieved");
      socketRef.current.on(ACTIONS.OUTPUT_CHANGE, ({ output }) => {
        console.log("value is : " + output);
        setOutput(output);
      });
    }
  }, [socketRef.current]);

  const compileAndRun = async () => {
    setIsLoading(true);
    if (userInput === "") userInput = null;
    console.log("Getting options from api call");
    const options = getOptionsForCompilationAPI(langauge, userInput);
    console.log("Making ans api call");
    fetch("https://online-code-compiler.p.rapidapi.com/v1/", options)
      .then((response) => response.json())
      .then((response) => {
        console.log(response);
        setOutput(response.output);
        setIsLoading(false);
      })
      .catch((err) => console.error(err));
  };

  return (
    <>
      <div id="bottom">
        <textarea
          name=""
          value={output}
          disabled
          id="console"
          cols="10"
          rows="8"
        ></textarea>
        <textarea
          id="user-input"
          name=""
          placeholder="Enter your input here"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          cols="10"
          rows="8"
        ></textarea>
        <div className="output-aside">
          <select
            id="language"
            value={langauge}
            onChange={(e) => {
              console.log(e.target.value);
              setLangauge(e.target.value);
            }}
          >
            <option value="cpp">CPP</option>
            <option value="java">Java</option>
            <option value="python3">Python</option>
            <option value="javascript">JavaScript</option>
            <option value="ruby">Ruby</option>
          </select>
          {isLoading ? (
            <Spinner />
          ) : (
            <button className="run-btn btn" onClick={compileAndRun}>
              Compile and Run
            </button>
          )}
        </div>
      </div>
    </>
  );
};

export default Console;
