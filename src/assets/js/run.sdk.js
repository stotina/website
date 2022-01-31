/* eslint-disable */

let appended = false;

export async function loadRunSdk() {
  for (let i = 0; i < 30; i++) {
    if (!window.Run) {
      if (!appended) {
        appended = true;
        const scr = document.createElement("script");
        scr.src = "/js/run-sdk/dist/run.browser.min.js"
        document.getElementsByTagName("body")[0].appendChild(scr);
      } else {
        console.log("waiting 1s for Run SDK to load...");
        await new Promise((resolve) => setTimeout(() => resolve(), 1000));
      }
    }
  }

  if (!window.Run) {
    throw new Error(
      "Please import Run-SDK from '/js/run-sdk/dist/run.browser.min.js'..."
    );
  }

  return window.Run;
}
