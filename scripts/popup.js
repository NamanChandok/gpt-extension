const modeDefault = document.getElementById("mode_default");
const modeDevelopment = document.getElementById("mode_development");
const modeAcademic = document.getElementById("mode_academic");
const modeFun = document.getElementById("mode_fun");
const apiInput = document.getElementById("api_key");

apiInput.addEventListener("blur", async (e) => {
  const apiKey = e.target.value;
  await chrome.storage.sync.set({ apiKey });
});

modeDefault.addEventListener("click", () => {
  console.log("Default mode selected. This mode is suitable for general use.");
  chrome.storage.sync.set({ mode: "default" });
  modeDevelopment.checked = false;
  modeAcademic.checked = false;
  modeFun.checked = false;
});

modeDevelopment.addEventListener("click", () => {
  console.log(
    "Development mode selected. This mode is suitable for developers.",
  );
  chrome.storage.sync.set({ mode: "development" });
  modeDefault.checked = false;
  modeAcademic.checked = false;
  modeFun.checked = false;
});

modeAcademic.addEventListener("click", () => {
  chrome.storage.sync.set({ mode: "academic" });
  modeDefault.checked = false;
  modeDevelopment.checked = false;
  modeFun.checked = false;
});

modeFun.addEventListener("click", () => {
  chrome.storage.sync.set({ mode: "fun" });
  modeDefault.checked = false;
  modeDevelopment.checked = false;
  modeAcademic.checked = false;
});

chrome.storage.sync.get(["mode"], (data) => {
  const mode = data.mode || "default";
  if (mode === "default") {
    modeDefault.checked = true;
  } else if (mode === "development") {
    modeDevelopment.checked = true;
  } else if (mode === "academic") {
    modeAcademic.checked = true;
  } else if (mode === "fun") {
    modeFun.checked = true;
  }
});
