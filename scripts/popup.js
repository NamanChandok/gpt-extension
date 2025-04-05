const modeDefault = document.getElementById("mode_default");
const modeDevelopment = document.getElementById("mode_development");
const modeAcademic = document.getElementById("mode_academic");
const modeFun = document.getElementById("mode_fun");

modeDefault.addEventListener("click", () => {
  chrome.storage.sync.set({ mode: "default" });
  modeDevelopment.checked = false;
  modeAcademic.checked = false;
  modeFun.checked = false;
});

modeDevelopment.addEventListener("click", () => {
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
