export function doCodeFormat(langauge) {
  langauge = langauge.toLowerCase();
  console.log("Langauge for Formatting is  " + langauge);
  let mycode;
  const preElements = document.querySelectorAll(".CodeMirror-code pre");
  preElements.forEach((preElement) => {
    preElement = preElement.textContent;
    if (preElement === "\u200b") preElement = "";

    if (
      langauge === "cpp" ||
      langauge === "java" ||
      langauge === "javascript"
    ) {
      preElement = preElement.trim();
      preElement = preElement.replace(/"/g, '\\"');
      preElement = preElement.replace(/'/g, "\\'");
      // console.log(preElement);

      // if (!preElement.endsWith(";") && preElement !== "") {
      preElement += " \\n ";
      // }
      mycode += preElement;
    } else if (langauge === "python3") {
      preElement = preElement.trimEnd();
      // preElement = preElement.replace(/\s+$/g, "");
      preElement = preElement.replace(/"/g, '\\"');
      preElement = preElement.replace(/'/g, "\\'");
      preElement += "\\n";
      console.log(preElement);
      mycode += preElement;
    }
  });
  mycode = mycode.substring(9);
  console.log("Mycode is in " + mycode);
  console.log("Returning myCode");
  return mycode;
}

export function getOptionsForCompilationAPI(langauge, userInput) {
  langauge = langauge.toLowerCase();
  let formattedCode = doCodeFormat(langauge);
  console.log("Given userInput is : " + userInput);
  if (userInput === undefined) {
    userInput = null;
  } else {
    userInput = userInput.replace(/\n/g, " ");
    userInput = '"' + userInput + '"';
  }
  console.log("Printing user Input :" + userInput);
  const options = {
    method: "POST",
    headers: {
      "content-type": "application/json",
      // "X-RapidAPI-Key": "3e36b55b3dmshbc37e0d7902dffep1148ebjsn22b47a5d302e",
      "X-RapidAPI-Key": "4431148801mshf778f084d5b5abap185ce1jsn4f16709c0488",
      "X-RapidAPI-Host": "online-code-compiler.p.rapidapi.com",
    },
    body: `{"language":"${langauge}","version":"latest", "code":"${formattedCode}","input":${userInput} }`,
    // body: `{ "code":"#include<iostream> \\n using namespace std; int main(){cout<<\\"Hellkjkjo, World!\\";}","version":"latest"}`,
  };
  return options;
}
