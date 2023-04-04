export function doCodeFormat(langauge) {
  langauge = langauge.toLowerCase();
  console.log("Langauge for Formatting is  " + langauge);
  let mycode;
  const preElements = document.querySelectorAll(".CodeMirror-code pre");
  preElements.forEach((preElement) => {
    preElement = preElement.textContent;
    if (preElement === "\u200b") return;
    if (langauge === "cpp" || langauge === "java") {
      preElement = preElement.trim();
      preElement = preElement.replace(/"/g, '\\"');
      console.log(preElement);

      if (!preElement.endsWith(";") && preElement !== "") {
        preElement += " \\n ";
      }
      mycode += preElement;
    }
  });
  mycode = mycode.substring(9);

  return mycode;
}

export function getOptionsForCompilationAPI(langauge) {
  langauge = langauge.toLowerCase();
  let formattedCode = doCodeFormat(langauge);

  const options = {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "X-RapidAPI-Key": "3e36b55b3dmshbc37e0d7902dffep1148ebjsn22b47a5d302e",
      "X-RapidAPI-Host": "online-code-compiler.p.rapidapi.com",
    },
    body: `{"language":"${langauge}","version":"latest", "code":"${formattedCode}","input":null}`,
    // body: `{ "code":"#include<iostream> \\n using namespace std; int main(){cout<<\\"Hellkjkjo, World!\\";}","version":"latest"}`,
  };
  return options;
}
